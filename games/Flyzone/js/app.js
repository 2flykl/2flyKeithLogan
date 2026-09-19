import { FlyZoneVoiceEngine } from './voiceEngine.js?v=20260919-epic1';
import { MusicEngineManager } from './engineManager.js?v=20260917-generation2';
import { FlyZonePromptIntelligence } from './promptIntelligence.js?v=20260919-epic1';

class FlyZoneApp{
  constructor(){
    this.voice=new FlyZoneVoiceEngine();
    this.engineManager=new MusicEngineManager();
    this.promptMode='LITERAL';
    this.hasEnteredStudio=false;
    this.videoIndex=-1;
    this.videoRotationQueue=[];
    this.generating=false;
    this.touchedControls=new Set();
    this.$=id=>document.getElementById(id);
    this.engineBtns=[...document.querySelectorAll('.engine-card')];
    this.generateBtn=this.$('generateBtn');
    this.muteToggleBtn=this.$('muteToggleBtn');
    this.engineStatusPill=this.$('engineStatusPill');
    this.engineDetail=this.$('engineDetail');
    this.userPromptInput=this.$('userPromptInput');
    this.charCount=this.$('charCount');
    this.selectionCount=this.$('selectionCount');
    this.readinessIndicator=this.$('readinessIndicator');
    this.modeLiteralBtn=this.$('modeLiteralBtn');
    this.modeRefineBtn=this.$('modeRefineBtn');
    this.refinementCard=this.$('refinementCard');
    this.originalPromptDisplay=this.$('originalPromptDisplay');
    this.refinedPromptInput=this.$('refinedPromptInput');
    this.thoughtLog=this.$('thoughtLog');
    this.thoughtModeLabel=this.$('thoughtModeLabel');
    this.useOriginalBtn=this.$('useOriginalBtn');
    this.generateRefinedBtn=this.$('generateRefinedBtn');
    this.genreSelect=this.$('genreSelect');
    this.moodSelect=this.$('moodSelect');
    this.drumSelect=this.$('drumSelect');
    this.bpmSelect=this.$('bpmSelect');
    this.instrumentSelect=this.$('instrumentSelect');
    this.controlSelects=[this.genreSelect,this.moodSelect,this.drumSelect,this.bpmSelect,this.instrumentSelect];
    this.audioPlayer=this.$('audioPlayer');
    this.trackTitle=this.$('trackTitle');
    this.trackMeta=this.$('trackMeta');
    this.studioVideo=this.$('studioVideo');
  }

  async init(){
    this.setupVideo();
    this.bindEvents();
    this.updateCreativeState();
    await Promise.all([this.voice.init(),this.updateStatus()]);
  }

  setupVideo(){
    const cfg=window.FLYZONE_CONFIG||{};
    const queryVideo=new URLSearchParams(location.search).get('video');
    this.videoSources=(queryVideo?[queryVideo]:(cfg.videoSources||[])).filter(Boolean);
    this.failedVideos=new Set();
    this.videoRotationQueue=[];
    if(!this.studioVideo||!this.videoSources.length)return;
    const video=this.studioVideo;
    video.muted=true;video.defaultMuted=true;video.playsInline=true;video.loop=false;
    const revealVideo=()=>video.classList.add('is-ready');
    ['loadeddata','canplay','playing'].forEach(event=>video.addEventListener(event,revealVideo));
    video.addEventListener('ended',()=>this.playNextRandomVideo());
    video.addEventListener('error',()=>{
      if(this.videoIndex>=0)this.failedVideos.add(this.videoIndex);
      this.videoRotationQueue=this.videoRotationQueue.filter(index=>!this.failedVideos.has(index));
      this.playNextRandomVideo();
    });
    const resume=()=>{if(video.paused&&video.currentSrc&&!video.error)video.play().catch(()=>{});};
    document.addEventListener('pointerdown',resume,{passive:true});
    document.addEventListener('keydown',resume);
    this.playNextRandomVideo();
  }

  shuffleVideoIndices(indices){
    const shuffled=[...indices];
    for(let i=shuffled.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
    }
    return shuffled;
  }

  getAvailableVideoIndices(candidates){
    const all=this.videoSources.map((_,index)=>index);
    const requested=(Array.isArray(candidates)?candidates:all)
      .filter(index=>Number.isInteger(index)&&this.videoSources[index]&&!this.failedVideos.has(index));
    return requested.length?requested:all.filter(index=>!this.failedVideos.has(index));
  }

  pickNextRandomVideo(candidates){
    const available=this.getAvailableVideoIndices(candidates);
    if(!available.length)return-1;
    const allowed=new Set(available);
    this.videoRotationQueue=this.videoRotationQueue.filter(index=>allowed.has(index)&&index!==this.videoIndex);
    if(!this.videoRotationQueue.length){
      const fresh=available.length>1?available.filter(index=>index!==this.videoIndex):available;
      this.videoRotationQueue=this.shuffleVideoIndices(fresh);
    }
    return this.videoRotationQueue.shift()??available[0];
  }

