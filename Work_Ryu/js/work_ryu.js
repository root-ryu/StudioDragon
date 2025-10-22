/* episode */
// Episode 섹션 드래그 스크롤
window.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.episode_scroll_container');
    
    if (!slider) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;

    // 기본 스크롤 동작을 auto로 설정
    slider.style.scrollBehavior = 'auto';

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

    slider.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
    });

    // 휠 이벤트로 좌우 스크롤
    slider.addEventListener('wheel', function(e) {
        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
        const isAtEnd = slider.scrollLeft >= maxScrollLeft - 10;
        const isAtStart = slider.scrollLeft <= 10;
        
        // 끝에 도달했고 오른쪽으로 스크롤하려는 경우
        if (isAtEnd && e.deltaY > 0) {
            return; // 페이지 스크롤로 넘어감
        }
        
        // 시작점이고 왼쪽으로 스크롤하려는 경우
        if (isAtStart && e.deltaY < 0) {
            return; // 페이지 스크롤로 넘어감
        }
        e.preventDefault();
        slider.scrollLeft += e.deltaY * 1.5;
    });
});
// 비하인드 비디오 섹션 스택
window.addEventListener('DOMContentLoaded', function() {
    gsap.registerPlugin(ScrollTrigger);
    
    const section = document.querySelector('.behind_video');
    const videoItems = document.querySelectorAll('.video_item');
    
    if (!section || videoItems.length === 0) return;
    
    let currentIndex = 0;
    
    // 초기 스택 설정
    function setStack(activeIndex) {
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
    
    // ScrollTrigger - 3개 전환 후 자연스럽게 해제
    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=1500",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;
            
            // 3단계 구분
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
    });
//드래그 이미지
const frame = document.querySelector('.images_frame');
const images = document.querySelectorAll('.img_item');
const modal = document.querySelector('.image_modal');
const modalImg = modal.querySelector('.modal_content img');
const closeBtn = modal.querySelector('.modal_close');

// Drag state tracking
let isDragging = false;
let velocityX = 0;
let velocityY = 0;
let animationId = null;
let lastX = 0;
let lastY = 0;
let lastTime = 0;

// Calculate 3D sphere effect for images (convex - center pops out)
function applySphereEffect() {
    const effectWidth = 1520; // 1520px area for effect
    const effectHeight = 1464;
    const frameCenterX = effectWidth / 2;
    const frameCenterY = effectHeight / 2;
    
    images.forEach(imgItem => {
        const imgElement = imgItem.querySelector('img');
        
        // Calculate position relative to 1520px center
        const imgCenterX = imgItem.offsetLeft + imgItem.offsetWidth / 2;
        const imgCenterY = imgItem.offsetTop + imgItem.offsetHeight / 2;
        
        // Distance from center (normalized to 1520px width)
        const distX = (imgCenterX - frameCenterX) / frameCenterX;
        const distY = (imgCenterY - frameCenterY) / frameCenterY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        // Calculate Z-depth based on distance from center (CONVEX - positive for bulge)
        const maxDepth = 60; // Reduced from 150 (less bulge)
        const zDepth = (1 - distance) * maxDepth; // Center is max, edges are min
        
        // Calculate rotation for sphere curvature
        const rotateY = distX * -5; // Reduced from -12 (less rotation)
        const rotateX = distY * 5; // Reduced from 12
        
        // Calculate scale (center appears slightly larger)
        const scale = 1 + ((1 - distance) * 0.03); // Reduced from 0.08
        
        // Apply transform to img element inside .img_item
        imgElement.style.transform = `
            translateZ(${zDepth}px) 
            rotateY(${rotateY}deg) 
            rotateX(${rotateX}deg) 
            scale(${scale})
        `;
    });
}

// Apply sphere effect on load
applySphereEffect();

// Individual image floating animation
images.forEach((imgItem, index) => {
    // Get the img element inside .img_item
    const imgElement = imgItem.querySelector('img');
    
    // Random values for each image
    const randomX = (Math.random() - 0.5) * 10; // -5 to 5
    const randomY = (Math.random() - 0.5) * 10;
    const randomRotation = (Math.random() - 0.5) * 2; // -1 to 1
    const duration = 3 + Math.random() * 2; // 3-5 seconds
    const delay = Math.random() * 2; // 0-2 seconds delay
    
    // Floating animation with GSAP on the img element (preserves sphere transform)
    gsap.to(imgElement, {
        x: randomX,
        y: randomY,
        rotation: randomRotation,
        duration: duration,
        delay: delay,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        overwrite: false
    });
    
    // Add hover event listeners to .img_item (entire area)
    imgItem.addEventListener('mouseenter', function() {
        this.style.setProperty('--hover-opacity', '0');
        const img = this.querySelector('img');
        if (img) img.style.filter = 'brightness(1)';
    });
    
    imgItem.addEventListener('mouseleave', function() {
        this.style.setProperty('--hover-opacity', '0.3');
        const img = this.querySelector('img');
        if (img) img.style.filter = 'brightness(0.7)';
    });
});

// Draggable setup - dragClickables: false prevents images from being dragged
const draggableInstance = Draggable.create(frame, {
    type: "x,y",
    edgeResistance: 0.65,
    dragClickables: false, // Images won't be dragged
    bounds: {
        minX: -1000, // 좌측으로 1000px
        maxX: 1000,  // 우측으로 1000px (대칭)
        minY: -500,  // 상단으로 500px
        maxY: 500    // 하단으로 500px (대칭)
    },
    onPress: function() {
        // Stop animation when user grabs
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        velocityX = 0;
        velocityY = 0;
        lastX = this.x;
        lastY = this.y;
        lastTime = Date.now();
    },
    onDragStart: function() {
        isDragging = true;
        frame.classList.add('active');
        lastX = this.x;
        lastY = this.y;
        lastTime = Date.now();
    },
    onDrag: function() {
        isDragging = true;
        // Calculate velocity manually
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime > 0) {
            const deltaX = this.x - lastX;
            const deltaY = this.y - lastY;
            
            velocityX = (deltaX / deltaTime) * 4; // Reduced from 8 (even slower)
            velocityY = (deltaY / deltaTime) * 4;
            
            lastX = this.x;
            lastY = this.y;
            lastTime = currentTime;
        }
    },
    onDragEnd: function() {
        frame.classList.remove('active');
        
        // Start animation with current velocity
        isDragging = false;
        console.log('Drag ended with velocity:', velocityX, velocityY);
        
        // Start animation loop
        if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
            animate();
        }
    }
})[0];

