document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("cursorCanvas");
    const ctx = canvas.getContext("2d");

    let w, h;
    let cursorActive = true; // 커서 활성화 상태

    function resize() {
        /*    w = canvas.width = window.innerWidth;
           h = canvas.height = window.innerHeight; */
        const ratio = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;

        ctx.setTransform(1, 0, 0, 1, 0, 0); // ✅ 기존 스케일 초기화
        ctx.scale(ratio, ratio); // ✅ 스케일 재적용
        w = window.innerWidth;
        h = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // GigTit 섹션 관찰 (스크롤 시 커서 비활성화)
    const gigTitSection = document.querySelector('.GigTit');
    if (gigTitSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // GigTit이 화면에 보이면 커서 비활성화
                    cursorActive = false;
                    canvas.style.opacity = '0';
                    canvas.style.transition = 'opacity 0.5s ease';
                }
            });
        }, {
            threshold: 0.3 // 30% 보이면 비활성화
        });
        observer.observe(gigTitSection);
    }

    // 포인트 배열 및 초기 좌표 (용처럼 길게)
    const trail = [];
    const maxPoints = 80; // 더 긴 꼬리
    const life = 1500; // 더 오래 남아있게
    let mouse = { x: w / 2, y: h / 2 };
    let smooth = { x: w / 2, y: h / 2 };

    // 초기 포인트 넣기 (안 움직여도 보이게)
    for (let i = 0; i < 10; i++) {
        trail.push({ x: w / 2, y: h / 2, time: Date.now() });
    }

    // 컬러 팔레트 (RGB 배열)
    // 옵션 1: 우아한 그라데이션 효과 (골드 → 레드 → 블루)
    const colors = [
        [191, 164, 115], // #BFA473 골드
        [199, 144, 102], // 중간색 1 (골드→레드)
        [207, 124, 89],  // 중간색 2
        [178, 35, 24],   // #B22318 레드
        [147, 46, 50],   // 중간색 3 (레드→블루)
        [116, 57, 76],   // 중간색 4
        [85, 68, 102],   // 중간색 5
        [54, 79, 128],   // 중간색 6
        [26, 38, 173]    // #1A26AD 블루
    ];
    
    /* 옵션 2: 강렬한 대비 효과 (3색 반복)
    const colors = [
        [191, 164, 115], // #BFA473 골드
        [178, 35, 24],   // #B22318 레드
        [26, 38, 173],   // #1A26AD 블루
        [191, 164, 115], // 골드 반복
        [178, 35, 24],   // 레드 반복
        [26, 38, 173],   // 블루 반복
        [191, 164, 115],
        [178, 35, 24],
        [26, 38, 173]
    ];
    */
    
    /* 옵션 3: 부드러운 혼합 효과 (각 색상에서 파생)
    const colors = [
        [191, 164, 115], // #BFA473 골드
        [200, 154, 110], // 골드 밝게
        [182, 154, 105], // 골드 어둡게
        [178, 35, 24],   // #B22318 레드
        [198, 55, 44],   // 레드 밝게
        [158, 25, 14],   // 레드 어둡게
        [26, 38, 173],   // #1A26AD 블루
        [56, 68, 203],   // 블루 밝게
        [16, 28, 143]    // 블루 어둡게
    ];
    */

    // 마우스 이동 추적
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function updateTrail() {
        // 커서가 비활성화되면 trail 업데이트 중지
        if (!cursorActive) return;
        
        // 점성 보간 (용처럼 부드럽게 따라오게)
        smooth.x += (mouse.x - smooth.x) * 0.15; // 더 부드럽게
        smooth.y += (mouse.y - smooth.y) * 0.15;

        trail.push({ x: smooth.x, y: smooth.y, time: Date.now() });
        while (trail.length > maxPoints) trail.shift();
    }

    // Catmull-Rom 보간 (부드러운 곡선)
    function catmullRom(p0, p1, p2, p3, t, tension = 0.5) {
        const t2 = t * t;
        const t3 = t2 * t;

        return {
            x: 0.5 * ((2 * p1.x) +
                (-p0.x + p2.x) * t * tension +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 * tension +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3 * tension),
            y: 0.5 * ((2 * p1.y) +
                (-p0.y + p2.y) * t * tension +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 * tension +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3 * tension)
        };
    }

    function draw() {
        // 커서가 비활성화되면 canvas 지우기만
        if (!cursorActive) {
            ctx.clearRect(0, 0, w, h);
            requestAnimationFrame(draw);
            return;
        }
        
        ctx.clearRect(0, 0, w, h);
        const now = Date.now();

        while (trail.length && now - trail[0].time > life) trail.shift();

        if (trail.length >= 4) {
            ctx.save();
            colors.forEach((rgb, ci) => {
                ctx.beginPath();
                let first = true;

                for (let i = 0; i < trail.length - 3; i++) {
                    const p0 = trail[i];
                    const p1 = trail[i + 1];
                    const p2 = trail[i + 2];
                    const p3 = trail[i + 3];

                    for (let t = 0; t <= 1; t += 0.05) { // 더 촘촘하게
                        const pos = catmullRom(p0, p1, p2, p3, t, 0.8); // tension 높여서 더 부드럽게
                        const age = now - p1.time;
                        const fade = Math.max(0, 1 - age / life);
                        
                        // 용의 몸처럼 물결치는 효과 (더 부드럽고 우아하게)
                        const waveSpeed = 0.15; // 느리게
                        const waveAmplitude = 3; // 작은 진폭
                        const offset = Math.sin((i + t) * waveSpeed + ci * 0.3) * waveAmplitude;

                        const x = pos.x + offset;
                        const y = pos.y + offset;

                        if (first) {
                            ctx.moveTo(x, y);
                            first = false;
                        } else {
                            ctx.lineTo(x, y);
                        }

                        // 용의 몸처럼 머리는 굵고 꼬리는 가늘게
                        const progress = i / (trail.length - 3);
                        const baseWidth = 4 - (progress * 3); // 4px에서 1px로
                        ctx.lineWidth = baseWidth + Math.sin(i * 0.2 + ci) * 0.5;
                        
                        ctx.lineCap = "round";
                        ctx.lineJoin = "round";
                        
                        // 용처럼 빛나는 효과
                        ctx.shadowBlur = 20 + (1 - progress) * 15; // 머리 쪽이 더 밝게
                        ctx.shadowColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${fade * 0.8})`;
                        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${fade * 0.9})`;

                    }
                }
                ctx.stroke();
            });
            ctx.restore();
        }

        updateTrail();
        requestAnimationFrame(draw);
    }

    draw();
});