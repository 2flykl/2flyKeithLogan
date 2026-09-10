import * as THREE from 'three';
const textureLoader = new THREE.TextureLoader();
const textureCache = {};
export function getTexture(path) {
    if (!textureCache[path]) {
        const tex = textureLoader.load(path);
        tex.colorSpace = THREE.SRGBColorSpace;
        textureCache[path] = tex;
    }
    return textureCache[path];
}
export function getPlanetTexturePath(objectId) {
    switch (objectId) {
        case 'OBJ-FIRE':
            return 'assets/object_styles/music_planet.png';
        case 'OBJ-AFRICA':
            return 'assets/object_styles/life_planet.png';
        case 'OBJ-STREAMS':
            return 'assets/object_styles/experimental_planet.png';
        case 'OBJ-EBONY':
            return 'assets/object_styles/controller_planet.png';
        case 'OBJ-AVIATOR':
            return 'assets/object_styles/story_planet.png';
        case 'OBJ-AWAY':
            return 'assets/object_styles/legacy_planet.png';
        case 'OBJ-FLYZONE':
        case 'OBJ-TIGER':
            return 'assets/object_styles/space_station.png';
        default:
            return 'assets/object_styles/culture_planet.png';
    }
}
export function getChildTexturePath(child) {
    const mk = child.mediaKind ?? 'archive';
    const title = (child.title ?? '').toLowerCase();
    if (mk === 'playable') {
        return 'assets/object_styles/controller_planet.png';
    }
    if (mk === 'audio') {
        if (title.includes('lyrics'))
            return 'assets/object_styles/lyrics_moon.png';
        if (title.includes('stem') || title.includes('instrumental'))
            return 'assets/object_styles/stem_moon.png';
        return 'assets/object_styles/song_moon.png';
    }
    if (mk === 'video') {
        return 'assets/object_styles/video_moon.png';
    }
    if (title.includes('photo') || title.includes('gallery') || title.includes('image')) {
        return 'assets/object_styles/photo_moon.png';
    }
    if (title.includes('behind') || title.includes('dossier') || title.includes('making')) {
        return 'assets/object_styles/behind_moon.png';
    }
    if (title.includes('art') || title.includes('cover')) {
        return 'assets/object_styles/artwork_moon.png';
    }
    if (title.includes('asset') || title.includes('source')) {
        return 'assets/object_styles/game_asset_moon.png';
    }
    if (title.includes('spotify') || title.includes('apple') || title.includes('music') || title.includes('stream')) {
        return 'assets/object_styles/streaming_sat.png';
    }
    if (title.includes('youtube') || title.includes('video') || title.includes('visual')) {
        return 'assets/object_styles/youtube_sat.png';
    }
    if (title.includes('merch') || title.includes('store') || title.includes('shop')) {
        return 'assets/object_styles/merch_sat.png';
    }
    if (title.includes('social') || title.includes('instagram') || title.includes('twitter') || title.includes('tiktok')) {
        return 'assets/object_styles/social_sat.png';
    }
    if (title.includes('book') || title.includes('show') || title.includes('tour')) {
        return 'assets/object_styles/booking_sat.png';
    }
    if (title.includes('collab') || title.includes('feat') || title.includes('feature')) {
        return 'assets/object_styles/collab_sat.png';
    }
    if (title.includes('press') || title.includes('article') || title.includes('interview')) {
        return 'assets/object_styles/press_sat.png';
    }
    return 'assets/object_styles/behind_moon.png';
}
const proceduralPlanetTextures = new Map();

