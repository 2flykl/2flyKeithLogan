const test = require('node:test');
const assert = require('node:assert/strict');
const { cues, sources, cueAt } = require('../js/site-africa-cinema-notes.js');
const durations = [105.744,129.544,131.471,81.367,95.1,163.306,96.154,199.808,146.2,207.052];

test('100 unique notes have valid sources and fit their chapter without overlapping', () => {
  assert.equal(cues.length, 10);
  const text = new Set();
  cues.forEach((chapter, i) => {
    assert.equal(chapter.length, 10);
    chapter.forEach((cue, j) => {
      assert.ok(cue.at >= 0 && cue.until <= durations[i]);
      assert.ok(Math.abs(cue.until - cue.at - 5.3) < .001);
      if (j) assert.ok(cue.at - chapter[j-1].until >= .49, `overlap in chapter ${i}`);
      assert.ok(!text.has(cue.text));
      text.add(cue.text);
      if (cue.kind === 'context') assert.equal(new URL(sources[cue.source][1]).protocol, 'https:');
      else assert.equal(cue.evidenceAt, cue.at);
    });
  });
  assert.equal(text.size,100);
});

test('clock lookup handles pause, gaps, seeks, replay and chapter boundaries without a loop', () => {
  cues.forEach((chapter, i) => {
    assert.equal(cueAt(i,0),null);
    chapter.forEach(cue => {
      assert.equal(cueAt(i,cue.at),cue);
      assert.equal(cueAt(i,cue.at+2),cue);
      assert.equal(cueAt(i,cue.at+2),cue); // unchanged media clock while paused
      assert.equal(cueAt(i,cue.until),null);
    });
    assert.equal(cueAt(i,durations[i]+30),null);
    assert.equal(cueAt(i,chapter[0].at),chapter[0]); // deliberate rewind
  });
  assert.equal(cueAt(99,5),null);
  assert.equal(cueAt(0,NaN),null);
});
