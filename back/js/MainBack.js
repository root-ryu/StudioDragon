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
    
    AOS.init({
        disable: false,
        startEvent: 'DOMContentLoaded',
        initClassName: 'aos-init',
        animatedClassName: 'aos-animate',
        useClassNames: false,
        disableMutationObserver: false,
        debounceDelay: 50,
        throttleDelay: 99,
    });

    // ON-AIR 섹션 회전 기능
    const onairContents = document.querySelectorAll('.ONcon > div');
    const oncon = document.querySelector('.ONcon');
    let currentIndex = 1; // 현재 가운데 위치 (ONcontents02가 초기 active)
    let isAnimating = false; // 애니메이션 진행 중 플래그
    
    function rotateOnAir() {
        if (isAnimating || !oncon) return;
        isAnimating = true;
        
        // 현재 순서 저장
        const currentOrder = Array.from(oncon.children);
        
        // 다음 인덱스 계산
        const nextIndex = (currentIndex + 1) % onairContents.length;
        const newPrevIndex = (nextIndex - 1 + onairContents.length) % onairContents.length;
        const newNextIndex = (nextIndex + 1) % onairContents.length;
        
        // 새로운 순서 배열
        const newOrder = [onairContents[newPrevIndex], onairContents[nextIndex], onairContents[newNextIndex]];
        
        // 새로 들어올 요소 (오른쪽 끝에서)
        const newElement = newOrder.find(el => !currentOrder.includes(el));
        
        if (newElement) {
            // 새 요소를 오른쪽 밖에 배치 (애니메이션 없이 순간이동)
            newElement.style.transition = 'none';
            newElement.style.opacity = '0';
            newElement.classList.remove('active');
            oncon.appendChild(newElement);
            
            // 위치 강제 렌더링
            void newElement.offsetWidth;
        }
        
        // 다음 프레임에서 애니메이션 시작
        requestAnimationFrame(() => {
            // 모든 현재 요소들 왼쪽으로 이동
            currentOrder.forEach((element, index) => {
                element.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s';
                
                if (index === 0) {
                    // 맨 왼쪽 요소 - 왼쪽으로 사라짐
                    element.style.transform = 'translateX(-120%)';
                    element.style.opacity = '0';
                    element.classList.remove('active');
                } else if (index === 1) {
                    // 가운데 요소 - 왼쪽으로 이동
                    element.style.transform = 'translateX(-110%)';
                    element.classList.remove('active');
                } else if (index === 2) {
                    // 오른쪽 요소 - 가운데로 이동
                    element.style.transform = 'translateX(-110%)';
                    element.classList.add('active');
                }
            });
            
            // 새 요소 슬라이드 인
            if (newElement) {
                newElement.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s';
                newElement.style.transform = 'translateX(-110%)';
                newElement.style.opacity = '1';
            }
        });
        
        // 애니메이션 완료 후 DOM 정리
        setTimeout(() => {
            // 완전히 DOM 재구성
            oncon.innerHTML = '';
            newOrder.forEach(element => {
                element.style.transition = '';
                element.style.transform = '';
                element.style.opacity = '1';
                oncon.appendChild(element);
            });
            
            // active 클래스 확인
            newOrder.forEach((element, idx) => {
                if (idx === 1) {
                    element.classList.add('active');
                } else {
                    element.classList.remove('active');
                }
            });
            
            currentIndex = nextIndex;
            isAnimating = false;
        }, 1000);
    }
    
    // 5초마다 자동 회전
    if (onairContents.length > 0) {
        setInterval(rotateOnAir, 5000);
    }

    // GigTit 섹션 배경색 전환 애니메이션
    const gigTitSection = document.querySelector('.GigTit');
    const body = document.body;
    
    function handleGigTitScroll() {
        if (!gigTitSection) return;
        
        const rect = gigTitSection.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        // 섹션이 화면에 50% 진입했을 때 계산
        const triggerPoint = windowHeight - (sectionHeight * 0.5);
        
        // 섹션이 화면에 들어온 정도 계산 (0 ~ 1)
        let scrollProgress = 0;
        
        if (sectionTop <= triggerPoint) {
            // 섹션이 트리거 포인트를 지났을 때
            const distancePassed = triggerPoint - sectionTop;
            const transitionDistance = sectionHeight * 0.3; // 30% 구간에서 전환
            scrollProgress = Math.min(distancePassed / transitionDistance, 1);
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
        // 5초마다 자동 슬라이드
        newsInterval = setInterval(nextNews, 5000);
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
});