/**
 * Per-IP rate limiting backed by Netlify Blobs.
 *
 * Why Blobs and not a Map: function instances are ephemeral. A module-level
 * Map resets on every cold start (verified locally: every invocation got a
 * fresh instance), so an in-memory counter never actually limits anything.
 * Blobs gives shared state across instances.
 *
 * Concurrency: read-modify-write is not atomic, so writes use `onlyIfMatch`
 * against the etag we read. If another request wrote first, our write is
 * rejected and we retry. After the retries are exhausted we ALLOW the request
 * rather than block it: a lost race should not lock a real visitor out, and
 * the hard cost ceiling is the Anthropic Console spend cap regardless.
 */
import { getStore } from '@netlify/blobs';

const STORE_NAME = 'agent-rate-limits';

export const BURST_WINDOW_MS = 60_000;
export const BURST_MAX = 5;
export const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;
export const DAILY_MAX = 25;

const MAX_RETRIES = 3;

// Never let the limiter itself take down the endpoint.
function openOnFailure(err, where) {
  console.error(`[ratelimit] ${where} failed, allowing request`, err);
  return { blocked: false, degraded: true };
}

export async function checkLimit(ip) {
  // No limits against your own machine. `netlify dev` sets NETLIFY_DEV; it is
  // never set on a deployed build, so production always enforces.
  if (process.env.NETLIFY_DEV === 'true') {
    return { blocked: false, skipped: 'local-dev' };
  }

  let store;
  try {
    // Strong consistency matters here: the default is eventual, and a stale
    // read would let the compare-and-swap below succeed against data that is
    // already out of date, quietly under-counting requests.
    store = getStore({ name: STORE_NAME, consistency: 'strong' });
  } catch (err) {
    return openOnFailure(err, 'getStore');
  }

  const key = `ip:${ip}`;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let existing = null;
    try {
      existing = await store.getWithMetadata(key, { type: 'json' });
    } catch (err) {
      return openOnFailure(err, 'read');
    }

    const now = Date.now();
    const previous = Array.isArray(existing?.data) ? existing.data : [];
    const times = previous.filter(t => typeof t === 'number' && now - t < DAILY_WINDOW_MS);

    if (times.length >= DAILY_MAX) {
      return {
        blocked: true,
        message:
          "That's a lot of questions for one day. Email rishavmitrasaab@gmail.com and Rishav will answer directly."
      };
    }

    if (times.filter(t => now - t < BURST_WINDOW_MS).length >= BURST_MAX) {
      return { blocked: true, message: 'Slow down a second, then try again.' };
    }

    times.push(now);

    try {
      const result = existing?.etag
        ? await store.setJSON(key, times, { onlyIfMatch: existing.etag })
        : await store.setJSON(key, times, { onlyIfNew: true });

      if (result.modified) return { blocked: false, count: times.length };
      // Lost the race; re-read and try again.
    } catch (err) {
      return openOnFailure(err, 'write');
    }
  }

  console.warn('[ratelimit] exhausted retries under contention, allowing request');
  return { blocked: false, degraded: true };
}
