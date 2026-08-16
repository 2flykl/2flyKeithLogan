import { FlyZoneVoiceEngine } from './voiceEngine.js';
import { MusicEngineManager } from './engineManager.js';
import { FlyZonePromptIntelligence } from './promptIntelligence.js';

class FlyZoneApp {
  constructor() {
    this.voice = new FlyZoneVoiceEngine();
    this.engineManager = new MusicEngineManager();
    
    // State
    this.originalPrompt = '';
    this.refinedPrompt = '';
    this.activePrompt = '';
    this.promptMode = 'LITERAL'; // LITERAL vs REFINE
    this.hasEnteredStudio = false;

    // UI Elements
    this.engineBtns = document.querySelectorAll('.engine-btn');
    this.generateBtn = document.getElementById('generateBtn');
    this.muteToggleBtn = document.getElementById('muteToggleBtn');
    this.engineStatusPill = document.getElementById('engineStatusPill');
    this.sunoDevStatusPill = document.getElementById('sunoDevStatusPill');

    // Prompt UI
    this.userPromptInput = document.getElementById('userPromptInput');
    this.modeLiteralBtn = document.getElementById('modeLiteralBtn');
    this.modeRefineBtn = document.getElementById('modeRefineBtn');

    // Refinement Card
    this.refinementCard = document.getElementById('refinementCard');
    this.originalPromptDisplay = document.getElementById('originalPromptDisplay');
    this.refinedPromptInput = document.getElementById('refinedPromptInput');
    this.useOriginalBtn = document.getElementById('useOriginalBtn');
    this.generateRefinedBtn = document.getElementById('generateRefinedBtn');

    // Structured Selects
    this.genreSelect = document.getElementById('genreSelect');
    this.moodSelect = document.getElementById('moodSelect');
    this.drumSelect = document.getElementById('drumSelect');
    this.bpmSelect = document.getElementById('bpmSelect');
    this.instrumentSelect = document.getElementById('instrumentSelect');
    
    // Player Bar
    this.audioPlayer = document.getElementById('audioPlayer');
    this.trackTitle = document.getElementById('trackTitle');
    this.trackMeta = document.getElementById('trackMeta');
  }

  async init() {
    await this.voice.init();
    this.bindEvents();
    this.updateStatus();

    // Trigger audio-only welcome phrase on load
    setTimeout(() => {
      this.voice.playRandomVoiceCue('welcome');
    }, 600);
  }

