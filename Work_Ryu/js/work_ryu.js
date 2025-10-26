/* ============================================
   BOOKMARK FUNCTIONALITY
   ============================================ */
(function() {
    const bookmarkButton = document.querySelector('.bookmark_button');
    const bookmarkIcon = document.querySelector('.bookmark_icon');
    const notification = document.querySelector('.bookmark_notification');
    const notificationMessage = document.querySelector('.notification_message');
    
    if (!bookmarkButton || !bookmarkIcon || !notification) return;
    
    let isBookmarked = false;
    let notificationTimeout = null;
    
    // 북마크 버튼 클릭 이벤트
    bookmarkButton.addEventListener('click', function() {
        isBookmarked = !isBookmarked;
        
        // 아이콘 전환
        if (isBookmarked) {
            bookmarkIcon.src = 'Work_Ryu/asset/icon_bookmark.svg';
            notificationMessage.textContent = 'Drama Saved';
        } else {
            bookmarkIcon.src = 'Work_Ryu/asset/icon_bookmark_off.svg';
            notificationMessage.textContent = 'Removed from Saved List';
        }
        
        // 팝업 표시
        notification.classList.add('show');
        
        // 기존 타이머 제거
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }
        
        // 2초 후 팝업 숨김
        notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    });
})();

/* episode */
// Episode 섹션 드래그 스크롤 및 반응형 네비게이션
window.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.episode_scroll_container');
    
    if (!slider) return;
    
    // 반응형 체크 함수
    function isMobile() {
        return window.innerWidth < 1024;
    }
    
    let isDown = false;
    let startX;
    let scrollLeft;

    // 기본 스크롤 동작
    // slider.style.scrollBehavior는 CSS에서 제어

    // 이미지 드래그 방지
    const images = slider.querySelectorAll('img');
    images.forEach(function(img) {
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
        img.style.pointerEvents = 'none';
        img.style.userSelect = 'none';
    });

    slider.addEventListener('mousedown', function(e) {
        // 모든 화면에서 드래그 활성화
        isDown = true;
        slider.classList.add('grabbing');
        startX = e.pageX;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', function() {
        isDown = false;
        slider.classList.remove('grabbing');
    });

    slider.addEventListener('mouseup', function() {
        isDown = false;
        slider.classList.remove('grabbing');
    });

    // 드래그 관성을 위한 변수
    let lastX = 0;
    let velocity = 0;
    let animationId = null;

    slider.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (x - startX) * 1.5; // 속도 조정
        slider.scrollLeft = scrollLeft - walk;
        
        // 속도 계산 (관성 효과용)
        velocity = x - lastX;
        lastX = x;
    });

    // 마우스 업 시 관성 효과
    slider.addEventListener('mouseup', function() {
        isDown = false;
        slider.classList.remove('grabbing');
        
        // 관성 스크롤 적용
        if (Math.abs(velocity) > 2) {
            applyInertia();
        }
    });

    // 관성 스크롤 함수
    function applyInertia() {
        if (animationId) cancelAnimationFrame(animationId);
        
        function animate() {
            velocity *= 0.95; // 감속
            slider.scrollLeft -= velocity * 1.5;
            
            if (Math.abs(velocity) > 0.5) {
                animationId = requestAnimationFrame(animate);
            }
        }
        animate();
    }

    // 휠 이벤트로 좌우 스크롤 (1920px만, 양쪽 끝에서는 페이지 스크롤로 전환)
    slider.addEventListener('wheel', function(e) {
        // 1024px 이하에서는 휠 스크롤 비활성화
        if (isMobile()) {
            return;
        }
        
        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
        const isAtEnd = slider.scrollLeft >= maxScrollLeft - 1;
        const isAtStart = slider.scrollLeft <= 1;
        
        // 시작점에서 위로 스크롤 시 → 페이지 위로 이동
        if (isAtStart && e.deltaY < 0) {
            return; // 페이지 스크롤 허용
        }
        
        // 끝점에서 아래로 스크롤 시 → 페이지 아래로 이동
        if (isAtEnd && e.deltaY > 0) {
            return; // 페이지 스크롤 허용
        }
        
        // 중간 구간에서는 가로 스크롤 작동
        e.preventDefault();
        slider.scrollLeft += e.deltaY * 2.5;
    }, { passive: false });
    
    // ===== 반응형 네비게이션 =====
    const indicator = document.getElementById('episodeIndicator');
    const dots = indicator ? indicator.querySelectorAll('.swipe_dot') : [];
    const prevBtn = document.getElementById('episodePrev');
    const nextBtn = document.getElementById('episodeNext');
    
    // 화살표 클릭 - 카드 여러 개 이동
    if (prevBtn && nextBtn && slider) {
        let isAnimating = false;
        
        prevBtn.addEventListener('click', function(e) {
            if (isAnimating) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const currentWidth = window.innerWidth;
            const cardWidth = currentWidth > 1024 ? 312 : (currentWidth > 440 ? 266 : 152);
            const gap = currentWidth > 1024 ? 50 : (currentWidth > 440 ? 28 : 12);
            const cardsToMove = currentWidth > 440 ? 2 : 1; // 1024px와 440px 모두 2개씩
            const scrollAmount = (cardWidth + gap) * cardsToMove;
            
            // 부드러운 스크롤
            isAnimating = true;
            const startScroll = slider.scrollLeft;
            const targetScrollPos = Math.max(0, startScroll - scrollAmount);
            const duration = 500;
            const startTime = performance.now();
            
            function animatePrev(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                slider.scrollLeft = startScroll + (targetScrollPos - startScroll) * easeProgress;
                
                if (progress < 1) {
                    requestAnimationFrame(animatePrev);
                } else {
                    isAnimating = false;
                }
            }
            
            requestAnimationFrame(animatePrev);
        });
        
        nextBtn.addEventListener('click', function(e) {
            if (isAnimating) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const currentWidth = window.innerWidth;
            const cardWidth = currentWidth > 1024 ? 312 : (currentWidth > 440 ? 266 : 152);
            const gap = currentWidth > 1024 ? 50 : (currentWidth > 440 ? 28 : 12);
            const cardsToMove = currentWidth > 440 ? 2 : 1; // 1024px와 440px 모두 2개씩
            const scrollAmount = (cardWidth + gap) * cardsToMove;
            
            // 부드러운 스크롤
            isAnimating = true;
            const startScroll = slider.scrollLeft;
            const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
            const targetScrollPos = Math.min(maxScrollLeft, startScroll + scrollAmount);
            const duration = 500;
            const startTime = performance.now();
            
            function animateNext(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                slider.scrollLeft = startScroll + (targetScrollPos - startScroll) * easeProgress;
                
                if (progress < 1) {
                    requestAnimationFrame(animateNext);
                } else {
                    isAnimating = false;
                }
            }
            
            requestAnimationFrame(animateNext);
        });
        
        // 화살표 활성화/비활성화
        function updateArrowState() {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            
            if (slider.scrollLeft <= 10) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
            
            if (slider.scrollLeft >= maxScroll - 10) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }
        
        slider.addEventListener('scroll', updateArrowState);
        updateArrowState(); // 초기 상태
    }
    
    // 스와이프 인디케이터 - 1024px/440px 공통
    if (dots.length > 0) {
        // 스크롤 시 활성 dot 업데이트
        slider.addEventListener('scroll', function() {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            const scrollPercent = (slider.scrollLeft / maxScroll) * 100;
            
            // 5개 dot 기준으로 활성화
            const activeIndex = Math.min(
                Math.floor(scrollPercent / 20),
                dots.length - 1
            );
            
            dots.forEach(function(dot, index) {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
        
        // dot 클릭 시 해당 위치로 스크롤
        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                const maxScroll = slider.scrollWidth - slider.clientWidth;
                const targetScroll = (maxScroll / (dots.length - 1)) * index;
                
                slider.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            });
        });
    }
});

