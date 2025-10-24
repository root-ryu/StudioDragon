// ============================================================
// Studio Dragon IR - Main JavaScript
// ============================================================

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
  
  function isInViewport(section) {
    const rect = section.getBoundingClientRect();
    return rect.bottom <= window.innerHeight && rect.bottom > 0;
  }
  
  function isOutOfViewport(section) {
    const rect = section.getBoundingClientRect();
    return rect.bottom < 0 || rect.top > window.innerHeight;
  }
  
  function animatePercent(element, targetPercent, duration = 1200) {
    let startTime = null;
    
    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentPercent = Math.round(targetPercent * easeProgress);
      
      element.textContent = currentPercent + '%';
      
      if (progress < 1) requestAnimationFrame(animation);
    }
    
    requestAnimationFrame(animation);
  }
  
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
    
    console.log(`${config.name} 섹션 확인:`, { elements: elements.length });
    
    if (config.initStyle) {
      elements.forEach(el => Object.assign(el.style, config.initStyle));
    }
    
    // GSAP ScrollTrigger로 pin 적용
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: config.pinDuration || "+=100%",
        pin: config.pin !== false,
        pinSpacing: true,
        scrub: config.scrub || false,
        onEnter: () => {
          console.log(`🎬 ${config.name} 애니메이션 시작`);
          const startDelay = config.initialDelay || 0;
          setTimeout(() => {
            elements.forEach((el, index) => {
              setTimeout(() => config.animate.call(config, el, index), index * config.delay);
            });
          }, startDelay);
        },
        onLeaveBack: () => {
          console.log(`🔄 ${config.name} 초기화`);
          elements.forEach(el => config.reset(el));
        }
      });
    } else {
      // GSAP 없을 경우 기존 방식 사용
      let isAnimated = false;
      
      function checkScroll() {
        if (isInViewport(section) && !isAnimated) {
          console.log(`🎬 ${config.name} 애니메이션 시작`);
          isAnimated = true;
          
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
  }
  
  // ============================================================
  // Value Drivers 섹션
  // ============================================================
  
  const valueDriversSection = document.querySelector('.value_drivers');
  
  if (valueDriversSection) {
    const items = valueDriversSection.querySelectorAll('.item');
    const arrows = valueDriversSection.querySelectorAll('.arrow');
    const afterCards = valueDriversSection.querySelectorAll('.card_after');
    const description = valueDriversSection.querySelector('.description');
    const descriptionPs = description?.querySelectorAll('p') || [];
    
    console.log('Value Drivers 요소:', {
      section: !!valueDriversSection,
      items: items.length,
      arrows: arrows.length,
      afterCards: afterCards.length,
      descriptionPs: descriptionPs.length
    });

    function animateValueDrivers() {
      items.forEach((item, index) => {
        setTimeout(() => item.classList.add('active'), index * 400);
      });
      
      afterCards.forEach((card, index) => {
        setTimeout(() => card.classList.add('active'), index * 400 + 300);
      });
      
      arrows.forEach((arrow, index) => {
        setTimeout(() => arrow.classList.add('active'), index * 400 + 1100);
      });
      
      if (descriptionPs.length > 0) {
        const baseDelay = items.length * 400 + 1300;
        descriptionPs.forEach((p, index) => {
          setTimeout(() => p.classList.add('active'), baseDelay + (index * 300));
        });
      }
    }

    function resetValueDrivers() {
      items.forEach(item => item.classList.remove('active'));
      afterCards.forEach(card => card.classList.remove('active'));
      arrows.forEach(arrow => arrow.classList.remove('active'));
      descriptionPs.forEach(p => p.classList.remove('active'));
    }

    // GSAP ScrollTrigger로 pin 적용
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: valueDriversSection,
        start: "top top",
        end: "+=150%",
        pin: true,
        pinSpacing: true,
        scrub: false,
        onEnter: () => {
          console.log('🎬 Value Drivers 애니메이션 시작');
          animateValueDrivers();
        },
        onLeaveBack: () => {
          console.log('🔄 Value Drivers 초기화');
          resetValueDrivers();
        }
      });
    } else {
      // GSAP 없을 경우 기존 방식
      let isAnimated = false;
      
      function checkScroll() {
        const sectionBottom = valueDriversSection.getBoundingClientRect().bottom;
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (sectionBottom <= window.innerHeight && !isAnimated) {
          isAnimated = true;
          animateValueDrivers();
        }
        
        if (scrollY === 0 && isAnimated) {
          isAnimated = false;
          resetValueDrivers();
        }
      }
      
      window.addEventListener('scroll', checkScroll);
      checkScroll();
    }
  }
  
  // ============================================================
  // Execution 섹션 - Pin & 카드 스크롤 애니메이션
  // ============================================================
  
  const executionSection = document.querySelector('.execution');
  
  if (executionSection) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.error('❌ GSAP/ScrollTrigger 로드 실패');
      return;
    }

    const cardsWrap = executionSection.querySelector('.cards_wrap');
    const images = executionSection.querySelectorAll('.execution_image');
    const cards = executionSection.querySelectorAll('.card');
    
    if (!cardsWrap || !images.length || !cards.length) {
      console.error('❌ Execution 섹션 필수 요소 누락');
      return;
    }

    console.log('✅ Execution 섹션 초기화:', {
      cards: cards.length,
      images: images.length
    });

    const isDesktop = () => window.innerWidth > 1024;
    const getCardHeight = () => cards[0].offsetHeight || 200;
    
    let CARD_HEIGHT = getCardHeight();
    let CENTER_OFFSET = CARD_HEIGHT;
    const totalCards = cards.length;
    let scrollTriggerInstance = null;

    console.log('✅ 카드 높이:', CARD_HEIGHT, '/ 데스크탑:', isDesktop());

    function changeImage(index) {
      images.forEach((img, i) => img.classList.toggle('active', i === index));
    }

    function activateCard(index) {
      cards.forEach((card, i) => card.classList.toggle('active', i === index));
    }

    changeImage(0);
    activateCard(0);

    function setupClickHandlers() {
      cards.forEach((card, index) => {
        if (!isDesktop()) {
          card.setAttribute('tabindex', '0');
          card.setAttribute('role', 'button');
          card.setAttribute('aria-label', `카드 ${index + 1} 선택`);
        } else {
          card.removeAttribute('tabindex');
          card.removeAttribute('role');
          card.removeAttribute('aria-label');
        }
        
        card.addEventListener('click', () => {
          if (!isDesktop() && !card.classList.contains('active')) {
            console.log(`🖱️ 카드 ${index} 클릭 (모바일/태블릿)`);
            changeImage(index);
            activateCard(index);
          }
        });
        
        card.addEventListener('keydown', (e) => {
          if (!isDesktop() && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            if (!card.classList.contains('active')) {
              console.log(`⌨️ 카드 ${index} 키보드 선택`);
              changeImage(index);
              activateCard(index);
            }
          }
        });
      });
      console.log('✅ 카드 이벤트 핸들러 설정 완료');
    }

    function createScrollTrigger() {
      if (!isDesktop()) {
        console.log('⚠️ 태블릿/모바일 - 스크롤 애니메이션 비활성화');
        gsap.set(cardsWrap, { clearProps: 'y' });
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
      
      console.log('✅ ScrollTrigger 생성 완료');
    }

    setupClickHandlers();
    createScrollTrigger();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        CARD_HEIGHT = getCardHeight();
        CENTER_OFFSET = CARD_HEIGHT;
        console.log('✅ 리사이즈:', CARD_HEIGHT, '/ 데스크탑:', isDesktop());
        
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill();
          scrollTriggerInstance = null;
        }
        
        createScrollTrigger();
        setupClickHandlers();
      }, 200);
    });

    console.log('✅ Execution 초기화 완료');
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
    pin: true,
    pinDuration: "+=100%",
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
  // Moat Repeatability 섹션
  // ============================================================
  
  setupScrollAnimation(document.querySelector('.moat_repeatability'), {
    name: 'Moat Repeatability',
    selector: '.card',
    delay: 200,
    pin: true,
    pinDuration: "+=80%",
    animate: (card) => card.classList.add('fade-in'),
    reset: (card) => card.classList.remove('fade-in')
  });

  // ============================================================
  // Forward Triggers 섹션
  // ============================================================
  
  setupScrollAnimation(document.querySelector('.forward_triggers'), {
    name: 'Forward Triggers',
    selector: '.body .row',
    delay: 150,
    pin: true,
    pinDuration: "+=100%",
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
  
  // ============================================================
  // Risks & Mitigation 섹션
  // ============================================================
  
  setupScrollAnimation(document.querySelector('.risks_mitigation'), {
    name: 'Risks & Mitigation',
    selector: '.card',
    delay: 200,
    pin: true,
    pinDuration: "+=80%",
    animate: (card) => {
      const fill = card.querySelector('.fill');
      if (!fill) return;
      
      const fillWidths = { 
        fill_med: 59.82, 
        fill_high: 84.68, 
        fill_low: 29.89 
      };
      
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
  
  // ============================================================
  // Proof 섹션 - 반응형 카드 플립
  // ============================================================
  
  const proofSection = document.querySelector('.proof');
  
  if (proofSection) {
    const proofCards = proofSection.querySelectorAll('.card:not(.card_6)');
    let currentFlippedCard = null;
    
    console.log('Proof 섹션 카드:', proofCards.length);
    
    const isTabletOrMobile = () => window.innerWidth <= 1024;
    
    function flipCard(card) {
      if (currentFlippedCard && currentFlippedCard !== card) {
        currentFlippedCard.classList.remove('flipped');
      }
      
      card.classList.toggle('flipped');
      currentFlippedCard = card.classList.contains('flipped') ? card : null;
      
      if (!card.classList.contains('clicked')) {
        card.classList.add('clicked');
        console.log('✅ 카드 클릭 - 터치 인디케이터 제거');
      }
    }
    
    function resetAllCards() {
      proofCards.forEach(card => card.classList.remove('flipped'));
      currentFlippedCard = null;
    }
    
    function handleCardClick(e) {
      if (isTabletOrMobile()) {
        e.preventDefault();
        flipCard(this);
      }
    }
    
    proofCards.forEach(card => {
      card.addEventListener('click', handleCardClick);
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
    
    // GSAP ScrollTrigger로 Proof 섹션 pin 적용
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: proofSection,
        start: "top top",
        end: "+=120%",
        pin: true,
        pinSpacing: true,
        scrub: false,
        onEnter: () => {
          console.log('🎬 Proof 섹션 진입');
        },
        onLeaveBack: () => {
          console.log('🔄 Proof 섹션 이탈');
          resetAllCards();
        }
      });
    }
    
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!isTabletOrMobile()) resetAllCards();
      }, 250);
    });
  }
  
});
