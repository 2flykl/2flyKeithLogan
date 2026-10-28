/* Learning and tactical presentation share the real board, but never the scored clock. */
(() => {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tile = (r,c) => document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
  let lesson = null, learned = false;
  const panel = document.createElement('section'); panel.id='lessonPanel'; panel.hidden=true;
  panel.setAttribute('aria-label','Guided practice');
  panel.innerHTML='<div><b id="lessonHeading"></b><p id="lessonCopy" role="status"></p></div><button id="lessonNext" hidden>Next lesson</button><button id="lessonSkip">Skip tutorial</button>';
  document.querySelector('.arena main').prepend(panel);
  const next = panel.querySelector('#lessonNext');
  function finish(){
    learned=true;lesson=null;panel.hidden=true;document.body.classList.remove('learning');
    started=false;startGame(mode);
  }
  panel.querySelector('#lessonSkip').onclick=finish;
  next.onclick=()=>{if(lesson.step===2)finish();else setup(lesson.step+1)};
  function setup(step){
    lesson={step,done:false}; board=emptyBoard(); preview=Array(COLS).fill(null); cursor={r:3,c:3};
    if(step===0){for(let c=3;c<=5;c++)board[3][c]=cell('Heart');}
    if(step===1){board[1][4]=cell('Balloon');board[4][4]=cell('Mind',true);cursor={r:4,c:4};}
    if(step===2){board[3][3]=cell('Heart',true);board[4][4]=cell('Heart',true);board[3][4]=cell('EbonyEyes');cursor={r:3,c:4};}
    next.hidden=true;
    document.querySelector('#lessonHeading').textContent=`PRACTICE ${step+1} / 3 · ${['Lock a connection','Avoid a broken heart','Use a wildcard'][step]}`;
    document.querySelector('#lessonCopy').textContent=[
      'Tap all three hearts to lock them. The flow and song are paused while you learn.',
      'Follow the warning path. Tap the locked blue book to release it before the broken heart arrives.',
      'Tap the glowing eyes to connect the two locked hearts. Diagonal neighbors count too.'
    ][step];
    renderAll(); updateBoardGeometry();
    document.querySelector('#moveFeedback').textContent='Practice only · no score or safety penalties';
  }
  window.beginLessons=()=>{
    rewards.clear();
    if(learned)return;
    clearInterval(secondTimer);clearTimeout(flowTimeout);audio.pause();audio.currentTime=0;
    document.body.classList.add('learning');panel.hidden=false;setup(0);
  };
  window.lessonInput=()=>{
    if(!lesson)return false;
    if(lesson.done)return true;
    const x=board[cursor.r]?.[cursor.c];
    if(lesson.step===0&&x?.type==='Heart'){
      x.locked=!x.locked;x.lockedAt=performance.now();renderBoard();
      if([3,4,5].every(c=>board[3][c].locked))complete('Connection made! Matching traits restore the contestants who want them.');
    }else if(lesson.step===1&&x?.type==='Mind'&&x.locked){
      x.locked=false;renderBoard();complete('Safe release! In the song, unlocking costs 25 points but can prevent a damaging collision.');
    }else if(lesson.step===2&&x?.type==='EbonyEyes'){
      x.locked=true;x.lockedAt=performance.now();renderBoard();complete('Wildcard connected! You are ready. Start the song with a fresh board and full timer.');
    }
    updateStatusLine();
    return true;
  };
  function complete(message){
    lesson.done=true;document.querySelector('#lessonCopy').textContent=message;
    next.textContent=lesson.step===2?'Start the song':'Next lesson';next.hidden=false;
    if(lesson.step!==1){
      document.querySelectorAll('.cell.locked').forEach(e=>e.classList.add('practiceMatch'));
      window.celebrateMatch?.();
    }
  }
  // SVG sits inside the board so lines follow the grid without changing layout.
  window.paintTactics=()=>{
    const host=document.querySelector('#board'); if(!host)return;
        host.querySelectorAll('.connectionLines,.hazardCue').forEach(e=>e.remove());
    host.querySelectorAll('.cell').forEach(e=>{
      e.classList.remove('connectionHint','hazardSource','hazardPath','hazardTarget');
      const label=e.getAttribute('aria-label');if(label)e.setAttribute('aria-label',label.replace(' • Broken heart approaching; unlock to save',''));
      e.title=e.title.split(' • Matching piece')[0].split(' • Lock to complete')[0];
    });
    const links=[];const hinted=new Set();
    const compatible=(a,b)=>a&&b&&a.type!=='Balloon'&&b.type!=='Balloon'&&(a.type===b.type||a.type==='EbonyEyes'||b.type==='EbonyEyes');
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
      const a=board[r][c];if(!a?.locked)continue;
      for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
        const rr=r+dr,cc=c+dc;if(rr<0||rr>=ROWS||cc<0||cc>=COLS||rr*COLS+cc<=r*COLS+c)continue;
        const b=board[rr][cc];if(!b?.locked||!compatible(a,b))continue;
        links.push([r,c,rr,cc]);
        for(const [ar,ac] of [[r,c],[rr,cc]])for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++){
          const nr=ar+y,nc=ac+x;if(nr<0||nr>=ROWS||nc<0||nc>=COLS)continue;
          const n=board[nr][nc];if(!n||(!n.locked&&compatible(a,n)&&compatible(b,n)))hinted.add(`${nr},${nc}`);
        }
      }
    }
    for(const key of hinted){const [r,c]=key.split(',').map(Number),e=tile(r,c);e.classList.add('connectionHint');e.title+=(board[r][c]?' • Lock to complete connection':' • Matching piece can complete a connection here');}
    if(links.length){
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('connectionLines');svg.setAttribute('aria-hidden','true');
      const box=host.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
      for(const [r,c,rr,cc] of links){
        const a=tile(r,c).getBoundingClientRect(),b=tile(rr,cc).getBoundingClientRect();
        const line=document.createElementNS(svg.namespaceURI,'line');
        for(const [name,value] of Object.entries({x1:a.x+a.width/2-box.x,y1:a.y+a.height/2-box.y,x2:b.x+b.width/2-box.x,y2:b.y+b.height/2-box.y}))line.setAttribute(name,value);
        svg.append(line);
      }host.append(svg);
    }
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(board[r][c]?.type==='Balloon'){
      for(let rr=r+1;rr<ROWS;rr++){
        const n=board[rr][c];if(!n)continue;
        if(n.locked){
          tile(r,c).classList.add('hazardSource');
          for(let y=r+1;y<rr;y++)tile(y,c).classList.add('hazardPath');
          const target=tile(rr,c);target.classList.add('hazardTarget');
          const tag=document.createElement('span');tag.className='hazardCue';tag.textContent='UNLOCK TO SAVE';target.append(tag);
          target.setAttribute('aria-label',target.getAttribute('aria-label')+' • Broken heart approaching; unlock to save');
        }break;
      }
    }
  };
  const rewards=new Map();
  window.restoreSafetyReward=(card,i)=>{
    const reward=rewards.get(i);if(!reward||reward.until<performance.now())return;
    card.classList.add('safetyReward');
    const chip=document.createElement('span');chip.className='safetyGain';chip.textContent=reward.text;card.append(chip);
    setTimeout(()=>{chip.remove();card.classList.remove('safetyReward')},Math.max(0,reward.until-performance.now()));
  };
  window.showSafetyReward=(i,trait,gain)=>{
    const text=gain<.5?'Safety full':`+${Math.round(gain)} Safety`;
    rewards.set(i,{text,until:performance.now()+1600});
    const card=document.querySelectorAll('.contestant')[i];if(!card)return;
    window.restoreSafetyReward(card,i);
    const source=[...document.querySelectorAll('.cell.locked')].find(e=>e.dataset.trait===trait||e.dataset.trait==='EbonyEyes');
    if(!source||reduced())return;
    const a=source.getBoundingClientRect(),b=card.getBoundingClientRect();
    const spark=document.createElement('span');spark.className='safetyTrail';
    spark.style.cssText=`left:${a.x+a.width/2}px;top:${a.y+a.height/2}px;background:${getComputedStyle(source).getPropertyValue('--jewel')}`;
    document.body.append(spark);
    const animation=spark.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(${b.x+b.width/2-a.x-a.width/2}px,${b.y+b.height/2-a.y-a.height/2}px) scale(.35)`,opacity:0}],{duration:650,easing:'cubic-bezier(.2,.6,.4,1)'});
    animation.onfinish=()=>spark.remove();setTimeout(()=>spark.remove(),800);
  };
})();
