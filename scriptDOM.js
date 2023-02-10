'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

/*
// Selecting elements
console.log(document.documentElement); // Entire document
console.log(document.head); // Entire head
console.log(document.body); // Entire body

console.log(document.querySelector('.section')); // Returns all elements that are essential

console.log(document.getElementById('section--1')); // Returns first element which returns the element

const allButtons = document.getElementsByTagName('button');
console.log(allButtons); // Returns all buttons as a HTML collection -- updates upon modification (such as deletion) but leaves stored occurences as they were

console.log(document.getElementsByClassName('btn')); // Returns a life HTML collection for elements with class 'btn'

// Creating and inserting elements
// insertAdjacentHTML - one type
*/

// Creating and inserting elements
const header = document.querySelector('.header'); // Returns first element which returns the element

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message); // Adds in header as a child (1st element in header)
header.append(message); // Appends it as there is only one DOM element -  Adds in header as a child (Last element in header)

// For multiple iterations of the same elemnt
// header.append(message.cloneNode(true));

// header.before(message); // Add element as a sibling before header
// header.after(message); // Add element as a sibling after header

// Deleting elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    // Previous way - DOM traversing
    // message.parentElement.removeChild(message);
  });

// Styles
// These are set as inline styles
message.style.backgroundColor = '#37383d'; // Setting background color
message.style.width = '120%';
// console.log(message.style.backgroundColor); // Only prints set styles
// console.log(message.style.width);

// To log styles - log as an object
// console.log(getComputedStyle(message));

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
// console.log(message.style.height);

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  // First we need to get the coordinates
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords); // Logs the coordinates

  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
});

// EVENT DELEGATION - Implementing smooth scrolling for nav-links
// With Event Delegation
// 1. Add event listener to common parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.currentTarget); // Parent element

  // 2. Determine what element orgianated the event
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // Guard clause..end function immediately if someone clicks anywhere apart from the button
  if (!clicked) return;

  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate content area
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Passing Arguments to Event Handlers
// Menu fade animation - mouseenter doesn't bubble up
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

// Bind usually used for borrowing a function from another object
// Passing argument into event handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation - Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
console.log(nav.getBoundingClientRect());

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // Adds margin to the section of 90px - Top
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  // Unobserve when section has been shown
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  // Section only revealed when it's 15% visible
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy Loading Images
// const allFeaturesImgs = document.querySelectorAll('.features__img');
// or
const allFeaturesImgs = document.querySelectorAll('img[data-src]'); // All images that have the property data-src

console.log(allFeaturesImgs);

const loadImage = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.setAttribute('src', entry.target.dataset.src);

  // Remove blurry filter only when it is done loading
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // Unobserve when section has been shown
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  // Section only revealed when it's 15% visible
  threshold: 0.15,
  // Starts loading them 200px before reaching them
  rootMargin: '200px',
});

