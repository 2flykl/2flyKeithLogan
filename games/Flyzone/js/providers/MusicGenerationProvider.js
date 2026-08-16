/**
 * Abstract Music Generation Provider Base Class
 */
export class MusicGenerationProvider {
  constructor(name, key) {
    this.name = name;
    this.key = key;
  }

  async checkHealth() {
    return {
      status: 'READY',
      message: `${this.name} engine operational.`
    };
  }

  async generate(params) {
    throw new Error('MusicGenerationProvider.generate() must be implemented by subclass');
  }

  normalizeResult({ provider, status, audioUrl, title, duration, generationId, metadata = {} }) {
    return {
      provider: provider || this.key,
      status: status || 'complete',
      audioUrl: audioUrl || '',
      title: title || 'FlyZone Beat Track',
      duration: duration || 120,
      generationId: generationId || `gen_${Date.now()}`,
      timestamp: new Date().toISOString(),
      metadata
    };
  }

  normalizeError({ provider, errorCode, message }) {
    return {
      provider: provider || this.key,
      status: 'error',
      errorCode: errorCode || 'GENERATION_FAILED',
      message: message || 'An error occurred during music generation.',
      timestamp: new Date().toISOString()
    };
  }
}
