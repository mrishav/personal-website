/**
 * Hero agent
 * Sends a question to the /ask function and streams the answer back into the
 * hero, driving the illustration's state while it works.
 */
(function () {
  const ENDPOINT = '/.netlify/functions/ask';

  /*
   * Per-visitor question cap.
   *
   * This is a courtesy guardrail, not security: anyone can clear localStorage or
   * open a private window. It exists so a curious visitor doesn't run up the
   * bill by idly hammering the box. The server enforces its own per-IP limits,
   * and the Anthropic Console spend cap is the actual ceiling.
   */
  const QUESTION_CAP = 10;
  const STORE_KEY = 'agentQuestionCount';
  const REQUEST_TIMEOUT_MS = 30_000;

  // Local dev is uncapped so testing doesn't lock you out of your own site.
  const IS_LOCAL = ['localhost', '127.0.0.1', '::1'].includes(location.hostname);

  function usage() {
    // Local date, not toISOString(): that is UTC, so the cap would reset
    // mid-afternoon for anyone west of Greenwich.
    const d = new Date();
    const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      return raw.date === today ? raw : { date: today, count: 0 };
    } catch {
      return { date: today, count: 0 };
    }
  }

  function bumpUsage() {
    const u = usage();
    u.count += 1;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(u)); } catch { /* private mode */ }
    return u.count;
  }

  function capReached() {
    if (IS_LOCAL) return false;
    return usage().count >= QUESTION_CAP;
  }

  // The state element wraps both the character and the answer panel.
  const stage = document.getElementById('agentStage');
  const form = document.getElementById('agentForm');
  const input = document.getElementById('agentInput');
  const submit = document.getElementById('agentSubmit');
  const answer = document.getElementById('agentAnswer');
  const answerText = document.getElementById('agentAnswerText');

  if (!stage || !form || !input || !answerText) return;

  let inFlight = false;

  function setState(state) {
    stage.dataset.state = state;
  }

  function setBusy(busy) {
    inFlight = busy;
    input.disabled = busy;
    submit.disabled = busy;
  }

  function showAnswer(text, isError) {
    answer.hidden = false;
    answerText.textContent = text;
    answerText.classList.toggle('is-error', Boolean(isError));
  }

  async function ask(question) {
    if (inFlight || !question.trim()) return;

    if (capReached()) {
      showAnswer(
        "That's the question limit for today. Email rishavmitrasaab@gmail.com and Rishav will answer directly.",
        true
      );
      setBusy(true);
      return;
    }

    setBusy(true);
    setState('thinking');
    // Reveal the panel immediately; CSS shows typing dots while state is
    // "thinking" and swaps to the text once the first token lands.
    answer.hidden = false;
    answerText.textContent = '';
    answerText.classList.remove('is-error');

    // Without this, a function that never responds leaves the UI stuck in
    // "thinking" with the input disabled and no way out but a reload.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let succeeded = false;

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
        signal: controller.signal
      });

      // 429 carries a human-readable reason from the server; show it as-is
      // rather than the generic failure message.
      if (res.status === 429) {
        const reason = await res.text().catch(() => '');
        showAnswer(reason || 'Too many questions right now. Try again shortly.', true);
        return;
      }

      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        throw new Error(detail || `Request failed (${res.status})`);
      }

      // The function streams plain text chunks as they arrive.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let firstChunk = true;
      let acc = '';

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        if (firstChunk) {
          setState('answering');
          firstChunk = false;
        }

        acc += decoder.decode(value, { stream: true });
        answerText.textContent = acc;
      }

      acc += decoder.decode();
      answerText.textContent = acc;

      if (!acc.trim()) {
        showAnswer("I didn't get a response that time. Try again?", true);
      } else {
        // Charged here, not before the fetch: a network failure or a 429
        // should not cost the visitor one of their questions.
        bumpUsage();
        succeeded = true;
      }
    } catch (err) {
      showAnswer(
        err.name === 'AbortError'
          ? "That took too long. Try again, or email rishavmitrasaab@gmail.com."
          : "Something went wrong reaching the agent. Email me at rishavmitrasaab@gmail.com and I'll answer directly.",
        true
      );
      console.error('[agent]', err);
    } finally {
      clearTimeout(timeout);
      setBusy(false);
      setState('idle');
      // Keep the question on failure so it doesn't have to be retyped.
      if (succeeded) input.value = '';
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    ask(input.value);
  });

}());
