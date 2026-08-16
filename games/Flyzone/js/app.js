import { FlyZoneVoiceEngine } from './voiceEngine.js';
import { MusicEngineManager } from './engineManager.js';

class FlyZoneApp {
  constructor() {
    this.voice = new FlyZoneVoiceEngine();
    this.engineManager = new MusicEngineManager();
    
    // UI Elements
    this.engineBtns = document.querySelectorAll('.engine-btn');
    this.generateBtn = document.getElementById('generateBtn');
    this.muteToggleBtn = document.getElementById('muteToggleBtn');
    this.voiceLog = document.getElementById('voiceLog');
    this.voiceStateBadge = document.getElementById('voiceStateBadge');
    this.engineStatusPill = document.getElementById('engineStatusPill');
    this.sunoDevStatusPill = document.getElementById('sunoDevStatusPill');
    
    this.genreSelect = document.getElementById('genreSelect');
    this.moodSelect = document.getElementById('moodSelect');
    this.drumSelect = document.getElementById('drumSelect');
    this.bpmSelect = document.getElementById('bpmSelect');
    this.instrumentSelect = document.getElementById('instrumentSelect');
    
    this.audioPlayer = document.getElementById('audioPlayer');
    this.trackTitle = document.getElementById('trackTitle');
    this.trackMeta = document.getElementById('trackMeta');

    this.hasEnteredStudio = false;
  }

  async init() {
    await this.voice.init();
    this.bindEvents();
    this.updateStatus();

    // Trigger initial Welcome voice clip once on load
    setTimeout(() => {
      this.playWelcomeVoice();
    }, 600);
  }

  playWelcomeVoice() {
    this.logKeithVoice('Welcome to FlyZone. Choose your style and let’s make a beat.');
    this.voice.playRandomVoiceCue('welcome');
  }

  bindEvents() {
    // Engine selector buttons
    this.engineBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.engineBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const engine = btn.dataset.engine;
        this.engineManager.setEngine(engine);
        this.updateStatus();

        this.onUserInteraction();
      });
    });

    // Mute toggle
    this.muteToggleBtn.addEventListener('click', () => {
      const isMuted = this.voice.toggleMute();
      this.muteToggleBtn.textContent = isMuted ? '🔇 VOICE OFF' : '🔊 VOICE ON';
    });

    // Parameter changes
    [this.genreSelect, this.moodSelect, this.drumSelect, this.bpmSelect, this.instrumentSelect].forEach(select => {
      select.addEventListener('change', () => {
        this.onUserInteraction();
      });
    });

    // Generate button
    this.generateBtn.addEventListener('click', () => {
      this.onGeneratePressed();
    });
  }

  onUserInteraction() {
    if (!this.hasEnteredStudio) {
      this.hasEnteredStudio = true;
      this.voice.setState('CREATION_STARTED');
      this.voiceStateBadge.textContent = 'State: CREATION_STARTED';
      this.logKeithVoice('Entering creation mode. What are we building today?');
    } else {
      this.voice.setState('SELECTING');
      this.voiceStateBadge.textContent = 'State: SELECTING';
      
      // Probabilistic random voice response (7-10s cooldown, 35% probability)
      const played = this.voice.triggerProbabilisticVoice('random', 7000, 0.35);
      if (played) {
        this.logKeithVoice('Yeah... I can work with that.');
      }
    }
  }

  async updateStatus() {
    const health = await this.engineManager.checkCurrentHealth();
    this.engineStatusPill.textContent = `ENGINE: ${health.selectedEngine} (${health.resolvedProvider})`;
    
    // Update Suno Dev Status Pill
    if (health.selectedEngine === 'SUNO' || health.credits) {
      this.sunoDevStatusPill.textContent = health.message;
    } else {
      this.sunoDevStatusPill.textContent = 'SUNO — EXPERIMENTAL (READY)';
    }
  }

  async onGeneratePressed() {
    this.voice.setState('GENERATING');
    this.voiceStateBadge.textContent = 'State: GENERATING';
    
    // Play voice clip before generation begins
    this.voice.playRandomVoiceCue('random');
    this.logKeithVoice('Alright... cooking up the track now.');

    this.generateBtn.disabled = true;
    this.generateBtn.textContent = 'GENERATING BEAT...';

    const params = {
      genre: this.genreSelect.value,
      mood: this.moodSelect.value,
      drums: this.drumSelect.value,
      bpm: parseInt(this.bpmSelect.value, 10),
      instrument: this.instrumentSelect.value
    };

    const result = await this.engineManager.generate(params);

    this.generateBtn.disabled = false;
    this.generateBtn.textContent = 'GENERATE BEAT';

    if (result.status === 'complete') {
      this.voice.setState('RESULT_READY');
      this.voiceStateBadge.textContent = 'State: RESULT_READY';
      
      this.trackTitle.textContent = result.title;
      this.trackMeta.textContent = `Engine: ${result.provider.toUpperCase()} | Prompt: ${result.metadata.genre || 'Beat'} (${result.metadata.mood || 'Vibe'}) @ ${result.metadata.bpm || 92} BPM`;
      
      this.audioPlayer.src = result.audioUrl;
      this.audioPlayer.play().catch(e => console.log('Audio autoplay deferred:', e));
      
      this.logKeithVoice(`Track ready! Here is your ${result.metadata.genre || 'beat'}.`);
    } else {
      this.trackTitle.textContent = 'Generation Issue';
      this.trackMeta.textContent = `Error: ${result.message}`;
      this.logKeithVoice(`Notice: ${result.message}`);
    }

    this.updateStatus();
  }

  logKeithVoice(msg) {
    const p = document.createElement('p');
    p.className = 'keith';
    p.innerHTML = `<strong>Keith:</strong> ${msg}`;
    this.voiceLog.appendChild(p);
    this.voiceLog.scrollTop = this.voiceLog.scrollHeight;
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new FlyZoneApp();
  app.init();
});
