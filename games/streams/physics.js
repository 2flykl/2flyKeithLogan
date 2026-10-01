// Waterline circles are projected to ellipses (Y scale .32). Resolve both
// velocities and contact normals in the same unprojected plane. Current drag
// is an external force; impact impulses persist between frames.
function bodyMass(q){return (.45+q.spec.mass)*q.w/160;}
function riverContact(a,b){
 const radius=(a.w+b.w)*.40;
 const dx=b.x+b.w/2-a.x-a.w/2,dy=(b.y-a.y)/.32;
 const d=Math.hypot(dx,dy);
 if(d>=radius)return;
 return d>1e-8?{nx:dx/d,ny:dy/d,depth:radius-d}:{nx:0,ny:1,depth:radius};
}
function solveRiverContact(a,b){
 const c=riverContact(a,b);if(!c)return;
 const ia=a.anchored?0:1/bodyMass(a),ib=b.anchored?0:1/bodyMass(b),sum=ia+ib;
 if(!sum)return;
 const correction=Math.max(0,c.depth-.05)*.85/sum;
 a.x-=c.nx*correction*ia;a.y-=c.ny*correction*ia*.32;
 b.x+=c.nx*correction*ib;b.y+=c.ny*correction*ib*.32;
 const rvx=b.bodyVX-a.bodyVX,rvy=(b.bodyVY-a.bodyVY)/.32;
 const closing=rvx*c.nx+rvy*c.ny;if(closing>=0)return;
 const impulse=-(1+(closing< -15?.24:0))*closing/sum;
 a.bodyVX-=impulse*c.nx*ia;a.bodyVY-=impulse*c.ny*ia*.32;
 b.bodyVX+=impulse*c.nx*ib;b.bodyVY+=impulse*c.ny*ib*.32;
 const tangent=clamp(-(rvx*-c.ny+rvy*c.nx)/sum,-impulse*.08,impulse*.08);
 a.bodyVX-=tangent*-c.ny*ia;a.bodyVY-=tangent*c.nx*ia*.32;
 b.bodyVX+=tangent*-c.ny*ib;b.bodyVY+=tangent*c.nx*ib*.32;
 if(closing< -18){
  breakRack(a,b);breakRack(b,a);State.collisionCount++;
  if(!a.collisionFlash&&!b.collisionFlash)addParticle((a.x+a.w/2+b.x+b.w/2)/2,(a.y+b.y)/2,'water',4);
  a.collisionFlash=b.collisionFlash=.18;
 }
}
function advanceRiverBodies(dt){
 const bodies=State.platforms.filter(q=>q.active&&!q.retired&&q.kind!=='stage'&&q.alpha>.2&&q.springState!=='submerge');
 for(const q of bodies){
  q.bodyVX??=q.vx||0;q.bodyVY??=q.downstreamSpeed||0;
  q.collisionFlash=Math.max(0,(q.collisionFlash||0)-dt);
  if(q.anchored){q.bodyVX=q.bodyVY=0;q.x=q.anchorX;q.y=q.anchorY;}
 }
 const nearby=bodies.filter(q=>q.y>(State.camera??0)-500&&q.y<(State.camera??0)+(State.h??1000)+350);
 const moorings=nearby.filter(q=>q.anchored);
 for(const q of bodies){
  q.flowAside=0;
  if(!q.anchored)for(const rock of moorings){
   const gap=rock.y-q.y,dx=q.x+q.w/2-rock.x-rock.w/2,reach=(q.w+rock.w)*.42;
   if(gap>0&&gap<210&&Math.abs(dx)<reach+20){
    const side=rock.x+rock.w/2<State.w/2?1:-1;
    q.flowAside+=side*160*(1-gap/210)*Math.max(0,1-Math.abs(dx)/(reach+20));
   }
  }
 }
 const steps=Math.max(1,Math.ceil(dt*180)),h=dt/steps;
 for(let step=0;step<steps;step++){
  for(const q of bodies)if(!q.anchored){
   const drag=1-Math.exp(-h*.65);
   const drift=q.flowAside+(q.vx||0)+Math.sin(State.t*.7+q.driftPhase)*(q.xDriftAmp||0)*.18;
   q.bodyVX+=(drift-q.bodyVX)*drag;q.bodyVY+=((q.downstreamSpeed||0)-q.bodyVY)*drag;
   q.x+=q.bodyVX*h;q.y+=q.bodyVY*h;
  }
  for(let pass=0;pass<4;pass++){
   nearby.sort((a,b)=>a.y-b.y);
   for(let i=0;i<nearby.length;i++)for(let j=i+1;j<nearby.length&&nearby[j].y-nearby[i].y<64;j++)solveRiverContact(nearby[i],nearby[j]);
   for(const q of bodies)if(!q.anchored){
    if(q.x<12){q.x=12;q.bodyVX=Math.abs(q.bodyVX)*.24;}
    if(q.x+q.w>State.w-12){q.x=State.w-12-q.w;q.bodyVX=-Math.abs(q.bodyVX)*.24;}
   }
  }
 }
}
