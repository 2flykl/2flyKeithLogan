const STORAGE_KEY = '2fly-universe-custom-tour-v1';
export class TourBuilder {
    callbacks;
    root;
    panel;
    stops = [];
    available;
    query = '';
    galaxyFilter = 'ALL';
    kindFilter = 'ALL';
    constructor(container, available, callbacks) {
        this.callbacks = callbacks;
        this.available = available;
        this.stops = this.load();
        this.root = document.createElement('div');
        this.root.style.cssText = 'position:absolute;inset:0;z-index:70;display:none;pointer-events:auto;background:rgba(0,4,12,.52);backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:18px;';
        this.panel = document.createElement('section');
        this.panel.style.cssText = 'width:min(920px,96vw);max-height:86vh;overflow:hidden;display:flex;flex-direction:column;background:linear-gradient(145deg,rgba(2,10,24,.98),rgba(8,22,40,.96));border:1px solid rgba(96,190,255,.35);border-radius:18px;box-shadow:0 24px 80px rgba(0,0,0,.65);color:#d8ecff;font-family:Space Grotesk,sans-serif;';
        this.root.appendChild(this.panel);
        container.appendChild(this.root);
        this.root.addEventListener('click', e => { if (e.target === this.root)
            this.close(); });
        this.render();
    }
    open() { this.render(); this.root.style.display = 'flex'; }
    close() { this.root.style.display = 'none'; }
    getStops() { return [...this.stops]; }
    load() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        }
        catch {
            return [];
        }
    }
    save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.stops)); }
    add(stop) { if (!this.stops.some(s => s.id === stop.id)) {
        this.stops.push(stop);
        this.save();
        this.render();
    } }
    remove(i) { this.stops.splice(i, 1); this.save(); this.render(); }
    move(i, delta) { const j = i + delta; if (j < 0 || j >= this.stops.length)
        return; [this.stops[i], this.stops[j]] = [this.stops[j], this.stops[i]]; this.save(); this.render(); }
    render() {
        const chosen = new Set(this.stops.map(s => s.id));
        const q = this.query.trim().toLowerCase();
        const galaxies = Array.from(new Set(this.available.map(s => s.galaxyId).filter(Boolean)));
        const kinds = Array.from(new Set(this.available.map(s => s.kind).filter(Boolean)));
        const filtered = this.available.filter(s => {
            const hitQ = !q || `${s.name} ${s.subtitle ?? ''} ${s.galaxyId ?? ''} ${s.kind ?? ''}`.toLowerCase().includes(q);
            const hitG = this.galaxyFilter === 'ALL' || s.galaxyId === this.galaxyFilter;
            const hitK = this.kindFilter === 'ALL' || s.kind === this.kindFilter;
            return hitQ && hitG && hitK;
        });
        this.panel.innerHTML = `
      <header style="padding:20px 22px 14px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;gap:18px;justify-content:space-between;align-items:flex-start;">
        <div><div style="font:600 .68rem 'Space Mono',monospace;letter-spacing:.2em;color:#65c8ff;text-transform:uppercase;">Build your own tour</div><h2 style="margin:5px 0 4px;font-size:clamp(1.35rem,3vw,2.1rem);font-weight:500;">Plot your route through the 2Fly Universe</h2><div style="color:#7697b2;font-size:.86rem;">Choose destinations, arrange the journey, then launch.</div></div>
        <button id="tour-close" style="background:none;border:0;color:#7ea3bf;font-size:1.4rem;cursor:pointer" aria-label="Close tour builder">×</button>
      </header>
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.82fr);min-height:0;overflow:auto;" class="tour-grid">
        <div style="padding:18px 20px;border-right:1px solid rgba(255,255,255,.07);overflow:auto;">
          <div style="font:.62rem 'Space Mono',monospace;letter-spacing:.15em;color:#557b98;margin-bottom:10px;">AVAILABLE DESTINATIONS</div>
          ${this.available.map(s => `<button data-add="${s.id}" ${chosen.has(s.id) ? 'disabled' : ''} style="width:100%;text-align:left;margin:0 0 8px;padding:11px 12px;border-radius:9px;border:1px solid rgba(80,160,240,.18);background:${chosen.has(s.id) ? 'rgba(60,90,110,.12)' : 'rgba(30,90,140,.16)'};color:${chosen.has(s.id) ? '#526879' : '#c9e7ff'};cursor:${chosen.has(s.id) ? 'default' : 'pointer'}"><strong>${s.name}</strong>${s.subtitle ? `<span style=\"display:block;font-size:.75rem;color:#6889a2;margin-top:3px\">${s.subtitle}</span>` : ''}${chosen.has(s.id) ? '<span style="float:right;color:#66cda8">ADDED</span>' : ''}</button>`).join('')}
        </div>
        <div style="padding:18px 20px;overflow:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><span style="font:.62rem 'Space Mono',monospace;letter-spacing:.15em;color:#557b98;">YOUR JOURNEY</span><span style="color:#68a7cf;font-size:.76rem;">${this.stops.length} STOP${this.stops.length === 1 ? '' : 'S'}</span></div>
          ${this.stops.length ? this.stops.map((s, i) => `<div style="display:grid;grid-template-columns:26px 1fr auto;gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);"><span style="font-family:Space Mono;color:#4a83a8">${i + 1}</span><div><strong>${s.name}</strong>${s.subtitle ? `<div style=\"font-size:.72rem;color:#67849a\">${s.subtitle}</div>` : ''}</div><div style="display:flex;gap:4px"><button data-up="${i}" title="Move up">↑</button><button data-down="${i}" title="Move down">↓</button><button data-remove="${i}" title="Remove">×</button></div></div>`).join('') : '<div style="padding:28px 8px;color:#67849a;text-align:center;border:1px dashed rgba(100,170,220,.2);border-radius:12px;">Your route is empty.<br>Add destinations from the left.</div>'}
        </div>
      </div>
      <footer style="padding:14px 20px 18px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:flex-end;gap:10px;"><button id="tour-launch" ${this.stops.length ? '' : 'disabled'} style="padding:10px 18px;border-radius:8px;border:1px solid rgba(80,200,255,.45);background:rgba(20,110,170,.35);color:${this.stops.length ? '#aee8ff' : '#486272'};font:600 .7rem 'Space Mono',monospace;letter-spacing:.12em;cursor:${this.stops.length ? 'pointer' : 'default'};">✦ START TOUR</button></footer>`;
        this.panel.querySelector('#tour-close')?.addEventListener('click', () => this.close());
        this.panel.querySelector('#tour-launch')?.addEventListener('click', () => { if (this.stops.length) {
            this.close();
            this.callbacks.onPlay([...this.stops]);
        } });
        this.panel.querySelectorAll('[data-add]').forEach(el => el.addEventListener('click', () => { const s = this.available.find(x => x.id === el.dataset.add); if (s)
            this.add(s); }));
        this.panel.querySelectorAll('[data-remove]').forEach(el => el.addEventListener('click', () => this.remove(Number(el.dataset.remove))));
        this.panel.querySelectorAll('[data-up]').forEach(el => el.addEventListener('click', () => this.move(Number(el.dataset.up), -1)));
        this.panel.querySelectorAll('[data-down]').forEach(el => el.addEventListener('click', () => this.move(Number(el.dataset.down), 1)));
        const search = this.panel.querySelector('#tour-search');
        search?.addEventListener('input', () => { this.query = search.value; this.render(); requestAnimationFrame(() => this.panel.querySelector('#tour-search')?.focus()); });
        this.panel.querySelector('#tour-galaxy')?.addEventListener('change', e => { this.galaxyFilter = e.currentTarget.value; this.render(); });
        this.panel.querySelector('#tour-kind')?.addEventListener('change', e => { this.kindFilter = e.currentTarget.value; this.render(); });
        if (!document.getElementById('tour-builder-responsive')) {
            const st = document.createElement('style');
            st.id = 'tour-builder-responsive';
            st.textContent = '@media(max-width:700px){.tour-grid{grid-template-columns:1fr!important}.tour-grid>div:first-child{border-right:0!important;border-bottom:1px solid rgba(255,255,255,.07)}} #universe-hud button{touch-action:manipulation}';
            document.head.appendChild(st);
        }
    }
}
