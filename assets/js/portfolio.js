/**
 * Personal Website Interactive Features
 * Author: Rishav Mitra
 * Description: JavaScript functionality for portfolio website including animations, scroll effects, and typing animations
 */

// ========================================
// GLOBAL VARIABLES & INITIALIZATION
// ========================================

// Hide WOW.js elements initially to prevent flash
const wowElements = document.getElementsByClassName('wow');
for (let i = 0; i < wowElements.length; i++) {
  wowElements[i].style.visibility = 'hidden';
}

// ========================================
// CINEMATIC INTRO SYSTEM
// ========================================

class CinematicIntro {
  constructor() {
    this.introElement = null;
  }

  init() {
    this.introElement = document.getElementById('cinematic-intro');
    
    // Hide main content initially
    this.hideMainContent();
  }

  hideMainContent() {
    const mainSections = document.querySelectorAll('.side-nav, .hero-area, .about, .experience, .projects');
    mainSections.forEach(section => {
      section.classList.add('main-content');
    });
  }

  showMainContent() {
    const mainSections = document.querySelectorAll('.main-content');
    mainSections.forEach((section, index) => {
      setTimeout(() => {
        section.style.animation = `contentReveal 1s ease-out forwards`;
      }, index * 100);
    });
    
    // Start typing animations after content is revealed
    setTimeout(() => {
      this.startTypingAnimations();
    }, 1000);
  }
  
  startTypingAnimations() {
    // Start main title typing animation
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
      try {
        const wordsAttr = txtElement.getAttribute('data-words');
        const words = JSON.parse(wordsAttr.replace(/'/g, '"'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
      } catch (e) {
        console.error('Error parsing main title words:', e);
      }
    }
    
    // Start subtitle typing animation with delay
    setTimeout(() => {
      const txtSubtitleElement = document.querySelector('.txt-type-subtitle');
      if (txtSubtitleElement) {
        try {
          const wordsAttr = txtSubtitleElement.getAttribute('data-words');
          console.log('Subtitle words attribute:', wordsAttr); // Debug log
          const words = JSON.parse(wordsAttr.replace(/'/g, '"'));
          const wait = txtSubtitleElement.getAttribute('data-wait');
          console.log('Starting subtitle typing with words:', words); // Debug log
          new TypeWriter(txtSubtitleElement, words, wait);
        } catch (e) {
          console.error('Error parsing subtitle words:', e);
          // Fallback - create TypeWriter with hardcoded text
          new TypeWriter(txtSubtitleElement, ["I enjoy solving problems for people."], 2000);
        }
      } else {
        console.error('Subtitle element not found');
      }
    }, 2000);
  }
}

// Initialize cinematic intro
const cinematicIntro = new CinematicIntro();

// ========================================
// SCROLL INDICATOR FUNCTIONALITY
// ========================================

/**
 * Updates the scroll progress indicator at the top of the page
 */
function updateScrollIndicator() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / documentHeight) * 100;
  
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) {
    indicator.style.width = scrollPercent + '%';
  }
}

/**
 * Optimized scroll handler for mobile devices using requestAnimationFrame
 * @returns {Function} The appropriate scroll handler function
 */
function optimizeMobileScroll() {
  if (window.innerWidth <= 768) {
    let ticking = false;
    
    function updateScrollIndicatorMobile() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / documentHeight) * 100;
      
      const indicator = document.getElementById('scrollIndicator');
      if (indicator) {
        indicator.style.width = scrollPercent + '%';
      }
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateScrollIndicatorMobile);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    return requestTick;
  } else {
    return updateScrollIndicator;
  }
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

/**
 * Initializes scroll-based animations using Intersection Observer API
 */
