

/* ============================
   main.js (icon_info counters)
   Requires:
   - gsap@3 + ScrollTrigger
   - @studio-freight/lenis
   Load order (body 끝):
   gsap -> ScrollTrigger -> Lenis -> main.js
================================ */

// ====== 옵션: 카운트 모드 ======
/**
 * "once"   : 내려갈 때 1번만 카운트 (기본)
 * "repeat" : 위로 올렸다가 다시 내려오면 매번 재카운트
 */
const COUNT_MODE = "once"; // "once" | "repeat"

// ====== 안전 장치: 의존성 확인 ======
/*     (function ensureDeps() {
        if (!window.gsap) {
            console.error("[main.js] GSAP이 로드되지 않았습니다. gsap.min.js를 main.js보다 먼저 불러오세요.");
        }
        if (!window.ScrollTrigger) {
            console.error("[main.js] ScrollTrigger가 로드되지 않았습니다. ScrollTrigger.min.js를 main.js보다 먼저 불러오세요.");
        }
        if (!window.Lenis) {
            console.error("[main.js] Lenis가 로드되지 않았습니다. bundled/lenis.min.js를 main.js보다 먼저 불러오세요.");
        }
    })(); */

// ====== 초기화 ======
document.addEventListener("DOMContentLoaded", () => {

    // ====== Lenis 스무스 스크롤 ======
    let lenis;
    try {
        lenis = new Lenis({
            duration: 0.8,
            easing: (t) => t, // 선형 (빠른 반응)
            smooth: true,
            smoothTouch: true,
        });

        function raf(t) {
            lenis.raf(t);
            ScrollTrigger.update();
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } catch (e) {
        console.warn("[main.js] Lenis 초기화 실패 (옵션):", e);
    }


    // GSAP 플러그인 등록
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        // 의존성이 없으면 이후 로직 중단
        return;
    }
    if (!window.gsap || !window.ScrollTrigger) {
        console.error("GSAP/ScrollTrigger가 로드되지 않았습니다.");
        return;
    }


    lenis.on('scroll', () => {
        ScrollTrigger.update();
    });
    // ====== 숫자 카운트 (icon_info 범위) ======
    (function initIconInfoCounters() {
        const targets = document.querySelectorAll(".icon_info [data-count-to]");
        if (!targets.length) return;

        const nf = new Intl.NumberFormat(); // 1,000 단위 포맷

        targets.forEach((el) => {
            const end = parseInt(el.getAttribute("data-count-to"), 10);
            if (isNaN(end)) return;

            const prefix = el.getAttribute("data-prefix") || ""; // 선택: 접두사
            const suffix = el.getAttribute("data-suffix") || ""; // 선택: 접미사 (예: "+")
            const duration = parseFloat(el.getAttribute("data-duration")) || 1.2; // 선택: 개별 지속시간
            const ease = el.getAttribute("data-ease") || "power2.out"; // 선택: 개별 이징

            const obj = { val: 0 };

            const st = ScrollTrigger.create({
                trigger: el,
                start: "top 70%", // 보이는 위치에서 시작
                once: COUNT_MODE === "once",
                onEnter() {
                    // 0에서 end까지 카운트 업
                    gsap.to(obj, {
                        val: end,
                        duration,
                        ease,
                        onUpdate() {
                            el.textContent = `${prefix}${nf.format(Math.floor(obj.val))}${suffix}`;
                        },
                        onComplete() {
                            // 끝값 보정
                            el.textContent = `${prefix}${nf.format(end)}${suffix}`;
                        },
                    });
                },
                // repeat 모드일 때 되돌아가면 0으로 리셋
                onLeaveBack: COUNT_MODE === "repeat" ? () => {
                    obj.val = 0;
                    el.textContent = `${prefix}0${suffix}`;
                } : undefined,
            });

            // 요소가 동적으로 보여졌다/숨겨졌다 할 수 있는 레이아웃이면 필요시 갱신
            // st.refresh();  // 보통은 전역 refresh로 충분
        });
    })();

    // ====== 숫자 카운트 (icon_info 범위, 재진입 시 재실행) ======
    (function initIconInfoCounters() {
        const targets = document.querySelectorAll(".icon_info [data-count-to]");
        if (!targets.length) return;

        const nf = new Intl.NumberFormat(); // 1,000 단위 포맷

        targets.forEach((el) => {
            const end = parseInt(el.getAttribute("data-count-to"), 10);
            if (isNaN(end)) return;

            const prefix = el.getAttribute("data-prefix") || "";
            const suffix = el.getAttribute("data-suffix") || "";
            const duration = parseFloat(el.getAttribute("data-duration")) || 1.2;
            const ease = el.getAttribute("data-ease") || "power2.out";

            // 내부 상태
            let obj = { val: 0 };
            let tween = null;

            // 초기화 함수
            function reset() {
                if (tween) tween.kill();
                obj.val = 0;
                el.textContent = `${prefix}0${suffix}`;
            }

            // 재생 함수(항상 0부터 다시)
            function play() {
                if (tween) tween.kill();
                obj.val = 0;
                el.textContent = `${prefix}0${suffix}`;

                tween = gsap.to(obj, {
                    val: end,
                    duration,
                    ease,
                    onUpdate() {
                        el.textContent = `${prefix}${nf.format(Math.floor(obj.val))}${suffix}`;
                    },
                    onComplete() {
                        el.textContent = `${prefix}${nf.format(end)}${suffix}`;
                    },
                });
            }

            // 최초 상태 세팅
            reset();

            ScrollTrigger.create({
                trigger: el,         // 각 숫자 요소 단위로 트리거
                start: "top 70%",
                end: "bottom 30%",
                onEnter: play,       // 아래→위로 들어옴
                onEnterBack: play,   // 위→아래로 다시 들어옴
                onLeave: reset,      // 아래로 지나가며 벗어남
                onLeaveBack: reset,  // 위로 벗어남
            });
        });
    })();

    // Vision / Mission Fade Up
    gsap.utils.toArray(".v_and_m .cont article").forEach((item, i) => {
        gsap.fromTo(item,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.1,
                ease: "power3.out",
                delay: i * 0.15, // 순차 등장
                scrollTrigger: {
                    trigger: ".v_and_m",
                    start: "top 50%", // 화면 70% 지점에서 애니메이션 시작
                }
            }
        );

        // 내부 텍스트도 살짝 딜레이 주며 등장
        gsap.fromTo(item.querySelector(".txt"),
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                delay: 0.3 + i * 0.15,
                scrollTrigger: {
                    trigger: ".v_and_m",
                    start: "top 50%",
                }
            }
        );
    });

    // ====== ScrollTrigger 리프레시 ======
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
        setTimeout(() => ScrollTrigger.refresh(), 500); // Lenis/레아이웃 안정화 후 한 번 더
    });

    gsap.utils.toArray(".v_and_m .cont article").forEach((item, i) => {

        const txtEl = item.querySelector(".txt");

        // 초기 상태 함수
        function setInit() {
            gsap.set(item, { y: 60, opacity: 0 });
            gsap.set(txtEl, { y: 20, opacity: 0 });
        };

        // ★ 페이지 로드시 초기화
        setInit();

        ScrollTrigger.create({
            trigger: ".v_and_m",
            start: "top 70%",
            end: "bottom 30%",
            onEnter: () => {
                // article fade-up
                gsap.to(item, {
                    y: 0,
                    opacity: 1,
                    duration: 1.1,
                    ease: "power3.out",
                    delay: i * 0.15
                });

                // inner txt fade-up
                gsap.to(txtEl, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    delay: 0.3 + i * 0.15
                });
            },
            onLeaveBack: () => {
                // ★ 섹션 벗어나면 다시 초기 상태로 리셋
                setInit();
            }
        });
    });

    const main_cachSwiper = new Swiper(".main_cach .swiper", {
        slidesPerView: "auto",
        spaceBetween: 64,
        loop: true,                   // 무한 반복
        allowTouchMove: false // 마우스 드래그 필요하면 true
    });

    // =========================
    // ★★★ 여기부터 추가된 부분 ★★★
    // History Swiper offset 값을 반응형으로 계산
    function getHistoryOffsets() {
        const w = window.innerWidth;
        if (w <= 440) {
            return { before: 28, after: 120 };   // 모바일 소형
        } else if (w <= 1024) {
            return { before: 88, after: 250 };   // 태블릿
        } else {
            return { before: 280, after: 500 };  // PC 기본
        }
    }
    let __historyOffset = getHistoryOffsets();
    // =========================

    // History Swiper (구조 유지: 외부 스크롤바 사용)
    const historySwiper = new Swiper(".history .cont_hori_swipe.swiper", {
        slidesPerView: "auto",
        centeredSlides: false,

        // freeMode는 한 번만!
        freeMode: { enabled: true, sticky: false },

        // 인터랙션
        simulateTouch: true,
        grabCursor: true,
        resistanceRatio: 0.3,

        // 좌/우 여백 (반응형 적용)
        slidesOffsetBefore: __historyOffset.before,
        slidesOffsetAfter: __historyOffset.after,

        // ✅ 외부(섹션 바깥) 스크롤바 정확히 지정
        scrollbar: {
            el: ".history > .scroll_bar.swiper-scrollbar",
            draggable: true,
            dragSize: "auto",
            hide: false,
            snapOnRelease: false,
        },
    });

    // =========================
    // ★★★ 추가: 리사이즈 시 offset만 갱신 ★★★
    window.addEventListener("resize", () => {
        __historyOffset = getHistoryOffsets();
        historySwiper.params.slidesOffsetBefore = __historyOffset.before;
        historySwiper.params.slidesOffsetAfter = __historyOffset.after;
        historySwiper.update();
    });
    // =========================

});




// document.addEventListener('DOMContentLoaded', () => {
//     const header = document.querySelector('header');
//     let lastScrollY = window.scrollY; // 직전 스크롤 위치 저장
//     window.addEventListener('scroll', () => {
//         const currentScrollY = window.scrollY;
//         if (currentScrollY > lastScrollY) {
//             // 아래로 스크롤 → 헤더 숨김
//             header.classList.add('off')
//         } else {
//             // 위로 스크롤 → 헤더 보임
//             header.classList.remove('off')
//         }
//         lastScrollY = currentScrollY;
//     });



// ★ 중복/충돌을 일으키던 이전 인스턴스는 제거하세요.
// var histotySwiper = new Swiper(".history .swiper", { ... })  ← 삭제



