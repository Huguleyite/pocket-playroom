'use strict';
window.createSanctuaryEffects=function(c){
 const {T,scene,pos,tileByKey}=c;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
 const ctx=canvas.getContext('2d'),g=ctx.createRadialGradient(64,64,0,64,64,64);
 g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.12,'rgba(255,255,255,.85)');g.addColorStop(.4,'rgba(255,255,255,.28)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
 const texture=new T.CanvasTexture(canvas);
 function halo(color,size){const s=new T.Sprite(new T.SpriteMaterial({map:texture,color,transparent:true,opacity:.7,depthWrite:false,depthTest:false,blending:T.AdditiveBlending}));s.scale.set(size,size,1);s.renderOrder=8;scene.add(s);return s;}
 c.relicHalo=halo(0x59ffec,1.4);c.homeHalo=halo(0xffd77e,3.1);c.homeHalo.position.copy(pos(tileByKey.get('-2,3'),.15));
 c.ripple=new T.Mesh(new T.RingGeometry(.67,.71,64),new T.MeshBasicMaterial({color:0xffdd81,transparent:true,opacity:.7,side:T.DoubleSide,depthWrite:false,depthTest:false}));c.ripple.rotation.x=-Math.PI/2;c.ripple.position.copy(pos(tileByKey.get('-2,3'),.10));c.ripple.renderOrder=8;scene.add(c.ripple);
 c.sparks=[];for(let i=0;i<14;i++){const spark=halo(i<7?0x9afff1:0xffe6a0,.075);c.sparks.push(spark);}
};
window.updateScenarioEffects=function(now,reduced){
 const c=window.sanctuaryScene;if(!c?.relicHalo)return;const b=c.getBattle(),t=reduced?0:now*.001,pulse=reduced?.6:(Math.sin(t*2.3)+1)/2;
 const base=b.carrier?c.units[b.carrier].model.position.clone().add(new c.T.Vector3(0,2.05,0)):c.pos(c.tileByKey.get(b.relicKey||'1,-3'),1.25);
 c.relic.position.copy(base);c.relic.position.y+=reduced?0:Math.sin(t*1.8)*.09;c.relic.rotation.y=t*.55;c.relic.visible=b.status!=='won';
 c.relicHalo.position.copy(c.relic.position);c.relicHalo.material.opacity=.35+pulse*.3;c.relicHalo.scale.setScalar(1.05+pulse*.5);c.relicHalo.visible=c.relic.visible;
 c.homeHalo.material.opacity=(b.carrier?.45:.22)+pulse*.2;c.homeRing.material.opacity=.5+pulse*.45;
 c.ripple.scale.setScalar(reduced?1.2:1+(t*.35%1)*.8);c.ripple.material.opacity=reduced?.4:.7*(1-(t*.35%1));
 c.objectiveLabels[1].visible=!b.carrier&&b.relicKey==='1,-3';
 for(let i=0;i<c.sparks.length;i++){const s=c.sparks[i],relic=i<7,origin=relic?base:c.homeHalo.position,angle=t*.6+i*2.399,radius=relic?.3:.7;s.position.set(origin.x+Math.cos(angle)*radius,origin.y+(reduced?.15:((t*.35+i*.137)%1)*.9),origin.z+Math.sin(angle)*radius);s.material.opacity=reduced?.45:.2+.7*Math.pow(Math.sin(t*1.6+i),2);s.visible=!relic||c.relic.visible;}
};
