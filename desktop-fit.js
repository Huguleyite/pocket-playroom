// Collection-only presentation. Moving secondary panels retains their state and handlers.
(() => {
  const game = document.body.dataset.playroomGame;
  // Spells share the orders column so the board can use the full available height.
  if (game === 'hex-gambit') {
    const orders = document.querySelector('.orders');
    const controls = orders?.querySelector('.battle-controls');
    const spells = ['.hand-label', '#hand'].map(selector => {
      const element = document.querySelector(selector);
      const anchor = document.createComment('Original spell position');
      element?.before(anchor);
      return {element, anchor};
    });
    const wide = matchMedia('(min-width:700px)');
    const arrange = () => spells.forEach(({element, anchor}) => {
      if (!element || !controls) return;
      if (wide.matches) orders.insertBefore(element, controls);
      else anchor.after(element);
    });
    wide.addEventListener('change', arrange);
    arrange();
  }
  const bar = document.createElement('div');
  bar.className = 'playroom-tools';
  const back = document.querySelector('body > .playroom-return');
  if (back) bar.append(back);
  const panels = {
    'hex-gambit': [['.commander', 'Army'], ['.chronicle-panel', 'Chronicle'], ['.detail-block', 'Inspect'], ['.vip', 'Archmage']],
    lineage: [['.house-column', 'House & favors'], ['.chronicle', 'Chronicle']],
    'quantum-draft': [['.recent-hands', 'Recent hands'], ['.terminal', 'Telemetry']],
    chronodeck: [['#relics', 'Relics']]
  };
  for (const [selector, label] of panels[game] || []) {
    const panel = document.querySelector(selector);
    if (!panel) continue;
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
      if (panel.tagName === 'DETAILS') panel.open = true;
      dialog.showModal();
    });
    dialog.addEventListener('close', () => toggle.focus());
    bar.append(toggle);
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
