'use strict';

// Portable generated-art integration checks, not a visual anatomy classifier.
// Run together with qa/motion-runtime.test.cjs; no browser or packages required.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const vm = require('node:vm');
const motion = require('../motion-runtime.js');
const gameDir = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(gameDir, 'gait-art-manifest.json'), 'utf8'));
const phases = ['contact-near', 'passing-near-support', 'contact-far', 'passing-far-support'];
const eightPhases = ['contact-near', 'compression-near', 'passing-near-support', 'flight-to-far', 'contact-far', 'compression-far', 'passing-far-support', 'flight-to-near'];
const normalizedQuarter = phase => ({
  'contact-near': 0, 'compression-near': 0,
  'passing-near-support': 1, 'flight-to-far': 1,
  'contact-far': 2, 'compression-far': 2,
  'passing-far-support': 3, 'flight-to-near': 3
})[phase];
const entryNames = ['index.html', 'BLACK_AND_GIFTED_DEMO.html'];
const plain = value => JSON.parse(JSON.stringify(value));
const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-9, `${message}: ${actual} != ${expected}`);
const position = (x, speed) => ({ x, vx: speed, grounded: true, scene: 6 });
const assetsByPath = new Map(manifest.assets.map(asset => [asset.path, asset]));
const entrypoints = entryNames.map(name => {
  const html = fs.readFileSync(path.join(gameDir, name), 'utf8');
  const start = html.indexOf('const frameSeq='), end = html.indexOf('const heroMotion=', start);
  assert.ok(start >= 0 && end > start, `${name}: real bank and plan declarations exist`);
  const context = vm.createContext({ window: {} });
  vm.runInContext(html.slice(start, end) + '\nglobalThis.result={banks:PLAYER_BANKS,plans:MOTION_PLANS,strides:MOTION_STRIDES};', context, { timeout: 1000 });
  for (const file of ['character-metrics.js', 'release-polish-metrics.js', 'release-polish-v3-metrics.js']) vm.runInContext(fs.readFileSync(path.join(gameDir, file), 'utf8'), context, { timeout: 1000 });
  return { name, html, ...plain(context.result), metrics: plain(context.window.BG_FRAME_METRICS) };
});

const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ value >>> 1 : value >>> 1;
  return value >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const value of bytes) crc = crcTable[(crc ^ value) & 255] ^ crc >>> 8;
  return (crc ^ 0xffffffff) >>> 0;
}
function decodeAlpha(buffer) {
  assert.ok(buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'PNG signature');
  let width, height, ended = false;
  const compressed = [];
  for (let offset = 8; offset < buffer.length;) {
    assert.ok(offset + 12 <= buffer.length, 'Complete PNG chunk header');
    const length = buffer.readUInt32BE(offset), end = offset + 8 + length;
    assert.ok(end + 4 <= buffer.length, 'Complete PNG chunk');
    const type = buffer.toString('ascii', offset + 4, offset + 8), data = buffer.subarray(offset + 8, end);
    assert.equal(crc32(buffer.subarray(offset + 4, end)), buffer.readUInt32BE(end), `${type} CRC`);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      assert.equal(data[8], 8, 'Reviewed PNGs use 8-bit channels');
      assert.equal(data[9], 6, 'Reviewed PNGs use real RGBA transparency');
      assert.equal(data[10], 0); assert.equal(data[11], 0); assert.equal(data[12], 0, 'Non-interlaced PNG');
    } else if (type === 'IDAT') compressed.push(data);
    else if (type === 'IEND') { ended = true; break; }
    offset = end + 4;
  }
  assert.ok(ended && width > 0 && height > 0 && compressed.length, 'Complete nonempty image');
  const stride = width * 4, raw = zlib.inflateSync(Buffer.concat(compressed), { maxOutputLength: (stride + 1) * height });
  assert.equal(raw.length, (stride + 1) * height, 'Decoded pixels agree with PNG dimensions');
  let prior = new Uint8Array(stride), left = width, top = height, right = -1, bottom = -1, solidPixels = 0, transparentPixels = 0;
  for (let y = 0; y < height; y++) {
    const offset = y * (stride + 1), filter = raw[offset], row = new Uint8Array(stride);
    assert.ok(filter >= 0 && filter <= 4, 'Valid PNG row filter');
    for (let byte = 0; byte < stride; byte++) {
      const a = byte >= 4 ? row[byte - 4] : 0, b = prior[byte], c = byte >= 4 ? prior[byte - 4] : 0;
      let predicted = 0;
      if (filter === 1) predicted = a;
      if (filter === 2) predicted = b;
      if (filter === 3) predicted = Math.floor((a + b) / 2);
      if (filter === 4) {
        const p = a + b - c, da = Math.abs(p - a), db = Math.abs(p - b), dc = Math.abs(p - c);
        predicted = da <= db && da <= dc ? a : db <= dc ? b : c;
      }
      row[byte] = (raw[offset + 1 + byte] + predicted) & 255;
    }
    for (let x = 0; x < width; x++) {
      const alpha = row[x * 4 + 3];
      if (alpha === 0) transparentPixels++;
      if (alpha <= 24) continue;
      solidPixels++; left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
    prior = row;
  }
  assert.ok(solidPixels > 0 && transparentPixels > 0, 'Visible sprite and truly transparent background pixels');
  return { width, height, solidPixels, transparentPixels, bounds: [left, top, right + 1, bottom + 1], margins: { left, top, right: width - right - 1, bottom: height - bottom - 1 } };
}

