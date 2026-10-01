/* Keep a single copy of each live HUD element and its listeners. */
(() => {
  const game = document.querySelector('#game');
  const arena = document.createElement('div'); arena.className = 'arena';
  const left = document.createElement('aside'); left.className = 'strategyPanel'; left.setAttribute('aria-label','Objectives and profile');
  const right = document.createElement('aside'); right.className = 'contestantPanel'; right.setAttribute('aria-label','Score and contestants');
  const main = game.querySelector('main');
  left.append(game.querySelector('.missionStrip'), game.querySelector('#profileRibbonWrap'));
  right.append(game.querySelector('.hudTop'), game.querySelector('#contestantWrap'));
  const heading = document.createElement('h2'); heading.textContent = 'KEEP THE CONNECTION'; right.insertBefore(heading,right.lastElementChild);
  main.prepend(game.querySelector('.runStrip'),game.querySelector('#moveFeedback'));
  arena.append(left, main, right); game.insertBefore(arena,game.querySelector('#toast'));
})();

// A fresh visit or restored welcome screen always opens at its heading.
function resetWelcomeScroll() {
  const title = document.querySelector('#title.active');
  if (!title) return;
  window.scrollTo(0, 0);
  for (const el of [document.documentElement, document.body, document.querySelector('#app'), title]) {
    el.scrollTop = 0; el.scrollLeft = 0;
  }
}
window.addEventListener('pageshow', resetWelcomeScroll);
resetWelcomeScroll();
