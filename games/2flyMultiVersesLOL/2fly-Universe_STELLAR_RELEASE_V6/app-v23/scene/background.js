// Background Scene — procedural starfield & distant star dust
// NO RECTANGULAR PLANES OR BLOCKING GEOMETRY CONNECTING GALAXIES.
import * as THREE from 'three';
const STAR_COUNT = 60_000;
export class BackgroundScene {
    group;
    starsMesh;
    dustMesh;
    constructor() {
        this.group = new THREE.Group();
        this._buildStarfield();
        this._buildDust();
    }
    _buildStarfield() {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(STAR_COUNT * 3);
        const colors = new Float32Array(STAR_COUNT * 3);
        const sizes = new Float32Array(STAR_COUNT);
        const seeds = new Float32Array(STAR_COUNT);
        const RANGE = 640_000;
        const starColors = [
            new THREE.Color(0xfff8ee), // brilliant warm white
            new THREE.Color(0xe0f0ff), // crystalline cyan-white
            new THREE.Color(0xffdeb3), // antique amber
            new THREE.Color(0xa6d4ff), // deep celestial blue
            new THREE.Color(0xffc2c2), // delicate red dwarf
            new THREE.Color(0xdfc4ff), // ethereal violet
        ];
        for (let i = 0; i < STAR_COUNT; i++) {
            const i3 = i * 3;
            const theta = Math.random() * Math.PI * 2;
            const r = (0.05 + 0.95 * Math.pow(Math.random(), 0.55)) * RANGE;
            const y = (Math.random() - 0.5) * RANGE * 0.42;
            positions[i3] = Math.cos(theta) * r;
            positions[i3 + 1] = y;
            positions[i3 + 2] = Math.sin(theta) * r;
            
            const seed = Math.random();
            seeds[i] = seed;
            
            // Multi-tiered population distribution
            let size;
            let c;
            if (seed > 0.993) {
                // Hero stars: rare, luminous anchor points
                size = 3.6 + Math.random() * 3.4;
                c = starColors[Math.floor(Math.random() * 3)].clone().multiplyScalar(1.25);
            } else if (seed > 0.88) {
                // Medium stellar population with noticeable spectral color
                size = 1.6 + Math.random() * 1.8;
                c = starColors[Math.floor(Math.random() * starColors.length)];
            } else {
                // Vast deep field of fine, delicate micro-stars
                size = 0.55 + Math.random() * 1.1;
                c = starColors[Math.random() < 0.65 ? 0 : 1].clone().multiplyScalar(0.78);
            }
            
            colors[i3] = c.r;
            colors[i3 + 1] = c.g;
            colors[i3 + 2] = c.b;
            sizes[i] = size;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
        const mat = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 } },
            vertexShader: `
        attribute float size;
        attribute vec3 aColor;
        attribute float aSeed;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float time;
        void main() {
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          // Organic, desynchronized subtle twinkle
          float twinkle = 0.85 + 0.28 * sin(time * (0.8 + aSeed * 1.6) + aSeed * 62.83);
          vAlpha = 0.70 + 0.30 * sin(time * (0.4 + aSeed * 0.9) + aSeed * 41.2);
          gl_PointSize = clamp(size * twinkle * (320.0 / -mv.z), 0.4, 6.0);
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float core = smoothstep(0.12, 0.0, d);
          float halo = smoothstep(0.5, 0.02, d);
          float alpha = (halo * 0.65 + core * 0.55) * vAlpha;
          gl_FragColor = vec4(vColor * (0.85 + core * 1.35), alpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        this.starsMesh = new THREE.Points(geo, mat);
        this.starsMesh.renderOrder = -10;
        this.group.add(this.starsMesh);
    }
    _buildDust() {
        const DUST_COUNT = 12_000;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(DUST_COUNT * 3);
        const RANGE = 280_000;
        for (let i = 0; i < DUST_COUNT; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * RANGE;
            positions[i3 + 1] = (Math.random() - 0.5) * RANGE * 0.22;
            positions[i3 + 2] = (Math.random() - 0.5) * RANGE;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        // Radial particle dust (no rectangular plane geometry)
        const mat = new THREE.PointsMaterial({
            color: 0x224458,
            size: 110,
            transparent: true,
            opacity: 0.045,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        this.dustMesh = new THREE.Points(geo, mat);
        this.dustMesh.renderOrder = -9;
        this.group.add(this.dustMesh);
    }
    update(time) {
        const mat = this.starsMesh.material;
        mat.uniforms.time.value = time;
        this.dustMesh.position.y = Math.sin(time * 0.025) * 120;
    }
    dispose() {
        this.starsMesh.geometry.dispose();
        this.starsMesh.material.dispose();
        this.dustMesh.geometry.dispose();
        this.dustMesh.material.dispose();
    }
}
