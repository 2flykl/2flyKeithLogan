/* One sizing authority. The board's available box never depends on its own tile size. */
(() => {
  const root=document.documentElement; let raf=0;
  function fit(){
    const wrap=document.querySelector('#boardWrap'), board=document.querySelector('#board'),frame=document.querySelector('#boardContainer');
    if(!wrap || !document.querySelector('#game.active'))return;
    const cs=getComputedStyle(board), w=wrap.clientWidth, h=wrap.clientHeight;
    const gap=parseFloat(cs.gap)||4,padX=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight),padY=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);
    const preview=document.querySelector('#flowPreview').offsetHeight,status=document.querySelector('#statusLine').offsetHeight;
    const rowGap=parseFloat(getComputedStyle(wrap).rowGap)||6;
    const size=Math.max(18,Math.floor(Math.min((w-padX-9*gap-8)/10,(h-preview-status-2*rowGap-padY-8)/7,128)));
    if(root.style.getPropertyValue('--cell')!==size+'px')root.style.setProperty('--cell',size+'px');
    root.style.setProperty('--cols','10');root.style.setProperty('--rows','7');root.style.setProperty('--previewCell','28px');
    const r=frame.getBoundingClientRect(); document.body.dataset.ebonyBoardFits=String(r.bottom<=innerHeight&&r.right<=innerWidth);
  }
  function queue(){cancelAnimationFrame(raf);raf=requestAnimationFrame(fit)}
  window.ensureBoardFitsViewport=fit;window.updateBoardGeometry=queue;
  addEventListener('resize',queue,{passive:true});visualViewport?.addEventListener('resize',queue,{passive:true});
  new ResizeObserver(queue).observe(document.querySelector('#boardWrap'));
})();
