'use strict';

// Run with: node --test games/BlackandGifted/qa/motion-runtime.test.cjs
// No browser, third-party packages, or network access are required. This tests
// the shipped module AND the plans, assets, and physics in both HTML entrypoints.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const zlib = require('node:zlib');
const { execFileSync } = require('node:child_process');

const gameDir = path.resolve(__dirname, '..');
const repoDir = path.resolve(gameDir, '../..');
const motion = require('../motion-runtime.js');
const entryNames = ['index.html', 'BLACK_AND_GIFTED_DEMO.html'];
const entries = Object.fromEntries(entryNames.map(name => [name, fs.readFileSync(path.join(gameDir, name), 'utf8').replace(/\r\n/g, '\n')]));
const source = entries['index.html'];
const dt = 1 / 60;
const phaseNames = ['takeoff', 'rise', 'apex', 'fall'];
const jumpPlanNames = new Set([...phaseNames, 'land', 'landMoving']);
const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-9, `${message}: expected ${expected}, got ${actual}`);
const phaseClose = (actual, expected, message) => {
  const delta = Math.abs(actual - expected);
  assert.ok(Math.min(delta, Math.abs(delta - 1)) < 1e-9, `${message}: expected ${expected}, got ${actual}`);
};
const plain = value => JSON.parse(JSON.stringify(value));
const position = (x, vx, grounded = true, scene = 6) => ({ x, vx, grounded, scene });

function readPlans(html, filename) {
  const start = html.indexOf('const frameSeq=');
  const end = html.indexOf('const heroMotion=', start);
  assert.ok(start >= 0 && end > start, `${filename}: frameSeq and motion declarations exist`);
  const context = vm.createContext({});
  vm.runInContext(html.slice(start, end) + '\nglobalThis.result={PLAYER_BANKS,MOTION_PLANS,MOTION_STRIDES};', context, { filename, timeout: 1000 });
  return plain(context.result);
}
const dataByEntry = Object.fromEntries(entryNames.map(name => [name, readPlans(entries[name], name)]));
const { PLAYER_BANKS: banks, MOTION_PLANS: plans, MOTION_STRIDES: strideProfiles } = dataByEntry['index.html'];
const metricsContext = vm.createContext({ window: {} });
for (const name of ['character-metrics.js', 'release-polish-metrics.js', 'release-polish-v3-metrics.js']) {
  vm.runInContext(fs.readFileSync(path.join(gameDir, name), 'utf8'), metricsContext, { filename: name, timeout: 1000 });
}
const metrics = plain(metricsContext.window.BG_FRAME_METRICS);
const forms = Object.entries(plans).flatMap(([gender, byForm]) => Object.entries(byForm).map(([form, plan]) => ({ gender, form, plan, bank: banks[gender][form], name: `${gender}/${form}` })));

// Extract the real function, not a reimplementation of the game's equations.
function functionSource(html, name) {
  const start = html.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `Function ${name} exists`);
  // These named functions have no nested calls in their parameter defaults.
  // Start after the parameter list so opts={} is not mistaken for the body.
  let at = html.indexOf('{', html.indexOf(')', start)), depth = 0, quote = null;
  for (; at < html.length; at++) {
    const ch = html[at];
    if (quote) {
      if (ch === '\\') at++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '/' && html[at + 1] === '/') { at = html.indexOf('\n', at); continue; }
    if (ch === '/' && html[at + 1] === '*') { at = html.indexOf('*/', at + 2) + 1; continue; }
    if (ch === '{') depth++;
    if (ch === '}' && --depth === 0) return html.slice(start, at + 1);
  }
  throw new Error(`Unterminated function ${name}`);
}

