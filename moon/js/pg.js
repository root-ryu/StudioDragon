// GSAP으로 스크롤 애니메이션 구현 (AOS/ASAP 대체)
document.addEventListener('DOMContentLoaded', () => {
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    // 히어로 섹션 스크롤 애니메이션
    const hero = document.querySelector('.hero');
    const lines = gsap.utils.toArray('.hero .opacity_reveal li');
    const imgbox = document.querySelector('.hero .imgbox');
    
    // 조정 가능한 값들 (한국어 주석)
    const HERO_FILL_STAGGER = 0.8; // 그라디언트 채우기 간격 (초)
    const HERO_SCROLL_DISTANCE = '+=200%'; // 전체 스크롤 진행 거리

    if (hero && lines.length) {
      // 초기 상태 설정
      gsap.set(lines, { opacity: 0, y: 24 });
      if (imgbox) gsap.set(imgbox, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: HERO_SCROLL_DISTANCE,
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      // Phase 1: 텍스트박스와 이미지박스 함께 등장
      tl.to(lines, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, 0);

      if (imgbox) {
        tl.to(imgbox, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out'
        }, 0.3); // imgbox는 살짝 딜레이
      }

      // Phase 2: 텍스트 등장 완료 후, 그라디언트 순차 채우기
      tl.to(lines, {
        backgroundSize: '100% 100%, 100% 100%',
        duration: 1.5,
        ease: 'none',
        stagger: HERO_FILL_STAGGER
      }, '+=0.5'); // Phase 1 완료 후 0.5초 간격으로 시작
    }


    // 공통 페이드업
    gsap.utils.toArray('.gsap-fade-up').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }
});

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
};

const countElements = document.querySelectorAll('.running-contest .counter .countbox span');
if (countElements.length === 4) {
  counter('11/20/2025 23:59:29 UTC', countElements[0], countElements[1], countElements[2], countElements[3]);
  /* 날짜 변경이 필요하면 위에 날짜를 변경 */
}

// 갤러리 토글 버튼
(function () {
  const categoryBtns = document.querySelectorAll(".creativeGallery .category button");
  const fanarts = document.querySelector(".creativeGallery .fanarts");
  const fanvideos = document.querySelector(".creativeGallery .fanvideos");

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
})();

/* 갤러리_popular img 스와이퍼
   사용법(간단):
   - 슬라이더 컨테이너에 `.popular_img_slide` 클래스를 유지하세요.
   - 페이지에 여러 스와이퍼가 있을 경우 pagination 엘리먼트 선택자를 슬라이더 내부로 제한하세요.
   - 옵션 수정 시 아래 주석을 참고해 값을 변경하세요.
*/
(function () {
  // 슬라이더 컨테이너를 검색합니다. 없으면 종료합니다.
  const container = document.querySelector('.popular_img_slide');
  if (!container) return; // 슬라이더가 없으면 초기화 중단

  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  const pagination = container.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  const popularImgSwiper = new Swiper(container, {
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
})();

// 갤러리_new img swiper
(function () {
  const container = document.querySelector('.new_img_slide');
  if (!container) return; // 슬라이더가 없으면 초기화 중단

  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  const pagination = container.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  const newImgSwiper = new Swiper(container, {
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
  console.log('newImgSwiper 초기화 됨', newImgSwiper);
})();

// 갤러리_popular video 스와이퍼
(function () {
  const container = document.querySelector('.popular_video_slide');
  if (!container) return; // 슬라이더가 없으면 초기화 중단

  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  const pagination = container.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  const popularVideoSwiper = new Swiper(container, {
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
  console.log('popularVideoSwiper 초기화 됨', popularVideoSwiper);
})();

// 갤러리_new video swiper
(function () {
  const container = document.querySelector('.new_video_slide');
  if (!container) return; // 슬라이더가 없으면 초기화 중단

  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  const pagination = container.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  const newVideoSwiper = new Swiper(container, {
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
      1710: { slidesPerView: 3 }
    }
  });

  // 콘솔에 상태 로그 (디버깅용). 배포 시 주석 처리 가능
  console.log('newVideoSwiper 초기화 됨', newVideoSwiper);
})();

// 커뮤니티 섹션 갤러리 스와이퍼 (좌측 정렬, 수동 슬라이드, 루프/페이지네이션 없음)
(function () {
  const container = document.querySelector('.comm_gallery');
  if (!container) return;

  // 한국어 설정 가이드
  // - slidesPerView: 'auto' 로 두면 CSS에서 정의한 슬라이드 너비가 그대로 적용됩니다.
  //   (슬라이드 너비는 pg-style.css의 .community .comm_gallery .swiper-slide에서 조정)
  // - spaceBetween: 카드 사이 간격(px)
  // - loop, pagination, autoplay는 사용하지 않습니다. (요청사항)
  // - 사용자가 드래그하여 좌우로 넘기게 하려면 allowTouchMove: true 유지

  const commGallerySwiper = new Swiper(container, {
    slidesPerView: 'auto',
    spaceBetween: 18,
    loop: false,
    centeredSlides: false,
    allowTouchMove: true,
    grabCursor: true,
    // 방향키 내비 필요하면 아래 주석 해제 후 HTML에 버튼 추가해서 사용
    // navigation: { nextEl: '.comm-next', prevEl: '.comm-prev' },
    // 반응형: 필요 시 카드 간격만 소폭 조정 예시
    breakpoints: {
      320: { spaceBetween: 12 },
      768: { spaceBetween: 16 },
      1200: { spaceBetween: 18 }
    }
  });

  console.log('commGallerySwiper 초기화 됨', commGallerySwiper);
})();

