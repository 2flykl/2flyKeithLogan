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
    this.activeEngineKey = 'AUTO'; // AUTO, ENGINE_1, ENGINE_2
  }

  /**
   * Set engine key using consumer branding or internal key
   */
  setEngine(engineKey) {
    const key = (engineKey || 'AUTO').toUpperCase();
    if (['AUTO', 'ENGINE_1', 'GOOGLE', 'ENGINE_2', 'SUNO'].includes(key)) {
      if (key === 'GOOGLE' || key === 'ENGINE_1') this.activeEngineKey = 'ENGINE_1';
      else if (key === 'SUNO' || key === 'ENGINE_2') this.activeEngineKey = 'ENGINE_2';
      else this.activeEngineKey = 'AUTO';
      
      console.log(`FlyZone Generation Engine set to: ${this.activeEngineKey}`);
      return true;
    }
    return false;
  }

  getActiveProvider() {
    if (this.activeEngineKey === 'ENGINE_2') {
      return this.providers.suno;
    }
    // AUTO defaults to FlyZone Engine 1 (Google) to preserve personal credits safely
    return this.providers.google;
  }

  getConsumerEngineName(internalKey) {
    if (internalKey === 'suno' || internalKey === 'ENGINE_2') return 'FlyZone Engine 2';
    if (internalKey === 'google' || internalKey === 'ENGINE_1') return 'FlyZone Engine 1';
    return 'AUTO';
  }

  async checkCurrentHealth() {
    const provider = this.getActiveProvider();
    const health = await provider.checkHealth();
    const consumerName = this.getConsumerEngineName(provider.key);

    return {
      selectedEngine: this.activeEngineKey,
      consumerEngineName: consumerName,
      resolvedProvider: provider.name, // Internal debugging
      status: health.status,
      message: health.status === 'READY' 
        ? `${consumerName} Ready` 
        : `${consumerName} is temporarily unavailable. Try Engine 1 or AUTO.`,
      credits: health.credits
    };
  }

  async generate(params) {
    const provider = this.getActiveProvider();
    const consumerName = this.getConsumerEngineName(provider.key);
    console.log(`Initiating generation via [${consumerName}] (${provider.name})...`);
    
    try {
      const result = await provider.generate(params);
      // Ensure result carries consumer branding
      result.consumerEngine = consumerName;
      return result;
    } catch (err) {
      console.error(`Generation error from [${consumerName}]:`, err);
      
      if (provider.key === 'suno') {
        return provider.normalizeError({
          provider: 'ENGINE_2',
          errorCode: 'ENGINE_UNAVAILABLE',
          message: 'FlyZone Engine 2 is temporarily unavailable. Try Engine 1 or AUTO.'
        });
      }

      return provider.normalizeError({
        provider: 'ENGINE_1',
        errorCode: 'ENGINE_ERROR',
        message: 'FlyZone Engine 1 is processing request. Please try again.'
      });
    }
  }
}
