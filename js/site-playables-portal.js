/* The arcade is a view of the shared playable catalog; game routes stay in data. */
(() => {
  const worlds = {
    black_gifted: ['gifted', '#dec18b', '#44235e', 'Step into your greatness.', 'A journey through ancestry, faith, and everything you carry forward.'],
    streams: ['streams', '#6ee6ff', '#073e6a', 'Find your flow.', 'Ride the current. Chase the value. Stay above the noise.'],
    tigercall: ['tiger', '#ffad50', '#69290b', 'Make the whole room roar.', 'Step into the rhythm and the spirit of the Rayen Tigers.'],
    i_was_away: ['away', '#8bdbff', '#174f7d', 'Every journey has a return.', 'Find your angle. Follow the flight. Bring it all back.'],
    ebony_eyes: ['ebony', '#f7c473', '#4c1947', 'Lock in. Let it flow.', 'A little strategy. A little soul. Find the connection in every move.'],
    guns: ['guns', '#75e5ee', '#574524', 'Sound has a new form.', 'Explore the Tempest Pavilion and its playable musical arsenal.'],
    aviator: ['aviator', '#ffd09a', '#235777', 'The sky is yours.', 'Begin your descent and break through everything beneath you.'],
    universe: ['universe', '#a5f1dc', '#143b47', 'One life. Many worlds.', 'Travel through a living constellation of music, memory, and possibility.'],
    thru_the_fire: [null, '#ffad73', '#642010', 'What will you carry out?', 'Time is running out. Choose what matters and make your way through.'],
    africa: [null, '#ebc88c', '#3d5032', 'A new day. A new intention.', 'Pause, reflect, and carry a little purpose into the world.'],
    infinite_bars: [null, '#b9aaff', '#30294f', 'Your next line starts here.', 'Trade lines, build an eight-bar verse, and keep the cypher moving.']
  };
  const world = p => worlds[p.id] || [null, p.accent || '#dcc18c', '#243c42', p.title, p.description];
  const inspirations = {
    tigercall: ['Tiger Call', 'An early 2Fly AI video'],
    infinite_bars: ['A social experiment', 'Two voices. Eight bars. One shared creation.'],
    black_gifted: ['I Woke Up in Africa + Black & Gifted', 'Documentary + song'],
    guns: ['Guns & Butter + Weapons of Mass Production', 'Song · music video · Youngstown production team'],
    aviator: ['Too Fast + the runway photograph', 'Song + 2Fly’s portrait in front of an airplane'],
    ebony_eyes: ['Ebony Eyes', 'Song'],
    streams: ['Streams', 'Song + visual story'],
    i_was_away: ['I Was Away', 'Song + visual story'],
    thru_the_fire: ['Thru the Fire', 'Song + visual story'],
    africa: ['I Woke Up in Africa', 'Rwanda documentary'],
    universe: ['The 2Fly creative archive', 'Music · memory · visual worlds']
  };
  const briefs = {
    black_gifted: 'Move through a living world of ancestry and affirmation. Break through barriers, take the leap, and carry your greatness forward.',
    streams: 'Climb against the current on platforms made from media. Collect what has value, dodge the distractions, and keep moving upstream.',
    tigercall: 'Catch the rhythm, hit your cues, and bring the Rayen Tigers’ spirit to life. Every beat takes you closer to the finale.',
    guns: 'Step into the Tempest Pavilion. Explore the museum, take control of the Tambourine Tempest, and turn the target range into a performance.',
    ebony_eyes: 'Lock matching traits, build your flow, and protect the balloons. Keep at least one afloat until the song ends.',
    aviator: 'Drop into an aerial battle against the algorithm. Steer through the sky, collect upgrades, and fight your way through one continuous descent.',
    i_was_away: 'Find your angle and send the boomerang into flight. Shape its path through timing and movement, then bring it all back.',
    universe: 'Follow the signals through a living constellation. Discover the music, memories, and visual worlds that make up the 2Fly story.',
    infinite_bars: 'Write a line. Pass the mic. Trade verses with a simulated partner and build an eight-bar stanza, one move at a time.',
    thru_the_fire: 'The room is closing in and time is running out. Choose what to save in a test of memory, survival, and what matters most.',
    africa: 'Pause, reflect, and choose your intention. Turn the spirit of the Rwanda documentary into a moment of purpose you can carry into your day.'
  };
  const art = (p, hero = false) => {
    const w = world(p);
    return w[0] ? `<img src="../assets/playables/${w[0]}.jpg" alt="${esc(p.title)} artwork" ${hero ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">` : `<div class="portal-placeholder placeholder-${esc(p.id)}"><span class="placeholder-orbit" aria-hidden="true"></span><span class="placeholder-symbol" aria-hidden="true">${esc(p.glyph)}</span><strong>${esc(p.title)}</strong><small>ARTWORK COMING SOON</small></div>`;
  };
  renderPlayables = function () {
    const order = ['black_gifted','streams','tigercall','guns','ebony_eyes','aviator','i_was_away','universe','infinite_bars','thru_the_fire','africa'];
    const catalog = [...app.playables].sort((a,b) => (order.indexOf(a.id)<0?999:order.indexOf(a.id))-(order.indexOf(b.id)<0?999:order.indexOf(b.id)));
    let selected = catalog[0], shown, filter = 'all';
    $('#appView').innerHTML = `<section class="portal-arcade" aria-label="Playable experiences">
      <div class="portal-wall" aria-hidden="true"></div><div class="portal-halo" aria-hidden="true"></div><div class="portal-glass-wall" aria-hidden="true"></div>
      <div class="portal-inner"><header class="portal-heading"><div><div class="portal-kicker">2FLY INTERACTIVE / THE PORTAL ARCADE</div><h1>PLAYABLES<span aria-hidden="true">✦</span></h1></div><p>Different worlds. Same imagination.<br><strong>Find your next way to play.</strong></p></header>
      <section class="portal-stage" aria-label="Experience preview"><div class="portal-stage-art" id="portalArt"></div><div class="portal-stage-shade"></div><div class="portal-frame" aria-hidden="true"></div><div class="portal-stage-copy"><span class="portal-kicker" id="portalFormat"></span><h2 id="portalTitle"></h2><p id="portalDescription" class="portal-tagline"></p><div class="portal-story"><div class="portal-brief"><span class="portal-section-label">THE EXPERIENCE</span><p id="portalBrief"></p></div><div class="portal-inspiration"><span class="portal-section-label">INSPIRED BY</span><strong id="portalInspiration"></strong><span id="portalSourceType"></span></div></div><div class="portal-actions"><a id="portalLaunch" class="portal-launch">ENTER EXPERIENCE <span aria-hidden="true">↗</span></a><span id="portalStatus"></span></div></div><div class="portal-stage-label"><span class="portal-dot"></span> WORLD PREVIEW <span id="portalNumber"></span></div><div class="portal-shutters" aria-hidden="true"><i></i><i></i></div></section>
      <a class="portal-stage-support" href="#support" data-route="support">HELP 2FLY CREATE <span aria-hidden="true">↗</span></a>
      <div class="portal-library-head"><div class="portal-filters" role="group" aria-label="Filter experiences"><button data-world-filter="all" aria-pressed="true">All worlds</button><button data-world-filter="music" aria-pressed="false">Music & rhythm</button><button data-world-filter="story" aria-pressed="false">Story & discovery</button><button data-world-filter="featured" aria-pressed="false">Featured</button></div><span id="portalCount"></span></div>
      <div class="portal-grid" id="portalGrid"></div><footer class="portal-footer"><span>HOVER TO EXPLORE · SELECT YOUR WORLD · STEP INSIDE</span><a href="#support" data-route="support">Help build the next world ↗</a></footer></div><div class="portal-dock" hidden><div><small>YOUR NEXT WORLD</small><strong id="portalDockTitle"></strong></div><a class="portal-launch" id="portalDockLaunch">ENTER EXPERIENCE ↗</a></div></section>`;
    const root = $('.portal-arcade'), grid = $('#portalGrid');
    const stage = root.querySelector('.portal-stage');
    stage.insertAdjacentHTML('beforeend','<div class="portal-pattern-pass" aria-hidden="true"></div><button class="portal-arrow portal-prev" aria-label="Previous playable experience">‹</button><button class="portal-arrow portal-next" aria-label="Next playable experience">›</button>');
    const shell = document.querySelector('#siteShell');
    const fit = new ResizeObserver(()=>root.style.setProperty('--portal-shell-height',`${shell.getBoundingClientRect().height}px`));
    fit.observe(shell);
    const visibleCatalog = () => catalog.filter(p => filter==='all' || p.category===filter || (filter==='featured'&&p.featured));
    function select(p) {
      if(!p)return;
      selected=p;preview(p);
      grid.querySelectorAll('[data-world]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.world===p.id)));
    }
    function step(direction) {
      const list=visibleCatalog();
      select(list[(list.findIndex(p=>p.id===(shown||selected)?.id)+direction+list.length)%list.length]);
    }
    root.querySelector('.portal-prev').onclick=()=>step(-1);
    root.querySelector('.portal-next').onclick=()=>step(1);
    stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowLeft'?-1:1);}});
    function preview(p) {
      if (!p || shown?.id === p.id) return;
      shown = p; const w = world(p);
      root.style.setProperty('--world-accent',w[1]); root.style.setProperty('--world-room',w[2]);
      root.dataset.world = p.id;
      $('#portalArt').innerHTML = art(p,true);
      $('#portalArt').style.setProperty('--portal-art-url', w[0] ? `url("../assets/playables/${w[0]}.jpg")` : 'none');
      $('#portalFormat').textContent = p.format;
      $('#portalTitle').textContent = p.title;
      $('#portalDescription').textContent = w[4];
      $('#portalBrief').textContent = briefs[p.id] || p.description;
      const inspiration = inspirations[p.id] || ['Source credit coming soon', 'From the 2Fly catalogue'];
      $('#portalInspiration').textContent = inspiration[0];
      $('#portalSourceType').textContent = inspiration[1];
      $('#portalLaunch').href = p.path;
      $('#portalDockLaunch').href = p.path;
      $('#portalDockLaunch').setAttribute('aria-label',`Enter ${p.title}`);
      $('#portalDockTitle').textContent = p.title;
      $('#portalLaunch').setAttribute('aria-label',`Enter ${p.title}`);
      $('#portalStatus').textContent = p.status.replaceAll('-',' ');
      $('#portalNumber').textContent = `${String(catalog.indexOf(p)+1).padStart(2,'0')} / ${String(catalog.length).padStart(2,'0')}`;
      grid.querySelectorAll('[data-world]').forEach(b => b.classList.toggle('is-preview', b.dataset.world===p.id));
    }
    function draw() {
      const list = catalog.filter(p => filter==='all' || p.category===filter || (filter==='featured'&&p.featured));
      if (!list.some(p=>p.id===selected?.id)) selected = list[0];
      grid.innerHTML = list.map(p=>`<div class="portal-card-shell" style="--tile-accent:${world(p)[1]};--tile-room:${world(p)[2]}"><div class="portal-card-media"><button class="portal-tile" data-world="${esc(p.id)}" aria-pressed="${p.id===selected?.id}" aria-label="Preview ${esc(p.title)}"><div class="portal-thumb">${art(p)}<span class="portal-tile-action" aria-hidden="true">↗</span><span class="portal-selected">SELECTED</span></div></button><a class="portal-card-start" href="${esc(p.path)}" aria-label="Start ${esc(p.title)}">START EXPERIENCE <span aria-hidden="true">↗</span></a></div><div class="portal-tile-caption"><strong>${esc(p.title)}</strong><span class="portal-beta">Beta Version - Last updated 9/25/26</span></div><a class="portal-card-support" href="#support" data-route="support" aria-label="Help 2Fly Create after ${esc(p.title)}">HELP 2FLY CREATE <span aria-hidden="true">↗</span></a></div>`).join('') || '<p>No experiences in this collection yet.</p>';
      $('#portalCount').textContent = `${String(list.length).padStart(2,'0')} EXPERIENCES`;
      grid.querySelectorAll('.portal-tile').forEach((tile,i)=>tile.style.setProperty('--tile-order',i));
      shown = null; preview(selected);
    }
    grid.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const b=e.target.closest('[data-world]');if(b)preview(catalog.find(p=>p.id===b.dataset.world));});
    grid.addEventListener('pointerleave',()=>preview(selected));
    grid.addEventListener('focusin',e=>{const b=e.target.closest('[data-world]');if(b)preview(catalog.find(p=>p.id===b.dataset.world));});
    grid.addEventListener('click',e=>{const b=e.target.closest('[data-world]');if(b)select(catalog.find(p=>p.id===b.dataset.world));});
    $('.portal-filters').addEventListener('click',e=>{const b=e.target.closest('[data-world-filter]');if(!b)return;filter=b.dataset.worldFilter;$('.portal-filters').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw();});
    root.querySelectorAll('.portal-launch').forEach(link=>link.addEventListener('click',e=>{
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      e.preventDefault();if(root.classList.contains('is-entering'))return;
      const destination=e.currentTarget.href;root.classList.add('is-entering');
      setTimeout(()=>{if(root.isConnected&&app.route==='playables')location.assign(destination);},700);
    }));
    const observer = new IntersectionObserver(entries=>{if(!root.isConnected){observer.disconnect();fit.disconnect();return;} root.querySelector('.portal-dock').hidden=entries[0].isIntersecting;},{rootMargin:'-235px 0px 0px 0px'});
    observer.observe(root.querySelector('.portal-stage'));
    draw();
  };
  // The base catalog fetch may finish before this enhancement script loads.
  if(app.route==='playables' && document.querySelector('.playables-page')) renderPlayables();
})();
