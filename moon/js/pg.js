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
        start: 'top top',
        end: '+=250%', // 스크롤 거리
        pin: true,
        scrub: 2,
        anticipatePin: 1,
      },
    });

    heroTimeline
      // 1. 텍스트 줄(li)들이 아래에서 위로 나타남
      .from('.hero .opacity_reveal li', {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.1, // 각 줄이 순차적으로 나타나도록 약간의 간격 추가
      })
      // 2. 이미지가 약간의 딜레이 후 나타남
      .from('.hero .imgbox', {
        opacity: 0,
        y: 54,
        duration: 1,
        ease: 'power2.out',
      }, '<6') // 이전 애니메이션 시작 후 0.3초 뒤에 시작
      // 3. 텍스트에 그라디언트 색상이 채워짐
      .to('.hero .opacity_reveal li', {
        backgroundSize: '100% 100%, 100% 100%',
        duration: 1.5,
        ease: 'none',
        stagger: 0.8, // 0.8초 간격으로 순차 적용
      }, '+=0.5'); // 앞선 애니메이션 완료 후 0.5초 뒤 시작

  }

  /* 날짜 카운터 */
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

// 갤러리 토글 버튼
const gallery = document.querySelector(".creativeGallery");
const categoryBtns = gallery.querySelectorAll(".category button");
const fanarts = gallery.querySelector(".fanarts");
const fanvideos = gallery.querySelector(".fanvideos");

categoryBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    // 모든 버튼 active 제거
    categoryBtns.forEach(b => b.classList.remove("active"));
    // 클릭된 버튼에 active 추가
    btn.classList.add("active");

    // 콘텐츠 전환
    if (index === 0) {
      fanarts.classList.add("active");
      fanvideos.classList.remove("active");
    } else {
      fanarts.classList.remove("active");
      fanvideos.classList.add("active");
    }
  });
});

