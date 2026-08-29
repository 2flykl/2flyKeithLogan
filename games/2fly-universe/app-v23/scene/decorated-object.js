import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const textureCache = {};

function configureTexture(tex, path) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.anisotropy = 8;
    tex.premultiplyAlpha = path.endsWith('.svg');
    tex.needsUpdate = true;
    return tex;
}

export function getTexture(path) {
    if (!textureCache[path]) {
        const tex = textureLoader.load(path, loaded => configureTexture(loaded, path));
        configureTexture(tex, path);
        textureCache[path] = tex;
    }
    return textureCache[path];
}

const PROJECT_CORE = {
    'OBJ-AWAY': 'assets/project_orbits/away_core.svg',
    'OBJ-STREAMS': 'assets/project_orbits/streams_core.svg',
    'OBJ-FIRE': 'assets/project_orbits/fire_core.svg',
    'OBJ-AFRICA': 'assets/project_orbits/africa_core.svg',
};

function projectFromChildId(id = '') {
    if (id.startsWith('AWAY-')) return 'away';
    if (id.startsWith('STREAMS-')) return 'streams';
    if (id.startsWith('FIRE-')) return 'fire';
    if (id.startsWith('AFRICA-')) return 'africa';
    return null;
}

export function getPlanetTexturePath(objectId) {
    if (PROJECT_CORE[objectId]) return PROJECT_CORE[objectId];
    switch (objectId) {
        case 'OBJ-EBONY': return 'assets/object_styles/controller_planet.svg';
        case 'OBJ-AVIATOR': return 'assets/object_styles/space_station.svg';
        case 'OBJ-FLYZONE':
        case 'OBJ-TIGER': return 'assets/object_styles/space_station.svg';
        default: return 'assets/object_styles/space_station.svg';
    }
}

export function getChildTexturePath(child) {
    const mk = child.mediaKind ?? 'archive';
    const title = (child.title ?? '').toLowerCase();
    const project = projectFromChildId(child.id ?? '');
    if (project) {
        const media = mk === 'audio' || mk === 'video' || mk === 'playable' || mk === 'archive' ? mk : 'archive';
        return `assets/project_orbits/${project}_${media}.svg`;
    }

    if (mk === 'playable') return 'assets/object_styles/controller_planet.svg';
    if (mk === 'audio') {
        if (title.includes('lyrics')) return 'assets/object_styles/lyrics_moon.svg';
        if (title.includes('stem') || title.includes('instrumental')) return 'assets/object_styles/stem_moon.svg';
        return 'assets/object_styles/song_moon.svg';
    }
    if (mk === 'video') return 'assets/object_styles/video_moon.svg';
    if (title.includes('photo') || title.includes('gallery') || title.includes('image')) return 'assets/object_styles/photo_moon.svg';
    if (title.includes('art') || title.includes('cover')) return 'assets/object_styles/artwork_moon.svg';
    if (title.includes('asset') || title.includes('source')) return 'assets/object_styles/game_asset_moon.svg';
    if (title.includes('spotify') || title.includes('apple') || title.includes('music') || title.includes('stream')) return 'assets/object_styles/streaming_sat.svg';
    if (title.includes('youtube') || title.includes('visual')) return 'assets/object_styles/youtube_sat.svg';
    if (title.includes('merch') || title.includes('store') || title.includes('shop')) return 'assets/object_styles/merch_sat.svg';
    if (title.includes('social') || title.includes('instagram') || title.includes('twitter') || title.includes('tiktok')) return 'assets/object_styles/social_sat.svg';
    if (title.includes('book') || title.includes('show') || title.includes('tour')) return 'assets/object_styles/booking_sat.svg';
    if (title.includes('collab') || title.includes('feat') || title.includes('feature')) return 'assets/object_styles/collab_sat.svg';
    if (title.includes('press') || title.includes('article') || title.includes('interview')) return 'assets/object_styles/press_sat.svg';
    return 'assets/object_styles/behind_moon.svg';
}

export function createDecoratedPlanet(objectId, size, accentColorHex) {
    const group = new THREE.Group();
    const texture = getTexture(getPlanetTexturePath(objectId));
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, alphaTest: 0.01 });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(size * 2.18, size * 2.18, 1);
    group.add(sprite);

    const glowMat = new THREE.SpriteMaterial({ map: texture, color: new THREE.Color(accentColorHex), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(size * 2.54, size * 2.54, 1);
    group.add(glow);

    const whiteRing = new THREE.Mesh(new THREE.RingGeometry(size * 1.12, size * 1.14, 96), new THREE.MeshBasicMaterial({ color: 0xf2f7ff, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }));
    whiteRing.rotation.x = -Math.PI / 2 + 0.05;
    group.add(whiteRing);

    const accentRing = new THREE.Mesh(new THREE.RingGeometry(size * 1.30, size * 1.34, 96), new THREE.MeshBasicMaterial({ color: accentColorHex, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    accentRing.rotation.x = -Math.PI / 2 + 0.10;
    accentRing.rotation.z = 0.18;
    group.add(accentRing);

    const colliderGeo = new THREE.SphereGeometry(size * 1.25, 16, 16);
    const colliderMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    const clickTarget = new THREE.Mesh(colliderGeo, colliderMat);
    group.add(clickTarget);
    return { group, clickTarget };
}

export function createDecoratedChild(childData, size, accentColorHex) {
    const group = new THREE.Group();
    const texture = getTexture(getChildTexturePath(childData));
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, alphaTest: 0.01 });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(size * 2.15, size * 2.15, 1);
    group.add(sprite);

    const ringGeo = new THREE.RingGeometry(size * 1.10, size * 1.13, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf3f8ff, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.12;
    group.add(ring);

    const accentRingGeo = new THREE.RingGeometry(size * 1.30, size * 1.34, 64);
    const accentRingMat = new THREE.MeshBasicMaterial({ color: accentColorHex, transparent: true, opacity: 0.10, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    const accentRing = new THREE.Mesh(accentRingGeo, accentRingMat);
    accentRing.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.16;
    accentRing.rotation.z = Math.random() * Math.PI;
    group.add(accentRing);

    const glowMat = new THREE.SpriteMaterial({ map: texture, color: new THREE.Color(accentColorHex), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(size * 2.46, size * 2.46, 1);
    group.add(glow);

    const colliderGeo = new THREE.SphereGeometry(size * 1.46, 12, 12);
    const colliderMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    const clickTarget = new THREE.Mesh(colliderGeo, colliderMat);
    group.add(clickTarget);
    return { group, clickTarget };
}
