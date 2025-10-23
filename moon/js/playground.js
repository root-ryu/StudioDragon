AOS.init({
  disable: false, // aos 끄지 않기 -> 애니메이션 작동하게 두기
  startEvent: 'DOMContentLoaded', // html이 다 불러와지면 바로 aos 시작
  initClassName: 'aos-init', // AOS가 준비 됐다는 표시 클래스 (자동 붙음)
  animatedClassName: 'aos-animate', // 애니메이션이 실행될때 붙는 클래스 이름
  useClassNames: false, // HTML에 data-aos값 그대로 클래스 안붙이기 적용
  disableMutationObserver: false, // 새로생긴 요소도 자동감지해서 애니메이션 적용
  debounceDelay: 50, // 창크기 바꿀때 0.05초 기다렸다가 계산 (너무 자주 안하게)
  throttleDelay: 99, // 스크롤할때 0.099초마다 한번씩 체크 (성능 좋게)

});


// 히어로 글자 컬러 채우기
(function() {
  const heroListItems = document.querySelectorAll('.hero li');
  if (!heroListItems || heroListItems.length === 0) return;

  const triggerRatio = 0.5; // 화면의 절반에 위치하면
  let ticking = false;

  function updateColor() {
    ticking = false;
    const triggerY = window.innerHeight * triggerRatio;

    heroListItems.forEach(li => {
      const rect = li.getBoundingClientRect();
      const isPast = rect.top <= triggerY;
      if (isPast) {
        li.classList.add('filled');
      } else {
        li.classList.remove('filled');
      }
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateColor);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // run once on load
  updateColor();
})();

/* 팬 갤러리 모달/좋아요 동작 추가
   - 카드 클릭 시 모달 오픈
   - ESC 또는 닫기 버튼 클릭 시 모달 닫기
   - 좋아요 버튼은 간단히 클릭 토글(숫자 증가/감소 시뮬레이션)
*/
(function() {
  // 카드와 모달 요소 선택
  const cards = document.querySelectorAll('.fg-card');
  const modal = document.querySelector('.fg-modal');
  const modalImg = document.querySelector('.fg-modal-img');
  const modalTitle = document.querySelector('.fg-modal-title');
  const modalText = document.querySelector('.fg-modal-text');
  const modalClose = document.querySelector('.fg-close');

  if (!modal) return; // 갤러리 섹션이 없으면 종료

  // 카드 클릭: 모달 내용 채우고 열기
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      const img = card.querySelector('img');
      const src = img ? img.src : '';
      const title = card.dataset.title || '';
      const desc = card.dataset.desc || '';

      modalImg.src = src;
      modalImg.alt = title;
      modalTitle.textContent = title;
      modalText.textContent = desc;

      modal.setAttribute('aria-hidden', 'false');
      // 포커스 관리: 닫기 버튼에 포커스 이동
      modalClose && modalClose.focus();
    });
  });

  // 닫기 버튼
  modalClose && modalClose.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'true');
  });

  // ESC 키로 닫기
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  // 좋아요 토글: 간단한 시뮬레이션(숫자 직접 파싱/증감)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.fg-meta .like');
    if (!btn) return;
    e.stopPropagation();
    // 버튼 텍스트 예: '❤ 124'
    const parts = btn.textContent.trim().split(' ');
    const heart = parts[0] || '❤';
    let num = parseInt(parts[1] || '0', 10);
    // 토글 상태로 간단히 +1/-1
    if (btn.classList.contains('liked')) {
      num = Math.max(0, num - 1);
      btn.classList.remove('liked');
    } else {
      num = num + 1;
      btn.classList.add('liked');
    }
    btn.textContent = `${heart} ${num}`;
  });
})();