function createGame(html = source, speed = 0, options = {}) {
  const runtime = motion.create();
  const events = [];
  const context = vm.createContext({
    P: { x: 150, y: 0, vx: speed, vy: 0, face: 1, grounded: true, crowned: options.crowned ?? true, upgraded: false },
    S: options.state || {}, keys: speed ? { ArrowRight: true } : {}, scene: options.scene ?? 6,
    spectator: null, wallBreakAction: null, paused: false, gameStarted: true,
    jumpBuffer: 0, coyoteTime: .09, landingPulse: 0, stepClock: 0,
    heroMotion: runtime, ground: () => 0,
    burst: (...args) => events.push(['burst', ...args]),
    soundAccent: (...args) => events.push(['sound', ...args]),
    spawnOpeningGift: () => {}, beginFaithLeap: () => false
  });
  const speedDeclaration = html.match(/const PLAYER_SPEED=\{[^;]+;/)?.[0];
  assert.ok(speedDeclaration, 'Actual speed and acceleration constants are present');
  vm.runInContext(speedDeclaration + '\n' + ['input', 'jump', 'physics'].map(name => functionSource(html, name)).join('\n'), context, { timeout: 1000 });
  return {
    context, runtime, events,
    step(timestep = dt) {
      const before = position(context.P.x, context.P.vx, context.P.grounded, context.scene);
      context.physics(timestep);
      runtime.advance(before, position(context.P.x, context.P.vx, context.P.grounded, context.scene), timestep);
      return { player: { ...context.P }, animation: runtime.snapshot() };
    }
  };
}

function createPoseSelector(html, gender, form, runtime) {
  const context = vm.createContext({
    HERO_READY: true, wallBreakAction: null, spectator: null, scene: 6, S: {}, t: 0, stepClock: 0,
    P: { x: 150, y: 0, grounded: true, upgraded: form === 'upgraded' },
    HERO_SETS: banks[gender], MOTION_PLANS: plans, playerGender: gender,
    heroMotion: runtime, motionFrame: (...args) => runtime.frame(...args)
  });
  // Keep the actual selection logic; return the draw request before canvas work.
  const selector = functionSource(html, 'drawHero').replace('const rel=frames[idx]||frames[0],im=HERO_IMG[rel];', 'return {state,idx,rel:frames[idx]||frames[0],form,speed};');
  assert.notEqual(selector, functionSource(html, 'drawHero'), 'Draw interception marker exists');
  vm.runInContext(selector, context);
  return {
    context,
    draw(vx = 0, vy = 0, opts = {}) { return plain(context.drawHero(context.P.x, context.P.y, form !== 'young', 1, vx, vy, 1, opts)); }
  };
}

function rgbaBounds(buffer, threshold) {
  const width = buffer.readUInt32BE(16), height = buffer.readUInt32BE(20);
  assert.equal(buffer[24], 8, '8-bit PNG');
  assert.equal(buffer[25], 6, 'RGBA PNG');
  assert.equal(buffer[28], 0, 'Non-interlaced PNG');
  const chunks = [];
  for (let offset = 8; offset < buffer.length;) {
    const size = buffer.readUInt32BE(offset), kind = buffer.toString('ascii', offset + 4, offset + 8);
    if (kind === 'IDAT') chunks.push(buffer.subarray(offset + 8, offset + 8 + size));
    offset += size + 12;
  }
  const raw = zlib.inflateSync(Buffer.concat(chunks)), stride = width * 4;
  assert.equal(raw.length, (stride + 1) * height);
  let prior = Buffer.alloc(stride), minX = width, maxX = -1, minY = height, maxY = -1;
  for (let y = 0; y < height; y++) {
    const offset = y * (stride + 1), filter = raw[offset], row = Buffer.alloc(stride);
    assert.ok(filter >= 0 && filter <= 4, 'Valid PNG filter');
    for (let byte = 0; byte < stride; byte++) {
      const left = byte >= 4 ? row[byte - 4] : 0, up = prior[byte], upperLeft = byte >= 4 ? prior[byte - 4] : 0;
      let prediction = 0;
      if (filter === 1) prediction = left;
      if (filter === 2) prediction = up;
      if (filter === 3) prediction = Math.floor((left + up) / 2);
      if (filter === 4) {
        const p = left + up - upperLeft, a = Math.abs(p - left), b = Math.abs(p - up), c = Math.abs(p - upperLeft);
        prediction = a <= b && a <= c ? left : b <= c ? up : upperLeft;
      }
      row[byte] = (raw[offset + 1 + byte] + prediction) & 255;
    }
    for (let x = 0; x < width; x++) if (row[x * 4 + 3] > threshold) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    prior = row;
  }
  assert.ok(maxX >= 0, 'PNG has visible pixels');
  return { left: minX, right: maxX + 1, top: minY, bottom: maxY + 1 };
}

test('Both entrypoints ship the same plans, banks, and correctly ordered runtime dependency', () => {
  assert.deepEqual(dataByEntry['BLACK_AND_GIFTED_DEMO.html'], dataByEntry['index.html']);
  for (const [name, html] of Object.entries(entries)) {
    const imports = [...html.matchAll(/<script\s+src="motion-runtime\.js"\s*>/g)];
    assert.equal(imports.length, 1, `${name}: one runtime script`);
    assert.ok(imports[0].index < html.indexOf('const heroMotion='), `${name}: runtime loads before use`);
    assert.match(functionSource(html, 'loadScene'), /heroMotion\.reset\(/, `${name}: scene loads reset animation`);
    assert.match(functionSource(html, 'jump'), /heroMotion\.beginJump\(\)/, `${name}: jumps reset takeoff time`);
    assert.match(functionSource(html, 'update'), /heroMotion\.advance\(/, `${name}: simulation updates animation`);
  }
});

test('Module runs in a browser global without CommonJS', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(gameDir, 'motion-runtime.js'), 'utf8'), context);
  assert.equal(typeof context.BGMotion.create, 'function');
  assert.equal(typeof context.BGMotion.pick, 'function');
});

