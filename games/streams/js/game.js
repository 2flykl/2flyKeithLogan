
'use strict';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
const $ = selector => document.querySelector(selector);

const STREAMS_AUDIO_URL =
  'https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3';

const MEDIA_DEFINITIONS = {
  gold_microphone: { width:[150,210], visual:0.58, rotation:Math.PI/2, weight:0.78 },
  platinum_record: { width:[155,230], visual:0.54, rotation:0, weight:0.82 },
  rare_vinyl: { width:[155,235], visual:0.54, rotation:0, weight:0.84 },
  mpc: { width:[170,260], visual:0.52, rotation:0, weight:1.05 },
  boombox: { width:[210,330], visual:0.49, rotation:0, weight:1.28 },
  producer_laptop: { width:[190,290], visual:0.52, rotation:0, weight:1.16 },
  headphones: { width:[145,220], visual:0.58, rotation:0, weight:0.78 },
  gold_chain: { width:[135,205], visual:0.52, rotation:0, weight:0.7 },
  diamond_ring: { width:[130,190], visual:0.54, rotation:0, weight:0.68 },
  legendary_cassette: { width:[160,235], visual:0.48, rotation:0, weight:0.88 },
  contract: { width:[145,215], visual:0.6, rotation:-0.08, weight:0.76 },
  studio_key: { width:[130,190], visual:0.58, rotation:0.12, weight:0.66 }
};

const MEDIA_NAMES = Object.keys(MEDIA_DEFINITIONS);
const FRAME_COUNTS = window.STREAMS_FRAME_COUNTS || {
  idle:8, run:10, jump:12, land:7
};

const assets = {
  media:{},
  character:{ idle:[], run:[], jump:[], land:[] }
};

const state = {
  width:0,
  height:0,
  dpr:1,
  running:false,
  ready:false,
  lastTime:0,
  elapsed:0,
  cameraTop:0,
  startWorldY:0,
  stageWorldY:-3900,
  routeHeadY:0,
  routeCenterX:0,
  routeLane:2,
  platforms:[],
  pennies:[],
  attentionBalls:[],
  particles:[],
  player:null,
  value:0,
  attention:0,
  soundtrackWanted:true
};

const input = {
  left:false,
  right:false,
  jumpBuffer:0,
  dashDirection:0,
  dashHeld:false,
  dashTimer:0,
  lastPress:{ left:-9999, right:-9999 }
};

const soundtrack = $('#soundtrack');
soundtrack.src = STREAMS_AUDIO_URL;
soundtrack.volume = 0.55;

function loadImage(url){
  return new Promise((resolve,reject)=>{
    const image = new Image();
    image.onload = ()=>resolve(image);
    image.onerror = ()=>reject(new Error(`Could not load ${url}`));
    image.src = url;
  });
}

async function loadAssets(){
  for(const name of MEDIA_NAMES){
    assets.media[name] = await loadImage(`assets/objects/${name}.png`);
  }

  for(const [animation,count] of Object.entries(FRAME_COUNTS)){
    for(let index=0; index<count; index+=1){
      assets.character[animation].push(
        await loadImage(
          `assets/character/${animation}/${String(index).padStart(2,'0')}.png`
        )
      );
    }
  }

  state.ready = true;
  document.body.dataset.ready = 'true';
}

function resize(){
  state.dpr = Math.min(devicePixelRatio || 1, 2);
  state.width = canvas.clientWidth;
  state.height = canvas.clientHeight;
  canvas.width = Math.round(state.width * state.dpr);
  canvas.height = Math.round(state.height * state.dpr);
  ctx.setTransform(state.dpr,0,0,state.dpr,0,0);
}
addEventListener('resize',resize);
resize();

function randomBetween(min,max){
  return min + Math.random() * (max-min);
}

function clamp(value,min,max){
  return Math.max(min,Math.min(max,value));
}

function currentSettings(){
  if(!state.player || state.elapsed < 16){
    return {
      speed:11,
      gapMin:92,
      gapMax:112,
      routeShift:110,
      widthScale:1.16,
      attentionChance:0.24
    };
  }

  const progress = clamp(
    (state.startWorldY - state.player.y) /
    (state.startWorldY - state.stageWorldY),
    0,
    1
  );

  return {
    speed:16 + progress * 28,
    gapMin:96 + progress * 17,
    gapMax:121 + progress * 24,
    routeShift:118 + progress * 42,
    widthScale:1.05 - progress * 0.13,
    attentionChance:0.17 + progress * 0.25
  };
}

function laneCenter(lane){
  const margin = 54;
  const usable = state.width - margin * 2;
  return margin + usable * (lane / 4);
}

function chooseNextLane(previousLane){
  const candidates = [0,1,2,3,4].filter(lane => lane !== previousLane);
  const reachable = candidates.filter(lane => Math.abs(lane-previousLane) <= 2);
  return reachable[Math.floor(Math.random()*reachable.length)];
}

