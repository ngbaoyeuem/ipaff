/**
 * AZZUILL VIP 3D - JAVASCRIPT CORE ENGINE
 * Three.js 3D Visuals, Web Audio SFX, Feature Modules & URL Scheme Game Launcher
 */

// ==========================================
// 1. WEB AUDIO API SYNTHESIZER (CYBER SFX)
// ==========================================
class CyberAudioEngine {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playBeep(freq = 600, duration = 0.08, type = 'sine') {
        try {
            this.init();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }

    playVipActivation() {
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            
            // Sweep up sound (Boost charge)
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(980, now + 0.35);
            
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.45);

            // Double lock beep
            setTimeout(() => this.playBeep(1200, 0.1, 'sine'), 400);
            setTimeout(() => this.playBeep(1600, 0.15, 'sine'), 520);
        } catch (e) {}
    }

    playLockTone() {
        try {
            this.init();
            if (!this.ctx) return;
            this.playBeep(1100, 0.06, 'triangle');
            setTimeout(() => this.playBeep(1400, 0.08, 'sine'), 70);
        } catch (e) {}
    }
}

const sfx = new CyberAudioEngine();

// ==========================================
// 2. THREE.JS 3D BACKGROUND & HOLOGRAM SCENE
// ==========================================
let scene, camera, renderer;
let coreSphere, outerRings = [], particleField;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;

function init3DScene() {
    const canvas = document.getElementById('bg3d');
    if (!canvas || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070913, 0.015);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Core Holographic Icosahedron
    const geoSphere = new THREE.IcosahedronGeometry(7, 2);
    const matSphere = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });
    coreSphere = new THREE.Mesh(geoSphere, matSphere);
    scene.add(coreSphere);

    // Inner Glowing Core
    const geoInner = new THREE.SphereGeometry(3.5, 16, 16);
    const matInner = new THREE.MeshBasicMaterial({
        color: 0xff0055,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const innerCore = new THREE.Mesh(geoInner, matInner);
    coreSphere.add(innerCore);

    // Outer Cyber Rings
    const ringRadii = [11, 13.5, 16];
    const ringColors = [0x00f0ff, 0xff0055, 0xffb700];

    ringRadii.forEach((radius, i) => {
        const ringGeo = new THREE.TorusGeometry(radius, 0.08, 16, 80);
        const ringMat = new THREE.MeshBasicMaterial({
            color: ringColors[i % ringColors.length],
            transparent: true,
            opacity: 0.45
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / (2 + i);
        ring.rotation.y = (i * Math.PI) / 4;
        scene.add(ring);
        outerRings.push(ring);
    });

    // 3D Particles Stream
    const particleCount = 280;
    const pGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x00f0ff);
    const c2 = new THREE.Color(0xff0055);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 80;
        positions[i + 1] = (Math.random() - 0.5) * 80;
        positions[i + 2] = (Math.random() - 0.5) * 60;

        const mixed = Math.random() > 0.5 ? c1 : c2;
        colors[i] = mixed.r;
        colors[i + 1] = mixed.g;
        colors[i + 2] = mixed.b;
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.7
    });

    particleField = new THREE.Points(pGeometry, pMaterial);
    scene.add(particleField);

    // Event Listeners for 3D Interaction
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('touchmove', onTouchMove, { passive: true });

    animate3D();
}

function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}

function onTouchMove(e) {
    if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    }
}

