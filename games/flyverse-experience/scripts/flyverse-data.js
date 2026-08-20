window.FLYVERSE_DATA = (() => {
  const eras = [
    { id:'foundation', years:'2000–2004', name:'THE FOUNDATION ERA', color:'#d4a85f', x:-1520, y:-240, radius:180, archive:true },
    { id:'momentum', years:'2005–2009', name:'THE MOMENTUM ERA', color:'#ff597a', x:-980, y:470, radius:180, archive:true },
    { id:'reinvention', years:'2010–2014', name:'THE REINVENTION ERA', color:'#9f68ff', x:-300, y:-600, radius:190, archive:true },
    { id:'expansion', years:'2015–2019', name:'THE EXPANSION ERA', color:'#ff9d4b', x:430, y:540, radius:188, archive:true },
    { id:'awakening', years:'2020–2024', name:'THE AWAKENING ERA', color:'#49e0d0', x:1260, y:-360, radius:205, archive:true },
    { id:'frontier', years:'2025–2029', name:'THE PLAYABLE FRONTIER', color:'#7d5cff', x:2100, y:210, radius:255, archive:false },
    { id:'uncharted', years:'2030–2034', name:'THE UNCHARTED ERA', color:'#6d7dff', x:2860, y:-560, radius:188, archive:true, future:true }
  ];

  const objects = [
    // foundation
    {id:'foundation-core',era:'foundation',type:'Flat World',shape:'plate',title:'Foundation Archive',subtitle:'2000–2004 • Archive hub',x:-1450,y:-205,r:48,copy:'A foundational archive world for verified early history and media.'},
    {id:'foundation-spire',era:'foundation',type:'Triangular Planet',shape:'triangle',title:'Blueprint Spire',subtitle:'Orbital archive marker',x:-1605,y:-315,r:28,copy:'A triangular archive body representing plans, starts, and first steps.'},
    {id:'foundation-gem',era:'foundation',type:'Crystalline Planet',shape:'diamond',title:'Origin Crystal',subtitle:'Orbital archive marker',x:-1362,y:-346,r:23,copy:'A crystalline archive beacon in the Foundation Era.'},
    {id:'foundation-ring',era:'foundation',type:'Ring Relic',shape:'ring',title:'First Orbit',subtitle:'Orbital archive marker',x:-1638,y:-125,r:20,copy:'A ring object storing the first orbiting moments of the universe.'},
    {id:'foundation-slab',era:'foundation',type:'Memory Slab',shape:'capsule',title:'Memory Slab',subtitle:'Orbital archive marker',x:-1515,y:-402,r:24,copy:'A flat slab carrying the feel of early memories.'},

    // momentum
    {id:'momentum-core',era:'momentum',type:'Pulse Planet',shape:'sphere',title:'Momentum Archive',subtitle:'2005–2009 • Archive hub',x:-915,y:478,r:44,copy:'A vibrant archive world for momentum-building years.'},
    {id:'momentum-drift',era:'momentum',type:'Comet Flat',shape:'capsule',title:'Motion Drift',subtitle:'Orbital archive marker',x:-1105,y:520,r:26,copy:'A sleek flat orbital form representing growing movement.'},
    {id:'momentum-kite',era:'momentum',type:'Kite Planet',shape:'diamond',title:'Velocity Kite',subtitle:'Orbital archive marker',x:-820,y:608,r:23,copy:'A high-energy diamond world rotating in the Momentum Era.'},
    {id:'momentum-echo',era:'momentum',type:'Echo Node',shape:'square',title:'Echo Node',subtitle:'Orbital archive marker',x:-1035,y:345,r:18,copy:'An archive node for voices, rooms, and echoes of this era.'},
    {id:'momentum-hex',era:'momentum',type:'Route Hex',shape:'hex',title:'Route Hex',subtitle:'Orbital archive marker',x:-780,y:400,r:18,copy:'A hex planet anchoring the forward route.'},

    // reinvention
    {id:'reinvention-core',era:'reinvention',type:'Ring World',shape:'ring',title:'Reinvention Archive',subtitle:'2010–2014 • Archive hub',x:-220,y:-540,r:50,copy:'A ringed archive world for pivots, reinventions, and new directions.'},
    {id:'reinvention-prism',era:'reinvention',type:'Prism Planet',shape:'triangle',title:'Prism Break',subtitle:'Orbital archive marker',x:-445,y:-660,r:26,copy:'A sharp triangular object symbolizing reframing and discovery.'},
    {id:'reinvention-plate',era:'reinvention',type:'Flat Archive',shape:'plate',title:'Signal Plate',subtitle:'Orbital archive marker',x:-105,y:-690,r:24,copy:'A flat, luminous plate carrying reframed ideas.'},
    {id:'reinvention-cube',era:'reinvention',type:'Cube Archive',shape:'square',title:'Remix Block',subtitle:'Orbital archive marker',x:-415,y:-440,r:19,copy:'A cube-shaped world storing modular fragments of the era.'},
    {id:'reinvention-nebula',era:'reinvention',type:'Swirl Cluster',shape:'nebula',title:'Reframe Swirl',subtitle:'Orbital archive marker',x:-250,y:-770,r:24,copy:'A swirly nebula-body woven into the orbit rather than the background.'},

    // expansion
    {id:'expansion-core',era:'expansion',type:'Expansion Planet',shape:'sphere',title:'Expansion Archive',subtitle:'2015–2019 • Archive hub',x:505,y:555,r:48,copy:'An archive world for widening reach and growing catalogues.'},
    {id:'expansion-shard',era:'expansion',type:'Shard Planet',shape:'shard',title:'Catalyst Shard',subtitle:'Orbital archive marker',x:258,y:460,r:25,copy:'A tapered shard object representing acceleration and spread.'},
    {id:'expansion-disc',era:'expansion',type:'Disc World',shape:'plate',title:'Orbit Disc',subtitle:'Orbital archive marker',x:420,y:680,r:24,copy:'A flat disc world orbiting the archive hub.'},
    {id:'expansion-knot',era:'expansion',type:'Hex Planet',shape:'hex',title:'Network Knot',subtitle:'Orbital archive marker',x:690,y:420,r:20,copy:'A multi-sided world representing connection and structure.'},
    {id:'expansion-diamond',era:'expansion',type:'Prism Memory',shape:'diamond',title:'Prism Memory',subtitle:'Orbital archive marker',x:295,y:640,r:19,copy:'A bright prism world storing moments of growth.'},

    // awakening
    {id:'awakening-core',era:'awakening',type:'Nebula World',shape:'nebula',title:'Awakening Archive',subtitle:'2020–2024 • Archive hub',x:1350,y:-310,r:58,copy:'A misty, awakening archive where swirls begin to reveal orbiting content.'},
    {id:'awakening-tower',era:'awakening',type:'Signal Tower',shape:'capsule',title:'Signal Tower',subtitle:'Orbital archive marker',x:1115,y:-438,r:23,copy:'A vertical orbital form emitting rediscovered signals.'},
    {id:'awakening-vault',era:'awakening',type:'Vault Planet',shape:'square',title:'Awakened Vault',subtitle:'Orbital archive marker',x:1495,y:-470,r:21,copy:'A vault-like square world in protective orbit.'},
    {id:'awakening-shard',era:'awakening',type:'Aurora Shard',shape:'shard',title:'Aurora Shard',subtitle:'Orbital archive marker',x:1605,y:-238,r:22,copy:'A glowing shard object that catches the light of the era.'},
    {id:'awakening-flat',era:'awakening',type:'Flat Echo',shape:'plate',title:'Awakened Plate',subtitle:'Orbital archive marker',x:1220,y:-165,r:20,copy:'A flat echo plane inside the awakening cluster.'},

    // frontier - live content
    {id:'streams',era:'frontier',type:'Flat World',shape:'plate',title:'Streams',subtitle:'2025–2029 • Playable Frontier',x:1980,y:95,r:60,copy:'A water-inspired flat world inside the Playable Frontier.',actions:[{label:'Play Streams',href:'../streams/index.html'}]},
    {id:'africa',era:'frontier',type:'Tri World',shape:'triangle',title:'I Woke Up in Africa',subtitle:'2025–2029 • Playable Frontier',x:2210,y:245,r:68,copy:'A cinematic triangular world representing the Africa playable experience.',actions:[{label:'Enter Experience',href:'../africa/index.html'}]},
    {id:'thru-fire',era:'frontier',type:'Sun Core',shape:'sun',title:'Thru the Fire',subtitle:'2025–2029 • Playable Frontier',x:2330,y:58,r:53,copy:'A high-intensity solar world anchored to Thru the Fire.',actions:[{label:'Enter Thru the Fire',href:'../thru-the-fire/index.html'}]},
    {id:'ebony-eyes',era:'frontier',type:'Satellite',shape:'diamond',title:'Ebony Eyes',subtitle:'Playable satellite',x:2090,y:410,r:25,copy:'A playable satellite orbiting the frontier.',actions:[{label:'Play',href:'../ebony_eyes_game/index.html'}]},
    {id:'aviator',era:'frontier',type:'Satellite',shape:'shard',title:'Return of the Aviator',subtitle:'Playable satellite',x:2428,y:296,r:26,copy:'An arcade-flight playable satellite.',actions:[{label:'Play',href:'../return-of-the-aviator/index.html'}]},
    {id:'i-was-away',era:'frontier',type:'Satellite',shape:'square',title:'I Was Away',subtitle:'Playable satellite',x:2250,y:445,r:23,copy:'A boomerang-inspired playable world.',actions:[{label:'Play',href:'../i-was-away/index.html'}]},
    {id:'tiger-call',era:'frontier',type:'Satellite',shape:'hex',title:'Tiger Call',subtitle:'Playable satellite',x:1955,y:320,r:23,copy:'A rhythm-playable satellite inspired by marching band energy.',actions:[{label:'Play',href:'../TigerCall_StillStanding_PLX/index.html'}]},
    {id:'foundation-return',era:'frontier',type:'Portal Satellite',shape:'ring',title:'Legacy Link',subtitle:'Live memory bridge',x:2160,y:-30,r:20,copy:'A portal-like ring linking the playable era to earlier moments.'},
    {id:'frontier-stage',era:'frontier',type:'Stage Plate',shape:'plate',title:'Frontier Stage',subtitle:'Support orbit object',x:2160,y:560,r:20,copy:'A staging plate for future live content nodes.'},
    {id:'frontier-kite',era:'frontier',type:'Memory Kite',shape:'diamond',title:'Orbit Kite',subtitle:'Support orbit object',x:1888,y:206,r:18,copy:'A bright marker helping shape the frontier orbit.'},

    // demo stars in active galaxy
    {id:'frontier-star-1',era:'frontier',type:'Placed Star',shape:'star',title:'Placed Star Alpha',subtitle:'Demo visitor star • Active galaxy',x:2032,y:226,r:19,copy:'A demo placed star showing how visitor or memory stars can live inside the active galaxy.'},
    {id:'frontier-star-2',era:'frontier',type:'Placed Star',shape:'star',title:'Placed Star Beta',subtitle:'Demo visitor star • Active galaxy',x:2174,y:145,r:17,copy:'A second demo placed star orbiting within the active galaxy cluster.'},
    {id:'frontier-star-3',era:'frontier',type:'Placed Star',shape:'star',title:'Placed Star Gamma',subtitle:'Demo visitor star • Active galaxy',x:2310,y:308,r:18,copy:'A third demo placed star used to preview how constellation-style placements can look.'},
    {id:'frontier-star-4',era:'frontier',type:'Placed Star',shape:'star',title:'Placed Star Delta',subtitle:'Demo visitor star • Active galaxy',x:2142,y:348,r:16,copy:'A fourth demo placed star clustered near the current live content zone.'},
    {id:'frontier-star-5',era:'frontier',type:'Placed Star',shape:'star',title:'Placed Star Echo',subtitle:'Demo visitor star • Active galaxy',x:2244,y:75,r:15,copy:'A fifth placed star punctuating the upper orbit line.'},
    {id:'frontier-star-6',era:'frontier',type:'Placed Star',shape:'star',title:'Placed Star Nova',subtitle:'Demo visitor star • Active galaxy',x:1964,y:448,r:17,copy:'A sixth placed star helping the active galaxy feel lived in.'},

    // uncharted
    {id:'uncharted-core',era:'uncharted',type:'Portal',shape:'ring',title:'The Uncharted Era',subtitle:'2030–2034 • Future marker',x:2940,y:-510,r:44,copy:'A distant marker for what has not happened yet.'},
    {id:'uncharted-ghost',era:'uncharted',type:'Ghost Prism',shape:'triangle',title:'Ghost Prism',subtitle:'Future orbital marker',x:2695,y:-615,r:24,copy:'A future-facing prism held at a respectful distance.'},
    {id:'uncharted-flat',era:'uncharted',type:'Future Plate',shape:'plate',title:'Future Plate',subtitle:'Future orbital marker',x:2765,y:-410,r:21,copy:'A flat, speculative platform — no invented history attached.'},
    {id:'uncharted-node',era:'uncharted',type:'Portal Node',shape:'diamond',title:'Portal Node',subtitle:'Future orbital marker',x:3045,y:-665,r:18,copy:'A small portal node waiting for real future events.'},
    {id:'uncharted-signal',era:'uncharted',type:'Signal Hex',shape:'hex',title:'Signal Hex',subtitle:'Future orbital marker',x:2890,y:-740,r:18,copy:'A faceted hex reserved for future realities.'}
  ];

  return { eras, objects };
})();
