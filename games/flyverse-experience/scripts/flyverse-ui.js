window.FlyverseUI = class FlyverseUI {
  constructor(engine, data) {
    this.engine = engine;
    this.data = data;
    this.queue = [];
    this.tourIndex = -1;
    this.preTour = null;
    this.els = this.bindEls();
    this.buildNavigator();
    this.buildTourFilters();
    this.renderTourCatalog();
    this.bind();
  }

  bindEls() {
    const id = x => document.getElementById(x);
    return {
      navigator:id('navigator'), card:id('object-card'), type:id('object-type'), title:id('object-title'), meta:id('object-meta'), copy:id('object-copy'), actions:id('object-actions'), reticle:id('flyverse-reticle'),
      tour:id('tour-panel'), search:id('tour-search'), era:id('tour-era'), otype:id('tour-type'), catalog:id('tour-catalog'), queue:id('tour-queue'), count:id('tour-count'), start:id('tour-start'),
      tourHud:id('tour-hud'), progress:id('tour-progress'), stopTitle:id('tour-stop-title')
    };
  }

  bind() {
    addEventListener('pointermove', e => {
      this.els.reticle.style.left = e.clientX + 'px';
      this.els.reticle.style.top = e.clientY + 'px';
    });
    document.getElementById('btn-home').onclick = () => { this.closeCard(); this.engine.reset(); };
    document.getElementById('btn-random').onclick = () => {
      const o = this.data.objects[Math.floor(Math.random() * this.data.objects.length)];
      this.inspect(o, true);
    };
    document.getElementById('btn-tour').onclick = () => this.openTour();
    document.getElementById('tour-close').onclick = () => this.closeTour();
    document.getElementById('object-close').onclick = () => this.closeCard();
    [this.els.search, this.els.era, this.els.otype].forEach(el => el.addEventListener('input', () => this.renderTourCatalog()));
    this.els.start.onclick = () => this.startTour();
    document.getElementById('tour-prev').onclick = () => this.stepTour(-1);
    document.getElementById('tour-next').onclick = () => this.stepTour(1);
    document.getElementById('tour-exit').onclick = () => this.exitTour(true);
    this.engine.onSelect = o => this.inspect(o, true);
    addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (!this.els.tour.hidden) this.closeTour();
        else if (!this.els.card.hidden) this.closeCard();
        else if (!this.els.tourHud.hidden) this.exitTour(true);
      }
    });
  }

  buildNavigator() {
    this.els.navigator.innerHTML = this.data.eras.map(e => `
      <button class="nav-era" data-era="${e.id}">
        <b>${e.years}</b>
        <span>${e.name}</span>
      </button>`).join('');
    this.els.navigator.querySelectorAll('button').forEach(b => b.onclick = () => {
      const e = this.data.eras.find(x => x.id === b.dataset.era);
      this.engine.focus(e.x, e.y, 0.92);
      this.els.navigator.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
    });
  }

  inspect(o, focus = false) {
    if (focus) this.engine.focus(o.x, o.y, 1.28);
    this.els.type.textContent = o.type.toUpperCase();
    this.els.title.textContent = o.title;
    this.els.meta.textContent = o.subtitle || '';
    this.els.copy.textContent = o.copy || '';
    this.els.actions.innerHTML = '';
    if (o.actions?.length) {
      for (const a of o.actions) {
        const el = document.createElement('a');
        el.href = a.href;
        el.textContent = a.label;
        el.target = '_self';
        this.els.actions.appendChild(el);
      }
    } else {
      const b = document.createElement('button');
      b.textContent = 'Archive node';
      b.disabled = true;
      this.els.actions.appendChild(b);
    }
    this.els.card.hidden = false;
  }

  closeCard() { this.els.card.hidden = true; }

  buildTourFilters() {
    for (const e of this.data.eras) this.els.era.add(new Option(`${e.years} — ${e.name}`, e.id));
    const types = [...new Set(this.data.objects.map(o => o.type))].sort();
    types.forEach(t => this.els.otype.add(new Option(t, t)));
  }

  openTour() { this.els.tour.hidden = false; this.renderTourCatalog(); this.renderQueue(); }
  closeTour() { this.els.tour.hidden = true; }

  filtered() {
    const q = this.els.search.value.trim().toLowerCase();
    const era = this.els.era.value;
    const type = this.els.otype.value;
    return this.data.objects.filter(o => (era === 'all' || o.era === era) && (type === 'all' || o.type === type) && (!q || [o.title, o.type, o.subtitle, o.era].join(' ').toLowerCase().includes(q)));
  }

  renderTourCatalog() {
    this.els.catalog.innerHTML = '';
    for (const o of this.filtered()) {
      const d = document.createElement('div');
      d.className = 'catalog-item';
      d.innerHTML = `<div><strong>${o.title}</strong><small>${o.type} • ${o.subtitle || ''}</small></div><button type="button">+ Add</button>`;
      d.querySelector('button').onclick = () => {
        if (!this.queue.includes(o.id) && this.queue.length < 50) this.queue.push(o.id);
        this.renderQueue();
      };
      this.els.catalog.appendChild(d);
    }
  }

  renderQueue() {
    this.els.queue.innerHTML = '';
    this.queue.forEach((id, i) => {
      const o = this.data.objects.find(x => x.id === id);
      const d = document.createElement('div');
      d.className = 'queue-item';
      d.innerHTML = `<strong>${i + 1}. ${o.title}</strong><small>${o.type}</small><div class="queue-actions"><button data-a="up">↑</button><button data-a="down">↓</button><button data-a="remove">Remove</button></div>`;
      d.querySelector('[data-a=up]').onclick = () => this.move(i, -1);
      d.querySelector('[data-a=down]').onclick = () => this.move(i, 1);
      d.querySelector('[data-a=remove]').onclick = () => { this.queue.splice(i, 1); this.renderQueue(); };
      this.els.queue.appendChild(d);
    });
    this.els.count.textContent = `${this.queue.length} stop${this.queue.length === 1 ? '' : 's'}`;
    this.els.start.disabled = !this.queue.length;
  }

  move(i, d) {
    const j = i + d;
    if (j < 0 || j >= this.queue.length) return;
    [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
    this.renderQueue();
  }

  startTour() {
    if (!this.queue.length) return;
    this.preTour = { ...this.engine.target };
    this.tourIndex = 0;
    this.closeTour();
    this.els.tourHud.hidden = false;
    this.gotoTour();
  }

  gotoTour() {
    const o = this.data.objects.find(x => x.id === this.queue[this.tourIndex]);
    this.inspect(o, true);
    this.els.progress.textContent = `STOP ${this.tourIndex + 1} OF ${this.queue.length}`;
    this.els.stopTitle.textContent = o.title;
  }

  stepTour(d) {
    if (!this.queue.length) return;
    this.tourIndex = (this.tourIndex + d + this.queue.length) % this.queue.length;
    this.gotoTour();
  }

  exitTour(restore) {
    this.els.tourHud.hidden = true;
    this.closeCard();
    if (restore && this.preTour) this.engine.target = { ...this.preTour };
    this.tourIndex = -1;
  }
};