test('Every inline script in both browser entrypoints parses, and their selection logic matches', () => {
  for (const [name, html] of Object.entries(entries)) {
    let count = 0;
    for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
      if (match[1].trim()) { new vm.Script(match[1], { filename: `${name}:inline-${++count}` }); }
    }
    assert.ok(count > 0, `${name}: inline scripts were checked`);
  }
  assert.equal(functionSource(entries['index.html'], 'drawHero'), functionSource(entries['BLACK_AND_GIFTED_DEMO.html'], 'drawHero'));
});

test('All six forms have nonempty, integer, in-range authored sequences', () => {
  assert.equal(forms.length, 6);
  for (const { name, plan, bank } of forms) {
    for (const state of ['walk', 'run', ...phaseNames, 'land', 'landMoving']) {
      assert.ok(Array.isArray(plan[state]) && plan[state].length, `${name}/${state}: sequence is present`);
      const frames = bank[jumpPlanNames.has(state) ? 'jump' : state];
      for (const frame of plan[state]) assert.ok(Number.isInteger(frame) && frame >= 1 && frame <= frames.length, `${name}/${state}: frame ${frame} resolves to its actual bank`);
    }
  }
});

test('Every referenced bank asset is a real PNG with a usable normalization metric', t => {
  const paths = [...new Set(Object.values(banks).flatMap(byForm => Object.values(byForm).flatMap(bank => Object.values(bank).flat())))];
  for (const relative of paths) {
    const absolute = path.join(gameDir, relative);
    assert.ok(fs.existsSync(absolute), `Missing bank asset ${relative}`);
    const buffer = fs.readFileSync(absolute);
    assert.ok(buffer.length > 24 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `Invalid PNG ${relative}`);
    const width = buffer.readUInt32BE(16), height = buffer.readUInt32BE(20), metric = metrics[relative];
    assert.ok(width > 0 && height > 0, `${relative}: image dimensions`);
    assert.ok(metric && Number.isFinite(metric.height) && metric.height > 0, `${relative}: normalized height`);
    assert.ok(Number.isFinite(metric.cx) && metric.cx >= 0 && metric.cx <= width, `${relative}: horizontal anchor`);
    assert.ok(Number.isFinite(metric.feet) && metric.feet >= 0 && metric.feet <= height, `${relative}: foot anchor`);
  }
  t.diagnostic(`${paths.length} unique bank PNGs and matching metrics verified`);
});

test('Legacy young run feet and centering retain their repaired alpha anchors', () => {
  for (const gender of ['male', 'female']) {
    // Retain this regression for the original eight-frame repair even when the
    // active bank uses separately reviewed, differently sized replacement art.
    const legacyPaths = Array.from({ length: 8 }, (_, index) => `assets/character-repair-v1/heroes/${gender}_uncrowned/run/run_${String(index + 1).padStart(2, '0')}.png`);
    const bounds = legacyPaths.map(relative => ({ relative, bounds: rgbaBounds(fs.readFileSync(path.join(gameDir, relative)), 24) }));
    const reference = Math.max(...bounds.map(({ bounds: b }) => b.bottom - b.top)) / .94;
    for (const { relative, bounds: b } of bounds) {
      assert.equal(metrics[relative].feet, b.bottom, `${relative}: feet exactly match alpha boundary`);
      assert.equal(metrics[relative].cx, (b.left + b.right) / 2, `${relative}: centered on visible body`);
      close(metrics[relative].height, reference, `${relative}: consistent run normalization`);
    }
  }
});

test('pick clamps sequence progress and returns zero-based indices', () => {
  assert.equal(motion.pick([2, 5, 9], -10), 1);
  assert.equal(motion.pick([2, 5, 9], 0), 1);
  assert.equal(motion.pick([2, 5, 9], .5), 4);
  assert.equal(motion.pick([2, 5, 9], 1), 8);
  assert.equal(motion.pick([2, 5, 9], 100), 8);
});

