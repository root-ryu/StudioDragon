const rollImg = new Swiper(".frame-1000001323", {
    loop: true,
    slidesPerView: 'auto',
    spaceBetween: 14,
    speed: 10000,
    autoplay: {
        delay: 0,                 // 딜레이 0 → 연속 재생
        disableOnInteraction: false,
        pauseOnMouseEnter: false, // 🔥 마우스 올려도 안 멈추게!
    },
    loopAdditionalSlides: 4,    // 루프 시 빈틈 방지
    on: {
        init: function () {
            this.wrapperEl.style.transitionTimingFunction = 'linear';
        },
        slideChangeTransitionStart: function () {
            this.wrapperEl.style.transitionTimingFunction = 'linear';
        },
    },
});