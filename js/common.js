/* 푸터 버튼 on */
const familySiteBtn = document.querySelector('.family_site_btn');
const familySite = document.querySelector('.footer_family_site');

familySiteBtn.addEventListener('click', () => {
    familySite.classList.toggle('on');
});