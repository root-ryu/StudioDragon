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
});