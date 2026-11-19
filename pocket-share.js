// Collection sharing only. Reading a result never changes a round or browser saves.
(() => {
  'use strict';
  function install({id, title, container, button, ad, back, result, available, beforeShare, challenge}) {
    const host = document.querySelector(container);
    if (!host || host.querySelector('.pocket-sharing')) return;
    const route = id === 'draw-scorecard' ? 'draw/scorecard' : id;
    const gameUrl = new URL(`../../index.html#games/${route}`,location.href).href;
    const challengeData=()=>{try{return challenge?.();}catch{return null;}};
    const url=()=>{const data=challengeData();return data?PocketChallenge.link(id,data):gameUrl;};
    const group = document.createElement('section');
    group.className = 'pocket-sharing';
    group.setAttribute('aria-label', 'Share your result');
    const share = button && document.querySelector(button) || document.createElement('button');
    const link = document.createElement('button');
    const status = document.createElement('p');
    const fallback = document.createElement('textarea');
    share.type = link.type = 'button';
    share.textContent = challenge ? 'Challenge a friend' : 'Share result';
    share.classList.add('pocket-share-result');
    if (!button) share.classList.add('primary');
    link.className = 'pocket-copy-link';
    link.textContent = challenge ? 'Copy challenge link' : 'Copy game link';
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
    const comparison=document.createElement('p');comparison.className='pocket-challenge-comparison';comparison.setAttribute('role','status');
    group.append(comparison, share, link, status, fallback);
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
      const data=challengeData(),m=PocketChallenge.metric(id);
      const invitation=data?`\n\n${m.lower?'Can you beat my result?':'Can you beat my score?'} ${data.value} ${m.unit}. Play my exact round:`:'';
      const text = `${result().trim()}${invitation}\n\n${url()}`;
      if (navigator.share) {
        try { await navigator.share({title, text}); status.textContent = 'Result shared.'; return; }
        catch (error) { if (error.name === 'AbortError') return; }
      }
      await copy(text, 'result');
    }, true);
    link.addEventListener('click', async () => { if (ready()) { reset(); await copy(url(), 'link'); } });
    function updateChallenge(){
      const data=challengeData();
      share.textContent=data?(PocketChallenge.incoming?'Challenge another friend':'Challenge a friend'):'Share result';
      link.textContent=data?'Copy challenge link':'Copy game link';
      comparison.textContent=data&&PocketChallenge.incoming?`${PocketChallenge.compare(id,data.value)} Target: ${PocketChallenge.incoming.target} ${PocketChallenge.metric(id).unit}. Your result: ${data.value}.`:'';
    }
    // Observe the game's result container, not this group, to avoid feedback loops.
    const observer=new MutationObserver(records=>{if(records.some(r=>!group.contains(r.target)))updateChallenge();});
    observer.observe(host,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['open']});
    updateChallenge();
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

