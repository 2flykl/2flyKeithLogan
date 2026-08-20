window.FlyverseEngine = class FlyverseEngine {
  constructor(canvas, data) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = data;
    this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    this.w = 0; this.h = 0;
    this.t = 0; this.last = performance.now();
    this.camera = { x: 620, y: 0, zoom: 0.32 };
    this.target = { x: 620, y: 0, zoom: 0.32 };
    this.drag = null;
    this.hover = null;
    this.onSelect = null;
    this.reticleWorld = { x: 620, y: 0 };
    this.starsFar = Array.from({length: 900}, () => ({ x:(Math.random()-0.5)*7600, y:(Math.random()-0.5)*4400, s:Math.random()*1.2+0.3, a:Math.random()*0.32+0.08 }));
    this.starsMid = Array.from({length: 800}, () => ({ x:(Math.random()-0.5)*7600, y:(Math.random()-0.5)*4400, s:Math.random()*1.7+0.5, a:Math.random()*0.42+0.12 }));
    this.starsNear = Array.from({length: 260}, () => ({ x:(Math.random()-0.5)*7600, y:(Math.random()-0.5)*4400, s:Math.random()*2.6+0.8, a:Math.random()*0.45+0.18 }));
    this.resize();
    addEventListener('resize', () => this.resize());
    this.bind();
    requestAnimationFrame(t => this.loop(t));
  }

  resize() {
    this.w = innerWidth; this.h = innerHeight;
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
    this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
  }

  bind() {
    this.canvas.addEventListener('pointerdown', e => {
      this.canvas.setPointerCapture(e.pointerId);
      const pick = this.pick(e.clientX, e.clientY);
      if (pick) {
        this.onSelect && this.onSelect(pick);
      } else {
        this.reticleWorld = this.screenToWorld(e.clientX, e.clientY);
      }
      this.drag = { sx: e.clientX, sy: e.clientY, x: this.target.x, y: this.target.y };
    });
    this.canvas.addEventListener('pointermove', e => {
      const world = this.screenToWorld(e.clientX, e.clientY);
      this.hover = this.pick(e.clientX, e.clientY);
      this.reticleWorld = world;
      if (this.drag) {
        const dx = (e.clientX - this.drag.sx) / this.camera.zoom;
        const dy = (e.clientY - this.drag.sy) / this.camera.zoom;
        this.target.x = this.drag.x - dx;
        this.target.y = this.drag.y - dy;
      }
    });
    const clearDrag = () => { this.drag = null; };
    this.canvas.addEventListener('pointerup', clearDrag);
    this.canvas.addEventListener('pointercancel', clearDrag);

    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const before = this.screenToWorld(e.clientX, e.clientY);
      const factor = Math.exp(-Math.max(-120, Math.min(120, e.deltaY)) * 0.0018);
      this.target.zoom = Math.max(0.12, Math.min(3.4, this.target.zoom * factor));
      const after = this.screenToWorld(e.clientX, e.clientY, this.target);
      this.target.x += before.x - after.x;
      this.target.y += before.y - after.y;
      this.reticleWorld = before;
    }, { passive: false });
  }

  worldToScreen(x, y, cam = this.camera) {
    return { x: (x - cam.x) * cam.zoom + this.w / 2, y: (y - cam.y) * cam.zoom + this.h / 2 };
  }

  screenToWorld(x, y, cam = this.camera) {
    return { x: (x - this.w / 2) / cam.zoom + cam.x, y: (y - this.h / 2) / cam.zoom + cam.y };
  }

  pick(sx, sy) {
    let best = null, bestD = 1e9;
    for (const o of this.data.objects) {
      const p = this.worldToScreen(o.x, o.y);
      const rr = Math.max(10, o.r * this.camera.zoom);
      const d = Math.hypot(sx - p.x, sy - p.y);
      if (d < rr + 12 && d < bestD) { best = o; bestD = d; }
    }
    return best;
  }

  focus(x, y, zoom = 1.1) { this.target.x = x; this.target.y = y; this.target.zoom = zoom; }
  reset() { this.target = { x: 620, y: 0, zoom: 0.32 }; }

  loop(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now; this.t += dt;
    const k = 1 - Math.exp(-dt * 6);
    this.camera.x += (this.target.x - this.camera.x) * k;
    this.camera.y += (this.target.y - this.camera.y) * k;
    this.camera.zoom += (this.target.zoom - this.camera.zoom) * k;
    this.draw();
    requestAnimationFrame(t => this.loop(t));
  }

  draw() {
    const c = this.ctx;
    c.clearRect(0, 0, this.w, this.h);
    this.drawBackground(c);
    this.drawGalaxies(c);
    this.drawEraOrbits(c);
    this.drawObjects(c);
  }

  drawBackground(c) {
    const bg = c.createRadialGradient(this.w * 0.52, this.h * 0.36, 0, this.w * 0.52, this.h * 0.36, this.h * 0.92);
    bg.addColorStop(0, '#0f1c37');
    bg.addColorStop(0.42, '#050b18');
    bg.addColorStop(1, '#010208');
    c.fillStyle = bg;
    c.fillRect(0, 0, this.w, this.h);

    const drawLayer = (stars, parallax, color) => {
      c.save();
      for (const s of stars) {
        const x = ((s.x - this.camera.x * parallax) * this.camera.zoom) + this.w / 2;
        const y = ((s.y - this.camera.y * parallax) * this.camera.zoom) + this.h / 2;
        if (x < -16 || x > this.w + 16 || y < -16 || y > this.h + 16) continue;
        c.globalAlpha = s.a;
        c.fillStyle = color;
        c.fillRect(x, y, s.s, s.s);
        if (s.s > 1.7) {
          c.strokeStyle = 'rgba(125,200,255,0.09)';
          c.beginPath(); c.arc(x, y, s.s * 1.7, 0, Math.PI * 2); c.stroke();
        }
      }
      c.restore();
    };

    drawLayer(this.starsFar, 0.18, '#a8c2ea');
    drawLayer(this.starsMid, 0.38, '#dcecff');
    drawLayer(this.starsNear, 0.62, '#f8fcff');
  }

  drawGalaxies(c) {
    const zoom = this.camera.zoom;
    const swirlAlpha = Math.max(0.06, 0.26 - zoom * 0.1); // lowers as user zooms in
    for (const era of this.data.eras) {
      const p = this.worldToScreen(era.x, era.y);
      const base = Math.max(84, era.radius * zoom);
      if (p.x < -base * 2.5 || p.x > this.w + base * 2.5 || p.y < -base * 2.5 || p.y > this.h + base * 2.5) continue;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(this.t * 0.03 + era.x * 0.00012);

      const halo = c.createRadialGradient(0,0,0,0,0,base*1.35);
      halo.addColorStop(0, this.hexAlpha(era.color, 0.17));
      halo.addColorStop(0.42, this.hexAlpha(era.color, 0.085));
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = halo;
      c.beginPath(); c.arc(0,0,base*1.22,0,Math.PI*2); c.fill();

      for (let arm = 0; arm < 4; arm++) {
        c.beginPath();
        for (let i = 0; i < 128; i++) {
          const q = i / 127;
          const ang = q * 6.5 + arm * (Math.PI / 2);
          const rr = q * base;
          const x = Math.cos(ang) * rr * 1.42;
          const y = Math.sin(ang) * rr * 0.5;
          if (i === 0) c.moveTo(x,y); else c.lineTo(x,y);
        }
        c.strokeStyle = this.hexAlpha(era.color, swirlAlpha);
        c.lineWidth = Math.max(1, 4.2 * zoom);
        c.stroke();
      }

      for (let i = 0; i < 68; i++) {
        const ang = i * 0.39 + this.t * 0.27;
        const rr = (0.18 + (i % 14) / 15) * base;
        const x = Math.cos(ang) * rr * 1.28;
        const y = Math.sin(ang * 1.03) * rr * 0.5;
        c.fillStyle = this.hexAlpha(era.color, Math.max(0.03, 0.2 - zoom * 0.085));
        c.beginPath(); c.arc(x, y, Math.max(0.8, 2.1 * zoom), 0, Math.PI * 2); c.fill();
      }
      c.restore();

      c.fillStyle = '#f2f7ff';
      c.font = '700 13px system-ui';
      c.textAlign = 'center';
      c.fillText(era.years, p.x, p.y - base * 0.88 - 10);
      c.fillStyle = '#8aa1bb';
      c.font = '10px system-ui';
      c.fillText(era.name, p.x, p.y - base * 0.88 + 6);
    }
  }

  drawEraOrbits(c) {
    for (const era of this.data.eras) {
      const p = this.worldToScreen(era.x, era.y);
      const objects = this.data.objects.filter(o => o.era === era.id);
      c.save();
      c.strokeStyle = this.hexAlpha(era.color, 0.15);
      c.lineWidth = Math.max(0.7, this.camera.zoom * 1.15);
      for (const o of objects) {
        const op = this.worldToScreen(o.x, o.y);
        const dx = op.x - p.x, dy = op.y - p.y;
        const rr = Math.hypot(dx, dy);
        const ang = Math.atan2(dy, dx);
        c.beginPath();
        c.ellipse(p.x, p.y, rr * 0.98, rr * 0.42, ang, 0, Math.PI * 2);
        c.stroke();
      }
      c.restore();
    }
  }

  drawObjects(c) {
    for (const o of this.data.objects) {
      const era = this.data.eras.find(e => e.id === o.era);
      const p = this.worldToScreen(o.x, o.y);
      const rr = Math.max(8, o.r * this.camera.zoom);
      if (p.x < -140 || p.x > this.w + 140 || p.y < -140 || p.y > this.h + 140) continue;

      const pulse = 1 + Math.sin(this.t * 1.15 + o.x * 0.01) * 0.03;
      const r = rr * pulse;
      const hovered = this.hover === o;
      this.drawShape(c, o.shape || 'sphere', p.x, p.y, r, era.color, hovered);

      if (hovered || this.camera.zoom > 0.5) {
        c.fillStyle = '#eef6ff';
        c.font = `600 ${Math.max(10, 11 + this.camera.zoom * 5)}px system-ui`;
        c.textAlign = 'center';
        c.fillText(o.title, p.x, p.y + r + 16);
      }
    }
  }

  drawShape(c, shape, x, y, r, color, hovered) {
    c.save();
    c.translate(x, y);
    const spin = this.t * 0.4;
    const glow = c.createRadialGradient(-r * 0.2, -r * 0.25, r * 0.08, 0, 0, r * 1.1);
    glow.addColorStop(0, 'rgba(255,255,255,0.96)');
    glow.addColorStop(0.15, this.hexAlpha(color, 0.95));
    glow.addColorStop(1, this.hexAlpha(color, 0.12));
    c.fillStyle = glow;
    c.strokeStyle = hovered ? 'rgba(255,255,255,0.95)' : this.hexAlpha(color, 0.6);
    c.lineWidth = hovered ? 2.1 : 1.15;
    c.shadowColor = this.hexAlpha(color, hovered ? 0.65 : 0.45);
    c.shadowBlur = hovered ? 18 : 10;

    switch (shape) {
      case 'plate':
        c.rotate(spin * 0.35);
        c.beginPath(); c.ellipse(0, 0, r * 1.18, r * 0.56, -0.3, 0, Math.PI * 2); c.fill(); c.stroke();
        c.beginPath(); c.ellipse(0, 0, r * 0.56, r * 0.22, -0.3, 0, Math.PI * 2); c.stroke();
        break;
      case 'triangle':
        c.rotate(spin * 0.5);
        this.polygon(c, 3, r * 1.18, -Math.PI / 2); c.fill(); c.stroke();
        this.polygon(c, 3, r * 0.58, -Math.PI / 2); c.stroke();
        break;
      case 'diamond':
        c.rotate(spin * 0.55);
        this.polygon(c, 4, r * 1.12, Math.PI / 4); c.fill(); c.stroke();
        this.polygon(c, 4, r * 0.54, Math.PI / 4); c.stroke();
        break;
      case 'square':
        c.rotate(spin * 0.3);
        c.beginPath(); c.roundRect(-r * 0.92, -r * 0.92, r * 1.84, r * 1.84, r * 0.24); c.fill(); c.stroke();
        c.beginPath(); c.roundRect(-r * 0.45, -r * 0.45, r * 0.9, r * 0.9, r * 0.14); c.stroke();
        break;
      case 'hex':
        c.rotate(spin * 0.2);
        this.polygon(c, 6, r * 1.05, Math.PI / 6); c.fill(); c.stroke();
        this.polygon(c, 6, r * 0.54, Math.PI / 6); c.stroke();
        break;
      case 'capsule':
        c.rotate(spin * 0.28);
        c.beginPath(); c.roundRect(-r * 1.28, -r * 0.44, r * 2.56, r * 0.88, r * 0.46); c.fill(); c.stroke();
        c.beginPath(); c.arc(-r * 0.7, 0, r * 0.12, 0, Math.PI * 2); c.arc(r * 0.7, 0, r * 0.12, 0, Math.PI * 2); c.fillStyle = 'rgba(255,255,255,0.45)'; c.fill();
        break;
      case 'ring':
        c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill(); c.stroke();
        c.globalCompositeOperation = 'destination-out';
        c.beginPath(); c.arc(0, 0, r * 0.46, 0, Math.PI * 2); c.fill();
        c.globalCompositeOperation = 'source-over';
        c.beginPath(); c.ellipse(0, 0, r * 1.4, r * 0.45, -0.35, 0, Math.PI * 2); c.strokeStyle = this.hexAlpha(color, 0.7); c.stroke();
        break;
      case 'sun':
        c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill(); c.stroke();
        c.strokeStyle = this.hexAlpha(color, 0.22);
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4 + spin * 0.25;
          c.beginPath(); c.moveTo(Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.05); c.lineTo(Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.45); c.stroke();
        }
        break;
      case 'star':
        c.rotate(spin * 0.42);
        c.beginPath();
        for (let i = 0; i < 10; i++) {
          const a = -Math.PI/2 + i * Math.PI / 5;
          const rad = i % 2 === 0 ? r * 1.1 : r * 0.46;
          const px = Math.cos(a) * rad;
          const py = Math.sin(a) * rad;
          if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
        }
        c.closePath();
        c.fill(); c.stroke();
        c.beginPath(); c.arc(0, 0, r * 0.22, 0, Math.PI * 2); c.fillStyle = 'rgba(255,255,255,0.8)'; c.fill();
        c.strokeStyle = this.hexAlpha(color, 0.26);
        c.beginPath(); c.arc(0, 0, r * 1.55, 0, Math.PI * 2); c.stroke();
        break;
      case 'nebula':
        c.rotate(spin * 0.18);
        for (let i = 0; i < 3; i++) {
          c.beginPath(); c.ellipse((i - 1) * r * 0.24, (i % 2 ? 1 : -1) * r * 0.1, r * (0.95 - i * 0.1), r * (0.64 - i * 0.08), i * 0.45, 0, Math.PI * 2); c.fill();
        }
        c.strokeStyle = this.hexAlpha(color, 0.55);
        c.beginPath(); c.ellipse(0, 0, r * 1.18, r * 0.68, 0.22, 0, Math.PI * 2); c.stroke();
        break;
      case 'shard':
        c.rotate(spin * 0.58);
        c.beginPath(); c.moveTo(-r * 0.8, -r * 0.35); c.lineTo(r * 0.95, -r * 0.08); c.lineTo(r * 0.25, r * 0.88); c.lineTo(-r * 0.95, r * 0.18); c.closePath(); c.fill(); c.stroke();
        break;
      case 'sphere':
      default:
        c.beginPath(); c.arc(0,0,r,0,Math.PI*2); c.fill(); c.stroke();
        c.beginPath(); c.arc(-r*0.22, -r*0.2, r*0.28, 0, Math.PI*2); c.fillStyle = 'rgba(255,255,255,0.18)'; c.fill();
        break;
    }
    c.restore();
  }

  polygon(c, sides, radius, rotation = 0) {
    c.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = rotation + i * Math.PI * 2 / sides;
      const px = Math.cos(a) * radius;
      const py = Math.sin(a) * radius;
      if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.closePath();
  }

  hexAlpha(hex, a) {
    const h = hex.replace('#','');
    const n = parseInt(h, 16);
    return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }
};