  playNextRandomVideo(candidates){
    const next=this.pickNextRandomVideo(candidates);
    if(next!==-1)this.setVideo(next);
  }

  setVideo(index){
    if(!this.videoSources?.length)return;
    const next=Math.max(0,Math.min(index,this.videoSources.length-1));
    if(this.failedVideos?.has(next))return;
    const src=new URL(this.videoSources[next],document.baseURI).href;
    if(this.videoIndex===next&&this.studioVideo.src===src)return;
    this.videoIndex=next;
    this.studioVideo.src=src;
    this.studioVideo.load();
    this.studioVideo.play()?.catch(()=>{});
  }

  changeVideoForState(state){
    const configured=(window.FLYZONE_CONFIG||{}).videoChangeEvents?.[state];
    const candidates=Array.isArray(configured)?configured:(Number.isInteger(configured)?[configured]:undefined);
    this.playNextRandomVideo(candidates);
  }

  engageStudio(state='CREATION_STARTED',speak=true){
    this.voice.unlock();
    if(!this.hasEnteredStudio){
      this.hasEnteredStudio=true;
      this.voice.setState('WELCOME',{speak:true});
    }else{
      this.voice.setState(state,{speak});
    }
    this.changeVideoForState(state);
  }

  bindEvents(){
    this.engineBtns.forEach(btn=>btn.addEventListener('click',async()=>{
      this.engineBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      this.engineManager.setEngine(btn.dataset.engine);
      this.engageStudio('SELECTING');
      await this.updateStatus();
    }));

    this.muteToggleBtn.addEventListener('click',()=>{
      this.voice.unlock();
      const muted=this.voice.toggleMute();
      this.muteToggleBtn.textContent=muted?'VOICE OFF':'VOICE ON';
      if(!muted)this.voice.playRandomVoiceCue('random',0,1);
    });

    this.userPromptInput.addEventListener('input',()=>this.updateCreativeState());
    this.userPromptInput.addEventListener('focus',()=>this.engageStudio('SELECTING',false),{once:true});

    this.modeLiteralBtn.addEventListener('click',()=>{
      this.engageStudio('SELECTING');
      this.setPromptMode('LITERAL');
    });
    this.modeRefineBtn.addEventListener('click',()=>{
      this.engageStudio('REFINING');
      this.setPromptMode('REFINE');
    });
    this.useOriginalBtn.addEventListener('click',()=>{
      this.engageStudio('SELECTING');
      this.setPromptMode('LITERAL');
    });
    this.generateRefinedBtn.addEventListener('click',()=>{
      this.engageStudio('GENERATING');
      this.onGeneratePressed(this.refinedPromptInput.value);
    });

    this.controlSelects.forEach(el=>el.addEventListener('change',()=>{
      if(el.value)this.touchedControls.add(el.id);else this.touchedControls.delete(el.id);
      this.engageStudio('SELECTING');
      this.updateCreativeState();
    }));

    this.generateBtn.addEventListener('click',()=>{
      this.engageStudio('GENERATING');
      this.onGeneratePressed();
    });
  }