/* 날짜 카운터 */
function counter(targetDateString, daysEl, hoursEl, minutesEl, secondsEl) {
  var theDate = new Date(targetDateString);
  var _second = 1000;
  var _minute = _second * 60;
  var _hour = _minute * 60;
  var _day = _hour * 24;
  var timer;

  function count() {
    var now = new Date();
    var distance = theDate - now;

    if (distance < 0) {
      clearInterval(timer);
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);

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



/* 갤러리_popular img 스와이퍼
   사용법(간단):
   - 슬라이더 컨테이너에 `.popular_img_slide` 클래스를 유지하세요.
   - 페이지에 여러 스와이퍼가 있을 경우 pagination 엘리먼트 선택자를 슬라이더 내부로 제한하세요.
   - 옵션 수정 시 아래 주석을 참고해 값을 변경하세요.
*/
(function(){
  // 슬라이더 컨테이너를 검색합니다. 없으면 종료합니다.
  var container = document.querySelector('.popular_img_slide');
  if(!container) return; // 슬라이더가 없으면 초기화 중단

  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  var pagination = container.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  var popularImgSwiper = new Swiper(container, {
  // 시각 효과: coverflow (회전, 깊이감을 줌)
  effect: 'coverflow',
  loop: true,           // 무한 루프
  grabCursor: true,     // 커서가 잡는 모양
  centeredSlides: true, // 가운데 슬라이드 중심
  coverflowEffect: {
    rotate: 40,   // 회전 각도
    stretch: 0,   // 늘림
    depth: 500,   // 깊이
    modifier: 0.6,  // 효과 강도
    slideShadows: true
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
    1400: { slidesPerView: 3.5 }
  }
  });

  // 콘솔에 상태 로그 (디버깅용). 배포 시 주석 처리 가능
  console.log('popularImgSwiper 초기화 됨', popularImgSwiper);
})();

// 갤러리_new img swiper
(function(){
  var container = document.querySelector('.new_img_slide');
  if(!container) return; // 슬라이더가 없으면 초기화 중단

  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  var pagination = container.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  var newImgSwiper = new Swiper(container, {
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

/* 갤러리_popular video 스와이퍼
   사용법(간단):
   - 슬라이더 컨테이너에 `.popular_img_slide` 클래스를 유지하세요.
   - 페이지에 여러 스와이퍼가 있을 경우 pagination 엘리먼트 선택자를 슬라이더 내부로 제한하세요.
   - 옵션 수정 시 아래 주석을 참고해 값을 변경하세요.
*/
(function(){
  // 슬라이더 컨테이너를 검색합니다. 없으면 종료합니다.
  var container = document.querySelector('.popular_video_slide');
  if(!container) return; // 슬라이더가 없으면 초기화 중단

  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  var pagination = container.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  var popularVideoSwiper = new Swiper(container, {
  // 시각 효과: coverflow (회전, 깊이감을 줌)
  effect: 'coverflow',
  loop: true,           // 무한 루프
  grabCursor: true,     // 커서가 잡는 모양
  centeredSlides: true, // 가운데 슬라이드 중심
  coverflowEffect: {
    rotate: 40,   // 회전 각도
    stretch: 0,   // 늘림
    depth: 500,   // 깊이
    modifier: 1,  // 효과 강도
    slideShadows: true
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
    1400: { slidesPerView: 3.5 }
  }
  });

  // 콘솔에 상태 로그 (디버깅용). 배포 시 주석 처리 가능
  console.log('popularVideoSwiper 초기화 됨', popularVideoSwiper);
})();

// 갤러리_new video swiper
(function(){
  var container = document.querySelector('.new_video_slide');
  if(!container) return; // 슬라이더가 없으면 초기화 중단

  // 슬라이더 내부에 있는 pagination 요소만 사용하도록 범위를 좁힙니다.
  var pagination = container.parentElement.querySelector('.swiper-pagination');

  // Swiper 인스턴스 생성
  var newVideoSwiper = new Swiper(container, {
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
    1710: { slidesPerView: 3 }
  }
  });

  // 콘솔에 상태 로그 (디버깅용). 배포 시 주석 처리 가능
  console.log('newVideoSwiper 초기화 됨', newVideoSwiper);
})();

