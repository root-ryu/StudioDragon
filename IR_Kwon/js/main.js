// GSAP ScrollTrigger 등록
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  console.log('✅ GSAP ScrollTrigger 등록 완료');
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Main.js loaded');
  
  // ============================================================
  // 공통 유틸리티 함수
  // ============================================================
  
  // 섹션이 뷰포트에 진입했는지 확인
  function isInViewport(section) {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    return rect.bottom <= windowHeight && rect.bottom > 0;
  }
  
  // 섹션이 뷰포트를 완전히 벗어났는지 확인
  function isOutOfViewport(section) {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    return rect.bottom < 0 || rect.top > windowHeight;
  }
  
  // ============================================================
  // Value Drivers 섹션
  // ============================================================
  const valueDriversSection = document.querySelector('.value_drivers');
  
  if (valueDriversSection) {
    const items = document.querySelectorAll('.value_drivers .item');
    const arrows = document.querySelectorAll('.value_drivers .arrow');
    const afterCards = document.querySelectorAll('.value_drivers .card_after');
    const description = document.querySelector('.value_drivers .description');
    const descriptionPs = description ? description.querySelectorAll('p') : [];
    let isAnimated = false;
    
    console.log('Value Drivers 요소 확인:', {
      section: !!valueDriversSection,
      items: items.length,
      arrows: arrows.length,
      afterCards: afterCards.length,
      descriptionPs: descriptionPs.length
    });

    function checkScroll() {
      const sectionBottom = valueDriversSection.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      
      // 뷰포트 하단이 섹션 하단에 닿으면 애니메이션 시작
      if (sectionBottom <= windowHeight && !isAnimated) {
        isAnimated = true;
        
        // item에 active 클래스 추가 (before 카드 축소)
        items.forEach((item, index) => {
          setTimeout(() => item.classList.add('active'), index * 400);
        });
        
        // after 카드 opacity 애니메이션
        afterCards.forEach((card, index) => {
          setTimeout(() => card.classList.add('active'), index * 400 + 300);
        });
        
        // arrow 표시
        arrows.forEach((arrow, index) => {
          setTimeout(() => arrow.classList.add('active'), index * 400 + 1100);
        });
        
        // description 내 p 태그들을 순차적으로 표시
        if (descriptionPs.length > 0) {
          const baseDelay = items.length * 400 + 1300;
          descriptionPs.forEach((p, index) => {
            setTimeout(() => p.classList.add('active'), baseDelay + (index * 300));
          });
        }
      }
      
      // 페이지 최상단에 도달하면 애니메이션 리셋
      if (scrollY === 0 && isAnimated) {
        isAnimated = false;
        items.forEach(item => item.classList.remove('active'));
        afterCards.forEach(card => card.classList.remove('active'));
        arrows.forEach(arrow => arrow.classList.remove('active'));
        descriptionPs.forEach(p => p.classList.remove('active'));
      }
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
  }
  
  // ============================================================
  // Execution 섹션 - Pin 및 카드 스크롤 애니메이션
  // ============================================================
  const executionSection = document.querySelector('.execution');
  
  if (executionSection) {
    // GSAP 체크
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.error('❌ GSAP/ScrollTrigger 로드 실패');
      return;
    }

    const cardsWrap = executionSection.querySelector('.cards_wrap');
    const images = executionSection.querySelectorAll('.execution_image');
    const cards = executionSection.querySelectorAll('.card');
    
    // 필수 요소 체크
    if (!cardsWrap || !images.length || !cards.length) {
      console.error('❌ Execution 섹션 필수 요소 누락');
      return;
    }

    console.log('✅ Execution 섹션 초기화:', {
      cards: cards.length,
      images: images.length
    });

    // 상수
    const CARD_HEIGHT = 200;
    const CENTER_OFFSET = 200;
    const totalCards = cards.length;

    // 이미지 전환 함수
    function changeImage(index) {
      images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });
    }

    // 카드 활성화 함수
    function activateCard(index) {
      cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
      });
    }

    // 초기 상태
    changeImage(0);
    activateCard(0);
    gsap.set(cardsWrap, { y: CENTER_OFFSET });
    
    // ScrollTrigger 설정
    ScrollTrigger.create({
      trigger: executionSection,
      start: "top top",
      end: `+=${(totalCards - 1) * 1000}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const currentIndex = Math.round(self.progress * (totalCards - 1));
        const offset = CENTER_OFFSET - (currentIndex * CARD_HEIGHT);
        
        gsap.set(cardsWrap, { y: offset });
        changeImage(currentIndex);
        activateCard(currentIndex);
      }
    });

    console.log('✅ Execution 섹션 초기화 완료');
  }

  // ============================================================
  // 범용 퍼센트 애니메이션 함수
  // ============================================================
  function animatePercent(element, targetPercent, duration = 1200) {
    let startTime = null;
    
    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const currentPercent = Math.round(targetPercent * easeProgress);
      
      element.textContent = currentPercent + '%';
      
      if (progress < 1) requestAnimationFrame(animation);
    }
    
    requestAnimationFrame(animation);
  }
  
  // ============================================================
  // Monetization Bridge 섹션
  // ============================================================
  setupScrollAnimation(document.querySelector('.monetization_bridge'), {
    name: 'Monetization Bridge',
    selector: '.bar',
    delay: 500,
    targetPercents: [56, 64, 60, 14, 6],
    initialDelay: 800,
    animate: function(bar, index) {
      const chart = bar.querySelector('.chart');
      const percentElement = bar.querySelector('.percent');
      
      if (!chart || !percentElement) return;
      
      chart.style.height = '0%';
      percentElement.textContent = '0%';
      
      const targetPercent = this.targetPercents[index];
      
      chart.style.transition = 'height 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
      chart.style.height = targetPercent + '%';
      animatePercent(percentElement, targetPercent, 1200);
    },
    reset: (bar) => {
      const chart = bar.querySelector('.chart');
      const percentElement = bar.querySelector('.percent');
      if (chart && percentElement) {
        chart.style.transition = 'none';
        chart.style.height = '0%';
        percentElement.textContent = '0%';
      }
    }
  });


  // ============================================================
  // 섹션별 스크롤 애니메이션 설정
  // ============================================================
  
  // 공통 애니메이션 설정 함수
  function setupScrollAnimation(section, config) {
    if (!section) {
      console.warn(`⚠️ ${config.name} 섹션을 찾을 수 없습니다`);
      return;
    }
    
    const elements = section.querySelectorAll(config.selector);
    if (!elements.length) {
      console.warn(`⚠️ ${config.name} 요소를 찾을 수 없습니다`);
      return;
    }
    
    let isAnimated = false;
    
    console.log(`${config.name} 섹션 확인:`, { elements: elements.length });
    
    // 초기 스타일 설정
    if (config.initStyle) {
      elements.forEach(el => Object.assign(el.style, config.initStyle));
    }
    
    function checkScroll() {
      if (isInViewport(section) && !isAnimated) {
        console.log(`🎬 ${config.name} 애니메이션 시작`);
        isAnimated = true;
        
        // 초기 딜레이가 있는 경우
        const startDelay = config.initialDelay || 0;
        
        setTimeout(() => {
          elements.forEach((el, index) => {
            setTimeout(() => config.animate.call(config, el, index), index * config.delay);
          });
        }, startDelay);
      }

      if (isOutOfViewport(section) && isAnimated) {
        console.log(`🔄 ${config.name} 초기화`);
        isAnimated = false;
        elements.forEach(el => config.reset(el));
      }
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
  }
  
  // Forward Triggers
  setupScrollAnimation(document.querySelector('.forward_triggers'), {
    name: 'Forward Triggers',
    selector: '.body .row',
    delay: 150,
    initStyle: {
      opacity: '0',
      transform: 'translateY(30px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease'
    },
    animate: (row) => {
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    },
    reset: (row) => {
      row.style.opacity = '0';
      row.style.transform = 'translateY(30px)';
    }
  });
  
  // Risks & Mitigation
  setupScrollAnimation(document.querySelector('.risks_mitigation'), {
    name: 'Risks & Mitigation',
    selector: '.card',
    delay: 200,
    animate: (card) => {
      const fill = card.querySelector('.fill');
      if (!fill) return;
      
      const fillWidths = { fill_med: 59.82, fill_high: 84.68, fill_low: 29.89 };
      let targetWidth = 50;
      
      for (const [className, width] of Object.entries(fillWidths)) {
        if (fill.classList.contains(className)) {
          targetWidth = width;
          break;
        }
      }
      
      fill.style.transition = 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
      fill.style.width = targetWidth + '%';
    },
    reset: (card) => {
      const fill = card.querySelector('.fill');
      if (fill) {
        fill.style.transition = 'none';
        fill.style.width = '0%';
      }
    }
  });
  
  // Moat Repeatability
  setupScrollAnimation(document.querySelector('.moat_repeatability'), {
    name: 'Moat Repeatability',
    selector: '.card',
    delay: 200,
    animate: (card) => card.classList.add('fade-in'),
    reset: (card) => card.classList.remove('fade-in')
  });

});
