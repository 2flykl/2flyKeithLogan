// Phaser 3 helper
export async function loadThruTheFireAssets(scene, baseUrl = '') {
  const url = `${baseUrl}assets/games/thru-the-fire/manifests/room-views.json`;
  const rooms = await fetch(url).then(r => { if (!r.ok) throw new Error(`Failed to load room manifest: ${r.status}`); return r.json(); });
  for (const [roomId, room] of Object.entries(rooms)) {
    for (const view of room.views) {
      scene.load.image(`ttf-room-${roomId}-${String(view.degrees).padStart(3,'0')}`, `${baseUrl}${view.path}`);
    }
  }
  return rooms;
}
