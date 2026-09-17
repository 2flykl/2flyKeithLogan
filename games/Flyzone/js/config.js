// FlyZone deployment configuration.
// Reuse the existing Render-hosted studio clips; no duplicate video downloads.
window.FLYZONE_CONFIG = window.FLYZONE_CONFIG || {
  videoSources: [
    'https://twofly-final-beta.onrender.com/studio/videos/idle-neutral.mp4',
    'https://twofly-final-beta.onrender.com/studio/videos/idle-spin.mp4',
    'https://twofly-final-beta.onrender.com/studio/videos/idle-side-glance.mp4',
    'https://twofly-final-beta.onrender.com/studio/videos/idle-adjust.mp4'
  ],
  videoChangeEvents: {
    WELCOME: 0,
    SELECTING: 0,
    REFINING: 2,
    GENERATING: 3,
    RESULT_READY: 1
  },
  engine2BackendUrl: window.SUNO_BACKEND_URL || '/api/suno'
};
