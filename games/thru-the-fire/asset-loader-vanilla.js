// Browser image preloader
export async function preloadThruTheFireRooms(baseUrl = '') {
  const path = `${baseUrl}assets/games/thru-the-fire/manifests/room-views.json`;
  const rooms = await fetch(path).then(r => { if (!r.ok) throw new Error(`Failed to load ${path}`); return r.json(); });
  const loaded = {};
  await Promise.all(Object.entries(rooms).flatMap(([roomId, room]) => room.views.map(view => new Promise((resolve,reject) => {
    const img = new Image(); img.onload=()=>{loaded[`${roomId}:${view.degrees}`]=img;resolve();}; img.onerror=()=>reject(new Error(`Failed to load ${view.path}`)); img.src=`${baseUrl}${view.path}`;
  }))));
  return {rooms, loaded};
}
