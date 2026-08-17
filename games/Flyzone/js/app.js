import { FlyZoneVoiceEngine } from './voiceEngine.js';
import { MusicEngineManager } from './engineManager.js';
import { FlyZonePromptIntelligence } from './promptIntelligence.js';

class FlyZoneApp{
  constructor(){
    this.voice=new FlyZoneVoiceEngine();this.engineManager=new MusicEngineManager();this.promptMode='LITERAL';this.hasEnteredStudio=false;this.videoIndex=0;
    this.$=id=>document.getElementById(id);
    this.engineBtns=[...document.querySelectorAll('.engine-card')];this.generateBtn=this.$('generateBtn');this.muteToggleBtn=this.$('muteToggleBtn');this.engineStatusPill=this.$('engineStatusPill');this.engineDetail=this.$('engineDetail');this.userPromptInput=this.$('userPromptInput');this.charCount=this.$('charCount');this.modeLiteralBtn=this.$('modeLiteralBtn');this.modeRefineBtn=this.$('modeRefineBtn');this.refinementCard=this.$('refinementCard');this.originalPromptDisplay=this.$('originalPromptDisplay');this.refinedPromptInput=this.$('refinedPromptInput');this.useOriginalBtn=this.$('useOriginalBtn');this.generateRefinedBtn=this.$('generateRefinedBtn');this.genreSelect=this.$('genreSelect');this.moodSelect=this.$('moodSelect');this.drumSelect=this.$('drumSelect');this.bpmSelect=this.$('bpmSelect');this.instrumentSelect=this.$('instrumentSelect');this.audioPlayer=this.$('audioPlayer');this.trackTitle=this.$('trackTitle');this.trackMeta=this.$('trackMeta');this.studioVideo=this.$('studioVideo');
  }
  async init(){await this.voice.init();this.setupVideo();this.bindEvents();this.updateCharCount();await this.updateStatus();}
  setupVideo(){
    const cfg=window.FLYZONE_CONFIG||{};const queryVideo=new URLSearchParams(location.search).get('video');const sources=queryVideo?[queryVideo]:(cfg.videoSources||[]);this.videoSources=sources.filter(Boolean);if(!this.videoSources.length)return;this.setVideo(0);this.studioVideo.addEventListener('canplay',()=>this.studioVideo.classList.add('is-ready'));this.studioVideo.addEventListener('error',()=>{if(this.videoSources.length>1)this.setVideo((this.videoIndex+1)%this.videoSources.length);},{passive:true});
  }
  setVideo(index){if(!this.videoSources?.length)return;this.videoIndex=Math.max(0,Math.min(index,this.videoSources.length-1));const src=this.videoSources[this.videoIndex];if(this.studioVideo.src!==src){this.studioVideo.src=src;this.studioVideo.load();this.studioVideo.play().catch(()=>{});}}
  changeVideoForState(state){const cfg=window.FLYZONE_CONFIG||{};const idx=cfg.videoChangeEvents?.[state];if(Number.isInteger(idx)&&this.videoSources?.[idx])this.setVideo(idx);}
  engageStudio(state='CREATION_STARTED',speak=true){this.voice.unlock();if(!this.hasEnteredStudio){this.hasEnteredStudio=true;this.voice.setState('WELCOME',{speak:true});setTimeout(()=>this.voice.setState('CREATION_STARTED',{speak:true}),1200);}else this.voice.setState(state,{speak});this.changeVideoForState(state);}
  bindEvents(){
    this.engineBtns.forEach(btn=>btn.addEventListener('click',async()=>{this.engineBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');this.engineManager.setEngine(btn.dataset.engine);this.engageStudio('SELECTING');await this.updateStatus();}));
    this.muteToggleBtn.addEventListener('click',()=>{this.voice.unlock();const muted=this.voice.toggleMute();this.muteToggleBtn.textContent=muted?'VOICE OFF':'VOICE ON';if(!muted)this.voice.playRandomVoiceCue('random',0,1);});
    this.userPromptInput.addEventListener('input',()=>{this.updateCharCount();if(this.promptMode==='REFINE')this.triggerRefinement(false);});
    this.userPromptInput.addEventListener('focus',()=>this.engageStudio('SELECTING',false),{once:true});
    this.modeLiteralBtn.addEventListener('click',()=>{this.engageStudio('SELECTING');this.setPromptMode('LITERAL');});
    this.modeRefineBtn.addEventListener('click',()=>{this.engageStudio('REFINING');this.setPromptMode('REFINE');});
    this.useOriginalBtn.addEventListener('click',()=>{this.engageStudio('SELECTING');this.setPromptMode('LITERAL');});
    this.generateRefinedBtn.addEventListener('click',()=>{this.engageStudio('GENERATING');this.onGeneratePressed(this.refinedPromptInput.value);});
    [this.genreSelect,this.moodSelect,this.drumSelect,this.bpmSelect,this.instrumentSelect].forEach(el=>el.addEventListener('change',()=>{this.engageStudio('SELECTING');if(this.promptMode==='REFINE')this.triggerRefinement(false);}));
    this.generateBtn.addEventListener('click',()=>{this.engageStudio('GENERATING');this.onGeneratePressed();});
  }
  updateCharCount(){const n=this.userPromptInput.value.length;this.charCount.textContent=`${n} / 500`;}
  setPromptMode(mode){this.promptMode=mode;const refine=mode==='REFINE';this.modeLiteralBtn.classList.toggle('active',!refine);this.modeRefineBtn.classList.toggle('active',refine);this.refinementCard.classList.toggle('hidden',!refine);if(refine)this.triggerRefinement(false);}
  triggerRefinement(speak=false){const original=this.userPromptInput.value.trim();const refined=FlyZonePromptIntelligence.refinePrompt(original,this.getStructuredParams());this.originalPromptDisplay.textContent=original||'(Using the production controls below.)';this.refinedPromptInput.value=refined;this.refinementCard.classList.remove('hidden');if(speak)this.voice.setState('REFINING');}
  getStructuredParams(){return{genre:this.genreSelect.value,mood:this.moodSelect.value,drums:this.drumSelect.value,bpm:parseInt(this.bpmSelect.value,10)||92,instrument:this.instrumentSelect.value};}
  async updateStatus(){
    const health=await this.engineManager.checkCurrentHealth();const label=health.selectedEngine==='AUTO'?'AUTO':health.consumerEngineName.toUpperCase();this.engineStatusPill.textContent=`${label} · ${health.status}`;this.engineDetail.textContent=health.message||health.status;this.engineStatusPill.closest('.live-indicator')?.classList.toggle('is-offline',health.status!=='READY');
  }
  async onGeneratePressed(explicitPrompt=''){
    const structured=this.getStructuredParams();const raw=explicitPrompt||this.userPromptInput.value.trim();const finalPrompt=this.promptMode==='REFINE'&&!explicitPrompt?(this.refinedPromptInput.value.trim()||FlyZonePromptIntelligence.refinePrompt(raw,structured)):(raw||FlyZonePromptIntelligence.refinePrompt('',structured));
    this.generateBtn.disabled=true;this.generateRefinedBtn.disabled=true;this.generateBtn.querySelector('span').textContent='CREATING…';this.trackTitle.textContent='Building your direction…';this.trackMeta.textContent=`${finalPrompt.slice(0,120)}${finalPrompt.length>120?'…':''}`;
    const result=await this.engineManager.generate({prompt:finalPrompt,genre:structured.genre||'Beat',mood:structured.mood||'Vibe',drums:structured.drums||'Drums',bpm:structured.bpm,instrument:structured.instrument||'Instruments'});
    this.generateBtn.disabled=false;this.generateRefinedBtn.disabled=false;this.generateBtn.querySelector('span').textContent='CREATE MY BEAT';
    if(result.status==='complete'&&result.audioUrl){this.voice.setState('RESULT_READY');this.changeVideoForState('RESULT_READY');this.trackTitle.textContent=result.title||'FlyZone creation';this.trackMeta.textContent=`${result.consumerEngine||'FlyZone'} · ${finalPrompt.slice(0,110)}${finalPrompt.length>110?'…':''}`;this.audioPlayer.src=result.audioUrl;this.audioPlayer.play().catch(()=>{});}else{this.trackTitle.textContent='Engine not available yet';this.trackMeta.textContent=result.message||'Choose another engine or try again.';this.voice.triggerProbabilisticVoice('random',1000,.5);}await this.updateStatus();
  }
}

document.addEventListener('DOMContentLoaded',()=>new FlyZoneApp().init());
