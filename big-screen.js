window.renderBigScreen = function(main) {
  main.innerHTML = `
  <div class="big-section-label">More room. Deeper play.</div>
  <nav class="big-game-tabs" aria-label="Big Screen games"><a href="#big-screen/chronodeck" aria-current="page">ChronoDeck: Breach</a></nav>
  <section class="chrono-hero" aria-labelledby="chrono-title">
    <div class="chrono-copy"><p class="chrono-kicker">Sci-fi deckbuilding · Playable prototype</p>
      <h1 id="chrono-title">CHRONODECK<span>BREACH</span></h1>
      <p class="chrono-tagline">Build your deck. Bend the timeline. Breach the station.</p>
      <p class="chrono-description">A sci-fi deckbuilding adventure with branching encounters and a run that saves as you play.</p>
      <div class="chrono-actions"><a class="chrono-play" href="games/chronodeck/index.html">Play ChronoDeck <span aria-hidden="true">→</span></a><button id="chrono-help">How to play</button></div>
      <p class="chrono-device"><span aria-hidden="true">▱</span> Best on a laptop or larger display.</p>
      <p class="chrono-fold">Playing unfolded? Use a wide view for more room.</p>
    </div>
    <div class="chrono-art" aria-hidden="true"><div class="chrono-portal"></div><img class="chrono-drone" src="games/chronodeck/assets/enemies/breach-drone.png" alt="">
      <div class="chrono-cards">
        <div class="showcase-card attack"><div class="showcase-card-top"><b>1</b><span>Attack</span></div><img src="games/chronodeck/assets/cards/strike.jpg" alt=""><strong>Pulse Strike</strong><p>Deal 6 damage.</p><small>ONE ENEMY</small></div>
        <div class="showcase-card defend"><div class="showcase-card-top"><b>1</b><span>Defend</span></div><img src="games/chronodeck/assets/cards/guard.jpg" alt=""><strong>Barrier</strong><p>Gain 5 block.</p><small>SELF</small></div>
        <div class="showcase-card time"><div class="showcase-card-top"><b>1</b><span>Time</span></div><img src="games/chronodeck/assets/cards/loop.jpg" alt=""><strong>Loop</strong><p>Replay your last non-loop card.</p><small>PREVIOUS CARD</small></div>
      </div>
    </div>
  </section>
  <section class="chrono-preview" aria-labelledby="preview-title"><div class="chrono-preview-title"><h2 id="preview-title">A look inside the breach</h2><p>Plan your next move. Rewrite what comes next.</p><span>Gameplay preview</span></div><div class="chrono-preview-crop"><img src="assets/chronodeck/gameplay.png" alt="ChronoDeck combat: the Drifter faces a Breach Drone, with a timeline of upcoming attacks and a hand of illustrated cards." loading="lazy"></div></section>
  <section class="chrono-features" aria-label="Game features"><div><span aria-hidden="true"><svg viewBox="0 0 40 40"><rect x="9" y="4" width="23" height="30" rx="4"/><path d="M7 10H4v24a3 3 0 0 0 3 3h21v-2"/></svg></span><h2>Build your deck</h2><p>Discover powerful cards and synergies as you push deeper into the unknown.</p></div><div><span aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M8 4h24M8 36h24M11 4v5c0 5 5 8 9 11-4 3-9 6-9 11v5M29 4v5c0 5-5 8-9 11 4 3 9 6 9 11v5M14 30h12"/></svg></span><h2>Control the timeline</h2><p>Delay, loop, and rewrite what happens next. Turn the enemy’s plans against them.</p></div><div><span aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14"/><circle cx="20" cy="20" r="5"/><path d="M20 1v6m0 26v6M1 20h6m26 0h6"/></svg></span><h2>Pick up your run</h2><p>Your progress saves in this browser, so you can continue the breach.</p></div></section>
  <dialog id="chrono-guide" aria-labelledby="chrono-guide-title"><div class="dialog-top"><h2 id="chrono-guide-title">Survive the breach.</h2><button id="chrono-guide-close" aria-label="Close instructions">×</button></div><ol><li>Choose a route through seven floors of encounters. Defeat the final Chrono Sentinel to win.</li><li>Spend energy to play cards. Click an Attack, then its enemy, or drag a card to its target.</li><li>Read enemy intents and the timeline. Build block, delay attacks, and end your turn when ready.</li><li>Draft cards, collect relics, visit shops, and rest. Your run saves automatically in this browser.</li></ol><p>The game opens with a full field guide. Reopen it anytime with How to play.</p><a class="chrono-play" href="games/chronodeck/index.html">Play ChronoDeck →</a></dialog>`;
  const dialog=document.getElementById('chrono-guide');
  document.getElementById('chrono-help').onclick=()=>dialog.showModal();
  document.getElementById('chrono-guide-close').onclick=()=>dialog.close();
};
