/* Electricity grows to two slots after the first generator. Sources drain; doors and generators retain power. */
class PowerGrid {
 constructor(){this.reset()}
 reset(){this.sources=[
  {x:230,y:390,type:'cabinet'},{x:755,y:315,type:'cabinet'},
  {x:870,y:315,type:'cabinet'},{x:1110,y:390,type:'cabinet'},
  {x:1235,y:230,type:'cabinet'},{x:1460,y:290,type:'cabinet'},
  {x:1605,y:255,type:'node'},{x:1690,y:255,type:'node'},
  {x:1815,y:290,type:'cabinet'},{x:2090,y:240,type:'cabinet'},
  {x:2295,y:190,type:'cabinet'},{x:2500,y:330,type:'cabinet'},
  {x:2790,y:270,type:'cabinet'},{x:2860,y:270,type:'cabinet'},{x:1060,y:390,type:'cabinet'},{x:1870,y:290,type:'cabinet'}].map(s=>({...s,drained:false}));
  this.doors=[{x:810,y:180,w:24,h:165,open:false}];
  this.generators=[{x:1010,y:420,checkpoint:1,on:false},{x:1780,y:320,checkpoint:2,on:false},{x:2400,y:360,checkpoint:3,on:false},{x:2980,y:300,checkpoint:4,on:false}];
  this.message='Find the cyan power cabinet. Touch it to absorb a charge.';this.messageTime=6;this.messagePriority=2;this.messageQueue=[];this.absorbed=0;this.chain=0;this.bestChain=0;
 }
 respawn(){for(const source of this.sources){source.drained=false;source.cooldown=undefined};this.chain=0}
 say(text,{priority=1,duration=3.5}={}){
  if(this.messageTime>0&&priority<this.messagePriority){
   // Discard pickup chatter; retain important events until they can be read.
   if(priority>=2&&!this.messageQueue.some(m=>m.text===text))this.messageQueue.push({text,priority,duration});
   return;
  }
  if(this.messageTime>0&&priority===this.messagePriority&&priority>=2&&text!==this.message){
   if(!this.messageQueue.some(m=>m.text===text))this.messageQueue.push({text,priority,duration});return;
  }
  if(text===this.message&&this.messageTime>0)return;
  this.message=text;this.messageTime=duration;this.messagePriority=priority;
 }
 tickMessage(dt){this.messageTime=Math.max(0,this.messageTime-dt);if(this.messageTime===0){this.messagePriority=-1;const next=this.messageQueue.shift();if(next)this.say(next.text,next)}}
 nearby(p,o,r=48){return Math.hypot(p.x+9-o.x,p.y+17-(o.y-(o.checkpoint?22:0)))<r}
 target(p){return this.doors.find(d=>!d.open&&!d.remote&&Math.abs(p.x+9-(d.x+d.w/2))<65&&p.y+p.h>d.y&&p.y<d.y+d.h)||this.generators.find(g=>!g.on&&this.nearby(p,g,58))}
 update(p,dt,interact,onCheckpoint,onBurst){this.tickMessage(dt);if(p.ground)this.chain=0;for(const s of this.sources)if(s.drained&&s.recharge){s.cooldown=(s.cooldown??s.recharge)-dt;if(s.cooldown<=0){s.drained=false;s.cooldown=undefined}}
  for(const s of this.sources)if(!s.drained&&(p.charges===undefined?!p.charge:p.charges<(p.capacity||1))&&this.nearby(p,s,s.type==='node'?29:32)){
   s.drained=true;s.cooldown=s.recharge;if(p.charges!==undefined)p.charges++;p.charge=true;this.absorbed++;if(!p.ground){this.chain++;this.bestChain=Math.max(this.bestChain,this.chain)}onBurst(s.x,s.y,18);this.say(s.type==='node'?'MID AIR RECHARGE · Release Shift, then dash again.':'CHARGE ABSORBED · This source is now dark.',{priority:0});
  }
  if(!interact)return;const target=this.target(p);if(!target)return;if(window.Combat2D?.blockPower(target))return;if(!p.charge){this.say('NO CHARGE · Find a cyan source, then return.');return}
  if(p.charges!==undefined)p.charges=Math.max(0,p.charges-1);p.charge=(p.charges||0)>0;onBurst(target.x,target.y,28);
  if('open'in target){target.open=true;target.openedAt=time;target.onOpen?.(target);this.say('DOOR POWERED · Your charge opened the route.',{priority:2,duration:5})}else{target.on=true;onCheckpoint(target.checkpoint);this.say(target.checkpoint===4?'RELAY RESTORED':target.checkpoint===1?'GENERATOR ONLINE · Two slots unlocked. Store two charges, then T / teleport to blink farther.':'GENERATOR ONLINE · Checkpoint saved. Nearby windows restored.',{priority:2,duration:target.checkpoint===1?7:5})}
 }
 hint(p){if(this.messageTime>0&&this.messagePriority>=2)return this.message;if(p.x>2870&&this.generators[3]?.on&&this.generators.some(g=>!g.on))return 'Relay powered · Restore the remaining generators to finish';const target=this.target(p);if(target)return p.charge?('open'in target?'E · Spend charge to open door':'E · Spend charge to power generator'):'Empty · Absorb electricity from a cyan source';if(this.messageTime>0)return this.message;return p.hang?'Space to climb · ↓ to drop':!p.charge?'Find a cyan source · R retries and restores drained sources':''}
 draw(ctx,rect,time){for(const s of this.sources){if(window.WorldArt){s.type==='node'?WorldArt.node(ctx,s,time):WorldArt.cabinet(ctx,s,time);continue}const col=s.drained?'#405064':'#6affe1';if(s.type==='node'){
    rect(s.x-14,s.y-1,28,2,s.drained?'#28384b':'#286575');rect(s.x-1,s.y-14,2,28,s.drained?'#28384b':'#286575');rect(s.x-7,s.y-7,14,14,col);rect(s.x-3,s.y-3,6,6,s.drained?'#172333':'#effff0');
   }else{rect(s.x-12,s.y-3,24,33,'#111b29');rect(s.x-10,s.y-1,20,29,'#40536a');rect(s.x-7,s.y+2,14,8,col);rect(s.x-4,s.y+15,8,9,'#192636');rect(s.x-1,s.y+16,2,6,col)}
   if(!s.drained){ctx.globalAlpha=.15+Math.sin(time*5)*.05;rect(s.x-18,s.y-12,36,36,'#6affe1');ctx.globalAlpha=1}
  }
  for(const door of this.doors)(door.draw??drawPowerGate)(door,rect,ctx,time);
  for(const g of this.generators){if(window.WorldArt){WorldArt.generator(ctx,g,time);continue}rect(g.x-19,g.y-42,38,42,'#111b29');rect(g.x-16,g.y-39,32,36,'#3d5065');rect(g.x-11,g.y-34,22,13,g.on?'#6affe1':'#996b43');rect(g.x-9,g.y-16,18,3,'#192636');rect(g.x-9,g.y-9,18,3,'#192636');if(g.on){ctx.fillStyle='#88f6dc';ctx.font='9px monospace';ctx.fillText('ONLINE',g.x-17,g.y-49)}}
 }
}
window.PowerGrid=PowerGrid;

  function drawPowerGate(door, fill, context, tick, tunnel=false) {
    const {x,y,w,h,open} = door;
    const floor = y+h;
    const indicator = open ? '#8cf8df' : '#ffc77f';
    const travel = open ? Math.min(1,Math.max(0,(tick-(door.openedAt ?? -1))/.22)) : 0;
    const offset = Math.round(w*travel);

    // The leaf slides along a bronze track into the receiving pier.
    fill(x-3,floor-3,w+8,3,'#51423d');
    fill(x,floor-3,w,1,'#b29a71');
    if (offset<w) {
      context.save();
      context.beginPath();
      context.rect(x,y,w,h);
      context.clip();
      const leaf=x+offset;
      if(tunnel){
        fill(leaf,y+5,w,h-10,'#2c4953');
        fill(leaf+3,y+8,w-6,h-17,'#395863');
        for(let seam=y+12;seam<floor-8;seam+=13) {
          fill(leaf+4,seam,w-8,2,'#253d48');
          fill(leaf+5,seam+2,w-10,1,'#6f7e78');
        }
      }
      fill(leaf,y+10,w,5,'#27343c');
      fill(leaf,y+10,w,1,'#7c8279');
      fill(leaf,floor-14,w,7,'#23333e');
      fill(leaf,floor-13,w,1,'#78817c');
      for(let bar=leaf+3;bar<leaf+w;bar+=7) {
        fill(bar,y+5,3,h-19,'#22313c');
        fill(bar,y+5,1,h-19,'#818781');
        fill(bar+1,y+2,1,4,'#9a8b76');
        fill(bar+1,y+12,1,1,'#c7aa80');
      }
      for(const wheel of [leaf+5,leaf+w-10]) {
        fill(wheel,floor-10,7,7,'#4a423e');
        fill(wheel+1,floor-9,5,5,'#997f59');
        fill(wheel+2,floor-8,3,3,'#26343d');
      }
      context.restore();
    }

    for(const pier of [x-15,x+w]) {
      fill(pier,y+10,15,h-10,'#8b796c');
      fill(pier+1,y+11,11,h-12,'#ae9780');
      fill(pier+12,y+12,2,h-13,'#6f645e');
      for(let joint=y+24;joint<floor-5;joint+=13) {
        fill(pier+1,joint,13,1,'#766b62');
        fill(pier+2,joint+1,9,1,'#c2aa90');
      }
      fill(pier-2,y+7,19,5,'#c5ac8d');
      fill(pier-1,y+7,17,1,'#e6c7a2');
      fill(pier-1,floor-7,17,7,'#9a8370');
    }

    const motor=x+w+13;
    fill(motor,floor-17,13,17,'#263741');
    fill(motor+1,floor-16,11,2,'#828176');
    for(let vent=floor-12;vent<floor-2;vent+=3)fill(motor+3,vent,7,1,'#64726d');
    fill(x+w+6,floor-61,7,10,'#343942');
    fill(x+w+8,floor-59,3,5,indicator);
    fill(x+w+9,floor-51,1,34,'#534c43');
    if (open) return;

    context.fillStyle = '#ffda9d';
    context.font = '9px monospace';
    context.textAlign = 'center';
    context.fillText(door.remote?'REMOTE GRILLE':'POWER GRILLE',x+w/2,y-8);
    context.textAlign = 'start';
  }
