
window.TigerMidi = (() => {
  function u16(b,o){ return (b[o]<<8)|b[o+1]; }
  function u32(b,o){ return ((b[o]<<24)>>>0)|(b[o+1]<<16)|(b[o+2]<<8)|b[o+3]; }
  function str(b,o,n){ return String.fromCharCode(...b.slice(o,o+n)); }
  function readVar(b,s){ let v=0,c; do{ c=b[s.o++]; v=(v<<7)|(c&127); }while(c&128); return v>>>0; }

  function parse(arrayBuffer){
    const b=new Uint8Array(arrayBuffer);
    if(str(b,0,4)!=='MThd') throw new Error('Invalid MIDI header');
    const headerLen=u32(b,4), format=u16(b,8), tracks=u16(b,10), division=u16(b,12);
    let o=8+headerLen;
    const notes=[], tempos=[], markers=[];

    for(let ti=0;ti<tracks;ti++){
      if(str(b,o,4)!=='MTrk') throw new Error('Invalid MIDI track');
      const len=u32(b,o+4); o+=8;
      const end=o+len;
      let tick=0, running=0;
      const active=new Map();

      while(o<end){
        const s={o}; tick+=readVar(b,s); o=s.o;
        let status=b[o++];
        if(status<0x80){ o--; status=running; }
        else if(status<0xf0){ running=status; }

        if(status===0xff){
          const type=b[o++];
          const vs={o}; const l=readVar(b,vs); o=vs.o;
          const data=b.slice(o,o+l); o+=l;

          if(type===0x51 && l===3){
            const us=(data[0]<<16)|(data[1]<<8)|data[2];
            tempos.push({tick, tempo:us, bpm:60000000/us});
          } else if(type===0x06){
            markers.push({tick, name:new TextDecoder().decode(data)});
          }
          continue;
        }

        if(status===0xf0 || status===0xf7){
          const vs={o}; const l=readVar(b,vs); o=vs.o+l; continue;
        }

        const hi=status&0xf0, ch=status&0x0f;
        if(hi===0x80 || hi===0x90){
          const note=b[o++], vel=b[o++], key=ch+':'+note;
          if(hi===0x90 && vel>0){
            const ev={tick,note,velocity:vel,channel:ch,endTick:tick};
            notes.push(ev);
            if(!active.has(key)) active.set(key,[]);
            active.get(key).push(ev);
          } else {
            const q=active.get(key);
            if(q && q.length) q.shift().endTick=tick;
          }
        } else if(hi===0xa0 || hi===0xb0 || hi===0xe0){ o+=2; }
        else if(hi===0xc0 || hi===0xd0){ o+=1; }
        else { throw new Error('Unsupported MIDI event 0x'+status.toString(16)); }
      }
      o=end;
    }

    notes.sort((a,b)=>a.tick-b.tick || a.note-b.note);
    tempos.sort((a,b)=>a.tick-b.tick);
    markers.sort((a,b)=>a.tick-b.tick);
    return {format,division,notes,tempos,markers};
  }

  function makeTimeline(division, tempos){
    const list=(tempos&&tempos.length?tempos.slice():[{tick:0,tempo:500000,bpm:120}]).sort((a,b)=>a.tick-b.tick);
    if(list[0].tick!==0) list.unshift({tick:0,tempo:500000,bpm:120});

    let seconds=0;
    for(let i=0;i<list.length;i++){
      if(i===0){ list[i].seconds=0; continue; }
      const prev=list[i-1];
      seconds=prev.seconds + ((list[i].tick-prev.tick)/division)*(prev.tempo/1000000);
      list[i].seconds=seconds;
    }

    function tickToSeconds(tick){
      let lo=0, hi=list.length-1;
      while(lo<hi){
        const mid=Math.ceil((lo+hi)/2);
        if(list[mid].tick<=tick) lo=mid; else hi=mid-1;
      }
      const a=list[lo];
      return a.seconds + ((tick-a.tick)/division)*(a.tempo/1000000);
    }
    return {tempos:list,tickToSeconds};
  }

  return {parse,makeTimeline};
})();
