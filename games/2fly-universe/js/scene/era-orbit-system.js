import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
const ERA_SHELLS = {
    G2000: [
        { title: 'BRASS ARCHIVE WORLD', subtitle: 'Foundation-era memory planet', texture: 'assets/era/planet_foundation_brass.jpg', radius: 620, orbit: 2350, speed: .08, kind: 'planet' },
        { title: 'ANALOG MOON', subtitle: 'Tape, paper, flyers and early signals', texture: 'assets/era/planet_foundation_archive.jpg', radius: 300, orbit: 3750, speed: -.11, kind: 'moon' },
        { title: 'ORIGIN RELIC', subtitle: 'A sculptural marker for the first chapter', radius: 210, orbit: 5000, speed: .05, kind: 'artifact' },
        { title: 'FIRST PRESS DISC', subtitle: 'Music-memory orbital disc', radius: 250, orbit: 6200, speed: -.045, kind: 'disc' },
    ],
    G2005: [
        { title: 'CRIMSON MOMENTUM WORLD', subtitle: 'The era begins to accelerate', texture: 'assets/era/planet_momentum_crimson.jpg', radius: 690, orbit: 2550, speed: .10, kind: 'planet' },
        { title: 'CHROME SIGNAL MOON', subtitle: 'Broadcast and performance echoes', texture: 'assets/era/planet_momentum_chrome.jpg', radius: 280, orbit: 4100, speed: -.13, kind: 'moon' },
        { title: 'BROADCAST RELIC', subtitle: 'A polished transmission artifact', radius: 190, orbit: 5450, speed: .07, kind: 'artifact' },
        { title: 'MOMENTUM DISC', subtitle: 'A rotating album-like archive object', radius: 275, orbit: 6600, speed: .052, kind: 'disc' },
    ],
    G2010: [
        { title: 'PRISM REINVENTION WORLD', subtitle: 'A world rebuilt through experimentation', texture: 'assets/era/planet_reinvention_violet.jpg', radius: 670, orbit: 2450, speed: .07, kind: 'planet' },
        { title: 'GLASS MOON', subtitle: 'Transparent archive of changing identities', texture: 'assets/era/planet_reinvention_glass.jpg', radius: 315, orbit: 3950, speed: -.09, kind: 'moon' },
        { title: 'CRYSTAL ARCHIVE', subtitle: 'A refractive object holding uncatalogued history', radius: 245, orbit: 5250, speed: .06, kind: 'crystal' },
        { title: 'REINVENTION DISC', subtitle: 'A playable-looking but non-live media relic', radius: 260, orbit: 6500, speed: -.04, kind: 'disc' },
    ],
    G2015: [
        { title: 'EMBER EXPANSION WORLD', subtitle: 'Creative scale expands outward', texture: 'assets/era/planet_expansion_ember.jpg', radius: 760, orbit: 2750, speed: .085, kind: 'planet' },
        { title: 'GOLDEN ORBIT MOON', subtitle: 'A luminous satellite of expansion', texture: 'assets/era/planet_expansion_gold.jpg', radius: 330, orbit: 4450, speed: -.10, kind: 'moon' },
        { title: 'SIGNAL RING STATION', subtitle: 'A ringed archive station', radius: 230, orbit: 5750, speed: .045, kind: 'artifact' },
        { title: 'EXPANSION DISC', subtitle: 'An album-object in permanent orbit', radius: 300, orbit: 7100, speed: .038, kind: 'disc' },
    ],
    G2020: [
        { title: 'TEAL AWAKENING WORLD', subtitle: 'Reflection becomes a destination', texture: 'assets/era/planet_awakening_teal.jpg', radius: 700, orbit: 2500, speed: .065, kind: 'planet' },
        { title: 'CLOUD REFLECTION MOON', subtitle: 'Atmospheric memory satellite', texture: 'assets/era/planet_awakening_cloud.jpg', radius: 350, orbit: 4250, speed: -.08, kind: 'moon' },
        { title: 'REFLECTION SATELLITE', subtitle: 'A quiet archive beacon', radius: 190, orbit: 5600, speed: .055, kind: 'artifact' },
        { title: 'AWAKENING DISC', subtitle: 'A visual record orbiting the era', radius: 285, orbit: 6900, speed: -.036, kind: 'disc' },
    ],
    G2030: [
        { title: 'UNCHARTED PROTO-WORLD', subtitle: 'A future placeholder with no live content', radius: 640, orbit: 2600, speed: .045, kind: 'crystal' },
        { title: 'FUTURE SIGNAL MOON', subtitle: 'Unwritten transmissions', radius: 300, orbit: 4200, speed: -.055, kind: 'moon' },
        { title: 'DARK ARCHIVE RELIC', subtitle: 'A sealed destination beyond the current era', radius: 220, orbit: 5600, speed: .035, kind: 'artifact' },
    ]
};
export class EraOrbitSystem {
    galaxyId;
    group = new THREE.Group();
    clickTargets = [];
    orbiters = [];
    loader = new THREE.TextureLoader();
    constructor(galaxyId) {
        this.galaxyId = galaxyId;
        const theme = GALAXY_THEMES[galaxyId], defs = ERA_SHELLS[galaxyId];
        if (!theme || !defs)
            return;
        this.group.position.set(...theme.worldOffset);
        defs.forEach((def, i) => {
            const pivot = new THREE.Group();
            pivot.rotation.x = (i - 1.4) * .18;
            pivot.rotation.z = i * .47 + .12;
            const geo = this.geometryFor(def);
            const mat = this.materialFor(def, theme);
            const body = new THREE.Mesh(geo, mat);
            body.position.x = def.orbit;
            body.userData = { eraShell: true, galaxyId, title: def.title, subtitle: def.subtitle };
            pivot.add(body);
            this.group.add(pivot);
            this.clickTargets.push(body);
            this.orbiters.push({ pivot, body, speed: def.speed, bob: i * .8 });
            this.addOrbitTrail(pivot, def, theme, i);
            this.decorate(body, def, theme, i);
        });
        const light = new THREE.PointLight(theme.accentColor, 1.8, 15000);
        this.group.add(light);
    }
    geometryFor(def) {
        if (def.kind === 'artifact')
            return new THREE.DodecahedronGeometry(def.radius, 1);
        if (def.kind === 'crystal')
            return new THREE.IcosahedronGeometry(def.radius, 2);
        if (def.kind === 'disc')
            return new THREE.CylinderGeometry(def.radius, def.radius, Math.max(42, def.radius * .16), 64);
        return new THREE.SphereGeometry(def.radius, 48, 32);
    }
    materialFor(def, theme) {
        if (def.texture) {
            const tex = this.loader.load(def.texture);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.wrapS = THREE.RepeatWrapping;
            return new THREE.MeshStandardMaterial({ map: tex, roughness: def.kind === 'moon' ? .72 : .42, metalness: def.kind === 'planet' ? .12 : .3, emissive: theme.nebulaColor, emissiveIntensity: .2 });
        }
        return new THREE.MeshStandardMaterial({ color: theme.accentColor, roughness: def.kind === 'crystal' ? .08 : .27, metalness: def.kind === 'disc' ? .86 : .66, emissive: theme.primaryColor, emissiveIntensity: .28, transparent: def.kind === 'crystal', opacity: def.kind === 'crystal' ? .82 : 1 });
    }
    addOrbitTrail(pivot, def, theme, i) {
        const curve = new THREE.EllipseCurve(0, 0, def.orbit, def.orbit * (.48 + i * .035), 0, Math.PI * 2, false, 0);
        const pts = curve.getPoints(180).map(v => new THREE.Vector3(v.x, 0, v.y));
        const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: theme.accentColor, transparent: true, opacity: .055 + i * .008, depthWrite: false }));
        line.rotation.x = Math.PI / 2;
        pivot.add(line);
    }
    decorate(body, def, theme, i) {
        if (def.kind === 'planet' || def.kind === 'moon') {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(def.radius * 1.38, 16 + i * 4, 10, 100), new THREE.MeshBasicMaterial({ color: theme.accentColor, transparent: true, opacity: .15, depthWrite: false, blending: THREE.AdditiveBlending }));
            ring.rotation.x = Math.PI / (2.2 + i * .08);
            body.add(ring);
        }
        if (def.kind === 'disc') {
            body.rotation.z = Math.PI / 2;
            const label = new THREE.Mesh(new THREE.CylinderGeometry(def.radius * .38, def.radius * .38, def.radius * .18 + 4, 48), new THREE.MeshStandardMaterial({ color: theme.primaryColor, metalness: .35, roughness: .28, emissive: theme.nebulaColor, emissiveIntensity: .25 }));
            body.add(label);
        }
        if (def.kind === 'artifact' || def.kind === 'crystal') {
            const halo = new THREE.Mesh(new THREE.TorusKnotGeometry(def.radius * 1.45, 18, 90, 8, 2, 3), new THREE.MeshBasicMaterial({ color: theme.starTint, transparent: true, opacity: .20, depthWrite: false, blending: THREE.AdditiveBlending }));
            body.add(halo);
        }
    }
    getHit(raycaster) { const hits = raycaster.intersectObjects(this.clickTargets, false); if (!hits.length)
        return null; const obj = hits[0].object, wp = new THREE.Vector3(); obj.getWorldPosition(wp); return { galaxyId: this.galaxyId, title: String(obj.userData.title || 'ARCHIVE OBJECT'), subtitle: String(obj.userData.subtitle || 'Historical archive destination'), worldPos: wp }; }
    getTourStops() { return this.clickTargets.map((obj, i) => { const wp = new THREE.Vector3(); obj.getWorldPosition(wp); return { id: `${this.galaxyId}-ARCHIVE-${i}`, name: String(obj.userData.title), subtitle: `${GALAXY_THEMES[this.galaxyId]?.title} · ${String(obj.userData.subtitle || 'Archive destination')}`, pos: { x: wp.x, y: wp.y, z: wp.z } }; }); }
    update(dt) { for (const o of this.orbiters) {
        o.pivot.rotation.y += dt * o.speed;
        o.body.rotation.y += dt * .14;
        o.body.rotation.x += dt * .035;
        o.body.position.y = Math.sin(performance.now() * .00035 + o.bob) * 90;
    } }
}
