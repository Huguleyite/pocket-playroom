// Collection sharing only. Reading a result never changes a round or browser saves.
(() => {
  'use strict';
  function install({id, title, container, button, ad, back, result, available, beforeShare}) {
    const host = document.querySelector(container);
    if (!host || host.querySelector('.pocket-sharing')) return;
    const route = id === 'draw-scorecard' ? 'draw/scorecard' : id;
    const url = `https://pocketplayroom.com/#games/${route}`;
    const group = document.createElement('section');
    group.className = 'pocket-sharing';
    group.setAttribute('aria-label', 'Share your result');
    const share = button && document.querySelector(button) || document.createElement('button');
    const link = document.createElement('button');
    const status = document.createElement('p');
    const fallback = document.createElement('textarea');
    share.type = link.type = 'button';
    share.textContent = 'Share result';
    share.classList.add('pocket-share-result');
    if (!button) share.classList.add('primary');
    link.className = 'pocket-copy-link';
    link.textContent = 'Copy game link';
    status.className = 'pocket-share-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    fallback.className = 'pocket-share-fallback';
    fallback.readOnly = true;
    fallback.hidden = true;
    fallback.setAttribute('aria-label', 'Text to select and copy');
    // Insert before moving an existing button out of its original actions row.
    const oldRow = share.parentElement;
    if (oldRow && host.contains(share)) {
      (oldRow.classList.contains('actions') ? oldRow : share).before(group);
    } else host.append(group);
    group.append(share, link, status, fallback);
    const advert = ad && document.querySelector(ad);
    if (advert) advert.after(group);
    let last = group;
    for (const returnButton of back ? document.querySelectorAll(back) : []) {
      last.after(returnButton);
      last = returnButton;
    }
    // Retain legacy nodes for existing game listeners, but expose one sharing UI.
    for (const node of host.querySelectorAll('#copy, #share-status, #shareStatus, #shiftlock-share-status, #copy-fallback, #share-fallback, #shiftlock-share-text')) node.hidden = true;
    if (host.tagName === 'DIALOG') host.classList.add('pocket-result-dialog');
    function reset() { status.textContent = ''; fallback.hidden = true; }
    function select(text, kind) {
      fallback.hidden = false;
      fallback.value = text;
      fallback.setAttribute('aria-label', kind === 'link' ? 'Game link to copy' : 'Result text to copy');
      fallback.focus(); fallback.select(); fallback.setSelectionRange(0, text.length);
      status.textContent = kind === 'link' ? 'Select and copy the game link below.' : 'Select and copy your result below.';
    }
    async function copy(text, kind) {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
        status.textContent = kind === 'link' ? 'Game link copied. Paste it wherever you like.' : 'Result copied. Paste it wherever you like.';
      } catch { select(text, kind); }
    }
    function ready() { return !available || available(); }
    // Capture prevents each game's older share listener from running a second time.
    share.addEventListener('click', async event => {
      event.preventDefault(); event.stopImmediatePropagation();
      if (!ready() || (beforeShare && !beforeShare())) return;
      reset();
      const text = `${result().trim()}\n\n${url}`;
      if (navigator.share) {
        try { await navigator.share({title, text}); status.textContent = 'Result shared.'; return; }
        catch (error) { if (error.name === 'AbortError') return; }
      }
      await copy(text, 'result');
    }, true);
    link.addEventListener('click', async () => { if (ready()) { reset(); await copy(url, 'link'); } });
    if (host.tagName === 'DIALOG') {
      new MutationObserver(reset).observe(host, {attributes:true, attributeFilter:['open']});
    }
    if (available) {
      const update = () => { group.hidden = !ready(); if (group.hidden) reset(); };
      // The Draw keeps results inline and allows Undo; follow its existing status updates.
      new MutationObserver(update).observe(document.getElementById('status'), {childList:true, subtree:true, characterData:true});
      update();
    }
    return group;
  }
  window.PocketShare = Object.freeze({install});
})();
