/* Silent windshield footage. Music stays exclusively in rideAudio. */
(() => {
  const video=document.getElementById('realWorldVideo'),notice=document.getElementById('realWorldNotice');
  const scene=document.getElementById('scene'),rig=document.getElementById('cabinRig');
  const sample=document.createElement('canvas');sample.width=24;sample.height=14;
  const ctx=sample.getContext('2d',{willReadFrequently:true});
  let selected=false,started=false,reduced=false,token=0,last=0,brightness=.6,tint=.5,cycles=0,lastMedia=0,metadata=null;
  let playingRequest=false;
  video.muted=true;video.defaultMuted=true;video.loop=true;video.playbackRate=1;
  fetch('assets/real-world/residential-route.json').then(r=>{if(!r.ok)throw Error('Route metadata unavailable');return r.json();}).then(data=>{metadata=data;}).catch(()=>{});
  function shouldPlay(){return selected&&started&&!reduced&&!document.hidden;}
  async function sync(){
    const request=++token;
    if(!shouldPlay()){video.pause();return;}
    if(playingRequest)return;
    playingRequest=true;
    try{await video.play();if(request!==token&&!shouldPlay())video.pause();notice.hidden=true;}
    catch(error){if(shouldPlay()&&error.name!=='AbortError'){notice.hidden=false;notice.textContent='Tap to resume the windshield';}}
    finally{playingRequest=false;}
  }
  window.addEventListener('ride-state',event=>{
    const wasStarted=started;
    selected=window.RIDE_ROUTE==='real';started=event.detail.started;reduced=event.detail.reduced;
    if(selected&&started&&!wasStarted){video.currentTime=0;lastMedia=0;cycles=0;}
    if(selected){document.getElementById('directions').hidden=true;if(!video.getAttribute('src')){video.src='assets/real-world/residential-to-coast.mp4';video.load();}}
    void sync();
  });
  notice.addEventListener('click',()=>{if(video.error)video.load();void sync();});
  video.addEventListener('loadeddata',()=>{notice.hidden=true;if(selected)paint(0);if(shouldPlay())void sync();});
  video.addEventListener('error',()=>{notice.hidden=false;notice.textContent='Footage could not load. Tap to retry.';});
  video.addEventListener('waiting',()=>{if(shouldPlay()){notice.hidden=false;notice.textContent='Loading your neighborhood drive…';}});
  video.addEventListener('playing',()=>{notice.hidden=true;});
  document.addEventListener('visibilitychange',()=>void sync());
  window.addEventListener('pagehide',()=>video.pause());
  function paint(dt){
    const t=video.currentTime;
    if(t<lastMedia-.5)cycles++;lastMedia=t;
    const chapter=metadata?.chapters?.findLast(c=>t>=c.start);
    const fading=metadata&&t>=metadata.forwardSeconds;
    document.getElementById('routeLabel').textContent=fading?'BACK TO THE NEIGHBORHOOD':chapter?.label??'NEIGHBORHOOD CRUISE';
    document.getElementById('speedLabel').textContent='REAL WORLD VIEW · JUST KEEP ROLLIN';
    if(video.readyState>=2&&ctx){
      try{
        ctx.drawImage(video,0,0,24,14);const pixels=ctx.getImageData(0,0,24,14).data;let light=0,warm=0;
        for(let i=0;i<pixels.length;i+=4){light+=(pixels[i]*.2126+pixels[i+1]*.7152+pixels[i+2]*.0722)/255;warm+=(pixels[i]-pixels[i+2])/255;}
        light/=336;warm/=336;const smoothing=dt?1-Math.exp(-dt*2.2):1;
        brightness+=(light-brightness)*smoothing;tint+=(warm-tint)*smoothing;
        scene.style.setProperty('--footage-exposure',Math.min(1.04,.44+brightness*1.05).toFixed(3));
        scene.style.setProperty('--footage-warmth',Math.min(.3,Math.max(.035,tint*.75)).toFixed(3));
        scene.style.setProperty('--daylight',(.06+brightness*.18).toFixed(3));
        scene.style.setProperty('--reflection',(.025+brightness*.16).toFixed(3));
        scene.style.setProperty('--reflect-x',`${Math.sin(t*.21)*65}px`);
      }catch{/* Playback remains usable when a replacement video disallows pixel sampling. */}
    }
    if(dt&&!reduced){
      const motion=.7+.3*Math.sin(t*.17);
      rig.style.setProperty('--rig-x',`${Math.sin(t*1.73)*.35*motion}px`);
      rig.style.setProperty('--rig-y',`${(Math.sin(t*4.19)*.26+Math.sin(t*1.37)*.3)*motion}px`);
      rig.style.setProperty('--rig-roll',`${Math.sin(t*.53)*.035}deg`);
    }
  }
  function frame(now){requestAnimationFrame(frame);if(!selected||!started||reduced||document.hidden||video.paused){last=0;return;}if(now-last<110)return;const dt=last?Math.min((now-last)/1000,.3):.12;last=now;paint(dt);}
  requestAnimationFrame(frame);
  window.RealWorldRide={get stats(){return {selected,playing:!video.paused,time:video.currentTime,duration:video.duration,reverse:false,chapter:metadata?.chapters?.findLast(c=>video.currentTime>=c.start)?.source,fade:!!metadata&&video.currentTime>=metadata.forwardSeconds,cycles,brightness,ready:video.readyState>=2};}};
})();