function seededNoise(x, y, seed = 1) {
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
    return n - Math.floor(n);
}
function objectSeed(objectId) {
    let h = 0;
    for (let i = 0; i < objectId.length; i++) h = ((h << 5) - h + objectId.charCodeAt(i)) | 0;
    return Math.abs(h) + 1;
}
function createProceduralPlanetTexture(objectId, accentColorHex) {
    if (proceduralPlanetTextures.has(objectId)) return proceduralPlanetTextures.get(objectId);
    const w = 512, h = 256, seed = objectSeed(objectId);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const c = canvas.getContext('2d');
    const img = c.createImageData(w, h);
    const accent = new THREE.Color(accentColorHex);
    const base = objectId === 'OBJ-EBONY' ? new THREE.Color(0x090711)
        : objectId === 'OBJ-AVIATOR' ? new THREE.Color(0x10253a)
        : objectId === 'OBJ-AWAY' ? new THREE.Color(0x27363b)
        : objectId === 'OBJ-FLYZONE' ? new THREE.Color(0x062927)
        : new THREE.Color(0x15202b);
    const secondary = objectId === 'OBJ-EBONY' ? new THREE.Color(0x3a183f)
        : objectId === 'OBJ-AVIATOR' ? new THREE.Color(0x587a91)
        : objectId === 'OBJ-AWAY' ? new THREE.Color(0x6c7267)
        : objectId === 'OBJ-FLYZONE' ? new THREE.Color(0x0d6f63)
        : accent.clone();

    for (let y = 0; y < h; y++) {
        const v = y / h;
        for (let x = 0; x < w; x++) {
            const u = x / w;
            const n1 = seededNoise(Math.floor(x / 5), Math.floor(y / 5), seed);
            const n2 = seededNoise(Math.floor(x / 17), Math.floor(y / 13), seed + 13);
            const bands = 0.5 + 0.5 * Math.sin(v * Math.PI * (objectId === 'OBJ-AVIATOR' ? 18 : 10) + n2 * 3.5);
            let t = Math.min(1, Math.max(0, n1 * 0.52 + n2 * 0.32 + bands * 0.18));
            if (objectId === 'OBJ-EBONY') t *= 0.72;
            const col = base.clone().lerp(secondary, t).lerp(accent, Math.max(0, n2 - 0.68) * 0.45);
            const i = (y * w + x) * 4;
            img.data[i] = Math.round(col.r * 255);
            img.data[i + 1] = Math.round(col.g * 255);
            img.data[i + 2] = Math.round(col.b * 255);
            img.data[i + 3] = 255;
        }
    }
    c.putImageData(img, 0, 0);

    c.save();
    c.globalCompositeOperation = 'screen';
    if (objectId === 'OBJ-EBONY') {
        c.strokeStyle = 'rgba(183,111,220,.26)';
        c.lineWidth = 2;
        for (let i = 0; i < 22; i++) {
            c.beginPath();
            let yy = 12 + i * 11;
            c.moveTo(0, yy);
            for (let x = 0; x <= w; x += 20) c.lineTo(x, yy + Math.sin(x * 0.035 + i * 0.8) * 6);
            c.stroke();
        }
        c.fillStyle = 'rgba(240,216,255,.12)';
        for (let i = 0; i < 36; i++) {
            const x = seededNoise(i, 2, seed) * w, y = seededNoise(i, 3, seed) * h;
            const r = 3 + seededNoise(i, 4, seed) * 16;
            c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
        }
    } else if (objectId === 'OBJ-AVIATOR') {
        c.strokeStyle = 'rgba(205,236,255,.28)';
        c.lineWidth = 2;
        for (let i = 0; i < 30; i++) {
            c.beginPath();
            const yy = 6 + i * 8.6;
            c.moveTo(0, yy);
            for (let x = 0; x <= w; x += 14) c.lineTo(x, yy + Math.sin(x * 0.055 + i) * 4);
            c.stroke();
        }
        c.fillStyle = 'rgba(244,251,255,.10)';
        for (let i = 0; i < 28; i++) {
            c.beginPath();
            c.ellipse(seededNoise(i, 6, seed) * w, seededNoise(i, 7, seed) * h, 15 + seededNoise(i, 8, seed) * 30, 4 + seededNoise(i, 9, seed) * 10, 0, 0, Math.PI * 2);
            c.fill();
        }
    } else if (objectId === 'OBJ-AWAY') {
        c.fillStyle = 'rgba(164,184,174,.18)';
        for (let i = 0; i < 80; i++) {
            c.beginPath();
            c.arc(seededNoise(i, 10, seed) * w, seededNoise(i, 11, seed) * h, 3 + seededNoise(i, 12, seed) * 12, 0, Math.PI * 2);
            c.fill();
        }
        c.strokeStyle = 'rgba(220,238,230,.16)'; c.lineWidth = 1.4;
        for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(0, i * 22 + 8); c.bezierCurveTo(w*.28, i*22-10, w*.7, i*22+22, w, i*22+4); c.stroke(); }
    } else if (objectId === 'OBJ-FLYZONE') {
        c.strokeStyle = 'rgba(81,247,218,.28)'; c.lineWidth = 1.5;
        for (let i = 0; i < 16; i++) {
            const yy = 8 + i * 16;
            c.beginPath(); c.moveTo(0, yy); c.lineTo(w, yy + Math.sin(i) * 5); c.stroke();
        }
        c.strokeStyle = 'rgba(225,255,248,.14)';
        for (let x = 0; x < w; x += 34) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 20, h); c.stroke(); }
    }
    c.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    proceduralPlanetTextures.set(objectId, tex);
    return tex;
}

