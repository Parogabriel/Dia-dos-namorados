
const mapCanvas = document.getElementById('starMap');
if (mapCanvas) {
    const mapCtx = mapCanvas.getContext('2d');
    let mapSize = 0;

    function initStarMap() {
        const container = mapCanvas.parentElement;
        const rect = container.getBoundingClientRect();
        mapSize = Math.round(rect.width) || 250;
        const dpr = window.devicePixelRatio || 1;
        mapCanvas.width = mapSize * dpr;
        mapCanvas.height = mapSize * dpr;
        mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', () => {
        initStarMap();
        regenerateStars();
    });

    // Background stars - very subtle tiny specks
    let mapStars = [];
    function regenerateStars() {
        mapStars = [];
        for (let i = 0; i < 120; i++) {
            const r = Math.random() * (mapSize / 2);
            const theta = Math.random() * 2 * Math.PI;
            mapStars.push({
                x: mapSize / 2 + r * Math.cos(theta),
                y: mapSize / 2 + r * Math.sin(theta),
                radius: 0.2 + Math.random() * 0.4,
                alpha: 0.1 + Math.random() * 0.15,
                twinkleSpeed: 0.015 + Math.random() * 0.03,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }

    // ========================================
    // REAL CONSTELLATIONS — Night sky from
    // Lagoa Santa, MG (-19.63°, -43.89°)
    // December 23, 2023 ~21:00 local time
    // ========================================
    // Coordinates are relative to center, range -1 to 1
    // Mapped to approximate positions looking up

    // ORION — The Hunter (dominant in December sky)
    const orion = {
        stars: [
            { x: -0.12, y: -0.35, mag: 1.0 },  // Betelgeuse (bright red giant)
            { x:  0.12, y: -0.32, mag: 0.8 },  // Bellatrix
            { x: -0.04, y: -0.10, mag: 0.7 },  // Alnitak (belt left)
            { x:  0.00, y: -0.12, mag: 0.7 },  // Alnilam (belt center)
            { x:  0.04, y: -0.14, mag: 0.7 },  // Mintaka (belt right)
            { x:  0.15, y:  0.10, mag: 1.0 },  // Rigel (bright blue)
            { x: -0.10, y:  0.08, mag: 0.6 },  // Saiph
        ],
        connections: [
            [0, 2], // Betelgeuse to belt
            [1, 4], // Bellatrix to belt
            [2, 3], [3, 4], // Belt stars
            [0, 1], // Shoulders
            [5, 4], // Rigel to belt
            [6, 2], // Saiph to belt
            [5, 6], // Bottom
        ]
    };

    // CANIS MAJOR — with Sirius (brightest star in the sky)
    const canisMajor = {
        stars: [
            { x: -0.25, y:  0.30, mag: 1.3 },  // Sirius ★ (brightest!)
            { x: -0.35, y:  0.45, mag: 0.5 },  // Mirzam
            { x: -0.20, y:  0.50, mag: 0.5 },  // Wezen
            { x: -0.15, y:  0.55, mag: 0.4 },  // Aludra
            { x: -0.30, y:  0.55, mag: 0.4 },  // Adhara
        ],
        connections: [
            [0, 1], [0, 2], [2, 3], [2, 4], [1, 4]
        ]
    };

    // TAURUS — The Bull (above Orion)
    const taurus = {
        stars: [
            { x:  0.20, y: -0.55, mag: 0.9 },  // Aldebaran (bright orange)
            { x:  0.15, y: -0.60, mag: 0.4 },  // Hyades cluster star
            { x:  0.25, y: -0.58, mag: 0.4 },  // Hyades cluster star
            { x:  0.30, y: -0.50, mag: 0.3 },  // 
            { x:  0.40, y: -0.55, mag: 0.5 },  // Elnath (tip of horn)
            { x:  0.10, y: -0.45, mag: 0.5 },  // Zeta Tauri (other horn)
        ],
        connections: [
            [0, 1], [0, 2], [0, 3], [3, 4], [0, 5]
        ]
    };

    // GEMINI — The Twins (to the left of Orion)
    const gemini = {
        stars: [
            { x: -0.40, y: -0.50, mag: 0.7 },  // Castor
            { x: -0.35, y: -0.42, mag: 0.8 },  // Pollux
            { x: -0.42, y: -0.30, mag: 0.3 },  // 
            { x: -0.35, y: -0.22, mag: 0.3 },  //
        ],
        connections: [
            [0, 1], [0, 2], [1, 3]
        ]
    };

    // LEPUS — The Hare (below Orion)
    const lepus = {
        stars: [
            { x:  0.02, y:  0.25, mag: 0.4 },
            { x:  0.08, y:  0.30, mag: 0.4 },
            { x:  0.05, y:  0.38, mag: 0.3 },
            { x: -0.02, y:  0.35, mag: 0.3 },
        ],
        connections: [
            [0, 1], [1, 2], [2, 3], [3, 0]
        ]
    };

    const allConstellations = [orion, canisMajor, taurus, gemini, lepus];

    let rotationAngle = 0;
    let time = 0;

    function drawMap() {
        if (mapSize === 0) {
            initStarMap();
            regenerateStars();
        }
        mapCtx.clearRect(0, 0, mapSize, mapSize);
        
        const center = mapSize / 2;
        const scale = mapSize / 2 * 0.85; // Use 85% of radius

        // Subtle gradient background glow
        const bgGlow = mapCtx.createRadialGradient(center, center, 0, center, center, mapSize / 2);
        bgGlow.addColorStop(0, 'rgba(15, 25, 60, 0.10)');
        bgGlow.addColorStop(0.5, 'rgba(8, 15, 35, 0.05)');
        bgGlow.addColorStop(1, 'rgba(3, 5, 10, 0)');
        mapCtx.fillStyle = bgGlow;
        mapCtx.beginPath();
        mapCtx.arc(center, center, mapSize / 2, 0, Math.PI * 2);
        mapCtx.fill();

        mapCtx.save();
        mapCtx.translate(center, center);
        mapCtx.rotate(rotationAngle);
        mapCtx.translate(-center, -center);

        // Grid circles - very subtle
        mapCtx.strokeStyle = 'rgba(80, 120, 200, 0.03)';
        mapCtx.lineWidth = 0.5;
        for (let i = 1; i <= 3; i++) {
            mapCtx.beginPath();
            mapCtx.arc(center, center, (mapSize / 2) * (i / 3), 0, Math.PI * 2);
            mapCtx.stroke();
        }

        // Draw background stars with twinkling
        mapStars.forEach(star => {
            const twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
            const alpha = star.alpha * twinkle;
            mapCtx.globalAlpha = alpha;
            mapCtx.fillStyle = '#ffffff';
            mapCtx.beginPath();
            mapCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            mapCtx.fill();
        });

        // Draw all constellations
        allConstellations.forEach(constellation => {
            // Map relative coords to canvas pixels
            const pts = constellation.stars.map(s => ({
                x: center + s.x * scale,
                y: center + s.y * scale,
                mag: s.mag
            }));

            // Draw connection lines
            mapCtx.globalAlpha = 0.5;
            mapCtx.strokeStyle = 'rgba(180, 200, 255, 0.6)';
            mapCtx.lineWidth = 0.8;
            constellation.connections.forEach(([a, b]) => {
                mapCtx.beginPath();
                mapCtx.moveTo(pts[a].x, pts[a].y);
                mapCtx.lineTo(pts[b].x, pts[b].y);
                mapCtx.stroke();
            });

            // Draw star points
            pts.forEach(p => {
                const starRadius = 1 + p.mag * 1.5;
                const twinkle = 0.8 + 0.2 * Math.sin(time * 0.03 + p.x * 0.1);

                // Soft outer glow
                mapCtx.globalAlpha = 0.15 * twinkle;
                mapCtx.fillStyle = '#b0c4ff';
                mapCtx.beginPath();
                mapCtx.arc(p.x, p.y, starRadius * 3, 0, Math.PI * 2);
                mapCtx.fill();

                // Main star dot
                mapCtx.globalAlpha = twinkle;
                mapCtx.fillStyle = '#ffffff';
                mapCtx.beginPath();
                mapCtx.arc(p.x, p.y, starRadius, 0, Math.PI * 2);
                mapCtx.fill();
            });
        });

        mapCtx.restore();
        rotationAngle += 0.0001; // Very slow rotation
        time++;
    }

    // Initialize and start
    initStarMap();
    regenerateStars();

    function animate() {
        drawMap();
        requestAnimationFrame(animate);
    }
    animate();
}