for (const speed of [100, 300]) {
  test(`Ground cadence follows actual ${speed}-unit/s displacement at 30, 60, and 120 fps`, () => {
    const stride = speed > 185 ? 260 : 190, duration = .9;
    for (const fps of [30, 60, 120]) {
      const runtime = motion.create();
      let x = 150;
      for (let frame = 0; frame < fps * duration; frame++) {
        const nextX = x + speed / fps;
        // Deliberately stale velocity: actual movement must control cadence.
        runtime.advance(position(x, 900), position(nextX, 900), 1 / fps);
        x = nextX;
      }
      const snapshot = runtime.snapshot();
      close(snapshot.distance, speed * duration, `${fps} fps distance`);
      close(snapshot.speed, speed, `${fps} fps measured speed`);
      phaseClose(snapshot.phase, speed * duration / stride % 1, `${fps} fps stride phase`);
    }
  });
}

test('Walk/run transitions preserve phase rather than reinterpreting accumulated distance', () => {
  const runtime = motion.create();
  runtime.advance(position(150, 100), position(245, 100), .95);
  close(runtime.snapshot().phase, .5, 'Half walk cycle');
  runtime.advance(position(245, 300), position(260, 300), .05);
  close(runtime.snapshot().phase, .5 + 15 / 260, 'Run follows current phase');
  runtime.advance(position(260, 100), position(265, 100), .05);
  close(runtime.snapshot().phase, .5 + 15 / 260 + 5 / 190, 'Walk resumes current phase');
});

for (const gait of ['walk', 'run']) test(`Invalid ${gait} stride values safely retain the standalone default`, () => {
  const speed = gait === 'run' ? 300 : 100, fallback = gait === 'run' ? 260 : 190;
  const otherGait = gait === 'run' ? 'walk' : 'run';
  const invalidValues = [undefined, null, 0, -1, NaN, Infinity, -Infinity, '130', true, [], {}];
  const profiles = [undefined, null, {}, ...invalidValues.map(value => Object.freeze({ [gait]: value, [otherGait]: 123 }))];
  for (const profile of profiles) {
    const runtime = motion.create();
    const before = Object.freeze(position(150, speed)), after = Object.freeze(position(150 + speed * .1, speed));
    runtime.advance(before, after, .1, profile);
    close(runtime.snapshot().phase, speed * .1 / fallback, `${gait}: invalid selected field uses ${fallback}`);
    close(runtime.snapshot().distance, speed * .1, 'Invalid profile never changes physical travel accounting');
    assert.ok(Number.isFinite(runtime.snapshot().phase), 'Fallback phase is finite');
  }
});

for (const [entryName, html] of Object.entries(entries)) for (const { gender, form, name } of forms) {
  test(`${entryName}: actual update wrapper selects ${name} stride profile and preserves simulation output`, () => {
    const profiles = dataByEntry[entryName].MOTION_STRIDES;
    for (const speed of [100, 300]) for (const fps of [30, 60, 120]) {
      const runtime = motion.create(), calls = [], timestep = 1 / fps;
      const player = { x: 150, y: 42, vx: speed, vy: 0, grounded: true, crowned: form !== 'young', upgraded: form === 'upgraded' };
      let simulationCalls = 0;
      const context = vm.createContext({
        P: player, scene: 6, playerGender: gender, MOTION_STRIDES: profiles, stepClock: -1,
        heroMotion: { advance(...args) { calls.push(args); runtime.advance(...args); }, snapshot: runtime.snapshot },
        updateSimulation(dt) { simulationCalls++; close(dt, timestep, 'Wrapper forwards exact simulation dt'); player.x += speed * dt; }
      });
      vm.runInContext(functionSource(html, 'update'), context, { timeout: 1000 });
      const ticks = fps * .5;
      for (let tick = 0; tick < ticks; tick++) {
        const oldX = player.x;
        context.update(timestep);
        const call = calls.at(-1);
        assert.deepEqual(plain(call[0]), position(oldX, speed), 'Wrapper captures the pre-simulation position');
        assert.deepEqual(plain(call[1]), position(player.x, speed), 'Wrapper captures the post-simulation position');
        close(call[2], timestep, 'Wrapper forwards exact animation dt');
        assert.strictEqual(call[3], profiles[gender][form], 'Correct gender/form profile object reaches the real runtime');
        close(context.stepClock, runtime.snapshot().travelDistance, 'Panther clock still follows full travel');
      }
      const gait = speed > 185 ? 'run' : 'walk';
      phaseClose(runtime.snapshot().phase, speed * .5 / profiles[gender][form][gait] % 1, 'Calibrated actual-wrapper phase');
      close(runtime.snapshot().distance, speed * .5, 'Wrapper preserves measured distance');
      assert.equal(simulationCalls, ticks, 'Simulation runs exactly once per update');
      const { x, ...rest } = player;
      close(x, 150 + speed * .5, 'Simulation displacement is unchanged');
      assert.deepEqual(rest, { y: 42, vx: speed, vy: 0, grounded: true, crowned: form !== 'young', upgraded: form === 'upgraded' }, 'Animation wrapper never edits the simulation state');
    }
  });
}

