(() => {
  'use strict';
  // One shared EST window, independent of the visitor's timezone.
  const start = Date.parse('2026-11-03T00:00:00-05:00');
  const end = Date.parse('2026-11-04T00:00:00-05:00');
  let timer;
  function update() {
    clearTimeout(timer);
    const now = Date.now();
    const collection = ['', '#', '#home', '#big-screen'].includes(location.hash);
    const active = now >= start && now < end && collection;
    let banner = document.getElementById('election-day-reminder');
    if (active && !banner) {
      const header = document.querySelector('.site-header');
      if (header) {
        banner = document.createElement('aside');
        banner.id = 'election-day-reminder';
        banner.setAttribute('aria-label', 'Election Day reminder');
        banner.innerHTML = '<span class="vote-sticker" aria-hidden="true">✓ VOTE<small>NOV 3</small></span><div class="vote-copy"><strong>Your move. Your vote.</strong><p>It’s Election Day. Make time to vote, then come back for a little play.</p></div><a class="vote-link" href="https://www.usa.gov/find-polling-place">Find your polling place <span aria-hidden="true">→</span></a>';
        header.insertAdjacentElement('afterend', banner);
      }
    } else if (!active && banner) {
      banner.remove();
    }
    document.documentElement.classList.toggle('election-day', active);
    // Recheck open tabs at the boundary; cap waits to recover from clock changes.
    if (now < end) {
      const boundary = now < start ? start : end;
      timer = setTimeout(update, Math.min(Math.max(1, boundary - now), 60000));
    }
  }
  window.addEventListener('hashchange', update);
  window.addEventListener('pageshow', update);
  window.addEventListener('focus', update);
  document.addEventListener('visibilitychange', update);
  update();
})();