function platformWidthFor(assetName,scale=1){
  const definition = MEDIA_DEFINITIONS[assetName];
  return randomBetween(definition.width[0],definition.width[1]) * scale;
}

function createPlatform({
  x,y,width,assetName,flowFactor=1,anchored=false,tutorial=false,route=true
}){
  const definition = MEDIA_DEFINITIONS[assetName];

  return {
    id:`${Date.now()}-${Math.random()}`,
    x,
    y,
    previousX:x,
    previousY:y,
    width,
    height:Math.max(32,width*0.12),
    visualHeight:Math.max(72,width*definition.visual),
    assetName,
    baseRotation:definition.rotation,
    rotation:(Math.random()-.5)*0.045,
    rotationVelocity:(Math.random()-.5)*0.012,
    rock:0,
    rockVelocity:0,
    flowFactor:flowFactor/definition.weight,
    lateralVelocity:anchored ? 0 : randomBetween(-11,11),
    anchored,
    tutorial,
    route,
    bob:Math.random()*Math.PI*2,
    splash:0,
    flowImpulse:0,
    recoilX:0,
    landed:false
  };
}

function seedRoute(){
  state.platforms = [];
  state.pennies = [];
  state.attentionBalls = [];
  state.particles = [];

  const starterWidth = clamp(state.width*0.46,280,430);
  const starterX = state.width/2 - starterWidth/2;
  const starterY = state.height*0.72;

  state.startWorldY = starterY;
  state.cameraTop = 0;
  state.routeHeadY = starterY;
  state.routeCenterX = state.width/2;
  state.routeLane = 2;

  const starter = createPlatform({
    x:starterX,
    y:starterY,
    width:starterWidth,
    assetName:'boombox',
    flowFactor:0.15,
    anchored:true,
    tutorial:true,
    route:true
  });
  state.platforms.push(starter);

  state.player = {
    x:state.width/2-31,
    y:starterY-118,
    previousY:starterY-118,
    width:62,
    height:118,
    velocityX:0,
    velocityY:0,
    grounded:true,
    standingOn:starter,
    coyote:0.12,
    landTimer:0,
    facing:1,
    animation:'idle',
    animationFrame:0,
    animationClock:0
  };

  generateRouteTo(state.stageWorldY);
}

function generateRouteTo(targetY){
  let sequence = 0;

  while(state.routeHeadY > targetY){
    const settings = currentSettings();
    const tutorial = sequence < 12;

    const gap = tutorial
      ? randomBetween(92,108)
      : randomBetween(settings.gapMin,settings.gapMax);

    state.routeHeadY -= gap;

    let nextLane;
    if(tutorial){
      const tutorialPattern = [1,3,2,0,2,4,3,1,2,4,2,0];
      nextLane = tutorialPattern[sequence % tutorialPattern.length];
    }else{
      nextLane = chooseNextLane(state.routeLane);
    }

    const assetName = MEDIA_NAMES[
      Math.floor(Math.random()*MEDIA_NAMES.length)
    ];

    const largePlatform = !tutorial && Math.random() < 0.14;
    const widthScale = (
      tutorial ? 1.18 :
      largePlatform ? 1.36 :
      settings.widthScale
    );

    const width = clamp(
      platformWidthFor(assetName,widthScale),
      tutorial ? 190 : 125,
      largePlatform ? 390 : 315
    );

    const center = clamp(
      laneCenter(nextLane) + randomBetween(-22,22),
      width/2+24,
      state.width-width/2-24
    );

    const anchored =
      tutorial ? sequence===4 || sequence===9 :
      Math.random() < 0.095 || sequence%11===0;

    const flowFactor = anchored
      ? 0.08
      : tutorial
        ? randomBetween(0.42,0.67)
        : largePlatform
          ? randomBetween(0.45,0.72)
          : randomBetween(0.74,1.24);

    const routePlatform = createPlatform({
      x:center-width/2,
      y:state.routeHeadY,
      width,
      assetName,
      flowFactor,
      anchored,
      tutorial,
      route:true
    });

    state.platforms.push(routePlatform);

    if(sequence===2 || sequence===6 || sequence===10 || (!tutorial && Math.random()<0.18)){
      state.pennies.push({
        x:center,
        y:state.routeHeadY-39,
        radius:11,
        velocityX:routePlatform.lateralVelocity,
        flowFactor:routePlatform.flowFactor,
        spin:Math.random()*Math.PI,
        attachedTo:Math.random()<0.72 ? routePlatform : null
      });
    }

    if(!tutorial && Math.random()<0.27){
      const sideLaneChoices = [0,1,2,3,4].filter(
        lane => Math.abs(lane-nextLane)>=2
      );

      if(sideLaneChoices.length){
        const sideLane = sideLaneChoices[
          Math.floor(Math.random()*sideLaneChoices.length)
        ];
        const sideAsset = MEDIA_NAMES[
          Math.floor(Math.random()*MEDIA_NAMES.length)
        ];
        const sideWidth = clamp(
          platformWidthFor(sideAsset,randomBetween(.76,.98)),
          115,
          235
        );
        const sideCenter = clamp(
          laneCenter(sideLane)+randomBetween(-18,18),
          sideWidth/2+18,
          state.width-sideWidth/2-18
        );

        state.platforms.push(createPlatform({
          x:sideCenter-sideWidth/2,
          y:state.routeHeadY+randomBetween(-22,28),
          width:sideWidth,
          assetName:sideAsset,
          flowFactor:randomBetween(.72,1.35),
          anchored:Math.random()<.05,
          tutorial:false,
          route:false
        }));
      }
    }

    // Blue X attention balls appear throughout the full run, including
    // the opening tutorial. Early balls are smaller, slower, and placed
    // away from the guaranteed route so the lesson stays fair.
    const guaranteedOpeningBall = tutorial && [1,4,8,11].includes(sequence);
    const attentionRoll = tutorial ? 0.24 : settings.attentionChance;

    if(guaranteedOpeningBall || Math.random()<attentionRoll){
      const routeSide = center < state.width/2 ? 1 : -1;
      const safeOffset = tutorial
        ? routeSide*randomBetween(115,190)
        : randomBetween(-185,185);

      state.attentionBalls.push({
        x:clamp(
          center+safeOffset,
          tutorial ? 34 : 30,
          state.width-(tutorial ? 34 : 30)
        ),
        y:state.routeHeadY-randomBetween(22,58),
        radius:tutorial
          ? randomBetween(15,19)
          : (Math.random()<.14 ? 28 : randomBetween(17,23)),
        velocityX:tutorial
          ? randomBetween(-5,5)
          : randomBetween(-10,10),
        flowFactor:tutorial
          ? randomBetween(.72,.96)
          : randomBetween(.82,1.3),
        rotation:Math.random()*Math.PI
      });
    }

    state.routeCenterX = center;
    state.routeLane = nextLane;
    sequence += 1;
  }

  const stageWidth = clamp(state.width*.58,430,720);
  state.platforms.push({
    ...createPlatform({
      x:state.width/2-stageWidth/2,
      y:state.stageWorldY,
      width:stageWidth,
      assetName:'platinum_record',
      flowFactor:0,
      anchored:true,
      route:true
    }),
    isStage:true,
    visualHeight:76
  });
}