test('Actual update wrapper changes gender/form profiles without resetting gait or reusing a stale profile', () => {
  for (const [entryName, html] of Object.entries(entries)) {
    const runtime = motion.create(), profiles = dataByEntry[entryName].MOTION_STRIDES, calls = [];
    const player = { x: 150, vx: 100, grounded: true, crowned: false, upgraded: false };
    const context = vm.createContext({
      P: player, scene: 6, playerGender: 'male', MOTION_STRIDES: profiles, stepClock: 0,
      heroMotion: { advance(...args) { calls.push(args); runtime.advance(...args); }, snapshot: runtime.snapshot },
      updateSimulation(dt) { player.x += 100 * dt; }
    });
    vm.runInContext(functionSource(html, 'update'), context);
    context.update(.1);
    const firstPhase = runtime.snapshot().phase;
    context.updateSimulation = dt => { player.x += 100 * dt; player.crowned = true; player.upgraded = true; };
    context.update(.1);
    assert.strictEqual(calls.at(-1)[3], profiles.male.upgraded, 'Form change during simulation selects the new form');
    phaseClose(runtime.snapshot().phase, (firstPhase + 10 / profiles.male.upgraded.walk) % 1, 'Form change preserves accumulated phase');
    const secondPhase = runtime.snapshot().phase;
    context.updateSimulation = dt => { player.x += 100 * dt; context.playerGender = 'female'; player.crowned = false; };
    context.update(.1);
    assert.strictEqual(calls.at(-1)[3], profiles.female.young, 'Uncrowned form wins even if the upgraded flag is stale');
    phaseClose(runtime.snapshot().phase, (secondPhase + 10 / profiles.female.young.walk) % 1, 'Gender/form change preserves accumulated phase');
    close(context.stepClock, 30, 'Profile changes never reset continuous pack distance');
  }
});

test('Collision and airborne travel never advance the hero grounded gait', () => {
  const runtime = motion.create();
  runtime.advance(position(150, 100), position(160, 100), .1);
  const initial = runtime.snapshot();
  for (let frame = 0; frame < 120; frame++) runtime.advance(position(160, 300), position(160, 300), dt);
  close(runtime.snapshot().phase, initial.phase, 'Nonzero velocity against a wall');
  close(runtime.snapshot().distance, initial.distance, 'Collision distance');
  runtime.beginJump();
  let x = 160;
  for (let frame = 0; frame < 45; frame++) {
    runtime.advance(position(x, 300, false), position(x + 5, 300, false), dt);
    x += 5;
  }
  close(runtime.snapshot().phase, initial.phase, 'Airborne phase');
  close(runtime.snapshot().distance, initial.distance, 'Airborne distance');
  runtime.advance(position(x, 300, false), position(x + 5, 300, true), dt);
  close(runtime.snapshot().phase, initial.phase, 'Landing does not count flight travel');
  assert.equal(runtime.landingActive(300), true);
});

test('Direction reversal advances forward through the cycle without canceling distance', () => {
  const runtime = motion.create();
  runtime.advance(position(150, 100), position(169, 100), .19);
  runtime.advance(position(169, -100), position(150, -100), .19);
  close(runtime.snapshot().phase, .2, 'Two opposite 19-unit walks');
  close(runtime.snapshot().distance, 38, 'Absolute physical travel');
});

test('Scene and position discontinuities reset stale gait, airborne, and landing state', () => {
  for (const mode of ['teleport', 'scene']) {
    const runtime = motion.create();
    runtime.advance(position(150, 100), position(169, 100), .19);
    runtime.beginJump();
    runtime.advance(position(169, 100, false), position(174, 100, false), .05);
    runtime.advance(position(174, 100, false), position(mode === 'teleport' ? 900 : 179, 100, true, mode === 'scene' ? 7 : 6), dt);
    assert.deepEqual(runtime.snapshot(), { phase: 0, airTime: 0, landTime: Infinity, grounded: true, speed: 0, distance: 0, travelDistance: 0 }, mode);
    assert.equal(runtime.landingActive(0), false, `${mode}: no false landing`);
  }
});

