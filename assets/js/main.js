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

// Flip card functionality
function flipCard(cardId) {
  console.log('Flip card called with:', cardId);
  const card = document.getElementById(cardId + '-card');
  console.log('Found card:', card);
  
  if (card) {
    console.log('Toggling flipped class on:', card.parentElement);
    card.parentElement.classList.toggle('flipped');
  }
}

// Make function globally available
window.flipCard = flipCard;

})();
