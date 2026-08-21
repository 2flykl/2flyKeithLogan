window.FLYVERSE_DATA = (() => {
  const eras = [
    { id:'e00', years:'2000–2004', name:'THE SPARK',             x:-2100, y:560,  z:-180, r:430, color:'#f2a5ff', img:'./visuals/galaxies/galaxy_2000_2004.png' },
    { id:'e05', years:'2005–2009', name:'THE RISE',              x:-1120, y:1330, z:100,  r:400, color:'#ffad68', img:'./visuals/galaxies/galaxy_2005_2009.png' },
    { id:'e10', years:'2010–2014', name:'THE FOUNDATION',        x:-1120, y:-720, z:-70,  r:420, color:'#f0c061', img:'./visuals/galaxies/galaxy_2010_2014.png' },
    { id:'e15', years:'2015–2019', name:'THE EVOLUTION',         x:1480,  y:1120, z:160,  r:400, color:'#ee7fff', img:'./visuals/galaxies/galaxy_2015_2019.png' },
    { id:'e20', years:'2020–2024', name:'THE INFINITE NOW',      x:300,   y:-1110,z:-240, r:410, color:'#a397ff', img:'./visuals/galaxies/galaxy_2020_2024.png' },
    { id:'e25', years:'2025–2029', name:'THE PLAYABLE ERA',      x:420,   y:120,  z:320,  r:700, color:'#74edff', img:'./visuals/galaxies/galaxy_2025_2029.png', active:true },
    { id:'e30', years:'2030–2034', name:'THE HORIZON',           x:2290,  y:-230, z:-120, r:430, color:'#62f1df', img:'./visuals/galaxies/galaxy_2030_2034.png' }
  ];

  const frontier = [
    ['Streams', 'Playable Experience', '../streams/index.html', 'A cinematic river of likes, momentum, and digital movement.'],
    ['I Woke Up in Africa', 'Playable Experience', '../africa/index.html', 'A reflective journey across memory, place, and awakening.'],
    ['Thru the Fire', 'Playable Experience', '../thru-the-fire/index.html', 'A pressure-cooker experience built from choices, urgency, and survival.'],
    ['Ebony Eyes', 'Playable Experience', '../ebony_eyes_game/index.html', 'A stylish matching experience with fanfare, rhythm, and living icons.'],
    ['Return of the Aviator', 'Playable Experience', '../return-of-the-aviator/index.html', 'An arcade flight route through music, resistance, and ascent.'],
    ['I Was Away', 'Playable Experience', '../i-was-away/index.html', 'A reflective throw-and-return journey with presence and precision.'],
    ['Tiger Call', 'Playable Experience', '../TigerCall_StillStanding_PLX/index.html', 'A band-energy rhythm experience grounded in pulse and ceremony.'],
    ['Founder\'s Core', 'Galaxy Node', '', 'A central memory system connecting stories, eras, and creative paths.'],
    ['Signature Wall', 'Community Node', '', 'A place where visitors can leave coordinates, messages, and marks.'],
    ['Aviator Belt', 'Constellation', '', 'A region where flight, ambition, and momentum align into visible pathways.'],
    ['Streams Nebula', 'Nebula Region', '', 'Clusters of memories suspended in color, drift, and resonance.'],
    ['XPLAY Quadrant', 'Future Gateway', '', 'A frontier zone for playable media, experiments, and expanding systems.']
  ];

  const archiveCopies = [
    'Archived coordinates from a formative era in the 2Fly Universe.',
    'A marker for people, places, and moments that shaped the path forward.',
    'A memory node preserving movement, growth, and community presence.',
    'An orbiting archive point waiting for deeper public curation.'
  ];

  const objects = [];
  let sprite = 1;

  for (const era of eras) {
    const count = era.active ? frontier.length : 7;
    for (let i = 0; i < count; i++) {
      const entry = era.active
        ? frontier[i]
        : [`Archive Marker ${i + 1}`, 'Archive Marker', '', archiveCopies[i % archiveCopies.length]];

      objects.push({
        id: `${era.id}-${i}`,
        era: era.id,
        title: entry[0],
        type: entry[1],
        url: entry[2],
        copy: entry[3],
        a: (era.active ? 170 : 120) + 58 * i + (era.active ? i * 16 : i * 8),
        b: (era.active ? 95 : 70) + 26 * (i % 5),
        incl: (i * 0.25 + 0.14) % 1.1,
        node: i * 0.49,
        phase: i * 0.72 + era.x * 0.00035,
        speed: (0.05 + 0.012 * (i % 5)) * (i % 2 ? -1 : 1),
        r: era.active ? 18 + (i % 4) * 3 : 13 + (i % 3) * 2,
        sprite: `./visuals/worlds/world_${String(sprite++ % 18 || 18).padStart(2, '0')}.png`
      });
    }
  }

  ['Alpha','Beta','Gamma','Delta','Echo','Nova'].forEach((name, i) => {
    objects.push({
      id: `star-${i}`,
      era: 'e25',
      title: `${name} Signature`,
      type: 'Placed Star',
      url: '',
      copy: 'A demo placed star in the active galaxy. Each one represents a visitor mark left inside the Playable Era.',
      a: 235 + i * 46,
      b: 118 + i * 10,
      incl: 0.28 + i * 0.08,
      node: i * 0.63,
      phase: i * 1.03,
      speed: 0.07 + (i % 3) * 0.014,
      r: 12
    });
  });

  return { eras, objects };
})();
