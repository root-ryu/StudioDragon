document.addEventListener('DOMContentLoaded', () => {



    const header = document.querySelector('header');
    const circle = document.getElementById('circle');
    const faces = document.querySelectorAll('#circle article');
    let lastScrollY = window.scrollY;

    // Circle 자동 회전 설정
    let currentRotation = 0;
    let currentFaceIndex = 0; // 현재 정면에 있는 face 인덱스
    const rotationStep = 45; // 8개 face이므로 45도씩
    let autoRotateInterval;
    let lastInteractionTime = Date.now();
    const interactionDelay = 2000; // 2초 후 자동 회전 재개

    // 각 face의 초기 각도 (face1=0도, face2=45도, ...)
    const faceAngles = [0, 45, 90, 135, 180, 225, 270, 315];

    // 최단 경로 계산 함수
    function getShortestRotation(targetAngle) {
        // 현재 회전 각도를 0-360 범위로 정규화
        let normalizedCurrent = ((currentRotation % 360) + 360) % 360;
        let normalizedTarget = -targetAngle;

        // 두 각도 차이 계산
        let diff = normalizedTarget - normalizedCurrent;

        // 최단 경로 찾기 (-180 ~ 180 범위로)
        if (diff > 180) {
            diff -= 360;
        } else if (diff < -180) {
            diff += 360;
        }

        return currentRotation + diff;
    }

    // 정면 근처 face 활성화 함수
    function updateActiveFaces() {
        const normalizedRotation = ((currentRotation % 360) + 360) % 360;

        faces.forEach((face, index) => {
            // 각 face의 현재 각도 계산 (circle 회전 + face 초기 각도)
            const faceCurrentAngle = (faceAngles[index] - normalizedRotation + 360) % 360;

            // 정면 기준 ±90도 이내면 클릭 가능
            const isNearFront = faceCurrentAngle <= 90 || faceCurrentAngle >= 270;

            if (isNearFront) {
                face.classList.add('active');
            } else {
                face.classList.remove('active');
            }
        });
    }

    // 자동 회전 함수
    function autoRotate() {
        // 마지막 인터랙션 후 2초가 지났으면 자동 회전
        if (Date.now() - lastInteractionTime > interactionDelay && circle) {
            currentFaceIndex = (currentFaceIndex - 1 + 8) % 8; // 이전 face (반시계방향)
            currentRotation = getShortestRotation(faceAngles[currentFaceIndex]);
            circle.style.transform = `rotateY(${currentRotation}deg)`;
            updateActiveFaces();
        }
    }

    // 자동 회전 시작
    function startAutoRotate() {
        autoRotateInterval = setInterval(autoRotate, 3000);
    }

    // 특정 face를 정면으로 회전 (최단 경로)
    function rotateToFace(faceIndex) {
        currentFaceIndex = faceIndex;
        // 최단 경로로 회전
        currentRotation = getShortestRotation(faceAngles[faceIndex]);
        circle.style.transform = `rotateY(${currentRotation}deg)`;
        lastInteractionTime = Date.now();
        updateActiveFaces();
    }

    if (circle) {
        // 각 face에 클릭 이벤트 설정
        faces.forEach((face, index) => {
            face.addEventListener('click', (e) => {
                e.stopPropagation(); // 이벤트 버블링 방지
                rotateToFace(index);
            });
        });

        // 초기 활성화 상태 설정
        updateActiveFaces();

        // transition 종료 후 활성화 상태 업데이트
        circle.addEventListener('transitionend', updateActiveFaces);

        // 자동 회전 시작
        startAutoRotate();
    }

    // 헤더 스크롤 이벤트
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            header.classList.add('off')
        } else {
            header.classList.remove('off')
        }
        lastScrollY = currentScrollY;
    });

    /*     AOS.init({
            disable: false,
            startEvent: 'DOMContentLoaded',
            initClassName: 'aos-init',
            animatedClassName: 'aos-animate',
            useClassNames: false,
            disableMutationObserver: false,
            debounceDelay: 50,
            throttleDelay: 99,
        }); */

    // ON-AIR 섹션 회전 기능
    let onswiper = new Swiper(".on_slide_wrap", {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        speed: 1000,
        // 반응형 설정
        breakpoints: {
            // 440px 이상일 때 1개만 노출
            440: {
                slidesPerView: 1,
                spaceBetween: 0,
            },
            // 768px 이상일 때 두 장 노출
            768: {
                slidesPerView: 2,
                spaceBetween: 32,
            },
            // 960px 이상(1023px 포함)에서 세 장 노출
            960: {
                slidesPerView: 3,
                spaceBetween: 160,
            },
            // 1280px 이상에서는 여유 있게 배치
            1280: {
                slidesPerView: 3.2,
                spaceBetween: 48,
            }
        }
    });


    // GigTit 섹션 배경색 전환 애니메이션
    const gigTitSection = document.querySelector('.GigTit');
    const body = document.body;

    function handleGigTitScroll() {
        if (!gigTitSection) return;

        const rect = gigTitSection.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        // 화면 너비에 따라 다른 트리거 포인트 설정
        let triggerPoint;
        if (windowWidth <= 440) {
            // 440px 이하: GigTit 섹션의 80% 위치에서 시작
            triggerPoint = sectionHeight * 0.2; // 섹션 상단에서 80% 내려간 지점
        } else if (windowWidth < 779) {
            // 779px 미만: GigTit 섹션의 80% 위치에서 시작
            triggerPoint = sectionHeight * 0.2; // 섹션 상단에서 80% 내려간 지점
        } else {
            // 779px 이상: 기존 로직 (화면에 80% 진입)
            triggerPoint = windowHeight - (sectionHeight * 0.8);
        }

        // 섹션이 화면에 들어온 정도 계산 (0 ~ 1)
        let scrollProgress = 0;

        if (windowWidth < 779) {
            // 779px 미만 (440px 포함): 섹션 상단이 트리거 포인트를 지나면 시작
            if (sectionTop <= triggerPoint) {
                const distancePassed = triggerPoint - sectionTop;
                const transitionDistance = sectionHeight * 0.3; // 30% 구간에서 전환
                scrollProgress = Math.min(distancePassed / transitionDistance, 1);
            }
        } else {
            // 779px 이상: 기존 로직
            if (sectionTop <= triggerPoint) {
                const distancePassed = triggerPoint - sectionTop;
                const transitionDistance = sectionHeight * 0.3; // 30% 구간에서 전환
                scrollProgress = Math.min(distancePassed / transitionDistance, 1);
            }
        }

        // 배경색 전환 (검은색 -> 흰색)
        if (scrollProgress > 0) {
            // RGB 값 계산 (0,0,0 -> 245,245,245)
            const r = Math.floor(245 * scrollProgress);
            const g = Math.floor(245 * scrollProgress);
            const b = Math.floor(245 * scrollProgress);

            body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

            // 텍스트 색상도 반전 (흰색 -> 검은색)
            if (scrollProgress > 0.5) {
                gigTitSection.style.color = `rgb(${Math.floor(13 * (scrollProgress - 0.5) * 2)}, ${Math.floor(3 * (scrollProgress - 0.5) * 2)}, ${Math.floor(28 * (scrollProgress - 0.5) * 2)})`;
            } else {
                gigTitSection.style.color = 'var(--Wcolor)';
            }
        } else {
            // 원래 배경색으로 복귀
            body.style.backgroundColor = 'var(--Bcolor)';
            gigTitSection.style.color = 'var(--Wcolor)';
        }
    }

    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', handleGigTitScroll);
    // 초기 실행
    handleGigTitScroll();

    // Latest News 슬라이드 기능
    const newsItems = document.querySelectorAll('.LatestNews .LNcon01, .LatestNews .LNcon02, .LatestNews .LNcon03');
    const newsIndicators = document.querySelectorAll('.LatestNews .news-indicator');
    let currentNewsIndex = 0;
    let newsInterval;

    function showNews(index) {
        // 모든 뉴스 아이템 비활성화
        newsItems.forEach(item => {
            item.classList.remove('active');
        });

        // 모든 인디케이터 비활성화
        newsIndicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // 선택된 뉴스 활성화
        if (newsItems[index]) {
            newsItems[index].classList.add('active');
        }

        // 선택된 인디케이터 활성화
        if (newsIndicators[index]) {
            newsIndicators[index].classList.add('active');
        }

        currentNewsIndex = index;
    }

    function nextNews() {
        const nextIndex = (currentNewsIndex + 1) % newsItems.length;
        showNews(nextIndex);
    }

    function startNewsSlider() {
        // 모바일(439px 이하)에서는 전광판 애니메이션과 동기화
        const isMobile = window.innerWidth <= 439;
        const interval = isMobile ? 7200 : 5000; // 7.2초(전광판 90% 완료 시점) 또는 5초

        newsInterval = setInterval(nextNews, interval);
    }

    function stopNewsSlider() {
        if (newsInterval) {
            clearInterval(newsInterval);
        }
    }

    // 인디케이터 클릭 이벤트
    newsIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopNewsSlider();
            showNews(index);
            startNewsSlider(); // 클릭 후 다시 자동 슬라이드 시작
        });
    });

    // 이미지 호버 이벤트 - 슬라이드 일시정지/재개
    newsItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('mouseenter', () => {
                stopNewsSlider();
            });

            img.addEventListener('mouseleave', () => {
                startNewsSlider();
            });
        }
    });

    // Latest News 섹션이 있으면 슬라이더 시작
    if (newsItems.length > 0) {
        startNewsSlider();
    }

    // 윈도우 리사이즈 이벤트 - 모바일/데스크톱 전환 시 타이밍 재조정
    window.addEventListener('resize', () => {
        if (newsItems.length > 0) {
            stopNewsSlider();
            startNewsSlider();
        }
    });



    // GSAP 애니메이션 초기화
    initGSAPAnimations();


});