test('Generated-art manifest preserves baseline and standing-reference contracts', () => {
  assert.equal(manifest.version, 1);
  assert.equal(manifest.baselineCommit, 'dd9b6a95b745dc92795483252087e3529806a1a3');
  assert.deepEqual(manifest.standingReferences, { young: 186, crowned: 220, upgraded: 220 });
  assert.ok(typeof manifest.strideCalibration?.method === 'string' && manifest.strideCalibration.method.length > 0, 'Calibration records its measurement method');
  assert.equal(manifest.strideCalibration.zeroSlidingClaim, false, 'Numeric cadence checks are not a zero-sliding claim');
  assert.ok(manifest.assets.length > 0 && manifest.banks.length > 0);
  assert.equal(assetsByPath.size, manifest.assets.length, 'One authoritative record per image');
  assert.equal(new Set(manifest.banks.map(bank => `${bank.gender}/${bank.form}/${bank.state}`)).size, manifest.banks.length, 'No duplicate bank records');
  const referenced = new Set(manifest.banks.flatMap(bank => bank.frames));
  assert.deepEqual([...assetsByPath.keys()].sort(), [...referenced].sort(), 'Every selected original/generated key has exactly one pinned asset record; no unused accepted assets');
});

test('Both renderers retain 186/220 references and full-image anchor drawing', () => {
  for (const entry of entrypoints) {
    assert.match(entry.html, /const scale=m\?\(\(crowned\?220:186\)\/m\.height\)\*scepterJumpScale:stateScale;/, `${entry.name}: exact reviewed standing reference`);
    assert.match(entry.html, /ctx\.drawImage\(im,-\(m\?\.cx\?\?im\.width\/2\),-\(m\?\.feet\?\?im\.height\*\.925\)\);/, `${entry.name}: whole PNG rendered with its own anchors, without atlas cropping`);
  }
});

