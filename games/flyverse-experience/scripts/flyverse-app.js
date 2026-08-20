window.addEventListener('DOMContentLoaded', () => {
  try {
    const canvas = document.getElementById('flyverse-canvas');
    if (!canvas || !window.FLYVERSE_DATA || !window.FlyverseEngine || !window.FlyverseUI) {
      throw new Error('Flyverse files did not load');
    }
    const engine = new FlyverseEngine(canvas, FLYVERSE_DATA);
    new FlyverseUI(engine, FLYVERSE_DATA);
    engine.reset();
  } catch (err) {
    console.error(err);
    document.body.innerHTML = `<div style="padding:40px;color:white;background:#02040a;min-height:100vh;font-family:system-ui"><h1>2Fly Universe could not start</h1><p>${String(err.message || err)}</p></div>`;
  }
});
