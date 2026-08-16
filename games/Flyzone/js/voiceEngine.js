/**
 * FlyZone Voice Engine — Audio Sprite & Personality Controller
 * 
 * Manages Keith's interactive voice banks using Studio One master timeline markers.
 * Audio Sprite Banks:
 *  - welcome: "Enter Studio Welcome Phrases.wav"
 *  - afterWelcome: "After Enter Studio Phrases.wav"
 *  - random: "Generic Test Phrases.wav"
 */

export class FlyZoneVoiceEngine {
  constructor(manifestPath = 'assets/voice/generatedVoiceManifest.json') {
    this.manifestPath = manifestPath;
    this.manifest = null;
    this.audioBanks = {};
    this.currentAudio = null;
    this.cueTimeout = null;
    this.currentState = 'WELCOME';
    this.lastTriggerTime = 0;
    this.recentlyUsedMarkers = new Set();
    this.isMuted = false;
    this.isLoaded = false;
  }

  async init() {
    try {
      const res = await fetch(this.manifestPath);
      this.manifest = await res.json();
      await this.preloadAudioBanks();
      this.isLoaded = true;
      console.log('FlyZone Voice Engine initialized successfully.');
    } catch (err) {
      console.warn('Voice Engine initialization fallback:', err);
    }
  }

  async preloadAudioBanks() {
    if (!this.manifest || !this.manifest.banks) return;
    
    const bankKeys = Object.keys(this.manifest.banks);
    const basePath = 'assets/voice/';

    for (const key of bankKeys) {
      const bankInfo = this.manifest.banks[key];
      const audio = new Audio(basePath + bankInfo.file);
      audio.preload = 'auto';
      this.audioBanks[key] = {
        element: audio,
        file: bankInfo.file,
        phraseCount: bankInfo.phraseCount
      };
    }
  }

  setState(newState) {
    console.log(`Voice State Transition: ${this.currentState} -> ${newState}`);
    this.currentState = newState;
    
    if (newState === 'CREATION_STARTED') {
      this.playRandomVoiceCue('afterWelcome');
    }
  }

  getMarkers() {
    return this.manifest ? this.manifest.markers : [];
  }

  getVoiceCueDuration(bankKey, markerId) {
    const markers = this.getMarkers();
    const idx = markers.findIndex(m => m.id === markerId);
    if (idx === -1) return 3.0; // fallback 3 seconds

    const start = markers[idx].time;
    let end;
    if (idx < markers.length - 1) {
      end = markers[idx + 1].time - 0.060; // 60ms tail trim
    } else {
      const bank = this.audioBanks[bankKey];
      end = bank && bank.element.duration ? bank.element.duration : start + 3.5;
    }
    return Math.max(0.5, end - start);
  }

  stopVoiceCue() {
    if (this.cueTimeout) {
      clearTimeout(this.cueTimeout);
      this.cueTimeout = null;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }

  playVoiceCue(bankKey, markerId) {
    if (this.isMuted || !this.isLoaded) return false;

    const bank = this.audioBanks[bankKey];
    const markers = this.getMarkers();
    const marker = markers.find(m => m.id === markerId);

    if (!bank || !marker) return false;

    this.stopVoiceCue();

    const duration = this.getVoiceCueDuration(bankKey, markerId);
    const audio = bank.element;

    audio.currentTime = marker.time;
    this.currentAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Voice cue autoplay deferred/blocked:', err);
      });
    }

    this.cueTimeout = setTimeout(() => {
      if (this.currentAudio === audio) {
        audio.pause();
        this.currentAudio = null;
      }
    }, duration * 1000);

    this.recentlyUsedMarkers.add(markerId);
    if (this.recentlyUsedMarkers.size > 8) {
      const first = this.recentlyUsedMarkers.values().next().value;
      this.recentlyUsedMarkers.delete(first);
    }

    this.lastTriggerTime = Date.now();
    return true;
  }

  playRandomVoiceCue(bankKey) {
    if (this.isMuted || !this.isLoaded) return false;

    const bank = this.audioBanks[bankKey];
    if (!bank) return false;

    const markers = this.getMarkers();
    const availableMarkers = markers.filter(m => !this.recentlyUsedMarkers.has(m.id));

    const pool = availableMarkers.length > 0 ? availableMarkers : markers;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    if (selected) {
      return this.playVoiceCue(bankKey, selected.id);
    }
    return false;
  }

  triggerProbabilisticVoice(bankKey = 'random', minCooldownMs = 7000, prob = 0.35) {
    const now = Date.now();
    if (now - this.lastTriggerTime < minCooldownMs) {
      return false; // cooldown active
    }

    if (Math.random() <= prob) {
      return this.playRandomVoiceCue(bankKey);
    }

    return false;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) this.stopVoiceCue();
    return this.isMuted;
  }
}
