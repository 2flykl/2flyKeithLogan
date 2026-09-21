// Explicit media ownership; exploration never starts or resumes a song.
class AudioManager {
 constructor(){this.masterMuted=!!localStorage.getItem('universe_muted');this.current=null;this.fadeId=0;}
 unlock(){} // User-gesture compatibility for the original HUD; never starts playback.
 setRegionTheme(){} // Deliberately disabled. Proximity cannot select a song.
 duckAmbient(){}
 restoreAmbient(){} // Closing content must not restart music.
 setMuted(muted){this.masterMuted=muted;if(this.current)this.current.muted=muted;}
 playItem(media){
  cancelAnimationFrame(this.fadeId);
  if(this.current&&this.current!==media)this.current.pause();
  this.current=media;media.muted=this.masterMuted;media.volume=0;
  media.play().then(()=>{if(this.current!==media)return;this.fade(media,1,220);}).catch(()=>{if(this.current===media)media.volume=1;});
 }
 fade(media,target,duration,onDone){
  cancelAnimationFrame(this.fadeId);const start=performance.now(),from=media.volume;
  const tick=()=>{const t=Math.min(1,(performance.now()-start)/duration);media.volume=from+(target-from)*t;if(t<1)this.fadeId=requestAnimationFrame(tick);else onDone?.();};tick();
 }
 stopItem(media){if(!media)return;if(this.current===media){this.fade(media,0,160,()=>{media.pause();if(this.current===media)this.current=null;});}else media.pause();}
 dispose(){cancelAnimationFrame(this.fadeId);this.current?.pause();this.current=null;}
}
export const audioManager=new AudioManager();