function resetGame(){
  state.elapsed = 0;
  state.value = 0;
  state.attention = 0;
  state.stageWorldY = -3900;
  input.jumpBuffer = 0;
  input.dashDirection = 0;
  input.dashHeld = false;
  input.dashTimer = 0;
  $('#tutorial').classList.remove('hide');
  seedRoute();
  updateInterface();
}

function screenY(worldY){
  return worldY-state.cameraTop;
}

function playerBottom(){
  return state.player.y+state.player.height;
}

function spawnParticles(x,y,type,count=12){
  for(let index=0; index<count; index+=1){
    state.particles.push({
      x,
      y,
      velocityX:randomBetween(-80,80),
      velocityY:randomBetween(-150,-30),
      life:randomBetween(.35,.72),
      maximumLife:1,
      type,
      size:randomBetween(1.3,3.2)
    });
  }
}

let audioContext = null;
function playCoinSound(){
  try{
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;

    [880,1320,1760].forEach((frequency,index)=>{
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = index===0 ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(
        frequency,
        now+index*.045
      );
      gain.gain.setValueAtTime(.0001,now+index*.045);
      gain.gain.exponentialRampToValueAtTime(
        .13/(index+1),
        now+index*.045+.012
      );
      gain.gain.exponentialRampToValueAtTime(
        .0001,
        now+index*.045+.19
      );

      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now+index*.045);
      oscillator.stop(now+index*.045+.2);
    });
  }catch{}
}

function updatePlatforms(deltaSeconds,settings){
  for(const platform of state.platforms){
    platform.previousX = platform.x;
    platform.previousY = platform.y;

    if(!platform.anchored && !platform.isStage){
      platform.y += (settings.speed*platform.flowFactor + platform.flowImpulse)*deltaSeconds;
      platform.x += (platform.lateralVelocity + platform.recoilX)*deltaSeconds;
      platform.flowImpulse *= Math.exp(-2.4*deltaSeconds);
      platform.recoilX *= Math.exp(-3.1*deltaSeconds);

      if(platform.x<12){
        platform.x=12;
        platform.lateralVelocity=Math.abs(platform.lateralVelocity)*.8;
      }
      if(platform.x+platform.width>state.width-12){
        platform.x=state.width-platform.width-12;
        platform.lateralVelocity=-Math.abs(platform.lateralVelocity)*.8;
      }
    }

    platform.bob += deltaSeconds*(1.2+platform.flowFactor*.6);
    platform.rotation += platform.rotationVelocity*deltaSeconds;
    platform.rock += platform.rockVelocity*deltaSeconds;
    platform.rockVelocity += -platform.rock*24*deltaSeconds;
    platform.rockVelocity *= Math.pow(.12,deltaSeconds);
    platform.splash=Math.max(0,platform.splash-deltaSeconds*2.8);
  }

  const visible = state.platforms.filter(platform=>{
    const y=screenY(platform.y);
    return y>-220 && y<state.height+240 && !platform.isStage;
  });

  for(let first=0; first<visible.length; first+=1){
    for(let second=first+1; second<visible.length; second+=1){
      const a=visible[first];
      const b=visible[second];

      if(Math.abs(a.y-b.y)>58) continue;

      const overlap =
        Math.min(a.x+a.width,b.x+b.width)-
        Math.max(a.x,b.x);

      if(overlap<=0) continue;

      const combined =
        Math.max(a.x+a.width,b.x+b.width)-
        Math.min(a.x,b.x);

      const dangerous =
        combined>state.width*.76 ||
        overlap>Math.min(a.width,b.width)*.58;

      if(!dangerous) continue;

      const direction =
        a.x+a.width/2<b.x+b.width/2 ? -1 : 1;
      const push=Math.min(58,overlap*.52)*deltaSeconds;

      if(!a.anchored) a.x+=direction*push;
      if(!b.anchored) b.x-=direction*push;
    }
  }
}