// GSAP 애니메이션 함수
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // BeyondDrama 섹션의 아래에서 위로 올라오는 애니메이션
    gsap.set('.gsap-flip', {
        y: 50,
        opacity: 0
    });

    gsap.set('.gsap-flip-bottom', {
        y: 50,
        opacity: 0
    });

    // 첫 번째 행 애니메이션 (BDconTop) - 아래에서 위로
    gsap.to('.gsap-flip', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.BDconTop',
            start: 'top 60%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });

    // 두 번째 행 애니메이션 (BDconBottom) - 아래에서 위로, 약간의 지연
    gsap.to('.gsap-flip-bottom', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.15,
        delay: 0.3,
        scrollTrigger: {
            trigger: '.BDconBottom',
            start: 'top 60%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });

    // ViewersPlayground 섹션의 fade-up-right/left 애니메이션
    gsap.set('.VPcon01', {
        y: 50,
        x: 30,
        opacity: 0
    });

    gsap.set('.VPcon02', {
        y: 50,
        x: -30,
        opacity: 0
    });

    gsap.set('.VPcon03', {
        y: 50,
        x: 30,
        opacity: 0
    });

    // VPcon01 애니메이션 (첫 번째)
    gsap.to('.VPcon01', {
        y: 0,
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.VPcontents',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        }
    });

    // VPcon02 애니메이션 (두 번째) - 0.6초 딜레이
    gsap.to('.VPcon02', {
        y: 0,
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.6,
        scrollTrigger: {
            trigger: '.VPcontents',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        }
    });

    // VPcon03 애니메이션 (세 번째) - 1.2초 딜레이
    gsap.to('.VPcon03', {
        y: 0,
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        delay: 1.2,
        scrollTrigger: {
            trigger: '.VPcontents',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        }
    });

    // ON-AIR 섹션 애니메이션
    // 제목과 버튼 애니메이션
    gsap.set('.onair .inner .top', {
        y: 30,
        opacity: 0
    });

    gsap.to('.onair .inner .top', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.onair',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        }
    });

    // ON-AIR 콘텐츠 슬라이드 애니메이션 (순차적으로)
    gsap.set('.onair .ONcon > div', {
        y: 50,
        opacity: 0
    });

    gsap.to('.onair .ONcon > div', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.onair .ONcon',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        }
    });

    // Coming Soon 섹션 슬라이드 애니메이션
    const csSlides = ['.CScontents1', '.CScontents2', '.CScontents3'];
    let currentCSIndex = 0;

    // 초기 상태 설정
    csSlides.forEach((slide, index) => {
        const element = document.querySelector(slide);
        if (element) {
            if (index === 0) {
                element.style.display = 'block';
                element.style.opacity = '1';
            } else {
                element.style.display = 'none';
                element.style.opacity = '0';
            }
        }
    });

    // 슬라이드 전환 함수
    function changeCSSlide() {
        const currentSlide = document.querySelector(csSlides[currentCSIndex]);
        
        // 현재 슬라이드 페이드아웃
        if (currentSlide) {
            gsap.to(currentSlide, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    currentSlide.style.display = 'none';
                }
            });
        }

        // 다음 슬라이드 인덱스
        currentCSIndex = (currentCSIndex + 1) % csSlides.length;
        const nextSlide = document.querySelector(csSlides[currentCSIndex]);

        // 다음 슬라이드 페이드인 (y 애니메이션 제거)
        if (nextSlide) {
            nextSlide.style.display = 'block';
            gsap.fromTo(nextSlide, 
                { opacity: 0 },
                { 
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }
            );
        }
    }

    // 5초마다 슬라이드 전환
    setInterval(changeCSSlide, 5000);

    // Coming Soon 섹션 GSAP 애니메이션
    // fade-up 애니메이션
    gsap.from('.gsap-fade-up', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.gsap-fade-up',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // fade-left 애니메이션
    gsap.from('.gsap-fade-left', {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.3,
        scrollTrigger: {
            trigger: '.gsap-fade-left',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
}
