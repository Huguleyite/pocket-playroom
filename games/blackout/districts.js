/* District identity and authored recharge arcs. Decorations never add collision. */
window.Districts={
 themes:[null,
  {label:'PUMPS ONLINE',ink:'#629a96',light:'#dfbc80',tip:'Market vents: wait for COOL, then jump across the steam.'},
  {label:'SPAN STABILIZED',ink:'#738cae',light:'#b9e5ed',tip:'Bridge climb: jump first, then aim Dash upward. Keep two energy for a long blink.'},
  {label:'WARD POWER RESTORED',ink:'#8d758e',light:'#f1d8a4',tip:'Hospital approach: alternate safe roofs and cooled vents. The battery stays with you.'},
  {label:'TRACK SIGNALS ONLINE',ink:'#739a8b',light:'#bbefb6',tip:'Yard recharge arc: jump, dash through cyan, release Dash, then burst again.'},
  {label:'FURNACE PRESSURE SAFE',ink:'#aa7864',light:'#ffc187',tip:'Foundry climb: use upward Dash from the roof edge; let amber vents cool before landing.'},
  {label:'RIVER SIGNAL RESTORED',ink:'#588b9a',light:'#9ae6ed',tip:'Service trenches: fill both energy slots before leaving. Blink across from the edge.'},
  {label:'CITY GRID RESTORED',ink:'#9d899c',light:'#ffe1a0',tip:'Final circuit: chain the recharge nodes, then save energy for the receiver and core.'}],
 apply(){const i=Campaign.index;if(!i)return;
  // Keep a pair of recoverable charges on every real roof. Move them to visible
  // takeoff/landing pockets, away from live hazards and the receiver footprint.
  grid.sources=platforms.flatMap(b=>[.18,.82].map(f=>{
   let x=b.x+b.w*f;for(const h of Campaign.level.hazards)if(Math.abs(x-(h.x+h.w/2))<h.w/2+36)x=h.x-42;
   x=Math.max(b.x+20,Math.min(b.x+b.w-20,x));
   const r=Campaign.level.shieldReceiver;if(r&&Math.abs(x-r.x)<62)x=b.x+24;
   return {x,y:b.y-30,type:'cabinet',drained:false,recharge:3};
  }));
  // Nodes offer a moving alternative to waiting; original mandatory roofs stay.
  const arcs={1:[4,6],2:[3,6],3:[3,6],4:[4,7,9],5:[4,7],6:[3,6,9],7:[4,7,9]};
  for(const n of arcs[i]){const a=platforms[n],b=platforms[n+1];if(!a||!b)continue;
   const gap=b.x-(a.x+a.w);if(gap<35||gap>270)continue;
   grid.sources.push({x:a.x+a.w+gap*.48,y:Math.min(a.y,b.y)-55,type:'node',drained:false});
  }
 },
 hint(){if(!Campaign.index||ChapterAbilities.boss||ChapterAbilities.defeated)return null;return this.themes[Campaign.index].tip},
 draw(){const i=Campaign.index,t=this.themes[i];if(!t)return;ctx.save();
  for(const b of platforms){const nearest=grid.generators.findIndex(g=>g.x>=b.x),on=grid.generators[nearest<0?3:nearest]?.on,c=on?t.light:'#304654';
   // Fixtures sit on the facade, below the collidable rim.
   if(i===1){rect(b.x+12,b.y+46,b.w-24,7,t.ink);for(let x=b.x+26;x<b.x+b.w-24;x+=60){rect(x,b.y+54,36,32,'#18313c');rect(x+3,b.y+57,30,on?22:3,c)}}
   if(i===2){for(let x=b.x+15;x<b.x+b.w-10;x+=55){rect(x,b.y+18,4,80,t.ink);rect(x,b.y+72,40,3,c)}}
   if(i===3){rect(b.x+16,b.y+52,b.w-32,4,c)}
   if(i===4){rect(b.x+12,b.y+24,b.w-24,5,t.ink);for(let x=b.x+25;x<b.x+b.w-20;x+=65){rect(x,b.y+30,6,45,'#40515b');rect(x-6,b.y+36,18,20,'#152a34');rect(x-2,b.y+40,10,5,c);rect(x-2,b.y+49,10,4,on?'#264c39':'#9b6555')}}
   if(i===5){rect(b.x+12,b.y+55,b.w-24,18,'#251f2c');for(let x=b.x+24;x<b.x+b.w-20;x+=45){rect(x,b.y+58,22,11,c);rect(x,b.y+80,6,65,t.ink)}rect(b.x+10,b.y+150,b.w-20,9,t.ink)}
   if(i===6){rect(b.x+12,b.y+90,b.w-24,11,t.ink);for(let x=b.x+25;x<b.x+b.w-20;x+=60){rect(x,b.y+30,32,28,'#142b38');rect(x+4,b.y+35,24,4,c);rect(x+4,b.y+46,on?24:6,3,c)}rect(b.x,b.y+170,b.w,14,'#1c4b59')}
   if(i===7){for(let x=b.x+20;x<b.x+b.w-30;x+=65){rect(x,b.y+35,35,65,'#21303f');for(let k=0;k<4;k++)rect(x+4,b.y+43+k*12,27,4,t.ink);rect(x+13,b.y+26,9,9,c)}}
  }
  for(const g of grid.generators){rect(g.x-48,g.y+38,96,25,'#132532');ctx.fillStyle=g.on?t.light:t.ink;ctx.font='9px monospace';ctx.fillText(g.on?'DISTRICT ONLINE':'FEEDER '+g.checkpoint,g.x-40,g.y+54);
   if(g.on){ctx.strokeStyle=t.light;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(g.x,g.y+65);ctx.lineTo(Math.min(Campaign.width,g.x+170),g.y+65);ctx.stroke()}}
  // Moving local machinery is subtle and remains below the playable roofs.
  if(i===4){const x=(time*65)%(Campaign.width+240)-240;rect(x,515,220,35,'#223c45');for(let n=0;n<5;n++)rect(x+12+n*42,522,25,12,t.light)}
  if(i===5)for(const b of platforms){const x=b.x+40;rect(x,b.y+110,28,28,'#1c2e39');ctx.strokeStyle=t.ink;ctx.beginPath();ctx.arc(x+14,b.y+124,11,0,Math.PI*2);ctx.stroke();for(let n=0;n<3;n++){const a=time+n*Math.PI*2/3;ctx.beginPath();ctx.moveTo(x+14,b.y+124);ctx.lineTo(x+14+Math.cos(a)*10,b.y+124+Math.sin(a)*10);ctx.stroke()}}
  ctx.restore();
 }
};