function updatePlayer(deltaSeconds){
  const player=state.player;
  player.previousY=player.y;

  input.jumpBuffer=Math.max(0,input.jumpBuffer-deltaSeconds);
  input.dashTimer=Math.max(0,input.dashTimer-deltaSeconds);

  const direction=(input.right?1:0)-(input.left?1:0);
  const dashActive=
    input.dashHeld &&
    input.dashTimer>0 &&
    direction===input.dashDirection;

  const acceleration=dashActive?1750:1050;
  const maximumSpeed=dashActive?410:255;
  const friction=direction===0 ? 9.5 : 4.6;

  if(direction!==0){
    player.velocityX+=direction*acceleration*deltaSeconds;
    player.facing=direction;
  }

  player.velocityX*=Math.exp(-friction*deltaSeconds);
  player.velocityX=clamp(
    player.velocityX,
    -maximumSpeed,
    maximumSpeed
  );

  if(player.standingOn){
    player.x+=player.standingOn.x-player.standingOn.previousX;
    player.y+=player.standingOn.y-player.standingOn.previousY;
  }

  player.coyote = player.grounded
    ? .105
    : Math.max(0,player.coyote-deltaSeconds);

  if(input.jumpBuffer>0 && player.coyote>0){
    const momentumBonus=dashActive?24:0;
    const launchPlatform=player.standingOn;
    player.velocityY=-555;
    player.velocityX+=player.facing*momentumBonus;
    if(launchPlatform&&!launchPlatform.isStage){
      launchPlatform.flowImpulse=Math.min(118,launchPlatform.flowImpulse+54+Math.abs(player.velocityX)*.075);
      launchPlatform.recoilX-=player.velocityX*.085;
      launchPlatform.rockVelocity-=player.facing*.56;
      launchPlatform.splash=Math.max(launchPlatform.splash,.72);
      spawnParticles(player.x+player.width/2,launchPlatform.y,'water',10);
    }
    player.grounded=false;
    player.standingOn=null;
    player.coyote=0;
    input.jumpBuffer=0;
  }

  player.x+=player.velocityX*deltaSeconds;
  player.x=clamp(player.x,0,state.width-player.width);

  player.velocityY+=1430*deltaSeconds;
  player.y+=player.velocityY*deltaSeconds;
  player.grounded=false;
  player.standingOn=null;

  const previousBottom=player.previousY+player.height;
  const currentBottom=playerBottom();

  if(player.velocityY>=0){
    const candidates=state.platforms
      .filter(platform=>{
        const horizontal =
          player.x+player.width>platform.x+10 &&
          player.x<platform.x+platform.width-10;

        const crossing =
          previousBottom<=platform.y+14 &&
          currentBottom>=platform.y-8;

        return horizontal && crossing;
      })
      .sort((a,b)=>a.y-b.y);

    const platform=candidates[0];

    if(platform){
      player.y=platform.y-player.height;
      player.velocityY=0;
      player.grounded=true;
      player.standingOn=platform;
      player.coyote=.105;

      if(!platform.landed){
        platform.landed=true;
        platform.rockVelocity+=clamp(
          player.velocityX/430,
          -.9,
          .9
        );
        platform.splash=1;
        player.landTimer=.18;
        spawnParticles(
          player.x+player.width/2,
          platform.y,
          'water',
          14
        );
      }
    }
  }

  for(const platform of state.platforms){
    if(platform!==player.standingOn){
      platform.landed=false;
    }
  }

  player.landTimer=Math.max(0,player.landTimer-deltaSeconds);

  const desiredCamera=player.y-state.height*.43;
  if(desiredCamera<state.cameraTop){
    state.cameraTop +=
      (desiredCamera-state.cameraTop)*
      Math.min(1,deltaSeconds*4.8);
  }

  if(screenY(player.y)>state.height+150){
    finishGame(false);
  }

  if(player.y<state.stageWorldY+24){
    finishGame(true);
  }
}

