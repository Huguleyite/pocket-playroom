/* Small safe lessons; progress is separate from campaign saves. No mandatory practice gates. */
(() => {
 let learned={};try{const saved=JSON.parse(localStorage.getItem('blackout.coach.v1')||'{}');for(const k of ['jump','dash','teleport','bolt','shield'])if(saved[k]===true)learned[k]=true}catch{}
 window.AbilityCoach={
 mark(action){if(learned[action])return;learned[action]=true;try{localStorage.setItem('blackout.coach.v1',JSON.stringify(learned))}catch{}},
 reset(){learned={};try{localStorage.removeItem('blackout.coach.v1')}catch{}Combat2D.enemies=Combat2D.enemies.filter(e=>!e.practice);this.setup()},
 knows(action){return !!learned[action]},
 setup(){this.pulseDone=-1;if(Campaign.index===1&&!learned.bolt)Combat2D.enemies.push({id:'practice-bolt',type:'practice',practice:true,x:300,y:386,baseX:300,baseY:386,hp:1,max:1,clock:0,aim:null})},
 lesson(){
  if(ChapterAbilities.boss||ChapterAbilities.defeated)return null;
  if(Campaign.index===0){
   if(!learned.jump&&p.x<300)return {title:'Try a jump on this safe roof',tip:'Jump / Space · Press briefly for a low hop; hold for a higher jump.'};
   if(!learned.dash&&checkpoint===0&&p.charges>0)return {title:'Dash across the next gap',tip:'Hold a direction + Dash / Shift. Cost: 1 energy. Touch cyan cabinets to refill.'};
   if(!learned.teleport&&checkpoint>=1)return {title:'Teleport is ready to learn',tip:p.charges<2?'Collect 2 energy. Cyan cabinets fill your slots.':'Aim + Teleport / T. Cost: 2 energy. Jump first for a higher roof; the route must be clear.'};
  }
  if(Campaign.index===1&&!learned.bolt&&p.x<380)return {title:'Try Bolt on the practice target',tip:'Face the round target, then Bolt / Q. Cost: 1 energy. This target cannot hurt you.'};
  if(Campaign.index===2&&!learned.shield&&p.x<330)return {title:'Practice Shield in the cyan pulse zone',tip:'Collect 2 energy, stand at the cyan marker, then Shield / F before its pulse. Missing it causes no damage.'};
  return null;
 },
 update(){if(Campaign.index!==2||learned.shield||p.x>330)return;const cycle=Math.floor(time/4.5),phase=time%4.5;if(phase>=1.3&&this.pulseDone!==cycle){this.pulseDone=cycle;if(Math.abs(p.x+9-180)<32&&time<Combat2D.shieldUntil){Combat2D.shieldUntil=0;this.mark('shield');grid.say('PRACTICE COMPLETE · Shield blocks one hit. Refill before the next gap.',{priority:2,duration:5});window.BlackoutAudio?.effect('shieldBreak')}}},
 draw(){if(Campaign.index!==2||learned.shield)return;ctx.save();ctx.strokeStyle='#82ebd6';ctx.lineWidth=2;ctx.strokeRect(150,370,60,50);ctx.fillStyle='#b9f4e6';ctx.font='10px monospace';ctx.fillText('SAFE SHIELD PRACTICE',122,353);const phase=time%4.5;ctx.fillText(phase<1.3?'PULSE '+(1.3-phase).toFixed(1)+'s':'NEXT '+(5.8-phase).toFixed(1)+'s',151,366);if(phase>=1.3&&phase<1.6){ctx.globalAlpha=.2;ctx.fillRect(150,370,60,50)}ctx.restore()}
 };
})();
