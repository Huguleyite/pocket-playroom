import bank from './bank.js';
import {LAUNCH_DATE,PREVIEW_KEY,BOARD_THEMES,rewardProgress,COLORS,easternDate,serial,dayNumber,selectedDay,nextMidnight,conflicts,solved,givenIndex,freshGrid,streakFor,timeText} from './core.js';
const $=id=>document.getElementById(id),params=new URLSearchParams(location.search),short=params.get('short')==='1';
const incoming=window.PocketChallenge?.incoming,challenge=incoming?.id==='daily-stars'?incoming:null;
const boardPreview=params.get('boards')==='preview'&&params.get('key')===PREVIEW_KEY;
const invalidChallenge=params.has('challenge')&&(!challenge||challenge.day<LAUNCH_DATE||challenge.day>easternDate());
let N=challenge&&!invalidChallenge?serial(challenge.day)-serial(LAUNCH_DATE)+1:selectedDay(params),puzzle=bank[(N-1)%bank.length],date=easternDate(),today=dayNumber(),preview=!challenge&&N!==today;
const prefix='daily-stars:v1:',defaults={dots:true,mistakes:true,letters:false,sound:true,effects:true};
function read(k){try{return JSON.parse(localStorage.getItem(k));}catch{return null;}}
function write(k,value){try{localStorage.setItem(k,JSON.stringify(value));}catch{$('saving').textContent='Saving is unavailable. You can still play this visit.';}}
let prefs={...defaults,...read(prefix+'settings')},night=read('room-for-play:night')||{},stats=read(prefix+'stats')||{days:[],best:null};
if(!Array.isArray(stats.days))stats.days=[];
let rewards=rewardProgress(stats,date),activeBoard=boardPreview?params.get('board')||prefs.board||'classic':prefs.board||'classic';
const owns=id=>id==='classic'||rewards.unlocked.includes(id)||boardPreview;
if(!BOARD_THEMES.some(t=>t.id===activeBoard)||!owns(activeBoard))activeBoard='classic';
const STAR='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z"/></svg>';
document.documentElement.classList.toggle('night-play',typeof night.overrides?.['daily-stars']==='boolean'?night.overrides['daily-stars']:night.global===true);
function buildCells(board,values,interactive){board.replaceChildren();puzzle.regions.forEach((region,i)=>{
 const cell=document.createElement(interactive?'button':'div');cell.className='cell';cell.style.setProperty('--region',`var(--r${region})`);cell.dataset.index=i;
 if(i%7<6&&puzzle.regions[i+1]!==region)cell.classList.add('edge-right');if(i<42&&puzzle.regions[i+7]!==region)cell.classList.add('edge-bottom');
 const mark=document.createElement('span');mark.className='mark';mark.setAttribute('aria-hidden','true');cell.append(mark);
 const letter=document.createElement('span');letter.className='region-letter';letter.textContent=String.fromCharCode(65+region);letter.setAttribute('aria-hidden','true');cell.append(letter);
 if(interactive){cell.type='button';bindPress(cell,i);cell.addEventListener('keydown',event=>{if(event.shiftKey&&event.key==='Enter'){event.preventDefault();dotLines(i);return;}const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[event.key];if(delta){event.preventDefault();board.children[Math.max(0,Math.min(48,i+delta))].focus();}});}
 board.append(cell);
 });paint(board,values,interactive);}
function paint(board,values,interactive){const bad=interactive&&prefs.mistakes?conflicts(values,puzzle.regions).bad:new Set();[...board.children].forEach((cell,i)=>{
 const automatic=interactive&&values[i]===0&&hasDotSource(i);
 const value=automatic?1:values[i],mark=cell.querySelector('.mark');if(value===2)mark.innerHTML=STAR;else mark.textContent=value===1?(activeBoard==='nebula'&&!short?'○':'•'):'';cell.classList.toggle('star',value===2);cell.classList.toggle('dot',value===1);cell.classList.toggle('error',bad.has(i));cell.classList.toggle('given',interactive&&i===givenIndex(puzzle));cell.querySelector('.region-letter').hidden=short||!(prefs.letters||(interactive&&activeBoard==='nebula'));
 cell.setAttribute('aria-label',`Row ${Math.floor(i/7)+1}, column ${i%7+1}, ${COLORS[puzzle.regions[i]]} region, ${value===2?'star':value===1?(automatic?'automatic dot':'dot'):'empty'}${interactive&&i===givenIndex(puzzle)?', starting clue':''}${bad.has(i)?', conflict':''}`);
 if(interactive){cell.setAttribute('aria-disabled',String(state.solved));cell.title=value===2?'Hold to dot this row and column (keyboard: Shift+Enter)':'';}
 });}