test('Explicit reset and beginJump clear stale timers and repeated jumps replay takeoff', () => {
  const runtime = motion.create();
  runtime.advance(position(150, 100), position(169, 100), .19);
  runtime.beginJump();
  runtime.advance(position(169, 100, false), position(174, 100, false), .05);
  runtime.advance(position(174, 100, false), position(179, 100, true), dt);
  assert.equal(runtime.landingActive(0), true);
  runtime.beginJump();
  assert.equal(runtime.snapshot().airTime, 0);
  assert.equal(runtime.snapshot().landTime, Infinity);
  assert.equal(runtime.landingActive(0), false);
  for (const { plan } of forms) assert.equal(runtime.frame(plan, 'jump', -620, 100), plan.takeoff[0] - 1);
  runtime.reset(false);
  assert.deepEqual(runtime.snapshot(), { phase: 0, airTime: 0, landTime: Infinity, grounded: false, speed: 0, distance: 0, travelDistance: 0 });
  runtime.reset();
  assert.equal(runtime.snapshot().grounded, true);
});

test('Animation API does not mutate physics snapshots and zero/negative dt is a no-op', () => {
  const runtime = motion.create();
  const before = Object.freeze(position(150, 100)), after = Object.freeze(position(160, 100));
  runtime.advance(before, after, .1);
  assert.deepEqual(before, position(150, 100));
  assert.deepEqual(after, position(160, 100));
  const snapshot = runtime.snapshot();
  runtime.advance(before, after, 0);
  runtime.advance(before, after, -1);
  assert.deepEqual(runtime.snapshot(), snapshot);
});

