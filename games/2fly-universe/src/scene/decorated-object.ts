import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const textureCache: Record<string, THREE.Texture> = {};

function configureTexture(tex: THREE.Texture, path: string): THREE.Texture {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.anisotropy = 8;
    tex.premultiplyAlpha = path.endsWith('.svg');
    tex.needsUpdate = true;
    return tex;
}

export function getTexture(path: string): THREE.Texture {
    if (!textureCache[path]) {
        const tex = textureLoader.load(path, loaded => configureTexture(loaded, path));
        configureTexture(tex, path);
        textureCache[path] = tex;
    }
    return textureCache[path];
}

// Painterly / organic worlds remain raster because their surface detail benefits
// from photographic texture. Graphic/symbolic worlds use 2048px SVG masters.
export function getPlanetTexturePath(objectId: string): string {
    switch (objectId) {
        case 'OBJ-FIRE':
            return 'assets/object_styles/music_planet.png';
        case 'OBJ-AFRICA':
            return 'assets/object_styles/life_planet.png';
        case 'OBJ-STREAMS':
            return 'assets/object_styles/experimental_planet.png';
        case 'OBJ-EBONY':
            return 'assets/object_styles/controller_planet.svg';
        case 'OBJ-AVIATOR':
            return 'assets/object_styles/story_planet.png';
        case 'OBJ-AWAY':
            return 'assets/object_styles/legacy_planet.png';
        case 'OBJ-FLYZONE':
        case 'OBJ-TIGER':
            return 'assets/object_styles/space_station.svg';
        default:
            return 'assets/object_styles/culture_planet.png';
    }
}

export function getChildTexturePath(child: { mediaKind?: string; title?: string; id?: string }): string {
    const mk = child.mediaKind ?? 'archive';
    const title = (child.title ?? '').toLowerCase();

    if (mk === 'playable') return 'assets/object_styles/controller_planet.svg';
    if (mk === 'audio') {
        if (title.includes('lyrics')) return 'assets/object_styles/lyrics_moon.svg';
        if (title.includes('stem') || title.includes('instrumental')) return 'assets/object_styles/stem_moon.svg';
        return 'assets/object_styles/song_moon.svg';
    }
    if (mk === 'video') return 'assets/object_styles/video_moon.svg';

    if (title.includes('photo') || title.includes('gallery') || title.includes('image')) return 'assets/object_styles/photo_moon.svg';
    if (title.includes('behind') || title.includes('dossier') || title.includes('making')) return 'assets/object_styles/behind_moon.svg';
    if (title.includes('art') || title.includes('cover')) return 'assets/object_styles/artwork_moon.svg';
    if (title.includes('asset') || title.includes('source')) return 'assets/object_styles/game_asset_moon.svg';

    if (title.includes('spotify') || title.includes('apple') || title.includes('music') || title.includes('stream')) return 'assets/object_styles/streaming_sat.svg';
    if (title.includes('youtube') || title.includes('video') || title.includes('visual')) return 'assets/object_styles/youtube_sat.svg';
    if (title.includes('merch') || title.includes('store') || title.includes('shop')) return 'assets/object_styles/merch_sat.svg';
    if (title.includes('social') || title.includes('instagram') || title.includes('twitter') || title.includes('tiktok')) return 'assets/object_styles/social_sat.svg';
    if (title.includes('book') || title.includes('show') || title.includes('tour')) return 'assets/object_styles/booking_sat.svg';
    if (title.includes('collab') || title.includes('feat') || title.includes('feature')) return 'assets/object_styles/collab_sat.svg';
    if (title.includes('press') || title.includes('article') || title.includes('interview')) return 'assets/object_styles/press_sat.svg';
    return 'assets/object_styles/behind_moon.svg';
}

export function createDecoratedPlanet(objectId: string, size: number, accentColorHex: number): { group: THREE.Group; clickTarget: THREE.Mesh } {
    const group = new THREE.Group();
    const texture = getTexture(getPlanetTexturePath(objectId));

    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, alphaTest: 0.015 });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(size * 2.2, size * 2.2, 1);
    group.add(sprite);

    const glowMat = new THREE.SpriteMaterial({
        map: texture,
        color: new THREE.Color(accentColorHex),
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(size * 2.62, size * 2.62, 1);
    group.add(glow);

    const ringGeo = new THREE.RingGeometry(size * 1.1, size * 1.25, 96);
    const ringMat = new THREE.MeshBasicMaterial({ color: accentColorHex, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2 + 0.15;
    ring.rotation.y = 0.1;
    group.add(ring);

    const colliderGeo = new THREE.SphereGeometry(size * 1.2, 16, 16);
    const colliderMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false });
    const clickTarget = new THREE.Mesh(colliderGeo, colliderMat);
    group.add(clickTarget);
    return { group, clickTarget };
}

export function createDecoratedChild(childData: { id: string; mediaKind?: string; title?: string }, size: number, accentColorHex: number): { group: THREE.Group; clickTarget: THREE.Mesh } {
    const group = new THREE.Group();
    const texture = getTexture(getChildTexturePath(childData));

    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, alphaTest: 0.015 });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(size * 2.3, size * 2.3, 1);
    group.add(sprite);

    const ringGeo = new THREE.RingGeometry(size * 1.15, size * 1.35, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: accentColorHex, transparent: true, opacity: 0.30, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    group.add(ring);

    const glowMat = new THREE.SpriteMaterial({ map: texture, color: new THREE.Color(accentColorHex), transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending, depthWrite: false });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(size * 2.72, size * 2.72, 1);
    group.add(glow);

    const colliderGeo = new THREE.SphereGeometry(size * 1.45, 12, 12);
    const colliderMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false });
    const clickTarget = new THREE.Mesh(colliderGeo, colliderMat);
    group.add(clickTarget);
    return { group, clickTarget };
}