export function createDecoratedPlanet(objectId, size, accentColorHex) {
    const group = new THREE.Group();
    const radius = size * 1.05;
    const texture = createProceduralPlanetTexture(objectId, accentColorHex);
    const accent = new THREE.Color(accentColorHex);

    const geometry = new THREE.SphereGeometry(radius, 64, 48);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: objectId === 'OBJ-EBONY' ? 0.34 : objectId === 'OBJ-FLYZONE' ? 0.48 : 0.62,
        metalness: objectId === 'OBJ-EBONY' ? 0.48 : objectId === 'OBJ-FLYZONE' ? 0.38 : 0.18,
        emissive: accent.clone().multiplyScalar(objectId === 'OBJ-EBONY' ? 0.11 : 0.07),
        emissiveIntensity: objectId === 'OBJ-EBONY' ? 0.65 : 0.42,
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.rotation.z = objectId === 'OBJ-AVIATOR' ? 0.16 : objectId === 'OBJ-EBONY' ? -0.12 : 0.08;
    group.add(planet);

    const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.055, 48, 36),
        new THREE.MeshBasicMaterial({
            color: accent,
            transparent: true,
            opacity: objectId === 'OBJ-EBONY' ? 0.065 : 0.09,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
    );
    group.add(atmosphere);

    const ringGeo = new THREE.RingGeometry(size * 1.10, size * 1.24, 96);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe9f8ff,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2 + 0.15;
    ring.rotation.y = 0.1;
    group.add(ring);

    const rimLight = new THREE.PointLight(accent, 0.55, size * 7.5, 2);
    rimLight.position.set(-radius * 1.7, radius * 0.9, radius * 1.3);
    group.add(rimLight);

    const colliderGeo = new THREE.SphereGeometry(size * 1.2, 16, 16);
    const colliderMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false });
    const clickTarget = new THREE.Mesh(colliderGeo, colliderMat);
    group.add(clickTarget);
    return { group, clickTarget };
}
export function createDecoratedChild(childData, size, accentColorHex) {
    const group = new THREE.Group();
    const texturePath = getChildTexturePath(childData);
    const texture = getTexture(texturePath);
    const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(size * 2.3, size * 2.3, 1);
    group.add(sprite);
    const ringGeo = new THREE.RingGeometry(size * 1.15, size * 1.35, 32);
    const ringMat = new THREE.MeshBasicMaterial({
        color: accentColorHex,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    group.add(ring);
    const glowMat = new THREE.SpriteMaterial({
        map: texture,
        color: new THREE.Color(accentColorHex),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(size * 2.9, size * 2.9, 1);
    group.add(glow);
    const colliderGeo = new THREE.SphereGeometry(size * 1.45, 12, 12);
    const colliderMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
    });
    const clickTarget = new THREE.Mesh(colliderGeo, colliderMat);
    group.add(clickTarget);
    return { group, clickTarget };
}
