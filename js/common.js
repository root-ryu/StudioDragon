document.addEventListener('DOMContentLoaded', () => {
    // ==================== GSAP 플러그인 ====================
    gsap.registerPlugin(ScrollTrigger);

    // ==================== Lenis ====================
    const lenis = new Lenis({
        duration: 0.8,
        easing: (t) => t, // 선형 (빠른 반응)
        smooth: true,
        smoothTouch: true, // 모바일 터치 스크롤 부드럽게
    });

    function raf(t) {
        lenis.raf(t);
        ScrollTrigger.update();
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    const header = document.querySelector('.wrap');
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

    const enBtn = document.querySelector('header nav .right .lang .en');
    const krBtn = document.querySelector('header nav .right .lang .kr');

    enBtn.addEventListener('click', () => {
        enBtn.classList.add('active');
        krBtn.classList.remove('active');
    });

    krBtn.addEventListener('click', () => {
        krBtn.classList.add('active');
        enBtn.classList.remove('active');
    });

    const ham = document.querySelector('.ham');
    ham.addEventListener('click', () => {
        document.querySelector('nav').classList.toggle('mobile');
    })



    /* 푸터 버튼 on */
    const familySiteBtn = document.querySelector('.family_site_btn');
    const familySite = document.querySelector('.footer_family_site');

    familySiteBtn.addEventListener('click', () => {
        familySite.classList.toggle('on');
    });

    window.addEventListener("resize", () => ScrollTrigger.refresh());
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
        setTimeout(() => ScrollTrigger.refresh(), 500); // ✅ Lenis 초기화 후 0.5초 뒤 다시
    });
})