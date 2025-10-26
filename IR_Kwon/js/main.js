document.addEventListener('DOMContentLoaded', () => {
  
  function refreshScrollTrigger() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshScrollTrigger, 250);
  });

  window.addEventListener('load', () => {
    setTimeout(refreshScrollTrigger, 100);
  });
  
  // Banner Swiper
  const bannerSwiper = new Swiper('.banner__slider', {
    loop: true,
    speed: 1000,
    autoplay: { delay: 5000, disableOnInteraction: false },
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 30,
    pagination: { el: '.banner-pagination', clickable: true, type: 'bullets' },
    navigation: { nextEl: '.banner-button-next', prevEl: '.banner-button-prev' },
    loopedSlides: 4,
    loopAdditionalSlides: 0,
    watchSlidesProgress: true,
    slideToClickedSlide: false,
    initialSlide: 0,
    centerInsufficientSlides: true,
  });

  // Proof Swiper
  const proofSwiper = new Swiper(".proof .slide_wrap", {
    rewind: true,
    slidesPerView: 'auto',
    spaceBetween: 50,
    speed: 9000,
    autoplay: { delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false },
    loopedSlides: 5,
    loopAdditionalSlides: 3,
    on: {
      init: function () { this.wrapperEl.style.transitionTimingFunction = 'linear'; },
      slideChangeTransitionStart: function () { this.wrapperEl.style.transitionTimingFunction = 'linear'; },
    },
  });

  // Value Drivers Animation
  const valueDriversSection = document.querySelector('.value_drivers');
  const valueItems = document.querySelectorAll('.value_drivers .item');
  const descriptionParagraphs = document.querySelectorAll('.value_drivers .description p');
  
  if (valueDriversSection) {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const animationDelay = isMobile ? 1000 : 0;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !valueDriversSection.classList.contains('animated')) {
          valueDriversSection.classList.add('animated');
          
          setTimeout(() => {
            valueItems.forEach((item, index) => {
              const arrow = item.querySelector('.arrow');
              const cardAfter = item.querySelector('.card_after');
              
              setTimeout(() => {
                item.classList.add('active');
                if (arrow) setTimeout(() => arrow.classList.add('active'), 300);
                if (cardAfter) setTimeout(() => cardAfter.classList.add('active'), 500);
              }, index * 400);
            });
            
            setTimeout(() => {
              descriptionParagraphs.forEach((p, index) => {
                setTimeout(() => p.classList.add('active'), index * 150);
              });
            }, valueItems.length * 400 + 300);
          }, animationDelay);
        }
      });
    }, { root: null, rootMargin: '-100% 0px -100% 0px', threshold: 0 });

    observer.observe(valueDriversSection);
  }

  // Risks & Mitigation Video
  const riskItems = document.querySelectorAll('.risks_mitigation .risk_item');
  const isRiskMobile = window.matchMedia('(max-width: 1024px)').matches;
  
  riskItems.forEach(item => {
    const video = item.querySelector('video');
    if (!video) return;

    if (isRiskMobile) {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCurrentlyActive = item.classList.contains('active');
        
        riskItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherVideo = otherItem.querySelector('video');
            if (otherVideo) {
              otherVideo.pause();
              otherVideo.currentTime = 0;
            }
          }
        });
        
        if (isCurrentlyActive) {
          item.classList.remove('active');
          video.pause();
          video.currentTime = 0;
        } else {
          item.classList.add('active');
          video.play().catch(err => console.log('Video play failed:', err));
        }
      });
    } else {
      item.addEventListener('mouseenter', () => video.play().catch(err => console.log('Video play failed:', err)));
      item.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  });

  // Execution Animation
  const executionCards = document.querySelectorAll('.execution .card');
  const executionContainer = document.querySelector('.execution .container');
  
  if (executionCards.length > 0 && executionContainer) {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const animationDelay = isMobile ? 1 : 0.5;
    
    ScrollTrigger.create({
      trigger: executionContainer,
      start: 'top 80%',
      end: 'bottom 20%',
      once: !isMobile,
      onEnter: () => {
        executionCards.forEach((card, index) => {
          gsap.fromTo(card,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: animationDelay + (index * 0.2) }
          );
        });
      },
      onLeave: () => {
        if (isMobile) executionCards.forEach(card => gsap.set(card, { y: 100, opacity: 0 }));
      },
      onEnterBack: () => {
        if (isMobile) {
          executionCards.forEach((card, index) => {
            gsap.fromTo(card,
              { y: 100, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: animationDelay + (index * 0.2) }
            );
          });
        }
      }
    });
  }

  // Forward Triggers Animation
  const forwardTriggerImages = document.querySelectorAll('.forward_triggers .item .img_wrap img');
  const forwardTriggersContainer = document.querySelector('.forward_triggers .container');
  
  if (forwardTriggerImages.length > 0 && forwardTriggersContainer) {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const animationDelay = isMobile ? 1 : 0.5;
    
    ScrollTrigger.create({
      trigger: forwardTriggersContainer,
      start: 'top 75%',
      end: 'bottom -100%',
      once: false,
      onEnter: () => {
        forwardTriggerImages.forEach((img, index) => {
          gsap.fromTo(img,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: 'power3.out', delay: animationDelay + (index * 0.2) }
          );
        });
      },
      onLeave: () => {
        if (isMobile) forwardTriggerImages.forEach(img => gsap.set(img, { scale: 0, opacity: 0 }));
      },
      onEnterBack: () => {
        if (isMobile) {
          forwardTriggerImages.forEach((img, index) => {
            gsap.fromTo(img,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 1, ease: 'power3.out', delay: animationDelay + (index * 0.2) }
            );
          });
        }
      }
    });
  }

  // Moat & Repeatability Animation
  const moatRows = document.querySelectorAll('.moat_repeatability .row');
  const moatContainer = document.querySelector('.moat_repeatability .container');
  
  if (moatRows.length > 0 && moatContainer) {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const animationDelay = isMobile ? 1 : 0.5;
    
    ScrollTrigger.create({
      trigger: moatContainer,
      start: 'top 75%',
      end: 'bottom -100%',
      once: false,
      onEnter: () => {
        moatRows.forEach((row, rowIndex) => {
          const cards = row.querySelectorAll('.card');
          const isFirstRow = rowIndex === 0;
          
          cards.forEach((card, cardIndex) => {
            gsap.fromTo(card,
              { x: isFirstRow ? -100 : 100, opacity: 0 },
              { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: animationDelay + ((rowIndex * cards.length + cardIndex) * 0.15) }
            );
          });
        });
      },
      onLeave: () => {
        if (isMobile) {
          moatRows.forEach((row, rowIndex) => {
            const cards = row.querySelectorAll('.card');
            const isFirstRow = rowIndex === 0;
            cards.forEach(card => gsap.set(card, { x: isFirstRow ? -100 : 100, opacity: 0 }));
          });
        }
      },
      onEnterBack: () => {
        if (isMobile) {
          moatRows.forEach((row, rowIndex) => {
            const cards = row.querySelectorAll('.card');
            const isFirstRow = rowIndex === 0;
            
            cards.forEach((card, cardIndex) => {
              gsap.fromTo(card,
                { x: isFirstRow ? -100 : 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: animationDelay + ((rowIndex * cards.length + cardIndex) * 0.15) }
              );
            });
          });
        }
      }
    });
  }

  // Proof Click Toggle (Mobile)
  const isProofMobile = window.matchMedia('(max-width: 1024px)').matches;
  
  if (isProofMobile) {
    const proofSwiper = document.querySelector('.proof .slide_wrap')?.swiper;
    
    setTimeout(() => {
      const proofCards = document.querySelectorAll('.proof .card');
      
      proofCards.forEach(card => {
        card.addEventListener('click', function(e) {
          e.stopPropagation();
          const isCurrentlyClicked = this.classList.contains('clicked');
          
          // 모든 카드의 clicked 클래스 제거
          document.querySelectorAll('.proof .card').forEach(c => c.classList.remove('clicked'));
          
          // 클릭한 카드에만 clicked 클래스 추가 (토글)
          if (!isCurrentlyClicked) {
            this.classList.add('clicked');
            // Swiper 자동재생 일시정지
            if (proofSwiper) proofSwiper.autoplay.stop();
          } else {
            // 다시 클릭하면 자동재생 재개
            if (proofSwiper) proofSwiper.autoplay.start();
          }
        });
      });
      
      // 외부 클릭시 모든 clicked 해제 및 자동재생 재개
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.proof .card')) {
          document.querySelectorAll('.proof .card').forEach(c => c.classList.remove('clicked'));
          if (proofSwiper) proofSwiper.autoplay.start();
        }
      });
    }, 500);
  }
});