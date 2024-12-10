

// When the user scrolls down, show the sticky navbar and hide the original navbar
window.onscroll = function () {
    handleScroll();
  };
  
  function handleScroll() {
    const originalNav = document.querySelector('nav');
    const stickyNav = document.getElementById('sticky-nav');
  
    // Get the scroll position
    if (window.scrollY > 100) { // Adjust the scroll position threshold as needed
      originalNav.style.display = 'none'; // Hide the original navbar
      stickyNav.style.display = 'block'; // Show the sticky navbar
    } else {
      originalNav.style.display = 'block'; // Show the original navbar
      stickyNav.style.display = 'none'; // Hide the sticky navbar
    }
  }

 // Function to handle the sticky behavior of the second navbar
window.onscroll = function() {
    var secondNavbar = document.querySelector('.second-navbar');
    if (window.pageYOffset > secondNavbar.offsetTop) {
        secondNavbar.classList.add('sticky');
    } else {
        secondNavbar.classList.remove('sticky');
    }
};


// Variables for tracking current slide of each carousel
let currentIndex1 = 0;
const slides1 = document.querySelectorAll('#carouselExample1 .carousel-item');

let currentIndex2 = 0;
const slides2 = document.querySelectorAll('#carouselExample2 .carousel-item');

// Function to move slides for the first carousel
function moveSlide1(direction) {
    currentIndex1 += direction;
    if (currentIndex1 < 0) {
        currentIndex1 = slides1.length - 1; // Loop to the last slide
    } else if (currentIndex1 >= slides1.length) {
        currentIndex1 = 0; // Loop to the first slide
    }

    // Hide all slides
    slides1.forEach(slide => slide.classList.remove('active'));

    // Show the current slide
    slides1[currentIndex1].classList.add('active');
}

// Function to move slides for the second carousel
function moveSlide2(direction) {
    currentIndex2 += direction;
    if (currentIndex2 < 0) {
        currentIndex2 = slides2.length - 1; // Loop to the last slide
    } else if (currentIndex2 >= slides2.length) {
        currentIndex2 = 0; // Loop to the first slide
    }

    // Hide all slides
    slides2.forEach(slide => slide.classList.remove('active'));

    // Show the current slide
    slides2[currentIndex2].classList.add('active');
}