function showShort(){document.documentElement.classList.add('short-mode','night-play');$('short').hidden=false;$('play').hidden=true;
 $('short-edition').textContent=`DAILY STARS · NO. ${N}`;$('question').textContent=`Which column is the star in row ${puzzle.askRow+1}?`;
 const yesterday=bank[((N-2)%bank.length+bank.length)%bank.length];$('yesterday').textContent=N>1?`Yesterday: row ${yesterday.askRow+1}, column ${yesterday.solution[yesterday.askRow]+1}`:'A new constellation starts today';
 $('columns').replaceChildren(...Array.from({length:7},(_,i)=>Object.assign(document.createElement('span'),{textContent:i+1})));$('rows').replaceChildren(...Array.from({length:7},(_,i)=>Object.assign(document.createElement('span'),{textContent:i+1})));
 const values=params.get('reveal')==='1'?Array.from({length:49},(_,i)=>puzzle.solution[Math.floor(i/7)]===i%7?2:0):freshGrid(puzzle);buildCells($('short-board'),values,false);$('asked-row').style.setProperty('--ask',puzzle.askRow);
 $('short-canvas').classList.toggle('static',params.get('static')==='1'||matchMedia('(prefers-reduced-motion:reduce)').matches);$('short-canvas').classList.toggle('once',params.get('loop')==='0');
 const size=()=>document.documentElement.style.setProperty('--short-scale',Math.min(innerWidth/1080,innerHeight/1920));addEventListener('resize',size);size();
}
let state,history=[],lastTick=null,midnight=nextMidnight(),audio;
function key(){return challenge?prefix+'challenge:'+params.get('challenge'):prefix+(boardPreview?'board-preview:':preview?'preview:':'day:')+N;}
function updateRewards(persist=false){const before=new Set(rewards.unlocked);rewards=rewardProgress(stats,date);if(persist){stats.bestStreak=rewards.best;stats.unlocked=rewards.unlocked;write(prefix+'stats',stats);}return BOARD_THEMES.filter(t=>rewards.unlocked.includes(t.id)&&!before.has(t.id));}
function applyBoard(id,persist=false){if(!BOARD_THEMES.some(t=>t.id===id)||!owns(id))return;activeBoard=id;document.documentElement.dataset.board=id;if(persist&&!boardPreview){prefs.board=id;write(prefix+'settings',prefs);}parent.postMessage({type:'room:stars-board',board:id},location.origin);if(state)render();}
function openBoards(){if($('preferences').open)$('preferences').close();const list=$('board-list');list.replaceChildren();$('board-collection-note').textContent=boardPreview?'Design preview · try every board here without earning rewards or changing your daily save.':`Current streak: ${rewards.current} · Longest: ${rewards.best}. Solve one daily puzzle per Eastern date. Hints count; challenges and previews do not. Earned boards stay yours.`;
 for(const theme of BOARD_THEMES){const card=document.createElement('article');card.className='skin-card';card.dataset.board=theme.id;const mini=document.createElement('div');mini.className='board skin-mini';mini.setAttribute('aria-hidden','true');buildCells(mini,freshGrid(puzzle),false);const title=document.createElement('h3');title.textContent=theme.name;const text=document.createElement('p');text.textContent=theme.description;const label=document.createElement('small');label.textContent=theme.days?`${theme.days}-day streak · ${owns(theme.id)?boardPreview&&!rewards.unlocked.includes(theme.id)?'Preview':'Unlocked':'Locked'}`:'Always available';const button=document.createElement('button');button.type='button';button.dataset.chooseBoard=theme.id;button.textContent=theme.id===activeBoard?'Selected':owns(theme.id)?'Use board':`Unlock at ${theme.days} days`;button.disabled=!owns(theme.id);button.setAttribute('aria-pressed',String(theme.id===activeBoard));button.onclick=()=>{applyBoard(theme.id,true);list.querySelectorAll('[data-choose-board]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.chooseBoard===activeBoard));if(!b.disabled)b.textContent=b.dataset.chooseBoard===activeBoard?'Selected':'Use board';});};card.append(mini,title,text,label,button);list.append(card);}
 modal('wardrobe');}
function load(){history=[];const saved=read(key()),grid=saved?.grid;
 state=grid?.length===49&&grid.every(v=>[0,1,2].includes(v))?{grid:[...grid],elapsed:Math.max(0,Number(saved.elapsed)||0),started:saved.started===true,hints:Math.max(0,Number(saved.hints)||0),solved:false}:{grid:freshGrid(puzzle),elapsed:0,started:false,hints:0,solved:false};
 state.grid[givenIndex(puzzle)]=2;state.dotSources=Array.isArray(saved?.dotSources)?[...new Set(saved.dotSources.filter(i=>Number.isInteger(i)&&state.grid[i]===2))]:[];state.solved=solved(state.grid,puzzle.regions);lastTick=!document.hidden&&state.started&&!state.solved?performance.now():null;
}
function tick(){const now=performance.now();if(lastTick!==null)state.elapsed+=Math.max(0,now-lastTick);lastTick=!document.hidden&&state.started&&!state.solved?now:null;$('timer').textContent=timeText(state.elapsed);}
function save(){write(key(),state);}
function start(){if(!state.started){state.started=true;if(!document.hidden)lastTick=performance.now();}}
function tone(kind){if(!prefs.sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const notes=kind==='win'?[523,659,784,1047]:kind==='star'?[660,880]:kind==='error'?[180]:[420];notes.forEach((frequency,i)=>{const oscillator=audio.createOscillator(),gain=audio.createGain(),at=audio.currentTime+i*.09;oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.065,at+.01);gain.gain.exponentialRampToValueAtTime(.0001,at+.19);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(at);oscillator.stop(at+.2);});}catch{}}
function snapshot(){history.push({grid:[...state.grid],dotSources:[...state.dotSources]});if(history.length>150)history.shift();}
function bindPress(cell,i){let timer=null,origin=null,suppressClick=false;const cancel=()=>{clearTimeout(timer);timer=null;origin=null;};
 cell.addEventListener('pointerdown',event=>{cancel();suppressClick=false;if(event.button!==0||!event.isPrimary||state.solved||state.grid[i]!==2)return;origin={x:event.clientX,y:event.clientY};const day=N;timer=setTimeout(()=>{timer=null;if(!origin||document.hidden||day!==N||(!challenge&&!preview&&day!==dayNumber()))return;suppressClick=true;dotLines(i);},550);});
 cell.addEventListener('pointermove',event=>{if(origin&&Math.hypot(event.clientX-origin.x,event.clientY-origin.y)>10)cancel();});
 for(const name of ['pointerup','pointercancel','pointerleave','lostpointercapture'])cell.addEventListener(name,cancel);
 cell.addEventListener('contextmenu',event=>{if(state.grid[i]===2)event.preventDefault();});
 cell.addEventListener('click',event=>{if(suppressClick&&event.detail!==0){suppressClick=false;event.preventDefault();return;}tap(i);});
}
function hasDotSource(i){
 return state.dotSources.some(j=>Math.floor(j/7)===Math.floor(i/7)||j%7===i%7);
}
function dotLines(i){
 rollover();
 if(state.solved||state.grid[i]!==2)return;
 tick();start();snapshot();
 const enabled=state.dotSources.includes(i);
 state.dotSources=enabled?state.dotSources.filter(j=>j!==i):[...state.dotSources,i];
 $('status').textContent=enabled?'This star’s dots are off.':'This star now dots its row and column.';
 tone('dot');render();save();
}
function render(){paint($('board'),state.grid,true);$('edition').textContent=`No. ${N}${preview?' · Preview':''}`;$('progress').textContent=`${state.grid.filter(v=>v===2).length} / 7 stars`;$('undo').disabled=!history.length||state.solved;$('reset').disabled=state.solved;$('hint').disabled=state.solved;$('share').hidden=!state.solved;
 if(boardPreview)$('edition').textContent=`No. ${N} · Board preview`;
 $('challenge-friends').hidden=!state.solved||preview||boardPreview;
 $('challenge-result').hidden=!state.solved||!challenge;
 if(challenge){$('challenge-banner').hidden=false;$('challenge-target').textContent=`Beat ${timeText(challenge.target*1000)}`;$('challenge-rules').textContent=`${challenge.day} · ${challenge.hints?`At most ${challenge.hints} hint${challenge.hints===1?'':'s'}`:'No hints'} · Separate save`;
 if(state.solved){const seconds=Math.floor(state.elapsed/1000);$('challenge-result').textContent=state.hints>challenge.hints?`Solved with ${state.hints} hints. Your friend used ${challenge.hints}; this does not beat their challenge.`:seconds<challenge.target?'You beat your friend’s time!':seconds===challenge.target?'You tied your friend’s time.':'Challenge complete. Your friend’s time still stands.';}}
 $('tap-help').textContent=(prefs.dots?'Tap: empty → dot → star → empty':'Tap: empty → star → empty')+' · Hold a star to dot its row + column';
 $('stats').textContent=`Streak ${streakFor(stats.days, date)} · Best ${stats.best===null?'—':timeText(stats.best)}`;document.documentElement.classList.toggle('won',state.solved);document.documentElement.classList.toggle('quiet',!prefs.effects);
 $('boards').textContent=`Your boards · ${BOARD_THEMES.find(t=>t.id===activeBoard).name}`;
 $('reward-progress').textContent=rewards.next?`Next board: ${rewards.next.name} · ${rewards.next.days}-day streak`:'All six reward boards unlocked';
 if(state.solved)$('status').textContent=`Solved in ${timeText(state.elapsed)}${preview?' · Preview':''}`;
}
function finish(){if(!solved(state.grid,puzzle.regions))return;tick();state.solved=true;lastTick=null;
 if(!preview&&!challenge&&!boardPreview){const day=serial(date);if(!stats.days.includes(day)){stats.days.push(day);stats.best=stats.best===null?state.elapsed:Math.min(stats.best,state.elapsed);}const unlocked=updateRewards(true);if(unlocked.length){$('unlock-message').textContent=`Unlocked: ${unlocked.map(t=>t.name).join(', ')}. Choose it in Settings → Your boards.`;$('unlock-message').hidden=false;}write('room-for-play:completed:daily-stars',date);parent.postMessage({type:'room:completed',id:'daily-stars',date},location.origin);}
 tone('win');}
function tap(i){rollover();if(state.solved||i===givenIndex(puzzle))return;tick();start();snapshot();const value=state.grid[i];
 if(value===2)state.dotSources=state.dotSources.filter(j=>j!==i);
 const visibleValue=value===0&&hasDotSource(i)?1:value;
 state.grid[i]=prefs.dots?(visibleValue+1)%3:value===2?0:2;$('status').textContent='';tone(state.grid[i]===2?'star':'dot');finish();render();save();}
function check(){rollover();const result=conflicts(state.grid,puzzle.regions);$('status').textContent=result.messages.length?result.messages.join('\n'):state.solved?`Solved in ${timeText(state.elapsed)}`:'Not complete';if(result.bad.size)tone('error');}
function hint(){rollover();if(state.solved)return;const row=puzzle.solution.findIndex((c,r)=>state.grid[r*7+c]!==2);if(row<0){$('status').textContent='All correct stars are placed. Remove the conflicting extras.';return;}
 tick();start();snapshot();state.grid[row*7+puzzle.solution[row]]=2;state.hints++;$('status').textContent=`A guiding star in row ${row+1}.`;tone('star');finish();render();save();}
function rollover(){const nextDate=easternDate(),nextToday=dayNumber();if(nextDate!==date){tick();save();date=nextDate;today=nextToday;midnight=nextMidnight();updateRewards();if(challenge)return;N=selectedDay(params);preview=N!==today;puzzle=bank[(N-1)%bank.length];load();buildCells($('board'),state.grid,true);$('status').textContent='A new day. A fresh constellation.';render();}}
function countdown(){const seconds=Math.max(0,Math.ceil((midnight-Date.now())/1000));$('countdown').textContent=`Next puzzle in ${String(Math.floor(seconds/3600)).padStart(2,'0')}:${String(Math.floor(seconds/60)%60).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function fit(){let available=innerHeight;try{if(parent!==window){const f=frameElement.getBoundingClientRect();available=parent.innerHeight-(f.top+parent.scrollY)-12;}}catch{}
 const wide=innerWidth>=580,width=innerWidth-(wide?290:24),stageTop=document.querySelector('.stage').getBoundingClientRect().top+scrollY,actionsHeight=document.querySelector('.actions').getBoundingClientRect().height;
 const budget=available-stageTop-(wide?0:actionsHeight+8)-12,minimum=Math.min(314,width);
 const size=Math.floor(Math.min(wide?350:420,width,Math.max(minimum,budget)));document.documentElement.style.setProperty('--board-size',Math.max(280,size)+'px');
 document.querySelectorAll('dialog[open]').forEach(fitDialog);
 requestAnimationFrame(()=>{if(parent!==window)parent.postMessage({type:'room:height',height:Math.ceil($('play').getBoundingClientRect().bottom+scrollY+12)},location.origin);});
}
function modal(id){$(id).showModal();fitDialog($(id));}
function fitDialog(dialog){if(parent===window)return;try{const frameTop=frameElement.getBoundingClientRect().top,top=Math.max(0,-frameTop),bottom=Math.min(innerHeight,(parent.visualViewport?.height||parent.innerHeight)-frameTop),height=Math.max(0,bottom-top);dialog.style.maxHeight=Math.max(44,height-24)+'px';dialog.style.top=top+12+'px';dialog.style.margin='0';}catch{}}
if(short){showShort();}else if(invalidChallenge){if(parent!==window)document.documentElement.classList.add('embedded');const h=document.createElement('h1'),p=document.createElement('p'),back=document.createElement('a');h.textContent='Challenge unavailable';p.textContent='This link is invalid, uses an unsupported puzzle edition, or refers to an unreleased puzzle. Ask your friend for a new link.';p.setAttribute('role','alert');back.textContent='Play today’s puzzle';back.href='../../index.html#games/daily-stars';back.target='_top';$('play').replaceChildren(h,p,back);parent.postMessage({type:'room:height',height:300},location.origin);}else{
 if(parent!==window)document.documentElement.classList.add('embedded');load();if(!challenge&&!preview&&!boardPreview&&stats.days.length)updateRewards(true);applyBoard(activeBoard);buildCells($('board'),state.grid,true);render();countdown();
 $('help').onclick=()=>modal('howto');$('settings').onclick=()=>modal('preferences');document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
 $('boards').onclick=openBoards;$('wardrobe').addEventListener('close',()=>$('settings').focus());
 $('howto').addEventListener('close',()=>{write(prefix+'instructions',true);parent.postMessage({type:'room:stars-help'},location.origin);});
 for(const id of Object.keys(defaults)){$(id).checked=prefs[id];$(id).onchange=()=>{prefs[id]=$(id).checked;write(prefix+'settings',prefs);render();fit();};}
 $('night').checked=document.documentElement.classList.contains('night-play');$('night').onchange=()=>{night=read('room-for-play:night')||{};night.overrides={...night.overrides,'daily-stars':$('night').checked};write('room-for-play:night',night);document.documentElement.classList.toggle('night-play',$('night').checked);parent.postMessage({type:'room:stars-theme',enabled:$('night').checked},location.origin);};
 $('undo').onclick=()=>{if(!history.length||state.solved)return;tick();Object.assign(state,history.pop());$('status').textContent='Move undone.';render();save();};$('reset').onclick=()=>modal('reset-dialog');$('confirm-reset').onclick=()=>{tick();snapshot();state.grid=freshGrid(puzzle);state.dotSources=[];$('reset-dialog').close();$('status').textContent='A clean sky. Timer and hints kept.';render();save();};$('check').onclick=check;$('hint').onclick=hint;
 $('share').onclick=async()=>{const text=`Daily Stars No. ${N} ⭐ ${timeText(state.elapsed)}, ${state.hints?`${state.hints} hint${state.hints===1?'':'s'} used`:'no hints'}, pocketplayroom.com${preview||boardPreview?' (preview)':''}`;try{if(navigator.share)await navigator.share({text});else{await navigator.clipboard.writeText(text);$('status').textContent='Result copied.';}}catch(error){if(error.name!=='AbortError'){$('share-copy').value=text;modal('share-dialog');$('share-copy').select();}}};
 $('challenge-friends').onclick=async()=>{if(!state.solved||preview||boardPreview)return;const day=challenge?.day||date,url=window.PocketChallenge.link('daily-stars',{day,value:Math.floor(state.elapsed/1000),hints:state.hints});const text=`Daily Stars No. ${N} ⭐ Can you beat ${timeText(state.elapsed)}? ${state.hints?`At most ${state.hints} hint${state.hints===1?'':'s'}.`:'No hints.'} Play my exact puzzle.`;
 if(navigator.share)try{await navigator.share({title:'Daily Stars · Challenge friends',text,url});$('status').textContent='Challenge shared.';return;}catch(error){if(error.name==='AbortError')return;}
 try{await navigator.clipboard.writeText(text+'\n'+url);$('status').textContent='Challenge copied. Send it to a friend.';}catch{$('share-copy').value=text+'\n'+url;modal('share-dialog');$('share-copy').select();}};
 addEventListener('message',event=>{if(event.source!==parent||event.origin!==location.origin)return;if(event.data?.type==='room:night'){document.documentElement.classList.toggle('night-play',event.data.enabled===true);$('night').checked=event.data.enabled===true;}});
 document.addEventListener('visibilitychange',()=>{tick();save();if(!document.hidden)rollover();});addEventListener('pagehide',()=>{tick();save();});addEventListener('resize',fit);if(parent!==window){parent.addEventListener('resize',fit);parent.addEventListener('scroll',()=>document.querySelectorAll('dialog[open]').forEach(fitDialog),{passive:true});}
 new ResizeObserver(fit).observe($('play'));fit();if(!read(prefix+'instructions'))modal('howto');let saves=0;setInterval(()=>{rollover();tick();countdown();if(++saves%5===0&&state.started)save();},1000);
}
