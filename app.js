(() => {
  'use strict';
  const games = [
    {id:'weave',name:'Weave It to Me',category:'Daily · Word puzzle',line:'Good words come together.',art:['W','E','A','V'],tile:'#e6d6f7',ink:'#603a86',paper:'#fbf3e9',accent:'#70429e',help:'Swipe horizontally to shift a row or vertically to shift a column. Four-letter words clear, letters fall, and cascades multiply your score. Complete five words to finish the day.',note:'One good word can unravel the whole board.',symbol:'W ↔',subtitle:'The daily word stitch'},
    {id:'tide',name:'Tile Tide',category:'Daily · Word hunt',line:'Small words. Big drops.',art:['T','I','D','E'],tile:'#cce8dc',ink:'#226267',paper:'#eff8ef',accent:'#216d75',help:'Connect neighboring tiles, including diagonals, to make words of three or more letters. Submit your word to clear tiles and start a cascade. You have ten moves.',note:'The best word might be hiding one little turn away.',symbol:'≈ ≈',subtitle:'The daily word cascade'},
    {id:'shift',name:'Shift & Lock',category:'Daily · Logic puzzle',line:'A little shift. A little clarity.',art:['┏','━','┓'],tile:'#dce6bb',ink:'#446237',paper:'#f0f3df',accent:'#a84525',help:'Tap a tile to rotate it. Swipe a row or column to shift it with wraparound. Connect the two edge dots to lock the path. The answer preview can show one valid solution.',note:'Sometimes a new direction is all it takes.',symbol:'┏━┓',subtitle:'The daily connection workshop'},
    {id:'lock',name:'LetterLock',category:'Daily · Word safe',line:'Bright minds. Golden combinations.',art:['L','O','C','K'],tile:'#f1d99e',ink:'#77531f',paper:'#f5eddd',accent:'#85602b',help:'Swipe a dial up or down, or use its arrow buttons. Each dial moves independently. Align category words on the gold line to unlock them. Find every daily target to open the safe.',note:'Every word is another turn of the key.',symbol:'A ✳',subtitle:'The daily word safe'},
    {id:'deli',name:'Stack to the Future',category:'Replayable · Quick hands',line:'Fresh stacks. Fast hands.',art:['🥪'],tile:'#ffdac4',ink:'#963d28',paper:'#fff0d6',accent:'#af3e2c',help:'Read the order ticket from left to right and tap the matching ingredients. Practice without a timer, then start your sixty-second rush. Use Pause whenever you need a breather.',note:'Keep it fresh. Keep it moving. Extra cheese encouraged.',symbol:'🥪',subtitle:'Your lunch rush starts here'},
    {id:'binario',name:'Binario',category:'Daily · Logic puzzle',line:'Two sides. One bright idea.',art:['0','1','0'],tile:'#f5d4a0',ink:'#345366',paper:'#fff3df',accent:'#a64b28',help:'Fill every row and column with equal numbers of zeros and ones. No three identical numbers may sit consecutively. Rows must be distinct from each other, as must columns. Tap an empty tile to cycle through 0, 1, and blank. Switch on Neon Logic for a Cyan and Magenta circuit. Both modes share the same daily puzzle.',note:'Balance is the beginning. The pattern is the payoff.',symbol:'0 1',subtitle:'The balancing act'},
    {id:'futoshiki',name:'Futoshiki',category:'Sample · Number puzzle',line:'A little greater. A little wiser.',art:['2','<','5'],tile:'#e0e4ef',ink:'#4e6282',paper:'#f8f0e5',accent:'#aa493c',sample:true,help:'Place 1–5 in every row and column, with no repeated number. Obey the greater-than and less-than signs. Select a square and use the number keys; Pencil lets you jot down candidates.',note:'The open side of the sign faces the larger number.',symbol:'< >',subtitle:'The number workshop'}
    ,{id:'signal',name:'Signal Flow',nightOnly:true,category:'New · Night Play exclusive',line:'A new game comes to light.',art:['↳','✦','↱'],tile:'#14202f',ink:'#ffd563',paper:'#080c16',accent:'#ffd563',help:'Tap an interior prism to rotate it clockwise. Route Cyan, Magenta, and Gold beams to matching targets. All three colors share junctions. Route each color through filters to both matching targets. Wrong-color arrivals block completion.',note:'Some things only come to light after dark.',symbol:'✦',subtitle:'A Night Play discovery'}
  ];
  const main=document.getElementById('main'),info=document.getElementById('info');
  let current=null,frame=null;
  function read(key){try{return JSON.parse(localStorage.getItem(key));}catch{return null;}}
  const nightKey='room-for-play:night';
  const loadedNight=read(nightKey);let nightPrefs={global:loadedNight?.global===true,overrides:loadedNight?.overrides&&typeof loadedNight.overrides==='object'?loadedNight.overrides:{}};
  if(!loadedNight&&read('room-for-play:neon:mode')===true)nightPrefs.overrides.binario=true;
  const nightPalettes={weave:['#cba1fa','#332442'],tide:['#73d4bc','#566178'],shift:['#93d6a5','#34354c'],lock:['#f1cd7c','#332d20'],deli:['#ffac80','#3b2922'],futoshiki:['#a6b9ff','#292e48'],binario:['#00f3ff','#142438'],signal:['#ffd563','#14202f']};
  function nightOn(id=current){return id?typeof nightPrefs.overrides[id]==='boolean'?nightPrefs.overrides[id]:nightPrefs.global:nightPrefs.global;}
  function saveNight(){try{localStorage.setItem(nightKey,JSON.stringify(nightPrefs));localStorage.setItem('room-for-play:neon:mode',JSON.stringify(nightOn('binario')));}catch{}}
  function syncNightDiscovery(){
    if(current)return;
    let discovery=document.getElementById('night-discovery');
    if(nightPrefs.global){
      if(!discovery){document.querySelector('.collection-top').insertAdjacentHTML('beforebegin',`<section id="night-discovery" aria-label="New game unlocked"><a class="signal-discovery" href="#games/signal" aria-label="Play Signal Flow, new Night Play exclusive"><div class="signal-discovery-inner"><div><span class="discovery-badge">✦ NEW GAME UNLOCKED</span><p class="discovery-exclusive">ONLY IN NIGHT PLAY</p><h2>Signal Flow<span>↗</span></h2><p class="discovery-copy">A new game comes to light.<br>Rotate prisms. Bring every signal home.</p><span class="discovery-cta">Enter the circuit →</span></div><svg class="signal-art" viewBox="0 0 160 130" aria-hidden="true"><g fill="#142132" stroke="#536176"><rect x="8" y="8" width="144" height="114" rx="17"/><path d="M56 8v114M104 8v114M8 46h144M8 84h144"/></g><g fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path stroke="#42e8ff" d="M8 27h72v38h72"/><path stroke="#ff5bd6" d="M32 122V65h96V8"/><path stroke="#ffd563" d="M8 103h72V27h72"/></g><g fill="#ffd563"><circle cx="8" cy="103" r="6"/><circle cx="152" cy="27" r="6"/></g></svg></div></a></section>`);}
    }else discovery?.remove();
    const count=document.getElementById('game-count');if(count)count.textContent=nightPrefs.global?'8 games · A new game unlocked':'7 games · No account needed';
  }
  function syncBinarioName(){
    const name=nightOn('binario')?'Neon Logic':'Binario';
    main.querySelectorAll('a[href="#games/binario"]').forEach(link=>{
      if(link.classList.contains('game-card')){link.classList.toggle('neon-logic-card',nightOn('binario'));link.querySelector('h3').textContent=name;link.setAttribute('aria-label','Play '+name);}
      if(link.classList.contains('next-card'))link.querySelector('span').textContent=name;
      if(link.classList.contains('pill-link'))link.closest('.resume')?.querySelector('strong')?.replaceChildren(document.createTextNode(name));
    });
  }
  function applyNight(){const on=nightOn(),[accent,tile]=nightPalettes[current]||['#cba1fa','#332442'];document.documentElement.classList.toggle('night-play',on);document.documentElement.style.setProperty('--night-accent',accent);document.documentElement.style.setProperty('--night-tile',tile);const toggle=document.getElementById('night-toggle');if(toggle){toggle.setAttribute('aria-checked',String(on));toggle.textContent=`☾ Night Play${current?'':' · All games'}: ${on?'On':'Off'}`;}syncNightDiscovery();syncBinarioName();if(current==='binario')neonPage(on);frame?.contentWindow?.postMessage({type:'room:night',enabled:on},location.origin);}
  function nightControl(){main.insertAdjacentHTML('afterbegin',`<div class="night-controls"><button id="night-toggle" class="night-toggle" role="switch" aria-checked="false"></button></div>`);document.getElementById('night-toggle').onclick=()=>{const on=!nightOn();if(current)nightPrefs.overrides[current]=on;else nightPrefs={global:on,overrides:{}};saveNight();if(current==='signal')route();else applyNight();};applyNight();}
  function remember(id){try{localStorage.setItem('room-for-play:last',JSON.stringify({id,visited:Date.now()}));}catch{}}
  function art(g){return g.art.length===1?`<span class="art-symbol" aria-hidden="true">${g.art[0]}</span>`:g.art.map(x=>`<span class="art-letter" aria-hidden="true">${x==='<'?'&lt;':x}</span>`).join('');}
  function theme(g){return `--game-tile:${g.tile};--game-ink:${g.ink}`;}
  function card(g){return `<a class="game-card" href="#games/${g.id}" style="${theme(g)}" aria-label="Play ${g.name}"><div class="card-art">${art(g)}</div><div class="card-body"><div class="card-category">${g.category}</div><h3>${g.name}</h3><p>${g.line}</p><div class="card-bottom"><span>${g.sample?'Playable sample':g.id==='deli'?'60-second rounds':'A fresh puzzle daily'}</span><span class="play-label">${g.sample?'Try it':'Play now'} ↗</span></div></div></a>`;}
  function home(){
    current=null;frame=null;document.getElementById('mobile-ad-anchor').hidden=true;document.body.className='';document.documentElement.removeAttribute('style');
    const last=games.find(g=>g.id===read('room-for-play:last')?.id&&(!g.nightOnly||nightPrefs.global));
    document.title='Pocket Playroom · Big fun. Pocket edition.';
    main.innerHTML=`<section class="home-hero"><div><div class="eyebrow">Independent games. A little everyday delight.</div><h1>Big fun.<br><em>Pocket edition.</em></h1><p class="hero-copy">A clever turn. A good word. One more sandwich.<br>Find your kind of fun and settle in.</p></div><div class="hero-toy" aria-hidden="true"><span>P</span><span>✳</span><span>0</span><span>1</span></div></section>${last?`<section class="resume" aria-label="Recently played"><p>Last time you were here<strong>${last.name}</strong></p><a class="pill-link" href="#games/${last.id}">Play again →</a></section>`:''}<div class="collection-top"><h2>Pick your little obsession.</h2><span id="game-count">7 games · No account needed</span></div><section class="game-grid" aria-label="Choose a game">${games.filter(g=>!g.nightOnly).map(card).join('')}</section><section class="home-note"><span class="asterisk" aria-hidden="true">✳</span><div><h2>There’s always room.</h2><p>For a fresh thought, a small victory, or a really good stack of cheese.</p></div></section>`;
  }
  function gamePage(g){
    document.getElementById('mobile-ad-anchor').hidden=g.id!=='binario';current=g.id;remember(g.id);document.body.className=`game-${g.id}`;
    for(const [key,value]of Object.entries({paper:g.paper,accent:g.accent,tile:g.tile,edge:g.ink}))document.documentElement.style.setProperty('--'+key,value);
    document.title=`${g.name} · Pocket Playroom`;
    main.innerHTML=`<a class="back-link" href="#home">← Back to all games</a><header class="game-heading"><div class="eyebrow">${g.subtitle}</div><h1>${g.name}</h1><p>${g.line}</p></header><section class="game-layout" aria-label="${g.name}"><aside class="game-side left"><div class="side-symbol" aria-hidden="true">${g.symbol==='<'?'&lt;':g.symbol}</div><h2>A little room to think.</h2><p>${g.help}</p></aside><div class="game-well">${g.sample?'<div class="sample-label">Playable sample · Daily puzzle edition in development</div>':''}<div class="frame-status" id="frame-status" role="status">Setting up your game…</div><iframe class="game-frame" id="game-frame" title="Play ${g.name}" src="games/${g.id}/index.html" allow="web-share" loading="eager"></iframe></div><aside class="game-side right"><div class="note"><div class="eyebrow">A small reminder</div><h2>${g.id==='deli'?'House rules':'Make yourself at home.'}</h2><p>${g.note}</p></div></aside></section><details class="help"><summary>How to play ${g.name}</summary><p>${g.help}</p><p>${g.sample?'This is a saved practice board. It is not a generated daily puzzle.':'Progress stays in this browser when local storage is available.'}</p></details>${g.id==='binario'?'':'<div class="ad-space" aria-label="Reserved advertisement space">ADVERTISEMENT · 320 × 50</div>'}<section class="next-games"><h2>Room for another?</h2><div class="next-row">${games.filter(other=>other!==g&&(!other.nightOnly||nightPrefs.global)).slice(0,3).map(other=>`<a href="#games/${other.id}" class="next-card" style="${theme(other)}"><span>${other.name}</span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>`;
    frame=document.getElementById('game-frame');
    if(g.id==='binario')neonPage(read('room-for-play:neon:mode')===true);
    const target=frame;
    frame.addEventListener('load',()=>{if(target!==frame)return;document.getElementById('frame-status').hidden=true;applyNight();});
  }
  function neonPage(enabled){
    if(current!=='binario')return;
    document.body.classList.toggle('neon-page',enabled);
    const heading=document.querySelector('.game-heading');
    heading.querySelector('h1').textContent=enabled?'Neon Logic':'Binario';
    heading.querySelector('.eyebrow').textContent=enabled?'The daily circuit':'The balancing act';
    heading.querySelector('p').textContent=enabled?'Balance the energy. Complete the circuit.':'Two sides. One bright idea.';
    const help=enabled?'Balance three Cyan and three Magenta tiles in every row and column. No three matching colors may touch horizontally or vertically. Every row must be unique, and every column must be unique. Tap to cycle Unlit → Cyan → Magenta → Unlit.':games.find(g=>g.id==='binario').help;
    document.querySelector('.game-side.left p').textContent=help;
    document.querySelector('.side-symbol').textContent=enabled?'● / ■':'0 1';
    document.querySelector('.game-side.left h2').textContent=enabled?'Calibrate your circuit.':'A little room to think.';
    document.querySelector('.help summary').textContent=enabled?'How to play Neon Logic':'How to play Binario';
    document.querySelector('.help p').textContent=help;
    document.title=(enabled?'Neon Logic':'Binario')+' · Pocket Playroom';
  }
  function route(){const match=location.hash.match(/^#games\/([a-z]+)$/);const g=match&&games.find(g=>g.id===match[1]);if(g?.nightOnly&&!nightOn(g.id)){current=g.id;frame=null;document.body.className='';document.getElementById('mobile-ad-anchor').hidden=true;main.innerHTML='<a class="back-link" href="#home">← Back to all games</a><header class="game-heading"><h1>Signal Flow</h1><p>This circuit comes alive in Night Play. Turn it on above to enter.</p></header>';document.title='Signal Flow · Night Play';}else if(g)gamePage(g);else home();nightControl();window.scrollTo(0,0);main.focus({preventScroll:true});}
  window.addEventListener('message',event=>{if(!frame||event.source!==frame.contentWindow)return;const data=event.data;if(event.origin!==location.origin)return;if(data?.type==='room:ad-modal'&&current==='binario')document.getElementById('mobile-ad-anchor').hidden=data.open===true;if(data?.type==='room:neon'){const enabled=data.enabled===true;if(nightOn('binario')!==enabled){nightPrefs.overrides.binario=enabled;saveNight();applyNight();}else neonPage(enabled);}if(data?.type==='room:height'&&Number.isFinite(data.height)){frame.style.height=Math.max(300,Math.min(6000,data.height))+'px';const status=document.getElementById('frame-status');if(status)status.hidden=true;}});
  function openInfo(title,templateId){document.getElementById('info-title').textContent=title;document.getElementById('info-body').replaceChildren(document.getElementById(templateId).content.cloneNode(true));info.showModal();info.scrollTop=0;}
  document.getElementById('about-button').addEventListener('click',()=>openInfo('About Pocket Playroom','about-content'));
  document.getElementById('privacy-button').addEventListener('click',()=>openInfo('Privacy','privacy-content'));
  document.getElementById('close-info').addEventListener('click',()=>info.close());
  window.addEventListener('hashchange',route);route();
})();
