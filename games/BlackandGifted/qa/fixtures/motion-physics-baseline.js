/* Read-only motion regression baseline.
 * Source: production games/BlackandGifted/index.html at commit
 * dd9b6a95b745dc92795483252087e3529806a1a3
 * Full original HTML SHA-256: 1c70678305b0d2690e59ab1cdcfabcd33de9f0b83c43e4318b2857db43fd0c99
 * Captured 2026-10-19. These are exact original declarations/functions;
 * no browser side effects run when the test reads this fixture as text.
 */

const PLAYER_SPEED={normal:300,mountain:290,accel:700,runAccel:760};

function input(dt){if(spectator||wallBreakAction||(scene===8&&S.seated))return;let d=(keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0);if(d){P.face=d;const runScene=(scene===3||scene===5||scene===6);const max=scene===1?PLAYER_SPEED.mountain:PLAYER_SPEED.normal;P.vx+=d*(runScene?PLAYER_SPEED.runAccel:PLAYER_SPEED.accel)*dt;P.vx=Math.max(-max,Math.min(max,P.vx))}else P.vx*=Math.pow(.0015,dt);}

function jump(){
  if(spectator||wallBreakAction||paused||!gameStarted||(!P.grounded&&coyoteTime<=0))return;
  jumpBuffer=0;coyoteTime=0;

  if(scene===0&&!P.crowned&&(S.wallDrop?.[0]||0)>=.94&&P.x>S.walls[0]-190){
    S.struggles++;
    if(S.struggles>=1)spawnOpeningGift('first-struggle');
  }

  if(scene===2){
    let edgeX=S.stage===0?S.cliff:((S.platforms[S.stage-1]?.x||0)+(S.platforms[S.stage-1]?.w||0));
    const near=P.face>0 && P.x>edgeX-(S.stage===0?W*.12:W*.10);
    if(near && beginFaithLeap())return;
  }
  P.vy=-620;P.grounded=false;
}

function physics(dt){
  if(spectator)return;
  const wasGrounded=P.grounded,impactSpeed=P.vy;
  if(P.grounded)coyoteTime=.09;else coyoteTime=Math.max(0,coyoteTime-dt);
  jumpBuffer=Math.max(0,jumpBuffer-dt);
  input(dt);
  P.vy+=1450*dt;P.x+=P.vx*dt;P.y+=P.vy*dt;

  // Actual collision uses visible geometry, not an oversized invisible zone.
  if(scene===0&&!P.crowned&&S.walls&&S.walls.length&&(S.wallDrop?.[0]||0)>=.94){
    const wallLeft=S.walls[0]-(S.wallWidth||220)/2;
    const playerHalf=28;
    const stopX=wallLeft-playerHalf;
    if(P.x>stopX){P.x=stopX;P.vx=Math.min(0,P.vx)}
  }


  let gy=ground();
  if(scene===1)gy=mountainY(P.x);
  if(scene===3)gy=runY(P.x);
  if(scene===2)gy=faithGround(P.x);

  const groundTolerance=(scene===1||scene===3)?14:0;
  if(gy!==null&&P.y>=gy-groundTolerance&&P.vy>=-40){P.y=gy;P.vy=0;P.grounded=true}
  else P.grounded=false;
  if(!wasGrounded&&P.grounded&&impactSpeed>150){landingPulse=1;burst(P.x,P.y,9);soundAccent("land");}
  if(jumpBuffer>0&&P.grounded)jump();
  stepClock+=Math.abs(P.vx)*dt;landingPulse=Math.max(0,landingPulse-dt*4);
  P.x=Math.max(60,P.x);
}

function update(dt){sceneTime+=dt;if(spectator){spectator.time+=dt;updateSpectator(dt);camX+=(Math.max(0,P.x-W*.38)-camX)*(1-Math.exp(-5*dt));return}if(wallBreakAction)updateWallBreak(dt);else{physics(dt);if(scene===0)updateAwake(dt);if(scene===1)updateMountain(dt);if(scene===2)updateFaith(dt);if(scene===3)updateRun(dt);if(scene===4)updateAffirm(dt);if(scene===5)updateTunnel(dt);if(scene===6)updateAlignment(dt);if(scene===7)updateMirror(dt);if(scene===8)updateThrone(dt)}for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=600*dt;p.l-=dt}particles=particles.filter(p=>p.l>0);let target=Math.max(0,P.x-W*.30),follow=5.6;if(scene===1&&!S.released&&!S.isPushing){target=Math.max(0,P.x-W*.44);follow=4.2}else if(scene===1&&S.isPushing){target=Math.max(0,P.x-W*.26);follow=3.7}else if(scene===2){target=Math.max(0,P.x-W*.34);follow=4.7}else if(scene===3){target=Math.max(0,P.x-W*.30);follow=5.0;zoom+=(Math.max(.94,1-Math.min(.05,Math.abs(P.vx)/900))-zoom)*Math.min(1,dt*1.7)}else if(scene===5){target=Math.max(0,P.x-W*.31);follow=5.0}else if(scene===6){target=Math.max(0,P.x-W*.34);follow=4.2}else if(scene===7){target=Math.max(0,P.x-W*.42);follow=3.2}camX+=(target-camX)*Math.min(1,dt*follow);shake*=Math.pow(.02,dt)}
