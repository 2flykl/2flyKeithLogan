/* Shared download primitives. ZIP uses STORE: MP3s are already compressed. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.PlayerDownloads=api;})(globalThis,function(){
  'use strict';
  const MAX_FILE=100*1024*1024, MAX_TOTAL=256*1024*1024;
  function filename(value){return String(value||'Song').normalize('NFC').replace(/[<>:"/\\|?*\x00-\x1f]/g,'-').replace(/[. ]+$/g,'').slice(0,100)||'Song';}
  function catalog(projects,base){return projects.flatMap(p=>{
    if(p.upcoming)return [];
    return (p.tracks?.length?p.tracks:[{title:p.title,audio:p.audio}]).flatMap((t,i)=>{
      if(!(t.audio||t.src))return [];
      const url=new URL(t.audio||t.src,base);if(!/^https?:$/.test(url.protocol))return [];
      return [{id:p.id+':'+(t.id||i),title:t.title||p.title,album:p.title,albumId:p.id,albumTrackIndex:i,isAlbum:!!p.tracks?.length,url:url.href,cover:p.cover,number:i+1}];
    });
  });}
  function readFavorites(raw){try{const a=JSON.parse(raw);return Array.isArray(a)?[...new Set(a.filter(x=>typeof x==='string'))].slice(0,1000):[];}catch{return [];}}
  function isAudio(b){return b.length>10&&((b[0]===73&&b[1]===68&&b[2]===51)||(b[0]===255&&(b[1]&224)===224)||String.fromCharCode(...b.slice(0,4))==='RIFF'||String.fromCharCode(...b.slice(0,4))==='fLaC'||String.fromCharCode(...b.slice(0,4))==='OggS'||String.fromCharCode(...b.slice(4,8))==='ftyp');}
  async function fetchAudio(url,{signal,onProgress=()=>{},fetcher=fetch,timeout=60000}={}){
    const controller=new AbortController();const abort=()=>controller.abort();
    if(signal?.aborted)abort();signal?.addEventListener('abort',abort,{once:true});
    const timer=setTimeout(abort,timeout);
    try{
      const response=await fetcher(url,{signal:controller.signal,credentials:'omit'});
      if(!response.ok)throw new Error('Server returned '+response.status);
      const length=Number(response.headers.get('content-length'))||0;
      if(length>MAX_FILE)throw new Error('File exceeds the 100 MB download limit');
      const chunks=[];let size=0;
      if(response.body){const reader=response.body.getReader();try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_FILE)throw new Error('File exceeds the 100 MB download limit');chunks.push(value);onProgress(size,length);}}catch(e){await reader.cancel().catch(()=>{});throw e;}}
      else{const b=new Uint8Array(await response.arrayBuffer());size=b.length;chunks.push(b);}
      if(!size||size>MAX_FILE)throw new Error('Empty or oversized audio file');
      if(length&&size!==length&&!response.headers.get('content-encoding'))throw new Error('Incomplete audio file');
      const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
      if(!isAudio(bytes))throw new Error('The server did not return an audio file');
      return bytes;
    }finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
  }
  const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=(n&1)?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
  function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
  function zip(entries){
    if(!entries.length||entries.length>65535)throw new Error('No files or too many files');
    if(entries.reduce((n,e)=>n+e.bytes.length,0)>MAX_TOTAL)throw new Error('Selection exceeds 256 MB. Download albums or songs separately.');
    const parts=[],central=[];let offset=0,centralSize=0;const names=new Set();
    for(const entry of entries){
      if(names.has(entry.name)||entry.name.includes('..')||entry.name.startsWith('/')||entry.name.includes('\\'))throw new Error('Invalid or duplicate ZIP filename');names.add(entry.name);
      const name=new TextEncoder().encode(entry.name),size=entry.bytes.length,crc=crc32(entry.bytes);
      const local=new Uint8Array(30+name.length),v=new DataView(local.buffer);
      v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);v.setUint32(14,crc,true);v.setUint32(18,size,true);v.setUint32(22,size,true);v.setUint16(26,name.length,true);local.set(name,30);
      const c=new Uint8Array(46+name.length),d=new DataView(c.buffer);d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);d.setUint16(14,33,true);d.setUint32(16,crc,true);d.setUint32(20,size,true);d.setUint32(24,size,true);d.setUint16(28,name.length,true);d.setUint32(42,offset,true);c.set(name,46);
      parts.push(local,entry.bytes);central.push(c);offset+=local.length+size;centralSize+=c.length;
    }
    const end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,entries.length,true);v.setUint16(10,entries.length,true);v.setUint32(12,centralSize,true);v.setUint32(16,offset,true);
    return new Blob([...parts,...central,end],{type:'application/zip'});
  }
  return {filename,catalog,readFavorites,fetchAudio,zip,crc32,MAX_TOTAL};
});