for (const { name, plan, bank } of forms) {
  test(`${name}: actual drawHero uses measured speed, continues deceleration steps, and renders landing`, () => {
    const [gender, form] = name.split('/');
    for (const [entry, html] of Object.entries(entries)) {
      const runtime = motion.create(), selector = createPoseSelector(html, gender, form, runtime);
      runtime.advance(position(150, 300), position(150, 300), dt);
      assert.equal(selector.draw(300).state, 'idle', `${entry}: zero displacement overrides stale running velocity`);
      runtime.advance(position(150, 300), position(150.1, 300), dt);
      assert.equal(selector.draw(300).state, 'walk', `${entry}: six units/s still steps during deceleration`);
      runtime.advance(position(150.1, 0), position(155.1, 0), dt);
      assert.equal(selector.draw(0).state, 'run', `${entry}: actual fast movement selects run despite stale zero velocity`);
      runtime.beginJump();
      selector.context.P.grounded = false;
      const jump = selector.draw(300, -620);
      assert.equal(jump.state, 'jump', `${entry}: airborne state`);
      assert.equal(jump.idx, plan.takeoff[0] - 1, `${entry}: authored takeoff`);
      runtime.advance(position(155.1, 300, false), position(160.1, 300, true), dt);
      selector.context.P.grounded = true;
      const landing = selector.draw(0, 0);
      assert.equal(landing.state, 'land', `${entry}: landing overrides locomotion at contact`);
      assert.equal(landing.idx, plan.landMoving[0] - 1, `${entry}: moving landing uses actual speed`);
      assert.equal(landing.rel, bank.jump[landing.idx], `${entry}: landing uses jump bank`);
      assert.equal(selector.draw(0, 0, { state: 'run', frameIndex: 4 }).idx, Math.min(4, bank.run.length - 1), `${entry}: QA pose override still works and clamps to the active bank`);
      for (let tick = 0; tick < 20; tick++) runtime.advance(position(160.1, 0), position(160.1, 0), dt);
      assert.equal(selector.draw(0).state, 'idle', `${entry}: recovery returns to ordinary idle`);
    }
  });

  test(`${name}: the actual 60 fps jump reaches every takeoff/rise/apex/fall pose`, t => {
    const game = createGame(source, 300);
    game.context.jump();
    assert.equal(game.context.P.vy, -620, 'Actual jump impulse remains -620');
    const seen = Object.fromEntries(phaseNames.map(phase => [phase, new Set()]));
    const orderedPhases = [];
    const frameRecords = [];
    let lowestY = 0, landed = false;
    for (let tick = 0; tick < 120; tick++) {
      const { player, animation } = game.step();
      lowestY = Math.min(lowestY, player.y);
      if (player.grounded) { landed = true; break; }
      const index = game.runtime.frame(plan, 'jump', player.vy, Math.abs(player.vx));
      assert.ok(Number.isInteger(index) && bank.jump[index], `Tick ${tick}: valid actual bank index ${index}`);
      const matches = phaseNames.filter(phase => plan[phase].includes(index + 1));
      assert.equal(matches.length, 1, `Tick ${tick}: an unambiguous authored airborne phase`);
      const phase = matches[0];
      if (orderedPhases.at(-1) !== phase) orderedPhases.push(phase);
      seen[phase].add(index + 1);
      frameRecords.push({ phase, index, vy: player.vy, time: animation.airTime });
      close(animation.distance, 0, 'Airborne gait distance remains zero');
    }
    assert.equal(landed, true, 'Actual physics lands within two seconds');
    assert.deepEqual(orderedPhases, phaseNames, 'Airborne phases are chronological');
    for (const phase of phaseNames) assert.deepEqual([...seen[phase]], [...new Set(plan[phase])], `${phase}: every authored pose is reached at 60 fps`);
    assert.ok(lowestY < -120 && lowestY > -140, `Meaningful unaltered jump height ${-lowestY}`);
    assert.ok(frameRecords.length >= 49 && frameRecords.length <= 52, `Expected ~0.85 s flight, got ${frameRecords.length} airborne ticks`);
    assert.ok(frameRecords.filter(frame => frame.phase === 'apex').some(frame => frame.vy < 0), 'Apex covers late ascent');
    assert.ok(frameRecords.filter(frame => frame.phase === 'apex').some(frame => frame.vy >= 0), 'Apex covers early descent');
    assert.ok(frameRecords.filter(frame => frame.phase === 'fall').every(frame => frame.vy >= 95), 'Fall poses begin after apex');
    assert.equal(game.runtime.landingActive(300), true, 'Moving landing begins at contact');
    t.diagnostic(`${frameRecords.length} airborne ticks; peak ${(-lowestY).toFixed(2)}; poses ${JSON.stringify(Object.fromEntries(Object.entries(seen).map(([phase, indices]) => [phase, [...indices]])))}`);
  });

  for (const speed of [0, 300]) {
    test(`${name}: ${speed ? 'moving' : 'stationary'} landing plays its entire authored recovery then expires`, () => {
      const runtime = motion.create(), sequence = speed > 185 ? plan.landMoving : plan.land;
      runtime.beginJump();
      runtime.advance(position(150, speed, false), position(150 + speed * dt, speed, true), dt);
      const seen = [], duration = speed > 185 ? .16 : .24;
      let elapsed = 0, x = 150 + speed * dt;
      while (runtime.landingActive(speed)) {
        const index = runtime.frame(plan, 'land', 0, speed);
        assert.ok(bank.jump[index], `Valid landing index ${index}`);
        if (seen.at(-1) !== index + 1) seen.push(index + 1);
        runtime.advance(position(x, speed), position(x + speed * dt, speed), dt);
        x += speed * dt;
        elapsed += dt;
        assert.ok(elapsed < .5, 'Landing is bounded');
      }
      assert.deepEqual(seen, sequence, 'All recovery poses play in order');
      assert.ok(elapsed >= duration && elapsed < duration + dt + 1e-9, `Landing expires after ${duration}s`);
    });
  }
}

test('Actual opening-wall collision stops physical movement and gait', () => {
  const game = createGame(source, 300, { scene: 0, crowned: false, state: { walls: [300], wallWidth: 220, wallDrop: [1] } });
  for (let tick = 0; tick < 20; tick++) game.step();
  const stopped = { player: { ...game.context.P }, animation: game.runtime.snapshot() };
  close(stopped.player.x, 162, 'Visible wall collision location');
  close(stopped.player.vx, 0, 'Wall removes positive velocity');
  for (let tick = 0; tick < 120; tick++) game.step();
  close(game.runtime.snapshot().distance, stopped.animation.distance, 'Continued right input does not cause footsteps');
  close(game.runtime.snapshot().phase, stopped.animation.phase, 'No animation drift against the wall');
});

