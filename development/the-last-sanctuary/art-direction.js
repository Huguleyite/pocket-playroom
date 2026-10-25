/* Visual study 02: original material, landscape and lighting work. No game rules. */
'use strict';
window.CrownArt=(()=>{
 const T=THREE, P=CrownModels;
 const waterShaders=[];
 let environment;
 const materials={
  moss:P.mat(0x5f7748,.04,.98),stone:P.mat(0x999783,.04,.92),stoneDark:P.mat(0x626858,.05,.97),
  soil:P.mat(0x685746,.02,.98),grass:P.mat(0x929360,.02,.98),flower:P.mat(0xe9d8a0,.03,.9),
  reed:P.mat(0x87935b,.03,.95),darkWood:P.mat(0x253430,.18,.6)
 };
 function random(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
 function texture(kind){
  const n=512,c=document.createElement('canvas');c.width=c.height=n;const ctx=c.getContext('2d'),r=random(kind==='ground'?519:829);
  // Smooth multi-scale fields give moss and stone tonal depth without noisy speckling.
  const grids=[8,16,32,64].map(size=>({size,data:Array.from({length:size*size},()=>r())}));
  const sample=(grid,x,y)=>{const s=grid.size,xx=x/n*s,yy=y/n*s,ix=Math.floor(xx),iy=Math.floor(yy),fx=xx-ix,fy=yy-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);const a=(dx,dy)=>grid.data[((iy+dy)%s)*s+(ix+dx)%s];return (a(0,0)*(1-u)+a(1,0)*u)*(1-v)+(a(0,1)*(1-u)+a(1,1)*u)*v;};
  const pixels=ctx.createImageData(n,n);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
   const broad=sample(grids[0],x,y),detail=sample(grids[1],x,y),fine=sample(grids[2],x,y),grain=(r()-.5)*7,idx=(y*n+x)*4;
   const m=(broad-.5)*22+(detail-.5)*10+(fine-.5)*5;
   const soil=Math.max(0,broad-.64)*55;
   const base=kind==='ground'?[83+m+soil+grain,105+m-soil*.15+grain,67+m-soil*.30+grain]:[143+m+grain,145+m+grain,134+m+grain];
   pixels.data.set([...base,255],idx);
  }
  ctx.putImageData(pixels,0,0);
  if(kind==='ground')for(let i=0;i<1800;i++){ctx.strokeStyle=i%3?'#a6b17d22':'#344d3222';const x=r()*n,y=r()*n;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(r()-.5)*2,y-1-r()*3);ctx.stroke();}
  const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;tx.anisotropy=4;return tx;
 }
 function studio(renderer){
  const room=new T.Scene();room.background=new T.Color(0x686e70);
  const shell=new T.Mesh(new T.BoxGeometry(20,16,20),new T.MeshBasicMaterial({color:0x777b76,side:T.BackSide}));room.add(shell);
  function softbox(x,y,z,w,h,color,rotation){const a=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color,side:T.DoubleSide}));a.position.set(x,y,z);a.rotation.set(...rotation);room.add(a);}
  softbox(-7,4,1,5,8,0xffedc6,[0,Math.PI/2,0]);softbox(0,7,0,8,5,0xfafbf7,[Math.PI/2,0,0]);softbox(7,1,-3,3,6,0x9ac4cd,[0,-Math.PI/2,0]);
  const generator=new T.PMREMGenerator(renderer);environment=generator.fromScene(room,.07).texture;generator.dispose();
  room.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});return environment;
 }
 function waterMaterial(){
  const material=new T.MeshStandardMaterial({color:0x286e74,roughness:.26,metalness:.25,envMapIntensity:.5});
  material.onBeforeCompile=shader=>{
   shader.uniforms.landscapeTime={value:0};waterShaders.push(shader);
   shader.vertexShader='varying vec3 vRiver;\n'+shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvRiver=(modelMatrix*vec4(transformed,1.0)).xyz;');
   shader.fragmentShader='uniform float landscapeTime;varying vec3 vRiver;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
    float ripple=sin(vRiver.x*3.+vRiver.z*4.-landscapeTime*.65)*sin(vRiver.x*4.5-vRiver.z*3.7+landscapeTime*.3);
    float caustic=pow(max(0.,sin(vRiver.x*6.+vRiver.z*4.+ripple*.7-landscapeTime*.45)),18.);
    float stream=pow(max(0.,sin(vRiver.z*8.+sin(vRiver.x*2.+landscapeTime*.4)*.6)),30.);
    diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.33,.58,.55),caustic*.13+stream*.05);
   `);
  };return material;
 }
 const groundTx=texture('ground'),stoneTx=texture('stone');
 function topMaterial(){return new T.MeshStandardMaterial({color:0xffffff,map:groundTx,bumpMap:groundTx,bumpScale:.025,roughness:.94,envMapIntensity:.2});}
 function stoneMaterial(){return new T.MeshStandardMaterial({color:0xe4e1d3,map:stoneTx,bumpMap:stoneTx,bumpScale:.035,roughness:.92,envMapIntensity:.2});}
 function pebbles(g,r,t){
  for(let i=0;i<6;i++){
   const a=r()*Math.PI*2,rr=.62+r()*.24,x=t.x+Math.cos(a)*rr,z=t.z+Math.sin(a)*rr;
   const s=.04+r()*.065;const rock=P.mesh(g,new T.DodecahedronGeometry(s,0),i%3?materials.stoneDark:materials.stone,x,t.y+s*.3,z);rock.scale.set(1,.5,.75);rock.rotation.set(r(),r()*5,r());
  }
 }
 function grassPatch(scene,x,y,z,r){
  const positions=[],indices=[];
  for(let i=0;i<9;i++){
   const px=x+(r()-.5)*.20,pz=z+(r()-.5)*.20,h=.055+r()*.09,bend=(r()-.5)*.08,w=.008;
   const a=positions.length/3;positions.push(px-w,y,pz,px+w,y,pz,px+bend,y+h,pz+.02);indices.push(a,a+1,a+2);
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();const o=P.mesh(scene,geo,materials.grass);o.material.side=T.DoubleSide;return o;
 }
 function decorate(scene,t){
  const r=random((t.q+10)*163+(t.r+10)*739);
  // The upper edge receives a thin soil strata under the grass surface.
  if(t.type!=='water'){
   const ledge=P.mesh(scene,new T.CylinderGeometry(1.016,1.017,.037,6),materials.soil,t.x,t.y-.027,t.z);ledge.rotation.y=Math.PI/6;
  }
  if(t.type==='land'||t.type==='forest'){
   pebbles(scene,r,t);
   for(let i=0;i<3;i++){const a=r()*6.28;grassPatch(scene,t.x+Math.cos(a)*.78,t.y+.008,t.z+Math.sin(a)*.78,r);}
   if((t.q+t.r)%3===0){
    for(let i=0;i<4;i++){const x=t.x+.58+(r()-.5)*.18,z=t.z-.45+(r()-.5)*.18;P.rod(scene,materials.moss,[x,t.y,z],[x,t.y+.12,z],.006);P.sphere(scene,materials.flower,x,t.y+.12,z,.023,.012,.023);}
   }
  }
  if(t.type==='water'){
   for(let i=0;i<3;i++){
    const x=t.x+(r()-.5)*1.4,z=t.z+.70+(r()-.5)*.1,h=.20+r()*.16;
    P.rod(scene,materials.reed,[x,t.y,z],[x+.03,t.y+h,z],.008,.004);
    P.rod(scene,materials.soil,[x+.03,t.y+h-.06,z],[x+.03,t.y+h+.02,z],.017);
   }
  }
  if(t.type==='ruin'){
   for(let i=0;i<7;i++){
    const a=i*.8;const rock=P.rock(scene,t.x+Math.cos(a)*.66,t.y+.05,t.z+Math.sin(a)*.6,.25+r()*.4);rock.material=i%2?materials.stoneDark:materials.moss;
   }
   // Fine joints and creeping moss break up the original blockwork.
   for(const x of [-.45,0,.45])for(const h of [.3,.62])P.box(scene,materials.stoneDark,t.x+x,t.y+h,t.z-.157,.36,.012,.008);
  }
 }
 function finishBoard(scene,tiles,options={}){
  const bridge=tiles.find(t=>t.type==='bridge'),m=stoneMaterial();
  if(options.bridge!==false){
  // Curved masonry supports underneath the crossing, visible from either viewing angle.
  for(const side of [-1,1]){
   const path=new T.Shape();path.moveTo(-1.1,0);path.lineTo(-1.1,.45);path.quadraticCurveTo(0,.90,1.1,.45);path.lineTo(1.1,0);path.lineTo(.79,0);path.quadraticCurveTo(0,.55,-.79,0);path.closePath();
   const arch=P.mesh(scene,new T.ExtrudeGeometry(path,{depth:.15,bevelEnabled:true,bevelSize:.02,bevelThickness:.02,bevelSegments:1,steps:1}),m,bridge.x+side*.5,bridge.y-.1,bridge.z);arch.rotation.y=Math.PI/2;
  }
  for(const x of [-.58,.58])for(const z of [-.95,.95]){
   P.cylinder(scene,m,bridge.x+x,bridge.y+.40,bridge.z+z,.12,.15,.56,8);
   P.cylinder(scene,P.M.gold,bridge.x+x,bridge.y+.70,bridge.z+z,.105,.13,.045,8);
  }
  }
  // Low engraved rail accents; all are outside the playing area.
  for(const z of [-4.79,4.79])for(let i=-5;i<=5;i++){
   const diamond=P.mesh(scene,new T.OctahedronGeometry(.038),P.M.gold,i*.65,-.15,z);diamond.scale.y=.2;
  }
  // A physical title plaque on the near rail.
  const c=document.createElement('canvas');c.width=768;c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='#263c37';ctx.fillRect(0,0,768,96);ctx.strokeStyle='#bca270';ctx.lineWidth=2;ctx.strokeRect(7,7,754,82);ctx.fillStyle='#e2cf9d';ctx.font='30px Georgia';ctx.textAlign='center';ctx.fillText('THE BROKEN CROSSING',384,59);
  const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;
  const plaque=P.mesh(scene,new T.PlaneGeometry(3.1,.38),new T.MeshStandardMaterial({map:tx,roughness:.6,metalness:.2}),0,-.105,4.73);plaque.rotation.x=-Math.PI/2;
 }
 function update(now,reduced){for(const s of waterShaders)s.uniforms.landscapeTime.value=reduced?0:now*.001;}
 return {studio,topMaterial,stoneMaterial,waterMaterial,decorate,finishBoard,update,get environment(){return environment;}};
})();
