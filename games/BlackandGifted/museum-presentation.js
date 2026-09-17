/* BLACK & GIFTED — Royal Shadow / Living Paper.
   Presentation only: world coordinates, collisions and progression belong to the game. */
window.BGMuseum=(()=>{
  const palettes=[['#0d1017','#311c2d','#b88d51'],['#0b1220','#273347','#b9a584'],['#090f1a','#172d38','#bda66e'],['#11171a','#25403d','#ddba78'],['#171019','#51303a','#e2b873'],['#03070c','#101e28','#bd985e'],['#161017','#382837','#d4b280'],['#101118','#25353c','#e2c58e'],['#17101b','#59363d','#f1d5a0']];
  function arch(c,x,y,w,h){c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+w*.42);c.bezierCurveTo(x,y-w*.12,x+w,y-w*.12,x+w,y+w*.42);c.lineTo(x+w,y+h);c.closePath()}
  function diamond(c,x,y,r){c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r,y);c.lineTo(x,y+r);c.lineTo(x-r,y);c.closePath()}
  function draw(c,s){
    const {W,H,t,scene,camX,ground:g}=s,p=palettes[scene],reveal=s.reveal;
    c.save();
    // A continuous rear hall: the same architectural rhythm grows more generous.
    const room=c.createLinearGradient(0,0,0,g);room.addColorStop(0,p[0]);room.addColorStop(.7,p[1]);room.addColorStop(1,p[0]);
    c.fillStyle=room;c.globalAlpha=.94;c.fillRect(camX-100,-300,W+200,g+300);
    const spacing=scene===8?410:scene===0?300:360;
    const horizon=g*.56,offset=camX*.22;
    for(let i=Math.floor(offset/spacing)-1;i<=Math.ceil((offset+W)/spacing)+1;i++){
      const x=camX+i*spacing-offset,aw=spacing*.72,top=scene===8?-85:12;
      c.globalAlpha=.28+.65*reveal;
      const light=c.createLinearGradient(x,top,x+aw,g);light.addColorStop(0,scene===5?'#17313b':'#776249');light.addColorStop(.5,p[1]);light.addColorStop(1,p[0]);
      arch(c,x,top,aw,g-top);c.fillStyle=light;c.fill();c.strokeStyle=p[2];c.lineWidth=2;c.stroke();
      arch(c,x+9,top+12,aw-18,g-top-12);c.globalAlpha*=.35;c.stroke();
      c.save();arch(c,x+12,top+18,aw-24,g-top-18);c.clip();
      // Impossible distances: balconies, pyramidal skylines, suspended archives.
      for(let k=0;k<6;k++){
        const bx=x+k*aw/5-20,bh=54+((i*37+k*53)%140+140)%140;
        c.fillStyle=k%2?'#090d17':'#121724';c.fillRect(bx,horizon-bh,40,g-horizon+bh);
        c.beginPath();c.moveTo(bx-6,horizon-bh);c.lineTo(bx+20,horizon-bh-28);c.lineTo(bx+46,horizon-bh);c.fill();
      }
      c.globalAlpha=.3*reveal;c.strokeStyle=p[2];c.beginPath();c.moveTo(x,horizon);c.lineTo(x+aw,horizon);c.stroke();
      for(let k=0;k<12;k++){c.beginPath();c.moveTo(x+k*24,horizon);c.lineTo(x+k*24,horizon+30);c.stroke()}
      c.restore();
      // Carved columns have a lit edge, a paper-dark face, and an offset shadow.
      c.globalAlpha=.95;c.fillStyle='#06090f';c.fillRect(x-33,-80,32,g+80);
      c.fillStyle='#201c24';c.fillRect(x-29,-80,13,g+80);
      c.strokeStyle=p[2];c.globalAlpha=.15+.4*reveal;c.lineWidth=1;c.beginPath();c.moveTo(x-28,-80);c.lineTo(x-28,g);c.stroke();
      for(let k=0;k<5;k++){diamond(c,x-17,80+k*100,6);c.stroke()}
      c.fillStyle=p[2];c.globalAlpha=.18+.22*reveal;c.fillRect(x-42,g-18,51,9);
      // A woven burgundy banner, restrained motion and stitched gold motifs.
      if(scene!==1&&scene!==2&&scene!==5){
        const bx=x+aw*.65,by=42,bw=43,bh=scene===8?245:175,sway=Math.sin(t*.8+i)*5;
        c.globalAlpha=.8;c.fillStyle=i%2?'#422137':'#193832';c.beginPath();c.moveTo(bx,by);c.lineTo(bx+bw,by);c.quadraticCurveTo(bx+bw+sway,by+bh*.5,bx+bw+sway,by+bh);c.lineTo(bx+bw*.5+sway,by+bh-18);c.lineTo(bx+sway,by+bh);c.closePath();c.fill();
        c.strokeStyle=p[2];c.globalAlpha=.48;c.stroke();for(let k=0;k<3;k++){diamond(c,bx+bw*.5+sway*k/3,by+40+k*40,10);c.stroke()}
      }
      // Light responds to the player's projected position in the hall.
      const proximity=Math.max(0,1-Math.abs((s.x-camX)-(x-camX+aw/2))/360);
      const shaft=c.createLinearGradient(x+aw/2,0,x+aw/2,g);shaft.addColorStop(0,'#efce8b');shaft.addColorStop(1,'#c3954300');
      c.fillStyle=shaft;c.globalAlpha=(.028+proximity*.065)*reveal;c.beginPath();c.moveTo(x+aw*.4,0);c.lineTo(x+aw*.58,0);c.lineTo(x+aw*1.1,g);c.lineTo(x+aw*.6,g);c.closePath();c.fill();
    }
    // Monumental roof cornices repeat across the entire institution.
    c.globalAlpha=.55;c.fillStyle='#080b11';c.fillRect(camX-100,-35,W+200,66);
    c.strokeStyle=p[2];c.globalAlpha=.32*reveal;c.lineWidth=1;
    for(const y of [32,38,53]){c.beginPath();c.moveTo(camX-100,y);c.lineTo(camX+W+100,y);c.stroke()}
    for(let x=camX-(camX*.4%38)-38;x<camX+W+38;x+=38){diamond(c,x,44,5);c.stroke()}
    // Suspended manuscripts and sculptural stars: exhibition objects, never platforms.
    if([0,4,6,7,8].includes(scene))for(let i=0;i<4;i++){
      const x=camX+((i*390-camX*.38)%(W+430)+(W+430))%(W+430)-160,y=H*.48+Math.sin(t*.55+i)*6;
      c.globalAlpha=.24*reveal;c.strokeStyle=p[2];c.beginPath();c.moveTo(x,55);c.lineTo(x,y-42);c.stroke();
      c.save();c.translate(x,y);c.rotate(Math.sin(t*.3+i)*.055);c.fillStyle='#110e17';c.globalAlpha=.85*reveal;diamond(c,0,0,37);c.fill();c.stroke();c.globalAlpha=.5*reveal;diamond(c,0,0,23);c.stroke();c.beginPath();c.moveTo(-17,0);c.lineTo(17,0);c.moveTo(0,-17);c.lineTo(0,17);c.stroke();c.restore();
    }
    // Paper grain is deterministic; no frame-to-frame flicker or texture downloads.
    c.strokeStyle='#ead4ab';c.lineWidth=.6;c.globalAlpha=.026;
    for(let i=0;i<110;i++){const x=camX+(i*173.73%W),y=i*97.31%g;c.beginPath();c.moveTo(x,y);c.lineTo(x+3+(i%6),y-1);c.stroke()}
    c.fillStyle='#efd19b';
    for(let i=0;i<48;i++){const x=camX+((i*197+t*(3+i%5)-camX*.12)%(W+80)+(W+80))%(W+80)-40,y=65+(i*67%Math.max(80,g-100))+Math.sin(t*.4+i)*12;c.globalAlpha=(.05+.12*(.5+.5*Math.sin(t*.7+i)))*reveal;c.beginPath();c.arc(x,y,.7+i%3*.4,0,Math.PI*2);c.fill()}
    // The opening is constrained; reveal exposes depth before the gift is presented.
    if(scene===0){c.fillStyle='#05060d';c.globalAlpha=(1-reveal)*.64;c.fillRect(camX,-50,W,g+50)}
    c.restore();
  }
  return {draw};
})();
