const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const damp=(a,b,rate,dt)=>a+(b-a)*(1-Math.exp(-rate*Math.max(0,dt)));
export function viewSpan(width,height){const aspect=Math.max(.25,width/Math.max(1,height));return {aspect,span:Math.max(clamp(height/42,7.8,12.2),7.8/aspect)};}
export function cameraFrame(player,width,height,{scale=null,landing=null,intro=false}={}){
 const {aspect,span:base}=viewSpan(width,height);let span=base;
 let x=player.x+clamp((player.vx||0)*.18,-1.1,1.1),y=player.y+base*.24;
 if(scale&&Math.abs(player.y-scale.y)<1.7&&Math.abs(player.x-scale.x)<3.7)x=scale.x+(player.x-scale.x)*.18;
 let points=[{x:player.x-1.05,y:player.y-.4},{x:player.x+1.05,y:player.y+2.8}];
 if(scale&&Math.abs(player.y-scale.y)<1.7&&Math.abs(player.x-scale.x)<3.7)points.push({x:scale.x-3.35,y:scale.y-.15},{x:scale.x+3.35,y:scale.y+4.05});
 if(landing){const lx=landing.x??player.x;points.push({x:lx-1.1,y:landing.y-.3},{x:lx+1.1,y:landing.y+.5});const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x)),minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));span=Math.max(base,(maxX-minX+1.5)/aspect,maxY-minY+1.5);x=(minX+maxX)/2;y=(minY+maxY)/2+.35;}
 const bounds={minX:Math.min(...points.map(p=>p.x)),maxX:Math.max(...points.map(p=>p.x)),minY:Math.min(...points.map(p=>p.y)),maxY:Math.max(...points.map(p=>p.y))};span=Math.max(span,(bounds.maxX-bounds.minX+1.5)/aspect,bounds.maxY-bounds.minY+1.5);x=clamp(x,bounds.maxX-span*aspect/2+.55,bounds.minX+span*aspect/2-.55);y=clamp(y,bounds.maxY-span/2+.55,bounds.minY+span/2-.55);
 if(intro){x=3.8;y=23;span=Math.max(base,10);points=[];}
 return {x,y,span,aspect,points};
}
export function snapCamera(state,player,width,height,options={}){const target=cameraFrame(player,width,height,options);Object.assign(state,{x:target.x,y:target.y,span:target.span,initialized:true});return state;}
export function stepCamera(state,player,width,height,dt,options={}){
 const t=cameraFrame(player,width,height,options);if(!state.initialized)return snapCamera(state,player,width,height,options);
 const dx=t.x-state.x,dy=t.y-state.y,deadX=Math.min(.7,t.span*t.aspect*.07),deadY=.55;
 state.x=damp(state.x,Math.abs(dx)>deadX?t.x-Math.sign(dx)*deadX:state.x,7,dt);
 state.y=damp(state.y,Math.abs(dy)>deadY?t.y-Math.sign(dy)*deadY:state.y,7,dt);
 // Expand immediately when a destination needs it; ease back in after landing.
 state.span=t.span>state.span?t.span:damp(state.span,t.span,3.4,dt);
 // Guard the player, tray silhouette and announced landing point even during rapid travel.
 const halfX=state.span*t.aspect/2-.35,halfY=state.span/2-.45;
 for(const p of t.points){state.x=clamp(state.x,p.x-halfX,p.x+halfX);state.y=clamp(state.y,p.y-halfY,p.y+halfY);}
 return state;
}
export function applyCamera(camera,state,width,height){const aspect=width/Math.max(1,height),half=state.span/2;camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.position.set(state.x+1.4,state.y+2.2,28);camera.lookAt(state.x,state.y,0);camera.updateProjectionMatrix();camera.updateMatrixWorld();}