function updateCollectibles(deltaSeconds,settings){
  for(const penny of state.pennies){
    if(penny.attachedTo){
      penny.x=penny.attachedTo.x+penny.attachedTo.width/2;
      penny.y=penny.attachedTo.y-38;
    }else{
      penny.y+=settings.speed*penny.flowFactor*deltaSeconds;
      penny.x+=penny.velocityX*deltaSeconds;
    }
    penny.spin+=deltaSeconds*7;
  }

  for(const ball of state.attentionBalls){
    ball.y+=settings.speed*ball.flowFactor*deltaSeconds;
    ball.x+=ball.velocityX*deltaSeconds;
    ball.rotation+=deltaSeconds*1.8;

    if(ball.x<ball.radius || ball.x>state.width-ball.radius){
      ball.velocityX*=-1;
      ball.x=clamp(
        ball.x,
        ball.radius,
        state.width-ball.radius
      );
    }
  }

  const playerCenterX=state.player.x+state.player.width/2;
  const playerCenterY=state.player.y+state.player.height*.44;

  state.pennies=state.pennies.filter(penny=>{
    const collected=
      Math.hypot(
        penny.x-playerCenterX,
        penny.y-playerCenterY
      )<30;

    if(collected){
      state.value+=1;
      playCoinSound();
      spawnParticles(penny.x,penny.y,'value',17);
      return false;
    }

    return screenY(penny.y)<state.height+180;
  });

  state.attentionBalls=state.attentionBalls.filter(ball=>{
    const collected=
      Math.hypot(
        ball.x-playerCenterX,
        ball.y-playerCenterY
      )<ball.radius+23;

    if(collected){
      state.attention+=ball.radius>26?3:1;
      spawnParticles(ball.x,ball.y,'attention',18);
      return false;
    }

    return screenY(ball.y)<state.height+190;
  });

  for(const particle of state.particles){
    particle.x+=particle.velocityX*deltaSeconds;
    particle.y+=particle.velocityY*deltaSeconds;
    particle.velocityY+=260*deltaSeconds;
    particle.life-=deltaSeconds;
  }
  state.particles=state.particles.filter(
    particle=>particle.life>0
  );
}

function updateTutorial(){
  if(state.elapsed<5){
    $('#tutorialHeading').textContent=
      'THE CURRENT MOVES DOWN. YOU MOVE UP.';
    $('#tutorialText').textContent=
      'LEFT and RIGHT move. UP jumps.';
  }else if(state.elapsed<10){
    $('#tutorialHeading').textContent=
      'READ THE MOVEMENT BEFORE YOU COMMIT.';
    $('#tutorialText').textContent=
      'Platforms drift at different speeds. Time the landing.';
  }else if(state.elapsed<16){
    $('#tutorialHeading').textContent=
      'DOUBLE-PRESS AND HOLD FOR MOMENTUM.';
    $('#tutorialText').textContent=
      'Use the short dash for wider upstream jumps.';
  }else{
    $('#tutorial').classList.add('hide');
  }
}

function updateInterface(){
  const progress=clamp(
    (state.startWorldY-state.player.y)/
    (state.startWorldY-state.stageWorldY),
    0,
    1
  );

  const settings=currentSettings();
  const label=
    settings.speed<14?'CALM':
    settings.speed<23?'PUSHING':
    settings.speed<34?'STRONG':
    'RUSHING';

  $('#valueScore').textContent=state.value;
  $('#attentionScore').textContent=state.attention;
  $('#currentState').textContent=label;
  $('#progressState').textContent=
    `${Math.round(progress*100)}%`;
}

function update(deltaSeconds){
  state.elapsed+=deltaSeconds;
  const settings=currentSettings();

  updatePlatforms(deltaSeconds,settings);
  updatePlayer(deltaSeconds);
  updateCollectibles(deltaSeconds,settings);
  updateTutorial();
  updateInterface();
}