  escape(value){
    return String(value||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }

  getStructuredParams(){
    return{
      genre:this.genreSelect.value,
      mood:this.moodSelect.value,
      drums:this.drumSelect.value,
      bpm:parseInt(this.bpmSelect.value,10)||92,
      instrument:this.instrumentSelect.value
    };
  }

  getReadiness(){
    const description=this.userPromptInput.value.trim();
    const words=description.split(/\s+/).filter(Boolean).length;
    const descriptiveEnough=description.length>=30&&words>=6;
    const chosen=this.controlSelects.filter(el=>this.touchedControls.has(el.id)&&el.value).length;
    return{description,words,descriptiveEnough,chosen,ready:descriptiveEnough||chosen>=3};
  }

  buildLiteralPrompt(){
    const raw=FlyZonePromptIntelligence.sanitizePrompt(this.userPromptInput.value);
    if(raw)return raw;
    const p=this.getStructuredParams();
    const pieces=[p.mood,p.genre,'instrumental',p.drums&&`with ${p.drums}`,p.instrument&&`featuring ${p.instrument}`,this.bpmSelect.value&&`at ${p.bpm} BPM`].filter(Boolean);
    return pieces.join(' ');
  }

  updateCreativeState(){
    const state=this.getReadiness();
    this.charCount.textContent=`${this.userPromptInput.value.length} / 500`;
    this.selectionCount.textContent=`${Math.min(state.chosen,3)} / 3 DETAILS`;
    const readinessRow=this.readinessIndicator.closest('.readiness-row');
    readinessRow.classList.toggle('is-ready',state.ready);
    if(state.descriptiveEnough)this.readinessIndicator.textContent='READY · YOUR DESCRIPTION HAS ENOUGH DETAIL';
    else if(state.chosen>=3)this.readinessIndicator.textContent='READY · YOUR SOUND RECIPE IS BUILT';
    else if(state.description)this.readinessIndicator.textContent=`ADD DETAIL OR CHOOSE ${Math.max(0,3-state.chosen)} MORE SOUND OPTIONS`;
    else this.readinessIndicator.textContent=`DESCRIBE THE IDEA OR CHOOSE ${Math.max(0,3-state.chosen)} MORE DETAILS`;
    this.generateBtn.disabled=!state.ready||this.generating;
    this.updateThoughtLog();
  }

  updateThoughtLog(){
    const params=this.getStructuredParams();
    const labels=[
      ['genreSelect','Genre',params.genre],
      ['moodSelect','Mood',params.mood],
      ['drumSelect','Drums',params.drums],
      ['bpmSelect','Tempo',this.bpmSelect.value?`${params.bpm} BPM`:''],
      ['instrumentSelect','Instruments',params.instrument]
    ];
    const items=[];
    const description=this.userPromptInput.value.trim();
    if(description)items.push(`Intent · ${description}`);
    labels.forEach(([id,label,value])=>{if(this.touchedControls.has(id)&&value)items.push(`${label} · ${value}`);});
    this.thoughtLog.innerHTML=items.length?items.map(item=>`<li>${this.escape(item)}</li>`).join(''):'<li class="thought-empty">Your description and sound choices will appear here.</li>';
    this.originalPromptDisplay.textContent=description||((items.length)?'Building from the selected sound recipe.':'Waiting for your direction…');

    const paramsForPrompt=this.getStructuredParams();
    const literal=this.buildLiteralPrompt();
    const output=this.promptMode==='REFINE'
      ?FlyZonePromptIntelligence.refinePrompt(description,paramsForPrompt)
      :(literal||'Your literal prompt will appear as you write or choose sound details.');
    this.refinedPromptInput.value=output;
    this.thoughtModeLabel.textContent=this.promptMode==='REFINE'?'2FLY REFINE · LIVE':'LITERAL MODE';
    this.refinementCard.dataset.mode=this.promptMode;
  }

  setPromptMode(mode){
    this.promptMode=mode;
    const refine=mode==='REFINE';
    this.modeLiteralBtn.classList.toggle('active',!refine);
    this.modeRefineBtn.classList.toggle('active',refine);
    this.updateCreativeState();
  }

  async updateStatus(){
    const health=await this.engineManager.checkCurrentHealth();
    const label=health.selectedEngine==='AUTO'?'AUTO':health.consumerEngineName.toUpperCase();
    this.engineStatusPill.textContent=`${label} · ${health.status}`;
    this.engineDetail.textContent=health.message||health.status;
    this.engineStatusPill.closest('.live-indicator')?.classList.toggle('is-offline',health.status!=='READY');
  }

  async onGeneratePressed(explicitPrompt=''){
    const readiness=this.getReadiness();
    if(!readiness.ready){
      this.trackTitle.textContent='The idea needs one more move';
      this.trackMeta.textContent='Write a descriptive sentence or choose at least three sound details.';
      this.updateCreativeState();
      return;
    }

    const structured=this.getStructuredParams();
    const raw=this.userPromptInput.value.trim();
    const finalPrompt=explicitPrompt||(this.promptMode==='REFINE'
      ?FlyZonePromptIntelligence.refinePrompt(raw,structured)
      :this.buildLiteralPrompt());

    this.generating=true;
    this.generateBtn.disabled=true;
    this.generateRefinedBtn.disabled=true;
    this.generateBtn.querySelector('span').textContent='CREATING…';
    this.trackTitle.textContent='Building your first take…';
    this.trackMeta.textContent=`${finalPrompt.slice(0,120)}${finalPrompt.length>120?'…':''}`;

    const result=await this.engineManager.generate({
      prompt:finalPrompt,
      genre:structured.genre,
      mood:structured.mood,
      drums:structured.drums,
      bpm:structured.bpm,
      instrument:structured.instrument
    });

    this.generating=false;
    this.generateRefinedBtn.disabled=false;
    this.generateBtn.querySelector('span').textContent='CREATE MY BEAT';
    this.updateCreativeState();

    if(result.status==='complete'&&result.audioUrl){
      this.voice.setState('RESULT_READY');
      this.changeVideoForState('RESULT_READY');
      this.trackTitle.textContent=result.title||'FlyZone creation';
      this.trackMeta.textContent=`${result.consumerEngine||'FlyZone'} · ${finalPrompt.slice(0,110)}${finalPrompt.length>110?'…':''}`;
      this.audioPlayer.src=result.audioUrl;
      this.audioPlayer.play().catch(()=>{});
    }else{
      this.trackTitle.textContent='Generation did not complete';
      this.trackMeta.textContent=result.message||'Try the idea again or choose another engine.';
      this.voice.triggerProbabilisticVoice('random',1000,.65);
    }
    await this.updateStatus();
  }
}

document.addEventListener('DOMContentLoaded',()=>new FlyZoneApp().init());