// 비하인드 비디오 섹션 스택
window.addEventListener('DOMContentLoaded', function() {
    const section = document.querySelector('.behind_video');
    const wrapper = document.querySelector('.behind_video_wrapper');
    const videoItems = document.querySelectorAll('.video_item');
    
    if (!section || videoItems.length === 0 || !wrapper) return;
    
    let currentIndex = 0;
    
    // 반응형 체크
    function isMobile() {
        return window.innerWidth <= 440;
    }
    
    function isTablet() {
        return window.innerWidth > 440 && window.innerWidth <= 1024;
    }
    
    // 초기 스택 설정
    function setStack(activeIndex) {
        // 440px 이하에서는 스택 비활성화
        if (isMobile()) {
            videoItems.forEach((item) => {
                item.classList.remove('active', 'top', 'bottom');
            });
            return;
        }
        
        videoItems.forEach((item, index) => {
            // 모든 클래스 제거
            item.classList.remove('active', 'top', 'bottom');
            
            if (index === activeIndex) {
                // 활성화 - 중앙
                item.classList.add('active');
            } else if (index === (activeIndex - 1 + videoItems.length) % videoItems.length) {
                // 이전 아이템 - 위
                item.classList.add('top');
            } else if (index === (activeIndex + 1) % videoItems.length) {
                // 다음 아이템 - 아래
                item.classList.add('bottom');
            }
        });
    }
    
    // 초기 설정
    setStack(0);
    
    // 스크롤 이벤트 핸들러
    let ticking = false;
    let scrollHandler = null;
    
    // 스크롤 이벤트 함수
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const wrapperRect = wrapper.getBoundingClientRect();
                const sectionRect = section.getBoundingClientRect();
                
                // wrapper 스크롤 시작: wrapper.top이 0 이하
                // wrapper 스크롤 종료: wrapper.bottom이 viewport 높이 이하
                const isInScrollZone = wrapperRect.top <= 0 && wrapperRect.bottom >= window.innerHeight;
                
                if (isInScrollZone) {
                    // wrapper 내에서 스크롤된 거리
                    const scrolledDistance = -wrapperRect.top;
                    // wrapper의 전체 스크롤 가능 거리 (wrapper 높이 - viewport 높이)
                    const maxScrollDistance = wrapperRect.height - window.innerHeight;
                    // 진행도 (0 ~ 1)
                    const progress = Math.max(0, Math.min(1, scrolledDistance / maxScrollDistance));
                    
                    // 3개 아이템 기준: 0~0.33 = 0번, 0.33~0.66 = 1번, 0.66~1 = 2번
                    let targetIndex;
                    if (progress < 0.33) {
                        targetIndex = 0;
                    } else if (progress < 0.66) {
                        targetIndex = 1;
                    } else {
                        targetIndex = 2;
                    }
                    
                    // 인덱스 변경 시에만 스택 재배치
                    if (targetIndex !== currentIndex) {
                        currentIndex = targetIndex;
                        setStack(targetIndex);
                    }
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }
    
    // 스크롤 이벤트 등록/해제 함수
    function setupScrollEvent() {
        // 1024px 초과에서만 스크롤 이벤트 활성화
        if (window.innerWidth > 1024 && wrapper) {
            if (!scrollHandler) {
                scrollHandler = handleScroll;
                window.addEventListener('scroll', scrollHandler);
            }
        } else {
            // 1024px 이하에서는 스크롤 이벤트 제거
            if (scrollHandler) {
                window.removeEventListener('scroll', scrollHandler);
                scrollHandler = null;
            }
        }
    }
    
    // 초기 스크롤 이벤트 설정
    setupScrollEvent();
    
    // 리사이즈 시 스크롤 이벤트 재설정 + 스택 재설정
    window.addEventListener('resize', function() {
        setupScrollEvent();
        setStack(currentIndex);
    });
}); // END: Behind Video Section DOMContentLoaded