function drawWater(){
  const {width,height}=state;

  const gradient=ctx.createLinearGradient(0,0,0,height);
  gradient.addColorStop(0,'#1b7688');
  gradient.addColorStop(.38,'#0a5667');
  gradient.addColorStop(1,'#032a35');
  ctx.fillStyle=gradient;
  ctx.fillRect(0,0,width,height);

  ctx.save();
  ctx.globalCompositeOperation='screen';

  for(let band=0; band<15; band+=1){
    const y=
      ((band*93+state.elapsed*31)%(height+150))-75;
    const amplitude=14+band%4*4;

    ctx.strokeStyle=
      `rgba(157,231,242,${.035+(band%3)*.018})`;
    ctx.lineWidth=1+band%3*.55;
    ctx.beginPath();

    for(let point=0; point<=width; point+=32){
      const wave=
        Math.sin(
          point*.014+
          state.elapsed*(.85+band*.03)+
          band
        )*amplitude;
      if(point===0) ctx.moveTo(point,y+wave);
      else ctx.lineTo(point,y+wave);
    }
    ctx.stroke();
  }

  ctx.restore();

  ctx.save();
  for(let lane=0; lane<6; lane+=1){
    const xPosition=(lane+.5)*width/6;
    const offset=(state.elapsed*(44+lane*5))%(height+170)-90;
    const laneGradient=ctx.createLinearGradient(
      xPosition,
      offset,
      xPosition,
      offset+165
    );
    laneGradient.addColorStop(0,'rgba(255,255,255,0)');
    laneGradient.addColorStop(.45,'rgba(189,242,248,.11)');
    laneGradient.addColorStop(1,'rgba(255,255,255,0)');
    ctx.strokeStyle=laneGradient;
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(xPosition,offset);
    ctx.bezierCurveTo(
      xPosition-22,
      offset+45,
      xPosition+23,
      offset+110,
      xPosition,
      offset+165
    );
    ctx.stroke();
  }
  ctx.restore();

  const dangerHeight=42;
  const dangerGradient=ctx.createLinearGradient(
    0,
    height-dangerHeight,
    0,
    height
  );
  dangerGradient.addColorStop(0,'rgba(220,247,250,.03)');
  dangerGradient.addColorStop(.45,'rgba(230,250,252,.22)');
  dangerGradient.addColorStop(1,'rgba(0,0,0,.62)');
  ctx.fillStyle=dangerGradient;
  ctx.fillRect(0,height-dangerHeight,width,dangerHeight);
}

function drawPlatform(platform){
  const y=screenY(platform.y);
  if(y<-230 || y>state.height+190) return;

  const image=assets.media[platform.assetName];
  const drawY=y+Math.sin(platform.bob)*3;
  const angle=
    platform.baseRotation+
    platform.rotation+
    platform.rock*.08;

  ctx.save();
  ctx.translate(
    platform.x+platform.width/2,
    drawY+platform.height/2
  );
  ctx.rotate(angle);

  const wakeGradient=ctx.createRadialGradient(
    0,0,4,
    0,0,platform.width*.55
  );
  wakeGradient.addColorStop(0,'rgba(220,250,255,.34)');
  wakeGradient.addColorStop(.68,'rgba(81,187,205,.14)');
  wakeGradient.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=wakeGradient;
  ctx.beginPath();
  ctx.ellipse(
    0,
    platform.height*.27,
    platform.width*.56,
    17,
    0,
    0,
    Math.PI*2
  );
  ctx.fill();

  ctx.shadowColor='rgba(0,0,0,.82)';
  ctx.shadowBlur=24;
  ctx.shadowOffsetY=12;
  ctx.globalAlpha=1;
  ctx.drawImage(
    image,
    -platform.width/2,
    -platform.visualHeight+
      platform.height*.54,
    platform.width,
    platform.visualHeight
  );
  ctx.shadowBlur=0;

  if(platform.splash>0){
    ctx.globalAlpha=platform.splash;
    ctx.strokeStyle='rgba(225,252,255,.95)';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.ellipse(
      0,
      platform.height*.2,
      platform.width*(.32+.24*(1-platform.splash)),
      9+10*(1-platform.splash),
      0,
      0,
      Math.PI*2
    );
    ctx.stroke();

    for(let splash=0; splash<8; splash+=1){
      const direction=splash%2===0?-1:1;
      const spread=(splash+1)/8;
      ctx.beginPath();
      ctx.moveTo(
        direction*platform.width*.12*spread,
        platform.height*.12
      );
      ctx.lineTo(
        direction*platform.width*.23*spread,
        -10*(1-platform.splash)
      );
      ctx.stroke();
    }
  }

  ctx.restore();

  if(platform.isStage){
    ctx.save();
    ctx.textAlign='center';
    ctx.fillStyle='#ffd49d';
    ctx.font='900 18px Arial';
    ctx.fillText(
      'THE STAGE',
      platform.x+platform.width/2,
      y-platform.visualHeight-12
    );
    ctx.restore();
  }
}

function drawPenny(penny){
  const y=screenY(penny.y);
  if(y<-40 || y>state.height+60) return;

  ctx.save();
  ctx.translate(penny.x,y);
  ctx.scale(.3+Math.abs(Math.cos(penny.spin))*.7,1);
  ctx.shadowColor='rgba(255,188,74,.88)';
  ctx.shadowBlur=14;

  const gradient=ctx.createRadialGradient(-4,-5,2,0,0,penny.radius);
  gradient.addColorStop(0,'#ffd287');
  gradient.addColorStop(.45,'#bf6f27');
  gradient.addColorStop(1,'#74370f');

  ctx.fillStyle=gradient;
  ctx.beginPath();
  ctx.arc(0,0,penny.radius,0,Math.PI*2);
  ctx.fill();

  ctx.strokeStyle='#ffe0aa';
  ctx.lineWidth=1.8;
  ctx.stroke();

  ctx.fillStyle='#fff0ca';
  ctx.font=`900 ${Math.max(9,penny.radius)}px Arial`;
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText('¢',0,1);
  ctx.restore();
}

