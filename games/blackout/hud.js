/* Readable player status and contextual mission UI. Gameplay rules stay in their systems. */
(() => {
 const $=s=>document.querySelector(s),healthSlots=[...$('#health-slots').children],energySlots=[...$('#energy-slots').children];
 if(window.StationSquare){const slot=document.createElement('i');slot.textContent='ϟ';slot.hidden=true;$('#energy-slots').append(slot);energySlots.push(slot)}
 const energyCaption=document.createElement('span');energyCaption.id='energy-caption';$('.energy-block').append(energyCaption);let lastEnergy=null,energyUntil=0,energyChange='';
 const portrait=$('#hud-portrait').getContext('2d');const feedback=document.createElement('div');feedback.id='boss-feedback';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');$('.hud').append(feedback);
 let previousHealth=null,previousDeaths=0,damageUntil=0,damageStart=3;
 const tools=document.createElement('div');tools.id='pause-tools';tools.hidden=true;
 const controls=document.createElement('section');controls.id='pause-controls';controls.innerHTML='<h3>Controls & abilities</h3><p>Move and aim with A/D or arrows. Space jumps or climbs. Shift dashes (1 energy). T teleports (2 energy, after the first generator). E powers devices.</p><p>Q fires Bolt from level 2 (1 energy). F raises Shield from level 3 (2 energy). R retries; Esc pauses. Controller assignments are in Settings. Touch controls stay below the playfield.</p><p>Three health segments absorb hits. Checkpoints restore health. Falls retry from your checkpoint. Energy is separate from health.</p>';
 for(const id of ['playroom','save-manager','abilities','journey','settings','character','reset']){const node=$('#'+id);if(node)tools.append(node)}
 $('#overlay').append(tools,controls);controls.hidden=true;
 // Essential pause, sound and fullscreen controls remain directly accessible.
 $('header .eyebrow').textContent='RAIN / ROOFTOPS / ONE LAST DELIVERY';
 const objectives=()=>{
  if(window.PlatformNine)return PlatformNine.objective();if(window.UnderRiverEscape)return UnderRiverEscape.objective();
  const b=window.ChapterAbilities?.boss;
  if(b)return window.StationSquare?.sequence?'Restore the departure board':'Disable '+Campaign.level.boss;
  if(window.ChapterAbilities?.defeated)return 'Power the final relay';
  const next=grid.generators.find(g=>!g.on);
  if(!next)return 'Reach the delivery point';
  if(grid.doors.some(d=>!d.open&&d.x>p.x-65&&d.x<next.x))return 'Find energy and open the route';
  if(next.checkpoint===4)return window.StationSquare?'Reach the station controls':'Reach the rooftop guardian';
  const enemy=window.Combat2D?.enemies.find(e=>e.relay===next.checkpoint&&e.hp>0);
  if(enemy&&Math.abs(enemy.x-p.x)<350)return 'Clear the guard protecting the next generator';
  const r=window.Combat2D?.receiver;
  if(r&&!Combat2D.shieldVerified&&r.relay===next.checkpoint&&Math.abs(r.x-p.x)<300)return 'Block the marked pulse to charge the receiver';
  return 'Restore feeder '+next.checkpoint+' of 3';
 };
 window.CourierHUD={
 pauseTools(show){tools.hidden=!show;controls.hidden=!show;$('#overlay').classList.toggle('is-paused',show)},
 update(){
  const hp=window.ChapterAbilities?.boss?.guard??window.Combat2D?.guard??3;
  if(previousHealth!==null&&hp<previousHealth&&deaths===previousDeaths){damageUntil=time+1.5;damageStart=previousHealth;$('#damage-notice').textContent='Hit — '+hp+' health remaining';}
  if(deaths!==previousDeaths)damageUntil=0;previousHealth=hp;previousDeaths=deaths;
  $('#health-count').textContent=hp+' / 3';$('#health-slots').setAttribute('aria-label',hp+' of 3 health');
  healthSlots.forEach((el,i)=>{el.className=i<hp?'filled':time<damageUntil&&i<damageStart?'lost':''});
  for(const [key,enabled]of [['KeyT',window.ChapterAbilities?.unlocked()],['KeyQ',window.Combat2D?.boltsUnlocked()],['KeyF',window.Combat2D?.shieldUnlocked()]]){const button=document.querySelector('.touch [data-key="'+key+'"]');if(button)button.hidden=!enabled}
  const nowEnergy=p.charges||0;if(lastEnergy!==null&&nowEnergy!==lastEnergy){energyUntil=time+1;energyChange=nowEnergy>lastEnergy?'Recharged +'+(nowEnergy-lastEnergy):'Spent '+(lastEnergy-nowEnergy)}lastEnergy=nowEnergy;energyCaption.textContent=time<energyUntil?energyChange:nowEnergy===0?'Find cyan power':nowEnergy===2?'2-energy ready':window.Combat2D?.boltsUnlocked()?'Dash / Bolt: 1':'Dash: 1';
  const capacity=p.capacity||1;$('#energy-count').textContent=(p.charges||0)+' / '+capacity;$('#energy-slots').setAttribute('aria-label',(p.charges||0)+' of '+capacity+' energy');
  energySlots.forEach((el,i)=>{el.hidden=i>=capacity;el.className=i<(p.charges||0)?'filled':''});
  $('#damage-notice').hidden=time>=damageUntil;$('.hud').classList.toggle('was-hit',time<damageUntil);
  $('#objective').textContent=objectives();
  const ca=window.ChapterAbilities;$('.hud').classList.toggle('is-fighting',!!ca?.boss);
  const awakening=ca?.boss&&time-ca.boss.enteredAt<1.5;feedback.hidden=!(ca?.defeated||time<(ca?.hitNoticeUntil||0)||awakening);
  feedback.textContent=ca?.defeated?(grid.generators[3].on?'GUARDIAN DEFEATED · Relay restored':'GUARDIAN DEFEATED · Power the final relay'):time<(ca?.hitNoticeUntil||0)?'HIT CONFIRMED · '+(ca.boss?.health||0)+' hits remaining':awakening?Campaign.level.boss+' awakened · Evade, then attack the exposed chest':'';
  if(ca?.defeated&&!grid.generators[3].on)$('#hint').textContent='Follow the relay marker. Power / E activates the final relay.';

  const current=window.Combat2D?.noticeUntil>time?Combat2D.notice:'';
  if(!window.ChapterAbilities?.boss&&current)$('#hint').textContent=current;
  const context=grid.target(p);let hint=$('#hint').textContent;if(ca?.defeated&&!grid.generators[3].on)hint='Follow the relay marker. Power / E activates the final relay.';
  if(!ca?.defeated&&!window.ChapterAbilities?.boss&&grid.messagePriority<2&&!current){
   if(context)hint=p.charge?('open'in context?'Power / E · Open door':'Power / E · Activate generator'):'Touch a cyan cabinet to collect energy';
   else if(p.hang)hint='Jump / Space · Climb up    ↓ · Drop';
   else if(!p.charges)hint='Touch a glowing cyan cabinet to recharge';
   else if(!grid.messageTime)hint='Move toward the next lit rooftop edge';
  }
  const lesson=window.AbilityCoach?.lesson();if(lesson&&grid.messagePriority<2&&!current){$('#objective').textContent=lesson.title;hint=lesson.tip}else if(!lesson&&!current&&grid.messagePriority<2&&window.CopperRow?.hint())hint=CopperRow.hint();
  if(!lesson&&!current&&!context&&p.charges>0&&grid.messagePriority<2&&window.Districts?.hint())hint=Districts.hint();
  if(ca?.boss&&window.EncounterPatterns&&!ca.encounterState().coreOpen)hint=ca.encounterState().recovering?'Hit confirmed. Recover energy and prepare for the next attack.':EncounterPatterns.tip(ca.boss);
  if(window.PlatformNine)hint=PlatformNine.hint();else if(window.UnderRiverEscape)hint=UnderRiverEscape.hint();
  const pad=window.Controller?.exportBindings();
  if($('#input-mode').textContent.startsWith('CONTROLLER')&&pad){
   const names=['A','B','X','Y','LB','RB','LT','RT','View','Menu'];
   for(const [action,key]of [['power','E'],['fire','Q'],['shield','F'],['teleport','T'],['dash','Shift'],['jump','Space']])hint=hint.replace(new RegExp('\\b'+key+'\\b','g'),names[pad.bindings[action]]||action);
  }else if(matchMedia('(pointer: coarse)').matches)hint=hint.replace(/\s*\/\s*(Space|Shift|[EQFT])\b/g,'');
  $('#hint').textContent=hint.replace(/^GUARD \d\/3 · /,'');
  portrait.clearRect(0,0,72,64);portrait.imageSmoothingEnabled=false;portrait.drawImage(CourierArt.image('idle',time,p.charge),0,0,72,64,0,0,72,64);
 }
 };
})();