/* 갤러리_popular img 스와이퍼
   사용법(간단):
   - 슬라이더 컨테이너에 `.popular_img_slide` 클래스를 유지하세요.
   - 페이지에 여러 스와이퍼가 있을 경우 pagination 엘리먼트 선택자를 슬라이더 내부로 제한하세요.
   - 옵션 수정 시 아래 주석을 참고해 값을 변경하세요.
*/
// 슬라이더 컨테이너를 검색합니다. 없으면 종료합니다.
const popularImgContainer = document.querySelector('.popular_img_slide');
if (popularImgContainer) {
  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  const pagination = popularImgContainer.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  const popularImgSwiper = new Swiper(popularImgContainer, {
    // 시각 효과: coverflow (회전, 깊이감을 줌)
    effect: 'coverflow',
    loop: true,           // 무한 루프
    grabCursor: true,     // 커서가 잡는 모양
    centeredSlides: true, // 가운데 슬라이드 중심
    initialSlide: 2,
    spaceBetween: -200,
    coverflowEffect: {
      rotate: 100,   // 회전 각도
      stretch: 300,   // 늘림
      depth: 500,   // 깊이
      modifier: 0.7,  // 효과 강도
      slideShadows: false,
    },
    autoplay: {
      delay: 2500, //2.5초 = 2500
      disableOnInteraction: false,
    },
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

  // 콘솔에 상태 로그 (디버깅용). 배포 시 주석 처리 가능
  console.log('popularImgSwiper 초기화 됨', popularImgSwiper);
}

// 갤러리_new img swiper
const newImgContainer = document.querySelector('.new_img_slide');
if (newImgContainer) {

  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  const pagination = newImgContainer.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  const newImgSwiper = new Swiper(newImgContainer, {
    effect: 'slide',
    loop: true,           // 무한 루프
    grabCursor: true,     // 커서가 잡는 모양
    centeredSlides: true,
    autoplay: {
      delay: 2500, //2.5초 = 2500
      disableOnInteraction: false,
    },
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

  // 콘솔에 상태 로그 (디버깅용). 배포 시 주석 처리 가능
  // console.log('newImgSwiper 초기화 됨', newImgSwiper);
}

// 갤러리_popular video 스와이퍼
const popularVideoContainer = document.querySelector('.popular_video_slide');
if (popularVideoContainer) {

  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  const pagination = popularVideoContainer.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  const popularVideoSwiper = new Swiper(popularVideoContainer, {
    // 시각 효과: coverflow (회전, 깊이감을 줌)
    effect: 'coverflow',
    loop: true,           // 무한 루프
    grabCursor: true,     // 커서가 잡는 모양
    centeredSlides: true, // 가운데 슬라이드 중심
    initialSlide: 1,
    coverflowEffect: {
      rotate: 40,   // 회전 각도
      stretch: 0,   // 늘림
      depth: 100,   // 깊이
      modifier: 1,  // 효과 강도
      slideShadows: false,
    },
    autoplay: {
      delay: 2500, //2.5초 = 2500
      disableOnInteraction: false,
    },
    // pagination을 명확히 지정 (없으면 생략)
    pagination: pagination ? { el: pagination, clickable: true } : undefined,
    // 반응형 브레이크포인트
    breakpoints: {
      320: { slidesPerView: 1.5 },
      580: { slidesPerView: 2 },
      1200: { slidesPerView: 3 },
      1400: { slidesPerView: "auto", }
    }
  });

  // 콘솔에 상태 로그 (디버깅용). 배포 시 주석 처리 가능
  // console.log('popularVideoSwiper 초기화 됨', popularVideoSwiper);
}

// 갤러리_new video swiper
const newVideoContainer = document.querySelector('.new_video_slide');
if (newVideoContainer) {

  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  const pagination = newVideoContainer.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  const newVideoSwiper = new Swiper(newVideoContainer, {
    effect: 'slide',
    loop: true,           // 무한 루프
    grabCursor: true,     // 커서가 잡는 모양
    // centeredSlides: true,
    autoplay: {
      delay: 2500, //2.5초 = 2500
      disableOnInteraction: false,
    },
    // pagination을 명확히 지정 (없으면 생략)
    pagination: pagination ? { el: pagination, clickable: true } : undefined,

    // 반응형 브레이크포인트
    breakpoints: {
      320: { slidesPerView: 1 },
      580: { slidesPerView: 2 },
      1200: { slidesPerView: 1.6 },
      1430: { slidesPerView: 2 },
      1710: { slidesPerView: "auto" }
    }
  });

  // 콘솔에 상태 로그 (디버깅용). 배포 시 주석 처리 가능
  // console.log('newVideoSwiper 초기화 됨', newVideoSwiper);
}

// 커뮤니티 섹션 갤러리 스와이퍼 (좌측 정렬, 수동 슬라이드, 루프/페이지네이션 없음)
const commGalleryContainer = document.querySelector('.comm_gallery');
if (commGalleryContainer) {

  // 한국어 설정 가이드
  // - slidesPerView: 'auto' 로 두면 CSS에서 정의한 슬라이드 너비가 그대로 적용됩니다.
  //   (슬라이드 너비는 pg-style.css의 .community .comm_gallery .swiper-slide에서 조정)
  // - spaceBetween: 카드 사이 간격(px)
  // - loop, pagination, autoplay는 사용하지 않습니다. (요청사항)
  // - 사용자가 드래그하여 좌우로 넘기게 하려면 allowTouchMove: true 유지

  const commGallerySwiper = new Swiper(commGalleryContainer, {
    slidesPerView: 'auto',
    spaceBetween: 18,
    loop: false,
    centeredSlides: false,
    allowTouchMove: true,
    grabCursor: true,
    autoplay: {
      delay: 2500, //2.5초 = 2500
      disableOnInteraction: false,
    },
    // 방향키 내비 필요하면 아래 주석 해제 후 HTML에 버튼 추가해서 사용
    // navigation: { nextEl: '.comm-next', prevEl: '.comm-prev' },
    // 반응형: 필요 시 카드 간격만 소폭 조정 예시
    breakpoints: {
      320: { spaceBetween: 12 },
      768: { spaceBetween: 16 },
      1200: { spaceBetween: 18 }
    }
  });

  // console.log('commGallerySwiper 초기화 됨', commGallerySwiper);
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

}); // DOMContentLoaded 끝
