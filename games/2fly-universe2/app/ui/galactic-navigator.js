// Galactic Navigator — Translucent Celestial Instrument UI
// Features Map Mode, Symbol Legend, and "YOU ARE HERE" AU Readout
import { store } from '../state/universe-store.js';
import { getAllGalaxies, getGalaxyRegions, getAllCelestialObjects, formatAU } from '../data/universe-data.js';
export class GalacticNavigator {
    el;
    openBtn;
    panel;
    activeTab = 'map';
    isOpen = false;
    callbacks;
    constructor(container, callbacks) {
        this.callbacks = callbacks;
        this.el = document.createElement('div');
        this.el.id = 'galactic-navigator-wrap';
        this.el.style.cssText = `
      position:absolute;
      bottom:24px;
      left:20px;
      z-index:40;
      font-family:'Space Grotesk',sans-serif;
      pointer-events:none;
    `;
        this.openBtn = document.createElement('button');
        this.openBtn.type = 'button';
        this.openBtn.id = 'nav-open-btn';
        this.openBtn.setAttribute('aria-label', 'Open Galactic Navigator');
        this.openBtn.style.cssText = `
      pointer-events:auto;
      background:rgba(2,10,24,0.85);
      border:1px solid rgba(80,160,240,0.3);
      border-radius:8px;
      color:#8ab4d4;
      font-family:'Space Mono',monospace;
      font-size:0.7rem;
      letter-spacing:0.15em;
      padding:10px 16px;
      cursor:pointer;
      display:flex;
      align-items:center;
      gap:8px;
      backdrop-filter:blur(8px);
      transition:background 0.2s, border-color 0.2s;
    `;
        this.openBtn.innerHTML = `<span>⛯</span> <span>GALACTIC NAVIGATOR</span>`;
        this.panel = document.createElement('div');
        this.panel.id = 'nav-panel';
        this.panel.style.cssText = `
      pointer-events:auto;
      display:none;
      width:340px;
      max-width:90vw;
      max-height:75vh;
      background:linear-gradient(135deg, rgba(2,10,24,0.92) 0%, rgba(4,16,36,0.94) 100%);
      border:1px solid rgba(80,160,240,0.35);
      border-radius:12px;
      box-shadow:0 8px 32px rgba(0,0,0,0.6);
      backdrop-filter:blur(12px);
      overflow:hidden;
      flex-direction:column;
      margin-bottom:12px;
      animation:nav-slide-up 0.25s cubic-bezier(0.16,1,0.3,1);
    `;
        this.el.appendChild(this.panel);
        this.el.appendChild(this.openBtn);
        container.appendChild(this.el);
        this._injectStyles();
        this._bindEvents();
        this.render();
        // Subscribe to store updates for YOU ARE HERE readout
        store.on(() => {
            if (this.isOpen)
                this._updateTelemetry();
        });
    }
    _injectStyles() {
        if (document.getElementById('nav-styles'))
            return;
        const style = document.createElement('style');
        style.id = 'nav-styles';
        style.textContent = `
      @keyframes nav-slide-up {
        from { opacity:0; transform:translateY(12px); }
        to { opacity:1; transform:translateY(0); }
      }
      .nav-tab-btn {
        flex:1;
        padding:10px;
        background:none;
        border:none;
        border-bottom:2px solid transparent;
        color:#4a6888;
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
        letter-spacing:0.15em;
        text-transform:uppercase;
        cursor:pointer;
        transition:color 0.2s, border-color 0.2s;
      }
      .nav-tab-btn.active {
        color:#8ab4d4;
        border-bottom-color:#4090d0;
      }
      .nav-tree-item {
        padding:6px 12px;
        border-radius:4px;
        cursor:pointer;
        font-size:0.75rem;
        color:#7090b0;
        display:flex;
        align-items:center;
        justify-content:space-between;
        transition:background 0.15s, color 0.15s;
      }
      .nav-tree-item:hover {
        background:rgba(80,160,240,0.12);
        color:#e0f0ff;
      }
      .nav-tree-item.active {
        background:rgba(80,160,240,0.2);
        color:#8ab4d4;
        font-weight:600;
      }
    `;
        document.head.appendChild(style);
    }
    _bindEvents() {
        this.openBtn.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            this.panel.style.display = this.isOpen ? 'flex' : 'none';
            if (this.isOpen)
                this.render();
        });
    }
    render() {
        const curGalaxyId = store.get('currentGalaxyId') ?? 'G2025';
        const curGalaxy = getAllGalaxies().find(g => g.id === curGalaxyId);
        const regions = curGalaxy ? getGalaxyRegions(curGalaxyId) : [];
        this.panel.innerHTML = `
      <div style="display:flex;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(0,0,0,0.2);">
        <button type="button" class="nav-tab-btn ${this.activeTab === 'map' ? 'active' : ''}" data-tab="map">⛯ MAP</button>
        <button type="button" class="nav-tab-btn ${this.activeTab === 'legend' ? 'active' : ''}" data-tab="legend">✧ LEGEND</button>
      </div>

      <!-- YOU ARE HERE TELEMETRY -->
      <div id="nav-telemetry" style="
        padding:12px 16px;
        background:rgba(80,160,240,0.05);
        border-bottom:1px solid rgba(255,255,255,0.06);
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
      ">
        <div style="color:#4080c0;letter-spacing:0.15em;margin-bottom:4px;font-weight:bold;">YOU ARE HERE</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;color:#7090b0;">
          <div>GALAXY: <strong style="color:#c0d8f0;">${curGalaxy?.title ?? '2025–2029'}</strong></div>
          <div>AU: <strong id="telemetry-au" style="color:#c0d8f0;">427 AU</strong></div>
        </div>
      </div>

      <div style="padding:12px 16px;overflow-y:auto;flex:1;">
        ${this.activeTab === 'map' ? this._renderMapHTML() : this._renderLegendHTML()}
      </div>
    `;
        // Bind tab clicks
        this.panel.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset['tab'];
                this.activeTab = tab;
                this.render();
            });
        });
        // Bind map tree clicks
        this.panel.querySelectorAll('.nav-tree-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const el = e.currentTarget;
                const type = el.dataset['type'];
                const id = el.dataset['id'];
                const parentId = el.dataset['parentId'];
                if (type === 'galaxy' && id) {
                    this.callbacks.onTravelToGalaxy(id);
                }
                else if (type === 'region' && id && parentId) {
                    this.callbacks.onTravelToRegion(parentId, id);
                }
                else if (type === 'object' && id) {
                    this.callbacks.onTravelToObject(id);
                }
            });
        });
        this._updateTelemetry();
    }
    _renderMapHTML() {
        const galaxies = getAllGalaxies();
        const curGalaxyId = store.get('currentGalaxyId') ?? 'G2025';
        const celestials = getAllCelestialObjects();
        return `
      <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:#4a6888;letter-spacing:0.1em;margin-bottom:8px;">
        KNOWN GALAXIES (CLICK TO TRAVEL)
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        ${galaxies.map(g => {
            const isSelected = g.id === curGalaxyId;
            const isShowcase = g.id === 'G2025';
            const isUncharted = g.status === 'uncharted';
            const regions = getGalaxyRegions(g.id);
            return `
            <div class="nav-tree-item ${isSelected ? 'active' : ''}" data-type="galaxy" data-id="${g.id}">
              <span>${isShowcase ? '✦ ' : ''}${g.title}</span>
              <span style="font-size:0.6rem;opacity:0.6;">${isShowcase ? 'SHOWCASE' : (isUncharted ? 'UNCHARTED' : 'KNOWN')}</span>
            </div>
            ${isSelected ? `
              <div style="margin-left:12px;padding-left:8px;border-left:1px solid rgba(80,160,240,0.2);display:flex;flex-direction:column;gap:2px;margin-bottom:6px;">
                ${regions.map(r => `
                  <div class="nav-tree-item" data-type="region" data-id="${r.id}" data-parent-id="${g.id}">
                    <span>↳ ${r.title}</span>
                  </div>
                `).join('')}
                ${celestials.filter(o => o.galaxyId === g.id).map(o => `
                  <div class="nav-tree-item" data-type="object" data-id="${o.id}">
                    <span style="color:#50a0d0;">● ${o.title}</span>
                    <span style="font-size:0.6rem;opacity:0.6;">${o.kind.toUpperCase()}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          `;
        }).join('')}
      </div>
    `;
    }
    _renderLegendHTML() {
        const legendItems = [
            { icon: '✦', label: 'STAR', desc: 'Visitor in the Universe' },
            { icon: '☀', label: 'SUN', desc: 'Era-defining work / event' },
            { icon: '●', label: 'PLANET', desc: 'Major work / history' },
            { icon: '◐', label: 'MOON', desc: 'Related artifact' },
            { icon: '◇', label: 'SATELLITE', desc: 'Interactive / external media' },
            { icon: '☄', label: 'COMET', desc: 'Theme / person crossing eras' },
            { icon: '✧', label: 'NEBULA', desc: 'Creative period' },
            { icon: '✺', label: 'SUPERNOVA', desc: 'Transformative event' },
            { icon: '·', label: 'ASTEROID', desc: 'Small archival artifact' },
        ];
        return `
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${legendItems.map(item => `
          <div style="display:flex;align-items:center;gap:12px;padding:6px;border-bottom:1px solid rgba(255,255,255,0.04);">
            <span style="font-size:1.1rem;color:#8ab4d4;width:24px;text-align:center;">${item.icon}</span>
            <div>
              <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:#c0d8f0;letter-spacing:0.1em;">${item.label}</div>
              <div style="font-size:0.7rem;color:#5a7898;">${item.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    }
    _updateTelemetry() {
        const auEl = this.panel.querySelector('#telemetry-au');
        if (auEl) {
            // Calculate dynamic AU from current camera snapshot
            const snap = store.get('cameraSnapshot');
            const dist = snap ? Math.hypot(...snap.position) : 48000;
            auEl.textContent = formatAU(dist);
        }
    }
    dispose() {
        this.el.remove();
    }
}
