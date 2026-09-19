// FlyZone deployment configuration.
// Reuse the existing Render-hosted studio clips; no duplicate video downloads.
window.FLYZONE_CONFIG = window.FLYZONE_CONFIG || {
  videoSources: [
    'https://twofly-final-beta.onrender.com/studio/videos/idle-neutral.mp4',
    'https://twofly-final-beta.onrender.com/studio/videos/idle-spin.mp4',
    'https://twofly-final-beta.onrender.com/studio/videos/idle-side-glance.mp4',
    'https://twofly-final-beta.onrender.com/studio/videos/idle-adjust.mp4'
  ],
  // Every creative state can pull from the full video bank. The app shuffles
  // these indices without immediate repeats, then advances again when a clip ends.
  videoChangeEvents: {
    WELCOME: [0, 1, 2, 3],
    SELECTING: [0, 1, 2, 3],
    REFINING: [0, 1, 2, 3],
    GENERATING: [0, 1, 2, 3],
    RESULT_READY: [0, 1, 2, 3]
  },
  engine1BackendUrl: 'https://twofly-final-beta.onrender.com/api',
  engine2BackendUrl: window.SUNO_BACKEND_URL || '/api/suno'
};