// Animation loop for continuous drift (defined after draggableInstance)
function animate() {
    if (!isDragging && (Math.abs(velocityX) > 0.01 || Math.abs(velocityY) > 0.01)) {
        // Get current position from Draggable instance
        let currentX = draggableInstance.x;
        let currentY = draggableInstance.y;
        
        // Apply velocity
        currentX += velocityX;
        currentY += velocityY;
        
        // Check boundaries and bounce
        if (currentX < -1000) {
            currentX = -1000;
            velocityX *= -0.7;
        } else if (currentX > 1000) {
            currentX = 1000;
            velocityX *= -0.7;
        }
        
        if (currentY < -500) {
            currentY = -500;
            velocityY *= -0.7;
        } else if (currentY > 500) {
            currentY = 500;
            velocityY *= -0.7;
        }
        
        // Update position
        gsap.set(frame, { x: currentX, y: currentY });
        draggableInstance.update();
        
        // Continue animation
        animationId = requestAnimationFrame(animate);
    } else {
        // Stop animation when velocity is too low
        velocityX = 0;
        velocityY = 0;
    }
}

// Image click to modal - attach to .img_item (entire area)
images.forEach(imgItem => {
    imgItem.addEventListener('click', (e) => {
        // Prevent click if dragging
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        
        e.stopPropagation();
        const imgSrc = imgItem.querySelector('img').src;
        modalImg.src = imgSrc;
        modal.classList.add('active');
        draggableInstance.disable(); // Pause drag when modal open
    });
    
    // Prevent default drag behavior on images
    imgItem.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });
});

// Close modal
closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    draggableInstance.enable(); // Resume drag
});

// Close on modal background click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        draggableInstance.enable();
    }
});

// ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        draggableInstance.enable();
    }
});
});