allFeaturesImgs.forEach(img => {
  imageObserver.observe(img);
  img.classList.add('lazy-img');
});

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.5)';
  // slider.style.overflow = 'visible';

  // Navigation with the dots
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (curSlideIndex) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - curSlideIndex)}%)`;
    });
  };

  // Prev slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Function for all function calls
  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  btnLeft.addEventListener('click', prevSlide);
  btnRight.addEventListener('click', nextSlide);

  // Enables swicthing slide with key presses
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    // Short circuting
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      // Or
      // const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();

// Lifecycle of the DOM

// Content has been loaded - That's why script is at the end
document.addEventListener('DOMContentLoaded', function () {
  console.log('HTML parsed and DOM tree built!', e);
});

// HTML Parsed, All images and resources have been loaded
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

/*
// Efficient Script Loading: Defer and Async
// Regular(HTML Parse -> Script load(waiting) -> Script execute -> Continue HTML Parse)
<script src=""></script>

// Async use in head(HTML Parse + Fetch Script -> Script execute(waiting) -> Continue HTML Parse) - Use for 3rd party scripts where order doesn't matter
// Also async scripts are the only ones that DOMContentLoaded doesn't wait to fire after the scripts are executed
<script async src=""></script>

// Defer use in head(HTML Parse + Fetch Script -> At end run script) - Better used on a script(above other script) being depended on by another script
// Also DOMContentLoaded fires after defer script is executed
<script defer src=""></script>
*/

// // Before user leaves a page - Maybe ask user before leaving page
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

/*
const obsCallback = function (entries, observer) {
  entries.forEach(entry => console.log(entry));
};

const obsOptions = {
  // Could select element - null select whole DOM
  root: null,
  // At 10% - Intersecting Ratio
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

/*
// Sticky navigation
const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function () {
  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

/*
// V.2
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});
*/

/* DOM Traversal
const h1 = document.querySelector('h1');

// Going downwards: Selecting child elements
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children); // Works for only direct children
h1.firstElementChild.style.color = 'white'; // You can also set properties
h1.lastElementChild.style.color = 'orangered'; // You can also set properties

// Going upwards: Selecting parent elements
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background = 'var(--gradient-secondary)'; // You can use custome properties
h1.closest('h1').style.background = 'var(--gradient-primary)'; // Will be the element itself

// Going sideways: Selecting sibling elements
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children); // Getting all the parent's children
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)'; // Pictures are now smaller
});
*/

// Without Event Delegation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     // Prevent jumping to section
//     e.preventDefault();
//     const id = this.getAttribute('href'); // Get relative url
//     console.log(id);

//     const idScetion = document.querySelector(id);
//     idScetion.scrollIntoView({ behavior: 'smooth' });
//     // OR
//     // const idCoords = document.querySelector(id).getBoundingClientRect();
//     // window.scrollTo({
//     //   left: idCoords.left + window.pageXOffset,
//     //   top: idCoords.top + window.pageYOffset,
//     //   behavior: 'smooth',
//     // });
//   });
// });

/*
// Since .root = the entire element
document.documentElement.style.setProperty('--color-primary', 'orangered'); // Changes all occurences of the primary color to orangered

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // Can now log the attributes - only reads standard properties

console.log(logo.src); // Logs the absolute url
console.log(logo.getAttribute('src')); // Logs the relative url
// Works the same way for links
const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

logo.alt = 'Beautiful minimalist logo'; // Set attribute
console.log(logo.alt);

logo.setAttribute('company', 'Bankist');

// Data attributes - for data attributes e.g., data-version-number = 3.0
console.log(logo.dataset.versionNumber); // Have to use camelCase

// Classes
logo.classList.add('c', 'c'); // Can add multiple classes
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

// Don't use as it overwrites all the other classes
// logo.className = 'c'
*/

/*
btnScrollTo.addEventListener('click', function (e) {
  // First we need to get the coordinates
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords); // Logs the coordinates

  // Logs coordinates of the element that was clicked - e = btnScrollTo
  // console.log(e.target.getBoundingClientRect()); // The attribute top is relative to the element and the top of the screen

  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset); // Y = Edge of the browser to the top of the html

  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // ); // Log current portion of the page - viewport

  // // Scrolling to the section
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // ); // Top of the section = section to the viewport + current scroll position

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // More modern way to implement this
  section1.scrollIntoView({ behavior: 'smooth' });
});
*/

/*
///////////////////////////////////////
// Types of Events and Event Handlers

// Way 1
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');

  // Can remove event listeners after use
  h1.removeEventListener('mouseenter', alertH1);
};

// Allow us to add multiple eventlisteners to the same element
// on MOUSEENTER mean on scrolling above it
h1.addEventListener('mouseenter', alertH1);

// Can remove the event listener in other ways - by implementing a timeout
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
*/

// Way 2
// // Another way of attaching an event listener to an element - old days though and overrides other event listners
// h1.onmousedown = alertH1;

// Way 3 - Using an HTML attribute
/* <h1 onclick="alert('HTML start)"></h1> */

/*
// rgb(255,255,255)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor(); // Affect its parents as the event bubbles up after the capturing and target phase
  console.log('LINK', e.target); // e.target = Where the event happened

  // Stop event propergtaion
  e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('LINK', e.target);
  },
  true // Event handler listens to capturing events over bubbling events - so first parent is affected first
);
*/