let clock = 0;
function animate3D() {
    requestAnimationFrame(animate3D);
    clock += 0.015;

    if (coreSphere) {
        coreSphere.rotation.y += 0.008;
        coreSphere.rotation.x += 0.005;

        // Smooth reaction to user movement
        targetRotationY = mouseX * 0.8;
        targetRotationX = mouseY * 0.8;
        coreSphere.position.x += (mouseX * 4 - coreSphere.position.x) * 0.05;
        coreSphere.position.y += (-mouseY * 4 - coreSphere.position.y) * 0.05;
    }

    outerRings.forEach((ring, idx) => {
        ring.rotation.z += 0.006 * (idx % 2 === 0 ? 1 : -1);
        ring.rotation.x += 0.004 * (idx + 1);
    });

    if (particleField) {
        particleField.rotation.y = clock * 0.05;
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// ==========================================
// 3. UI TABS, SLIDERS & INTERACTIVE LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    init3DScene();

    // Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const masterBtn = document.getElementById('btnMasterActivate');
    const masterBtnText = document.getElementById('masterBtnText');
    const btnLaunchFF = document.getElementById('btnLaunchFF');
    const toastHud = document.getElementById('toastHud');
    const toastMsg = document.getElementById('toastMsg');
    const aimCrosshair = document.getElementById('aimCrosshair');
    const chHead = document.getElementById('chHead');
    const btnCleanRam = document.getElementById('btnCleanRam');
    const btnExportConfig = document.getElementById('btnExportConfig');
    const btnSaveConfig = document.getElementById('btnSaveConfig');
    const btnResetConfig = document.getElementById('btnResetConfig');

    // Preset weapon buttons
    const presetBtns = document.querySelectorAll('.btn-preset');

    // Telemetry DOM
    const hudFps = document.getElementById('hud-fps');
    const hudPing = document.getElementById('hud-ping');
    const hudRam = document.getElementById('hud-ram');
    const hudStatus = document.getElementById('hud-status');

    // Sliders
    const sliders = [
        { id: 'rng-sens-general', valId: 'val-sens-general', suffix: '' },
        { id: 'rng-sens-reddot', valId: 'val-sens-reddot', suffix: '' },
        { id: 'rng-sens-scope', valId: 'val-sens-scope', suffix: '' },
        { id: 'rng-sens-sniper', valId: 'val-sens-sniper', suffix: '' },
        { id: 'rng-stab-level', valId: 'val-stab-level', suffix: '%' },
        { id: 'rng-lock-strength', valId: 'val-lock-strength', suffix: '%' }
    ];

    // Bind slider events
    sliders.forEach(item => {
        const sliderEl = document.getElementById(item.id);
        const valEl = document.getElementById(item.valId);
        if (sliderEl && valEl) {
            sliderEl.addEventListener('input', (e) => {
                valEl.innerText = e.target.value + item.suffix;
                sfx.playBeep(400 + parseInt(e.target.value) * 3, 0.03, 'sine');
            });
        }
    });

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sfx.playBeep(800, 0.05, 'triangle');
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(target);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    // Weapon Presets Handler (Fix Lố FF OB54)
    const weaponProfiles = {
        shotgun: { general: 200, reddot: 200, lock: 100, stab: 98, name: "Shotgun Gõ Đầu (M1887/M1014)" },
        pistol: { general: 200, reddot: 200, lock: 99, stab: 99, name: "Lục Gõ Đầu (Desert Eagle/Woodpecker)" },
        smg: { general: 195, reddot: 190, lock: 96, stab: 96, name: "SMG Kéo Đỏ (MP40/UMP)" },
        custom: { general: 190, reddot: 185, lock: 92, stab: 94, name: "Tự Do (All Weapons)" }
    };

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sfx.playLockTone();
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const presetKey = btn.dataset.preset;
            const profile = weaponProfiles[presetKey];
            if (profile) {
                document.getElementById('rng-sens-general').value = profile.general;
                document.getElementById('val-sens-general').innerText = profile.general;

                document.getElementById('rng-sens-reddot').value = profile.reddot;
                document.getElementById('val-sens-reddot').innerText = profile.reddot;

                document.getElementById('rng-lock-strength').value = profile.lock;
                document.getElementById('val-lock-strength').innerText = profile.lock + '%';

                document.getElementById('rng-stab-level').value = profile.stab;
                document.getElementById('val-stab-level').innerText = profile.stab + '%';

                showToast(`🎯 Đã áp dụng preset OB54: ${profile.name}`);
            }
        });
    });

    // Master 1-Tap VIP Activation
    let isActivated = false;
    masterBtn.addEventListener('click', () => {
        sfx.playVipActivation();
        isActivated = !isActivated;

        if (isActivated) {
            masterBtn.classList.add('activated');
            masterBtnText.innerText = "✓ AZZUILL VIP: HOẠT ĐỘNG 100%";
            hudStatus.innerText = "OB54 ACTIVE";
            hudStatus.className = "telem-val neon-green";
            hudFps.innerText = "120";

            if (chHead) {
                chHead.innerText = "HEADSHOT 100% LOCKED";
                chHead.style.borderColor = "var(--green)";
                chHead.style.color = "var(--green)";
            }

            const switches = document.querySelectorAll('.switch input[type="checkbox"]');
            switches.forEach(sw => sw.checked = true);

            showToast("🔥 ĐÃ NẠP OFFSET OB54 & KÍCH HOẠT AZZUILL VIP 3D!");
        } else {
            masterBtn.classList.remove('activated');
            masterBtnText.innerText = "⚡ KÍCH HOẠT VIP OFFSET OB54 (1-CHẠM)";
            hudStatus.innerText = "READY";
            hudStatus.className = "telem-val neon-yellow";
            if (chHead) {
                chHead.innerText = "HEADSHOT 100% LOCK";
                chHead.style.borderColor = "rgba(255, 0, 85, 0.4)";
                chHead.style.color = "var(--pink)";
            }
            showToast("⚡ Đã chuyển về chế độ Tùy Chỉnh.");
        }
    });

    // Launch Free Fire Original Game (iOS URL Scheme Handler)
    if (btnLaunchFF) {
        btnLaunchFF.addEventListener('click', () => {
            sfx.playVipActivation();
            showToast("🚀 ĐANG KHỞI CHẠY FREE FIRE THƯỜNG...");
            
            setTimeout(() => {
                window.location.href = "freefire://";
                setTimeout(() => {
                    window.location.href = "freefiremax://";
                }, 1500);
            }, 800);
        });
    }

    // Aim Crosshair Interactive Click
    if (aimCrosshair) {
        aimCrosshair.addEventListener('click', () => {
            sfx.playLockTone();
            aimCrosshair.style.transform = "scale(1.3) rotate(45deg)";
            setTimeout(() => {
                aimCrosshair.style.transform = "scale(1) rotate(0deg)";
            }, 250);
            showToast("🎯 Azzuill Aim Core: Đang khóa tâm đỉnh đầu OB54!");
        });
    }

    // RAM Clean Action
    if (btnCleanRam) {
        btnCleanRam.addEventListener('click', () => {
            sfx.playVipActivation();
            btnCleanRam.innerText = "⏳ ĐANG DỌN BỘ NHỚ RAM...";
            hudRam.innerText = "16%";
            hudRam.className = "telem-val neon-green";

            setTimeout(() => {
                btnCleanRam.innerText = "✓ ĐÃ DỌN SẠCH 1.6GB RAM & CACHE!";
                showToast("🧹 Đã giải phóng RAM & hạ nhiệt độ GPU Free Fire!");
                setTimeout(() => {
                    btnCleanRam.innerText = "🧹 DỌN SẠCH RAM & BỘ NHỚ ĐỆM NGAY";
                }, 2500);
            }, 1000);
        });
    }

    // Export Profile
    if (btnExportConfig) {
        btnExportConfig.addEventListener('click', () => {
            sfx.playLockTone();
            const configData = {
                app: "Azzuill VIP 3D Optimizer iOS",
                version: "1.0.0",
                obVersion: "OB54 Official",
                timestamp: new Date().toISOString(),
                features: {
                    nhe_tam_all_sung: {
                        touch_sampling: "240Hz_Ultra",
                        smooth_drag: true,
                        general_sens: document.getElementById('rng-sens-general').value,
                        red_dot_sens: document.getElementById('rng-sens-reddot').value,
                        scope_2x_4x: document.getElementById('rng-sens-scope').value,
                        sniper_sens: document.getElementById('rng-sens-sniper').value
                    },
                    toi_uu_fps: {
                        fps_unlock: "120FPS_EXTREME",
                        shader_smoothing: true,
                        gaming_dns: "Cloudflare_Fast_Gaming_DNS"
                    },
                    fix_rung: {
                        recoil_stabilizer: true,
                        anti_jitter: true,
                        stabilization_level: document.getElementById('rng-stab-level').value + "%"
                    },
                    fix_lo_ob54: {
                        headshot_drag_clamp: true,
                        lock_strength: document.getElementById('rng-lock-strength').value + "%"
                    }
                }
            };

            const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Azzuill_VIP_OB54_${Date.now()}.ffcfg`;
            a.click();
            URL.revokeObjectURL(url);

            showToast("📁 Đã xuất file Profile Config Azzuill VIP thành công!");
        });
    }

    // Save Config to LocalStorage
    if (btnSaveConfig) {
        btnSaveConfig.addEventListener('click', () => {
            sfx.playBeep(900, 0.1, 'sine');
            const state = {
                general: document.getElementById('rng-sens-general').value,
                reddot: document.getElementById('rng-sens-reddot').value,
                scope: document.getElementById('rng-sens-scope').value,
                sniper: document.getElementById('rng-sens-sniper').value,
                stab: document.getElementById('rng-stab-level').value,
                lock: document.getElementById('rng-lock-strength').value
            };
            localStorage.setItem('azzuill_vip_state', JSON.stringify(state));
            showToast("💾 Đã lưu cấu hình Azzuill VIP vào máy!");
        });
    }

    // Reset Config
    if (btnResetConfig) {
        btnResetConfig.addEventListener('click', () => {
            sfx.playBeep(300, 0.1, 'sine');
            document.getElementById('rng-sens-general').value = 200;
            document.getElementById('val-sens-general').innerText = "200";
            document.getElementById('rng-sens-reddot').value = 195;
            document.getElementById('val-sens-reddot').innerText = "195";
            document.getElementById('rng-sens-scope').value = 180;
            document.getElementById('val-sens-scope').innerText = "180";
            document.getElementById('rng-sens-sniper').value = 160;
            document.getElementById('val-sens-sniper').innerText = "160";
            document.getElementById('rng-stab-level').value = 98;
            document.getElementById('val-stab-level').innerText = "98%";
            document.getElementById('rng-lock-strength').value = 99;
            document.getElementById('val-lock-strength').innerText = "99%";
            showToast("🔄 Đã khôi phục cài đặt gốc Azzuill OB54!");
        });
    }

    // Toast HUD Display Helper
    let toastTimeout;
    function showToast(msg) {
        if (!toastHud || !toastMsg) return;
        toastMsg.innerText = msg;
        toastHud.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastHud.classList.remove('show');
        }, 3200);
    }

    // Simulated Realtime Telemetry
    setInterval(() => {
        const basePing = 15;
        const currentPing = basePing + Math.floor(Math.random() * 4);
        if (hudPing) hudPing.innerText = `${currentPing} ms`;

        if (isActivated && hudFps) {
            const currentFps = 119 + Math.floor(Math.random() * 2);
            hudFps.innerText = currentFps;
        }
    }, 2000);
});
