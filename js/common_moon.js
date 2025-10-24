document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.querySelector('.wrap');
    const headerEl = document.querySelector('header');
    const logoEl = document.querySelector('header .logo');
    const navEl = document.querySelector('header nav');
    
    // 헤더 고정 전환 기준(vh) — 100이면 100vh, 80이면 80vh
    // 기준을 넘으면 header를 fixed로, 기준 이하면 relative로 동작합니다.
    const HEADER_FIX_THRESHOLD_VH = 100;

    // NAV 페이드 범위 설정 (vh)
    // - 4구간 곡선: [시작점] -> [중간1] -> [중간2] -> [마지막점]
    //   시작/마지막: 투명도 0.9 고정, 중간1/중간2: 투명도 0 (평탄 구간 포함)
    //   정상 동작 조건: START > MID1 > MID2 > LAST
    // 기본 예) 180 → 140 → 120 → 90
    //   - 180vh에서 0.9, 140~120vh 구간 0으로 유지, 90vh에서 0.9로 복귀
    const NAV_FADE_START_VH = 180; // 시작점 (투명도 0.9)
    const NAV_FADE_MID1_VH = 160;  // 중간점1 (0으로 수렴 시작)
    const NAV_FADE_MID2_VH = 40;  // 중간점2 (0 유지 종료)
    const NAV_FADE_LAST_VH = 0;   // 마지막점 (투명도 0.9)

    // NAV 고정 Y 오프셋(px) — 100vh를 벗어난 뒤 nav의 세로 위치를 조절하고 싶을 때 이 값을 수정하세요.
    // 예) 0이면 기존 위치, 20이면 아래로 20px 이동합니다.
    const NAV_Y_AFTER_100VH = -60

    let lastScrollY = window.scrollY; // 직전 스크롤 위치 저장

    // 100vh 이후 nav 세로 위치 조정 (헤더는 기존 고정 유지)
    const applyNavOffset = () => {
        if (!wrap || !navEl) return;
        const threshold = window.innerHeight; // 100vh 기준
        const y = window.scrollY || window.pageYOffset || 0;
        const isOff = wrap.classList.contains('off');
        if (isOff) {
            // 헤더가 숨김 상태일 땐 nav 변환 초기화
            navEl.style.transform = '';
            wrap.classList.remove('nav-scrolling');
            return;
        }
        if (y > threshold) {
            navEl.style.transform = `translateY(${NAV_Y_AFTER_100VH}px)`;
            // nav 오프셋이 적용되는 구간(100vh 이후)에서는 로고를 숨기기 위한 상태 클래스 부여
            wrap.classList.add('nav-scrolling');
        } else {
            navEl.style.transform = '';
            wrap.classList.remove('nav-scrolling');
        }
    };

    // 헤더 포지션 전환: threshold(vh) 이하 => relative, 초과 => fixed
    const applyHeaderFixedState = () => {
        if (!headerEl) return;
        const thresholdPx = Math.max(0, Math.round(window.innerHeight * (HEADER_FIX_THRESHOLD_VH / 100)));
        const y = window.scrollY || window.pageYOffset || 0;
        if (y > thresholdPx) {
            headerEl.classList.add('is-fixed');
        } else {
            headerEl.classList.remove('is-fixed');
        }
    };

    // NAV 투명도: 4구간(시작→중간1→중간2→마지막)으로 선형/평탄 보간
    //  - y >= startPx                 => 0.9 (고정)
    //  - mid1Px < y < startPx         => 0 ~ 0.9 선형 증가
    //  - mid2Px <= y <= mid1Px        => 0 (평탄 구간)
    //  - lastPx < y < mid2Px          => 0 ~ 0.9 선형 증가
    //  - y <= lastPx                  => 0.9 (고정)
    const applyNavOpacity = () => {
        if (!navEl) return;
        const y = window.scrollY || window.pageYOffset || 0;
        const startPx = Math.round(window.innerHeight * (NAV_FADE_START_VH / 100));
        const mid1Px = Math.round(window.innerHeight * (NAV_FADE_MID1_VH / 100));
        const mid2Px = Math.round(window.innerHeight * (NAV_FADE_MID2_VH / 100));
        const lastPx = Math.round(window.innerHeight * (NAV_FADE_LAST_VH / 100));

        // 방어: 잘못된 설정 시 원복 (정상: start > mid1 > mid2 > last)
        if (!(startPx > mid1Px && mid1Px > mid2Px && mid2Px > lastPx)) {
            navEl.style.opacity = '';
            return;
        }

    const edge = 0.9; // 양 끝(시작/마지막)에서의 투명도는 고정(요청사항)
        let opacity = edge;

        if (y >= startPx) {
            // 시작점보다 아래(더 내려감) → 가장 불투명(edge)
            opacity = edge;
        } else if (y > mid1Px) {
            // startPx ~ mid1Px 사이: edge → 0으로 선형 하강
            const t = (y - mid1Px) / (startPx - mid1Px); // mid1:0 ~ start:1
            opacity = edge * t;
        } else if (y >= mid2Px) {
            // mid1Px ~ mid2Px 구간: 0 유지 (평탄)
            opacity = 0;
        } else if (y > lastPx) {
            // mid2Px ~ lastPx 사이: 0 → edge로 선형 상승
            const t = (mid2Px - y) / (mid2Px - lastPx); // mid2:0 ~ last:1
            opacity = edge * t;
        } else {
            // 마지막점보다 위(가장 상단 근처) → 다시 edge
            opacity = edge;
        }
        navEl.style.opacity = String(opacity);
    };

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
            // 아래로 스크롤 → 헤더 숨김
            wrap.classList.add('off')
        } else {
            // 위로 스크롤 → 헤더 보임
            wrap.classList.remove('off')
        }
        lastScrollY = currentScrollY;
        applyNavOffset();
        applyHeaderFixedState();
        applyNavOpacity();
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
    ham.addEventListener('click', () => {
        document.querySelector('nav').classList.toggle('mobile');
    });

    // 초기 1회 적용 (페이지 진입 시 위치 보정)
    applyNavOffset();
    applyHeaderFixedState();
    applyNavOpacity();

    // 초기 1회 적용 (페이지 진입 시 위치 보정)
    applyNavOffset();
    applyHeaderFixedState();

    /* 푸터 버튼 on */
    const familySiteBtn = document.querySelector('.family_site_btn');
    const familySite = document.querySelector('.footer_family_site');

    familySiteBtn.addEventListener('click', () => {
        familySite.classList.toggle('on');
    });
})