// 모든 초기화를 DOMContentLoaded 내에서 실행
document.addEventListener('DOMContentLoaded', () => {
  
  // 1️⃣ Banner Section - Swiper Slider
  const bannerSwiper = new Swiper('.banner__slider', {
    loop: true,
    speed: 1000,
    autoplay: { 
      delay: 5000, 
      disableOnInteraction: false 
    },

    // ✅ 중앙 정렬 + 양옆 peek 효과
    centeredSlides: true,
    slidesPerView: 'auto', // 슬라이드가 자신의 너비를 가지도록
    spaceBetween: 30,

    pagination: { 
      el: '.banner-pagination', 
      clickable: true,
      type: 'bullets',
    },
    navigation: { 
      nextEl: '.banner-button-next', 
      prevEl: '.banner-button-prev' 
    },

    // ✅ 루프 설정 최적화
    loopedSlides: 4,
    watchSlidesProgress: true,
    slideToClickedSlide: false,
    initialSlide: 0,
    
    // ✅ 슬라이드 중앙 배치
    centerInsufficientSlides: true,
  });

  // 2️⃣ Proof Section - Swiper Slider (연속 자동 스크롤)
  const proofSwiper = new Swiper(".proof .slide_wrap", {
    loop: true,
    slidesPerView: 'auto',
    spaceBetween: 50,
    speed: 9000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    loopAdditionalSlides: 5,
    on: {
      init: function () {
        this.wrapperEl.style.transitionTimingFunction = 'linear';
      },
      slideChangeTransitionStart: function () {
        this.wrapperEl.style.transitionTimingFunction = 'linear';
      },
    },
  });

  // 3️⃣ Value Drivers - 스크롤 애니메이션
  const valueDriversSection = document.querySelector('.value_drivers');
  const valueItems = document.querySelectorAll('.value_drivers .item');
  const descriptionParagraphs = document.querySelectorAll('.value_drivers .description p');
  
  if (valueDriversSection) {
    // Intersection Observer로 섹션이 보이는지 감지
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3 // 30% 이상 보이면 트리거
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !valueDriversSection.classList.contains('animated')) {
          valueDriversSection.classList.add('animated');
          
          // 각 아이템을 순차적으로 애니메이션
          valueItems.forEach((item, index) => {
            const arrow = item.querySelector('.arrow');
            const cardAfter = item.querySelector('.card_after');
            
            setTimeout(() => {
              // 1. 아이템에 active 클래스 추가 (Before 카드 축소 + gap 생성)
              item.classList.add('active');
              
              // 2. Arrow 나타나기
              if (arrow) {
                setTimeout(() => {
                  arrow.classList.add('active');
                }, 300); // Before 카드 축소 후 300ms 뒤
              }
              
              // 3. After 카드 나타나기
              if (cardAfter) {
                setTimeout(() => {
                  cardAfter.classList.add('active');
                }, 500); // Arrow 후 200ms 뒤
              }
            }, index * 400); // 각 아이템마다 400ms 간격으로 순차 실행
          });
          
          // Description 애니메이션 (모든 아이템 애니메이션 후)
          setTimeout(() => {
            descriptionParagraphs.forEach((p, index) => {
              setTimeout(() => {
                p.classList.add('active');
              }, index * 150); // 각 문단마다 150ms 간격
            });
          }, valueItems.length * 400 + 300); // 모든 아이템 완료 후 300ms 뒤
        }
      });
    }, observerOptions);

    observer.observe(valueDriversSection);
  }

  // 4️⃣ Risks & Mitigation - 비디오 재생
  const riskItems = document.querySelectorAll('.risk_item');
  
  riskItems.forEach(item => {
    const video = item.querySelector('video');
    if (!video) return;

    // 호버 시 비디오 재생
    item.addEventListener('mouseenter', () => video.play());
    // 호버 아웃 시 비디오 일시정지 & 처음으로
    item.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
});