for (const [entryName, html] of Object.entries(entries)) {
  test(`${entryName}: the grounded panther pack keeps cycling during the hero jump`, () => {
    const game = createGame(html, 300);
    const drawCalls = [];
    const draw = vm.createContext({ stepClock: 0, drawCleanPanther: (...args) => drawCalls.push(args) });
    vm.runInContext(functionSource(html, 'drawPantherSprite'), draw);
    assert.match(functionSource(html, 'update'), /stepClock=heroMotion\.snapshot\(\)\.travelDistance/, 'Pack clock uses continuous travel rather than hero grounded gait');
    const runSource = functionSource(html, 'drawRun');
    assert.match(runSource, /targetX=P\.x-pan\.o/, 'A joined pack member follows hero horizontal position');
    assert.match(runSource, /drawPantherSprite\(px,runY\(px\)/, 'Pack remains on terrain during hero flight');
    game.context.jump();
    const start = game.context.P.x, selectedFrames = new Set();
    let lastX = start;
    for (let tick = 0; tick < 45; tick++) {
      const { player, animation } = game.step();
      assert.equal(player.grounded, false, 'Hero is still airborne');
      close(animation.distance, 0, 'Hero grounded gait is frozen');
      close(animation.travelDistance, player.x - start, 'Pack phase follows actual continuous horizontal travel');
      draw.stepClock = animation.travelDistance;
      draw.drawPantherSprite(player.x - 120, 0, 1, 0, false, 1);
      const call = drawCalls.at(-1);
      assert.equal(call[0], 'run');
      close(call[2], player.x - 120, 'Grounded panther travels with the pack');
      assert.ok(player.x > lastX, 'Hero and joined panther continue forward');
      selectedFrames.add(call[1]);
      lastX = player.x;
    }
    assert.equal(selectedFrames.size, 8, 'All eight selected panther run poses advance during the jump');
  });
}

test('Landing recovery stays latched through acceleration and deceleration', () => {
  for (const { name, plan } of forms) for (const initialSpeed of [0, 300]) {
    const reference = motion.create(), changing = motion.create();
    for (const runtime of [reference, changing]) {
      runtime.beginJump();
      runtime.advance(position(0, initialSpeed, false), position(initialSpeed * dt, initialSpeed, true), dt);
    }
    let x = initialSpeed * dt;
    for (let tick = 0; tick < 18; tick++) {
      const newSpeed = initialSpeed ? Math.max(0, 300 - tick * 40) : Math.min(300, tick * 40);
      assert.equal(changing.landingActive(newSpeed), reference.landingActive(initialSpeed), `${name}: recovery duration is fixed at contact`);
      if (changing.landingActive(newSpeed)) assert.equal(changing.frame(plan, 'land', 0, newSpeed), reference.frame(plan, 'land', 0, initialSpeed), `${name}: recovery cannot rewind or change banks`);
      reference.advance(position(x, initialSpeed), position(x + initialSpeed * dt, initialSpeed), dt);
      changing.advance(position(x, newSpeed), position(x + newSpeed * dt, newSpeed), dt);
      x += newSpeed * dt;
    }
  }
});

test('Both entrypoints preserve production movement, gravity, jump, and collision equations', () => {
  // The checked-in fixture is portable, including in a shallow review checkout.
  // An explicit revision override must exist; failed retrieval fails this test.
  const base = process.env.BG_MOTION_BASE_REF;
  const baseline = (base
    ? execFileSync('git', ['show', `${base}:games/BlackandGifted/index.html`], { cwd: repoDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    : fs.readFileSync(path.join(__dirname, 'fixtures/motion-physics-baseline.js'), 'utf8')).replace(/\r\n/g, '\n');
  const stripAnimation = text => text.replace(/heroMotion\.beginJump\(\);/g, '').replace(/stepClock\+=Math\.abs\(P\.vx\)\*dt;/g, '');
  for (const [name, html] of Object.entries(entries)) {
    assert.equal(html.match(/const PLAYER_SPEED=\{[^;]+;/)?.[0], baseline.match(/const PLAYER_SPEED=\{[^;]+;/)?.[0], `${name}: all speed and acceleration constants are unchanged`);
    for (const fn of ['input', 'jump', 'physics']) assert.equal(stripAnimation(functionSource(html, fn)), stripAnimation(functionSource(baseline, fn)), `${name}: ${fn} differs only in animation bookkeeping`);
    assert.equal(functionSource(html, 'updateSimulation').replace('function updateSimulation(', 'function update('), functionSource(baseline, 'update'), `${name}: all scene simulation and camera equations are unchanged`);
    const original = createGame(baseline, 0), patched = createGame(html, 0);
    for (let tick = 0; tick < 240; tick++) {
      for (const game of [original, patched]) {
        game.context.keys.ArrowRight = tick < 80 || tick >= 170;
        game.context.keys.ArrowLeft = tick >= 80 && tick < 130;
        if ([3, 95, 180].includes(tick)) game.context.jump();
        game.step();
      }
      assert.deepEqual({ ...patched.context.P }, { ...original.context.P }, `${name}: identical player state at tick ${tick}`);
    }
    assert.deepEqual(patched.events, original.events, `${name}: identical landing sound and particle events`);
  }
});
