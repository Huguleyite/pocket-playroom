/* Readable decisions and guided encounters; the same rules resolve every mode. */
(() => {
  'use strict';
  const copy = {
    solar: {
      4: ['After both play', 'Reveal their highest card.', 'Reveal the highest-numbered card still in your opponent’s hand. This does not change who wins.'],
      5: ['Reply off-sector', 'They discard one card.', 'Only when you play second with a different sector from the lead: your opponent discards one remaining card. They choose which one.'],
      6: ['After you win', 'See the next reserve card.', 'If this card wins, privately reveal the next card in the reserve. You do not draw it.'],
      7: ['After you win', 'They discard a random card.', 'If this card wins, your opponent discards one random card from their remaining hand.'],
      8: ['After both play', 'They discard their lowest card.', 'Your opponent discards their lowest-numbered remaining card. This can happen even if you lose.'],
      9: ['After you win', 'Draw one reserve card.', 'If this card wins, add the next reserve card to your hand. An empty reserve gives no card.']
    },
    void: {
      1: ['Reply off-sector', 'Beat a 7+ without priority.', 'Only when replying with a different sector from the lead: beat an opposing card with final strength 7 or higher, provided it does not have priority.'],
      2: ['Reply off-sector', 'Beat an 8+ without priority.', 'Only when replying with a different sector from the lead: beat an opposing card with final strength 8 or higher, provided it does not have priority.'],
      3: ['Reply off-sector', 'Beat a 9+ without priority.', 'Only when replying with a different sector from the lead: beat an opposing card with final strength 9 or higher, provided it does not have priority.'],
      4: ['After you lose', 'Take one of their discards.', 'If this card loses, choose one card from the opponent’s discard pile and add it to your hand. Captured trick cards are not discards. An empty pile gives no card.'],
      8: ['After you lose', 'Block their winning reward.', 'If this card loses, cancel the winner’s after-win ability. Earlier strength changes, priority sector changes, reveals and discards are not undone.'],
      9: ['Before comparison', 'Both strengths even? You win.', 'Win if both cards’ final strengths are even. This card starts at 9, so another ability must change its strength first.']
    },
    cyber: {
      2: ['Before comparison', 'Flip a card to set priority.', 'Reveal and remove the next reserve card. Its sector becomes the priority sector, including in this trick, until changed again. No reserve card or locked priority sector means no change.'],
      4: ['Before comparison', 'Cyber has priority this trick.', 'Make Cyber the priority sector for this trick only. The previous persistent priority sector returns next trick. Locked priority sector blocks this change.'],
      6: ['Before comparison', 'The led sector gets priority.', 'Make the sector of the first card played the persistent priority sector. Locked priority sector blocks this change.'],
      7: ['Before comparison', 'Lock the priority sector.', 'Prevent later priority sector changes until the hands are redealt for a new expedition. This does not change the current priority sector.'],
      8: ['Before comparison', 'Lowest card sets priority.', 'Find the lowest-numbered card still in your hand. Its sector becomes the persistent priority sector. An empty hand or locked priority sector means no change.'],
      9: ['Before comparison', 'Choose the priority sector.', 'Choose the persistent priority sector after both cards are played. Locked priority sector blocks this choice and change.']
    },
    bio: {
      1: ['Before comparison', 'Copy their printed number.', 'Use the opponent’s original printed number as your strength. Other strength changes can still apply. Your sector stays Bio.'],
      2: ['When playing second', 'Strength 2 becomes 4.', 'Gain 2 strength only when replying to the first card. When you lead, this card stays at strength 2.'],
      4: ['Before comparison', 'Reduce their strength by 3.', 'Subtract 3 from the opposing card’s strength before deciding the winner. This does not change either sector.'],
      6: ['When playing second', 'Swap strengths with the lead.', 'When replying, swap the current strengths of the two played cards. This swaps numbers, not sectors. Leading this card does not swap anything.'],
      7: ['If Bio has priority', 'Strength 7 becomes 9.', 'After changes to priority and strength, become strength 9 if Bio is the active priority sector. Otherwise keep your current strength.'],
      9: ['First to resolve', 'Disable their ability.', 'Disable the opposing card’s ability before other abilities resolve. Its printed number and sector still count. Two opposing Bio 9s disable each other.']
    }
  };
  const standard = ['No ability', 'Win by sector and strength.', 'This card has no special ability. Cards in the priority sector beat cards from other sectors. Otherwise, the led sector takes priority. Compare strength within equal priority. The first card wins ties.'];
  const info = c => copy[c.s]?.[c.r] || standard;
  for (const s of SUITS) for (const [r, value] of Object.entries(copy[s])) ABILITIES[s][r][1] = value[2];
  const card = id => ({s:id.replace(/\d+$/, ''), r:Number(id.match(/\d+$/)[0]), id});
  const lessons = [
    {title:'1 · Compare numbers', goal:'Play Solar 3. Same sector, higher strength wins.', p:['solar3'], a:['solar2'], leader:'p', trump:'bio', expected:'solar3', check:r=>r.winner==='p'},
    {title:'2 · Priority sector beats a higher number', goal:'Nexus leads Solar. You have no Solar, so play Cyber 1: Cyber has priority.', p:['cyber1','void5'], a:['solar3'], leader:'a', trump:'cyber', expected:'cyber1', check:r=>r.winner==='p'},
    {title:'3 · Abilities have conditions', goal:'Reply with Bio 2. Watch 2 become 4. It still loses to 5; activating is different from winning.', p:['bio2'], a:['bio5'], leader:'a', trump:'solar', expected:'bio2', check:r=>r.ranks.p===4},
    {title:'4 · Change the opposing strength', goal:'Play Bio 4. Corrode turns the opposing 5 into 2 before comparing.', p:['bio4'], a:['bio5'], leader:'p', trump:'solar', expected:'bio4', check:r=>r.ranks.a===2&&r.winner==='p'},
    {title:'5 · A reward comes after winning', goal:'Win with Solar 9, then watch a reserve card join your hand.', p:['solar9'], a:['solar3'], leader:'p', trump:'cyber', expected:'solar9', check:r=>r.winner==='p'},
    {title:'6 · Reply with another sector', goal:'Reply to Void with Solar 5. Its off-sector condition is met: Nexus must discard a remaining card.', p:['solar5'], a:['void5','bio3','solar2'], leader:'a', trump:'solar', expected:'solar5', check:r=>r.winner==='p'},
    {title:'7 · Priority sector can change for one trick', goal:'Play Cyber 4. Watch priority switch from Bio to Cyber for this trick. Bio returns next trick.', p:['cyber4'], a:['cyber3'], leader:'p', trump:'bio', expected:'cyber4', check:r=>r.trump==='cyber'&&r.persistent==='bio'},
    {title:'8 · An ability can be blocked', goal:'Play Bio 9. The opposing Corrode is disabled, so your strength stays 9.', p:['bio9'], a:['bio4'], leader:'p', trump:'solar', expected:'bio9', check:r=>!r.enabled.a&&r.ranks.p===9},
    {title:'9 · An exception can beat strength', goal:'Reply with Void 1. Solar 7 does not have priority, so Warp beats it. Solar flare gives no reward because it lost.', p:['void1','bio3'], a:['solar7'], leader:'a', trump:'bio', expected:'void1', check:r=>r.winner==='p'}
  ];
  let selectedId=null, frame=null, stageNumber=0, releaseStage=null, modeName='learn', lessonIndex=0, completed=0, fast=false, beforeFrame=null, moves=[];
  try { modeName=localStorage.getItem('quantum-draft:mode')||'learn'; completed=Math.min(lessons.length,Math.max(0,Number(localStorage.getItem('quantum-draft:lessons'))||0)); fast=localStorage.getItem('quantum-draft:fast')==='yes'; } catch {}
  if (!['learn','practice','challenge'].includes(modeName)) modeName='learn';
  lessonIndex=Math.min(completed,lessons.length-1);
  const original={render,fresh,aiTurn,cardHTML};
  const node=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls||'';if(text)e.textContent=text;return e;};
  const panel=document.querySelector('.effects-panel');
  panel.id='learning-panel';
  const lessonBar=node('div','lesson-banner');lessonBar.id='lesson-banner';panel.prepend(lessonBar);
  const inspect=node('section','inspect-panel');inspect.id='inspect-panel';inspect.setAttribute('aria-label','Selected card');
  const inspectTitle=node('h3','','Select a card to inspect');inspectTitle.id='inspect-title';
  const timing=node('div','ability-timing');timing.id='inspect-timing';
  const description=node('p');description.id='inspect-description';
  const context=node('p','card-context');context.id='inspect-context';context.setAttribute('aria-live','polite');
  const commit=node('button','btn primary','Play selected card');commit.id='play-card';commit.disabled=true;
  inspect.append(inspectTitle,timing,description,context,commit);lessonBar.after(inspect);
  const stageTitle=node('h3','stage-title');stageTitle.id='stage-title';stageTitle.setAttribute('aria-live','polite');
  const counts=node('div','hand-counts');counts.id='learning-counts';
  panel.insertBefore(stageTitle,panel.querySelector('h3:not(#inspect-title)'));
  panel.insertBefore(counts,$('effectLines'));
  const controls=node('div','resolution-controls');
  const step=node('button','btn primary','Continue');step.id='resolution-step';step.hidden=true;
  const expandResult=node('button','btn','View larger result');expandResult.id='expand-result';expandResult.hidden=true;
  controls.append(commit,step,expandResult,$('nextBtn'));panel.append(controls);
  const resultDialog=node('dialog');resultDialog.id='result-details';resultDialog.setAttribute('aria-labelledby','result-details-title');
  const resultTitle=node('h2','','What changed this trick?');resultTitle.id='result-details-title';const resultBody=node('div'),resultClose=node('button','btn primary','Back to board');resultClose.id='result-details-close';
  resultDialog.append(resultTitle,resultBody,resultClose);document.body.append(resultDialog);resultClose.onclick=()=>resultDialog.close();
  expandResult.onclick=()=>{resultBody.replaceChildren(node('p','plain-verdict',explainWinner(g.result||frame.r)),movementSummary(true),effectLog());resultDialog.showModal();};
  const coachDetails=node('details','learning-coach');coachDetails.append(node('summary','','Strategy hint'),$('coach'));panel.append(coachDetails);
  const details=node('dialog');details.id='card-details';details.setAttribute('aria-labelledby','card-details-title');
  const detailsTitle=node('h2');detailsTitle.id='card-details-title';const detailsTiming=node('div','ability-timing'),detailsText=node('p'),detailsContext=node('p','card-context');
  const detailsActions=node('div','card-details-actions'),detailsBack=node('button','btn','Back to board'),detailsPlay=node('button','btn primary','Play card');detailsBack.id='card-details-back';detailsPlay.id='card-details-play';
  detailsActions.append(detailsBack,detailsPlay);details.append(detailsTitle,detailsTiming,detailsText,detailsContext,detailsActions);document.body.append(details);
  detailsBack.onclick=()=>details.close();detailsPlay.onclick=()=>{if(commit.disabled)return;details.close();commit.click();};
  const inspectOpen=node('button','btn inspect-open','Read full card');inspectOpen.id='inspect-open';inspect.append(inspectOpen);
  inspectOpen.onclick=()=>{if(selectedId)details.showModal();};
  panel.querySelector('h3:not(#stage-title):not(#inspect-title)')?.setAttribute('hidden','');
  const content=node('div','learning-content');content.id='learning-content';
  for(const child of [...panel.children])if(child!==controls)content.append(child);
  panel.prepend(content);
  const modeButton=node('button','btn');modeButton.id='modeBtn';modeButton.setAttribute('aria-haspopup','dialog');document.querySelector('.header-actions').prepend(modeButton);
  const settings=node('dialog');settings.id='learning-settings';settings.setAttribute('aria-labelledby','learning-settings-title');
  settings.innerHTML='<h2 id="learning-settings-title">Choose how to play</h2><p>Changing mode starts a new match. Every card keeps the same ability in every mode.</p><div class="mode-options"></div><label class="pace-setting"><input id="fast-play" type="checkbox"> Automatic next trick after 6 seconds (Practice / Challenge only)</label><p>Manual advancement is the default. Learn always waits for you at each step.</p><button class="btn" id="close-learning-settings">Keep playing</button>';
  document.body.append(settings);$('fast-play').checked=fast;
  for(const [key,title,text] of [['learn','Learn','Nine short, scripted encounters. Introduce one idea at a time, with all abilities active.'],['practice','Practice','Full 36-card game with a forgiving opponent, readable inspection, and optional hints.'],['challenge','Challenge','Full 36-card game with the original tactical opponent. The rules and card effects are identical.']]){
    const b=node('button','mode-option');b.dataset.mode=key;b.append(node('strong','',title),node('span','',text));
    b.onclick=()=>{cancelStage();modeName=key;try{localStorage.setItem('quantum-draft:mode',key);}catch{}settings.close();fresh();};settings.querySelector('.mode-options').append(b);
  }
  $('close-learning-settings').onclick=()=>settings.close();modeButton.onclick=()=>settings.showModal();
  const replay=node('button','btn','Replay lessons from the beginning');replay.id='replay-lessons';settings.append(replay);
  replay.onclick=()=>{completed=0;modeName='learn';try{localStorage.setItem('quantum-draft:lessons','0');localStorage.setItem('quantum-draft:mode','learn');}catch{}settings.close();fresh();};
  $('fast-play').onchange=()=>{fast=$('fast-play').checked;try{localStorage.setItem('quantum-draft:fast',fast?'yes':'no');}catch{}clearTimeout(advanceTimer);scheduleAdvance();renderRecentHands();};
  function cancelStage(){if(releaseStage){const done=releaseStage;releaseStage=null;done();}step.hidden=true;}
  function passed(){return !!g.result&&g.plays.p?.id===lessons[lessonIndex].expected&&lessons[lessonIndex].check(g.result);}
  function contextFor(c){
    const lead=g.plays.a, legalMove=g.phase==='input'&&legal('p').some(x=>x.id===c.id), messages=[];
    if(!legalMove&&g.phase==='input')messages.push(`You hold ${LABEL[lead.s]}, so you must play that sector. This card can be inspected but cannot be played.`);
    if(g.phase!=='input')messages.push('Wait until your turn to play.');
    if(!lead)messages.push('You are playing first. The opponent’s card is unknown; this is not a guaranteed outcome.');
    else messages.push(`Nexus led ${name(lead)}. ${g.hands.p.some(x=>x.s===lead.s)?'You must follow that sector.':'You have none of that sector, so any card is legal.'}`);
    if(c.s==='bio'&&[2,6].includes(c.r)&&!lead)messages.push('Will not activate when you lead: this ability requires playing second.');
    if(c.s==='bio'&&c.r===6&&lead&&lead.s!=='bio'&&g.trump!=='bio')messages.push('Swapping strengths alone won’t help here—you also need sector priority. Transplant swaps numbers, not sectors.');
    if(c.s==='solar'&&c.r===5||c.s==='void'&&c.r<=3)messages.push(!lead?'Will not activate when you lead: reply with another sector is required.':c.s===lead.s?'Will not activate: your reply matches the led sector.':'Replying with a different sector meets the timing condition.');
    if(c.s==='void'&&c.r<=3&&lead)messages.push(lead.s===g.trump?'The lead currently has priority, so Warp cannot beat it unless an ability changes priority sector.':`Warp needs the opposing final strength to be at least ${6+c.r}.`);
    if(g.lock&&c.s==='cyber'&&c.r!==7)messages.push('Priority sector is locked. This card cannot change it.');
    if(lead?.s==='bio'&&lead.r===9)messages.push('The opposing Bio 9 disables this card’s ability.');
    if(['After you win','After you lose'].includes(info(c)[0]))messages.push('This ability waits until the winner is decided.');
    return messages.join(' ');
  }
  function effectLog(){
    const d=node('details','ability-log');d.append(node('summary','','Detailed ability log'));
    for(const text of g.effects||[])d.append(node('p','',text));
    return d;
  }
  function abilityNotes(){
    const notes=node('div','ability-notes');
    for(const text of [...new Set(g.effects||[])].filter(t=>/did not activate|silenced|had no target|could not|blocked|no change|disabled/.test(t)))notes.append(node('p','',text));
    return notes;
  }
  function movementSummary(expanded=false){
    const section=node('section','card-changes');section.setAttribute('aria-label','Cards gained and lost');
    section.append(node('h4','','Card changes'));
    const played=moves.filter(m=>m.kind==='play'),abilityMoves=moves.filter(m=>m.kind!=='play');
    if(played.length){
      const summary=node('div','played-summary');
      summary.append(node('strong','','Played onto the table'));
      for(const m of played)summary.append(node('div','',`${m.owner==='p'?'You':'Opponent'} played ${name(m.card)} · hand ${m.before} → ${m.after}`));
      section.append(summary);
    }
    if(!abilityMoves.length)section.append(node('p','no-card-change',stageNumber===1&&g.phase==='resolving'?'Ability changes come next. Played cards are on the table, not in the discard pile.':'No cards were gained or discarded by abilities. Playing your card already removed it from your hand.'));
    for(const m of abilityMoves){
      const owner=m.owner==='p'?'You':'Opponent',possessive=m.owner==='p'?'Your':'Opponent’s';
      const gained=m.kind==='draw'||m.kind==='recover',hidden=m.kind==='draw'&&m.owner==='a';
      const row=node('article','card-change '+(gained?'card-gained':'card-lost'));row.dataset.kind=m.kind;row.dataset.owner=m.owner;
      row.append(node('div','move-cause',m.cause),node('h4','',`${owner} ${gained?(m.owner==='p'?'gain':'gains'):(m.owner==='p'?'discard':'discards')} 1 card`));
      const from=m.kind==='draw'?'Draw pile':m.kind==='recover'?(m.from==='p'?'Your discard pile':'Opponent’s discard pile'):`${possessive} hand`;
      const to=gained?`${possessive} hand`:`${possessive} discard pile`;
      const flow=node('div','move-path'),source=node('div','move-source',from),arrow=node('span','move-arrow','→'),destination=node('div','move-destination');
      arrow.setAttribute('aria-hidden','true');
      const tile=node('div','moving-card'+(hidden?' face-down':''));tile.setAttribute('aria-label',hidden?'Face-down card drawn by opponent':name(m.card));
      if(hidden){tile.append(node('strong','','?'),node('span','','Hidden card'));}
      else{tile.style.setProperty('--art',`var(--art-${m.card.s})`);tile.append(node('strong','',String(m.card.r)),node('span','',LABEL[m.card.s]));}
      destination.append(tile,node('span','',to));flow.append(source,arrow,destination);row.append(flow);
      const delta=node('div','move-count');delta.append(node('span','',`${possessive} hand`),node('strong','',`${m.before} → ${m.after}`),node('span','move-delta',gained?'+1 card':'−1 card'));row.append(delta);
      row.append(node('p','move-explanation',m.kind==='discard'?'This card cannot be played again unless an ability recovers it.':m.kind==='recover'?'The recovered card returns to the hand and can be played later.':hidden?'The card’s identity stays hidden. The opponent now has one more card to play.':'The drawn card is now in your hand and can be played later.'));
      section.append(row);
    }
    if(expanded)section.classList.add('expanded-movement');
    return section;
  }
  function renderSelection(){
    const c=g.hands.p.find(c=>c.id===selectedId);inspect.hidden=g.phase!=='input';
    for(const e of $('hand').querySelectorAll('button')){const selected=e.dataset.card===selectedId;e.classList.toggle('inspected',selected);e.setAttribute('aria-pressed',String(selected));}
    inspectTitle.textContent=c?`${name(c)} · ${ability(c)[0]}`:'Select a card to inspect';timing.textContent=c?info(c)[0]:'Inspect first · play when ready';
    description.textContent=c?info(c)[2]:'Click or tap any card to read it here. Selecting a card does not play it.';
    context.textContent=c?contextFor(c):g.plays.a?`Nexus led ${name(g.plays.a)}. Bright cards are legal replies.`:'You lead this trick. Choose a card, then confirm your play.';
    commit.hidden=g.phase!=='input';commit.disabled=!c||g.phase!=='input'||!legal('p').includes(c);commit.textContent=c?`Play ${name(c)}`:'Play selected card';
    inspectOpen.hidden=!c;detailsTitle.textContent=inspectTitle.textContent;detailsTiming.textContent=timing.textContent;detailsText.textContent=description.textContent;detailsContext.textContent=context.textContent;detailsPlay.textContent=commit.textContent;detailsPlay.disabled=commit.disabled;
  }
  commit.onclick=()=>{const c=g.hands.p.find(c=>c.id===selectedId);if(c&&g.phase==='input'&&legal('p').includes(c)){selectedId=null;play('p',c);}};
  cardHTML=(c,extra='',rank)=>{
    const [when,short]=info(c),changed=rank!==undefined&&rank!==c.r;
    return `<div class="card ${c.s} ${extra}"><div class="card-top"><span class="rank ${changed?'mutated':''}">${rank??c.r}</span><span class="glyph">${ICON[c.s]}</span></div><div class="sector">${LABEL[c.s]}</div>${changed?`<span class="effective">${c.r} → ${rank}</span>`:extra.includes('silenced')?'<span class="silence-tag">ABILITY DISABLED</span>':''}<div class="card-copy"><div class="card-name">${ability(c)[0]}</div><div class="ability-timing">${when}</div><div class="card-effect">${short}</div></div></div>`;
  };
  render=()=>{
    original.render();modeButton.textContent=modeName[0].toUpperCase()+modeName.slice(1)+' ▾';document.body.dataset.quantumMode=modeName;
    const sorted=[...g.hands.p].sort((a,b)=>SUITS.indexOf(a.s)-SUITS.indexOf(b.s)||a.r-b.r);
    [...$('hand').children].forEach((btn,i)=>{const c=sorted[i];btn.disabled=false;btn.dataset.card=c.id;btn.onclick=()=>{selectedId=c.id;renderSelection();if(matchMedia('(min-width:700px) and (max-height:650px)').matches&&!details.open)details.showModal();};btn.title=`${name(c)}: ${info(c)[2]}`;btn.setAttribute('aria-label',btn.title+' Select to inspect.');});
    renderSelection();coachDetails.hidden=!hintsEnabled;if(hintsEnabled)coachDetails.open=true;
    lessonBar.hidden=modeName!=='learn';if(modeName==='learn'){const l=lessons[lessonIndex];lessonBar.replaceChildren(node('strong','',l.title));if(g.phase==='input'||g.phase==='thinking')lessonBar.append(node('p','',l.goal),node('small','',`Scripted lesson ${lessonIndex+1} of ${lessons.length} · Only the shown cards are dealt. All abilities work normally.`));}
    $('handHint').textContent='Select to read · Play to commit';
    counts.textContent=`Cards left — You: ${g.hands.p.length} · Opponent: ${g.hands.a.length} · Draw pile: ${g.deck.length}`;
    panel.classList.toggle('resolving',g.phase==='resolving');
    const latest=g.history?.[0];
    stageTitle.textContent=g.phase==='input'?'Your decision':g.phase==='thinking'?'Waiting for Nexus':g.result?'Why this trick ended this way':'Both cards committed';
    if(frame){
      stageTitle.textContent=frame.title;
      if(frame.r){for(const p of ['p','a'])$(p==='p'?'playerSlot':'aiSlot').innerHTML=cardHTML(g.plays[p],frame.r.enabled[p]?'':'silenced',frame.r.ranks[p]);$('trumpBadge').textContent=`${LABEL[frame.r.trump]} HAS PRIORITY${frame.r.lock?' / LOCKED':''}`;}
      const root=$('effectLines');root.replaceChildren(...frame.lines.map(t=>node('div','effect-line',t)));
      if(frame.kind==='rewards')root.replaceChildren(node('div','plain-verdict',explainWinner(frame.r)),movementSummary(),abilityNotes(),effectLog());
      if(frame.kind==='commit')root.append(movementSummary());
    }else if(g.result){
      const reason=node('div','plain-verdict',explainWinner(g.result));$('effectLines').replaceChildren(reason,movementSummary(),abilityNotes(),effectLog());
      if(modeName==='learn')$('effectLines').prepend(node('div','lesson-verdict',passed()?'Lesson complete. Read the result, then continue.':'That choice did not meet the lesson goal. Read the result and try again.'));
    }else if(g.phase==='input'&&latest){$('effectLines').replaceChildren(node('div','last-result',`Last trick: ${latest.winner==='p'?'you won':'Nexus won'}. ${latest.reason}`));}
    $('nextBtn').hidden=!['result','over'].includes(g.phase);$('nextBtn').textContent=modeName==='learn'?(passed()?(lessonIndex===lessons.length-1?'Start Practice →':'Next lesson →'):'Try this lesson again'):g.phase==='over'?'Play again →':'Next trick →';
    expandResult.hidden=!g.result&&frame?.kind!=='rewards';
    if(g.result&&latest)latest.cardMoves=moves.map(m=>({...m,card:{...m.card}}));
    if(modeName==='learn'&&passed()){completed=Math.max(completed,lessonIndex+1);try{localStorage.setItem('quantum-draft:lessons',String(completed));}catch{}}
    // The old result panel had a separate decorative outcome over the controls.
    $('outcome').hidden=true;
    $('advanceNote').textContent=modeName==='learn'?'Guided lessons wait for you.':fast?'Automatic advancement: 6 seconds after resolution.':'Manual pace: press Next trick when ready.';
  };
  function explainWinner(r){
    if(/warp|Parity/i.test(r.reason))return `${r.winner==='p'?'You win':'Nexus wins'}: ${r.reason}`;
    const win=r.winner,lose=other(win),w=g.plays[win],l=g.plays[lose],owner=win==='p'?'You win':'Nexus wins';
    if(w.s===r.trump&&l.s!==r.trump)return `${owner}: ${LABEL[w.s]} has priority, which beats the other sector even with a smaller number. Final strengths: you ${r.ranks.p}, Nexus ${r.ranks.a}.`;
    if(w.s!==l.s&&w.s!==r.trump)return `${owner}: ${LABEL[w.s]} is the led sector; the other card is neither led sector nor priority sector. Strength does not override that priority.`;
    return `${owner}: ${r.ranks.p===r.ranks.a?'strengths tie, so the first card wins':`both cards have the same sector priority, so ${r.ranks[win]} beats ${r.ranks[lose]}`}. Final strengths: you ${r.ranks.p}, Nexus ${r.ranks.a}.`;
  }
  function loadLesson(index){
    cancelStage();clearTimeout(advanceTimer);epoch++;selectedId=null;frame=null;stageNumber=0;lessonIndex=index;
    const l=lessons[index];g={history:[],score:{p:0,a:0},round:index+1,trick:0,leader:l.leader,phase:'input',hands:{p:l.p.map(card),a:l.a.map(card)},discards:{p:[],a:[]},deck:['bio3','void5'].filter(id=>![...l.p,...l.a].includes(id)).map(card),captured:[],plays:{},face:card('cyber5'),trump:l.trump,lock:false,result:null};
    $('logs').replaceChildren();begin();
  }
  fresh=()=>{cancelStage();if(details.open)details.close();if(resultDialog.open)resultDialog.close();selectedId=null;frame=null;if(modeName==='learn')loadLesson(Math.min(completed,lessons.length-1));else original.fresh();};
  const next=()=>{
    if(!['result','over'].includes(g.phase))return;
    if(modeName==='learn'){
      if(!passed())return loadLesson(lessonIndex);
      if(lessonIndex<lessons.length-1)return loadLesson(lessonIndex+1);
      modeName='practice';try{localStorage.setItem('quantum-draft:mode',modeName);}catch{}fresh();return;
    }
    selectedId=null;frame=null;stageNumber=0;if(g.phase==='over')fresh();else advanceHand();
  };
  $('nextBtn').onclick=next;
  const ai=()=>{
    const token=epoch;g.phase='thinking';setMessage('Nexus is choosing a card…','Abilities wait until both cards are played.');render();
    $('aiMode').textContent=modeName==='learn'?'Guided encounter':'Practice opponent';$('modeDesc').textContent=modeName==='learn'?'Scripted cards demonstrate the lesson. Abilities are unchanged.':'Follows sector and compares numbers. Does not plan ability combinations.';
    setTimeout(()=>{if(token!==epoch||g.phase!=='thinking')return;const moves=legal('a');let chosen;
      if(modeName==='learn')chosen=moves[0];
      else {const lead=g.plays.p;const strength=c=>(c.s===g.trump?200:lead&&c.s===lead.s?100:0)+c.r;const ranked=[...moves].sort((a,b)=>strength(a)-strength(b));const winners=lead?ranked.filter(c=>strength(c)>strength(lead)):[];chosen=winners.length?winners[0]:ranked[0];}
      play('a',chosen);
    },modeName==='learn'?450:700);
  };
  function wait(){
    if(modeName!=='learn')return new Promise(resolve=>setTimeout(resolve,fast?450:1100));
    step.hidden=false;step.textContent=stageNumber===1?'Resolve abilities →':stageNumber===2?'Apply remaining effects →':'Record point →';
    return new Promise(resolve=>{releaseStage=resolve;step.onclick=()=>{releaseStage=null;step.hidden=true;resolve();};});
  }
  const schedule=()=>{
    clearTimeout(advanceTimer);advanceTimer=null;
    if(modeName!=='learn'&&fast&&g.phase==='result'){
      const token=epoch;advanceTimer=setTimeout(()=>{advanceTimer=null;if(token!==epoch||g.phase!=='result')return;if(document.hidden||document.querySelector('dialog[open]'))return schedule();next();},6000);
    }
  };
  globalThis.QDLearning={get mode(){return modeName;},ai,schedule,beginTrick(){moves=[];},cardMove(move){moves.push({...move,card:{...move.card}});},
    async stage(kind,r,before){
      if(kind==='commit')stageNumber=0;
      stageNumber++;if(kind==='commit'){beforeFrame={p:g.hands.p.map(c=>c.id),a:g.hands.a.map(c=>c.id),trump:g.trump};frame={title:'1 · Both cards are now visible',lines:['No ability happens when a card is only selected. Now both cards are committed; their abilities can resolve.']};}
      else if(kind==='abilities'){frame={r,title:'2 · Abilities and comparison',lines:[...(g.effects.length?g.effects:['No strength or priority sector ability changed this pair.']),explainWinner(r)]};}
      else {frame={r,title:'3 · Apply discards and rewards',lines:[...g.effects,`Cards left after abilities — You: ${before.p} → ${g.hands.p.length}; Opponent: ${before.a} → ${g.hands.a.length}.`,explainWinner(r)]};counts.classList.remove('counts-changed');void counts.offsetWidth;counts.classList.add('counts-changed');}
      frame.kind=kind;render();content.scrollTop=0;
      if(kind==='abilities'&&beforeFrame.trump!==r.trump)$('trumpBadge').classList.add('trump-changed');
      if(kind==='rewards'){
        for(const e of $('hand').children)if(!beforeFrame.p.includes(e.dataset.card))e.classList.add('drawn-card');
        if(g.hands.a.length<beforeFrame.a.length)$('backs').classList.add('hand-discarded');
      }
      await wait();frame=null;
    }
  };
  // The rule engine only delegates pacing and opponent policy to this layer.
  fresh();
  $('manifest').replaceChildren();for(const s of SUITS){$('manifest').append(node('h3','',LABEL[s]));for(let r=1;r<=9;r++){const c={s,r};$('manifest').append(node('p','',`${name(c)} · ${ability(c)[0]} — ${info(c)[0]}. ${info(c)[2]}`));}}
  const guide=node('p','learning-guide','New: select a card to inspect it, then press Play. Abilities resolve after both cards commit. Learn introduces nine ideas one at a time; Practice and Challenge use the full deck. Results wait for Next trick unless you enable automatic pace in the mode menu.');
  $('rules').querySelector('h2').after(guide);
})();
