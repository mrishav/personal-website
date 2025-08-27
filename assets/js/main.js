(function () {

  // var toggle = document.getElementById("theme-toggle");

  // var storedTheme =
  //   localStorage.getItem("theme") ||
  //   (window.matchMedia("(prefers-color-scheme: dark)").matches
  //     ? "dark"
  //     : "light");
  // if (storedTheme)
  //   document.documentElement.setAttribute("data-theme", storedTheme);

  // toggle.onclick = function () {
  //   var currentTheme = document.documentElement.getAttribute("data-theme");
  //   var targetTheme = "light";

  //   if (currentTheme === "light") {
  //     targetTheme = "dark";
  //   }
  //   document.documentElement.setAttribute("data-theme", targetTheme);
  //   localStorage.setItem("theme", targetTheme);
  // };


 //===== text-blink

 class TypeWritter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  // Type Method
  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];
    // Check if deleting
    if (this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    //Insert txt into element
    this.txtElement.innerHTML = `<span class="txt">${this.txt
      }<span class="blinking-cursor">|</span></span>`;

    // Initial type Speed
    let typeSpeed = 150;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Init on DOM  Load
document.addEventListener('DOMContentLoaded', init);

// Init App
function init() {
  const txtElement = document.querySelector('.txt-type');
  if (txtElement) {
    try {
      const wordsAttr = txtElement.getAttribute('data-words');
      const words = JSON.parse(wordsAttr.replace(/'/g, '"'));
      const wait = txtElement.getAttribute('data-wait');
      new TypeWritter(txtElement, words, wait);
    } catch (e) {
      console.error('Error parsing main title words:', e);
    }
  }
  
  // Initialize subtitle typing animation with delay
  setTimeout(() => {
    const txtSubtitleElement = document.querySelector('.txt-type-subtitle');
    if (txtSubtitleElement) {
      try {
        const wordsAttr = txtSubtitleElement.getAttribute('data-words');
        const words = JSON.parse(wordsAttr.replace(/'/g, '"'));
        const wait = txtSubtitleElement.getAttribute('data-wait');
        new TypeWritter(txtSubtitleElement, words, wait);
      } catch (e) {
        console.error('Error parsing subtitle words:', e);
        new TypeWritter(txtSubtitleElement, ["I enjoy solving problems for people."], 2000);
      }
    }
  }, 2000);
}

   // WOW active
	new WOW().init();


  //========= glightbox
const glightbox = GLightbox({
  selector: ".glightbox",
});

// Project details toggle functionality
function toggleProjectDetails(projectId) {
  const detailsElement = document.getElementById(`${projectId}-details`);
  const button = document.querySelector(`button[onclick="toggleProjectDetails('${projectId}')"]`);
  const expandText = button.querySelector('.expand-text');
  const expandIcon = button.querySelector('.expand-icon');
  
  if (detailsElement.classList.contains('expanded')) {
    // Collapse
    detailsElement.classList.remove('expanded');
    expandText.textContent = 'Show Details';
    expandIcon.style.transform = 'rotate(0deg)';
  } else {
    // Expand
    detailsElement.classList.add('expanded');
    expandText.textContent = 'Hide Details';
    expandIcon.style.transform = 'rotate(180deg)';
  }
}

// Make function globally available
window.toggleProjectDetails = toggleProjectDetails;

function flipCard(cardId) {
  const cardInner = document.getElementById(cardId + '-card');
  if (!cardInner) return;

  const cardContainer = cardInner.parentElement;
  if (!cardContainer) return;

  cardContainer.classList.toggle('flipped');

  // Adjust height for smooth animation
  const isFlipped = cardContainer.classList.contains('flipped');
  const front = cardInner.querySelector('.project-flip-front, .flip-card-front');
  const back = cardInner.querySelector('.project-flip-back, .flip-card-back');

  if (front && back) {
    if (isFlipped) {
      // Set height to back's content height
      cardContainer.style.height = back.scrollHeight + 'px';
    } else {
      // Set height to front's content height
      cardContainer.style.height = front.scrollHeight + 'px';
    }
  }
}

// Set initial height for all flip cards on load and resize
function setInitialCardHeights() {
  const flipCards = document.querySelectorAll('.project-flip-card, .flip-card');
  flipCards.forEach(card => {
    const front = card.querySelector('.project-flip-front, .flip-card-front');
    if (front) {
      card.style.height = front.scrollHeight + 'px';
    }
  });
}

document.addEventListener('DOMContentLoaded', setInitialCardHeights);
window.addEventListener('resize', setInitialCardHeights);

// Make function globally available
window.flipCard = flipCard;

// Fix mobile tab functionality
function initMobileTabs() {
  if (window.innerWidth <= 768) {
    const tabButtons = document.querySelectorAll('#experience .nav-link');
    const tabPanes = document.querySelectorAll('#experience .tab-pane');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => {
          pane.classList.remove('show', 'active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Show corresponding tab pane
        const targetId = this.getAttribute('data-bs-target');
        const targetPane = document.querySelector(targetId);
        if (targetPane) {
          targetPane.classList.add('show', 'active');
        }
      });
    });
  }
}

// Initialize on load and resize
document.addEventListener('DOMContentLoaded', initMobileTabs);
window.addEventListener('resize', initMobileTabs);

// Fade-in animations observer
document.addEventListener('DOMContentLoaded', function() {
  // Simple Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.15,  // Trigger when 15% visible
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class with a small delay for smoothness
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 100);
        
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements that should fade in
  const elementsToObserve = document.querySelectorAll(
    '.sec-t, .abt-det, .project-text, .card-single, ' +
    '.img-profile, .project-card, .flip-card, .project-flip-card'
  );
  
  elementsToObserve.forEach(el => {
    observer.observe(el);
  });

  // Special handling for hero section - delay after page load
  setTimeout(() => {
    const heroSection = document.querySelector('.hero-inner');
    if (heroSection) {
      heroSection.classList.add('visible');
    }
  }, 500); // Reduced from 2500ms for better UX
  
  // Add intro-active class management
  const intro = document.querySelector('.cinematic-intro');
  if (intro) {
    document.body.classList.add('intro-active');
    setTimeout(() => {
      document.body.classList.remove('intro-active');
    }, 2000); // Match your intro duration
  }
});

})();
