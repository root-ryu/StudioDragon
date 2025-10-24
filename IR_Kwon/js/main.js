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

    // 미디어 쿼리 체크 (1024px 이하에서는 스크롤 애니메이션 비활성화)
    function isDesktop() {
      return window.innerWidth > 1024;
    }

    // 카드 높이 동적으로 계산 (반응형 대응)
    function getCardHeight() {
      return cards[0].offsetHeight || 200;
    }

    // 초기 상수 계산
    let CARD_HEIGHT = getCardHeight();
    let CENTER_OFFSET = CARD_HEIGHT;
    const totalCards = cards.length;

    console.log('✅ 계산된 카드 높이:', CARD_HEIGHT);
    console.log('✅ 데스크탑 모드:', isDesktop());

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
    
    let scrollTriggerInstance = null;

    // 태블릿/모바일 클릭 이벤트 핸들러
    function setupClickHandlers() {
      cards.forEach((card, index) => {
        // 키보드 접근성을 위한 tabindex 설정
        if (!isDesktop()) {
          card.setAttribute('tabindex', '0');
          card.setAttribute('role', 'button');
          card.setAttribute('aria-label', `카드 ${index + 1} 선택`);
        } else {
          card.removeAttribute('tabindex');
          card.removeAttribute('role');
          card.removeAttribute('aria-label');
        }
        
        // 클릭 이벤트
        card.addEventListener('click', () => {
          if (!isDesktop()) {
            // 이미 활성화된 카드는 클릭해도 아무 동작 안함
            if (card.classList.contains('active')) {
              console.log(`⚠️ 카드 ${index}는 이미 활성화됨`);
              return;
            }
            console.log(`🖱️ 카드 ${index} 클릭됨 (모바일/태블릿)`);
            changeImage(index);
            activateCard(index);
          }
        });
        
        // 키보드 이벤트 (Enter, Space)
        card.addEventListener('keydown', (e) => {
          if (!isDesktop() && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            if (card.classList.contains('active')) return;
            console.log(`⌨️ 카드 ${index} 키보드로 선택됨`);
            changeImage(index);
            activateCard(index);
          }
        });
      });
      console.log('✅ 카드 클릭 핸들러 설정 완료 (키보드 접근성 포함)');
    }

    // ScrollTrigger 생성 함수
    function createScrollTrigger() {
      if (!isDesktop()) {
        console.log('⚠️ 태블릿/모바일 모드 - 스크롤 애니메이션 비활성화');
        gsap.set(cardsWrap, { clearProps: 'y' }); // y 속성 제거
        return;
      }

      gsap.set(cardsWrap, { y: CENTER_OFFSET });
      
      scrollTriggerInstance = ScrollTrigger.create({
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
      
      console.log('✅ ScrollTrigger 생성됨');
    }

    // 초기 실행
    setupClickHandlers(); // 클릭 핸들러 설정
    createScrollTrigger();

    // 리사이즈 이벤트 처리 (반응형 대응)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        CARD_HEIGHT = getCardHeight();
        CENTER_OFFSET = CARD_HEIGHT;
        console.log('✅ 리사이즈 후 카드 높이:', CARD_HEIGHT);
        console.log('✅ 데스크탑 모드:', isDesktop());
        
        // 기존 ScrollTrigger 제거
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill();
          scrollTriggerInstance = null;
        }
        
        // 새로운 ScrollTrigger 생성 (데스크탑인 경우에만)
        createScrollTrigger();
        
        // 카드 접근성 속성 재설정
        setupClickHandlers();
      }, 200);
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
  
  // ============================================================
  // Proof 섹션 - 반응형 카드 플립
  // ============================================================
  const proofSection = document.querySelector('.proof');
  
  if (proofSection) {
    const proofCards = proofSection.querySelectorAll('.card:not(.card_6)');
    let currentFlippedCard = null;
    
    console.log('Proof 섹션 카드:', proofCards.length);
    
    function isTabletOrMobile() {
      return window.innerWidth <= 1024;
    }
    
    function flipCard(card) {
      // 다른 카드가 플립되어 있으면 원래대로
      if (currentFlippedCard && currentFlippedCard !== card) {
        currentFlippedCard.classList.remove('flipped');
      }
      
      // 현재 카드 플립 (토글)
      card.classList.toggle('flipped');
      currentFlippedCard = card.classList.contains('flipped') ? card : null;
      
      // 한번 클릭한 카드는 'clicked' 클래스 추가 (터치 인디케이터 숨김용)
      if (!card.classList.contains('clicked')) {
        card.classList.add('clicked');
        console.log('✅ 카드 클릭됨 - 터치 인디케이터 제거');
      }
    }
    
    function resetAllCards() {
      proofCards.forEach(card => {
        card.classList.remove('flipped');
      });
      currentFlippedCard = null;
      // clicked 클래스는 유지 (터치 인디케이터는 계속 숨김)
    }
    
    // 클릭 이벤트 핸들러
    function handleCardClick(e) {
      if (isTabletOrMobile()) {
        e.preventDefault();
        flipCard(this);
      }
    }
    
    // 각 카드에 클릭 이벤트 추가
    proofCards.forEach(card => {
      card.addEventListener('click', handleCardClick);
      
      // 키보드 접근성
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', '카드 플립');
      
      card.addEventListener('keydown', function(e) {
        if (isTabletOrMobile() && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          flipCard(this);
        }
      });
    });
    
    // 리사이즈 시 플립 상태 리셋 (데스크탑으로 전환 시)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!isTabletOrMobile()) {
          resetAllCards();
        }
      }, 250);
    });
  }
  
});
