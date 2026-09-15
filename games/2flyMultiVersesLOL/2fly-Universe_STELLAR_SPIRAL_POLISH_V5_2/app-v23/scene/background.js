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
        const RANGE = 600_000;
        const starColors = [
            new THREE.Color(0xfff5e8), // warm white
            new THREE.Color(0xe8f0ff), // cool white
            new THREE.Color(0xffe0b0), // amber
            new THREE.Color(0xb0d8ff), // blue
            new THREE.Color(0xffd0d0), // red dwarf
        ];
        for (let i = 0; i < STAR_COUNT; i++) {
            const i3 = i * 3;
            const theta = Math.random() * Math.PI * 2;
            const r = Math.pow(Math.random(), 0.5) * RANGE;
            const y = (Math.random() - 0.5) * RANGE * 0.35;
            positions[i3] = Math.cos(theta) * r;
            positions[i3 + 1] = y;
            positions[i3 + 2] = Math.sin(theta) * r;
            const c = starColors[Math.floor(Math.random() * starColors.length)];
            colors[i3] = c.r;
            colors[i3 + 1] = c.g;
            colors[i3 + 2] = c.b;
            sizes[i] = 0.5 + Math.random() * 2.5;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        const mat = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 } },
            vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float twinkle = 1.0 + 0.15 * sin(time * 2.0 + position.x * 0.001 + position.z * 0.001);
          gl_PointSize = size * twinkle * (300.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 0.3, 4.0);
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vColor * (0.7 + alpha * 0.3), alpha);
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
        const DUST_COUNT = 10_000;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(DUST_COUNT * 3);
        const RANGE = 250_000;
        for (let i = 0; i < DUST_COUNT; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * RANGE;
            positions[i3 + 1] = (Math.random() - 0.5) * RANGE * 0.2;
            positions[i3 + 2] = (Math.random() - 0.5) * RANGE;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        // Radial particle dust (no rectangular plane geometry)
        const mat = new THREE.PointsMaterial({
            color: 0x354868,
            size: 90,
            transparent: true,
            opacity: 0.05,
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
        this.dustMesh.position.y = Math.sin(time * 0.03) * 150;
    }
    dispose() {
        this.starsMesh.geometry.dispose();
        this.starsMesh.material.dispose();
        this.dustMesh.geometry.dispose();
        this.dustMesh.material.dispose();
    }
}
