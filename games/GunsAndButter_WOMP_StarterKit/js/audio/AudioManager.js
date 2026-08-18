// Guns & Butter — WOMP Audio Manager
// Browser-safe Web Audio SFX + looping music transport.
class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicElement = null;
    this.musicWanted = false;
    const read = (k, d) => {
      const n = Number(localStorage.getItem(`audio_${k}`));
      return Number.isFinite(n) ? n : d;
    };
    this.volumes = {
      master: read('master', 1),
      music: read('music', .72),
      womp: read('womp', .88),
      impacts: read('impacts', .84)
    };
    this.musicSources = [
      'assets/music/audio/Guns and Butter 3.mp3',
      'assets/audio/music/guns-and-butter.mp3'
    ];
    this.musicSourceIndex = 0;
    document.addEventListener('pointerdown', () => this._unlock(), { once:true, capture:true });
    document.addEventListener('keydown', () => this._unlock(), { once:true, capture:true });
    setInterval(() => {
      if (this.musicWanted && this.musicElement && this.musicElement.paused) {
        this.musicElement.play().catch(() => {});
      }
    }, 1200);
  }

  _unlock() {
    this._context();
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
  }

  _context() {
    if (this.ctx) return this.ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.volumes.master;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  startMusicFromGesture(restart=false) {
    this._unlock();
    this.musicWanted = true;
    if (!this.musicElement) this._makeMusicElement();
    if (restart) { try { this.musicElement.currentTime = 0; } catch(e){} }
    this._applyMusicVolume();
    const p = this.musicElement.play();
    if (p && p.catch) p.catch(() => {});
  }

  _makeMusicElement() {
    const a = new Audio();
    this.musicElement = a;
    a.loop = true;
    a.preload = 'auto';
    a.playsInline = true;
    a.src = this.musicSources[this.musicSourceIndex];
    a.addEventListener('error', () => {
      if (this.musicSourceIndex < this.musicSources.length - 1) {
        this.musicSourceIndex++;
        a.src = this.musicSources[this.musicSourceIndex];
        a.load();
        if (this.musicWanted) a.play().catch(() => {});
      }
    });
  }

  stopMusic() {
    this.musicWanted = false;
    if (this.musicElement) this.musicElement.pause();
  }

  _applyMusicVolume() {
    if (this.musicElement) this.musicElement.volume = Math.max(0, Math.min(1, this.volumes.master * this.volumes.music));
  }

  setVolume(category, value) {
    const v = Math.max(0, Math.min(1, Number(value) || 0));
    this.volumes[category] = v;
    localStorage.setItem(`audio_${category}`, String(v));
    if (category === 'master' && this.master) this.master.gain.value = v;
    if (category === 'master' || category === 'music') this._applyMusicVolume();
  }

  _tone(freq=440, dur=.1, type='sine', gain=.12, endFreq=null, delay=0) {
    this._unlock();
    const c = this.ctx, t = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(Math.max(30,endFreq), t+dur);
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(Math.max(.001,gain*this.volumes.womp),t+.006);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t+dur+.03);
  }

  _noise(dur=.06, gain=.05, delay=0, band=1800) {
    this._unlock();
    const c=this.ctx, t=c.currentTime+delay, n=Math.floor(c.sampleRate*dur);
    const b=c.createBuffer(1,n,c.sampleRate), d=b.getChannelData(0);
    for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*(1-i/n);
    const s=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain();
    s.buffer=b; f.type='bandpass'; f.frequency.value=band; f.Q.value=.7;
    g.gain.setValueAtTime(gain*this.volumes.womp,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    s.connect(f).connect(g).connect(this.master); s.start(t); s.stop(t+dur+.02);
  }

  playWompFire(id, preview=false) {
    const w=String(id||'').replace(/_/g,'-');
    switch(w) {
      case 'tambourine-tempest':
        this._tone(740,.09,'sawtooth',.18,420); this._tone(988,.11,'triangle',.12,620,.01);
        this._tone(1175,.08,'sine',.07,null,.016); this._tone(1320,.08,'sine',.06,null,.03); this._noise(.055,.045,.005,4300); break;
      case 'cd-double-barrel':
        this._tone(180,.13,'square',.22,85); this._tone(240,.17,'triangle',.16,115,.01); this._noise(.08,.07,.005,2600); break;
      case 'hand-cannon-808':
        this._tone(58,.22,'sine',.35,38); this._tone(116,.15,'triangle',.13,68,.006); this._noise(.045,.045,0,900); break;
      case 'vinyl-launcher':
        this._tone(310,.13,'triangle',.15,170); this._tone(620,.18,'sine',.10,260,.01); this._noise(.065,.045,.01,3000); break;
      case 'keytar-rifle':
        this._tone(330,.10,'square',.14,220); this._tone(494,.09,'square',.11,330,.012); this._tone(659,.08,'triangle',.09,440,.024); break;
      case 'harp-javelin':
        this._tone(660,.17,'triangle',.13,220); this._tone(990,.21,'sine',.09,330,.015); break;
      case 'mic-drop':
        this._tone(95,.14,'square',.22,52); this._tone(180,.16,'sawtooth',.12,68,.01); break;
      default:
        this._tone(440,.10,'sine',.15,250); this._tone(660,.08,'triangle',.08,390,.01);
    }
  }

  playEquip() { this._tone(520,.07,'triangle',.07,760); }
  playReload() { this._tone(210,.06,'square',.06,150); this._tone(420,.08,'triangle',.06,300,.08); }
  playSpecial(id) { this.playWompFire(id,true); }
  playProjectileFlight() {}
  playRicochet() { this._tone(2400,.12,'sine',.07,900); }
  playCombo(level=1) { this._tone(520+Math.min(5,level)*90,.15,'triangle',.09,880); }
  playImpact(material='metal', force=1) {
    const metal = material==='metal' || material==='armor';
    this._tone(metal?1500:170, metal?.11:.08, metal?'triangle':'square', .07, metal?700:90);
    this._noise(metal?.07:.05,.045,0,metal?2800:700);
  }
  playTargetBreak() { this._tone(90,.24,'sine',.16,42); this._noise(.16,.09,0,900); }
}
window.AudioManager = new AudioManager();
