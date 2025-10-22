/* // filter.js
const buttons = document.querySelectorAll('.btn');
const shows = document.querySelectorAll('.show-item');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // 버튼 활성화 표시
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    shows.forEach(show => {
      if (filter === 'all') {
        show.style.display = 'block';
      } else if (show.dataset.status === filter) {
        show.style.display = 'block';
      } else {
        show.style.display = 'none';
      }
    });
  });
}); */
/* const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let index = 0;

function showSlide(n) {
  slides[index].classList.remove("active");
  dots[index].classList.remove("active");
  index = (n + slides.length) % slides.length;
  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

// auto-play every 6 sec
let slideInterval = setInterval(() => showSlide(index + 1), 6000);

// nav buttons
document
  .querySelector(".prev")
  .addEventListener("click", () => showSlide(index - 1));
document
  .querySelector(".next")
  .addEventListener("click", () => showSlide(index + 1));

// dots click
dots.forEach((dot) => {
  dot.addEventListener("click", () => showSlide(parseInt(dot.dataset.index)));
});



gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  smooth: 1,
  effects: true,
  normalizeScroll: true
});
 */




gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  smooth: 1,
  effects: true,
  normalizeScroll: true
});

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".zoom-container",
      start: "top top",
      end: "+=150%",
      pin: true,
      // markers: true,
      scrub: 1
    }
  })
  .to(
    ".zoom-item[data-layer='3']",
    {
      opacity: 1,
      z: 800,
      ease: "power1.inOut"
    },
    0
  )
  .to(
    ".zoom-item[data-layer='2']",
    {
      opacity: 1,
      z: 600,
      ease: "power1.inOut"
    },
    0
  )
  .to(
    ".zoom-item[data-layer='1']",
    {
      opacity: 1,
      z: 400,
      ease: "power1.inOut"
    },
    0
  )
  .to(
    ".heading",
    {
      opacity: 1,
      z: 50,
      ease: "power1.inOut"
    },
    0
  );

const splitLetters = SplitText.create(
  document.querySelector(".opacity-reveal")
);
gsap.set(splitLetters.chars, { opacity: "0.2", y: 0 });

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-stick",
      pin: true,
      start: "center center",
      end: "+=1500",
      //markers: true,
      scrub: 1
    }
  })
  .to(splitLetters.chars, {
    opacity: "1",
    duration: 1,
    ease: "none",
    stagger: 1
  })
  .to({}, { duration: 10 })
  .to(".opacity-reveal", {
    opacity: "0",
    scale: 1.2,
    duration: 50
  });
