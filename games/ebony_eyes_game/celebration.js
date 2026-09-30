/* Score reels and earned bursts are brief; the board itself stays still. */
(() => {
 let lastScore=null,lastMatches=0,previousStreak=0;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 window.animateArcadeHud=(value,streak,matches)=>{
  const score=document.querySelector('#score');
  if(value!==lastScore){
   score.innerHTML='<small>SCORE</small><span class="reels">'+value.toLocaleString().split('').map((d,i)=>`<span class="reel"><i style="--reel-delay:${Math.min(i*22,130)}ms">${d}</i></span>`).join('')+'</span>';
   if(lastScore!==null&&value>lastScore&&!reduced())score.animate([{boxShadow:'0 0 0 transparent'},{boxShadow:'0 0 26px #ffe09388'},{boxShadow:'0 0 0 transparent'}],{duration:550});
   lastScore=value;
  }
  if(streak>previousStreak&&!reduced())document.querySelector('#comboBadge').animate([{transform:'translateY(0)'},{transform:'translateY(-4px)',color:'#b6fff0'},{transform:'translateY(0)'}],{duration:420});
  if(matches>lastMatches&&matches%5===0){document.querySelector('#moveFeedback').textContent='★ EBONY EYES · '+matches+' CONNECTIONS ★';}
  previousStreak=streak;lastMatches=matches;
 };
 window.celebrateMatch=()=>{
  if(reduced())return;
  const frame=document.querySelector('#boardContainer');
  for(let i=0;i<14;i++){
   const star=document.createElement('i');star.className='earnedSpark';
   const angle=i*Math.PI*2/14;
   star.style.cssText=`--sx:${Math.cos(angle)*100}px;--sy:${Math.sin(angle)*85-35}px;--spark:${['#ffe4a2','#82ffe0','#ff93d1'][i%3]}`;
   frame.append(star);setTimeout(()=>star.remove(),750);
  }
 };
})();