// Keep Tilt controls within the visible phone viewport.
if (/\/games\/tilt-and-tumble\/play\.html$/.test(location.pathname)) {
 document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = "/* Reserve control space first; the canvas cannot impose its intrinsic height. */\n.quick-settings{grid-template-columns:minmax(0,1fr) auto auto;align-items:center}\n.quick-pause,#menu summary{min-height:44px;min-width:64px;font-size:14px}\n.delivery-mode .quick-settings{grid-template-columns:minmax(0,1fr) auto}\n@media(max-width:900px),(pointer:coarse),(max-height:750px){\n body:has(main:not(.delivery-mode)){height:100dvh;min-height:0;overflow:hidden;display:block}\n main:not(.delivery-mode){height:100%;width:100%;margin:0;padding:max(6px,env(safe-area-inset-top)) max(8px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))}\n main:not(.delivery-mode) section{height:100%;min-height:0;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-areas:\"brand brand\" \"board board\" \"score next\" \"reserve reserve\" \"utilities utilities\";grid-template-rows:auto minmax(0,1fr) auto auto auto;gap:6px}\n main.club-mode:not(.delivery-mode) section{grid-template-areas:\"brand brand\" \"board board\" \"score next\" \"utilities utilities\";grid-template-rows:auto minmax(0,1fr) auto auto}\n main:not(.delivery-mode) .well{position:relative;width:100%;height:100%;min-height:0;min-width:0;container-type:size;justify-self:stretch;padding:4px}\n main:not(.delivery-mode) #board{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(calc(100cqw - 8px),calc(50cqh - 4px));height:auto;max-height:calc(100% - 8px);aspect-ratio:1/2}\n main.landscape:not(.delivery-mode) #board{width:min(calc(100cqw - 8px),calc(200cqh - 16px));aspect-ratio:2/1}\n main:not(.delivery-mode) h1{font-size:clamp(19px,4vw,30px);padding:8px}\n main:not(.delivery-mode) .panel{padding:5px 8px}\n main:not(.delivery-mode) #next{height:34px;width:auto;max-width:100%;margin:0 auto}\n main:not(.delivery-mode) .reserve{margin-top:3px;grid-template-columns:1.35fr 1fr 1fr;gap:6px}\n main:not(.delivery-mode) .reserve button{min-height:44px;grid-column:auto;grid-row:auto}\n main:not(.delivery-mode) .reserve canvas{height:28px}\n main:not(.delivery-mode) .quick-settings{grid-template-columns:minmax(0,1fr) auto auto}\n main:not(.delivery-mode) .volume-label{display:none}\n main:not(.delivery-mode) .music-controls{grid-template-columns:auto minmax(30px,1fr);min-width:0}\n main:not(.delivery-mode) #menu{width:auto}\n main:not(.delivery-mode) #menu summary{padding:4px 9px}\n main:not(.delivery-mode) .menu-items{width:min(340px,calc(100vw - 24px));max-height:calc(100dvh - 76px);z-index:10}\n main:not(.delivery-mode) footer{display:none}\n}\n";
  style.textContent += `
/* Completed rounds need a definite board height after the page starts scrolling. */
@media(max-width:900px),(pointer:coarse),(max-height:750px){
 body.club-result-open:has(main:not(.delivery-mode)){height:auto;min-height:100dvh;overflow-y:auto}
 .club-result-open main.club-mode:not(.delivery-mode){height:auto;max-height:none}
 .club-result-open main.club-mode:not(.delivery-mode) section{height:auto;grid-template-rows:auto auto auto auto}
 .club-result-open main.club-mode:not(.delivery-mode) .well{height:clamp(180px,32dvh,360px);min-height:180px}
 .club-result-open main.club-mode:not(.delivery-mode) #board{position:static;transform:none;width:auto;height:100%;max-height:100%;max-width:100%;justify-self:center}
 main:not(.delivery-mode) #menu .menu-items{position:fixed;left:auto;right:max(12px,env(safe-area-inset-right));top:max(12px,env(safe-area-inset-top));bottom:auto;width:min(340px,calc(100vw - 24px));max-height:calc(100dvh - 24px - env(safe-area-inset-top));overflow-y:auto;overscroll-behavior:contain;z-index:100}
 #menu .menu-close{position:sticky;top:0;z-index:1;min-height:44px;background:#172337}
}
`;
  document.head.append(style);
  document.querySelector("meta[name=viewport]").content = "width=device-width, initial-scale=1, viewport-fit=cover";
  const pause = document.querySelector("#menu [data-action=pause]");
  const menu = document.querySelector("#menu");
  if (menu) {
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'menu-close';
    close.textContent = 'Close menu';
    close.addEventListener('click', event => { event.stopPropagation(); menu.open = false; menu.querySelector('summary').focus(); });
    menu.querySelector('.menu-items').prepend(close);
  }
  if (pause && menu && !document.querySelector("main.delivery-mode")) { pause.classList.add("quick-pause"); menu.before(pause); }
 });
}
