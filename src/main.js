'use strict';

///////////////////////////////////////
// Modal window
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////////////////////////
// Cookie button
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `We use cookies for inproved functionality and analytics. 
  <button class="btn btn--close-cookie">Got it!</button>`;
// Add style
message.style.backgroundColor = 'grey';
// append the new element
header.append(message);

// delete the message
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});

/////////////////////////////////////////////////////////////////
// smooth scrolling
function scroll() {
  section1.scrollIntoView({ behavior: 'smooth' });
}
btnScrollTo.addEventListener('click', scroll);
// Page navigation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////////////////////
// Tabbed Components by using  Event Delegation
tabsContainer.addEventListener('click', function (e) {
  // Find the closest element with the class 'operations__tab'
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Remove active class from all tabs
  tabs.forEach((t) => t.classList.remove('operations__tab--active'));

  // Add active class to the clicked button
  clicked.classList.add('operations__tab--active');

  // Activate the content area
  // First remove the active class from all buttons
  document
    .querySelectorAll('.operations__content')
    .forEach((content) =>
      content.classList.remove('operations__content--active')
    );

  // Add the active class to specific button
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////////////////////////////////////////
// Menu fade animation function
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////////////////////////////////
// Sticky Navigation
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////////////////////////////////////////
// reveal elements on page scroll
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // Guard clause
  if (!entry.isIntersecting) return;
  // Unhide the section
  entry.target.classList.remove('section--hidden');
  // Unobserve the section
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// Add an observer to each section
allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////////////////////////////
// Lazy loading images
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImage = function (entries, observer) {
  const [entry] = entries; // Destructure the first entry from the IntersectionObserver callback

  // Guard Clause: If the image is not intersecting (not in the viewport), do nothing
  if (!entry.isIntersecting) return;

  // Replace the placeholder `src` with the actual `data-src`
  entry.target.src = entry.target.dataset.src;

  // Add a 'load' event listener to the image
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); // Remove the blur effect once the image is fully loaded
  });

  // Stop observing this image since it has been loaded
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTarget.forEach((img) => imgObserver.observe(img));

/////////////////////////////////////////////////////////////
// Slider Component
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach((dot) => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  const gotoSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // next slide
  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    gotoSlide(curSlide);
    activateDot(curSlide);
  };
  //Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  // Initialization functions
  const init = function () {
    gotoSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      gotoSlide(slide);
      activateDot(slide);
    }
  });
  //Automatically slide after 5 seconds
  setInterval(() => {
    nextSlide();
  }, 5000);
};
slider();
