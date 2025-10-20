document.addEventListener('DOMContentLoaded', () => {

    AOS.init({
        disable: false, // aos를 끄지 않는 것 -> 애니메이션 작동하게 두기
        startEvent: 'DOMContentLoaded', // html이 다 불러와 지면 바로 aos 시작하라는 뜻
        initClassName: 'aos-init', // aos가 준비 됐다는 표시 클래스 (자동으로 붙음)
        animatedClassName: 'aos-animate', // 애니메이션이 실행 될 때 붙는 클래스 이름
        useClassNames: false, // html에 data-aos값 그대로 클래스 안 붙이기 적용
        disableMutationObserver: false, // 새로 생긴 요소도 자동으로 감지해서 애니메이션 적용
        debounceDelay: 50, // 창크기 바꿀 때 0.05초 기다렸다가 계산 (너무 자주 안하게)
        throttleDelay: 99, // 스크롤할 때 0.099초 마다 한 번씩 체크 (성능 좋게)
    });




    
})