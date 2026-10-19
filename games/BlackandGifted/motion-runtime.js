/* Distance-driven animation timing. This module never changes player physics. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BGMotion = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  const pick = (frames, progress) => frames[Math.min(frames.length - 1, Math.floor(clamp(progress, 0, .999999) * frames.length))] - 1;
  function create() {
    let phase = 0, airTime = 0, landTime = Infinity, grounded = true, speed = 0, distance = 0, travelDistance = 0, movingLanding = false;
    function reset(isGrounded = true) {
      phase = 0; airTime = 0; landTime = Infinity; grounded = isGrounded; speed = 0; distance = 0; travelDistance = 0; movingLanding = false;
    }
    function beginJump() { airTime = 0; landTime = Infinity; grounded = false; }
    function advance(before, after, dt, strideProfile) {
      if (!(dt > 0)) return;
      const dx = after.x - before.x;
      // Scene changes/test teleports must never turn into hundreds of footsteps.
      const continuous = before.scene === after.scene && Math.abs(dx) < Math.max(120, Math.abs(after.vx) * dt * 4);
      if (!continuous) { reset(after.grounded); return; }
      speed = continuous ? Math.abs(dx) / dt : 0;
      // The pack remains on the ground while following an airborne hero.
      // Its travel clock must not share the hero's grounded-only gait phase.
      travelDistance += Math.abs(dx);
      if (after.grounded) {
        if (!grounded) { landTime = 0; movingLanding = speed > 185; }
        else landTime += dt;
        airTime = 0;
        if (continuous && before.grounded) {
          const travelled = Math.abs(dx);
          // Preserve phase across gait/form changes. Runtime profiles are
          // calibrated to reviewed foot travel; standalone callers retain
          // the original cadence when no valid profile is supplied.
          const gait = speed > 185 ? 'run' : 'walk';
          const authoredStride = strideProfile?.[gait];
          const stride = Number.isFinite(authoredStride) && authoredStride > 0
            ? authoredStride : gait === 'run' ? 260 : 190;
          phase = (phase + travelled / stride) % 1;
          distance += travelled;
        }
      } else {
        airTime += dt;
        landTime = Infinity;
      }
      grounded = after.grounded;
    }
    function landingActive() { return grounded && landTime < (movingLanding ? .16 : .24); }
    function frame(plan, state, vy, currentSpeed) {
      if (state === 'jump') {
        if (plan.takeoff && airTime < .08) return pick(plan.takeoff, airTime / .08);
        if (plan.apex && Math.abs(vy) < 95) return pick(plan.apex, (vy + 95) / 190);
        if (vy < 0) return pick(plan.rise, (vy + 620) / 525);
        return pick(plan.fall, (vy - 95) / 480);
      }
      if (state === 'land') {
        // Lock the recovery chosen at contact; acceleration/deceleration must
        // not switch to a different sequence or rewind its progress halfway.
        const moving = movingLanding;
        return pick(moving && plan.landMoving ? plan.landMoving : plan.land, landTime / (moving ? .16 : .24));
      }
      return plan[state] ? pick(plan[state], phase) : null;
    }
    return { reset, beginJump, advance, frame, landingActive, snapshot: () => ({ phase, airTime, landTime, grounded, speed, distance, travelDistance }) };
  }
  return { create, pick };
});
