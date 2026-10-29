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
  this.message='Find the cyan power cabinet. Touch it to absorb a charge.';this.messageTime=6;this.absorbed=0;this.chain=0;this.bestChain=0;
 }
 respawn(){for(const source of this.sources)source.drained=false;this.chain=0}
 say(text){this.message=text;this.messageTime=3.5}
 nearby(p,o,r=48){return Math.hypot(p.x+9-o.x,p.y+17-(o.y-(o.checkpoint?22:0)))<r}
 target(p){return this.doors.find(d=>!d.open&&Math.abs(p.x+9-(d.x+12))<65&&p.y+p.h>d.y&&p.y<d.y+d.h)||this.generators.find(g=>!g.on&&this.nearby(p,g,58))}
 update(p,dt,interact,onCheckpoint,onBurst){this.messageTime=Math.max(0,this.messageTime-dt);if(p.ground)this.chain=0;
  for(const s of this.sources)if(!s.drained&&(p.charges===undefined?!p.charge:p.charges<(p.capacity||1))&&this.nearby(p,s,s.type==='node'?29:32)){
   s.drained=true;if(p.charges!==undefined)p.charges++;p.charge=true;this.absorbed++;if(!p.ground){this.chain++;this.bestChain=Math.max(this.bestChain,this.chain)}onBurst(s.x,s.y,18);this.say(s.type==='node'?'MID AIR RECHARGE · Release Shift, then dash again.':'CHARGE ABSORBED · This source is now dark.');
  }
  if(!interact)return;const target=this.target(p);if(!target)return;if(!p.charge){this.say('NO CHARGE · Find a cyan source, then return.');return}
  if(p.charges!==undefined)p.charges=Math.max(0,p.charges-1);p.charge=(p.charges||0)>0;onBurst(target.x,target.y,28);
  if('open'in target){target.open=true;this.say('DOOR POWERED · Your charge opened the route.')}else{target.on=true;onCheckpoint(target.checkpoint);this.say(target.checkpoint===4?'RELAY RESTORED':target.checkpoint===1?'GENERATOR ONLINE · Two slots unlocked. Store two charges, then T / teleport to blink farther.':'GENERATOR ONLINE · Checkpoint saved. Nearby windows restored.')}
 }
 hint(p){if(p.x>2870&&this.generators[3].on&&this.generators.some(g=>!g.on))return 'Relay powered · Restore the remaining generators to finish';const target=this.target(p);if(target)return p.charge?('open'in target?'E · Spend charge to open door':'E · Spend charge to power generator'):'Empty · Absorb electricity from a cyan source';if(this.messageTime>0)return this.message;return p.hang?'Space to climb · ↓ to drop':!p.charge?'Find a cyan source · R retries and restores drained sources':''}
 draw(ctx,rect,time){for(const s of this.sources){const col=s.drained?'#405064':'#6affe1';if(s.type==='node'){
    rect(s.x-14,s.y-1,28,2,s.drained?'#28384b':'#286575');rect(s.x-1,s.y-14,2,28,s.drained?'#28384b':'#286575');rect(s.x-7,s.y-7,14,14,col);rect(s.x-3,s.y-3,6,6,s.drained?'#172333':'#effff0');
   }else{rect(s.x-12,s.y-3,24,33,'#111b29');rect(s.x-10,s.y-1,20,29,'#40536a');rect(s.x-7,s.y+2,14,8,col);rect(s.x-4,s.y+15,8,9,'#192636');rect(s.x-1,s.y+16,2,6,col)}
   if(!s.drained){ctx.globalAlpha=.15+Math.sin(time*5)*.05;rect(s.x-18,s.y-12,36,36,'#6affe1');ctx.globalAlpha=1}
  }
  for(const d of this.doors){rect(d.x-4,d.y-5,d.w+8,5,'#52677e');rect(d.x-4,d.y,4,d.h,'#52677e');rect(d.x+d.w,d.y,4,d.h,'#52677e');if(!d.open){rect(d.x,d.y,d.w,d.h,'#784b3e');for(let y=d.y+8;y<d.y+d.h;y+=15)rect(d.x+3,y,d.w-6,3,'#c18c58')}rect(d.x+7,d.y+5,10,7,d.open?'#6affe1':'#ebad6b')}
  for(const g of this.generators){rect(g.x-19,g.y-42,38,42,'#111b29');rect(g.x-16,g.y-39,32,36,'#3d5065');rect(g.x-11,g.y-34,22,13,g.on?'#6affe1':'#996b43');rect(g.x-9,g.y-16,18,3,'#192636');rect(g.x-9,g.y-9,18,3,'#192636');if(g.on){ctx.fillStyle='#88f6dc';ctx.font='9px monospace';ctx.fillText('ONLINE',g.x-17,g.y-49)}}
 }
}
window.PowerGrid=PowerGrid;
