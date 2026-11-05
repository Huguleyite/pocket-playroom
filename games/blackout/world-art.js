/* Station Square's stone/copper/cyan art direction, on the original collision geometry. */
(() => {
 const names=['copper-row','floodline-market','glasswire-span','mercy-relay','switchyard','ashglass-foundry','signal-depths','dawn-exchange'];
 const themes=[
  {stone:'#655e62',light:'#b7a48b',shade:'#393e4c',copper:'#92705b',glass:'#263b4a',sky:'#17253f',warm:'#e7ad6e'},
  {stone:'#536a6b',light:'#a8aaa0',shade:'#2d454f',copper:'#8f7a60',glass:'#193f4a',sky:'#133444',warm:'#e5b77b'},
  {stone:'#596174',light:'#abb2bd',shade:'#303e54',copper:'#8a7c73',glass:'#283f5a',sky:'#29324e',warm:'#dcbf96'},
  {stone:'#77717c',light:'#c5b7a3',shade:'#3c4354',copper:'#a1836c',glass:'#2c3c50',sky:'#252541',warm:'#f0c38b'},
  {stone:'#5e626a',light:'#b4ad9a',shade:'#343e4b',copper:'#8a7160',glass:'#2c414a',sky:'#30384d',warm:'#e4b782'},
  {stone:'#71504c',light:'#b49883',shade:'#3b3442',copper:'#ad7854',glass:'#422e3b',sky:'#30273f',warm:'#f6a363'},
  {stone:'#53616b',light:'#a2aaa3',shade:'#293d49',copper:'#96765d',glass:'#193b48',sky:'#152d3b',warm:'#e5b982'},
  {stone:'#8c7d79',light:'#e0c7a0',shade:'#4e4b5d',copper:'#b58860',glass:'#4c5267',sky:'#74637d',warm:'#ffd19a'}
 ];
 const plates=names.map(name=>{const image=new Image();image.decoding='async';return {image,name,requested:false}}),cache=new Map();
 const cabinetSprite=new Image();cabinetSprite.decoding='async';cabinetSprite.src='assets/art-refresh/power-cabinet.webp';
 const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const noise=n=>{const x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
 const line=(c,x,y,x2,y2,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke()};
 function glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
 function request(i){const plate=plates[i];if(plate&&!plate.requested){plate.requested=true;plate.image.src='assets/art-refresh/'+plate.name+'.webp'}return plate?.image}
 function windowArch(c,x,y,w,h,t,powered){
  const rad=w/2;rect(c,x-4,y-2,w+8,h+8,t.shade);rect(c,x-3,y-3,w+6,4,t.light);rect(c,x-3,y,w+6,h+4,t.copper);rect(c,x,y+rad,w,h-rad,t.glass);
  c.fillStyle=t.glass;c.beginPath();c.arc(x+rad,y+rad,rad,Math.PI,0);c.fill();
  const glass=powered?t.warm:t.glass;rect(c,x+2,y+rad,w-4,h-rad-2,glass);c.fillStyle=glass;c.beginPath();c.arc(x+rad,y+rad,rad-2,Math.PI,0);c.fill();
  rect(c,x+rad-1,y+2,2,h-2,'#273844');rect(c,x+1,y+h*.57,w-2,2,'#273844');rect(c,x-5,y+h+3,w+10,3,t.light);rect(c,x-3,y+h+6,w+6,3,t.shade);
  if(powered){rect(c,x+3,y+rad+2,3,Math.max(2,h-rad-8),'#ffe4ac');rect(c,x+w-6,y+rad+3,2,h-rad-8,t.copper)}
 }
 function facade(width,height,i,powered,variant){
  const key=[width,height,i,powered,variant].join(':');if(cache.has(key))return cache.get(key);
  const c=document.createElement('canvas');c.width=width;c.height=height;const g=c.getContext('2d'),t=themes[i];g.imageSmoothingEnabled=false;
  const fill=g.createLinearGradient(0,0,0,height);fill.addColorStop(0,t.stone);fill.addColorStop(1,t.shade);g.fillStyle=fill;g.fillRect(0,0,width,height);
  // Staggered masonry with restrained edge highlights and individual weathering.
  for(let y=18;y<height;y+=15){rect(g,0,y,width,1,t.shade);for(let x=-(y/15%2)*21;x<width;x+=42){rect(g,x,y-14,1,14,t.shade);if(noise(x+y+variant)>.5)rect(g,x+3,y-12,25,1,t.light);if(noise(x*2+y)>.65)rect(g,x+4,y-4,9,1,t.copper)}}
  for(let y=39;y<height-18;y+=89){rect(g,6,y+64,width-12,3,t.copper);rect(g,5,y+67,width-10,2,t.shade);for(let x=18;x+29<width-9;x+=58)windowArch(g,x,y,27,48,t,powered&&noise(x+y+variant)>.22)}
  // Pilasters and stone cornice ground the lit edge in actual architecture.
  for(const x of [0,width-10]){rect(g,x,15,10,height-15,t.shade);rect(g,x+1,16,7,height-16,t.stone);rect(g,x+1,18,2,height-18,t.light);for(let y=28;y<height;y+=30)rect(g,x,y,10,2,t.shade)}
  rect(g,0,0,width,3,'#d5d1bb');rect(g,0,3,width,4,t.light);rect(g,0,7,width,3,t.copper);rect(g,0,10,width,4,t.shade);rect(g,3,14,width-6,2,t.light);
  for(let x=3;x<width-2;x+=32){rect(g,x,0,1,7,t.shade);rect(g,x+2,1,Math.min(27,width-x-2),1,'#efe0bc')}
  for(let x=28;x<width-22;x+=77){rect(g,x,0,24,2,'#84c1bf');rect(g,x+4,1,14,1,'#b5e2d5');if(powered)rect(g,x+5,8,12,2,'#84decb')}
  if(width>130){const x=width-20;rect(g,x,20,4,height-20,t.shade);rect(g,x,20,1,height-20,t.copper);for(let y=46;y<height;y+=66)rect(g,x-2,y,8,3,t.light)}
  cache.set(key,c);return c;
 }
 const oldBackground=CityScene.background;
 window.WorldArt={names,themes,plates,cache,request,cabinetSprite,
  background(c,W,H,cam,t){const i=window.Campaign?.index||0,image=request(i);if(!image?.complete||!image.naturalWidth){oldBackground(c,W,H,cam,t);return}
   // A single continuous plate pans only within its bounds: never a visible tile seam.
   const ratio=Math.max(H/image.naturalHeight,W/image.naturalWidth),dw=image.naturalWidth*ratio,dh=image.naturalHeight*ratio,overflow=Math.max(0,dw-W),progress=Math.max(0,Math.min(1,cam/Math.max(1,(window.Campaign?.width||3110)-W))),x=-overflow*progress;
   c.imageSmoothingEnabled=false;c.drawImage(image,Math.round(x),Math.round(H-dh),Math.ceil(dw),Math.ceil(dh));
   // The plate remains visible; a gentle value separation keeps the courier legible.
   c.fillStyle=i===7?'#1420340a':'#0a17232c';c.fillRect(0,0,W,H);
   const v=c.createLinearGradient(0,H*.45,0,H);v.addColorStop(0,'transparent');v.addColorStop(1,'#0a15203d');c.fillStyle=v;c.fillRect(0,0,W,H);
  },
  rooftops(c,platforms,grid,t,cam=-Infinity,W=Infinity){const i=window.Campaign?.index||0;for(let n=0;n<platforms.length;n++){
   const b=platforms[n];if(b.x+b.w<cam-65||b.x>cam+W+65)continue;const powered=grid.generators.some(g=>g.on&&Math.abs(g.x-(b.x+b.w/2))<450);
   c.drawImage(facade(Math.ceil(b.w),Math.ceil(b.h),i,powered,n%3),b.x,b.y);
   // Broken highlights read as a wet surface rather than another platform.
   for(let x=b.x+24;x<b.x+b.w-20;x+=89){rect(c,x,b.y-1,19,1,'#a0c7ce');rect(c,x+4,b.y+2,11,1,powered?'#e4bd87':'#728e9b')}
  }},
  cabinet(c,s,t){const x=s.x,y=s.y+30,lit=!s.drained,cyan=lit?'#80fff0':'#456a72';
   if(cabinetSprite.complete&&cabinetSprite.naturalWidth){c.save();c.imageSmoothingEnabled=false;c.filter=lit?'none':'grayscale(1) brightness(.48)';c.drawImage(cabinetSprite,93,129,838,1304,x-16,y-49,32,49);c.restore();if(lit){glow(c,x,y-35,18,'#6dffe21a');rect(c,x-10,y+1,20,1,'#65c5bf')}else if(s.recharge){c.fillStyle='#d6e2de';c.font='7px monospace';c.textAlign='center';c.fillText(Math.max(1,Math.ceil(s.cooldown??s.recharge))+'s',x,y-23);c.textAlign='start'}return}
   // Full-height cabinet, grounded exactly on the same roof as its old sprite.
   rect(c,x-17,y-43,34,43,'#182b39');rect(c,x-18,y-45,36,4,'#9caaad');rect(c,x-18,y-46,36,1,'#d0c6ab');rect(c,x-15,y-40,30,39,'#425663');rect(c,x-13,y-38,26,36,'#314652');
   rect(c,x-12,y-39,1,36,'#84928e');rect(c,x+12,y-39,2,37,'#172c39');rect(c,x-13,y-41,26,3,cyan);rect(c,x-9,y-33,18,16,'#182e3c');rect(c,x-8,y-32,16,14,lit?'#305c64':'#263b47');
   // Chunky lightning glyph matches the approved Station Square power stations.
   c.fillStyle=cyan;c.beginPath();c.moveTo(x+1,y-31);c.lineTo(x-5,y-24);c.lineTo(x,y-24);c.lineTo(x-2,y-19);c.lineTo(x+6,y-27);c.lineTo(x+1,y-27);c.closePath();c.fill();
   for(let k=0;k<4;k++)rect(c,x-8,y-13+k*2,13,1,'#152c39');rect(c,x+8,y-16,2,7,'#b79a73');rect(c,x-18,y-2,36,2,'#142533');
   for(const dx of [-14,12])for(const dy of [-37,-6])rect(c,x+dx,y+dy,2,2,'#bbad8b');
   if(lit){glow(c,x,y-32,20,'#6dffe21e');rect(c,x-12,y+1,24,1,'#65c5bf')}else if(s.recharge){c.fillStyle='#b6ced0';c.font='7px monospace';c.textAlign='center';c.fillText(Math.max(1,Math.ceil(s.cooldown??s.recharge))+'s',x,y-22);c.textAlign='start'}
  },
  node(c,s,t){const x=s.x,y=s.y,lit=!s.drained,color=lit?'#85ffed':'#426773';
   rect(c,x-10,y-10,20,20,'#172b3a');rect(c,x-9,y-11,18,2,'#afbaa9');rect(c,x-11,y-7,2,14,'#628b91');rect(c,x+9,y-7,2,14,'#628b91');rect(c,x-7,y-7,14,14,color);rect(c,x-5,y-5,10,10,'#294b58');
   line(c,x+2,y-5,x-3,y+1,color,2);line(c,x-3,y+1,x+3,y-1,color,2);line(c,x+3,y-1,x-2,y+5,color,2);
   if(lit)glow(c,x,y,23,'#6effdf26');
  },
  generator(c,g,t){const x=g.x,y=g.y,on=g.on,light=on?'#95ffe6':'#edbc7c';
   if(cabinetSprite.complete&&cabinetSprite.naturalWidth){c.save();c.imageSmoothingEnabled=false;c.filter=on?'none':'sepia(.75) saturate(.6) brightness(.7)';c.drawImage(cabinetSprite,93,129,838,1304,x-21,y-65,42,65);c.restore();rect(c,x-11,y-55,22,2,light);c.fillStyle=on?'#b0ffe9':'#efc595';c.font='8px monospace';c.textAlign='center';c.fillText(on?'ONLINE':'POWER / E',x,y-71);c.textAlign='start';if(on)glow(c,x,y-40,48,'#72ffdb15');return}
   rect(c,x-24,y-53,48,53,'#172b37');rect(c,x-25,y-55,50,4,'#a5a99c');rect(c,x-25,y-56,50,1,'#d2c1a4');rect(c,x-21,y-49,42,47,'#4c5f68');rect(c,x-19,y-47,38,43,'#304752');rect(c,x-19,y-47,2,43,'#7d9695');rect(c,x+17,y-47,2,43,'#182e3c');
   rect(c,x-16,y-48,32,3,light);rect(c,x-13,y-40,26,19,'#132c39');rect(c,x-11,y-38,22,15,on?'#407775':'#665143');
   for(let k=0;k<3;k++)rect(c,x-8+k*6,y-35,4,9,light);
   for(let k=0;k<4;k++)rect(c,x-12,y-16+k*3,18,1,'#172e3a');rect(c,x+10,y-19,3,13,'#b59c77');rect(c,x-26,y-3,52,3,'#122735');for(const dx of [-20,18])for(const dy of [-44,-8])rect(c,x+dx,y+dy,2,2,'#c1b08b');
   if(on){glow(c,x,y-30,55,'#72ffdb1f');c.fillStyle='#b0ffe9';c.font='8px monospace';c.textAlign='center';c.fillText('ONLINE',x,y-62);c.textAlign='start'}else{c.fillStyle='#efc595';c.font='7px monospace';c.textAlign='center';c.fillText('POWER / E',x,y-62);c.textAlign='start'}
  },
  details(){const i=Campaign.index,t=themes[i];ctx.save();for(const b of platforms){const nearest=grid.generators.findIndex(g=>g.x>=b.x),on=grid.generators[nearest<0?3:nearest]?.on,c=on?t.warm:'#53616a';
   // Short, physically supported lamps and fittings are facade decorations.
   if(b.w>150){const x=b.x+12,y=b.y+29;rect(ctx,x,y,3,28,'#1a2e3b');rect(ctx,x-3,y-3,10,3,t.copper);rect(ctx,x-2,y+1,8,11,c);rect(ctx,x-1,y+3,2,7,on?'#ffe1ab':'#6d7372')}
   if(i===1&&b.w>150){rect(ctx,b.x+15,b.y+112,b.w-30,6,t.copper);for(let x=b.x+16;x<b.x+b.w-20;x+=20)rect(ctx,x,b.y+118,18,8,Math.floor(x/20)%2?'#657b73':'#937b60')}
   if(i===2){for(let x=b.x+15;x<b.x+b.w-10;x+=55){rect(ctx,x,b.y+20,3,68,'#374f63');line(ctx,x,b.y+88,Math.min(x+50,b.x+b.w-8),b.y+22,'#6c7a84',2)}}
   if(i===4){rect(ctx,b.x+12,b.y+100,b.w-24,4,'#8d887c');for(let x=b.x+25;x<b.x+b.w-20;x+=70){rect(ctx,x,b.y+107,20,27,'#18303c');rect(ctx,x+6,b.y+112,8,6,on?'#9fe8c9':'#8b6253')}}
   if(i===5){rect(ctx,b.x+12,b.y+112,b.w-24,8,t.copper);for(let x=b.x+25;x<b.x+b.w-20;x+=65){rect(ctx,x,b.y+126,26,30,'#253441');for(let k=0;k<4;k++)rect(ctx,x+4,b.y+130+k*6,18,3,on?'#efa068':'#694c43')}}
   if(i===6){rect(ctx,b.x+12,b.y+110,b.w-24,6,t.copper);rect(ctx,b.x+12,b.y+112,b.w-24,1,'#c2a082')}
   if(i===7){for(let x=b.x+26;x<b.x+b.w-30;x+=75){rect(ctx,x,b.y+114,30,40,'#314553');for(let k=0;k<4;k++)rect(ctx,x+4,b.y+120+k*7,22,3,'#819294');rect(ctx,x+11,b.y+106,8,8,on?'#c3f4d9':'#687e83')}}
  }
  if(i===3){const x=2808,y=369;rect(ctx,x,y,170,36,'#192c39');rect(ctx,x,y,170,3,'#b9ae97');ctx.fillStyle='#dce6ce';ctx.font='11px monospace';ctx.fillText('MERCY HOSPITAL',x+14,y+23);rect(ctx,3005,y,48,55,'#354f59');rect(ctx,3024,y+10,10,34,'#a2e5d6');rect(ctx,3012,y+22,34,10,'#a2e5d6')}
  ctx.restore();},
  hazards(){const l=Campaign.level;for(const h of l.hazards){const state=Campaign.hazard(h),color=state==='safe'?'#7dc9bf':'#f8b97b';rect(ctx,h.x,h.y-5,h.w,5,'#263e48');for(let x=h.x+3;x<h.x+h.w-2;x+=7)rect(ctx,x,h.y-4,4,2,color);if(state!=='safe'){ctx.save();ctx.globalAlpha=state==='warning'?.24:.75;rect(ctx,h.x,h.y-(h.type==='wire'?90:38),h.w,h.type==='wire'?90:38,state==='warning'?'#ffc58d':'#b7fff0');ctx.restore()}ctx.fillStyle=color;ctx.font='8px monospace';ctx.fillText(state==='safe'?'COOL':state==='warning'?'WATCH':'LIVE',h.x,h.y-100)}
   if(l.wind)for(let n=0;n<8;n++)rect(ctx,1260+(time*45+n*40)%460,165+n%3*25,20,1,'#a2b9c9');
  }
 };
 CityScene.background=(...args)=>WorldArt.background(...args);CityScene.rooftops=(...args)=>WorldArt.rooftops(...args);
 // Load the opening immediately. Later plates load on entry; no eight-image startup stall.
 request(0);
})();
