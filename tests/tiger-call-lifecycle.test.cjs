'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const gamePath = process.argv[2] || path.join(__dirname, '../games/TigerCall_StillStanding_PLX2_RC_STAGE_HOLDS/src/game.js');
const repositoryRoot = path.resolve(__dirname, '..');
const tigerRoot = path.join(repositoryRoot, 'games/TigerCall_StillStanding_PLX2_RC_STAGE_HOLDS');
const fixturePaths = {
  'playable-controls.js': path.join(repositoryRoot, 'js/playable-controls.js'),
  'midiParser.js': path.join(tigerRoot, 'src/midiParser.js'),
  'performance.mid': path.join(tigerRoot, 'assets/midi/TigerCall_NewHeart_HumanPerformance.mid'),
  'reference.mid': path.join(tigerRoot, 'assets/midi/TigerCall_NewHeart_Reference.mid'),
};
const fixture = name => fs.readFileSync(fixturePaths[name]);
const flush = async () => { for (let i = 0; i < 8; i++) await new Promise(setImmediate); };
async function createGame() {
  const gradients = { addColorStop() {} };
  const drawing = new Proxy({ createLinearGradient: () => gradients, createRadialGradient: () => gradients, measureText: () => ({ width: 30 }), getImageData: () => ({ data: new Uint8ClampedArray(250 * 250 * 4) }) }, { get: (object, key) => object[key] ?? (() => {}) });
  let clock = 1000, timerId = 0;
  const timers = new Map(), errors = [];
  class Element {
    constructor(id = '') {
      Object.assign(this, { id, listeners: {}, style: { setProperty() {} }, dataset: {}, attrs: {}, textContent: '', value: '', disabled: false, width: 500, height: 500, naturalWidth: 500, naturalHeight: 500 });
      const classes = new Set();
      this.classList = { add: (...names) => names.forEach(name => classes.add(name)), remove: (...names) => names.forEach(name => classes.delete(name)), contains: name => classes.has(name) };
    }
    addEventListener(type, listener, options) { (this.listeners[type] ??= []).push({ listener, capture: options === true || !!options?.capture, once: !!options?.once }); }
    removeEventListener(type, listener) { this.listeners[type] = (this.listeners[type] || []).filter(item => item.listener !== listener); }
    dispatchEvent(event) {
      event.target ??= this;
      const route = []; for (let item = this; item; item = item.parentElement) route.push(item);
      event.composedPath ??= () => route;
      event.preventDefault ??= () => {};
      event.stopImmediatePropagation ??= () => { event.stopped = true; };
      const invoke = (target, capture) => { for (const entry of [...target.listeners[event.type] || []]) { if (entry.capture !== capture || event.stopped) continue; entry.listener(event); if (entry.once) target.removeEventListener(event.type, entry.listener); } };
      [...route].reverse().forEach(target => invoke(target, true));
      (event.bubbles ? route : [this]).forEach(target => invoke(target, false));
      return true;
    }
    appendChild(element) { element.parentElement = this; return element; }
    setAttribute(key, value) { this.attrs[key] = value; }
    getAttribute(key) { return this.attrs[key]; }
    getBoundingClientRect() { return { left: 0, top: 0, width: 1000, height: 600 }; }
    focus() {} getContext() { return drawing; } getAnimations() { return []; } animate() {}
    hasPointerCapture() { return false; } setPointerCapture() {} releasePointerCapture() {}
    closest(selector) { if (selector.includes('canvas') && this.id === 'gameCanvas') return this; if (selector === 'button' && this.id.endsWith('Btn')) return this; return null; }
  }
  const window = new Element('window'), document = new Element('document'), elements = {};
  const $ = id => elements[id] ??= new Element(id);
  document.body = new Element('body'); document.head = new Element('head'); document.createElement = () => new Element(); document.getElementById = $;
  document.currentScript = { src: 'https://example.test/js/playable-controls.js' }; document.hidden = false;
  const shell = $('gameShell'), canvas = $('gameCanvas'), video = $('performanceVideo');
  canvas.parentElement = shell; shell.parentElement = document.body; document.body.parentElement = document; document.parentElement = window;
  Object.assign(video, { readyState: 4, duration: 94.876735, currentTime: 0, paused: true, seeking: false, playbackRate: 1, play() { this.paused = false; return Promise.resolve(); }, pause() { this.paused = true; }, load() {} });
  $('timingMode').value = 'classic'; $('scrollSpeed').value = '1.8'; $('inputOffset').value = '0'; $('visualOffset').value = '0'; $('launchBtn').disabled = true;
  window.devicePixelRatio = 1;
  const context = { window, document, Element, URL, TextDecoder, console: { log: console.log, error: error => errors.push(String(error)) }, location: { protocol: 'https:' }, performance: { now: () => clock }, setTimeout: (fn, delay) => { timers.set(++timerId, { fn, due: clock + delay }); return timerId; }, clearTimeout: id => timers.delete(id), requestAnimationFrame: () => 1, cancelAnimationFrame() {}, localStorage: { getItem: () => null, setItem() {} }, Image: class extends Element { set src(value) { queueMicrotask(() => this.onload()); } }, PointerEvent: class { constructor(type, data) { Object.assign(this, { type, ...data }); } }, fetch: async url => ({ ok: true, arrayBuffer: async () => { const buffer = fixture(url.includes('HumanPerformance') ? 'performance.mid' : 'reference.mid'); return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength); } }) };
  vm.createContext(context);
  vm.runInContext(fixture('playable-controls.js').toString(), context, { filename: 'playable-controls.js' });
  vm.runInContext(fixture('midiParser.js').toString(), context, { filename: 'midiParser.js' }); context.TigerMidi = window.TigerMidi;
  // Export closure state only in this test VM; do not change the production source.
  const source = fs.readFileSync(gamePath, 'utf8').replace(/\}\)\(\);\s*$/, 'window.__test={hitLane,releaseLane,updateHolds,resetGameState,togglePause,notes:()=>notes,state:()=>({score,combo,holdsReleased,holdsCompleted,paused,resumePending,holds:[...activeHolds.values()].map(n=>({id:n.id,engaged:n.holdEngaged,resumeBy:n.resumeBy}))}),run:()=>{running=true;paused=false;video.paused=false;}};})();');
  vm.runInContext(source, context, { filename: gamePath }); await flush();
  const game = window.__test; assert.equal($('sourceBadge').textContent, 'SYNC LOCKED'); assert.deepEqual(errors, []); assert.equal(game.notes().length, 357);
  const pointer = (type, pointerId = 1, pointerType = 'touch', lane = 1) => canvas.dispatchEvent({ type, pointerId, pointerType, clientX: 120 + (lane + .5) * 190, clientY: 519, timeStamp: clock, bubbles: true });
  const startHold = () => { game.resetGameState(); game.run(); const note = game.notes().find(note => note.id === 66); video.currentTime = note.hitTime; pointer('pointerdown'); video.currentTime += .4; assert.equal(game.state().holds.length, 1); return note; };
  const tick = async milliseconds => { clock += milliseconds; for (const [id, timer] of [...timers]) if (timer.due <= clock) { timers.delete(id); timer.fn(); } await flush(); };
  return { game, window, document, video, pointer, startHold, tick, clock: () => clock };
}
const tests = [
  ['touch blur preserves the sustain before shared touch cancellation', async h => { h.startHold(); h.window.dispatchEvent({ type: 'blur' }); assert.equal(h.game.state().paused, true); assert.equal(h.game.state().holdsReleased, 0); assert.equal(h.game.state().holds.length, 1); assert.equal(h.game.state().holds[0].engaged, false); }],
  ['hidden document preserves the sustain', async h => { h.startHold(); h.document.hidden = true; h.document.dispatchEvent({ type: 'visibilitychange' }); assert.equal(h.game.state().paused, true); assert.equal(h.game.state().holdsReleased, 0); assert.equal(h.game.state().holds.length, 1); }],
  ['pagehide cancels input and pauses without an early release', async h => { h.startHold(); h.window.dispatchEvent({ type: 'pagehide' }); assert.equal(h.game.state().paused, true); assert.equal(h.game.state().holdsReleased, 0); assert.equal(h.game.state().holds.length, 1); }],
  ['direct pointercancel pauses without an early release', async h => { h.startHold(); h.pointer('pointercancel'); assert.equal(h.game.state().paused, true); assert.equal(h.game.state().holdsReleased, 0); }],
  ['unexpected capture loss pauses without an early release', async h => { h.startHold(); h.pointer('lostpointercapture'); assert.equal(h.game.state().paused, true); assert.equal(h.game.state().holdsReleased, 0); }],
  ['normal early pointerup still records an early release', async h => { h.startHold(); h.pointer('pointerup'); assert.equal(h.game.state().paused, false); assert.equal(h.game.state().holdsReleased, 1); assert.equal(h.game.state().holds.length, 0); }],
  ['normal pointerup near the tail still completes the hold', async h => { const note = h.startHold(); h.video.currentTime = note.endTime - .04; h.pointer('pointerup'); assert.equal(h.game.state().paused, false); assert.equal(h.game.state().holdsCompleted, 1); assert.equal(h.game.state().holdsReleased, 0); }],
  ['capture loss after pointerup does not pause or release twice', async h => { h.startHold(); h.pointer('pointerup'); h.pointer('lostpointercapture'); assert.equal(h.game.state().paused, false); assert.equal(h.game.state().holdsReleased, 1); }],
  ['unknown pointer cancellation does not pause a running game', async h => { h.game.run(); h.pointer('pointercancel', 99); assert.equal(h.game.state().paused, false); }],
  ['interrupted hold can resume, reengage, and complete once', async h => { const note = h.startHold(); h.window.dispatchEvent({ type: 'blur' }); h.game.togglePause(); await h.tick(2000); assert.equal(h.game.state().paused, false); h.pointer('pointerdown', 2); h.video.currentTime = note.endTime + .01; h.game.updateHolds(h.video.currentTime); h.pointer('pointerup', 2); assert.equal(h.game.state().holdsCompleted, 1); assert.equal(h.game.state().holdsReleased, 0); }],
  ['resume grace still expires when the sustain is not reengaged', async h => { h.startHold(); h.window.dispatchEvent({ type: 'blur' }); h.game.togglePause(); await h.tick(2000); h.video.currentTime += .61; h.game.updateHolds(h.video.currentTime); assert.equal(h.game.state().holdsReleased, 1); assert.equal(h.game.state().holdsCompleted, 0); }],
  ['keyboard repeats do not consume another cue', async h => { h.game.resetGameState(); h.game.run(); const first = h.game.notes()[0], second = h.game.notes()[1]; const key = (type, repeat = false) => h.window.dispatchEvent({ type, code: 'ArrowDown', key: 'ArrowDown', repeat, timeStamp: h.clock() }); h.video.currentTime = first.hitTime; key('keydown'); assert.equal(h.game.state().combo, 1); h.video.currentTime = second.hitTime; key('keydown', true); assert.equal(h.game.state().combo, 1); key('keyup'); key('keydown'); assert.equal(h.game.state().combo, 2); }],
];
(async () => { let failed = 0; for (const [name, run] of tests) { try { await run(await createGame()); console.log('PASS', name); } catch (error) { failed++; console.log('FAIL', name, '\n ', error.message); } } console.log(`${tests.length - failed}/${tests.length} passed`); process.exitCode = failed ? 1 : 0; })();
