window.FLYVERSE_DATA = (() => {
  const eras = [
    {id:'foundation',years:'2000–2004',name:'THE FOUNDATION ERA',color:'#d4a85f',x:-1150,y:-180,z:120,archive:true},
    {id:'momentum',years:'2005–2009',name:'THE MOMENTUM ERA',color:'#ff597a',x:-760,y:350,z:-40,archive:true},
    {id:'reinvention',years:'2010–2014',name:'THE REINVENTION ERA',color:'#9f68ff',x:-310,y:-420,z:60,archive:true},
    {id:'expansion',years:'2015–2019',name:'THE EXPANSION ERA',color:'#ff9d4b',x:240,y:330,z:-120,archive:true},
    {id:'awakening',years:'2020–2024',name:'THE AWAKENING ERA',color:'#49e0d0',x:720,y:-300,z:30,archive:true},
    {id:'frontier',years:'2025–2029',name:'THE PLAYABLE FRONTIER',color:'#7d5cff',x:1170,y:220,z:0,archive:false},
    {id:'uncharted',years:'2030–2034',name:'THE UNCHARTED ERA',color:'#6d7dff',x:1630,y:-420,z:-180,archive:true,future:true}
  ];

  const objects = [
    {id:'foundation-core',era:'foundation',type:'Planet',title:'Foundation Archive',subtitle:'Archive not yet curated',x:-1080,y:-130,z:30,r:32,copy:'A placeholder world for authentic material from the Foundation Era. No biography or release history is invented here.'},
    {id:'momentum-core',era:'momentum',type:'Crystalline Archive',title:'Momentum Archive',subtitle:'Content coming into orbit',x:-690,y:400,z:-20,r:28,copy:'A visual anchor for future authenticated work from 2005–2009.'},
    {id:'reinvention-core',era:'reinvention',type:'Ring World',title:'Reinvention Archive',subtitle:'Archive not yet curated',x:-230,y:-370,z:20,r:30,copy:'A spatial marker for material that can be curated later without fabricating history.'},
    {id:'expansion-core',era:'expansion',type:'Planet',title:'Expansion Archive',subtitle:'Content coming into orbit',x:315,y:385,z:10,r:34,copy:'A future home for verified 2015–2019 works and artifacts.'},
    {id:'awakening-core',era:'awakening',type:'Nebula World',title:'Awakening Archive',subtitle:'Archive not yet curated',x:790,y:-245,z:20,r:36,copy:'A visual world for authentic 2020–2024 content when curated.'},
    {id:'streams',era:'frontier',type:'Planet',title:'Streams',subtitle:'2025–2029 • Playable Frontier',x:1060,y:115,z:45,r:46,copy:'A water-inspired creative world inside the Playable Frontier.',actions:[{label:'Play Streams',href:'../streams/index.html'}]},
    {id:'africa',era:'frontier',type:'Planet',title:'I Woke Up in Africa',subtitle:'2025–2029 • Playable Frontier',x:1210,y:245,z:-20,r:52,copy:'A cinematic world representing the Africa playable experience.',actions:[{label:'Enter Experience',href:'../africa/index.html'}]},
    {id:'thru-fire',era:'frontier',type:'Sun',title:'Thru the Fire',subtitle:'2025–2029 • Playable Frontier',x:1315,y:110,z:35,r:42,copy:'A high-intensity world anchored to the Thru the Fire playable experience.',actions:[{label:'Enter Thru the Fire',href:'../thru-the-fire/index.html'}]},
    {id:'ebony-eyes',era:'frontier',type:'Satellite',title:'Ebony Eyes',subtitle:'Playable satellite',x:1145,y:350,z:100,r:24,copy:'A playable satellite orbiting the frontier.',actions:[{label:'Play',href:'../ebony_eyes_game/index.html'}]},
    {id:'aviator',era:'frontier',type:'Satellite',title:'Return of the Aviator',subtitle:'Playable satellite',x:1390,y:280,z:-80,r:23,copy:'An arcade-flight playable satellite.',actions:[{label:'Play',href:'../return-of-the-aviator/index.html'}]},
    {id:'i-was-away',era:'frontier',type:'Satellite',title:'I Was Away',subtitle:'Playable satellite',x:1280,y:390,z:65,r:25,copy:'A boomerang-inspired playable world.',actions:[{label:'Play',href:'../i-was-away/index.html'}]},
    {id:'tiger-call',era:'frontier',type:'Satellite',title:'Tiger Call',subtitle:'Playable satellite',x:1030,y:290,z:-80,r:22,copy:'A rhythm-playable satellite inspired by marching band energy.',actions:[{label:'Play',href:'../TigerCall_StillStanding_PLX/index.html'}]},
    {id:'uncharted-core',era:'uncharted',type:'Portal',title:'The Uncharted Era',subtitle:'No future history invented',x:1700,y:-370,z:-120,r:35,copy:'A distant marker for what has not happened yet.'}
  ];

  return {eras,objects};
})();
