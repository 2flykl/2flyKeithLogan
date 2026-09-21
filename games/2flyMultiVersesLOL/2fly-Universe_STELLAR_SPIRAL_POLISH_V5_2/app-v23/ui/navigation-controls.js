import * as THREE from 'three';
import {NavigationSafety,NAV} from '../state/navigation-safety.js';
export class NavigationControls {
 constructor({scene,cam,canvas,uiLayer,galaxies,themes,getMenuOpen,closeMenus,onSelectCleared,onExit}){
  Object.assign(this,{cam,canvas,uiLayer,galaxies,themes,getMenuOpen,closeMenus,onExit,onSelectCleared});this.items=new Map();this.lastState='';this.galaxySelection=null;
  const boundaries=galaxies.map(g=>({id:g.getId(),center:{...themes[g.getId()].worldOffset.reduce((o,v,i)=>(o[['x','y','z'][i]]=v,o),{})},entryRadius:g.getShellBoundaryRadius()*1.06,exitRadius:g.getShellBoundaryRadius()*1.80}));
  this.policy=new NavigationSafety({boundaries,onChange:s=>this.changed(s),onReturn:p=>this.safeReturn(p)});
  this.indicator=document.createElement('aside');this.indicator.id='flight-state';this.indicator.innerHTML='<div id="flight-caption" role="status"></div><small id="flight-detail"></small><div class="flight-actions"><button id="exit-galaxy">Exit galaxy →</button><button id="approach-selection" hidden>Frame selected</button><button id="forward-thrust" aria-label="Hold to thrust forward">HOLD TO THRUST</button></div>';uiLayer.appendChild(this.indicator);
  this.effects=document.createElement('div');this.effects.id='navigation-effects';this.effects.setAttribute('aria-hidden','true');this.effects.innerHTML='<div class="cosmic-ripple"></div><div class="wormhole-rings">'+Array.from({length:8},(_,i)=>`<i style="--i:${i}"></i>`).join('')+'</div><div class="transit-title"></div>';document.getElementById('universe-root').appendChild(this.effects);
  const texture=new THREE.MeshBasicMaterial({color:0xa4ffdf,transparent:true,opacity:.3,depthWrite:false,depthTest:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});this.aura=new THREE.Mesh(new THREE.RingGeometry(1.045,1.05,96),texture);this.aura.visible=false;this.aura.renderOrder=30;scene.add(this.aura);
  this.indicator.querySelector('#exit-galaxy').onclick=()=>this.exit();
  this.indicator.querySelector('#approach-selection').onclick=()=>{const selected=this.policy.selection;if(!selected||this.policy.locked||this.getMenuOpen())return;const p=selected.world();cam.frameObject(p,selected.radius||150);};
  const thrust=this.indicator.querySelector('#forward-thrust');
  thrust.addEventListener('pointerdown',e=>{if(this.policy.locked||this.getMenuOpen())return;e.preventDefault();thrust.setPointerCapture(e.pointerId);cam._startThrust(innerWidth/2,innerHeight/2);});
  const release=()=>{cam._stopThrust(true);this.policy.interrupt();};['pointerup','pointercancel','lostpointercapture'].forEach(n=>thrust.addEventListener(n,release));
  window.addEventListener('keydown',e=>{if(e.repeat||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||this.policy.locked||this.getMenuOpen())return;if(e.code==='KeyW'&&e.target===canvas){e.preventDefault();cam._startThrust(innerWidth/2,innerHeight/2);}});
  window.addEventListener('keyup',e=>{if(e.code==='KeyW')release();});
  window.addEventListener('blur',()=>{cam.stopMotion();this.policy.interrupt();});document.addEventListener('visibilitychange',()=>{if(document.hidden){cam.stopMotion();this.policy.interrupt();}});
  document.addEventListener('pointerdown',e=>{if(e.target.closest('button,[role=button],a,input')&&!e.target.closest('#forward-thrust')){cam.stopMotion();this.policy.interrupt();}},true);
  document.addEventListener('keydown',e=>{if(e.repeat&&(e.key==='Enter'||e.key===' '))e.preventDefault();},true);
  canvas.tabIndex=0;this.changed(this.policy.snapshot());
 }
 register(item){this.items.set(item.key,item);return item;}
 clear(){this.policy.clearSelection();this.galaxySelection=null;this.cam.clearSelectedTarget();this.aura.visible=false;this.syncSelection();}
 changed(s){
  if(!this.indicator)return;
  const g=this.themes[s.galaxyId];
  this.cam.localGalaxyId=s.galaxyId;if(g)this.cam.localGalaxyCenter.set(...g.worldOffset);
  if(s.state!==this.lastState){
   if(s.state===NAV.ENTERING)this.resumeFlight=this.cam.fly;
   if(s.state===NAV.INSIDE&&this.lastState===NAV.ENTERING&&this.resumeFlight){const f=this.resumeFlight;this.resumeFlight=null;this.cam.flyTo(f.endPos,f.endTarget,{duration:800,onDone:f.onDone});}
   if(this.policy.locked){this.closeMenus();this.cam.stopMotion({cancelFlight:s.state!==NAV.EXITING});}
   if(s.state===NAV.ENTERING||s.state===NAV.EXITING||s.state===NAV.TRANSIT){this.cam.clearSelectedTarget();this.galaxySelection=null;this.aura.visible=false;}
   this.effects.dataset.phase=s.state;
   this.effects.style.setProperty('--galaxy-color','#'+(g?.accentColor||0x78dcca).toString(16).padStart(6,'0'));
   const titles={[NAV.ENTERING]:`Entering ${g?.title||'galaxy'}`,[NAV.EXITING]:'Returning to the Universe',[NAV.TRANSIT]:'The Universe is guiding you home',[NAV.ARRIVAL]:'A familiar constellation. A new perspective.'};
   this.effects.querySelector('.transit-title').textContent=titles[s.state]||'';
   this.lastState=s.state;
  }
  this.indicator.dataset.state=s.state;this.indicator.dataset.galaxy=s.galaxyId||'';
  const label=s.galaxyId?g.title:'UNIVERSE TRAVEL';
  this.indicator.querySelector('#flight-caption').textContent=label;
  const detail=s.state===NAV.SELECTED?`${this.policy.selection?.label} — orbit focused. Click again to open, or frame it.`:s.state===NAV.CONTENT?'Content open · close to return to this exact view':s.state===NAV.CHARGING?'Warp charging · release thrust to cancel':this.policy.locked?s.state:s.galaxyId?'Orbit: galaxy core · select a world to orbit it':'Choose a galaxy · hold thrust to explore';
  this.indicator.querySelector('#flight-detail').textContent=detail;
  const exit=this.indicator.querySelector('#exit-galaxy');exit.textContent=s.galaxyId?'Exit galaxy →':'Return to Universe View';exit.disabled=this.policy.locked;
  this.indicator.querySelector('#forward-thrust').disabled=this.policy.locked||s.state===NAV.CONTENT;
  this.indicator.querySelector('#approach-selection').hidden=!s.selectionKey||!!this.getMenuOpen();
  this.syncSelection();this.syncGates();
  this.cam.setInputLocked(this.policy.locked||this.policy.content||!!this.getMenuOpen());
  window.dispatchEvent(new CustomEvent('2fly-navigation-state',{detail:s}));
 }
 syncSelection(){
  const selected=this.policy.selection;
  this.indicator.querySelector('#approach-selection').hidden=!selected||!!this.getMenuOpen();
  document.querySelectorAll('.pf-row,.chapter-project').forEach(b=>{const key=b.dataset.id?'child:'+b.dataset.id:'object:'+b.dataset.project;b.classList.toggle('intent-selected',key===selected?.key);b.setAttribute('aria-pressed',String(key===selected?.key));});
  if(!selected){this.aura.visible=false;if(!this.galaxySelection)this.cam.clearSelectedTarget();return;}
  this.cam.setSelectedTarget(selected.world(),selected.label);
 }
 syncGates(){
  const p=this.policy;document.querySelectorAll('[data-era]').forEach(b=>b.disabled=p.locked||!!(p.galaxyId&&p.galaxyId!==b.dataset.era));
  document.querySelectorAll('[data-project]').forEach(b=>{const i=this.items.get('object:'+b.dataset.project);b.disabled=!i||!p.canSelectLocal(i.galaxyId);});
  document.querySelectorAll('.nav-tree-item').forEach(b=>{const id=b.dataset.type==='galaxy'?b.dataset.id:b.dataset.type==='region'?b.dataset.parentId:this.items.get('object:'+b.dataset.id)?.galaxyId;const denied=p.locked||!!(p.galaxyId&&id!==p.galaxyId);b.setAttribute('aria-disabled',String(denied));});
 }
 clickItem(item,event){
  if(!item)return false;
  const result=this.policy.choose(item,event,this.cam.camera.position);
  if(result==='selected'){this.syncSelection();return true;}
  if(result==='activate'){this.aura.visible=false;this.cam.clearSelectedTarget();item.open();return true;}
  if(result==='out-of-range')this.indicator.querySelector('#flight-detail').textContent='Move closer to this local signal before selecting it.';
  if(result==='wait')this.indicator.querySelector('#flight-detail').textContent='Selected. Pause briefly, then click once to open.';
  return false;
 }
 clickKey(key,event={}){return this.clickItem(this.items.get(key),event);}
 pick(raycaster,e){
  const eligible=[...this.items.values()].filter(i=>i.mesh&&this.policy.canSelectLocal(i.galaxyId)&&i.mesh.visible&&this.cam.camera.position.distanceTo(i.world())<=i.range);

  const hits=raycaster.intersectObjects(eligible.map(i=>i.mesh),true);
  for(const hit of hits){let obj=hit.object;while(obj){const found=eligible.find(i=>i.mesh===obj);if(found)return found;obj=obj.parent;}}
  // Small satellites receive a restrained screen-space hit area, after galaxy/range filtering.
  let best=null,px=Infinity;
  for(const item of eligible){const ndc=item.world().clone().project(this.cam.camera);if(ndc.z<0||ndc.z>1)continue;const d=Math.hypot(e.clientX-(ndc.x*.5+.5)*innerWidth,e.clientY-(-ndc.y*.5+.5)*innerHeight);if(d<18&&d<px){best=item;px=d;}}
  if(best)return best;
  let closest=Infinity,star=null;
  for(const i of this.items.values()){
   if(!i.sphereOnly||!this.policy.canSelectLocal(i.galaxyId)||this.cam.camera.position.distanceTo(i.world())>i.range)continue;
   const point=raycaster.ray.intersectSphere(new THREE.Sphere(i.world(),i.radius),new THREE.Vector3());
   if(point){const d=point.distanceTo(this.cam.camera.position);if(d<closest){closest=d;star=i;}}
  }return star;
 }
 enter(id){
  if(!this.policy.canTravelToGalaxy(id))return false;
  if(this.policy.galaxyId===id)return true;
  this.clear();this.closeMenus();const g=this.policy.boundaries.find(g=>g.id===id);if(!g)return false;
  this.cam.travelToObject(g.center,g.entryRadius*.60,{saveHistory:true});return true;
 }
 exit(){
  if(this.policy.locked)return false;
  this.closeMenus();this.clear();this.onExit?.();this.policy.exit();
  const target=this.policy.arrivals[0];this.cam.flyTo(target,{x:0,y:0,z:0},{duration:1100,saveHistory:false});return true;
 }
 safeReturn(point){
  this.cam.stopMotion();this.cam.historyStack=[];this.cam.clearZoomAnchor();this.cam.clearSelectedTarget();this.cam.restoreSnapshot({position:[point.x,point.y,point.z],target:[0,0,0]},false);this.cam.localGalaxyId=null;this.cam.isIdleDrifting=false;this.cam._onActivity();this.onExit?.();
 }
 beforeFrame(){const blocked=this.policy.locked||this.policy.content||!!this.getMenuOpen();this.cam.setInputLocked(blocked);}
 afterFrame(dt){
  this.policy.update(dt,{position:this.cam.camera.position,velocity:this.cam.travelVelocity,thrust:this.cam.thrusting,menu:!!this.getMenuOpen(),flying:!!this.cam.fly});
  this.uiLayer.inert=this.policy.locked||document.getElementById('overlay-layer').getAttribute('aria-hidden')==='false';
  this.cam.localGalaxyId=this.policy.galaxyId;
  if(this.policy.state===NAV.CHARGING)this.effects.style.setProperty('--charge',Math.min(1,this.policy.charge/3));else this.effects.style.setProperty('--charge',0);
  const item=this.policy.selection;
  this.aura.visible=!!item;if(item){this.aura.position.copy(item.world());this.aura.quaternion.copy(this.cam.camera.quaternion);const radius=item.radius||120;const pulse=matchMedia('(prefers-reduced-motion: reduce)').matches?1:1+.025*Math.sin(this.policy.clock*3);this.aura.scale.setScalar(radius*pulse);this.cam.setSelectedTarget(this.aura.position,item.label);}
 }
}