for (const asset of manifest.assets) test(`Pinned art and metric baseline: ${asset.path}`, t => {
  assert.ok(!path.isAbsolute(asset.path) && !asset.path.split('/').includes('..'), 'Repository-relative image path');
  assert.ok(['existing', 'generated'].includes(asset.origin), 'Explicit original/generated provenance');
  assert.match(asset.sha256, /^[0-9a-f]{64}$/);
  assert.ok(eightPhases.includes(asset.phase), 'Declared contact, compression, support, or flight phase');
  const bytes = fs.readFileSync(path.join(gameDir, asset.path));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), asset.sha256, 'Exact accepted PNG bytes');
  const image = decodeAlpha(bytes);
  // Hash and decoded row length pin dimensions without imposing a 512px grid.
  if (asset.width !== undefined) assert.equal(image.width, asset.width);
  if (asset.height !== undefined) assert.equal(image.height, asset.height);
  for (const [edge, pixels] of Object.entries(image.margins)) assert.ok(pixels > 2, `${edge} alpha>24 margin exceeds two pixels`);
  assert.ok(Number.isFinite(asset.metrics.height) && asset.metrics.height > 0, 'Reviewed resolution-normalization height');
  assert.ok(Number.isFinite(asset.metrics.cx) && asset.metrics.cx >= 0 && asset.metrics.cx <= image.width, 'Reviewed body-root horizontal anchor in canvas');
  assert.ok(Number.isFinite(asset.metrics.feet) && asset.metrics.feet >= 0 && asset.metrics.feet <= image.height, 'Reviewed ground anchor in canvas');
  for (const entry of entrypoints) assert.deepEqual(entry.metrics[asset.path], asset.metrics, `${entry.name}: exact approved metrics, not recalculated from crouch bbox`);
  if (asset.phase.startsWith('flight-')) {
    assert.equal(asset.flightClearanceLogicalPx, 4, 'Explicitly authored four-logical-pixel flight clearance');
    const uses = manifest.banks.filter(bank => bank.frames.includes(asset.path));
    assert.ok(uses.length > 0, 'Flight source is selected by a bank');
    for (const bank of uses) {
      const actualClearance = (asset.metrics.feet - image.bounds[3]) * manifest.standingReferences[bank.form] / asset.metrics.height;
      assert.ok(Math.abs(actualClearance - asset.flightClearanceLogicalPx) <= 1e-6, `${bank.gender}/${bank.form}: measured flight clearance ${actualClearance} matches the explicit authored ground plane`);
    }
  }
  if (asset.metrics.scepterGrip) {
    const grip = asset.metrics.scepterGrip;
    assert.ok(Number.isFinite(grip.x) && grip.x >= 0 && grip.x <= image.width, 'Reviewed source-space staff grip x');
    assert.ok(Number.isFinite(grip.y) && grip.y >= 0 && grip.y <= image.height, 'Reviewed source-space staff grip y');
    assert.ok(Number.isFinite(grip.rotation), 'Reviewed staff rotation');
    assert.ok(Number.isFinite(grip.scale) && grip.scale > 0, 'Reviewed staff source scale');
  }
  if (asset.identityReference) assert.ok(fs.existsSync(path.join(gameDir, asset.identityReference)), 'Identity reference remains available');
  t.diagnostic(`${image.width}x${image.height}; alpha>24 margins ${JSON.stringify(image.margins)}. Semantic/anatomical acceptance comes from art review, not this pixel test.`);
});

for (const bank of manifest.banks) {
  const label = `${bank.gender}/${bank.form}/${bank.state}`;
  test(`${label}: runtime bank and plan exactly map the reviewed semantic order`, () => {
    assert.ok(['male', 'female'].includes(bank.gender));
    assert.ok(['young', 'crowned', 'upgraded'].includes(bank.form));
    assert.ok(['walk', 'run'].includes(bank.state));
    assert.ok(Number.isFinite(bank.strideWorldUnits) && bank.strideWorldUnits > 0, 'Manifest records a positive calibrated world-unit stride');
    const expectedPhases = bank.frames.length === 8 ? eightPhases : phases;
    if (bank.frames.length === 8) {
      assert.equal(bank.gender, 'male', 'Eight-phase source proposal belongs to the royal male');
      assert.ok(['crowned', 'upgraded'].includes(bank.form), 'Eight-phase run uses the royal body');
      assert.equal(bank.state, 'run', 'Eight-phase schedule is a run');
      for (const [index, source] of [[0, '05'], [1, '06'], [3, '03'], [4, '01'], [5, '02'], [7, '04']]) assert.equal(bank.frames[index], `assets/release-polish-v2/male-run-${source}.png`, `Approved eight-key source position ${index}`);
    }
    assert.deepEqual(bank.phases, expectedPhases, 'Declared contact/support/flight order');
    assert.equal(bank.frames.length, expectedPhases.length, 'Four or eight distinct reviewed keys');
    assert.equal(new Set(bank.frames).size, expectedPhases.length, 'No duplicate filepath stands in for a missing key');
    assert.equal(new Set(bank.frames.map(file => assetsByPath.get(file)?.sha256)).size, expectedPhases.length, 'No byte-identical image stands in for a missing key');
    assert.deepEqual(bank.frames.map(file => assetsByPath.get(file)?.phase), bank.phases, 'Asset metadata agrees with bank phases');
    for (const entry of entrypoints) {
      const runtimeBank = entry.banks[bank.gender][bank.form][bank.state], plan = entry.plans[bank.gender][bank.form][bank.state];
      assert.equal(entry.strides[bank.gender][bank.form][bank.state], bank.strideWorldUnits, `${entry.name}: runtime cadence matches the reviewed manifest`);
      assert.deepEqual(runtimeBank, bank.frames, `${entry.name}: actual PNG bank`);
      assert.deepEqual(plan.map(index => runtimeBank[index - 1]), bank.frames, `${entry.name}: actual motion plan reaches exactly the reviewed order`);
    }
  });

  for (const fps of [30, 60, 120]) test(`${label}: actual runtime reaches every selected key in order at ${fps} fps`, () => {
    const speed = bank.state === 'run' ? 300 : 100, stride = bank.strideWorldUnits;
    for (const entry of entrypoints) {
      const runtime = motion.create(), plan = entry.plans[bank.gender][bank.form], runtimeBank = entry.banks[bank.gender][bank.form][bank.state];
      const profile = entry.strides[bank.gender][bank.form];
      let x = 150, last = null;
      const sequence = [], seen = new Set(), ticks = Math.ceil(2.2 * stride / speed * fps);
      for (let tick = 0; tick <= ticks; tick++) {
        const index = runtime.frame(plan, bank.state, 0, speed), file = runtimeBank[index], semantic = assetsByPath.get(file)?.phase;
        assert.ok(file && semantic, `${entry.name}: real bank file and declared phase at tick ${tick}`);
        seen.add(file);
        if (file !== last) { sequence.push(semantic); last = file; }
        const nextX = x + speed / fps;
        runtime.advance(position(x, speed), position(nextX, speed), 1 / fps, profile); x = nextX;
      }
      assert.deepEqual([...seen], bank.frames, `${entry.name}: every accepted PNG was selected`);
      assert.ok(sequence.length >= bank.frames.length * 2 + 1, `${entry.name}: at least two complete cycles plus wrap`);
      sequence.forEach((semantic, index) => assert.equal(semantic, bank.phases[index % bank.phases.length], `${entry.name}: chronological phase ${index}`));
      close(runtime.snapshot().distance, (ticks + 1) * speed / fps, `${entry.name}: gait remains displacement-driven`);
    }
  });
}

