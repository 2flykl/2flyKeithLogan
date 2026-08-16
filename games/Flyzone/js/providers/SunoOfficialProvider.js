import { MusicGenerationProvider } from './MusicGenerationProvider.js';

/**
 * Suno Official Partner API Provider (SunoOfficialProvider)
 * 
 * Reserved slot for future official public/partner Suno API access.
 * Currently dormant.
 */
export class SunoOfficialProvider extends MusicGenerationProvider {
  constructor() {
    super('Suno (Official API)', 'suno_official');
    this.isDormant = true;
  }

  async checkHealth() {
    return {
      status: 'UNAVAILABLE',
      message: 'Official Suno Partner API slot is reserved for future availability.'
    };
  }

  async generate(params) {
    return this.normalizeError({
      provider: 'suno_official',
      errorCode: 'PROVIDER_DORMANT',
      message: 'The official Suno API slot is currently dormant. Please use Suno Personal or Google engine.'
    });
  }
}
