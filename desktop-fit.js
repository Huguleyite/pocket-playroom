// Collection-only presentation. Moving secondary panels retains their state and handlers.
(() => {
  const game = document.body.dataset.playroomGame;
  // Keep the hand beneath the board at every size; resizing never moves game state.
  if (game === 'hex-gambit') {
    const arena = document.querySelector('.arena');
    const hand = document.querySelector('#hand');
    const label = document.querySelector('.hand-label');
    if (arena && hand && label) {
      const tray = document.createElement('section');
      tray.className = 'hex-hand-tray';
      tray.setAttribute('aria-label', 'Your spell cards');
      tray.append(label, hand);
      arena.after(tray);
      const inspectRow = document.createElement('div');
      inspectRow.className = 'hex-inspect-row';
      tray.append(inspectRow);
      const preview = document.createElement('dialog');
      preview.className = 'playroom-drawer hex-card-preview';
      preview.setAttribute('aria-label', 'Spell details');
      document.body.append(preview);
      const update = () => {
        inspectRow.replaceChildren();
        hand.querySelectorAll('[data-card]').forEach(card => {
          const inspect = document.createElement('button');
          inspect.textContent = 'Inspect ' + card.querySelector('strong').textContent;
          inspect.addEventListener('click', () => {
            const close = document.createElement('button');
            close.textContent = 'Close';
            close.className = 'playroom-close';
            close.onclick = () => preview.close();
            const content = document.createElement('div');
            content.className = 'hex-enlarged-card';
            content.innerHTML = card.innerHTML;
            const cast = document.createElement('button');
            cast.textContent = 'Select spell to cast';
            cast.disabled = card.disabled;
            cast.onclick = () => { preview.close(); if (card.isConnected && !card.disabled) card.click(); };
            preview.replaceChildren(close, content, cast);
            preview.onclose = () => { if (inspect.isConnected) inspect.focus(); };
            preview.showModal();
          });
          inspectRow.append(inspect);
        });
      };
      new MutationObserver(update).observe(hand, {childList:true});
      update();
    }
  }
  const bar = document.createElement('div');
  bar.className = 'playroom-tools';
  const back = document.querySelector('body > .playroom-return');
  if (back) bar.append(back);
  const panels = {
    'hex-gambit': [['.commander', 'Army'], ['.chronicle-panel', 'Chronicle'], ['.vip', 'Archmage'], ['.court-controls', 'Board settings', true], ['.orders .detail-block', 'Piece details', true]],
    lineage: [['.house-column', 'House & favors'], ['.chronicle', 'Chronicle']],
    'quantum-draft': [['.recent-hands', 'Recent hands'], ['.terminal', 'Telemetry']],
    chronodeck: [['#relics', 'Relics']]
  };
  for (const [selector, label, compactOnly] of panels[game] || []) {
    const panel = document.querySelector(selector);
    if (!panel) continue;
    const originalPosition = document.createComment('Secondary panel position');
    panel.before(originalPosition);
    const dialog = document.createElement('dialog');
    dialog.className = 'playroom-drawer';
    dialog.id = 'playroom-' + selector.slice(1);
    dialog.setAttribute('aria-label', label);
    const close = document.createElement('button');
    close.textContent = 'Close ' + label;
    close.className = 'playroom-close';
    close.addEventListener('click', () => dialog.close());
    dialog.append(close, panel);
    document.body.append(dialog);
    const toggle = document.createElement('button');
    toggle.textContent = label;
    toggle.setAttribute('aria-haspopup', 'dialog');
    toggle.setAttribute('aria-controls', dialog.id);
    toggle.addEventListener('click', () => {
      dialog.append(panel);
      if (panel.tagName === 'DETAILS') panel.open = true;
      dialog.showModal();
    });
    dialog.addEventListener('close', () => toggle.focus());
    if (game === 'chronodeck') {
      const roomy = matchMedia('(min-width:1400px) and (min-height:850px)');
      const arrangeRelics = () => {
        if (dialog.open) return;
        if (roomy.matches) originalPosition.after(panel);
        else dialog.append(panel);
      };
      roomy.addEventListener('change', arrangeRelics);
      dialog.addEventListener('close', arrangeRelics);
      arrangeRelics();
    }
    bar.append(toggle);
    if (compactOnly) {
      const compact = matchMedia('(min-width:621px) and (max-width:999px)');
      const arrange = () => {
        if (!compact.matches && dialog.open) dialog.close();
        toggle.hidden = !compact.matches;
        if (compact.matches) dialog.append(panel);
        else originalPosition.after(panel);
      };
      compact.addEventListener('change', arrange);
      arrange();
    }
  }
  const full = document.createElement('button');
  full.textContent = 'Fullscreen';
  if (document.fullscreenEnabled) {
    full.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch { full.textContent = 'Fullscreen unavailable'; }
    });
    document.addEventListener('fullscreenchange', () => {
      full.textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen';
    });
    bar.append(full);
  }
  document.body.prepend(bar);
  const measure = () => document.documentElement.style.setProperty('--playroom-bar', bar.getBoundingClientRect().height + 'px');
  new ResizeObserver(measure).observe(bar);
  measure();
})();

// Measure actual space below the header and board controls, including browser scaling.
(() => {
 if(document.body.dataset.playroomGame!=='hex-gambit')return;
 const battle=document.querySelector('#battleView');
 let pending=false;
 const measure=()=>{pending=false;if(battle.hidden)return;const top=battle.getBoundingClientRect().top+scrollY;document.documentElement.style.setProperty('--hex-battle-height',Math.max(510,innerHeight-top-12)+'px');};
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(measure);}};
 new ResizeObserver(schedule).observe(document.querySelector('.console>header'));
 new ResizeObserver(schedule).observe(document.querySelector('.court-controls'));
 new ResizeObserver(schedule).observe(document.querySelector('.playroom-tools'));
 new MutationObserver(schedule).observe(battle,{attributes:true,attributeFilter:['hidden']});
 window.addEventListener('resize',schedule);schedule();
 window.visualViewport?.addEventListener('resize',schedule);
})();
