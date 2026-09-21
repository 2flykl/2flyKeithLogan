
const $=s=>document.querySelector(s);
let data,roomIndex=0,view=0,time=0,total=1,timer=null,playing=false,saved=[],lost=[];
const scene=$('#scene'),next=$('#sceneNext'),game=$('#game'),music=$('#music');music.volume=.34;
async function init(){data=await fetch('data.json').then(r=>r.json());setScene(0,0,true)}
function room(){return data.rooms[roomIndex]}
function bg(roomId,v){return `assets/rooms/${roomId}_${v}.jpg`}
function currentItem(){return room().items.find(i=>i.view===view)}
function setScene(r,v,instant=false,dir=1){
  const url=bg(data.rooms[r].id,v);
  if(instant){scene.style.backgroundImage=`url("${url}")`;return}
  next.style.backgroundImage=`url("${url}")`;game.style.setProperty('--turn-x',dir>0?'-4%':'4%');game.classList.add('turning');
  setTimeout(()=>{scene.style.backgroundImage=next.style.backgroundImage;game.classList.remove('turning')},430)
}
function startRoom(){
  const q=room();view=0;time=q.time;total=q.time;
  $('#promptTitle').textContent=q.prompt;$('#promptHint').textContent=q.hint;$('#hud').textContent=`ROOM ${roomIndex+1} OF ${data.rooms.length} · ${q.name.toUpperCase()}`;
  setScene(roomIndex,view,true);update();clearInterval(timer);timer=setInterval(()=>{time-=.1;if(time<=0){time=0;finishRoom(false)}updateTimer()},100)
}
function updateTimer(){const pct=Math.max(0,time/total)*100;$('#timer').style.setProperty('--pct',pct+'%');$('#timerText').textContent=Math.ceil(time)}
function update(){
  $('#status').textContent=`${room().name.toUpperCase()} · VIEW ${view+1} OF 8`;
  const item=currentItem();$('#focus').classList.remove('show');$('#itemCard').classList.remove('show');$('#takeBtn').classList.remove('show');
  if(item){
    $('#itemName').textContent=item.name;$('#itemImage').src=`assets/items/${item.id}.jpg`;$('#itemCard').classList.add('show');
    if(item.status==='savable'){$('#focus').classList.add('show');$('#takeBtn').classList.add('show');$('#takeBtn').textContent=`SAVE ${item.name.toUpperCase()}`}
    else{$('#itemName').textContent=item.name+' · TOO LATE';}
  }
  updateTimer()
}
function rotate(dir){
  if(!playing)return;view=(view+dir+8)%8;setScene(roomIndex,view,false,dir);setTimeout(update,180)
}
function take(){
  const item=currentItem();if(!item||item.status!=='savable')return;
  saved.push(item.name);room().items.forEach(x=>{if(x.name!==item.name)lost.push(x.name)});finishRoom(true)
}
function finishRoom(chosen){
  clearInterval(timer);
  if(!chosen)room().items.forEach(x=>lost.push(x.name));
  roomIndex++;
  if(roomIndex>=data.rooms.length)return finishGame();
  setTimeout(startRoom,420)
}
function finishGame(){
  playing=false;music.pause();$('#end').classList.remove('hidden');
  const uniq=a=>[...new Set(a)];
  $('#savedList').innerHTML=(uniq(saved).length?uniq(saved):['Nothing']).map(x=>`<li>${x}</li>`).join('');
  $('#lostList').innerHTML=uniq(lost).map(x=>`<li>${x}</li>`).join('');
  $('#reflection').textContent='The game does not grade whether your choices were correct. It reveals what became important when time, access, certainty, and control disappeared.'
}
$('#startBtn').onclick=()=>{$('#intro').classList.add('hidden');playing=true;music.play().catch(()=>{});startRoom()};
$('#leftBtn').onclick=()=>rotate(-1);$('#rightBtn').onclick=()=>rotate(1);$('#takeBtn').onclick=take;
$('#exitBtn').onclick=()=>{if(window.parent!==window){window.parent.postMessage('closeExperience','*')}else{window.location.href='../../#experiences'}};
addEventListener('keydown',e=>{if(e.key==='ArrowLeft')rotate(-1);if(e.key==='ArrowRight')rotate(1);if(e.key==='ArrowUp')take()});
init();
