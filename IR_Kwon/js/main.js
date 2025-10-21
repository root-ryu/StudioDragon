document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card_after');
  const container = document.querySelector('.area');
  
  cards.forEach((card) => {
    card.style.transition = 'transform 0.3s ease-in-out';
    card.style.transform = 'translateX(-100%)';
  });
  
  container.addEventListener('mouseover', () => {
    cards.forEach((card) => {
      card.style.transform = 'translateX(0)';
    });
  });
  
  container.addEventListener('mouseout', () => {
    cards.forEach((card) => {
      card.style.transform = 'translateX(-100%)';
    });
  });
});