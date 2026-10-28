/* One recent-visit contract shared by the catalogue, embedded games and full-page games. */
(() => {
 'use strict';
 const base=new URL('./',document.currentScript.src),key='room-for-play:last';
 const games={
  windows:['Window Lights','#games/windows'], 'windows-space':['Deep Space Decoder','#games/windows/space'],
  weave:['Weave It to Me','#games/weave'],tide:['Tile Tide','#games/tide'],shift:['Shift & Lock','#games/shift'],
  lock:['LetterLock','#games/lock'],deli:['Stack to the Future','#games/deli'],binario:['Binario / Neon Logic','#games/binario'],
  futoshiki:['Futoshiki','#games/futoshiki'],signal:['Signal Flow','#games/signal'],station:['Signal Station','#games/station'],
  draw:['The Draw','#games/draw'],'draw-scorecard':['The Draw: Scorecard','#games/draw/scorecard'],
  chronodeck:['ChronoDeck: Breach','#big-screen/chronodeck'],lineage:['Lineage: Kingdom Architect','#big-screen/lineage'],
  'hex-gambit':['Hex-Gambit: Rogue Checkers','#big-screen/hex-gambit'],'quantum-draft':['Quantum Draft','#big-screen/quantum-draft'],
  'frequency-1984':['Frequency: 1984','#big-screen/frequency-1984'],
  'little-wilds':['Little Wilds','#big-screen/little-wilds/play']
 };
 function resolve(id,route){
  const variant=Object.keys(games).find(k=>games[k][1]===route);if(variant)id=variant;
  if(!games[id])return null;
  let href=games[id][1];
  if(typeof route==='string'&&route.startsWith('#challenge/')){
   try{const c=window.PocketChallenge?.decode(route.slice(11));if(!c||c.id!==id)return null;href=route;}catch{return null;}
  }
  let name=games[id][0];
  if(id==='binario')try{const prefs=JSON.parse(localStorage.getItem('room-for-play:night'))||{};const neon=prefs.overrides?.binario??prefs.global??JSON.parse(localStorage.getItem('room-for-play:neon:mode'));name=neon?'Neon Logic':'Binario';}catch{name='Binario';}
  return {id,name,route:href};
 }
 function read(){try{const stored=JSON.parse(localStorage.getItem(key));return stored&&resolve(stored.id,stored.route);}catch{return null;}}
 function remember(id,route){const visit=resolve(id,route);if(!visit)return;try{localStorage.setItem(key,JSON.stringify({...visit,visited:Date.now()}));}catch{}}
 function game(id){return resolve(id);}
 function currentGame(){
  const relative=location.pathname.startsWith(base.pathname+'games/')?location.pathname.slice((base.pathname+'games/').length):'';
  if(relative){let id=relative.split('/')[0];if(id==='wilds')id='little-wilds';if(id==='windows'&&relative.includes('/deep-space/'))id='windows-space';if(id==='draw'&&relative.endsWith('/scorecard.html'))id='draw-scorecard';return game(id);}
  const exact=Object.keys(games).find(id=>games[id][1]===location.hash);if(exact){if(exact==='windows'&&document.getElementById('game-frame')?.getAttribute('src')?.includes('/deep-space/'))return game('windows-space');return game(exact);}
  const big=location.hash.match(/^#big-screen\/([^/]+)(?:\/play)?$/);if(big)return game(big[1]);
  if(location.hash.startsWith('#challenge/'))try{return game(window.PocketChallenge?.decode(location.hash.slice(11))?.id);}catch{}
  return null;
 }
 window.PocketRecent=Object.freeze({read,remember,game,currentGame});
 function refreshCard(){
  const hero=document.querySelector('#main .home-hero');if(!hero)return;
  const last=read(),existing=document.querySelector('#main .resume');
  if(!last){existing?.remove();return;}
  if(existing?.querySelector('strong')?.textContent===last.name&&existing.querySelector('a')?.getAttribute('href')===last.route)return;
  const section=document.createElement('section');section.className='resume';section.setAttribute('aria-label','Recently played');
  const p=document.createElement('p');p.textContent='Last time you were here';const name=document.createElement('strong');name.textContent=last.name;p.append(name);
  const a=document.createElement('a');a.className='pill-link';a.href=last.route;a.textContent='Play again →';section.append(p,a);
  if(existing)existing.replaceWith(section);else hero.after(section);
 }
 addEventListener('storage',e=>{if(e.key===key||e.key===null)refreshCard();});
 addEventListener('focus',refreshCard);addEventListener('pageshow',refreshCard);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshCard();});
 // Record actual game documents, including full-page launches and direct entries.
 function opened(){
  if(!location.pathname.startsWith(base.pathname+'games/'))return;
  const relative=location.pathname.slice((base.pathname+'games/').length);
  let id=relative.split('/')[0];
  if(id==='wilds')id='little-wilds';
  if(id==='windows'&&relative.includes('/deep-space/'))id='windows-space';
  if(id==='draw'&&relative.endsWith('/scorecard.html'))id='draw-scorecard';
  let route;
  try{if(window!==top&&parent.location.hash.startsWith('#challenge/'))route=parent.location.hash;}catch{}
  remember(id,route);
 }
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',opened,{once:true});else opened();
})();
