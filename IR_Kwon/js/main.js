document.addEventListener('DOMContentLoaded', function() {
  const valueDriversSection = document.querySelector('.value_drivers');
  const items = document.querySelectorAll('.value_drivers .item');
  const arrows = document.querySelectorAll('.value_drivers .arrow');
  const afterCards = document.querySelectorAll('.value_drivers .card_after');
  
  let hasAnimated = false;
  let hasScrolled = false;
  

  function checkScroll() {
    // 스크롤이 발생했는지 체크
    if (!hasScrolled) {
      hasScrolled = true;
    }
    
    if (hasAnimated) return;
    
    const sectionTop = valueDriversSection.getBoundingClientRect().top;
    const sectionBottom = valueDriversSection.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;
    
    // 스크롤이 발생했고, 섹션이 화면에 들어오면 애니메이션 시작
    if (hasScrolled && sectionTop < windowHeight && sectionBottom > 0) {
      hasAnimated = true;
      
      // item에 active 클래스 추가 (before 카드 축소)
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('active');
        }, index * 400);
      });
      
      // after 카드 opacity 애니메이션
      afterCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('active');
        }, index * 400 + 300);
      });
      
      // arrow 표시 (각 after 카드가 완전히 나타난 후)
      arrows.forEach((arrow, index) => {
        setTimeout(() => {
          arrow.classList.add('active');
        }, index * 400 + 300 + 800);
      });
    }
  }
  
  // 스크롤 이벤트 리스너 (스크롤 시작 시에만 실행)
  window.addEventListener('scroll', checkScroll);
});