// GSAP으로 스크롤 애니메이션 구현 (AOS/ASAP 대체)
document.addEventListener('DOMContentLoaded', () => {
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    const tl_yoyo = gsap.timeline({
      scrollTrigger: {
        trigger: '.repeat_area',
        start: 'top 70%',
        toggleActions: "play none none reverse"
      },
      repeat: -1,
      yoyo: true,
      // repeatDelay: 0.1,
      scrub: 2,
      anticipatePin: 1,
    });
    tl_yoyo.to('.smiling-emoji', { y: -80, duration: 2.5, ease: "power2.inOut", })


    
    // 히어로 섹션 스크롤 애니메이션 (리팩토링)
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero', // 히어로 섹션
        start: 'center center',
        end: 'bottom 80%', // 스크롤 거리
        toggleActions: "play none resume reverse",
        // pin: true,
        // scrub: true,
        // anticipatePin: 1,
      },
    });

    heroTimeline
      // 1. 텍스트 줄(li)들이 아래에서 위로 나타남
      .from('.hero .opacity_reveal li', {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.4, // 각 줄이 순차적으로 나타나도록 약간의 간격 추가
      })
      // 2. 이미지가 약간의 딜레이 후 나타남
      .from('.hero .imgbox', {
        opacity: 0,
        y: 54,
        duration: 4,
        ease: 'power2.out',
      }, '<0.2') // 이전 애니메이션 시작 후 0.3초 뒤에 시작
      // 3. 텍스트에 그라디언트 색상이 채워짐
      .to('.hero .opacity_reveal li', {
        backgroundSize: '100% 100%, 100% 100%',
        duration: 0.6,
        ease: 'none',
        stagger: 0.3, // 0.8초 간격으로 순차 적용
      }, '+=0.2') // 앞선 애니메이션 완료 후 0.5초 뒤 시작
      .to({}, { duration: 3 });
  }

  // 공모전 수상자 섹션 스크롤 애니메이션 (반응형)
  if (document.querySelector('.contest-winner')) {
    ScrollTrigger.matchMedia({
      // 데스크톱 (1440px 이상)
      "(min-width: 1440px)": function () {
        const winnerSections = document.querySelectorAll('.contest-winner .video-content');
        winnerSections.forEach((section, index) => {
          const video = section.querySelector('video');
          const awardInfo = section.querySelector('.award-info');
          const blur1 = section.querySelector('.blur-1');
          const blur2 = section.querySelector('.blur-2');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "center center",
              end: "+=2200", // 데스크톱: 긴 스크롤
              pin: true,
              scrub: true,
              anticipatePin: 1
            }
          });

          // 데스크톱 애니메이션: 좌우 이동 있음
          tl.set(awardInfo, { xPercent: 0, autoAlpha: 0 });
          tl.set(video, { scale: 0.2, xPercent: 50, autoAlpha: 0 });
          tl.set(blur1, { scale: 0.3, x: 300, y: 200, autoAlpha: 0 });
          tl.set(blur2, { scale: 0.4, x: -250, y: -150, autoAlpha: 0 });

          tl.to(video, {
            scale: 1,
            autoAlpha: 1,
            duration: 5,
            ease: "power3.inOut"
          }, 'start')
            .to([blur1, blur2], {
              scale: 1,
              x: 0,
              y: 0,
              autoAlpha: 1,
              duration: 5,
              ease: "power1.inOut"
            }, 'start')
            .to(video, {
              xPercent: -20, // 왼쪽으로 이동
              duration: 5,
            }, 'end')
            .to(awardInfo, {
              autoAlpha: 1,
              xPercent: 20, // 오른쪽에 표시
              duration: 3,
              ease: "power1.inOut"
            }, "+=1")
            .to({}, { duration: 10 });
        });
      },

      // 노트북 (1024px ~ 1439px)
      "(min-width: 1024px) and (max-width: 1439px)": function () {
        const winnerSections = document.querySelectorAll('.contest-winner .video-content');
        winnerSections.forEach((section, index) => {
          const video = section.querySelector('video');
          const awardInfo = section.querySelector('.award-info');
          const blur1 = section.querySelector('.blur-1');
          const blur2 = section.querySelector('.blur-2');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "center center",
              end: "+=1900", // 노트북: 중간 스크롤
              pin: true,
              scrub: true,
              anticipatePin: 1
            }
          });

          // 노트북 애니메이션: 좌우 이동 약간 줄임
          tl.set(awardInfo, { xPercent: 0, autoAlpha: 0 });
          tl.set(video, { scale: 0.2, xPercent: 60, autoAlpha: 0 });
          tl.set(blur1, { scale: 0.3, x: 250, y: 150, autoAlpha: 0 });
          tl.set(blur2, { scale: 0.4, x: -200, y: -120, autoAlpha: 0 });

          tl.to(video, {
            scale: 1,
            autoAlpha: 1,
            duration: 5,
            ease: "power3.inOut"
          }, 'start')
            .to([blur1, blur2], {
              scale: 1,
              x: 0,
              y: 0,
              autoAlpha: 1,
              duration: 5,
              ease: "power1.inOut"
            }, 'start')
            .to(video, {
              xPercent: -10, // 왼쪽으로 약간 이동
              duration: 5,
            }, 'end')
            .to(awardInfo, {
              autoAlpha: 1,
              xPercent: 10, // 오른쪽에 표시 (약간 줄임)
              duration: 3,
              ease: "power1.inOut"
            }, "+=1")
            .to({}, { duration: 8 });
        });
      },

      // 태블릿 & 모바일 (1023px 이하)
      "(max-width: 1023px)": function () {
        const winnerSections = document.querySelectorAll('.contest-winner .video-content');
        winnerSections.forEach((section, index) => {
          const video = section.querySelector('video');
          const awardInfo = section.querySelector('.award-info');
          const blur1 = section.querySelector('.blur-1');
          const blur2 = section.querySelector('.blur-2');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "center center",
              end: "+=1500", // 모바일: 짧은 스크롤
              pin: true,
              scrub: true,
              anticipatePin: 1
            }
          });

          // 모바일 애니메이션: 중앙 정렬, 좌우 이동 없음
          tl.set(awardInfo, { xPercent: 0, autoAlpha: 0, x: 0 });
          tl.set(video, { scale: 0.2, xPercent: 0, autoAlpha: 0, x:0 }); // 중앙에서 시작
          tl.set(blur1, { scale: 0.3, x: 150, y: 100, autoAlpha: 0 }); // 이동 거리 축소
          tl.set(blur2, { scale: 0.4, x: -150, y: -100, autoAlpha: 0 });

          tl.to(video, {
            scale: 1,
            autoAlpha: 1,
            duration: 5,
            ease: "power3.inOut"
          }, 'start')
            .to([blur1, blur2], {
              scale: 1,
              x: 0,
              y: 0,
              autoAlpha: 1,
              duration: 5,
              ease: "power1.inOut"
            }, 'start')
            .to(video, {
              xPercent: 0, // 이동 없음, 중앙 유지
              duration: 3,
              x: -24,
            }, 'end')
            .to(awardInfo, {
              autoAlpha: 1,
              xPercent: 0, // 중앙에 표시
              duration: 3,
              x: 24,
              ease: "power1.inOut"
            }, "+=1")
            .to({}, { duration: 7 }); // 짧게 머무름
        });
      }
    });
  }


  //진행중인 공모전 - 카운터 설정
  function counter(targetDateString, daysEl, hoursEl, minutesEl, secondsEl) {
    const theDate = new Date(targetDateString);
    const _second = 1000;
    const _minute = _second * 60;
    const _hour = _minute * 60;
    const _day = _hour * 24;
    let timer;

    function count() {
      const now = new Date();
      const distance = theDate - now;

      if (distance < 0) {
        clearInterval(timer);
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / _day);
      const hours = Math.floor((distance % _day) / _hour);
      const minutes = Math.floor((distance % _hour) / _minute);
      const seconds = Math.floor((distance % _minute) / _second);

      daysEl.textContent = days < 10 ? '0' + days : days;
      hoursEl.textContent = hours < 10 ? '0' + hours : hours;
      minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
      secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    timer = setInterval(count, 1000);
    count(); // Call count immediately to avoid initial delay
  }

  const countElements = document.querySelectorAll('.running-contest .counter .countbox span');
  if (countElements.length === 4) {
    counter('11/20/2025 23:59:29 UTC', countElements[0], countElements[1], countElements[2], countElements[3]);
    /* 날짜 변경이 필요하면 위에 날짜를 변경 */
  }

  /* 갤러리_popular img 스와이퍼
     사용법(간단):
     - 슬라이더 컨테이너에 `.popular_img_slide` 클래스를 유지하세요.
     - 페이지에 여러 스와이퍼가 있을 경우 pagination 엘리먼트 선택자를 슬라이더 내부로 제한하세요.
     - 옵션 수정 시 아래 주석을 참고해 값을 변경하세요.
  */
  // 슬라이더 컨테이너를 검색합니다. 없으면 종료합니다.
  const popularImgContainer = document.querySelector('.popular_img_slide');
  if (popularImgContainer && popularImgContainer.offsetParent !== null) {
    // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
    const pagination = popularImgContainer.parentElement.querySelector('.swiper-pagination');

    // Swiper 인스턴스 생성
    const popularImgSwiper = new Swiper(popularImgContainer, {
      // 시각 효과: coverflow (회전, 깊이감을 줌)
      effect: 'coverflow',
      loop: true,           // 무한 루프
      loopAdditionalSlides: 5,
      grabCursor: true,     // 커서가 잡는 모양
      centeredSlides: true, // 가운데 슬라이드 중심
      initialSlide: 1,
      spaceBetween: -300,
      coverflowEffect: {
        rotate: 80,   // 회전 각도
        stretch: 10,   // 늘림
        depth: 500,   // 깊이
        modifier: 1.2,  // 효과 강도
        slideShadows: false,
      },
      observer: true,
      observeParents: true,
      // pagination을 명확히 지정 (없으면 생략)
      pagination: pagination ? { el: pagination, clickable: true } : undefined,
      // 반응형 브레이크포인트
      breakpoints: {
        320: { slidesPerView: 1.5 },
        580: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
        1400: { slidesPerView: "auto" }
      }
    });
  }

  // 갤러리_new img swiper
  const newImgContainer = document.querySelector('.new_img_slide');
  if (newImgContainer && newImgContainer.offsetParent !== null) {

    // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
    const pagination = newImgContainer.parentElement.querySelector('.swiper-pagination');

    // Swiper 인스턴스 생성
    const newImgSwiper = new Swiper(newImgContainer, {
      effect: 'slide',
      loop: true,           // 무한 루프
      loopAdditionalSlides: 5,
      grabCursor: true,     // 커서가 잡는 모양
      centeredSlides: true,
      autoplay: {
        delay: 3000, //3초 = 3000
        disableOnInteraction: false,
      },
      observer: true,
      observeParents: true,
      // pagination을 명확히 지정 (없으면 생략)
      pagination: pagination ? { el: pagination, clickable: true } : undefined,

      // 반응형 브레이크포인트
      breakpoints: {
        320: { slidesPerView: 1 },
        580: { slidesPerView: 2 },
        1200: { slidesPerView: 1.6 },
        1430: { slidesPerView: 2 },
        1710: { slidesPerView: 2.4 }
      }
    });

  }

  // 커뮤니티 섹션 갤러리 스와이퍼 (지연 초기화 + 토글 대응)
  const initCommunitySwiper = (container) => {
    if (container && !container.swiper) {
      new Swiper(container, {
        slidesPerView: 'auto',
        spaceBetween: 52,
        loop: true,
        autoplay: {
          delay: 4000, //4초 = 4000
          disableOnInteraction: false,
        },
        centeredSlides: false,
        allowTouchMove: true,
        grabCursor: true,
        observer: true,
        observeParents: true,
        initialSlide: 0,
        breakpoints: {
          320: { spaceBetween: 12 },
          768: { spaceBetween: 16 },
          1200: { spaceBetween: 52 },
          1920: { spaceBetween: 72 }
        }
      });
    }
  };

  // 초기에는 Today 영역의 스와이퍼만 초기화
  document.querySelectorAll('.community .comm_today .comm_gallery').forEach(initCommunitySwiper);

  // 커뮤니티 Today/Weekly 토글
  const communitySection = document.querySelector('.community');
  if (communitySection) {
    const toggleBtns = communitySection.querySelectorAll('.com_toggle_btn');
    const todayWrap = communitySection.querySelector('.articles .comm_today');
    const weeklyWrap = communitySection.querySelector('.articles .comm_weekly');

    // 초기 상태: Today 보이기, Weekly 숨김
    if (todayWrap && weeklyWrap) {
      todayWrap.style.display = '';
      weeklyWrap.style.display = 'none';
    }

    const updateVisible = (showWeekly) => {
      if (!todayWrap || !weeklyWrap) return;
      const targetWrap = showWeekly ? weeklyWrap : todayWrap;
      const otherWrap = showWeekly ? todayWrap : weeklyWrap;

      // 표시 전환
      otherWrap.style.display = 'none';
      targetWrap.style.display = '';

      // 보이게 된 영역의 스와이퍼를 초기화(필요 시)하고 0번 슬라이드로 리셋 후 업데이트
      targetWrap.querySelectorAll('.comm_gallery').forEach(container => {
        initCommunitySwiper(container);
        if (container.swiper) {
          container.swiper.update();
          container.swiper.slideTo(0, 0, false);
        }
      });
    };

    toggleBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateVisible(idx === 1); // 0: today, 1: weekly
      });
    });
  }

  // 투표 섹션 카드 플립
  const voteContainer = document.querySelector('.vote-container');
  if (voteContainer) {
    const voteBtns = document.querySelectorAll('.vote-btn');
    const voteAgainBtn = document.querySelector('.vote-again-btn');
    const voteCards = voteContainer.querySelectorAll('.vote-card');
    let animated = false; // 'animated' 변수를 voteContainer 스코프 안으로 이동

    // 'Vote Now' 버튼 클릭 이벤트
    voteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // 부모 요소로의 이벤트 전파를 막습니다.

        // 이미 투표했는지 확인
        if (voteContainer.classList.contains('voted')) {
          return;
        }

        // 클릭된 카드에 'selected' 클래스 추가
        const selectedCard = btn.closest('.vote-card');
        if (selectedCard) {
          selectedCard.classList.add('selected');
        }

        // 모든 카드에 플립 클래스 추가
        voteCards.forEach(card => {
          card.classList.add('is-flipped');
        });

        // 투표 완료 상태 클래스 추가
        voteContainer.classList.add('voted');

        // 투표 후 프로그레스 바 애니메이션 실행
        if (!animated) {
          animateProgress(".progress01", 45);
          animateProgress(".progress02", 35);
          animateProgress(".progress03", 20);
          animated = true;
        }
      });
    });

    // 'Vote Again' 버튼 클릭 이벤트
    if (voteAgainBtn) {
      voteAgainBtn.addEventListener('click', () => {
        // 모든 카드에서 플립 및 선택 클래스 제거
        voteCards.forEach(card => {
          card.classList.remove('is-flipped');
          card.classList.remove('selected');
        });

        // 투표 완료 상태 클래스 제거
        voteContainer.classList.remove('voted');

        // 프로그레스 바 초기화
        $(".progress").val(0);
        animated = false;
      });
    }
  }

  // 프로그레스바 애니메이션 함수를 DOMContentLoaded 리스너 내부에 정의
  function animateProgress(selector, targetValue) {
    // jQuery가 로드되었는지 확인
    if (window.jQuery) {
      $({ val: 0 }).animate({ val: targetValue }, {
        duration: 1000,
        step: function (now) {
          $(selector).val(Math.floor(now));
        }
      });
    }
  }
  
  const voteAgainBtn = document.querySelector('.vote-again-btn');
      const voteIcon = voteAgainBtn ? voteAgainBtn.querySelector('i') : null;
      if (voteAgainBtn && voteIcon) {
        voteAgainBtn.addEventListener('click', function() {
          voteIcon.classList.add('rotate-anim');
          setTimeout(function() {
            voteIcon.classList.remove('rotate-anim');
          }, 700);
        });
      }
}); // DOMContentLoaded 끝
