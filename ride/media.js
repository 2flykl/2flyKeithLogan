// Paths are relative to ride/index.html. Keep this playlist in this order.
window.RIDE_MEDIA = {
  // Continuous 3D scenery is the default. No footage is required.
  environment: { mode: 'procedural' },
  tracks: [
    { id: 'away', title: 'I Was Away', audio: 'assets/away.mp3', artwork: 'assets/away.png' },
    { id: 'streams', title: 'Streams', audio: 'assets/streams.mp3', artwork: 'assets/streams.png' },
    { id: 'gettin', title: 'Gettin It', audio: 'assets/gettin.mp3', artwork: 'assets/gettin.png' },
    { id: 'guns', title: 'Guns and Butter', audio: 'assets/guns.mp3', artwork: null },
    { id: 'beautiful-mind', title: 'Beautiful Mind', album: 'Artificial Love', audio: '../assets/music/artificial-love/01-beautiful-mind.mp3', artwork: '../assets/music/artificial-love/cover.png' },
    { id: 'i-love-your-smile', title: 'I Love Your Smile', album: 'Artificial Love', audio: '../assets/music/artificial-love/02-i-love-your-smile.mp3', artwork: '../assets/music/artificial-love/cover.png' },
    { id: 'always-check-for-you', title: 'AlwaysCheckForYou', album: 'Artificial Love', audio: '../assets/music/artificial-love/03-always-check-for-you.mp3', artwork: '../assets/music/artificial-love/cover.png' },
    { id: 'cherish', title: 'Cherish3', album: 'Artificial Love', audio: '../assets/music/artificial-love/04-cherish.mp3', artwork: '../assets/music/artificial-love/cover.png' },
    { id: 'caint-hide-that', title: "Cain't Hide That", album: 'Artificial Love', audio: '../assets/music/artificial-love/05-caint-hide-that.mp3', artwork: '../assets/music/artificial-love/cover.png' },
    { id: 'ambitionz-az-a-lover', title: 'AmbitionzAzALover', album: 'Artificial Love', audio: '../assets/music/artificial-love/06-ambitionz-az-a-lover.mp3', artwork: '../assets/music/artificial-love/cover.png' },
    { id: 'heavy-on-my-mind', title: 'Heavy On My Mind', album: 'Artificial Love', audio: '../assets/music/artificial-love/07-heavy-on-my-mind.mp3', artwork: '../assets/music/artificial-love/cover.png' },
    { id: 'infinite-love', title: 'Infinite Love', album: 'Artificial Love', audio: '../assets/music/artificial-love/08-infinite-love.mp3', artwork: '../assets/music/artificial-love/cover.png' }
  ],
  // Add silent, forward-facing road footage here. Never attach songs to videos.
  // { src: 'assets/roads/01.mp4', label: 'Youngstown, Ohio', position: '50% 50%' }
  roads: [],
  roadPoster: null
};