function drawAttentionBall(ball){
  const y=screenY(ball.y);
  if(y<-60 || y>state.height+70) return;

  ctx.save();
  ctx.translate(ball.x,y);
  ctx.rotate(ball.rotation);
  ctx.shadowColor='rgba(31,137,255,.9)';
  ctx.shadowBlur=22;

  const gradient=ctx.createRadialGradient(
    -ball.radius*.32,
    -ball.radius*.36,
    2,
    0,
    0,
    ball.radius
  );
  gradient.addColorStop(0,'#81c6ff');
  gradient.addColorStop(.42,'#1a7fe0');
  gradient.addColorStop(1,'#064590');

  ctx.fillStyle=gradient;
  ctx.beginPath();
  ctx.arc(0,0,ball.radius,0,Math.PI*2);
  ctx.fill();

  ctx.shadowBlur=0;
  ctx.strokeStyle='#fff';
  ctx.lineWidth=Math.max(3,ball.radius*.14);
  ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(-ball.radius*.34,-ball.radius*.34);
  ctx.lineTo(ball.radius*.34,ball.radius*.34);
  ctx.moveTo(ball.radius*.34,-ball.radius*.34);
  ctx.lineTo(-ball.radius*.34,ball.radius*.34);
  ctx.stroke();
  ctx.restore();
}

function drawParticles(){
  for(const particle of state.particles){
    const alpha=clamp(
      particle.life/particle.maximumLife,
      0,
      1
    );
    ctx.globalAlpha=alpha;
    ctx.fillStyle=
      particle.type==='value'
        ? '#ffd28a'
        : particle.type==='attention'
          ? '#66b7ff'
          : '#dffbff';

    ctx.beginPath();
    ctx.arc(
      particle.x,
      screenY(particle.y),
      particle.size,
      0,
      Math.PI*2
    );
    ctx.fill();
  }
  ctx.globalAlpha=1;
}

function choosePlayerAnimation(){
  const player=state.player;

  if(player.landTimer>0) return 'land';
  if(!player.grounded) return 'jump';
  if(Math.abs(player.velocityX)>38) return 'run';
  return 'idle';
}

function drawPlayer(){
  const player=state.player;
  const animation=choosePlayerAnimation();

  if(animation!==player.animation){
    player.animation=animation;
    player.animationFrame=0;
    player.animationClock=0;
  }

  const frames=assets.character[animation];
  const frameDelay=
    animation==='run' ? .07 :
    animation==='jump' ? .095 :
    animation==='land' ? .055 :
    .12;

  player.animationClock+=1/60;
  if(player.animationClock>=frameDelay){
    player.animationClock=0;
    player.animationFrame=
      (player.animationFrame+1)%frames.length;
  }

  let frameIndex=player.animationFrame;

  if(animation==='jump'){
    const normalized=clamp(
      (player.velocityY+555)/1110,
      0,
      1
    );
    frameIndex=Math.min(
      frames.length-1,
      Math.floor(normalized*frames.length)
    );
  }

  const image=frames[frameIndex] || frames[0];
  const y=screenY(player.y);

  ctx.save();
  ctx.translate(
    player.x+player.width/2,
    y-3
  );

  if(player.facing<0) ctx.scale(-1,1);

  ctx.shadowColor='rgba(0,0,0,.72)';
  ctx.shadowBlur=18;
  ctx.shadowOffsetY=8;
  ctx.drawImage(
    image,
    -64,
    -4,
    128,
    142
  );
  ctx.restore();
}

