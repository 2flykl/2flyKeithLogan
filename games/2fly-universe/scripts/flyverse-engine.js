window.FlyverseEngine = class {
  constructor(canvas, data) {
    this.c = canvas;
    this.x = canvas.getContext('2d');
    this.d = data;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = 0;
    this.h = 0;
    this.time = 0;
    this.last = performance.now();

    this.cam = { x: 380, y: 20, zoom: 0.24, yaw: 0, pitch: -0.06 };
    this.target = { ...this.cam };
    this.drag = null;
    this.hover = null;
    this.selected = null;
    this.onSelect = null;
    this.reticle = { x: innerWidth * 0.54, y: innerHeight * 0.52 };

    this.img = new Map();
    this.preload();
    this.makeStars();
    this.makeNebula();
    this.resize();
    addEventListener('resize', () => this.resize());
    this.bind();
    requestAnimationFrame(t => this.loop(t));
  }

  preload() {
    for (const e of this.d.eras) this.load(e.img);
    for (const o of this.d.objects) if (o.sprite) this.load(o.sprite);
  }

  load(src) {
    if (this.img.has(src)) return;
    const i = new Image();
    i.src = src;
    this.img.set(src, i);
  }

  makeStars() {
    const mk = (n, span, colorSet) => Array.from({ length: n }, () => ({
      x: (Math.random() - 0.5) * span,
      y: (Math.random() - 0.5) * span * 0.62,
      z: (Math.random() - 0.5) * 2000,
      s: 0.35 + Math.random() * 1.7,
      a: 0.1 + Math.random() * 0.6,
      hue: colorSet[Math.floor(Math.random() * colorSet.length)]
    }));
    this.stars = [
      mk(1100, 9800, ['#ffffff', '#e1ebff', '#b6d9ff']),
      mk(700, 9800, ['#fff4ca', '#d3d8ff', '#9de6ff']),
      mk(260, 9800, ['#fbd681', '#b58bff', '#8af0ff'])
    ];
  }

  makeNebula() {
    this.nebula = [
      { x: -2350, y: 100,  z: -500, rx: 480, ry: 240, color: 'rgba(144,72,255,.13)' },
      { x: -50,   y: -1280,z: -350, rx: 460, ry: 220, color: 'rgba(100,138,255,.16)' },
      { x: 2430,  y: -40,  z: -420, rx: 420, ry: 200, color: 'rgba(80,255,228,.12)' },
      { x: 1480,  y: 1260, z: -340, rx: 450, ry: 220, color: 'rgba(255,94,210,.11)' },
      { x: -970,  y: 1450, z: -280, rx: 520, ry: 240, color: 'rgba(255,138,75,.10)' },
      { x: 480,   y: 160,  z: 40,   rx: 760, ry: 320, color: 'rgba(74,214,255,.08)' }
    ];
  }

  resize() {
    this.w = innerWidth;
    this.h = innerHeight;
    this.c.width = this.w * this.dpr;
    this.c.height = this.h * this.dpr;
    this.c.style.width = this.w + 'px';
    this.c.style.height = this.h + 'px';
    this.x.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  bind() {
    this.c.addEventListener('pointerdown', e => {
      this.c.setPointerCapture(e.pointerId);
      this.drag = {
        sx: e.clientX,
        sy: e.clientY,
        x: this.target.x,
        y: this.target.y,
        yaw: this.target.yaw,
        pitch: this.target.pitch,
        moved: 0,
        rotate: e.shiftKey
      };
      this.reticle = { x: e.clientX, y: e.clientY };
    });

    this.c.addEventListener('pointermove', e => {
      this.reticle = { x: e.clientX, y: e.clientY };
      this.hover = this.pick(e.clientX, e.clientY);
      if (!this.drag) return;
      const dx = e.clientX - this.drag.sx;
      const dy = e.clientY - this.drag.sy;
      this.drag.moved = Math.max(this.drag.moved, Math.hypot(dx, dy));
      if (this.drag.rotate || e.shiftKey) {
        this.target.yaw = this.drag.yaw + dx * 0.0032;
        this.target.pitch = Math.max(-0.6, Math.min(0.6, this.drag.pitch + dy * 0.0026));
      } else {
        this.target.x = this.drag.x - dx / this.cam.zoom;
        this.target.y = this.drag.y - dy / this.cam.zoom;
      }
    });

    this.c.addEventListener('pointerup', e => {
      if (this.drag && this.drag.moved < 7) {
        const picked = this.pick(e.clientX, e.clientY);
        if (picked && this.onSelect) {
          this.selected = picked;
          this.onSelect(picked);
        }
      }
      this.drag = null;
    });

    this.c.addEventListener('pointercancel', () => this.drag = null);

    this.c.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = Math.exp(-Math.max(-140, Math.min(140, e.deltaY)) * 0.0017);
      const old = this.target.zoom;
      this.target.zoom = Math.max(0.11, Math.min(2.9, old * factor));
      const dx = e.clientX - this.w / 2;
      const dy = e.clientY - this.h / 2;
      this.target.x += dx * (1 / old - 1 / this.target.zoom);
      this.target.y += dy * (1 / old - 1 / this.target.zoom);
      this.reticle = { x: e.clientX, y: e.clientY };
    }, { passive: false });
  }

  loop(t) {
    const dt = Math.min(0.05, (t - this.last) / 1000);
    this.last = t;
    this.time += dt;
    const k = 1 - Math.exp(-dt * 4);
    for (const q of ['x', 'y', 'zoom', 'yaw', 'pitch']) this.cam[q] += (this.target[q] - this.cam[q]) * k;
    this.draw();
    requestAnimationFrame(n => this.loop(n));
  }

  reset() {
    this.target = { x: 380, y: 20, zoom: 0.24, yaw: 0, pitch: -0.06 };
  }

  focusEra(e) {
    this.target.x = e.x;
    this.target.y = e.y;
    this.target.zoom = e.active ? 0.65 : 0.52;
  }

  project(px, py, pz) {
    const x = px - this.cam.x;
    const y = py - this.cam.y;
    const z = pz;
    const cy = Math.cos(this.cam.yaw), sy = Math.sin(this.cam.yaw);
    const x1 = x * cy - z * sy;
    const z1 = x * sy + z * cy;
    const cp = Math.cos(this.cam.pitch), sp = Math.sin(this.cam.pitch);
    const y1 = y * cp - z1 * sp;
    const z2 = y * sp + z1 * cp;
    const persp = 1800 / (1800 + z2 * 0.28);
    return { x: this.w / 2 + x1 * this.cam.zoom * persp, y: this.h / 2 + y1 * this.cam.zoom * persp, z: z2, scale: persp };
  }

  orbitPoint(o, e) {
    const th = o.phase + this.time * o.speed;
    const X = o.a * Math.cos(th);
    const Z = o.b * Math.sin(th);
    const Y = 0;
    const ci = Math.cos(o.incl), si = Math.sin(o.incl);
    const y = Y * ci - Z * si;
    const z = Y * si + Z * ci;
    const cn = Math.cos(o.node), sn = Math.sin(o.node);
    const x = X * cn - z * sn;
    const z2 = X * sn + z * cn;
    return { x: e.x + x, y: e.y + y, z: e.z + z2, depth: z2, theta: th };
  }

  pick(sx, sy) {
    let best = null, bd = 1e9;
    for (const o of this.d.objects) {
      const era = this.d.eras.find(a => a.id === o.era);
      const q = this.orbitPoint(o, era);
      const p = this.project(q.x, q.y, q.z);
      const baseR = o.type === 'Placed Star' ? 12 : Math.max(5, o.r * this.cam.zoom * p.scale * (this.cam.zoom > 0.6 ? 1.15 : 0.8));
      const d = Math.hypot(sx - p.x, sy - p.y);
      if (d < baseR + 10 && d < bd) {
        best = o;
        bd = d;
      }
    }
    return best;
  }

  draw() {
    const c = this.x;
    c.clearRect(0, 0, this.w, this.h);

    const bg = c.createRadialGradient(this.w * 0.52, this.h * 0.48, 0, this.w * 0.52, this.h * 0.48, Math.max(this.w, this.h) * 0.82);
    bg.addColorStop(0, '#09162c');
    bg.addColorStop(0.36, '#050c18');
    bg.addColorStop(0.72, '#02050d');
    bg.addColorStop(1, '#000103');
    c.fillStyle = bg;
    c.fillRect(0, 0, this.w, this.h);

    this.drawNebula();
    this.drawStars();

    const packets = [];
    for (const e of this.d.eras) {
      const ep = this.project(e.x, e.y, e.z);
      packets.push({ z: ep.z, kind: 'galaxy', e, ep });
      for (const o of this.d.objects.filter(x => x.era === e.id)) {
        const q = this.orbitPoint(o, e);
        const p = this.project(q.x, q.y, q.z);
        packets.push({ z: p.z, kind: 'object', o, e, q, p });
      }
    }
    packets.sort((a, b) => b.z - a.z);

    for (const e of this.d.eras) this.drawOrbitGuides(e);
    for (const packet of packets) {
      if (packet.kind === 'galaxy') this.drawGalaxy(packet.e, packet.ep);
      else this.drawObject(packet.o, packet.e, packet.p);
    }
    this.drawReticle();
  }

  drawNebula() {
    const c = this.x;
    c.save();
    c.globalCompositeOperation = 'screen';
    for (const n of this.nebula) {
      const p = this.project(n.x, n.y, n.z);
      c.save();
      c.translate(p.x, p.y);
      c.scale(this.cam.zoom * p.scale, this.cam.zoom * p.scale * 0.6);
      const g = c.createRadialGradient(0, 0, 0, 0, 0, n.rx);
      g.addColorStop(0, n.color.replace('.1', '.18'));
      g.addColorStop(0.35, n.color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g;
      c.beginPath();
      c.ellipse(0, 0, n.rx, n.ry, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
    c.restore();
    c.globalCompositeOperation = 'source-over';
  }

  drawStars() {
    const c = this.x;
    this.stars.forEach((layer, li) => {
      const para = [0.12, 0.28, 0.48][li];
      for (const s of layer) {
        const p = this.project(s.x - this.cam.x * para, s.y - this.cam.y * para, s.z);
        if (p.x < -4 || p.x > this.w + 4 || p.y < -4 || p.y > this.h + 4) continue;
        const size = s.s * (0.7 + p.scale * 0.45);
        c.globalAlpha = s.a;
        c.fillStyle = s.hue;
        c.fillRect(p.x, p.y, size, size);
        if (li === 2 && size > 1.3) {
          c.strokeStyle = s.hue;
          c.lineWidth = 0.45;
          c.beginPath();
          c.moveTo(p.x - size * 1.8, p.y + size * 0.5);
          c.lineTo(p.x + size * 2.2, p.y + size * 0.5);
          c.moveTo(p.x + size * 0.5, p.y - size * 1.8);
          c.lineTo(p.x + size * 0.5, p.y + size * 2.2);
          c.stroke();
        }
      }
    });
    c.globalAlpha = 1;
  }

  drawOrbitGuides(era) {
    const related = this.d.objects.filter(o => o.era === era.id);
    if (!related.length) return;
    const c = this.x;
    const prominence = era.active ? 0.55 : 0.22;
    if (this.cam.zoom < 0.12) return;

    c.save();
    c.lineWidth = era.active ? 1 : 0.75;
    c.strokeStyle = this.hexToAlpha(era.color, prominence * Math.min(1, this.cam.zoom * 1.65));

    for (let i = 0; i < related.length; i++) {
      const o = related[i];
      if (!era.active && i > 2) break;
      const samples = 84;
      c.beginPath();
      for (let s = 0; s <= samples; s++) {
        const t = (s / samples) * Math.PI * 2;
        const mock = { ...o, phase: t, speed: 0 };
        const q = this.orbitPoint(mock, era);
        const p = this.project(q.x, q.y, q.z);
        if (s === 0) c.moveTo(p.x, p.y);
        else c.lineTo(p.x, p.y);
      }
      c.stroke();
    }
    c.restore();
  }

  drawGalaxy(e, p) {
    const c = this.x;
    const img = this.img.get(e.img);
    const size = e.r * this.cam.zoom * p.scale * 2.34;
    if (size < 48) return;

    c.save();
    const halo = c.createRadialGradient(p.x, p.y, size * 0.04, p.x, p.y, size * 0.56);
    halo.addColorStop(0, this.hexToAlpha(e.color, 0.22));
    halo.addColorStop(0.55, this.hexToAlpha(e.color, 0.07));
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = halo;
    c.beginPath();
    c.ellipse(p.x, p.y, size * 0.62, size * 0.32, 0, 0, Math.PI * 2);
    c.fill();

    c.globalCompositeOperation = 'screen';
    c.globalAlpha = 0.94;
    if (img && img.complete && img.naturalWidth) {
      c.drawImage(img, p.x - size / 2, p.y - size * 0.34, size, size * 0.68);
    } else {
      const g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 0.45);
      g.addColorStop(0, '#fff9d7');
      g.addColorStop(0.14, e.color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g;
      c.beginPath();
      c.ellipse(p.x, p.y, size * 0.45, size * 0.18, 0, 0, Math.PI * 2);
      c.fill();
    }
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;

    c.textAlign = 'center';
    c.shadowBlur = 18;
    c.shadowColor = this.hexToAlpha(e.color, 0.38);
    c.fillStyle = e.active ? '#76ecff' : '#ece8d4';
    c.font = e.active ? '700 28px Inter, system-ui' : '600 17px Inter, system-ui';
    c.fillText(e.years, p.x, p.y - size * 0.37 - (e.active ? 8 : 4));
    c.shadowBlur = 0;
    c.fillStyle = e.active ? '#7de7ff' : '#c9d2e4';
    c.font = e.active ? '600 16px Inter, system-ui' : '500 12px Inter, system-ui';
    c.fillText(e.name, p.x, p.y - size * 0.37 + (e.active ? 18 : 12));
    c.restore();
  }

  drawObject(o, era, p) {
    const c = this.x;
    if (p.x < -120 || p.x > this.w + 120 || p.y < -120 || p.y > this.h + 120) return;

    const isHovered = this.hover === o;
    const isSelected = this.selected === o;
    const img = o.sprite ? this.img.get(o.sprite) : null;

    c.save();
    c.translate(p.x, p.y);

    if (o.type === 'Placed Star') {
      const rr = Math.max(5, o.r * (0.7 + this.cam.zoom * 0.7) * p.scale * 0.9);
      c.globalAlpha = 0.98;
      c.shadowColor = '#fff6d3';
      c.shadowBlur = isHovered || isSelected ? 22 : 12;
      c.fillStyle = '#fff9d4';
      this.starPath(c, rr);
      c.fill();
      c.fillStyle = era.color;
      this.starPath(c, rr * 0.46);
      c.fill();
      if (isHovered || isSelected || this.cam.zoom > 0.72) {
        c.strokeStyle = 'rgba(255,255,255,.55)';
        c.lineWidth = 1;
        c.beginPath();
        c.arc(0, 0, rr * 1.75, 0, Math.PI * 2);
        c.stroke();
      }
      c.restore();
      this.drawLabel(o, p, Math.max(6, o.r), true);
      return;
    }

    const showSprite = this.cam.zoom > 0.34 || isHovered || isSelected;
    const nodeR = Math.max(4.4, o.r * this.cam.zoom * p.scale * 0.48);

    if (!showSprite) {
      c.globalAlpha = 0.9;
      const g = c.createRadialGradient(-nodeR * 0.3, -nodeR * 0.35, 1, 0, 0, nodeR * 1.6);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.24, era.color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g;
      c.beginPath();
      c.arc(0, 0, nodeR, 0, Math.PI * 2);
      c.fill();
      if (isHovered || isSelected) {
        c.strokeStyle = 'rgba(255,255,255,.56)';
        c.lineWidth = 1;
        c.beginPath();
        c.arc(0, 0, nodeR * 2.2, 0, Math.PI * 2);
        c.stroke();
      }
      c.restore();
      this.drawLabel(o, p, nodeR, false);
      return;
    }

    const scaleBase = Math.max(0.5, Math.min(1.2, this.cam.zoom * 0.9));
    const w = Math.max(20, o.r * 2.2 * scaleBase * p.scale);
    const h = Math.max(20, o.r * 1.62 * scaleBase * p.scale);
    c.globalAlpha = 0.92;
    c.shadowColor = this.hexToAlpha(era.color, isHovered || isSelected ? 0.65 : 0.28);
    c.shadowBlur = isHovered || isSelected ? 24 : 11;

    if (img && img.complete && img.naturalWidth) {
      c.drawImage(img, -w / 2, -h / 2, w, h);
    } else {
      const g = c.createRadialGradient(-w * 0.15, -h * 0.15, 0, 0, 0, w * 0.65);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.2, era.color);
      g.addColorStop(1, '#07101d');
      c.fillStyle = g;
      c.beginPath();
      c.arc(0, 0, w * 0.32, 0, Math.PI * 2);
      c.fill();
    }

    if (isHovered || isSelected) {
      c.globalAlpha = 1;
      c.strokeStyle = 'rgba(255,255,255,.6)';
      c.lineWidth = 1.1;
      c.beginPath();
      c.arc(0, 0, Math.max(w, h) * 0.65, 0, Math.PI * 2);
      c.stroke();
    }

    c.restore();
    this.drawLabel(o, p, Math.max(w, h) * 0.35, false);
  }

  drawLabel(o, p, base, starMode) {
    const show = this.hover === o || this.selected === o || this.cam.zoom > (starMode ? 0.56 : 0.78);
    if (!show) return;
    const c = this.x;
    c.save();
    c.textAlign = 'center';
    c.shadowBlur = 16;
    c.shadowColor = 'rgba(0,0,0,.65)';
    c.fillStyle = '#eef6ff';
    c.font = '600 11px Inter, system-ui';
    c.fillText(o.title, p.x, p.y + base + 16);
    c.restore();
  }

  starPath(c, r) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const rr = i % 2 ? r * 0.38 : r;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr;
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.closePath();
  }

  drawReticle() {
    const c = this.x, x = this.reticle.x, y = this.reticle.y;
    c.save();
    c.strokeStyle = 'rgba(210,234,255,.36)';
    c.lineWidth = 1;
    c.beginPath();
    c.arc(x, y, 12, 0, Math.PI * 2);
    c.moveTo(x - 18, y); c.lineTo(x - 8, y);
    c.moveTo(x + 8, y); c.lineTo(x + 18, y);
    c.moveTo(x, y - 18); c.lineTo(x, y - 8);
    c.moveTo(x, y + 8); c.lineTo(x, y + 18);
    c.stroke();
    c.restore();
  }

  hexToAlpha(hex, a) {
    const h = hex.replace('#','');
    const full = h.length === 3 ? h.split('').map(ch => ch + ch).join('') : h;
    const num = parseInt(full, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${a})`;
  }
};
