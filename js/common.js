document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.wrap');
    const headerElement = document.querySelector('header');
    const hamburger = document.querySelector('.ham');
    let lastScrollY = window.scrollY; // 직전 스크롤 위치 저장

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY < 100) {
            // 360px 미만 → 기존 헤더 애니메이션 작동
            if (currentScrollY > lastScrollY) {
                // 아래로 스크롤 → 헤더 숨김
                header.classList.add('off');
            } else {
                // 위로 스크롤 → 헤더 보임
                header.style.transition = 'all 2s ease';
                header.classList.remove('off');
            }

            // 헤더 표시, 햄버거 숨김
            if (headerElement) {
                headerElement.style.top = 0;
            }
            if (hamburger) {
                hamburger.classList.remove('show');
            }
        } else {
            // 364px 이상 → 헤더 완전 비활성화, 햄버거 활성화
            header.classList.add('off');
            if (headerElement) {
                headerElement.style.top = '-100%';
            }

            // 햄버거는 스크롤 방향에 따라 표시/숨김
            if (hamburger) {
                if (currentScrollY > lastScrollY) {
                    // 아래로 스크롤 → 햄버거 숨김
                    hamburger.classList.remove('show');
                } else {
                    // 위로 스크롤 → 햄버거 표시
                    hamburger.classList.add('show');
                }
            }
        }

        lastScrollY = currentScrollY;
    });


    const enBtn = document.querySelector('header nav .right .lang .en');
    const krBtn = document.querySelector('header nav .right .lang .kr');

    enBtn.addEventListener('click', () => {
        enBtn.classList.add('active');
        krBtn.classList.remove('active');
    });

    krBtn.addEventListener('click', () => {
        krBtn.classList.add('active');
        enBtn.classList.remove('active');
    });

    const ham = document.querySelector('.ham');
    const navHam = document.querySelector('.nav_ham');
    const hamNav = document.querySelector('.ham_nav');
    const closeBtn = document.querySelector('.ham_nav .close_btn');

    // 햄버거 메뉴 열기 (ham)
    if (ham) {
        ham.addEventListener('click', () => {
            ham.style.transition = 'none'; // 트랜지션 제거
            ham.style.opacity = '0';
            ham.style.visibility = 'hidden';
            hamNav.classList.add('active');
            document.body.style.overflow = 'hidden'; // 스크롤 방지
        });
    }

    // 햄버거 메뉴 열기 (nav_ham) - 이벤트 버블링 방지 및 강제 실행
    if (navHam) {
        navHam.addEventListener('click', (e) => {
            e.stopPropagation(); // 이벤트 버블링 방지
            e.preventDefault();
            hamNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // img 클릭 시에도 동작하도록
        const navHamImg = navHam.querySelector('img');
        if (navHamImg) {
            navHamImg.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                hamNav.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    }

    // 햄버거 메뉴 닫기
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hamNav.classList.remove('active');
        ham.style.transition = 'opacity 0.4s, visibility 0.4s'; // 트랜지션 복원
        ham.style.opacity = '';
        ham.style.visibility = '';
        document.body.style.overflow = ''; // 스크롤 복원
        
    });

    // 외부 클릭 시
    document.addEventListener('click', (e) => {
        const hamNav = document.querySelector('.ham_nav');
        // ham과 navHam 모두 체크
        const isHamClick = hamburger && hamburger.contains(e.target);
        const isNavHamClick = navHam && navHam.contains(e.target);
        
        if (!hamNav.contains(e.target) && !isHamClick && !isNavHamClick && hamNav.classList.contains('active')) {
            hamNav.classList.remove('active');
            ham.style.transition = 'opacity 0.4s, visibility 0.4s'; // 트랜지션 복원
            ham.style.opacity = '';
            ham.style.visibility = '';
            document.body.style.overflow = '';
        }
    });

    // 햄버거 메뉴 언어 스위처
    const hamLangLinks = document.querySelectorAll('.ham_nav .lang_link');
    hamLangLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            hamLangLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });



    /* 푸터 버튼 on */
    const familySiteBtn = document.querySelector('.family_site_btn');
    const familySite = document.querySelector('.footer_family_site');
    const footer = document.querySelector('footer');

    familySiteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        familySite.classList.toggle('on');
        
        if (familySite.classList.contains('on')) {
            // ver_white (화이트 모드) - 다크 색상 유지
            if (footer.classList.contains('ver_white')) {
                familySiteBtn.style.backgroundColor = 'transparent';
                familySiteBtn.querySelector('span').style.color = '#0D031C';
                familySiteBtn.querySelector('.family_site_arrow').style.filter = 'invert(1) brightness(0.5)';
            } 
            // 다크 모드 - 흰색 유지
            else {
                familySiteBtn.style.backgroundColor = 'transparent';
                familySiteBtn.querySelector('span').style.color = '#F5F5F5';
                familySiteBtn.querySelector('.family_site_arrow').style.filter = 'none';
            }
        }
    });
})