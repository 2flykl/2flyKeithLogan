import { GoogleLyriaProvider } from './providers/GoogleLyriaProvider.js';
import { SunoPersonalProvider } from './providers/SunoPersonalProvider.js';
import { SunoOfficialProvider } from './providers/SunoOfficialProvider.js';

export class MusicEngineManager {
  constructor() {
    this.providers = {
      google: new GoogleLyriaProvider(),
      suno: new SunoPersonalProvider(),
      suno_official: new SunoOfficialProvider()
    };
    this.activeEngineKey = 'AUTO'; // AUTO, GOOGLE, SUNO
  }

  setEngine(engineKey) {
    const key = (engineKey || 'AUTO').toUpperCase();
    if (['AUTO', 'GOOGLE', 'SUNO'].includes(key)) {
      this.activeEngineKey = key;
      console.log(`FlyZone Generation Engine set to: ${this.activeEngineKey}`);
      return true;
    }
    return false;
  }

  getActiveProvider() {
    if (this.activeEngineKey === 'SUNO') {
      return this.providers.suno;
    }
    // AUTO defaults to Google to preserve personal Suno credits safely
    return this.providers.google;
  }

  async checkCurrentHealth() {
    const provider = this.getActiveProvider();
    const health = await provider.checkHealth();
    return {
      selectedEngine: this.activeEngineKey,
      resolvedProvider: provider.name,
      status: health.status,
      message: health.message,
      credits: health.credits
    };
  }

  async generate(params) {
    const provider = this.getActiveProvider();
    console.log(`Initiating generation via resolved provider [${provider.name}]...`);
    
    try {
      const result = await provider.generate(params);
      return result;
    } catch (err) {
      console.error(`Generation error from provider [${provider.name}]:`, err);
      
      // Fallback: If Suno fails, Google remains functional
      if (provider.key === 'suno') {
        console.warn('Suno generation failed. Offering fallback to Google engine...');
        return provider.normalizeError({
          provider: 'suno',
          errorCode: 'SUNO_FAILED',
          message: 'Suno unavailable. Google engine remains available.'
        });
      }

      return provider.normalizeError({
        provider: provider.key,
        errorCode: 'ENGINE_ERROR',
        message: err.message || 'Generation failed.'
      });
    }
  }
}