const pairs = manifest.banks.filter(bank => bank.state === 'walk').map(walk => ({ walk, run: manifest.banks.find(bank => bank.gender === walk.gender && bank.form === walk.form && bank.state === 'run') })).filter(pair => pair.run);
test('At least one integrated identity has both walk and run available for transition QA', () => assert.ok(pairs.length > 0));
for (const { walk, run } of pairs) for (const fps of [30, 60, 120]) test(`${walk.gender}/${walk.form}: walk/run transitions retain normalized gait quarter at ${fps} fps`, () => {
  // Half-quarter centers and epsilon samples on either side of each eighth
  // exercise both four-key and eight-key banks, including compression/flight.
  const samplePhases = Array.from({ length: 8 }, (_, eighth) => [eighth / 8 + .001, eighth / 8 + .0625, (eighth + 1) / 8 - .001]).flat();
  for (const entry of entrypoints) for (const initialPhase of samplePhases) {
    const runtime = motion.create(), plan = entry.plans[walk.gender][walk.form];
    const profile = entry.strides[walk.gender][walk.form];
    let x = 150, distance = initialPhase * walk.strideWorldUnits;
    runtime.advance(position(x, 100), position(x + distance, 100), distance / 100, profile); x += distance;
    const before = runtime.snapshot().phase;
    const walkPath = walk.frames[runtime.frame(plan, 'walk', 0, 100)], runPath = run.frames[runtime.frame(plan, 'run', 0, 300)];
    const walkQuarter = normalizedQuarter(assetsByPath.get(walkPath).phase), runQuarter = normalizedQuarter(assetsByPath.get(runPath).phase);
    assert.equal(walkQuarter, Math.floor(initialPhase * 4), `${entry.name}: walk is in the expected normalized quarter`);
    assert.equal(runQuarter, walkQuarter, `${entry.name}: state change preserves near/far gait progress at phase ${initialPhase}, despite different bank lengths`);
    close(runtime.snapshot().phase, before, 'Frame selection does not mutate gait');
    runtime.advance(position(x, 300), position(x + 300 / fps, 300), 1 / fps, profile); x += 300 / fps;
    close(runtime.snapshot().phase, (before + 300 / fps / run.strideWorldUnits) % 1, 'Calibrated run adds physical travel to the existing phase');
    const afterRun = runtime.snapshot().phase;
    runtime.advance(position(x, 100), position(x + 100 / fps, 100), 1 / fps, profile);
    close(runtime.snapshot().phase, (afterRun + 100 / fps / walk.strideWorldUnits) % 1, 'Returning to calibrated walk does not reinterpret accumulated distance');
  }
});
