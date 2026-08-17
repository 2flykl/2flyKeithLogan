/** FlyZone Voice Engine — audio-only personality cues. */
export class FlyZoneVoiceEngine {
  constructor(manifestPath='assets/voice/generatedVoiceManifest.json'){
    this.manifestPath=manifestPath;this.manifest=null;this.audioBanks={};this.currentAudio=null;this.cueTimeout=null;this.currentState='WELCOME';this.lastTriggerTime=0;this.recentlyUsedByBank={};this.isMuted=false;this.isLoaded=false;this.unlocked=false;
  }
  async init(){
    try{const res=await fetch(this.manifestPath,{cache:'no-store'});if(!res.ok)throw new Error(`Manifest HTTP ${res.status}`);this.manifest=await res.json();await this.preloadAudioBanks();this.isLoaded=true;}catch(err){console.warn('FlyZone voice manifest unavailable:',err);}
  }
  async preloadAudioBanks(){
    if(!this.manifest?.banks)return;for(const [key,info] of Object.entries(this.manifest.banks)){const audio=new Audio(`assets/voice/${info.file}`);audio.preload='auto';this.audioBanks[key]={element:audio,file:info.file,phraseCount:Number(info.phraseCount)||0};this.recentlyUsedByBank[key]=new Set();}
  }
  unlock(){this.unlocked=true;}
  setState(state,{speak=true}={}){
    this.currentState=state;if(!speak)return;
    const map={WELCOME:'welcome',CREATION_STARTED:'afterWelcome',SELECTING:'random',REFINING:'random',GENERATING:'random',RESULT_READY:'afterWelcome'};
    const bank=map[state];if(bank)this.playRandomVoiceCue(bank,state==='SELECTING'?5500:1500,state==='SELECTING'?0.42:1);
  }
  getMarkersForBank(bankKey){
    const all=this.manifest?.markers||[];const count=this.audioBanks[bankKey]?.phraseCount||all.length;return all.slice(0,Math.max(0,Math.min(count,all.length)));
  }
  getVoiceCueDuration(bankKey,markerId){
    const markers=this.getMarkersForBank(bankKey);const idx=markers.findIndex(m=>m.id===markerId);if(idx<0)return 3;const start=markers[idx].time;const next=markers[idx+1]?.time;const audio=this.audioBanks[bankKey]?.element;const end=next?next-.06:(audio?.duration||start+3.5);return Math.max(.5,end-start);
  }
  stopVoiceCue(){if(this.cueTimeout){clearTimeout(this.cueTimeout);this.cueTimeout=null;}if(this.currentAudio){this.currentAudio.pause();this.currentAudio=null;}}
  playVoiceCue(bankKey,markerId){
    if(this.isMuted||!this.isLoaded||!this.unlocked)return false;const bank=this.audioBanks[bankKey];const marker=this.getMarkersForBank(bankKey).find(m=>m.id===markerId);if(!bank||!marker)return false;this.stopVoiceCue();const audio=bank.element;audio.currentTime=marker.time;this.currentAudio=audio;audio.play().catch(()=>{});this.cueTimeout=setTimeout(()=>{if(this.currentAudio===audio){audio.pause();this.currentAudio=null;}},this.getVoiceCueDuration(bankKey,markerId)*1000);const recent=this.recentlyUsedByBank[bankKey]||new Set();recent.add(markerId);while(recent.size>6)recent.delete(recent.values().next().value);this.recentlyUsedByBank[bankKey]=recent;this.lastTriggerTime=Date.now();return true;
  }
  playRandomVoiceCue(bankKey,minCooldownMs=0,prob=1){
    if(Date.now()-this.lastTriggerTime<minCooldownMs||Math.random()>prob)return false;const markers=this.getMarkersForBank(bankKey);if(!markers.length)return false;const recent=this.recentlyUsedByBank[bankKey]||new Set();let pool=markers.filter(m=>!recent.has(m.id));if(!pool.length){recent.clear();pool=markers;}const chosen=pool[Math.floor(Math.random()*pool.length)];return chosen?this.playVoiceCue(bankKey,chosen.id):false;
  }
  triggerProbabilisticVoice(bankKey='random',minCooldownMs=7000,prob=.35){return this.playRandomVoiceCue(bankKey,minCooldownMs,prob);}
  toggleMute(){this.isMuted=!this.isMuted;if(this.isMuted)this.stopVoiceCue();return this.isMuted;}
}