// ============================================================
// 드래그 이미지 섹션 - Matter.js 물리 엔진
// ============================================================
window.addEventListener('DOMContentLoaded', function() {
const draggableSection = document.querySelector('.draggable_section');
const draggableImages = document.querySelectorAll('.draggable_section .img_item');
const imageModal = document.querySelector('.image_modal');
const imageModalImg = imageModal ? imageModal.querySelector('.modal_content img') : null;
const imageModalClose = imageModal ? imageModal.querySelector('.modal_close') : null;

if (draggableSection && draggableImages.length > 0 && typeof Matter !== 'undefined') {
    
    // ==================== 반응형 체크 ====================
    function isMobileDrag() {
        return window.innerWidth <= 1024;
    }
    
    // ==================== 전역 변수 선언 (먼저!) ====================
    let draggedItem = null;
    let customCursor = null;
    let cursorMouseX = 0, cursorMouseY = 0, cursorFollowX = 0, cursorFollowY = 0;
    let isInsideSection = false;
    
    // ==================== 커스텀 커서 생성 함수 ====================
    function createCustomCursor() {
        if (customCursor) return; // 이미 있으면 생성하지 않음
        
        customCursor = document.createElement('div');
        customCursor.className = 'draggable-cursor';
        customCursor.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 110 110">
                <defs>
                    <filter id="drag-shadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
                    </filter>
                </defs>
                <circle cx="55" cy="55" r="50" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" stroke-width="2" filter="url(#drag-shadow)"/>
                <g transform="translate(55, 25)"><path d="M 0 0 L -4 6 L 4 6 Z" fill="white" opacity="0.95"/></g>
                <g transform="translate(55, 85)"><path d="M 0 0 L -4 -6 L 4 -6 Z" fill="white" opacity="0.95"/></g>
                <g transform="translate(25, 55)"><path d="M 0 0 L 6 -4 L 6 4 Z" fill="white" opacity="0.95"/></g>
                <g transform="translate(85, 55)"><path d="M 0 0 L -6 -4 L -6 4 Z" fill="white" opacity="0.95"/></g>
                <text x="55" y="50" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold" letter-spacing="1">MOVE</text>
                <text x="55" y="64" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold" letter-spacing="1">CLICK</text>
            </svg>
        `;
        document.body.appendChild(customCursor);
    }
    
    // ==================== 커스텀 커서 제거 함수 ====================
    function removeCustomCursor() {
        if (customCursor && customCursor.parentNode) {
            customCursor.parentNode.removeChild(customCursor);
            customCursor = null;
        }
    }
    
    // 초기 화면 크기에 따라 커서 생성
    if (!isMobileDrag()) {
        createCustomCursor();
    }
    
    function animateCursor() {
        if (isMobileDrag() || !customCursor) return; // 모바일이거나 커서가 없으면 중단
        
        const easing = draggedItem ? 1 : 0.4;
        
        cursorFollowX += (cursorMouseX - cursorFollowX) * easing;
        cursorFollowY += (cursorMouseY - cursorFollowY) * easing;
        customCursor.style.left = `${cursorFollowX}px`;
        customCursor.style.top = `${cursorFollowY}px`;
        requestAnimationFrame(animateCursor);
    }
    
    if (!isMobileDrag()) {
        animateCursor();
    }
    
    // 데스크탑 - 커서 이벤트
    if (!isMobileDrag()) {
        draggableSection.addEventListener('mousemove', (e) => {
            if (isMobileDrag()) return; // 실행 중 체크
            
            cursorMouseX = e.clientX;
            cursorMouseY = e.clientY;
            
            if (!isInsideSection && customCursor) {
                isInsideSection = true;
                customCursor.style.display = 'block';
                customCursor.style.opacity = '1';
            }
        });
        
        draggableSection.addEventListener('mouseleave', (e) => {
            if (isMobileDrag()) return; // 실행 중 체크
            
            isInsideSection = false;
            if (customCursor) {
                customCursor.style.opacity = '0';
                setTimeout(() => {
                    if (!isInsideSection && customCursor) {
                        customCursor.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        // 전역 마우스 이동 감지 (실제 콘텐츠 가시성 기반)
        document.addEventListener('mousemove', (e) => {
            if (isMobileDrag()) return; // 실행 중 체크
            
            // ===== 근본 해결: Behind Video 가시성 체크 =====
            const behindVideoSection = document.querySelector('.behind_video');
            if (behindVideoSection) {
                const behindRect = behindVideoSection.getBoundingClientRect();
                // Behind Video가 화면 상단 절반 이상 보이면 커서 숨김
                const isBehindVisible = behindRect.top < window.innerHeight * 0.5;
                
                if (isBehindVisible) {
                    if (isInsideSection && customCursor) {
                        isInsideSection = false;
                        customCursor.style.opacity = '0';
                        setTimeout(() => {
                            if (!isInsideSection && customCursor) {
                                customCursor.style.display = 'none';
                            }
                        }, 300);
                    }
                    return; // Behind Video가 보이면 커서 로직 중단
                }
            }
            
            // ===== 기존 로직: Draggable 영역 감지 =====
            const rect = draggableSection.getBoundingClientRect();
            const isInside = (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );
            
            if (isInside) {
                cursorMouseX = e.clientX;
                cursorMouseY = e.clientY;
                
                if (!isInsideSection && customCursor) {
                    isInsideSection = true;
                    customCursor.style.display = 'block';
                    customCursor.style.opacity = '1';
                }
            } else {
                // 섹션 밖에 있을 때 커서 숨김
                if (isInsideSection && customCursor) {
                    isInsideSection = false;
                    customCursor.style.opacity = '0';
                    setTimeout(() => {
                        if (!isInsideSection && customCursor) {
                            customCursor.style.display = 'none';
                        }
                    }, 300);
                }
            }
        });
    }
    
    // ==================== 1920px: ScrollTrigger 핀 고정 (데스크탑만) ====================
    if (!isMobileDrag()) {
        gsap.registerPlugin(ScrollTrigger);
        
        ScrollTrigger.create({
            trigger: draggableSection,
            start: "top top",
            end: "+=200%",
            pin: true,
            pinSpacing: true, // true로 변경: 물리적으로 다음 섹션을 밀어냄
            anticipatePin: 1,
            markers: false
        });
    }
    
    // ==================== Fade In 애니메이션 ====================
    draggableImages.forEach((img, i) => {
        gsap.to(img, {
            opacity: 1,
            duration: 0.8,
            delay: i * 0.08,
            ease: "power2.out"
        });
    });
    
    // ==================== Matter.js 초기화 (1920px만) ====================
    if (!isMobileDrag()) {
        const { Engine, World, Bodies, Body, Events } = Matter;
    
    const sectionRect = draggableSection.getBoundingClientRect();
    const engine = Engine.create();
    engine.world.gravity.y = 0; // 중력 없음
    
    // 벽 생성
    const wallThickness = 50;
    const wallOptions = { 
        isStatic: true, 
        restitution: 0.5,  // 벽 반발력
        friction: 0.1 
    };
    
    const walls = [
        Bodies.rectangle(sectionRect.width / 2, -wallThickness / 2, sectionRect.width, wallThickness, wallOptions), // 상단
        Bodies.rectangle(sectionRect.width / 2, sectionRect.height + wallThickness / 2, sectionRect.width, wallThickness, wallOptions), // 하단
        Bodies.rectangle(-wallThickness / 2, sectionRect.height / 2, wallThickness, sectionRect.height, wallOptions), // 좌측
        Bodies.rectangle(sectionRect.width + wallThickness / 2, sectionRect.height / 2, wallThickness, sectionRect.height, wallOptions) // 우측
    ];
    
    World.add(engine.world, walls);
    
    // 이미지 바디 생성
    const imageBodies = [];
    
    draggableImages.forEach((imgElement) => {
        // DOM 초기 위치 저장 (transform 없는 상태)
        gsap.set(imgElement, { x: 0, y: 0, rotation: 0 });
        
        // CSS에서 설정된 left, top 값을 직접 가져오기 (섹션 기준 좌표)
        const computedStyle = window.getComputedStyle(imgElement);
        const cssLeft = parseFloat(computedStyle.left) || 0;
        const cssTop = parseFloat(computedStyle.top) || 0;
        
        const rect = imgElement.getBoundingClientRect();
        // CSS 좌표 기준으로 중심점 계산
        const x = cssLeft + rect.width / 2;
        const y = cssTop + rect.height / 2;
        
        const body = Bodies.rectangle(x, y, rect.width, rect.height, {
            restitution: 0.5,      // 객체 간 반발력 (0.4 → 0.5 증가)
            friction: 0.15,        // 마찰력 (0.2 → 0.15 감소, 더 미끄럽게)
            frictionAir: 0.03,     // 공기 저항 (0.05 → 0.03 감소, 더 오래 움직임)
            density: 0.001,
            frictionStatic: 0.4,   // 정적 마찰 (0.5 → 0.4 감소)
            slop: 0.05             // 충돌 허용 오차 (떨림 방지)
        });
        
        World.add(engine.world, body);
        
        imageBodies.push({
            element: imgElement,
            body: body,
            isDragging: false,
            width: rect.width,
            height: rect.height,
            initialLeft: cssLeft,
            initialTop: cssTop
        });
    });
    
    // ==================== 드래그 처리 ====================
    let dragStartTime = 0;
    let dragStartPos = { x: 0, y: 0 };
    let mouseOffset = { x: 0, y: 0 };
    let lastMousePos = { x: 0, y: 0 };
    let lastMoveTime = 0;
    let velocityTracker = { x: 0, y: 0 };
    
    // 마우스 다운 (데스크탑만)
    draggableSection.addEventListener('mousedown', (e) => {
        // 1024px 이하에서는 드래그 비활성화
        if (isMobileDrag()) return;
        
        const rect = draggableSection.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 클릭한 위치의 객체 찾기
        for (let i = imageBodies.length - 1; i >= 0; i--) {
            const item = imageBodies[i];
            const elemRect = item.element.getBoundingClientRect();
            const elemX = elemRect.left - rect.left;
            const elemY = elemRect.top - rect.top;
            
            if (mouseX >= elemX && mouseX <= elemX + elemRect.width &&
                mouseY >= elemY && mouseY <= elemY + elemRect.height) {
                
                draggedItem = item;
                dragStartTime = Date.now();
                dragStartPos = { x: mouseX, y: mouseY };
                
                // 마우스와 바디 중심의 오프셋
                mouseOffset = {
                    x: mouseX - item.body.position.x,
                    y: mouseY - item.body.position.y
                };
                
                item.isDragging = true;
                
                // 드래그 중에는 static으로 설정 (물리 영향 받지 않음)
                Body.setStatic(item.body, true);
                
                gsap.set(item.element, { zIndex: 100 });
                
                e.preventDefault();
                break;
            }
        }
    });
    
    // 마우스 무브 (데스크탑만)
    draggableSection.addEventListener('mousemove', (e) => {
        if (!draggedItem || isMobileDrag()) return;
        
        const rect = draggableSection.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const now = performance.now();
        
        // 실시간 속도 계산 (마지막 움직임 기준)
        if (lastMoveTime > 0) {
            const dt = now - lastMoveTime;
            if (dt > 0) {
                velocityTracker.x = (mouseX - lastMousePos.x) / dt * 16; // 60fps 기준
                velocityTracker.y = (mouseY - lastMousePos.y) / dt * 16;
            }
        }
        
        lastMousePos = { x: mouseX, y: mouseY };
        lastMoveTime = now;
        
        // 새 위치 계산
        const newX = mouseX - mouseOffset.x;
        const newY = mouseY - mouseOffset.y;
        
        // 경계 내로 제한
        const clampedX = Math.max(
            draggedItem.width / 2,
            Math.min(sectionRect.width - draggedItem.width / 2, newX)
        );
        const clampedY = Math.max(
            draggedItem.height / 2,
            Math.min(sectionRect.height - draggedItem.height / 2, newY)
        );
        
        // velocity를 0으로 설정하여 물리 영향 완전 차단
        Body.setVelocity(draggedItem.body, { x: 0, y: 0 });
        Body.setAngularVelocity(draggedItem.body, 0);
        Body.setPosition(draggedItem.body, { x: clampedX, y: clampedY });
        
        e.preventDefault();
    });
    
    // 마우스 업
    function handleMouseUp(e) {
        if (!draggedItem) return;
        
        const dragDuration = Date.now() - dragStartTime;
        const rect = draggableSection.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const dragDistance = Math.hypot(mouseX - dragStartPos.x, mouseY - dragStartPos.y);
        
        // 짧은 클릭 → 모달 오픈
        if (dragDuration < 200 && dragDistance < 5) {
            const imgSrc = draggedItem.element.querySelector('img').src;
            imageModalImg.src = imgSrc;
            imageModal.classList.add('active');
            
            // body 참조를 미리 저장
            const releasedBody = draggedItem.body;
            
            // 완전 정지
            Body.setVelocity(releasedBody, { x: 0, y: 0 });
            Body.setAngularVelocity(releasedBody, 0);
            
            // static 해제는 약간의 딜레이 후 (충격파 방지)
            setTimeout(() => {
                Body.setStatic(releasedBody, false);
            }, 50);
        }
        // 드래그 이동 → 관성 적용
        else if (dragDistance > 10) {
            // 실시간 추적된 속도 사용 (마지막 움직임 기준)
            let finalVelocityX = velocityTracker.x;
            let finalVelocityY = velocityTracker.y;
            
            // 최대 속도 제한
            const maxVelocity = 5;
            const currentSpeed = Math.hypot(finalVelocityX, finalVelocityY);
            
            if (currentSpeed > maxVelocity) {
                const scale = maxVelocity / currentSpeed;
                finalVelocityX *= scale;
                finalVelocityY *= scale;
            }
            
            // 아주 느린 속도는 0으로 (미세 떨림 방지)
            if (Math.abs(finalVelocityX) < 0.1) finalVelocityX = 0;
            if (Math.abs(finalVelocityY) < 0.1) finalVelocityY = 0;
            
            // body 참조를 미리 저장 (setTimeout 내에서 안전하게 사용)
            const releasedBody = draggedItem.body;
            
            // static 해제
            Body.setStatic(releasedBody, false);
            
            // 다음 프레임에 속도 적용 (충돌 해결 후)
            setTimeout(() => {
                Body.setVelocity(releasedBody, { 
                    x: finalVelocityX, 
                    y: finalVelocityY 
                });
                Body.setAngularVelocity(releasedBody, 0);
            }, 16); // 1프레임 대기
        }
        // 제자리 → 정지
        else {
            Body.setStatic(draggedItem.body, false);
            Body.setVelocity(draggedItem.body, { x: 0, y: 0 });
            Body.setAngularVelocity(draggedItem.body, 0);
        }
        
        const releasedElement = draggedItem.element;
        draggedItem.isDragging = false;
        draggedItem = null;
        
        // 속도 추적 초기화
        velocityTracker = { x: 0, y: 0 };
        lastMoveTime = 0;
        
        setTimeout(() => {
            gsap.set(releasedElement, { zIndex: 'auto' });
        }, 100);
    }
    
    draggableSection.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseup', handleMouseUp);
    
    // ==================== 물리 엔진 업데이트 ====================
    let lastTime = performance.now();
    
    function updatePhysics() {
        const now = performance.now();
        const delta = Math.min(now - lastTime, 33); // 최대 33ms로 제한 (30fps 최저)
        lastTime = now;
        
        // Matter.js 업데이트
        Engine.update(engine, delta);
        
        // DOM 동기화 (reflow 최소화)
        imageBodies.forEach(({ element, body, isDragging, initialLeft, initialTop, width, height }) => {
            // Matter.js 바디 중심점에서 DOM의 left, top 위치 계산
            const targetX = body.position.x - width / 2;
            const targetY = body.position.y - height / 2;
            
            // 초기 위치 기준으로 translate 값 계산
            const translateX = targetX - initialLeft;
            const translateY = targetY - initialTop;
            
            // 드래그 중이 아닐 때만 미세한 떨림 필터링
            if (!isDragging) {
                const currentTransform = element.style.transform || '';
                const currentMatch = currentTransform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
                
                if (currentMatch) {
                    const currentX = parseFloat(currentMatch[1]);
                    const currentY = parseFloat(currentMatch[2]);
                    
                    const diffX = Math.abs(translateX - currentX);
                    const diffY = Math.abs(translateY - currentY);
                    
                    // 변화가 미세하면 업데이트 스킵 (떨림 방지)
                    if (diffX < 0.5 && diffY < 0.5) return;
                }
            }
            
            // transform 직접 설정 (드래그 중에도 항상 업데이트!)
            element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(0deg)`;
        });
        
        requestAnimationFrame(updatePhysics);
    }
    
    updatePhysics();
    
    } // END: if (!isMobileDrag()) - Matter.js 초기화 블록
    
    // ==================== 이미지 클릭 모달 (모든 화면) ====================
    // 1024/440에서는 클릭만 활성화
    if (isMobileDrag()) {
        draggableImages.forEach((imgElement) => {
            imgElement.addEventListener('click', (e) => {
                const imgSrc = imgElement.querySelector('img').src;
                imageModalImg.src = imgSrc;
                imageModal.classList.add('active');
                e.preventDefault();
            });
        });
    }
    
    // ==================== 화면 크기 변경 감지 ====================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isMobileDrag()) {
                // 모바일 모드로 전환: 커스텀 커서 제거
                removeCustomCursor();
                isInsideSection = false;
            } else {
                // 데스크탑 모드로 전환: 커스텀 커서 생성
                if (!customCursor) {
                    createCustomCursor();
                    animateCursor();
                }
            }
        }, 200); // 200ms 디바운스
    });
    
    // ==================== 모달 닫기 ====================
    imageModalClose.addEventListener('click', () => {
        imageModal.classList.remove('active');
    });
    
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('active');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            imageModal.classList.remove('active');
        }
    });
} // END: if draggableSection

}); // END: Draggable Section DOMContentLoaded

