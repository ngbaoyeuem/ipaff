/**
 * AZZUILL VIP 3D - FREE FIRE OB54 REAL MEMORY OFFSETS MATRIX
 * Architecture: iOS arm64 / Unity Framework / OB54 Native Memory Engine
 */

window.FF_OB54_MEMORY_OFFSETS = {
    app: "Azzuill VIP 3D",
    obVersion: "OB54 Official (Free Fire & FF MAX Dual Support)",
    timestamp: new Date().toISOString(),
    architecture: "Arm64 iOS Native",

    // 1. OB54 ULTRA HEADSHOT BINDING OFFSETS (BÁM ĐẦU 100% ĐỎ)
    HeadshotMagnet: {
        StaticAimController: "0x78F4A10",      // GWorld Aim Base Pointer OB54
        LocalPlayerAimBone: "0x2A8",           // Offset Xương Đầu (Bone ID 14 - Head Center)
        HeadHitboxRadiusMultiplier: "0x438",   // Tăng diện tích hút đạn vùng đầu (+300%)
        TargetMagnetPullStrength: "0x43C",     // Lực hút tâm dính chặt vào đầu địch
        AimAngleSnapLimit: "0x440",            // Khóa góc vuốt không trượt ra ngoài
        HeadshotRatioForce: "0x444"            // Tỷ lệ ép đạn One-Shot 1.0 (100% Đỏ)
    },

    // 2. OB54 ULTRA TOUCH & SMOOTH DRAG (NHẸ TÂM SIÊU MƯỢT)
    TouchEngineOB54: {
        ScreenSamplingHz: "0x330",             // Ép xung tốc độ nhận cảm ứng 240Hz
        DragVelocityMultiplier: "0x334",       // Trợ lực vuốt tâm siêu nhẹ (2.8x Drag Boost)
        FingerResistanceDampener: "0x338",     // Khử ma sát rít ngón tay khi vuốt màn hình
        TouchResponseLatency: "0x33C"          // Giảm độ trễ cảm ứng xuống 0.001ms
    },

    // 3. OB54 RECOIL & RECOIL SPREAD (KHỬ RUNG & TRIỆT TẢN ĐẠN)
    RecoilEngineOB54: {
        RecoilVertical: "0x3D0",               // Triệt tiêu nẩy nòng dọc (0.00)
        RecoilHorizontal: "0x3D4",             // Triệt tiêu nẩy nòng ngang (0.00)
        CameraRecoilShake: "0x3D8",            // Khử hoàn toàn rung màn hình khi bắn sấy
        BulletSpreadMin: "0x3E0",              // Gom chụm đường đạn bay thẳng tắp
        BulletSpreadMax: "0x3E4"               // Triệt tiêu độ tản đạn MP40/AK/SCAR
    },

    // 4. OB54 ANTI-OVERSHOOT (FIX KHÓA CHẶN LỐ TÂM VỌT ĐẦU)
    AntiOvershootOB54: {
        OverAimDeceleration: "0x480",          // Hãm gia tốc ngón tay khi tâm tới đầu
        HeadLockClampY: "0x484",               // Khóa chặn Y-Max không vọt tâm lên trời
        HeadHitboxStickyFactor: "0x488"        // Độ dính tâm tại hộp sọ mục tiêu
    },

    // 5. OB54 NHẸ TÂM BÁM ĐẦU CHUYÊN BỆNH MỌI DÒNG SÚNG
    ob54WeaponProfiles: {
        Shotgun: {
            dragBoost: 2.85,
            headMagnet: 1.00,
            recoilShake: 0.00,
            desc: "Shotgun M1887/M1014: Vuốt nhẹ ăn 100% đỏ đỉnh đầu"
        },
        Pistols: {
            dragBoost: 2.75,
            headMagnet: 1.00,
            recoilShake: 0.00,
            desc: "Lục Deagle/Woodpecker: Nhấp nhẹ gõ khóa cứng đầu"
        },
        SMG: {
            dragBoost: 2.60,
            headMagnet: 0.98,
            recoilShake: 0.00,
            desc: "SMG MP40/UMP: Kéo mượt sấy đường thẳng dính đỏ"
        },
        AR: {
            dragBoost: 2.45,
            headMagnet: 0.95,
            recoilShake: 0.00,
            desc: "AR AK47/SCAR/M4A1: Khử tản đạn, ghìm tâm bám đầu"
        },
        Sniper: {
            dragBoost: 2.30,
            headMagnet: 1.00,
            recoilShake: 0.00,
            desc: "Sniper AWM/Barrett: Ngắm bắn khóa tâm tốc độ"
        }
    }
};

console.log("⚡ [AZZUILL VIP OB54 REAL MEMORY HEADSHOT & TOUCH MATRIX LOADED]");
