// Paths are relative to ride/index.html. Keep this playlist in this order.
window.RIDE_MEDIA = {
  // Continuous 3D scenery is the default. No footage is required.
  environment: { mode: 'procedural' },
  tracks: [
    { id: 'away', title: 'I Was Away', audio: 'assets/away.mp3', artwork: 'assets/away.png' },
    { id: 'streams', title: 'Streams', audio: 'assets/streams.mp3', artwork: 'assets/streams.png' },
    { id: 'gettin', title: 'Gettin It', audio: 'assets/gettin.mp3', artwork: 'assets/gettin.png' },
    { id: 'guns', title: 'Guns and Butter', audio: 'assets/guns.mp3', artwork: null }
  ],
  // Add silent, forward-facing road footage here. Never attach songs to videos.
  // { src: 'assets/roads/01.mp4', label: 'Youngstown, Ohio', position: '50% 50%' }
  roads: [],
  roadPoster: null
};
