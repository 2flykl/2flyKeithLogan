window.FlyverseUI = class {
  constructor(engine, data) {
    this.e = engine;
    this.d = data;
    this.card = document.querySelector('#card');
    this.nav = document.querySelector('#navigator');
    this.queue = [];
    this.renderNav();
    this.bind();
    engine.onSelect = o => this.inspect(o);
  }

  bind() {
    document.querySelector('#reset').onclick = () => this.e.reset();
    document.querySelector('#random').onclick = () => {
      const era = this.d.eras[Math.floor(Math.random() * this.d.eras.length)];
      this.e.focusEra(era);
    };
    document.querySelector('#place').onclick = () => {
      alert('Placed star mode is represented visually in this build. Demo stars are already active in the 2025–2029 galaxy.');
    };
    document.querySelector('#tour').onclick = () => {
      document.querySelector('#tourpanel').hidden = false;
      this.renderCatalog();
    };
    document.querySelector('#tourclose').onclick = () => document.querySelector('#tourpanel').hidden = true;
    document.querySelector('#close').onclick = () => this.card.hidden = true;
    document.querySelector('#search').oninput = () => this.renderCatalog();
    document.querySelector('#starttour').onclick = () => {
      if (!this.queue.length) return;
      document.querySelector('#tourpanel').hidden = true;
      this.inspect(this.queue[0]);
    };
  }

  renderNav() {
    const eraButtons = this.d.eras.map(e => `
      <button class="era-item" data-era="${e.id}">
        <span class="era-years">${e.years}</span>
        <span class="era-name">${e.name}</span>
      </button>`).join('');

    this.nav.innerHTML = `
      <div class="nav-intro">
        <div class="eyebrow">2FLY UNIVERSE</div>
        <h1>SPACE = TIME</h1>
        <p>Galaxies breathe with more depth and elegance. Zoom into worlds, follow live paths, and explore the eras without losing the universe.</p>
      </div>
      <div class="era-list">${eraButtons}</div>`;

    this.nav.querySelectorAll('[data-era]').forEach(button => {
      button.onclick = () => {
        const era = this.d.eras.find(e => e.id === button.dataset.era);
        if (era) this.e.focusEra(era);
      };
    });
  }

  inspect(o) {
    const era = this.d.eras.find(x => x.id === o.era);
    document.querySelector('#ctype').textContent = o.type;
    document.querySelector('#ctitle').textContent = o.title;
    document.querySelector('#cmeta').textContent = `${era.years} · ${era.name}`;
    document.querySelector('#ccopy').textContent = o.copy;

    const img = document.querySelector('#cardimg');
    img.src = o.sprite || era.img;
    img.alt = `${o.title} preview`;

    const actions = document.querySelector('#cactions');
    const open = o.url ? `<a href="${o.url}">Open Experience ↗</a>` : '';
    const focus = `<button type="button" id="focus-object-btn">Focus Here</button>`;
    actions.innerHTML = `${open}${focus}`;
    const focusBtn = document.querySelector('#focus-object-btn');
    if (focusBtn) focusBtn.onclick = () => {
      const q = this.e.orbitPoint(o, era);
      this.e.target.x = q.x;
      this.e.target.y = q.y;
      this.e.target.zoom = Math.max(0.86, this.e.target.zoom);
    };

    this.card.hidden = false;
    const q = this.e.orbitPoint(o, era);
    this.e.target.x = q.x;
    this.e.target.y = q.y;
    this.e.target.zoom = Math.max(0.75, this.e.target.zoom);
    this.e.selected = o;
  }

  renderCatalog() {
    const term = document.querySelector('#search').value.toLowerCase().trim();
    const list = this.d.objects.filter(o =>
      o.title.toLowerCase().includes(term) ||
      o.type.toLowerCase().includes(term) ||
      o.copy.toLowerCase().includes(term)
    ).slice(0, 60);

    document.querySelector('#catalog').innerHTML = list.map(o => `
      <button data-id="${o.id}">
        ${o.title}
        <small>${o.type}</small>
      </button>`).join('');

    document.querySelectorAll('#catalog [data-id]').forEach(button => {
      button.onclick = () => {
        const found = this.d.objects.find(x => x.id === button.dataset.id);
        if (found && !this.queue.includes(found)) this.queue.push(found);
        this.renderQueue();
      };
    });
  }

  renderQueue() {
    const node = document.querySelector('#queue');
    if (!this.queue.length) {
      node.innerHTML = '<div class="queue-item">No items in the tour yet. Add destinations from the catalog above.</div>';
      return;
    }
    node.innerHTML = this.queue.map((o, i) => `<div class="queue-item">${i + 1}. ${o.title}</div>`).join('');
  }
};
