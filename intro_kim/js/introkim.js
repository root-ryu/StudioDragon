document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY; // 직전 스크롤 위치 저장
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
            // 아래로 스크롤 → 헤더 숨김
            header.classList.add('off')
        } else {
            // 위로 스크롤 → 헤더 보임
            header.classList.remove('off')
        }
        lastScrollY = currentScrollY;
    });
    const main_cachSwiper = new Swiper(".main_cach .swiper", {
        slidesPerView: 'auto',
        spaceBetween: 64,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
    });

    var histotySwiper = new Swiper(".history .swiper", {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 90,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

})