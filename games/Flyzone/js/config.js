// FlyZone deployment configuration.
// Keep studio footage outside the UI layer: point this list at the SAME video files/URLs
// already used by the deployed Render experience. The new UI will sit over them.
window.FLYZONE_CONFIG = window.FLYZONE_CONFIG || {
  videoSources: [],
  videoChangeEvents: {
    WELCOME: 0,
    SELECTING: 0,
    REFINING: 0,
    GENERATING: 0,
    RESULT_READY: 0
  },
  engine2BackendUrl: window.SUNO_BACKEND_URL || '/api/suno'
};
