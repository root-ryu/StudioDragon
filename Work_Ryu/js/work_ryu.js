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

}); // END: 비하인드 비디오 섹션 DOMContentLoaded

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

// ============ CUSTOM CURSOR ============

const customCursor = document.createElement('div');
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
    const ease = 0.15;
    state.cursor.followX += (state.cursor.x - state.cursor.followX) * ease;
    state.cursor.followY += (state.cursor.y - state.cursor.followY) * ease;
    customCursor.style.left = `${state.cursor.followX}px`;
    customCursor.style.top = `${state.cursor.followY}px`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

elements.chatScrollArea.addEventListener('mouseenter', () => {
    customCursor.style.display = 'block';
    setTimeout(() => customCursor.style.opacity = '1', 10);
});

elements.chatScrollArea.addEventListener('mouseleave', () => {
    customCursor.style.opacity = '0';
    setTimeout(() => customCursor.style.display = 'none', 300);
});

elements.chatScrollArea.addEventListener('mousemove', (e) => {
    state.cursor.x = e.clientX;
    state.cursor.y = e.clientY;
});

// ============ DRAG SCROLL ============

elements.chatScrollArea.addEventListener('mousedown', (e) => {
    if (e.target.closest('.chat_box') || e.target.closest('.profile_icon') || 
        e.target.closest('.name') || e.target.closest('.heart_icon') || 
        e.target.closest('.btn_comment') || e.target.closest('.btn_replies') ||
        e.target.closest('.reply_input') || e.target.closest('.btn_reply_send')) {
        return;
    }
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

document.addEventListener('mouseup', () => state.scroll.isScrolling = false);
document.addEventListener('mouseleave', () => state.scroll.isScrolling = false);

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
    
    const heart = e.target;
    const likeBox = heart.closest('.like_box') || heart.closest('.reply_like_box');
    const likeCountSpan = likeBox.querySelector('.like_count');
    let currentCount = parseInt(likeCountSpan.textContent.replace(/,/g, ''));
    
    const isActive = heart.classList.toggle('active');
    heart.src = ASSETS.heart[isActive ? 'active' : 'inactive'];
    likeCountSpan.textContent = (currentCount + (isActive ? 1 : -1)).toLocaleString();
}

// ============ EVENT LISTENERS ATTACHMENT ============

function attachCommentListeners(commentElement) {
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
                console.log('Enter key reply:', replyInput.value.trim());
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
                console.log('Button click reply:', replyInput.value.trim());
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
    if (!repliesContainer) {
        console.error('repliesContainer not found');
        return;
    }
    
    initializeUser();
    const timestamp = Date.now();
    const newReply = createReplyElement(replyText, timestamp, true); // 사용자 답글임을 표시
    const replyInputWrapper = repliesContainer.querySelector('.reply_input_wrapper');
    
    if (!replyInputWrapper) {
        console.error('replyInputWrapper not found');
        return;
    }
    
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
    
    console.log('Reply added successfully');
}

// ============ MORE COMMENTS FUNCTIONALITY ============

elements.moreButton.addEventListener('click', function() {
    const remainingSlots = CONFIG.maxComments - state.totalLoadedComments;
    if (remainingSlots <= 0) {
        elements.moreButton.style.display = 'none';
        return;
    }
    
    const commentsToLoad = Math.min(CONFIG.commentsPerLoad, remainingSlots);
    
    // MORE 버튼은 답글 최대 20개
    generateComments(commentsToLoad, 20);
    
    state.totalLoadedComments += commentsToLoad;
    
    if (state.totalLoadedComments >= CONFIG.maxComments) {
        elements.moreButton.style.display = 'none';
    }
});

// ============ INITIALIZE ============

console.log('Initializing comments...');

// 기존 HTML 댓글에 이벤트 리스너 추가 및 답글 생성
document.querySelectorAll('.comment_item').forEach((comment, index) => {
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
            
            if (!replyInputWrapper) {
                console.error(`Reply input wrapper not found for comment ${index + 1}`);
                return;
            }
            
            const commentTimestamp = parseInt(comment.getAttribute('data-timestamp')) || Date.now() - random.number(1, 86400) * 1000;
            
            console.log(`Loading ${replyCount} replies for comment ${index + 1}`);
            
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
            
            console.log(`Loaded ${replyCount} replies for comment ${index + 1}`);
        }
    }
});

console.log('Comments initialized');

}); // END: COMMUNITY CHAT EVENT SECTION DOMContentLoaded
