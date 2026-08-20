(function () {

  // Lightbox for the project video thumbnails (.glightbox links).
  // Guarded so a failed CDN/script load can't take the scroll-spy down with it.
  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.glightbox' });
  }

  // Scroll-spy: highlight active nav link based on current section
  (function initScrollSpy() {
    const spyKeys = ['about', 'experience', 'projects'];

    function setup() {
      const sections = spyKeys.map(id => document.querySelector(`#${id}`)).filter(Boolean);
      if (sections.length === 0) return;

      function setActive(key) {
        document.querySelectorAll('.main-bav li a[data-spy]').forEach(a => {
          a.classList.toggle('active', a.dataset.spy === key);
        });
      }

      function onScroll() {
        let current = spyKeys[0];
        for (let i = sections.length - 1; i >= 0; i--) {
          const rect = sections[i].getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            current = spyKeys[i];
            break;
          }
        }
        setActive(current);
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Run setup whether DOM is already loaded or not
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  }());

}());
