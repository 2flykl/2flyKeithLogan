import { MusicGenerationProvider } from './MusicGenerationProvider.js';

/**
 * FlyZone Engine 1 — Google Lyria through the secured Render backend.
 */
export class GoogleLyriaProvider extends MusicGenerationProvider {
  constructor() {
    super('Google Lyria', 'google');
    this.endpoint=(window.FLYZONE_CONFIG?.engine1BackendUrl||'https://twofly-final-beta.onrender.com/api').replace(/\/$/,'');
  }

  async checkHealth() {
    try {
      const response=await fetch(`${this.endpoint}/status`,{cache:'no-store'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const data=await response.json();
      return {
        status:data.engine1Configured?'READY':'OFFLINE',
        message:data.engine1Configured?'FlyZone Engine 1 is ready.':'FlyZone Engine 1 is not configured.'
      };
    } catch (error) {
      return {status:'OFFLINE',message:'FlyZone Engine 1 cannot reach the generation service.'};
    }
  }

  async generate(params) {
    const response=await fetch(`${this.endpoint}/generate`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        engine:'ENGINE_1',
        prompt:params.prompt,
        controls:{
          genre:params.genre,
          mood:params.mood,
          drums:params.drums,
          bpm:params.bpm,
          instrument:params.instrument
        }
      })
    });
    const contentType=response.headers.get('content-type')||'';
    const data=contentType.includes('application/json')?await response.json():{error:await response.text()};
    if(!response.ok||data.success===false||!data.audioUrl){
      throw new Error(data.error||data.message||'FlyZone Engine 1 could not generate this beat.');
    }
    return this.normalizeResult({
      provider:'google',
      status:'complete',
      audioUrl:data.audioUrl,
      title:data.title||'FlyZone First Take',
      duration:data.duration||120,
      generationId:data.predictionId||data.generationId||`lyria_${Date.now()}`,
      metadata:{
        prompt:data.description||params.prompt,
        bpm:params.bpm||92,
        genre:params.genre||'Open',
        mood:params.mood||'Open',
        drums:params.drums||'Open',
        instrument:params.instrument||'Open'
      }
    });
  }
}