// ============ COMMUNITY CHAT EVENT SECTION ============
window.addEventListener('DOMContentLoaded', function() {

const ASSETS = {
    heart: {
        active: 'https://www.figma.com/api/mcp/asset/cd975f70-29e7-416d-b948-0b0bf0741b0a',
        inactive: 'https://www.figma.com/api/mcp/asset/e9a0c0f2-0487-481c-a08b-2d9ca19865b2'
    },
    profileBg: [
        'https://www.figma.com/api/mcp/asset/953db616-409e-4919-996d-6953483c5840',
        'https://www.figma.com/api/mcp/asset/80e87da1-20be-43bb-89d3-7e0db1ef6b6c',
        'https://www.figma.com/api/mcp/asset/fd5abdae-23df-4e9a-afc2-db221c180faf'
    ],
    character: 'https://www.figma.com/api/mcp/asset/a70db404-ce08-4a17-af87-c1bb40d0c76a'
};

const CONFIG = {
    maxComments: 100,
    commentsPerLoad: 10
};

const DATA = {
    maleNames: ['jihoon_kim', 'seungho_lee', 'minwoo_park', 'taehyun_choi', 'jaewon_jung'],
    femaleNames: ['soyeon_kim', 'jiyeon_lee', 'hyejin_park', 'minji_choi', 'yuna_jung'],
    comments: [
        'The Glory has such an intense storyline! Moon Dong-eun\'s revenge was so well executed. Can\'t wait for more dramas like this!',
        'This is my top 2 favorite K-drama list! Absolutely must-watch masterpieces:\n1. Mr. Sunshine - The cinematography is breathtaking\n2. Crash Landing on You - Perfect romance with great chemistry',
        'Studio Dragon never disappoints! The quality of their productions is insane. If anyone is looking for similar high-quality dramas, drop recommendations here!',
        'Moon Dong-eun\'s character is incredibly strong. Could I have endured what she went through? Probably not. Her resilience is admirable. Also, Park Sung-hoon\'s acting as Jeon Jae-jun was phenomenal!',
        'Just finished watching Season 2! I have a theory that Jeon Jae-jun\'s fate will be even darker than we expected. What do you guys think?',
        'The symbolism with the baduk (Go) stones throughout the series was brilliant. Every detail had meaning!',
        'Song Hye-kyo\'s performance brought so many emotions. Her portrayal of trauma and resilience was Oscar-worthy!',
        'I love how the series tackles the issue of school bullying. It\'s a serious problem in Korea.',
        'The cinematography is absolutely stunning. Every frame could be a painting!',
        'Anyone else completely obsessed with the OST? It fits the mood perfectly.',
        'The supporting characters are just as compelling as the leads. Great writing!',
        'I binged the entire series in one weekend. No regrets!',
        'The revenge was so satisfying to watch. Justice served!',
        'Park Sung-hoon deserves all the awards for his performance.',
        'Can we talk about that ending though? I need Season 3 NOW!'
    ],
    replyTexts: [
        'Totally agree! The story keeps you on the edge of your seat.',
        'I couldn\'t have said it better myself!',
        'This is exactly what I thought! Great minds think alike.',
        'I have the same opinion! So well done.',
        'Yes! The execution was perfect.',
        'Absolutely! Can\'t wait for more content.',
        'Same here! I was glued to the screen.',
        'You took the words right out of my mouth!',
        'I felt the exact same way watching it.',
        'This! A thousand times this!',
        'Couldn\'t agree more with this take.',
        'Finally someone said it!',
        'This is the comment I was looking for!',
        'You nailed it! Perfect summary.',
        'My thoughts exactly! Well said.'
    ],
    timePeriods: ['3 Days', '1 Week', '2 Weeks', '3 Weeks', '1 Month', '2 Month', '3 Month', '4 Month', '5 Month', '6 Month', '7 Month', '8 Month', '9 Month', '10 Month', '11 Month', '1 Year', '2 Year']
};

// ============ STATE ============

const state = {
    currentUser: null,
    currentFilter: 'like',
    originalOrder: [],
    totalLoadedComments: 7,
    cursor: { x: 0, y: 0, followX: 0, followY: 0 },
    scroll: { isScrolling: false, startY: 0, scrollTop: 0 }
};

// ============ UTILITY FUNCTIONS ============

const random = {
    item: arr => arr[Math.floor(Math.random() * arr.length)],
    number: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    boolean: () => Math.random() < 0.5,
    timestamp: () => {
        const periods = DATA.timePeriods;
        const period = random.item(periods);
        const [value, unit] = period.split(' ');
        const multipliers = { Days: 1, Week: 7, Weeks: 7, Month: 30, Year: 365 };
        const days = parseInt(value) * (multipliers[unit] || 1);
        return Date.now() - (days * 24 * 60 * 60 * 1000);
    },
    recentTimestamp: () => {
        // 최근 시간만 (0~23시간 사이)
        const hours = random.number(0, 23);
        return Date.now() - (hours * 60 * 60 * 1000);
    }
};

function getTimeDifference(timestamp) {
    const diff = Math.max(0, Date.now() - timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds}s`;
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    if (weeks < 4) return `${weeks}w`;
    if (months < 12) return `${months}mo`;
    return `${years}y`;
}

function initializeUser() {
    if (state.currentUser) return;
    
    const isMale = random.boolean();
    state.currentUser = {
        username: random.item(isMale ? DATA.maleNames : DATA.femaleNames),
        isMale,
        bgColor: random.item(ASSETS.profileBg),
        character: ASSETS.character
    };
}

// ============ DOM SELECTORS ============

const elements = {
    chatScrollArea: document.querySelector('.chat_scroll_area'),
    chatInput: document.querySelector('.chat_input'),
    sendButton: document.querySelector('.btn_send'),
    commentsList: document.querySelector('.comments_list'),
    moreWrapper: document.querySelector('.more_comments_wrapper'),
    moreButton: document.querySelector('.btn_more_comments'),
    filterButtons: document.querySelectorAll('.filter_btn')
};

// ============ 반응형 체크 ============
function isMobileChat() {
    return window.innerWidth <= 1024;
}

// ============ CUSTOM CURSOR (1920px 전용) ============
let customCursor = null;

function initCustomCursor() {
    if (isMobileChat() || customCursor) return;
    
    customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    customCursor.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
                <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
                </filter>
            </defs>
            <circle cx="50" cy="50" r="45" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" stroke-width="2" filter="url(#shadow)"/>
            <g transform="translate(50, 20)">
                <path d="M 0 0 L -5 8 L 5 8 Z" fill="white" opacity="0.95"/>
                <path d="M 0 0 L -5 8 L 5 8 Z" fill="none" stroke="white" stroke-width="0.5"/>
            </g>
            <text x="50" y="56" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold" letter-spacing="1">SCROLL</text>
            <g transform="translate(50, 80)">
                <path d="M 0 0 L -5 -8 L 5 -8 Z" fill="white" opacity="0.95"/>
                <path d="M 0 0 L -5 -8 L 5 -8 Z" fill="none" stroke="white" stroke-width="0.5"/>
            </g>
        </svg>
    `;
    document.body.appendChild(customCursor);
    
    function animateCursor() {
        if (!customCursor) return;
        const ease = 0.15;
        state.cursor.followX += (state.cursor.x - state.cursor.followX) * ease;
        state.cursor.followY += (state.cursor.y - state.cursor.followY) * ease;
        customCursor.style.left = `${state.cursor.followX}px`;
        customCursor.style.top = `${state.cursor.followY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    elements.chatScrollArea.addEventListener('mouseenter', () => {
        if (!customCursor) return;
        customCursor.style.display = 'block';
        setTimeout(() => {
            if (customCursor) customCursor.style.opacity = '1';
        }, 10);
    });
    
    elements.chatScrollArea.addEventListener('mouseleave', () => {
        if (!customCursor) return;
        customCursor.style.opacity = '0';
        setTimeout(() => {
            if (customCursor) customCursor.style.display = 'none';
        }, 300);
    });
    
    elements.chatScrollArea.addEventListener('mousemove', (e) => {
        state.cursor.x = e.clientX;
        state.cursor.y = e.clientY;
    });
}

// ============ DRAG SCROLL (1920px 전용) ============
function initDragScroll() {
    if (isMobileChat()) return;
    
    elements.chatScrollArea.addEventListener('mousedown', (e) => {
        // 클릭 가능한 요소들은 제외
        if (e.target.closest('.chat_box') || e.target.closest('.profile_icon') || 
            e.target.closest('.name') || e.target.closest('.heart_icon') || 
            e.target.closest('.btn_comment') || e.target.closest('.btn_replies') ||
            e.target.closest('.reply_input') || e.target.closest('.btn_reply_send') ||
            e.target.closest('.like_box') || e.target.closest('.comment_actions')) {
            console.log('[DRAG] Skipping drag for interactive element');
            return;
        }
        console.log('[DRAG] Starting drag scroll');
        state.scroll.isScrolling = true;
        state.scroll.startY = e.pageY - elements.chatScrollArea.offsetTop;
        state.scroll.scrollTop = elements.chatScrollArea.scrollTop;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!state.scroll.isScrolling) return;
        e.preventDefault();
        const y = e.pageY - elements.chatScrollArea.offsetTop;
        const walk = (y - state.scroll.startY) * 2;
        elements.chatScrollArea.scrollTop = state.scroll.scrollTop - walk;
    });
    
    document.addEventListener('mouseup', () => {
        console.log('[DRAG] Mouse up (document)');
        state.scroll.isScrolling = false;
    });
    
    elements.chatScrollArea.addEventListener('mouseleave', () => {
        console.log('[DRAG] Mouse leave');
        state.scroll.isScrolling = false;
    });
    
    // 클릭 이벤트가 제대로 작동하도록 보장
    console.log('[DRAG INIT] Drag scroll initialized for 1920px');
}

// 1920px 전용 기능 초기화
console.log('[INIT] Is mobile chat?', isMobileChat());
console.log('[INIT] Window width:', window.innerWidth);

if (!isMobileChat()) {
    console.log('[INIT] Initializing 1920px features...');
    initCustomCursor();
    initDragScroll();
} else {
    console.log('[INIT] Skipping 1920px features (mobile mode)');
}

// ============ FILTER BUTTONS ============

elements.filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.textContent.toLowerCase();
        
        if (state.currentFilter === filter) return;
        
        elements.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (filter === 'update') {
            // 기존 댓글 백업
            state.originalOrder = Array.from(elements.commentsList.querySelectorAll('.comment_item')).map(item => ({
                html: item.outerHTML
            }));
            
            // 기존 댓글 전부 제거
            elements.commentsList.querySelectorAll('.comment_item').forEach(item => item.remove());
            
            // 최신순으로 새 댓글 생성 (답글 0~10개, 최근 시간만)
            generateComments(state.totalLoadedComments, 10, true);
        } else {
            restoreOriginalOrder();
        }
        
        state.currentFilter = filter;
    });
});

function restoreOriginalOrder() {
    const currentComments = elements.commentsList.querySelectorAll('.comment_item');
    currentComments.forEach(comment => comment.remove());
    
    state.originalOrder.forEach(item => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.html;
        const commentElement = tempDiv.firstElementChild;
        reattachCommentListeners(commentElement);
        elements.commentsList.insertBefore(commentElement, elements.moreWrapper);
    });
}

// 댓글 생성 공통 함수 (MORE 버튼 & Update 필터에서 사용)
function generateComments(count, maxReplies = 20, useRecentTime = false) {
    // 시간순 정렬을 위한 타임스탬프 배열 생성
    const timestamps = [];
    for (let i = 0; i < count; i++) {
        // useRecentTime이 true면 최근 시간만 생성
        timestamps.push(useRecentTime ? random.recentTimestamp() : random.timestamp());
    }
    // 최신순 정렬 (큰 값 = 최근, 내림차순)
    timestamps.sort((a, b) => b - a);
    
    for (let i = 0; i < count; i++) {
        const isMale = random.boolean();
        const username = random.item(isMale ? DATA.maleNames : DATA.femaleNames);
        const bgColor = random.item(ASSETS.profileBg);
        const commentText = random.item(DATA.comments);
        const timestamp = timestamps[i];
        const timeDiff = getTimeDifference(timestamp);
        const likes = random.number(100, 5100);
        const isLiked = Math.random() > 0.3;
        const replyCount = random.number(0, maxReplies);
        
        const newComment = document.createElement('div');
        newComment.className = 'comment_item';
        newComment.setAttribute('data-timestamp', timestamp);
        
        newComment.innerHTML = `
            <div class="profile">
                <div class="profile_icon">
                    <img class="icon_bg" src="${bgColor}" alt="">
                    <img class="icon_img" src="${ASSETS.character}" alt="">
                </div>
                <div class="profile_name">
                    <span class="name">${username}</span>
                    <span class="time">${timeDiff}</span>
                </div>
            </div>
            <div class="content_row">
                <div class="chat_box">
                    <p>${commentText}</p>
                </div>
                <div class="like_box">
                    <img class="heart_icon ${isLiked ? 'active' : ''}" 
                         src="${isLiked ? ASSETS.heart.active : ASSETS.heart.inactive}" 
                         data-active-src="${ASSETS.heart.active}" 
                         data-inactive-src="${ASSETS.heart.inactive}" alt="">
                    <span class="like_count">${likes.toLocaleString()}</span>
                </div>
            </div>
            <div class="comment_actions">
                <button class="btn_comment">Comment</button>
                <button class="btn_replies ${replyCount === 0 ? 'hidden' : ''}">${replyCount} Comments</button>
            </div>
            <div class="replies_container">
                <div class="reply_input_wrapper">
                    <input type="text" class="reply_input" placeholder="Write a reply...">
                    <button class="btn_reply_send">Reply</button>
                </div>
            </div>
        `;
        
        elements.commentsList.insertBefore(newComment, elements.moreWrapper);
        attachCommentListeners(newComment);
        
        // replyCount가 0보다 크면 답글 미리 생성
        if (replyCount > 0) {
            const repliesContainer = newComment.querySelector('.replies_container');
            const replyInputWrapper = repliesContainer.querySelector('.reply_input_wrapper');
            const btn = newComment.querySelector('.btn_replies');
            const commentBtn = newComment.querySelector('.btn_comment');
            
            const replyElements = [];
            for (let j = 0; j < replyCount; j++) {
                const replyText = random.item(DATA.replyTexts);
                const replyTimestamp = timestamp - random.number(1, 3600) * 1000; // 댓글보다 이전 시간
                const replyElement = createReplyElement(replyText, replyTimestamp, false);
                repliesContainer.insertBefore(replyElement, replyInputWrapper);
                replyElements.push(replyElement);
            }
            
            // 답글에 fade-in 애니메이션 적용
            setTimeout(() => {
                replyElements.forEach(el => el.classList.add('fade-in'));
            }, 50);
            
            // 답글 개수 표시 및 버튼 상태 업데이트
            btn.textContent = `${replyCount} Comments`;
            btn.classList.remove('hidden');
            commentBtn.classList.add('hidden');
        }
    }
}

// ============ HEART CLICK HANDLER ============

function handleHeartClick(e) {
    if (!e.target.classList.contains('heart_icon')) return;
    
    console.log('[HEART] Clicked!', e.target);
    const heart = e.target;
    const likeBox = heart.closest('.like_box') || heart.closest('.reply_like_box');
    if (!likeBox) {
        console.log('[HEART] No like box found');
        return;
    }
    
    const likeCountSpan = likeBox.querySelector('.like_count');
    if (!likeCountSpan) {
        console.log('[HEART] No like count span found');
        return;
    }
    
    let currentCount = parseInt(likeCountSpan.textContent.replace(/,/g, ''));
    
    const isActive = heart.classList.toggle('active');
    heart.src = ASSETS.heart[isActive ? 'active' : 'inactive'];
    likeCountSpan.textContent = (currentCount + (isActive ? 1 : -1)).toLocaleString();
    console.log('[HEART] Toggled to:', isActive, 'Count:', likeCountSpan.textContent);
}

// ============ EVENT LISTENERS ATTACHMENT ============

function attachCommentListeners(commentElement) {
    console.log('[LISTENER] Attaching to:', commentElement);
    commentElement.addEventListener('click', handleHeartClick);
    commentElement.addEventListener('click', handleReplyClick);
    
    const replyInput = commentElement.querySelector('.reply_input');
    const replySendBtn = commentElement.querySelector('.btn_reply_send');
    
    if (replyInput && replySendBtn) {
        // Enter 키로 답글 전송
        replyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && replyInput.value.trim()) {
                e.preventDefault();
                const repliesContainer = commentElement.querySelector('.replies_container');
                const btn = commentElement.querySelector('.btn_replies');
                addUserReply(repliesContainer, replyInput.value.trim(), btn);
                replyInput.value = '';
            }
        });
        
        // 버튼 클릭으로 답글 전송
        replySendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (replyInput.value.trim()) {
                const repliesContainer = commentElement.querySelector('.replies_container');
                const btn = commentElement.querySelector('.btn_replies');
                addUserReply(repliesContainer, replyInput.value.trim(), btn);
                replyInput.value = '';
            }
        });
    }
}

function reattachCommentListeners(commentElement) {
    const newElement = commentElement.cloneNode(true);
    commentElement.parentNode.replaceChild(newElement, commentElement);
    attachCommentListeners(newElement);
    return newElement;
}

// ============ CHAT INPUT ============

function createCommentElement(commentText, timestamp) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment_item new-comment';
    commentDiv.setAttribute('data-timestamp', timestamp);
    
    const timeDiff = getTimeDifference(timestamp);
    
    commentDiv.innerHTML = `
        <div class="profile">
            <div class="profile_icon">
                <img class="icon_bg" src="${state.currentUser.bgColor}" alt="">
                <img class="icon_img" src="${state.currentUser.character}" alt="">
            </div>
            <div class="profile_name">
                <span class="name">${state.currentUser.username}</span>
                <span class="time">${timeDiff}</span>
            </div>
        </div>
        <div class="content_row">
            <div class="chat_box">
                <p>${commentText}</p>
            </div>
            <div class="like_box">
                <img class="heart_icon" src="${ASSETS.heart.inactive}" 
                     data-active-src="${ASSETS.heart.active}" 
                     data-inactive-src="${ASSETS.heart.inactive}" alt="">
                <span class="like_count">0</span>
            </div>
        </div>
        <div class="comment_actions">
            <button class="btn_comment">Comment</button>
            <button class="btn_replies hidden">0 Comments</button>
        </div>
        <div class="replies_container">
            <div class="reply_input_wrapper">
                <input type="text" class="reply_input" placeholder="Write a reply...">
                <button class="btn_reply_send">Reply</button>
            </div>
        </div>
    `;
    
    return commentDiv;
}

function updateAllUserTimestamps() {
    document.querySelectorAll('[data-timestamp]').forEach(comment => {
        const timestamp = parseInt(comment.getAttribute('data-timestamp'));
        const timeElement = comment.querySelector('.time');
        if (timeElement) {
            const diff = Date.now() - timestamp;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            
            // 24시간(1일) 이하만 실시간 업데이트
            if (hours < 24) {
                timeElement.textContent = getTimeDifference(timestamp);
            }
            // 1일 이상은 업데이트하지 않음 (고정값 유지)
        }
    });
}

function addNewComment() {
    const commentText = elements.chatInput.value.trim();
    if (!commentText) return;
    
    initializeUser();
    const timestamp = Date.now();
    const newComment = createCommentElement(commentText, timestamp);
    elements.commentsList.insertBefore(newComment, elements.commentsList.firstChild);
    
    attachCommentListeners(newComment);
    setTimeout(() => newComment.classList.add('fade-in'), 10);
    
    elements.chatInput.value = '';
    updateAllUserTimestamps();
    
    // 스크롤을 최상단으로 부드럽게 이동
    elements.chatScrollArea.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

elements.sendButton.addEventListener('click', addNewComment);
elements.chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNewComment();
});

// ============ REPLY FUNCTIONALITY ============

function handleReplyClick(e) {
    if (e.target.classList.contains('btn_comment')) {
        const commentItem = e.target.closest('.comment_item');
        const repliesContainer = commentItem.querySelector('.replies_container');
        const btn = commentItem.querySelector('.btn_replies');
        
        const randomReply = random.item(DATA.replyTexts);
        const timestamp = Date.now() - random.number(1, 60) * 1000;
        
        const newReply = createReplyElement(randomReply, timestamp);
        const replyInputWrapper = repliesContainer.querySelector('.reply_input_wrapper');
        repliesContainer.insertBefore(newReply, replyInputWrapper);
        
        repliesContainer.classList.add('show');
        setTimeout(() => newReply.classList.add('fade-in'), 10);
        
        const currentCount = parseInt(btn.textContent) || 0;
        btn.textContent = `${currentCount + 1} Comments`;
        btn.classList.remove('hidden');
        e.target.classList.add('hidden');
    }
    
    if (e.target.classList.contains('btn_replies')) {
        const commentItem = e.target.closest('.comment_item');
        const repliesContainer = commentItem.querySelector('.replies_container');
        repliesContainer.classList.toggle('show');
        e.target.classList.toggle('active');
    }
}

function createReplyElement(text, timestamp, isUserReply = false) {
    let name, bgColor;
    
    if (isUserReply) {
        // 사용자 답글인 경우
        name = state.currentUser.username;
        bgColor = state.currentUser.bgColor;
    } else {
        // 랜덤 답글인 경우
        const isMale = random.boolean();
        name = random.item(isMale ? DATA.maleNames : DATA.femaleNames);
        bgColor = random.item(ASSETS.profileBg);
    }
    
    const timeDiff = getTimeDifference(timestamp);
    
    const replyDiv = document.createElement('div');
    replyDiv.className = 'reply_item';
    replyDiv.setAttribute('data-timestamp', timestamp);
    
    replyDiv.innerHTML = `
        <div class="reply_header">
            <div class="reply_profile">
                <div class="profile_icon">
                    <img class="icon_bg" src="${bgColor}" alt="">
                    <img class="icon_img" src="${ASSETS.character}" alt="">
                </div>
                <div class="profile_name">
                    <span class="name">${name}</span>
                    <span class="time">${timeDiff}</span>
                </div>
            </div>
        </div>
        <div class="reply_content_row">
            <div class="reply_text">${text}</div>
            <div class="reply_like_box">
                <img class="heart_icon" src="${ASSETS.heart.inactive}" 
                     data-active-src="${ASSETS.heart.active}" 
                     data-inactive-src="${ASSETS.heart.inactive}" alt="">
                <span class="like_count">0</span>
            </div>
        </div>
    `;
    
    return replyDiv;
}

function addUserReply(repliesContainer, replyText, btn) {
    if (!repliesContainer) return;
    
    initializeUser();
    const timestamp = Date.now();
    const newReply = createReplyElement(replyText, timestamp, true);
    const replyInputWrapper = repliesContainer.querySelector('.reply_input_wrapper');
    
    if (!replyInputWrapper) return;
    
    repliesContainer.insertBefore(newReply, replyInputWrapper);
    repliesContainer.classList.add('show');
    setTimeout(() => newReply.classList.add('fade-in'), 10);
    
    // btn이 없을 경우 생성
    const commentItem = repliesContainer.closest('.comment_item');
    if (!btn) {
        btn = commentItem.querySelector('.btn_replies');
    }
    
    if (btn) {
        const currentCount = parseInt(btn.textContent.match(/\d+/)?.[0]) || 0;
        btn.textContent = `${currentCount + 1} Comments`;
        btn.classList.remove('hidden');
    } else {
        // btn_replies가 없는 경우 생성
        const commentActions = commentItem.querySelector('.comment_actions');
        btn = document.createElement('button');
        btn.className = 'btn_replies';
        btn.textContent = '1 Comments';
        commentActions.appendChild(btn);
    }
    
    // Comment 버튼 숨기기
    const commentBtn = commentItem.querySelector('.btn_comment');
    if (commentBtn) {
        commentBtn.classList.add('hidden');
    }
}

// ============ MORE COMMENTS FUNCTIONALITY (1920px 전용) ============

elements.moreButton.addEventListener('click', function() {
    if (isMobileChat()) return; // 미디어쿼리에서는 실행 안함
    
    console.log('[MORE] Button clicked in 1920px');
    
    const remainingSlots = CONFIG.maxComments - state.totalLoadedComments;
    console.log('[MORE] Remaining slots:', remainingSlots);
    
    if (remainingSlots <= 0) {
        elements.moreButton.style.display = 'none';
        return;
    }
    
    // 1920px에서는 10개씩 로딩
    const commentsToLoad = Math.min(10, remainingSlots);
    console.log('[MORE] Loading', commentsToLoad, 'comments');
    
    // 현재 스크롤 위치 저장
    const currentScrollTop = elements.chatScrollArea.scrollTop;
    
    // 답글 최대 20개
    generateComments(commentsToLoad, 20);
    
    state.totalLoadedComments += commentsToLoad;
    console.log('[MORE] Total loaded:', state.totalLoadedComments, '/', CONFIG.maxComments);
    
    // 스크롤 위치 복원 (그대로 유지)
    elements.chatScrollArea.scrollTop = currentScrollTop;
    
    if (state.totalLoadedComments >= CONFIG.maxComments) {
        elements.moreButton.style.display = 'none';
        console.log('[MORE] Max comments reached, hiding button');
    }
});

// ============ INITIALIZE ============

// 기존 HTML 댓글에 이벤트 리스너 추가 및 답글 생성
const allComments = elements.commentsList.querySelectorAll('.comment_item');
console.log(`[INIT] Found ${allComments.length} initial comments`);

allComments.forEach((comment) => {
    attachCommentListeners(comment);
    
    // 답글 버튼이 있는 경우 답글 자동 생성
    const repliesBtn = comment.querySelector('.btn_replies');
    const commentBtn = comment.querySelector('.btn_comment');
    const repliesContainer = comment.querySelector('.replies_container');
    
    if (repliesBtn && !repliesBtn.classList.contains('hidden') && repliesContainer) {
        // 답글 개수 추출 (예: "63 Comments" -> 63)
        const replyCountText = repliesBtn.textContent.match(/\d+/);
        if (replyCountText) {
            const replyCount = parseInt(replyCountText[0]);
            const replyInputWrapper = repliesContainer.querySelector('.reply_input_wrapper');
            
            if (!replyInputWrapper) return;
            
            const commentTimestamp = parseInt(comment.getAttribute('data-timestamp')) || Date.now() - random.number(1, 86400) * 1000;
            
            // 실제 답글 요소들 생성
            const replyElements = [];
            for (let i = 0; i < replyCount; i++) {
                const replyText = random.item(DATA.replyTexts);
                const replyTimestamp = commentTimestamp - random.number(1, 3600) * 1000;
                const replyElement = createReplyElement(replyText, replyTimestamp, false);
                repliesContainer.insertBefore(replyElement, replyInputWrapper);
                replyElements.push(replyElement);
            }
            
            // 모든 답글에 fade-in 애니메이션 적용
            setTimeout(() => {
                replyElements.forEach(el => el.classList.add('fade-in'));
            }, 50);
            
            // Comment 버튼 숨기기
            if (commentBtn) {
                commentBtn.classList.add('hidden');
            }
        }
    }
});

}); // END: COMMUNITY CHAT EVENT SECTION DOMContentLoaded
