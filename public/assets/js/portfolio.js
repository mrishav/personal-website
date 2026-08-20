/**
 * Personal Website Interactive Features
 * Author: Rishav Mitra
 * Description: Scroll indicator, smooth scrolling, and accessibility helpers.
 */

// ========================================
// SCROLL INDICATOR
// ========================================

/**
 * Drives the scroll progress bar at the top of the page.
 * rAF-throttled: scroll fires far more often than the screen repaints.
 */
function initScrollIndicator() {
  const indicator = document.getElementById('scrollIndicator');
  if (!indicator) return;

  let ticking = false;

  function paint() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    // Guard against divide-by-zero on pages shorter than the viewport
    const percent = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
    indicator.style.width = percent + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(paint);
      ticking = true;
    }
  }, { passive: true });

  paint();
}

// ========================================
// MOBILE TOUCH INTERACTIONS
// ========================================

/**
 * Adds ripple feedback for touch interactions on mobile devices.
 * The `ripple` class doubles as an "already wired" marker, so repeated
 * calls on resize don't stack duplicate listeners.
 */
function addRippleEffect() {
  if (window.innerWidth > 768) return;

  document.querySelectorAll('.nav-link, .hi-btn, .social-nav a, .card-single, .project-text').forEach(el => {
    if (el.classList.contains('ripple')) return;
    el.classList.add('ripple');

    el.addEventListener('touchstart', function () {
      this.classList.remove('active');
      requestAnimationFrame(() => this.classList.add('active'));
    }, { passive: true });

    el.addEventListener('touchend', function () {
      setTimeout(() => this.classList.remove('active'), 400);
    }, { passive: true });
  });
}

// ========================================
// SMOOTH SCROLLING NAVIGATION
// ========================================

/**
 * Smooth scrolling for in-page anchor links.
 */
function initSmoothScrolling() {
  // CSS handles reduced motion for animations, but a JS-requested smooth
  // scroll ignores the preference unless we check it ourselves.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

/**
 * Keyboard-navigation affordances and a skip link for screen readers.
 */
function initAccessibilityFeatures() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  const skipLink = document.createElement('a');
  skipLink.href = '#about';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--accent-blue);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10000;
    transition: top 0.3s;
  `;

  skipLink.addEventListener('focus', () => { skipLink.style.top = '6px'; });
  skipLink.addEventListener('blur', () => { skipLink.style.top = '-40px'; });

  document.body.insertBefore(skipLink, document.body.firstChild);

  const focusStyles = document.createElement('style');
  focusStyles.textContent = `
    .keyboard-navigation *:focus {
      outline: 2px solid var(--accent-blue) !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(focusStyles);
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function initializeWebsite() {
  initScrollIndicator();
  initSmoothScrolling();
  initAccessibilityFeatures();
  addRippleEffect();
});

// Re-wire ripple targets if the viewport crosses into mobile width
window.addEventListener('resize', addRippleEffect, { passive: true });
