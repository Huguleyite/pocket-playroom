/* Original pixel artwork. Frames are rasterized once, then reused by the game. */
(() => {
const palette={outline:'#111622',hair:'#171622',hairMid:'#302333',hairLight:'#4b3242',skin:'#a66b4d',shade:'#754535',light:'#c68b62',jacket:'#b6543c',red:'#e58157',darkRed:'#713d38',pants:'#263549',pantsLight:'#405269',shoe:'#192333',sole:'#c3c8c4',cyan:'#6cffe7'};
const cache=new Map();
const states=['idle','run','rise','fall','wall','hang','climb','dash','land'];
function make(state,frame,charged,variant='profile'){
 const cv=document.createElement('canvas');cv.width=72;cv.height=92;const c=cv.getContext('2d'),P=palette;
 const box=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)};
 const limb=(a,b,width,color)=>{const n=Math.ceil(Math.hypot(a[0]-b[0],a[1]-b[1]));for(let i=0;i<=n;i++)box(a[0]+(b[0]-a[0])*i/(n||1)-width/2,a[1]+(b[1]-a[1])*i/(n||1)-width/2,width,width,color)};
 const leg=(a,b,d,back)=>{limb(a,b,10,P.outline);limb(b,d,9,P.outline);limb(a,b,7,back?P.pants:P.pantsLight);limb(b,d,6,P.pants);box(d[0]-4,d[1]-2,13,6,P.shoe);box(d[0]-4,d[1]+3,15,3,P.sole);box(d[0]+1,d[1],5,2,'#88929c');if(charged)box(d[0]-4,d[1]+5,15,1,P.cyan)};
 const phase=frame/8*Math.PI*2;let bob=state==='run'?Math.abs(Math.sin(phase))*2:state==='idle'?Math.sin(phase)*1:0;
 let hip=[35,57],backK=[27,69],backF=[25,82],frontK=[40,70],frontF=[41,82],lean=0;
 if(state==='run'){const s=Math.sin(phase);backK=[31-s*12,67-Math.max(0,-s)*6];backF=[31-s*20,80-Math.max(0,-s)*13];frontK=[36+s*12,67-Math.max(0,s)*5];frontF=[36+s*19,80-Math.max(0,s)*13];lean=5}
 if(state==='rise'){backK=[23,65];backF=[16,75];frontK=[45,60];frontF=[48,70];lean=4}
 if(state==='fall'){backK=[27,68];backF=[22,78];frontK=[44,69];frontF=[48,81];lean=-2}
 if(state==='dash'){backK=[15,62];backF=[3,61];frontK=[37,70];frontF=[25,77];lean=13}
 if(state==='wall'||state==='hang'){backK=[38,68];backF=[48,73];frontK=[46,60];frontF=[52,66];lean=-4}
 if(state==='climb'){frontK=[49,49];frontF=[58,58];backK=[24,68];backF=[21,79];lean=7}
 if(state==='land'){hip=[35,63];frontK=[49,70];frontF=[47,82];backK=[21,71];backF=[20,82];bob=6}
 c.save();c.translate(0,-bob);leg(hip,backK,backF,true);
 // Far sleeve and hand.
 const shoulder=[39+lean,39],hand=state==='hang'?[56,12]:state==='wall'?[57,31]:[49+Math.sin(phase)*3,56];
 limb(shoulder,[47+lean,46],9,P.outline);limb([47+lean,46],hand,6,P.shade);limb(shoulder,[47+lean,46],6,P.darkRed);box(hand[0]-2,hand[1]-1,5,6,P.skin);
 leg(hip,frontK,frontF,false);
 // Cropped jacket, shirt, cuffs and seams.
 box(24+lean,35,24,21,P.outline);box(25+lean,36,21,18,P.jacket);box(35+lean,37,8,19,'#202635');box(27+lean,38,3,13,P.red);box(25+lean,52,22,4,P.darkRed);box(33+lean,54,8,3,'#b3916c');box(36+lean,54,3,2,'#e2c697');box(43+lean,39,3,9,P.red);
 // Neck and expressive face, always visible under the puff.
 if(variant==='original'){
 box(34+lean,29,9,9,P.shade);box(36+lean,31,6,6,P.skin);box(31+lean,16,17,17,P.outline);box(32+lean,18,14,14,P.skin);box(42+lean,20,5,8,P.light);box(46+lean,25,4,4,P.skin);box(40+lean,31,6,3,P.shade);box(31+lean,25,4,6,P.shade);box(31+lean,26,2,2,P.light);box(41+lean,22,6,2,P.outline);box(44+lean,24,2,2,'#f2d7b0');box(45+lean,24,1,2,P.outline);box(44+lean,30,3,1,'#4c302e');box(32+lean,29,2,2,'#e7b76e');
}else{
 // A narrow neck and stepped cheeks replace the square jaw and heavy brow.
 box(35+lean,29,6,8,P.shade);box(37+lean,30,4,7,P.skin);
 box(33+lean,17,12,3,P.outline);box(31+lean,20,16,8,P.outline);
 box(33+lean,18,11,3,P.skin);box(32+lean,21,14,7,P.skin);
 box(34+lean,28,11,3,P.skin);box(36+lean,31,7,2,P.skin);
 box(33+lean,24,3,6,P.shade);box(34+lean,24,2,3,P.skin);
 box(34+lean,28,1,2,'#e5b978');
 if(variant==='profile'){
  box(41+lean,20,4,7,P.light);box(46+lean,25,1,2,P.skin);
  box(41+lean,21,3,1,P.shade);box(42+lean,23,3,2,'#d6b18b');box(43+lean,23,1,2,'#292230');
  box(42+lean,28,3,1,'#a76454');box(44+lean,27,1,1,P.light);
 }else if(variant==='quarter'){
  box(39+lean,20,5,9,'#b57b55');box(36+lean,22,2,2,'#e6c19b');box(37+lean,22,1,2,'#332537');
  box(42+lean,22,3,2,'#e6c19b');box(43+lean,22,1,2,'#332537');box(41+lean,25,2,2,P.light);
  box(39+lean,29,4,1,'#a26353');box(43+lean,28,1,1,'#c38863');
 }else{
  box(40+lean,21,5,6,'#b57b55');box(43+lean,23,2,2,'#382c37');
  box(42+lean,28,2,1,'#aa7057');
 }
 }
 // Natural puff: stepped outline, clustered curls, warm reflected highlights.
 const hx=lean-(state==='run'?Math.round(Math.sin(phase)*2):0),hy=state==='run'?Math.round(Math.cos(phase)*1):0;
 for(const [x,y,w,h] of [[14,5,19,21],[9,10,29,12],[17,1,12,29],[11,6,23,22],[27,13,18,7],[30,16,6,9]])box(x+hx,y+hy,w,h,P.hair);
 for(const [x,y,w,h] of [[15,5,5,3],[24,3,5,3],[10,12,5,3],[18,12,5,4],[29,8,5,3],[24,18,5,3],[14,21,5,3],[32,16,7,2],[19,25,5,2]])box(x+hx,y+hy,w,h,P.hairMid);
 for(const [x,y] of [[16,5],[25,4],[12,12],[29,9],[20,13],[16,22],[33,16]])box(x+hx,y+hy,3,1,P.hairLight);
 box(29+hx,24+hy,5,3,P.darkRed);
 // Satchel strap crosses the jacket; bag has a buckle and flap.
 limb([43+lean,36],[23+lean,57],4,'#251f26');limb([43+lean,36],[23+lean,57],2,'#9b7855');box(17+lean,51,14,15,P.outline);box(18+lean,52,12,12,'#68503e');box(19+lean,53,10,5,'#947050');box(23+lean,56,4,4,'#d5b07e');box(24+lean,57,2,2,'#473b31');
 // Near powered arm follows the pose instead of remaining rigid.
 const sh=[26+lean,39];let elbow=[18+lean,49],wrist=[18+lean,61];
 if(state==='run'){elbow=[23-Math.sin(phase)*10,46];wrist=[19-Math.sin(phase)*14,49-Math.cos(phase)*8]}
 if(state==='rise'){elbow=[18,43];wrist=[14,32]}
 if(state==='fall'){elbow=[18,43];wrist=[9,50]}
 if(state==='dash'){elbow=[15,44];wrist=[3,47]}
 if(state==='hang'||state==='climb'){elbow=[37,27];wrist=[54,10]}
 if(state==='wall'){elbow=[37,39];wrist=[54,31]}
 limb(sh,elbow,10,P.outline);limb(sh,elbow,7,P.jacket);limb([sh[0]-1,sh[1]],elbow,2,P.red);limb(elbow,wrist,7,P.outline);limb(elbow,wrist,5,P.skin);box(elbow[0]-4,elbow[1]-3,8,4,'#30303b');
 if(charged){limb([elbow[0]+1,elbow[1]+2],wrist,2,P.cyan);box(wrist[0]-3,wrist[1]-2,6,6,'#b5ffe9');box(27+lean,42,1,8,P.cyan);if(frame%2===0){box(wrist[0]-8,wrist[1]-5,2,3,P.cyan);box(wrist[0]+7,wrist[1]+2,2,2,P.cyan)}}else box(wrist[0]-2,wrist[1]-1,5,5,P.skin);
 c.restore();return cv;
}
function image(state,t,charged,variant='profile'){const frame=Math.floor(t*(state==='run'?14:state==='dash'?24:7))%8,key=`${variant}/${state}/${frame}/${charged}`;if(!cache.has(key))cache.set(key,make(state,frame,charged,variant));return cache.get(key)}
window.CourierArt={states,image,draw(c,x,y,state,t,charged,face=1,scale=.55){c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(x+9),Math.round(y+34));c.scale(face*scale,scale);c.drawImage(image(state,t,charged),-36,-88);c.restore()}};
})();