function drawProgressGuide(){
  const progress=clamp(
    (state.startWorldY-state.player.y)/
    (state.startWorldY-state.stageWorldY),
    0,
    1
  );

  const x=state.width-22;
  const top=176;
  const bottom=state.height-105;

  ctx.save();
  ctx.strokeStyle='rgba(255,255,255,.2)';
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(x,top);
  ctx.lineTo(x,bottom);
  ctx.stroke();

  const markerY=bottom-(bottom-top)*progress;
  ctx.fillStyle='#ffd092';
  ctx.beginPath();
  ctx.arc(x,markerY,6,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle='rgba(255,255,255,.7)';
  ctx.font='900 8px Arial';
  ctx.textAlign='right';
  ctx.fillText('UPSTREAM',x-8,top+4);
  ctx.fillText('WATERFALL',x-8,bottom+4);
  ctx.restore();
}

function draw(){
  drawWater();

  const platforms=[...state.platforms].sort(
    (a,b)=>a.y-b.y
  );
  for(const platform of platforms) drawPlatform(platform);
  for(const penny of state.pennies) drawPenny(penny);
  for(const ball of state.attentionBalls) drawAttentionBall(ball);
  drawParticles();
  drawPlayer();
  drawProgressGuide();
}

function gameLoop(timestamp){
  if(!state.running) return;

  const deltaSeconds=Math.min(
    (timestamp-state.lastTime)/1000,
    .032
  );
  state.lastTime=timestamp;

  update(deltaSeconds);
  draw();

  if(state.running) requestAnimationFrame(gameLoop);
}

async function startGame(){
  if(!state.ready) return;

  $('#introOverlay').classList.add('hidden');
  resetGame();

  state.running=true;
  state.lastTime=performance.now();

  if(state.soundtrackWanted){
    soundtrack.currentTime=0;
    soundtrack.play().then(()=>{
      $('#audioToggle').classList.add('playing');
      $('#audioToggle').textContent='♫ MUSIC ON';
    }).catch(()=>{
      $('#audioToggle').textContent='♫ TAP FOR MUSIC';
    });
  }

  requestAnimationFrame(gameLoop);
}

function finishGame(won){
  if(!state.running) return;
  state.running=false;

  soundtrack.volume=.24;

  const message = won
    ? state.value>=state.attention
      ? 'You reached the stage with value leading attention.'
      : 'You reached the stage, but attention still outweighed value.'
    : 'The current carried you to the waterfall. Read the timing and try another route.';

  $('#endingTitle').textContent=
    won ? 'YOU REACHED THE STAGE.' : 'THE CURRENT WON THIS RUN.';
  $('#endingStats').textContent=
    `Value ${state.value} · Attention ${state.attention}`;
  $('#endingMessage').textContent=message;
  $('#endingOverlay').classList.remove('hidden');
}

function pressDirection(name){
  const movementPad=document.querySelector('.movement-pad');
  movementPad?.classList.add('active',`${name}-active`);
  const now=performance.now();
  const direction=name==='left'?-1:1;

  if(now-input.lastPress[name]<285){
    input.dashDirection=direction;
    input.dashHeld=true;
    input.dashTimer=.62;
  }

  input.lastPress[name]=now;
  input[name]=true;
}

function releaseDirection(name){
  const movementPad=document.querySelector('.movement-pad');
  movementPad?.classList.remove(`${name}-active`);
  if(!input.left && !input.right){movementPad?.classList.remove('active');}
  input[name]=false;
  if(!input.left && !input.right){movementPad?.classList.remove('active');}

  const direction=name==='left'?-1:1;
  if(input.dashDirection===direction){
    input.dashHeld=false;
  }
}

function requestJump(){
  input.jumpBuffer=.13;
  const jumpPad=document.querySelector('.jump-pad');
  jumpPad?.classList.add('active');
  setTimeout(()=>jumpPad?.classList.remove('active'),120);
}

function bindDirection(buttonSelector,name){
  const button=$(buttonSelector);

  button.addEventListener('pointerdown',event=>{
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    pressDirection(name);
  });

  const release=()=>{
    releaseDirection(name);
  };

  button.addEventListener('pointerup',release);
  button.addEventListener('pointercancel',release);
  button.addEventListener('pointerleave',release);
}

bindDirection('#leftButton','left');
bindDirection('#rightButton','right');

$('#jumpButton').addEventListener('pointerdown',event=>{
  event.preventDefault();
  requestJump();
});

addEventListener('keydown',event=>{
  if(['ArrowLeft','ArrowRight','ArrowUp'].includes(event.key)){
    event.preventDefault();
  }

  if(event.repeat) return;

  if(event.key==='ArrowLeft') pressDirection('left');
  if(event.key==='ArrowRight') pressDirection('right');
  if(event.key==='ArrowUp') requestJump();
});

addEventListener('keyup',event=>{
  if(event.key==='ArrowLeft') releaseDirection('left');
  if(event.key==='ArrowRight') releaseDirection('right');
});

$('#audioToggle').addEventListener('click',()=>{
  state.soundtrackWanted=!state.soundtrackWanted;

  if(state.soundtrackWanted){
    soundtrack.volume=.55;
    soundtrack.play().then(()=>{
      $('#audioToggle').classList.add('playing');
      $('#audioToggle').textContent='♫ MUSIC ON';
    }).catch(()=>{
      $('#audioToggle').textContent='♫ TAP FOR MUSIC';
    });
  }else{
    soundtrack.pause();
    $('#audioToggle').classList.remove('playing');
    $('#audioToggle').textContent='♫ MUSIC OFF';
  }
});

$('#exitButton').addEventListener('click',()=>{
  state.running=false;
  soundtrack.pause();

  if(parent!==window){
    parent.postMessage('closeExperience','*');
  }else{
    location.href='../../#experiences';
  }
});

$('#startButton').addEventListener('click',startGame);

loadAssets()
  .then(()=>{
    resetGame();
    draw();

    if(new URLSearchParams(location.search).get('autostart')==='1'){
      startGame();
    }
  })
  .catch(error=>{
    console.error(error);
    $('#startButton').textContent='ASSET LOAD ERROR';
    $('#startButton').disabled=true;
  });

window.__STREAMS_DEBUG__ = state;