function initScrollAnimations() {
  // Track elements that have already been animated to prevent re-animation
  const observedElements = new WeakSet();
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Skip if element is a flipped card
      if (entry.target.classList.contains('flipped')) {
        return;
      }
      
      if (entry.isIntersecting && !observedElements.has(entry.target)) {
        observedElements.add(entry.target);
        entry.target.classList.add('visible');
        
        // Special handling for list animations on mobile
        if (window.innerWidth <= 768 && entry.target.querySelector('.abt-list')) {
          const list = entry.target.querySelector('.abt-list');
          if (!list.classList.contains('animate')) {
            setTimeout(() => {
              list.classList.add('animate');
            }, 150);
          }
        }
        
        // Stop observing this element to prevent re-triggering
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  });

  // Observe elements for mobile animations
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.sec-t, .card-single, .abt-det, .project-text, .img-profile').forEach(el => {
      // Skip flipped cards
      if (el.classList.contains('flipped')) {
        el.classList.add('visible');
        return;
      }
      if (!observedElements.has(el)) {
        el.classList.add('mobile-reveal');
        observer.observe(el);
      }
    });
  }
}

// ========================================
// MOBILE TOUCH INTERACTIONS
// ========================================

/**
 * Adds ripple effect for touch interactions on mobile devices
 */
function addRippleEffect() {
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.nav-link, .hi-btn, .social-nav a, .card-single, .project-text').forEach(el => {
      if (!el.classList.contains('ripple')) {
        el.classList.add('ripple');
        
        el.addEventListener('touchstart', function(e) {
          this.classList.remove('active');
          requestAnimationFrame(() => {
            this.classList.add('active');
          });
        }, { passive: true });

        el.addEventListener('touchend', function(e) {
          setTimeout(() => {
            this.classList.remove('active');
          }, 400);
        }, { passive: true });
      }
    });
  }
}

// ========================================
// SMOOTH SCROLLING NAVIGATION
// ========================================

/**
 * Initializes smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ========================================
// TYPING ANIMATION CLASS
// ========================================

/**
 * TypeWriter class for creating typing animation effects
 */
class TypeWriter {
  /**
   * @param {HTMLElement} txtElement - The element to display the typing text
   * @param {Array} words - Array of words to cycle through
   * @param {number} wait - Wait time between word cycles (ms)
   */
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.isDeleting = false;
    this.type();
  }

  /**
   * Main typing animation method
   */
  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    // Handle typing or deleting
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Update the display
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    // Determine typing speed
    let typeSpeed = 100;
    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    // Handle word completion and cycling
    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    // Continue the animation
    setTimeout(() => this.type(), typeSpeed);
  }
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

/**
 * Initializes accessibility features including keyboard navigation and skip links
 */
function initAccessibilityFeatures() {
  // Enhanced keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  // Create skip link for screen readers
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
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Handle reduced motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
      el.style.animationDuration = '0.01ms !important';
      el.style.animationIterationCount = '1 !important';
      el.style.transitionDuration = '0.01ms !important';
    });
  }

  // Add focus management styles
  const focusStyles = document.createElement('style');
  focusStyles.textContent = `
    .keyboard-navigation *:focus {
      outline: 2px solid var(--accent-blue) !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(focusStyles);
}

/**
 * Ensures all text content is visible and properly styled
 */
function ensureTextVisibility() {
  document.querySelectorAll('.sec-t h2, .abt-det, .project-text, .card-single').forEach(el => {
    el.style.opacity = '1';
    el.style.visibility = 'visible';
  });
}

// ========================================
// INITIALIZATION FUNCTIONS
// ========================================

/**
 * Initializes typing animations for subtitle text
 * Note: This is now handled by the cinematic intro system
 */
function initTypingAnimations() {
  // Typing animations are now controlled by the cinematic intro
  // They will start after the intro completes
}

/**
 * Main initialization function called when DOM is loaded
 */
function initializeWebsite() {
  // Initialize cinematic intro first
  cinematicIntro.init();
  
  // Initialize core functionality (but not typing animations yet)
  initScrollAnimations();
  initSmoothScrolling();
  initAccessibilityFeatures();
  
  // Set up scroll listener
  window.addEventListener('scroll', updateScrollIndicator, { passive: true });
  
  // Ensure all content is visible
  ensureTextVisibility();
  
  // Initialize mobile-specific features
  if (window.innerWidth <= 768) {
    addRippleEffect();
    optimizeMobileScroll();
  }
}

// ========================================
// EVENT LISTENERS
// ========================================

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeWebsite);

// Handle window resize events
window.addEventListener('resize', () => {
  // Re-initialize mobile features if screen size changes
  if (window.innerWidth <= 768) {
    addRippleEffect();
  }
}, { passive: true });
