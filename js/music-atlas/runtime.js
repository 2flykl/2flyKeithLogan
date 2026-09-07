// Reconstruct the supplied Music Premium artwork from the web atlas and expose each visual as a CSS image variable.
(function(){
  'use strict';
  const TILE=128, COLS=4;
  const names=[
    'selection-frame','binder-base','binder-arrows','binder-plastic',
    'binder-crease','scene-light','stereo-base','stereo-glow',
    'speaker-left-base','speaker-left-glow','speaker-right-base','speaker-right-glow',
    'table','page-turn-shadow','binder-glare'
  ];

  function cropTile(image,index){
    const c=document.createElement('canvas'); c.width=TILE; c.height=TILE;
    const x=(index%COLS)*TILE, y=Math.floor(index/COLS)*TILE;
    const ctx=c.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(image,x,y,TILE,TILE,0,0,TILE,TILE);
    const data=ctx.getImageData(0,0,TILE,TILE).data;
    let minX=TILE,minY=TILE,maxX=-1,maxY=-1;
    for(let py=0;py<TILE;py++) for(let px=0;px<TILE;px++){
      if(data[(py*TILE+px)*4+3]>5){
        if(px<minX)minX=px;if(px>maxX)maxX=px;if(py<minY)minY=py;if(py>maxY)maxY=py;
      }
    }
    if(maxX<0)return c;
    const w=maxX-minX+1,h=maxY-minY+1;
    const out=document.createElement('canvas');out.width=w;out.height=h;
    out.getContext('2d').drawImage(c,minX,minY,w,h,0,0,w,h);
    return out;
  }

  function canvasUrl(c){return c.toDataURL('image/webp',.98)}
  function setVar(name,url){document.documentElement.style.setProperty('--mp-'+name,`url("${url}")`)}
  function splitArrows(c){
    const half=Math.floor(c.width/2);
    const left=document.createElement('canvas'),right=document.createElement('canvas');
    left.width=half;left.height=c.height;right.width=c.width-half;right.height=c.height;
    left.getContext('2d').drawImage(c,0,0,half,c.height,0,0,half,c.height);
    right.getContext('2d').drawImage(c,half,0,c.width-half,c.height,0,0,c.width-half,c.height);
    return [left,right];
  }

  window.musicPremiumAssetsReady=new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{
      const assets={};
      names.forEach((name,i)=>{
        if(name==='binder-arrows')return;
        const url=canvasUrl(cropTile(img,i));assets[name]=url;setVar(name,url);
      });
      const [left,right]=splitArrows(cropTile(img,2));
      assets['arrow-left']=canvasUrl(left);assets['arrow-right']=canvasUrl(right);
      setVar('arrow-left',assets['arrow-left']);setVar('arrow-right',assets['arrow-right']);
      window.MUSIC_PREMIUM_ASSETS=assets;
      document.documentElement.classList.add('music-premium-assets-ready');
      window.dispatchEvent(new CustomEvent('music-premium-assets-ready',{detail:assets}));
      resolve(assets);
    };
    img.onerror=()=>{console.error('Music Premium atlas could not be decoded.');resolve({})};
    img.src='data:image/webp;base64,'+(window.__MPA||'');
  });
})();