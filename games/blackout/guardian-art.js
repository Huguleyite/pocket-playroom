/* Pixel-built security machines. The vulnerable chest stays at the existing interaction height. */
window.GuardianArt={draw(c,{x,kind='lock',boss,open=false,recovering=false,hit=false,defeated=false,age=0,maxHealth=3}){
 c.save();c.translate(Math.round(x),0);
 const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)},edge='#7896a4',dark='#0b1621',metal='#304957',accent=kind==='sweep'?'#a2b8ed':['storm','gridheart'].includes(kind)?'#c09fb5':'#cba87b';
 if(defeated){const drop=Math.min(1,age/1.1);r(-51,294,102,6,dark);r(-35,289-drop*3,70,10,'#2c3b45');r(-28,282,56,8,edge);r(-15,277,30,9,'#3a454a');r(-3,280,8,3,'#384b50');if(age<1.2){for(let i=0;i<8;i++)r(-40+i*12,280-Math.sin(i*2+age*14)*12,2,4,'#edba7b')}c.restore();return}
 const live=!!boss,damaged=live&&boss.health<maxHealth,warning=live&&(boss.clock%4.5<1.1),stagger=hit?Math.sin(age*60)*3:0;
 c.translate(stagger,0);
 // Heavy planted feet, articulated legs and a broad armored torso.
 for(const side of [-1,1]){r(side<0?-36:20,273,16,22,dark);r(side<0?-33:23,276,10,18,edge);r(side<0?-43:20,294,23,6,'#66818e')}
 const wings=kind==='sweep'?32:kind==='paired'?18:8;
 r(-43,201,86,88,dark);r(-38,205,76,77,metal);r(-35,205,70,5,edge);r(-40,226,6,48,accent);r(34,226,6,48,accent);
 for(const side of [-1,1]){const sx=side<0?-67-wings:45;r(sx,211,22+wings,15,dark);r(sx+3,214,16+wings,8,edge);r(side<0?sx:54+wings,224,17,30,metal);r(side<0?sx-3:52+wings,246,22,17,dark);r(side<0?sx+1:56+wings,250,14,8,warning?'#ffe0a0':accent)}
 // Sensor head visibly follows the courier; mast and cooling fins sell a machine.
 r(-7,188,14,15,edge);r(-25,172,50,24,dark);r(-22,175,44,16,metal);r(-18,179,36,7,live?'#e9b67c':'#526b74');
 const eye=live?Math.max(-10,Math.min(10,(p.x-x)*.06)):0;r(eye-3,179,6,7,live?'#fff0c9':'#789296');r(-3,162,6,11,edge);r(-2,158,4,5,live?'#ffb77c':'#506b75');
 if(['storm','gridheart'].includes(kind)){for(let i=0;i<4;i++){r(-49,204+i*16,7,8,accent);r(42,204+i*16,7,8,accent)}r(-33,164,7,28,accent);r(26,164,7,28,accent)}
 // Round exposed coil inside the chest; shutters slide apart rather than becoming a loose square.
 r(-24,239,48,49,dark);c.strokeStyle='#7899a6';c.lineWidth=3;c.beginPath();c.arc(0,266,20,0,Math.PI*2);c.stroke();
 if(open&&!recovering){c.fillStyle='#82ffe0';c.beginPath();c.arc(0,267,14,0,Math.PI*2);c.fill();c.fillStyle='#effff0';c.beginPath();c.moveTo(4,253);c.lineTo(-8,269);c.lineTo(0,269);c.lineTo(-4,281);c.lineTo(11,262);c.lineTo(3,262);c.closePath();c.fill();r(-34,244,9,40,accent);r(25,244,9,40,accent)}
 else{r(-20,247,19,37,accent);r(1,247,19,37,accent);r(-1,247,2,37,dark);for(let i=0;i<3;i++){r(-16,253+i*10,11,2,'#655d56');r(5,253+i*10,11,2,'#655d56')}}
 if(damaged){c.strokeStyle=dark;c.lineWidth=2;c.beginPath();c.moveTo(-27,212);c.lineTo(-16,223);c.lineTo(-22,234);c.stroke();r(26,218,5,5,dark);if(boss.health<=2)r(-31,233,3,5,'#f1b874')}
 if(hit){c.globalAlpha=.65;r(-37,205,74,36,'#eaffed');c.globalAlpha=1}
 c.restore();
}};