  bindEvents() {
    // Engine selector buttons (AUTO, ENGINE_1, ENGINE_2)
    this.engineBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.engineBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const engineKey = btn.dataset.engine;
        this.engineManager.setEngine(engineKey);
        this.updateStatus();

        this.onUserInteraction();
      });
    });

    // Mute toggle (audio-only voice control)
    this.muteToggleBtn.addEventListener('click', () => {
      const isMuted = this.voice.toggleMute();
      this.muteToggleBtn.textContent = isMuted ? '🔇 VOICE OFF' : '🔊 VOICE ON';
    });

    // Prompt textarea input
    this.userPromptInput.addEventListener('input', () => {
      this.originalPrompt = this.userPromptInput.value;
      if (this.promptMode === 'LITERAL') {
        this.activePrompt = FlyZonePromptIntelligence.sanitizePrompt(this.originalPrompt);
      }
    });

    // Prompt mode switching
    this.modeLiteralBtn.addEventListener('click', () => {
      this.setPromptMode('LITERAL');
    });

    this.modeRefineBtn.addEventListener('click', () => {
      this.setPromptMode('REFINE');
      // Play audio-only voice reaction clip
      this.voice.triggerProbabilisticVoice('random', 0, 1.0);
    });

    // Refinement action buttons
    this.useOriginalBtn.addEventListener('click', () => {
      this.setPromptMode('LITERAL');
    });

    this.generateRefinedBtn.addEventListener('click', () => {
      this.activePrompt = this.refinedPromptInput.value;
      this.onGeneratePressed();
    });

    // Structured parameter changes
    [this.genreSelect, this.moodSelect, this.drumSelect, this.bpmSelect, this.instrumentSelect].forEach(select => {
      select.addEventListener('change', () => {
        if (this.promptMode === 'REFINE') {
          this.triggerRefinement();
        }
        this.onUserInteraction();
      });
    });

    // Main generate button
    this.generateBtn.addEventListener('click', () => {
      this.onGeneratePressed();
    });
  }

  setPromptMode(mode) {
    this.promptMode = mode;

    if (mode === 'LITERAL') {
      this.modeLiteralBtn.classList.add('active');
      this.modeRefineBtn.classList.remove('active');
      this.refinementCard.classList.add('hidden');
      this.activePrompt = FlyZonePromptIntelligence.sanitizePrompt(this.userPromptInput.value);
    } else {
      this.modeRefineBtn.classList.add('active');
      this.modeLiteralBtn.classList.remove('active');
      this.triggerRefinement();
    }
  }

  triggerRefinement() {
    this.originalPrompt = this.userPromptInput.value.trim();
    const structuredParams = this.getStructuredParams();

    this.refinedPrompt = FlyZonePromptIntelligence.refinePrompt(this.originalPrompt, structuredParams);
    this.activePrompt = this.refinedPrompt;

    this.originalPromptDisplay.textContent = this.originalPrompt || '(No text prompt entered — refining from menu selections)';
    this.refinedPromptInput.value = this.refinedPrompt;

    this.refinementCard.classList.remove('hidden');
  }

  getStructuredParams() {
    return {
      genre: this.genreSelect.value,
      mood: this.moodSelect.value,
      drums: this.drumSelect.value,
      bpm: parseInt(this.bpmSelect.value, 10) || 92,
      instrument: this.instrumentSelect.value
    };
  }

  onUserInteraction() {
    if (!this.hasEnteredStudio) {
      this.hasEnteredStudio = true;
      this.voice.setState('CREATION_STARTED');
    } else {
      this.voice.setState('SELECTING');
      this.voice.triggerProbabilisticVoice('random', 7000, 0.35);
    }
  }

  async updateStatus() {
    const health = await this.engineManager.checkCurrentHealth();
    this.engineStatusPill.textContent = `ENGINE: ${health.selectedEngine} (${health.consumerEngineName})`;
    
    // Consumer-facing status display for FlyZone Engine 2
    if (health.selectedEngine === 'ENGINE_2' || health.credits) {
      this.sunoDevStatusPill.textContent = health.status === 'READY'
        ? `FLYZONE ENGINE 2 (READY)`
        : `FLYZONE ENGINE 2 (OFFLINE)`;
    } else {
      this.sunoDevStatusPill.textContent = 'FLYZONE ENGINE 2 (READY)';
    }
  }

  async onGeneratePressed() {
    this.voice.setState('GENERATING');
    
    // Audio-only voice trigger before generation
    this.voice.playRandomVoiceCue('random');

    this.generateBtn.disabled = true;
    this.generateBtn.textContent = 'GENERATING BEAT...';

    // Prepare prompt and parameters
    const structured = this.getStructuredParams();
    
    // Use active prompt if provided, or construct from structured options
    let finalPrompt = this.promptMode === 'REFINE' 
      ? this.refinedPromptInput.value 
      : (this.userPromptInput.value.trim() || FlyZonePromptIntelligence.refinePrompt('', structured));

    const generationParams = {
      prompt: finalPrompt,
      genre: structured.genre || 'Beat',
      mood: structured.mood || 'Vibe',
      drums: structured.drums || 'Drums',
      bpm: structured.bpm || 92,
      instrument: structured.instrument || 'Instruments'
    };

    const result = await this.engineManager.generate(generationParams);

    this.generateBtn.disabled = false;
    this.generateBtn.textContent = 'GENERATE BEAT';

    if (result.status === 'complete') {
      this.voice.setState('RESULT_READY');
      
      this.trackTitle.textContent = result.title;
      this.trackMeta.textContent = `Engine: ${result.consumerEngine || 'FlyZone Engine'} | Direction: "${finalPrompt.substring(0, 75)}..."`;
      
      this.audioPlayer.src = result.audioUrl;
      this.audioPlayer.play().catch(e => console.log('Audio autoplay deferred:', e));
    } else {
      this.trackTitle.textContent = 'Generation Notice';
      this.trackMeta.textContent = result.message || 'FlyZone Engine 2 is temporarily unavailable. Try Engine 1 or AUTO.';
    }

    this.updateStatus();
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new FlyZoneApp();
  app.init();
});
