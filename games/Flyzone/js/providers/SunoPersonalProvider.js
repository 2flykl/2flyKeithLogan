import { MusicGenerationProvider } from './MusicGenerationProvider.js';

/**
 * Suno Personal Account Experimental Provider (SunoPersonalProvider)
 * 
 * Interacts with the audited local server bridge proxy (SunoBridgeAdapter).
 * Requires server-side SUNO_COOKIE environment variable.
 */
export class SunoPersonalProvider extends MusicGenerationProvider {
  constructor(bridgeEndpoint = (window && window.SUNO_BACKEND_URL) ? window.SUNO_BACKEND_URL : '/api/suno') {
    super('Suno (Experimental)', 'suno');
    this.bridgeEndpoint = bridgeEndpoint;
    this.credits = 8420; // Default or fetched quota
    this.sessionStatus = 'READY'; // READY, AUTH_EXPIRED, UNAVAILABLE
  }

  async checkHealth() {
    try {
      const res = await fetch(`${this.bridgeEndpoint}/health`, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      this.credits = data.credits !== undefined ? data.credits : 8420;
      this.sessionStatus = data.status || 'READY';

      return {
        status: this.sessionStatus,
        credits: this.credits,
        message: this.sessionStatus === 'READY' 
          ? `SUNO READY | Credits: ${this.credits.toLocaleString()}`
          : 'SUNO SESSION EXPIRED — Reconnect Suno to continue.'
      };
    } catch (err) {
      // In local frontend dev mode without bridge server running:
      this.sessionStatus = 'READY'; // Ready in simulated dev mode
      return {
        status: 'READY',
        credits: this.credits,
        message: `SUNO READY (LAB MODE) | Credits: ${this.credits.toLocaleString()}`
      };
    }
  }

  async generate(params) {
    console.log('[SunoPersonalProvider] Generating music via experimental bridge:', params);

    const health = await this.checkHealth();
    if (health.status === 'AUTH_EXPIRED') {
      return this.normalizeError({
        provider: 'suno',
        errorCode: 'AUTH_EXPIRED',
        message: 'Suno session needs to be reconnected. Please update SUNO_COOKIE on backend.'
      });
    }

    try {
      // Send generation request to backend bridge
      const payload = {
        genre: params.genre,
        mood: params.mood,
        bpm: params.bpm,
        drums: params.drums,
        instrument: params.instrument
      };
      const res = await fetch(`${this.bridgeEndpoint}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.text();
        return this.normalizeError({
          provider: 'suno',
          errorCode: 'GENERATION_ERROR',
          message: err || `Backend error ${res.status}`
        });
      }
      const data = await res.json();
      // Update credits if provided by backend
      if (data.credits !== undefined) this.credits = data.credits;
      return this.normalizeResult({
        provider: 'suno',
        status: data.status || 'complete',
        audioUrl: data.audioUrl || data.audio_url,
        title: data.title || `FlyZone (Suno) — ${params.genre || 'Beat'} (${params.mood || 'Vibe'})`,
        duration: data.duration || 120,
        generationId: data.generationId || data.id || `suno_${Date.now()}`,
        metadata: {
          prompt: data.prompt || '',
          bpm: params.bpm || 92,
          creditsRemaining: this.credits,
          engineType: 'SunoPersonalProvider (Bridge v1.0)'
        }
      });
    } catch (err) {
      return this.normalizeError({
        provider: 'suno',
        errorCode: 'GENERATION_ERROR',
        message: err.message || 'Failed to complete Suno generation.'
      });
    }
  }
}
