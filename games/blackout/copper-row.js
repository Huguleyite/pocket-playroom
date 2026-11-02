/* Copper Row recharge practice and neighborhood restoration. */
window.CopperRow={
 apply(){
  // Preserve the original mandatory route, generators, fuse and save coordinates.
  grid.sources.forEach(s=>{if(s.type==='cabinet')s.recharge=4});
  grid.sources.push({x:580,y:320,type:'node',drained:false,practice:true});
 },
 hint(){if(Campaign.index!==0||ChapterAbilities.boss||ChapterAbilities.defeated)return null;
  if(p.x>490&&p.x<650)return 'Safe recharge practice: jump through the cyan node above this roof.';
  if(p.x>=1390&&p.x<1730)return 'Jump + Dash through the cyan nodes. Release Dash between bursts; each node restores 1 energy.';
  return null;
 },
 draw(){if(Campaign.index!==0)return;ctx.save();
  ctx.fillStyle='#93c4cb';ctx.font='10px monospace';ctx.fillText('RECHARGE PRACTICE',503,284);
  // A thin suspended power cable links the main recharge arc without implying a floor.
  ctx.strokeStyle='#547181';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(1520,245);ctx.quadraticCurveTo(1630,270,1755,245);ctx.stroke();
  // Distinct devices awaken with each feeder; all are below or behind collision surfaces.
  const g=grid.generators;
  rect(1000,459,162,31,'#101c29');rect(1000,459,162,2,'#557180');ctx.fillStyle=g[0].on?'#f3c18c':'#4c6470';ctx.font='15px monospace';ctx.fillText('COPPER ROW',1011,480);
  rect(1160,445,34,34,'#172a36');ctx.strokeStyle=g[0].on?'#a9d5c4':'#3a535d';ctx.lineWidth=3;ctx.beginPath();ctx.arc(1177,462,12,0,Math.PI*2);ctx.stroke();for(let i=0;i<4;i++){const a=i*Math.PI/2+(g[0].on?time*2:0);ctx.beginPath();ctx.moveTo(1177,462);ctx.lineTo(1177+Math.cos(a)*10,462+Math.sin(a)*10);ctx.stroke()}
  for(const x of [1770,1840,1910]){rect(x,365,24,18,'#152b37');rect(x+3,368,18,12,g[1].on?'#e7b67d':'#2b4653')}
  rect(2380,399,100,25,'#11232e');ctx.fillStyle=g[2].on?'#a7f0ca':'#49626e';ctx.font='11px monospace';ctx.fillText(g[2].on?'RELAY →':'SIGNAL LOST',2388,416);
  if(g[3].on){ctx.fillStyle='#d9bd8c';ctx.font='11px monospace';ctx.fillText('THE BLOCK IS AWAKE',2735,370)}
  ctx.restore();
 }
};
