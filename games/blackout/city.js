/* Painted backdrop + crisp foreground pixels. Gameplay surfaces stay unobscured. */
(() => {
const image=new Image();image.src='assets/blackout-city.png';
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const noise=n=>{const x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x)};
const r=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)};
const line=(c,x,y,x2,y2,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke()};
function glow(c,x,y,radius,color){const g=c.createRadialGradient(x,y,0,x,y,radius);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-radius,y-radius,radius*2,radius*2)}
window.CityScene={setReducedMotion(value){reduced=value||matchMedia('(prefers-reduced-motion: reduce)').matches},
 background(c,W,H,cam,t){const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#121a31');sky.addColorStop(.7,'#24364b');sky.addColorStop(1,'#0b1424');c.fillStyle=sky;c.fillRect(0,0,W,H);
  if(image.complete&&image.naturalWidth){const ih=Math.max(H,530),iw=ih*image.naturalWidth/image.naturalHeight;c.globalAlpha=.85;const off=-(cam*.16)%iw;c.drawImage(image,off,H-ih,iw,ih);if(off+iw<W)c.drawImage(image,off+iw,H-ih,iw,ih);c.globalAlpha=1}
  else for(let i=0;i<45;i++){const x=i*87-cam*.16,y=90+noise(i)*210;r(c,x,y,65,H,'#17263c');for(let a=0;a<4;a++)for(let b=0;b<10;b++)if(noise(i*60+a*11+b)>.8)r(c,x+8+a*13,y+12+b*21,3,5,'#9d7956')}
  // Elevated railway, overhead electrical line, distant signal lamps.
  const ty=H-230;for(let i=0;i<16;i++){const x=i*175-cam*.35; r(c,x,ty,3,250,'#111d2d');line(c,x,ty,x+175,ty,'#304154',4);line(c,x,ty+15,x+175,ty+15,'#152338',3);line(c,x,ty+15,x+175,ty+60,'#1d2d40');if(i%3===0)r(c,x+2,ty-12,3,4,'#c98e64')}
 },
 rooftops(c,platforms,grid,t){for(let i=0;i<platforms.length;i++){const b=platforms[i],powered=grid.generators.some(g=>g.on&&Math.abs(g.x-(b.x+b.w/2))<450);
   const facade=i%2?'#253041':'#2c303e';r(c,b.x,b.y+10,b.w,b.h,facade);
   for(let yy=b.y+17;yy<b.y+b.h;yy+=12){r(c,b.x,yy,b.w,1,'#182334');for(let xx=b.x+(Math.floor(yy/12)%2)*15;xx<b.x+b.w;xx+=30)r(c,xx,yy-11,1,11,'#192537')}
   for(let yy=b.y+46;yy<b.y+b.h;yy+=70)for(let xx=b.x+20;xx<b.x+b.w-23;xx+=48){r(c,xx-3,yy-3,25,36,'#141d2c');r(c,xx,yy,19,28,powered?'#b17c51':noise(xx+yy)>.84?'#735b48':'#1b2a3a');r(c,xx+9,yy,2,28,'#182435');r(c,xx,yy+13,19,2,'#182435');r(c,xx-4,yy+29,27,3,'#465061')}
   r(c,b.x,b.y,b.w,5,'#778c9d');r(c,b.x,b.y+5,b.w,5,'#3c5365');r(c,b.x,b.y+10,b.w,2,'#111d2b');
   for(let j=0;j<Math.floor(b.w/45);j++){const px=b.x+12+j*43;r(c,px,b.y+2,18+noise(j+i)*17,1,powered?'#d7a675':'#9ebbc5');if(j%2===0)r(c,px,b.y+1,10,1,'#bad7da')}
   // Pipework and a fire escape below the playable edge.
   if(b.w>150){r(c,b.x+b.w-18,b.y+15,3,b.h,'#526072');r(c,b.x+b.w-20,b.y+32,7,3,'#75808a');for(let y=b.y+80;y<b.y+b.h;y+=70){r(c,b.x+38,y,55,3,'#111b29');r(c,b.x+38,y-22,2,22,'#536071');r(c,b.x+91,y-22,2,22,'#536071');line(c,b.x+39,y,b.x+91,y+60,'#3e4c60',2)}}
   if(powered)glow(c,b.x+b.w/2,b.y+100,110,'#dfa35515');
  }
  // Subway platform: tiled entrance, stranded train, amber emergency lighting.
  r(c,0,325,185,95,'#101d2a');r(c,0,320,185,6,'#3f5260');for(let x=0;x<185;x+=20){r(c,x,328,1,80,'#2c4050');r(c,x,370,185-x,1,'#2c4050')}
  r(c,5,338,152,57,'#3d4a5b');r(c,5,338,152,3,'#6c7c89');r(c,5,380,152,4,'#99684d');for(let x=16;x<145;x+=35){r(c,x,347,25,24,'#101b2b');r(c,x+2,349,19,2,'#718694')}r(c,167,350,6,7,'#efb877');glow(c,170,353,65,'#efaa6330');r(c,0,416,185,3,'#d2a46b');
  // Rooftop water tower, antenna, washing line, ducts.
  for(const [x,y]of [[550,385],[1390,320],[2040,270]]){r(c,x,y-32,42,31,'#182335');r(c,x-3,y-35,48,4,'#586879');for(let n=0;n<5;n++)r(c,x+7+n*6,y-26,2,17,'#40546a');r(c,x+4,y-2,33,2,'#7a8d9a')}
  r(c,2710,170,7,130,'#182536');r(c,2760,170,7,130,'#182536');r(c,2700,120,78,56,'#243246');r(c,2696,119,86,5,'#526176');r(c,2703,111,73,8,'#344457');for(let i=0;i<8;i++)r(c,2705+i*9,125,2,48,'#172536');line(c,2713,180,2760,291,'#405165',3);line(c,2760,180,2713,291,'#405165',3);
  line(c,900,280,970,300,'#536276');for(let i=0;i<3;i++)r(c,918+i*14,286+i*4,9,14,i===1?'#8b6f63':'#3d5064');
  // Destination: relay mast and its already-lit distant building.
  for(let y=62;y<299;y+=30){line(c,2930,y,2960,y+30,'#44556a',2);line(c,2960,y,2930,y+30,'#44556a',2)}r(c,2928,50,4,250,'#71808e');r(c,2958,50,4,250,'#71808e');r(c,2925,48,40,4,'#8597a7');r(c,2942,22,4,26,'#95acba');r(c,2941,20,6,5,Math.sin(t*3)>0?'#f1a080':'#673e42');
  for(const g of grid.generators)if(g.on)glow(c,g.x,g.y-22,95,'#61ffdf25');
 },
 foreground(c,W,H,cam,t,cy,p,grid){
  // Charge spill and its reflection track the player, rather than obscuring her.
  const x=p.x-cam+9,y=p.y+cy+17;if(p.charge){glow(c,x,y,42,'#63f5e72a');r(c,x-10,p.y+cy+36,26,1,'#6bffe4')}
  for(let i=0;i<(reduced?25:100);i++){const rx=((noise(i+3)*W*2-(reduced?0:t*78))%W+W)%W,ry=((noise(i+201)*H+(reduced?0:t*(160+noise(i)*120)))%H+H)%H;line(c,rx,ry,rx-3,ry+10,'#7ba4c52b')}
  const v=c.createLinearGradient(0,0,0,H);v.addColorStop(0,'#050a1744');v.addColorStop(.25,'transparent');v.addColorStop(.85,'transparent');v.addColorStop(1,'#030b1733');c.fillStyle=v;c.fillRect(0,0,W,H);
 },
 district(x){return x<470?'LOWER LINE / SUBWAY EXIT':x<1350?'COPPER ROW / ROOFTOPS':x<2340?'THE SPAN / POWER LINES':'RELAY NINE / LAST DELIVERY'},
 story(x,grid){if(x<200)return 'Dispatch went quiet at 02:13. Your delivery is still due at Relay Nine.';if(x>2840)return grid.generators.every(g=>g.on)?'The block is awake. The package is still warm.':'The relay needs every block online. Restore all four generators.';if(x>1300&&x<1520)return 'Across the span, one building still has its lights on.';return ''}
};
})();
