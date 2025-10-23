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
        centeredSlides: false,
        freeMode: true,
        resistanceRatio: 0.3,
        scrollbar: {
            el: ".swiper-scrollbar",
            hide: true,
        },
        // 데스크톱에서도 마우스로 끌어서 스와이프
        simulateTouch: true,
        grabCursor: true,

        // 부드러운 자유 스크롤
        freeMode: { enabled: true, sticky: false },
        resistanceRatio: 0.3,

        // 시작/끝 여백(마지막 +500px)
        slidesOffsetBefore: 0,   // 타임라인 시작 y축 기준에 맞춰 조절
        slidesOffsetAfter: 500,

        // ✅ 스크롤바를 실제로 '드래그 가능'하게
        scrollbar: {
            el: ".swiper-scrollbar", // 동일한 엘리먼트 정확히 지정
            draggable: true,            // ← 핵심
            dragSize: "auto",
            hide: false,                // 숨김 없이 항상 보이도록(선호에 따라 true)
            snapOnRelease: false        // 드래그 놓아도 강제 스냅 방지(자유 스크롤 느낌)
        },
    });

})