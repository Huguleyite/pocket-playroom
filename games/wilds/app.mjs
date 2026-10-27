import {practiceLevel,practiceSteps} from './guided.mjs';
import {painted,illustratedPlant,illustratedBridge,basinLayers} from './illustrated.mjs';
import {kitSprite} from './pond-prototype/plant-kit.mjs';
import {levels} from './levels.mjs';
import {derive,place,decorate,remaining,describe,advice,tools,decorations,neighbors,waterItem} from './rules.mjs';
import {load,save,empty,defaultStyle} from './state.mjs';
import {artwork,landmark} from './artwork.mjs';
const $=id=>document.getElementById(id);
$('art-defs').innerHTML=artwork;
let storage;try{storage=localStorage;}catch{}
const loaded=load(storage);let state=loaded.state,tool='channel',selected=-1,overlay='',tutorialHints=false,past=[],future=[],environment,isPlaying=false,savingAvailable=loaded.available,practiceActive=false,practiceStep=0,heldGarden=null;
const names={channel:'Channel',reeds:'Reeds',tree:'Tree',flowers:'Flowers',fern:'Ferns',bridge:'Bridge',inspect:'Inspect',remove:'Remove',bench:'Bench',pot:'Flowerpot',birdbath:'Birdbath',lantern:'Lantern',stones:'Stepping stones'};
const art=(type,cls='')=>painted(type,cls)||(['tree','cypress','fern','bridge'].includes(type)?kitSprite({tree:'tree',cypress:'slenderTree',fern:'fern',bridge:'bridgeAcross'}[type],cls):'')||`<svg class="art ${cls}" viewBox="0 0 100 100" aria-hidden="true"><use href="#art-${type}"></use></svg>`;
const level=()=>practiceActive?practiceLevel:levels[state.current],items=()=>state.gardens[state.current],decs=()=>state.decorations[state.current],style=()=>state.styles[state.current];
const snapshot=()=>({items:[...items()],decorations:[...decs()],style:{...style()}});
function restore(s){state.gardens[state.current]=s.items;state.decorations[state.current]=s.decorations;state.styles[state.current]=s.style;}
function remember(){past.push(snapshot());future=[];}
function persist(){if(practiceActive){$('saved').textContent='Practice garden';return;}savingAvailable=save(storage,state);$('saved').textContent=savingAvailable?'Saved here':'Saving unavailable';$('saved').setAttribute('role','status');$('saved').title=savingAvailable?'Your gardens and progress are saved in this browser.':'Your changes work for this visit, but this browser cannot save them.';}
function showDialog(title,html){$('dialog-title').textContent=title;$('dialog-body').innerHTML=html;$('dialog').showModal();}
function condition(i){const d=decs()[i];return d?`${names[d]}: a personal touch. Decorations leave water, shade and walking conditions unchanged. Remove returns it to the tray.`:describe(level(),items(),environment,i);}
function inspect(){if(selected<0)return;$('cell-name').textContent=`ROW ${Math.floor(selected/level().n)+1} · SPACE ${selected%level().n+1}`;$('condition').textContent=condition(selected);}
function waterway(i){
 const l=level(),s=environment,adj=neighbors(i,l.n).filter(j=>waterItem(items()[j])||['P','I'].includes(l.map[j])),stones=[];
 const lines=adj.map(j=>{const dx=j===i-1?-1:j===i+1?1:0,dy=j===i-l.n?-1:j===i+l.n?1:0;for(let k=0;k<=4;k++)for(const side of [-1,1]){const x=50+dx*k*12+dy*side*18,y=50+dy*k*12+dx*side*18,r=3.3+((i+k)%3)*.45;stones.push(`<ellipse cx="${x}" cy="${y}" rx="${r*1.4}" ry="${r}" transform="rotate(${i*19+k*29} ${x} ${y})" fill="url(#stone-${i})" stroke="#766b48" stroke-width=".6"/>`);}return `<path d="M50 50L${50+dx*50} ${50+dy*50}"/>`;}).join('');
 return `<svg class="waterway" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="stone-${i}" x2=".7" y2="1"><stop stop-color="#d9c796"/><stop offset="1" stop-color="#8e835b"/></linearGradient><pattern id="flow-${i}" width="90" height="90" patternUnits="userSpaceOnUse"><image href="pond-prototype/assets/pond-states-v2.webp" x="-220" y="-10" width="330" height="110"/></pattern></defs><g stroke-linecap="round" fill="none"><g stroke="#544b32" stroke-width="41" opacity=".65">${lines}<path d="M48 50h4"/></g><g stroke="#b0a071" stroke-width="35">${lines}<path d="M48 50h4"/></g><g stroke="${s.wet.has(i)?'#66a8af':'#786744'}" stroke-width="25">${lines}<path d="M48 50h4"/></g>${s.wet.has(i)?`<g stroke="url(#flow-${i})" stroke-width="23">${lines}</g>`:''}<g class="ripple" stroke="${s.wet.has(i)?'#d2e6ce':'#a49265'}" stroke-width="1" opacity=".6">${lines}</g></g><g class="rubble">${stones.join('')}</g></svg>`;
}

