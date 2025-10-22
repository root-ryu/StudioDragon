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
}

const countElements = document.querySelectorAll('.running-contest .counter .countbox span');
if (countElements.length === 4) {
  counter('11/20/2025 23:59:29 UTC', countElements[0], countElements[1], countElements[2], countElements[3]);
  /* 날짜 변경이 필요하면 위에 날짜를 변경 */
}


