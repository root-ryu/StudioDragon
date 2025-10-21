//counts up or down depending on date entered in //format at the bottom

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

document.addEventListener('DOMContentLoaded', function() {
  const countElements = document.querySelectorAll('.running-contest .counter .countbox span');
  if (countElements.length === 4) {
    counter('11/20/2025 23:59:29 UTC', countElements[0], countElements[1], countElements[2], countElements[3]);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const countElements = document.querySelectorAll('.running-contest .counter .countbox span');
  if (countElements.length === 4) {
    counter('11/20/2025 23:59:29 UTC', countElements[0], countElements[1], countElements[2], countElements[3]);
  }

  // Contest Winner Animation
  const videoBoxes = document.querySelectorAll('.contest-winner .video-content-box');
  
  function checkScroll() {
    videoBoxes.forEach((box) => {
      const boxTop = box.getBoundingClientRect().top;
      const boxBottom = box.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      
      // 박스가 화면에 들어왔는지 확인
      if (boxTop < windowHeight * 0.8 && boxBottom > windowHeight * 0.2) {
        const scrollProgress = (windowHeight * 0.8 - boxTop) / (windowHeight * 0.6);
        const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
        
        // 3단계 애니메이션
        if (clampedProgress < 0.33) {
          // Stage 1: 작게 가운데
          box.classList.remove('stage-2', 'stage-3');
          box.classList.add('stage-1');
        } else if (clampedProgress < 0.66) {
          // Stage 2: 크게 가운데
          box.classList.remove('stage-1', 'stage-3');
          box.classList.add('stage-2');
        } else {
          // Stage 3: 최종 상태 (왼쪽 정렬 + info 표시)
          box.classList.remove('stage-1', 'stage-2');
          box.classList.add('stage-3');
        }
      }
    });
  }
  
  // 스크롤 이벤트 리스너
  window.addEventListener('scroll', checkScroll);
  
  // 초기 체크
  checkScroll();
});