function cellArt(i){
 const l=level(),s=environment,v=l.map[i],p=items()[i],d=decs()[i];
 if(v==='I')return '<span class="spring-stone" aria-hidden="true"></span>';
 if(v==='#')return art(l.theme==='glasshouse'||(i<l.n&&i%3===0)?'window':'wall','fixed-art');
 if(v==='A')return art('gate');if(v==='B')return painted('bench');
 if(d)return (v==='='?'<span class="pavers" aria-hidden="true"></span>':'')+art(d,'decoration');
 if(v==='=')return '<span class="pavers" aria-hidden="true"></span>';
 if(v==='P')return `<span class="pond-bottom" aria-hidden="true"></span><svg class="pond-ripples" viewBox="0 0 100 100" aria-hidden="true"><path d="M17 33q14-7 27 0m15 20q14-7 27 0M26 76q14-7 27 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
 if(waterItem(p))return waterway(i)+(p==='bridge'?illustratedBridge(i,l,items()):'');
 if(p||v==='T'){
  const type=p||'tree',set={tree:s.trees,reeds:s.reeds,flowers:s.flowers,fern:s.ferns}[type],healthy=set.has(i);
  const shape=type==='tree'&&style().tree==='cypress'?'cypress':type==='flowers'&&!healthy?'buds':type;
  return illustratedPlant(type,i,s,style())+(healthy?'':'<span class="sleep" aria-hidden="true">◇</span>');
 }
 return `<span class="soil-detail soil-${i%5}" aria-hidden="true"></span>`;
}
function tutorial(){return level().guidance;}

function render(){
 const focusCell=document.activeElement?.closest('[data-cell]')?.dataset.cell,l=level();environment=derive(l,items());const s=environment;
 if(!practiceActive&&s.complete&&!state.completed.includes(state.current)){state.completed.push(state.current);persist();if(isPlaying){const restored=state.current;queueMicrotask(()=>celebrate(restored));}}
 $('chapter').textContent=`${l.subtitle} · ${l.chapter}`;$('title').textContent=l.name;$('story').textContent=l.story;
 $('place-count').textContent=`${state.current+1} / ${levels.length}`;$('earned').hidden=practiceActive||!state.completed.includes(state.current);$('goal-count').textContent=`${s.goals.filter(g=>g.met).length} / ${s.goals.length}`;
 document.querySelector('.game').dataset.theme=l.theme;document.querySelector('.game').dataset.goalCount=s.goals.length;
 $('scene').replaceChildren();
 $('goals').innerHTML=s.goals.map(g=>`<div class="goal ${g.met?'met':''}"><span class="check" aria-hidden="true">${g.met?'✓':'○'}</span><span class="goal-label"><span class="goal-full">${g.label}</span><span class="goal-short">${g.short||g.label}</span></span><strong>${Math.min(g.value,g.target)}/${g.target}</strong></div>`).join('');
 const visits=[];if(s.wildlife.butterflies)visits.push('Butterflies');if(s.wildlife.frogs)visits.push('Frogs');if(s.wildlife.birds)visits.push('Birds');$('wildlife').textContent=visits.join(' · ')||'A little room for life';
 $('board').style.setProperty('--n',l.n);$('board').className=`${overlay?'overlay-'+overlay:''} palette-${style().flowers}`;
 $('board').innerHTML=l.map.map((v,i)=>{
  const p=items()[i],pond=s.ponds.find(p=>p.cells.includes(i)),classes=['cell',v==='.'?'soil':v==='P'?'pond':v==='I'?'inlet':v==='#'?'wall':v==='T'?'existing-tree':'path',s.wet.has(i)?'wet':'',s.moist.has(i)?'moist':'',s.shade.has(i)?'shaded':'',s.walk.has(i)?'walkable':'',s.route.includes(i)?'route':'',pond?.clean?'clean':'',selected===i?'selected':'',p||'',`variation-${i%4}`];
  const label=`Row ${Math.floor(i/l.n)+1}, space ${i%l.n+1}. ${p?names[p]+'. ':''}${condition(i)}`;
  let badge='';if(v==='I')badge='<span class="feature-label">SPRING</span>';if(v==='A')badge='<span class="feature-label">GATE</span>';if(v==='B')badge='<span class="feature-label">SEAT</span>';
  const visitor=(type,yes)=>yes?`<span class="critter ${type}" aria-hidden="true">${art(type)}</span>`:'';
  const mark=overlay==='water'?(s.wet.has(i)?'≈':s.moist.has(i)?'•':''):overlay==='shade'&&s.shade.has(i)?'◐':overlay==='walk'?(s.route.includes(i)?'→':s.walk.has(i)?'·':''):'';
  return `<button class="${classes.join(' ')}" data-cell="${i}" tabindex="${i===(selected>=0?selected:0)?0:-1}" aria-label="${label}" aria-pressed="${i===selected}">${cellArt(i)}${v==='.'&&!p&&s.moist.has(i)?'<span class="moist-mark" aria-hidden="true">● Moist</span>':''}<span class="overlay-dot" aria-hidden="true">${mark}</span>${badge}${visitor('butterfly',s.wildlife.butterflies&&i===[...s.flowers][0])}${visitor('frog',pond?.clean&&i===pond.cells[0])}${visitor('bird',s.wildlife.birds&&i===[...s.trees][0])}</button>`;
 }).join('')+basinLayers(l,items(),s);
 const supplied=tools.filter(t=>l.inventory[t]>0);$('tools').style.setProperty('--tool-count',supplied.length);
 $('tools').innerHTML=supplied.map(t=>`<button data-tool="${t}" class="tool ${tool===t?'active':''}" aria-pressed="${tool===t}" title="${names[t]} (${tools.indexOf(t)+1})"><span class="tool-icon" aria-hidden="true">${t==='channel'?'<span class="channel-icon">≈</span>':art(t)}</span><span>${names[t]}<small>${remaining(l,items(),t)} / ${l.inventory[t]} left</small></span></button>`).join('');
 $('tool-instruction').textContent=decorations.includes(tool)?`Place ${names[tool].toLowerCase()} · ${l.decorations[tool]-decs().filter(d=>d===tool).length} left`:tool==='inspect'?'Inspect · nothing changes':tool==='remove'?'Remove · full refund':'Choose a tool, then a space';
 $('inspect-tool').setAttribute('aria-pressed',tool==='inspect');$('remove-tool').setAttribute('aria-pressed',tool==='remove');$('decorate').setAttribute('aria-pressed',decorations.includes(tool));
 $('tutorial').textContent=tutorial();$('tutorial').hidden=!tutorialHints;$('next').hidden=practiceActive||!state.completed.includes(state.current)||state.current===levels.length-1;
 $('undo').disabled=!past.length;$('redo').disabled=practiceActive||!future.length;$('undo').disabled=practiceActive||!past.length;$('decorate').disabled=practiceActive;
 for(const kind of ['water','shade','walk'])$(kind).setAttribute('aria-pressed',overlay===kind);
 $('walk').hidden=!l.map.includes('A');inspect();
 if(practiceActive)renderPracticeGuide();
 if(focusCell!==undefined)$('board').querySelector(`[data-cell="${focusCell}"]`)?.focus({preventScroll:true});
}
function choose(t){tool=t;render();$('cell-name').textContent=`${names[t].toUpperCase()} SELECTED`;if(decorations.includes(t))$('condition').textContent=`Choose empty soil or a fixed path for this ${names[t].toLowerCase()}. Decorations are fully refundable and do not change the restoration rules.`;}
function act(i){
 if(practiceActive&&tool!=='inspect'){const step=practiceSteps[practiceStep];if(!step||i!==step.cell||tool!==step.tool){$('condition').textContent='For this lesson, '+(step?.text||'return to your garden.');return;}}
 selected=i;
 if(tool==='inspect'){render();return;}
 if(tool==='remove'&&decs()[i]){remember();decs()[i]=null;persist();render();return;}
 if(decorations.includes(tool)){
  const result=decorate(level(),items(),decs(),i,tool);if(result.error){render();$('condition').textContent=result.error;return;}
  if(result.decs.some((v,j)=>v!==decs()[j])){remember();state.decorations[state.current]=result.decs;persist();}render();return;
 }
 const result=place(level(),items(),i,tool);
 if(result.error){render();$('condition').textContent=level().map[i]!=='.'?condition(i):result.error;return;}
 if(result.items.some((v,j)=>v!==items()[j])){remember();state.gardens[state.current]=result.items;if(tool!=='remove')decs()[i]=null;persist();}
 render();if(practiceActive&&gardenStepDone())advancePractice();
}
$('board').addEventListener('click',e=>{const b=e.target.closest('[data-cell]');if(b){act(+b.dataset.cell);$('board').querySelector(`[data-cell="${selected}"]`).focus({preventScroll:true});}});
$('tools').addEventListener('click',e=>{const b=e.target.closest('[data-tool]');if(b){choose(b.dataset.tool);$('tools').querySelector(`[data-tool="${tool}"]`)?.focus({preventScroll:true});}});
$('inspect-tool').onclick=()=>choose('inspect');$('remove-tool').onclick=()=>choose('remove');
$('undo').onclick=()=>{if(!past.length)return;future.push(snapshot());restore(past.pop());persist();render();};
$('redo').onclick=()=>{if(!future.length)return;past.push(snapshot());restore(future.pop());persist();render();};
function restart(){remember();state.gardens[state.current]=empty(level());state.decorations[state.current]=empty(level());selected=-1;persist();render();$('cell-name').textContent='FRESH SOIL';$('condition').textContent='A fresh start. Your earned restoration stays with you. Undo is available.';}
$('restart').onclick=()=>{if(practiceActive){practiceStep=0;state.gardens[0]=empty(practiceLevel);state.decorations[0]=empty(practiceLevel);selected=-1;render();return;}showDialog('Begin again?',`<p>Clear this garden and return every plant, bridge and decoration to the tray. Your earned restoration stays. You can undo the restart.</p><button id="confirm-restart" class="primary">Restart this garden</button>`);$('confirm-restart').onclick=()=>{$('dialog').close();restart();};};
for(const kind of ['water','shade','walk'])$(kind).onclick=()=>{overlay=overlay===kind?'':kind;render();};
$('hint').onclick=()=>{$('cell-name').textContent='A GENTLE NUDGE';$('condition').textContent=advice(level(),environment);};
function visit(k){state.current=k;selected=-1;tool='channel';overlay='';past=[];future=[];persist();render();$('cell-name').textContent='A SMALL START';$('condition').textContent=level().lesson+' · Choose a tool, then a space.';}
$('next').onclick=()=>visit(state.current+1);
function gardenThumbnail(l,k){
 const a=state.gardens[k],s=derive(l,a);
 return `<span class="place-thumbnail palette-${state.styles[k].flowers}" style="--mini-n:${l.n}" aria-hidden="true">${l.map.map((v,i)=>{const type=a[i]||(v==='T'?'tree':null),piece=['tree','fern','flowers','reeds'].includes(type)?illustratedPlant(type,i,s,state.styles[k]):type==='bridge'?kitSprite('bridgeAcross'):state.decorations[k][i]?painted(state.decorations[k][i]):'';return `<span class="mini-cell mini-${v==='#'?'wall':v==='P'?'pond':v==='I'?'spring':v==='='||v==='A'||v==='B'?'path':'soil'} ${s.wet.has(i)?'mini-wet':''} ${type==='channel'?'mini-channel':''}">${piece}</span>`;}).join('')}</span>`;
}
function openPlaces(){
 if(practiceActive)endPractice();
 const total=state.completed.length,current=level();let last='';
 const cards=levels.map((l,k)=>{const open=k===0||state.completed.includes(k-1),restored=state.completed.includes(k),live=derive(l,state.gardens[k]),met=live.goals.filter(g=>g.met).length;let heading='';if(l.chapter!==last){last=l.chapter;heading=`<h3 class="journey-chapter">${last}</h3>`;}
 return `${heading}<button class="journey-card ${restored?'is-restored':''}" data-visit="${k}" ${open?'':'disabled'} ${k===state.current?'aria-current="true"':''}>${gardenThumbnail(l,k)}<span class="place-copy"><span class="place-number">${String(k+1).padStart(2,'0')} · ${restored?'✧ Restored':k===state.current?'Tending now':open?'Ready to begin':'Locked'}</span><strong>${l.name}</strong><span class="place-focus">${l.focus}</span><small>${!open?'Restore '+levels[k-1].name+' to open':restored?'Yours to keep arranging · '+met+'/'+l.goals.length+' live goals':state.gardens[k].some(Boolean)?met+'/'+l.goals.length+' goals · saved arrangement':'A fresh place to begin'}</small></span></button>`;}).join('');
 showDialog('Your little wilds',`<div class="journey-intro"><p>Small places. A little more alive.</p><strong>${total} of ${levels.length} restored</strong><progress max="${levels.length}" value="${total}" aria-label="Gardens restored">${total}/${levels.length}</progress><p class="journey-save">${savingAvailable?'Your arrangements save automatically in this browser.':'Saving is unavailable. Your arrangements will last for this visit.'}</p><button class="primary" id="resume-garden">Continue tending · ${current.name} →</button></div><div class="location-list journey-list">${cards}</div>`);
 $('resume-garden').onclick=()=>{$('dialog').close();$('locations').focus();};
 $('dialog-body').querySelectorAll('[data-visit]').forEach(b=>b.onclick=()=>{const k=+b.dataset.visit;if(k>0&&!state.completed.includes(k-1))return;$('dialog').close();visit(k);$('locations').focus();});
}
function celebrate(k){
 if(k!==state.current)return;const l=levels[k],next=k+1,all=state.completed.length===levels.length;
 showDialog(all?'Ten places, full of life.':'A little life returns.',`<div class="restoration-moment"><span class="restoration-sprig" aria-hidden="true">❧</span><p class="eyebrow">${all?'YOUR LITTLE WILDS':'RESTORED · '+String(k+1).padStart(2,'0')}</p><h3>${l.name}</h3>${gardenThumbnail(l,k)}<p>${all?'Every garden has found its feet. They are all yours to return to, rearrange and keep growing.':l.story}</p><p class="restoration-save">${savingAvailable?'Your garden and restoration are saved here.':'Restored for this visit. Saving is unavailable in this browser.'}</p>${next<levels.length?`<p class="new-place">New place open · <strong>${levels[next].name}</strong></p><button class="primary" id="visit-next">Visit the next garden →</button>`:''}<button id="continue-tending">Keep tending this garden</button><button id="restoration-places">See all ${levels.length} places</button></div>`);
 document.querySelector('.game').classList.remove('just-restored');requestAnimationFrame(()=>document.querySelector('.game').classList.add('just-restored'));
 $('continue-tending').onclick=()=>{$('dialog').close();$('locations').focus();};
 if($('visit-next'))$('visit-next').onclick=()=>{$('dialog').close();visit(next);$('locations').focus();};
 $('restoration-places').onclick=()=>{$('dialog').close();openPlaces();};
}
$('locations').onclick=openPlaces;
document.querySelector('.wordmark').onclick=e=>{e.preventDefault();openPlaces();};

function decorationDialog(){
 showDialog('Make it your own',`<p class="dec-intro">Pick a decoration, then tap empty soil or a path. Each is fully reusable. They do not change water, shade, wildlife or walking access.</p><div class="decor-tray">${decorations.map(d=>`<button data-decor="${d}">${art(d)}<strong>${names[d]}</strong><small>${level().decorations[d]-decs().filter(v=>v===d).length} / ${level().decorations[d]} left</small></button>`).join('')}</div><h3>Flower palette</h3><div class="style-options">${[['meadow','Meadow mix'],['rose','Rose & lilac'],['gold','Golden hour']].map(([v,n])=>`<button data-palette="${v}" class="swatch ${v}" aria-pressed="${style().flowers===v}">${n}</button>`).join('')}</div><h3>Tree silhouette</h3><div class="style-options">${[['oak','Broad oak'],['cypress','Cypress']].map(([v,n])=>`<button data-shape="${v}" aria-pressed="${style().tree===v}">${n}</button>`).join('')}</div><p class="small-note">Style changes apply to this garden and can be undone. Plant conditions stay the same.</p>`);
 $('dialog-body').querySelectorAll('[data-decor]').forEach(b=>b.onclick=()=>{choose(b.dataset.decor);$('dialog').close();});
 for(const [attr,key] of [['palette','flowers'],['shape','tree']])$('dialog-body').querySelectorAll(`[data-${attr}]`).forEach(b=>b.onclick=()=>{if(style()[key]===b.dataset[attr])return;remember();style()[key]=b.dataset[attr];persist();render();$('dialog').close();decorationDialog();});
}
$('decorate').onclick=decorationDialog;
$('help').onclick=()=>{showDialog('A little field guide',`<p>Choose a tool, then a space. Replacements refund the old item. Remove refunds plants, channels, bridges and decorations. Fixed features stay.</p><h3>Water, light & shade</h3><p>Only edges count. Channels, bridges and pond cells carry water from a spring. Soil beside flowing water is moist. Two thriving reed beds clean each separate filled pond. Trees thrive beside water and shade four neighbors. Flowers bloom in moist sunlight. Ferns unfurl in moist shade. Dormant plants stay until their conditions improve.</p><h3>Little crossings</h3><p>A footbridge is a waterway with a walking deck. It may replace a channel, refunding that channel. Dry bridges are walkable; flowing bridges also moisten the banks. Gates and seats appear in the second chapter. Bare soil, fixed paths and bridges are walkable; plants, ponds, walls and channels block walkers. The Walk overlay shows spaces reachable from the gate, and the route to the seat when one is open. Decorations do not obstruct the walk.</p><h3>Your own place</h3><p>Decorate opens the reusable decoration tray and flower/tree styles. Decorations sit on empty soil or fixed paths. Planting over a decoration returns it to the tray. All listed live goals must hold together to earn restoration. Earned awards persist after later edits. Three blooms bring butterflies, a clean pond brings frogs, and two healthy trees bring birds. These are stylized game rules.</p><h3>Keyboard & saving</h3><p>Tab to the board; arrows explore; Enter/Space acts. 1 Channel · 2 Reeds · 3 Tree · 4 Flowers · 5 Ferns · 6 Bridge · 0 Inspect · X Remove · D Decorations. Ctrl/Cmd Z undoes; Shift Z redoes. Garden layouts, decorations, styles, location and awards save in this browser when storage works. Existing first-edition gardens are preserved. History lasts for this visit.</p><h3>Learn by doing</h3><p>Try a guided practice garden. It leaves all your saved gardens untouched.</p><button id="start-guided">Start guided tutorial</button><button id="show-instructions">Read the starting instructions</button><h3>Garden tips</h3><p>Moist ground stays visible during ordinary play. Turn tutorial text on for guidance.</p><button id="tutorial-toggle" aria-pressed="${tutorialHints}">Garden tips · ${tutorialHints?'on':'off'}</button>`);$('start-guided').onclick=startPractice;$('show-instructions').onclick=()=>{$('dialog').close();showInstructions();};$('tutorial-toggle').onclick=()=>{tutorialHints=!tutorialHints;render();$('tutorial-toggle').setAttribute('aria-pressed',tutorialHints);$('tutorial-toggle').textContent='Garden tips · '+(tutorialHints?'on':'off');};};
function showInstructions(){
 showDialog('A little care goes a long way.',`<div class="starting-guide"><p class="small-note"><strong>In development · Playtest version.</strong> Features and balance are still being tested. Rules and saved progress may change.</p><p>Restore small forgotten gardens by bringing water, plants and wildlife back together.</p><ol><li><strong>Choose a tool, then a space.</strong> Channels carry water from the spring along shared edges.</li><li><strong>Read the ground.</strong> Flowers need moist sunlight. Trees create shade; ferns need moist shade. Two reed beds clean a filled pond.</li><li><strong>Leave a way across.</strong> Bridges carry water below a walkable deck.</li><li><strong>Meet every listed goal.</strong> Each restoration opens the next place. Remove refunds pieces; Undo lets you experiment.</li></ol><p>${savingAvailable?'Your gardens save automatically in this browser. Places lets you resume or revisit them.':'Saving is unavailable in this browser; your gardens will last for this visit.'}</p><button class="primary" id="begin-garden">${state.gardens[state.current].some(Boolean)?'Continue my garden':'Start tending'}</button><button id="intro-tutorial">Try the guided tutorial</button><p class="small-note">Instructions and the tutorial are always available under ? Help.</p></div>`);
 $('begin-garden').onclick=()=>{$('dialog').close();$('locations').focus();};$('intro-tutorial').onclick=startPractice;
}
function startPractice(){
 if($('dialog').open)$('dialog').close();
 if(!practiceActive)heldGarden={state,tool,selected,overlay,past,future,tutorialHints};
 practiceActive=true;practiceStep=0;state=structuredClone(heldGarden.state);state.current=0;state.gardens[0]=empty(practiceLevel);state.decorations[0]=empty(practiceLevel);selected=-1;tool='channel';overlay='';past=[];future=[];render();persist();
}
function endPractice(){
 if(!practiceActive)return;if($('dialog').open)$('dialog').close();
 ({state,tool,selected,overlay,past,future,tutorialHints}=heldGarden);heldGarden=null;practiceActive=false;render();persist();$('practice-exit').hidden=true;
}
function renderPracticeGuide(){
 const step=practiceSteps[practiceStep];if(!step)return;
 $('place-count').textContent='Tutorial';
 $('cell-name').textContent=`LESSON ${practiceStep+1} / ${practiceSteps.length} · ${step.title}`;
 $('condition').textContent=`${practiceStep+1}/${practiceSteps.length} · ${step.text}`;
 $('board').querySelector(`[data-cell="${step.cell}"]`)?.classList.add('practice-target');
 $('tools').querySelector(`[data-tool="${step.tool}"]`)?.classList.add('practice-tool');
 $('practice-exit').hidden=false;
}
function gardenStepDone(){const step=practiceSteps[practiceStep];return step&&items()[step.cell]===step.tool;}
function advancePractice(){
 practiceStep++;if(practiceStep<practiceSteps.length){render();return;}
 showDialog('Ready to make it your own.',`<div class="starting-guide"><p>You have guided water, grown sunny flowers, made shade for ferns, cleaned a pond and carried a walk over water.</p><p>In the real gardens you choose the arrangement. There is more than one way to restore each place.</p><p>Your saved garden is exactly as you left it.</p><button class="primary" id="finish-practice">Return to my garden →</button><button id="repeat-practice">Try the tutorial again</button></div>`);
 $('finish-practice').onclick=endPractice;$('repeat-practice').onclick=startPractice;
}
$('practice-exit').onclick=endPractice;
$('close-dialog').onclick=()=>$('dialog').close();$('dialog').addEventListener('click',e=>{if(e.target===$('dialog'))$('dialog').close();});
document.addEventListener('keydown',e=>{
 if($('dialog').open||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();$(e.shiftKey?'redo':'undo').click();return;}
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 if('123456'.includes(e.key)&&e.key.length===1){const t=tools[+e.key-1];if(level().inventory[t])choose(t);return;}
 if(e.key==='0'||e.key.toLowerCase()==='x'){choose(e.key==='0'?'inspect':'remove');return;}
 if(e.key.toLowerCase()==='d'){$('decorate').click();return;}
 if(!e.target.closest('#board'))return;
 const n=level().n,i=Number(e.target.closest('[data-cell]')?.dataset.cell??0);let j=i;
 if(e.key==='ArrowRight')j=i%n<n-1?i+1:i;if(e.key==='ArrowLeft')j=i%n>0?i-1:i;if(e.key==='ArrowUp')j=Math.max(0,i-n);if(e.key==='ArrowDown')j=Math.min(n*n-1,i+n);
 if(e.key.startsWith('Arrow')){e.preventDefault();selected=j;render();$('board').querySelector(`[data-cell="${j}"]`).focus({preventScroll:true});}
});
window.addEventListener('message',e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='room:night')document.documentElement.classList.toggle('night',!!e.data.enabled);});
const compact=matchMedia('(max-width:599px)');function positionHint(){if(compact.matches)document.querySelector('.utility').append($('hint'));else document.querySelector('.fieldactions').insertBefore($('hint'),$('next'));}compact.addEventListener('change',positionHint);
render();persist();isPlaying=true;positionHint();$('condition').textContent=level().lesson+' · Choose a tool, then a space.';
// Fit to the actual panel, including the collection header. Never scale interaction targets.
const wrap=document.querySelector('.board-wrap'),actionBar=document.querySelector('.utility'),toolbox=document.querySelector('.toolbox'),sideActions=matchMedia('(min-width:1000px) and (min-height:660px)');
function positionActions(){if(sideActions.matches)wrap.append(actionBar);else toolbox.append(actionBar);fitBoard();}
sideActions.addEventListener('change',positionActions);
function fitBoard(){
 const mobile=innerWidth<600,n=level().n,min=n*44+(mobile?6:8);
 const available=mobile?wrap.clientWidth:Math.min(wrap.clientWidth-(sideActions.matches?176:0),Math.max(0,wrap.clientHeight-12));
 const reserved=mobile?document.querySelector('.game').getBoundingClientRect().height-$('board').getBoundingClientRect().height:0;
 const size=Math.max(min,Math.floor(mobile?Math.min(available,innerHeight-reserved-6):available));
 $('board').style.width=size+'px';$('board').style.height=size+'px';
}
new ResizeObserver(fitBoard).observe(wrap);new ResizeObserver(fitBoard).observe($('board'));
fitBoard();

positionActions();

try{if(!sessionStorage.getItem('little-wilds:intro-shown')){sessionStorage.setItem('little-wilds:intro-shown','1');showInstructions();}}catch{showInstructions();}
new ResizeObserver(fitBoard).observe(document.querySelector('.inspector'));
