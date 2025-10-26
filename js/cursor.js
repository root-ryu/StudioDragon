document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("cursorCanvas");
    const ctx = canvas.getContext("2d");

    let w, h;
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

    // 포인트 배열 및 초기 좌표
    const trail = [];
    const maxPoints = 60;
    const life = 1000;
    let mouse = { x: w / 2, y: h / 2 };
    let smooth = { x: w / 2, y: h / 2 };

    // 초기 포인트 넣기 (안 움직여도 보이게)
    for (let i = 0; i < 10; i++) {
        trail.push({ x: w / 2, y: h / 2, time: Date.now() });
    }

    // 컬러 팔레트 (RGB 배열)
    const colors = [
        [255, 99, 132],
        [255, 159, 64],
        [255, 205, 86],
        [75, 192, 192],
        [54, 162, 235],
        [153, 102, 255],
        [255, 0, 102],
        [0, 255, 128],
        [0, 204, 255],
        [255, 51, 153],
        [153, 255, 102],
        [255, 255, 153]
    ];

    // 마우스 이동 추적
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function updateTrail() {
        // 점성 보간 (끈적하게 따라오게)
        smooth.x += (mouse.x - smooth.x) * 0.25;
        smooth.y += (mouse.y - smooth.y) * 0.25;

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

                    for (let t = 0; t <= 1; t += 0.03) {
                        const pos = catmullRom(p0, p1, p2, p3, t, 0.25);
                        const age = now - p1.time;
                        const fade = Math.max(0, 1 - age / life);
                        const offset = Math.sin((i + t) * 0.5 + ci * 0.4) * 6;

                        const x = pos.x + offset;
                        const y = pos.y + offset;

                        if (first) {
                            ctx.moveTo(x, y);
                            first = false;
                        } else {
                            ctx.lineTo(x, y);
                        }

                        ctx.lineWidth = 2 + Math.sin(i * 0.4 + ci) * 0.8;
                        ctx.lineCap = "round";
                        ctx.lineJoin = "round";
                        ctx.shadowBlur = 25;
                        ctx.shadowColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`;
                        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${fade})`;

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