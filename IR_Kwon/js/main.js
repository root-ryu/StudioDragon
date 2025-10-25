// 호버 시 비디오 재생
item.addEventListener('mouseenter', () => video.play());
// 호버 아웃 시 비디오 일시정지 & 처음으로
item.addEventListener('mouseleave', () => {
  video.pause();
  video.currentTime = 0;
});