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
    // Archive or other
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
    // Satellite check by title/kind
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
export function createDecoratedPlanet(objectId, size, accentColorHex) {
    const group = new THREE.Group();
    const texturePath = getPlanetTexturePath(objectId);
    const texture = getTexture(texturePath);
    // 1. Central Designed Sprite
    const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(size * 2.2, size * 2.2, 1);
    group.add(sprite);
    // 2. Glowing aura behind the planet
    const glowMat = new THREE.SpriteMaterial({
        map: texture,
        color: new THREE.Color(accentColorHex),
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(size * 2.8, size * 2.8, 1);
    group.add(glow);
    // 3. Orbiting rings / accents
    const ringGeo = new THREE.RingGeometry(size * 1.1, size * 1.25, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: accentColorHex,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    // Give it a slight tilt so it is asymmetrical but organized
    ring.rotation.x = -Math.PI / 2 + 0.15;
    ring.rotation.y = 0.1;
    group.add(ring);
    // 4. Invisible collider mesh for reliable Raycast selection
    // Make the collider slightly larger than the visual sprite so clicking is easy from normal distances
    const colliderGeo = new THREE.SphereGeometry(size * 1.2, 16, 16);
    const colliderMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
    });
    const clickTarget = new THREE.Mesh(colliderGeo, colliderMat);
    group.add(clickTarget);
    return { group, clickTarget };
}
export function createDecoratedChild(childData, size, accentColorHex) {
    const group = new THREE.Group();
    const texturePath = getChildTexturePath(childData);
    const texture = getTexture(texturePath);
    // 1. Central sprite for moon/satellite
    const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(size * 2.3, size * 2.3, 1);
    group.add(sprite);
    // 2. Glow ring around the moon
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
    // 3. Subtle glow behind
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
    // 4. Invisible collider mesh
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
