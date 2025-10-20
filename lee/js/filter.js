// filter.js
const buttons = document.querySelectorAll('.btn');
const shows = document.querySelectorAll('.show-item');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // 버튼 활성화 표시
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    shows.forEach(show => {
      if (filter === 'all') {
        show.style.display = 'block';
      } else if (show.dataset.status === filter) {
        show.style.display = 'block';
      } else {
        show.style.display = 'none';
      }
    });
  });
});