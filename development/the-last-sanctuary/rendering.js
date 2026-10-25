/* Unified fixed-view rendering. Approved source textures are never rewritten. */
'use strict';
window.CrownRendering=(()=>{
 const enabled=new URLSearchParams(location.search).get('render')==='final'&&CrownArchitecture.enabled;
 const T=THREE,graded=new Set(),shadows=[],glows=[],motes=[],lamps=[],frames=[],guides=[];let renderer,scene,camera,mode='day';
 const light={value:0},time={value:0},finish={value:1};
 function radialTexture(){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),g=ctx.createRadialGradient(64,64,5,64,64,62);g.addColorStop(0,'rgba(0,0,0,.45)');g.addColorStop(.5,'rgba(0,0,0,.21)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return new T.CanvasTexture(c);}
 function contact(x,y,z,w,d,texture){const m=new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false,opacity:1});const o=new T.Mesh(new T.PlaneGeometry(w,d),m);o.rotation.x=-Math.PI/2;o.position.set(x,y,z);scene.add(o);shadows.push(o);return o;}
 function grade(sprite){
  if(sprite.userData.renderGlow||graded.has(sprite)||!sprite.material.map)return;graded.add(sprite);const mat=sprite.material;
  mat.onBeforeCompile=s=>{s.uniforms.renderDusk=light;s.uniforms.renderFinish=finish;s.fragmentShader='uniform float renderDusk;uniform float renderFinish;\n'+s.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   float baseShade=smoothstep(0.0,.65,vMapUv.y);
   vec3 daylight=vec3(1.035,1.015,.965)*mix(.83,1.02,baseShade);
   vec3 dusk=mix(vec3(.32,.47,.73),vec3(.82,.71,.58),smoothstep(.05,.98,vMapUv.y));
   diffuseColor.rgb*=mix(vec3(1.),mix(daylight,dusk,renderDusk),renderFinish);
  `);};mat.customProgramCacheKey=()=> 'crown-render-grade-09';mat.needsUpdate=true;
  if(sprite.userData.terrainAsset||sprite.userData.cardPiece||sprite.userData.architectureAsset==='bridge')return;
  const shadowMat=new T.MeshBasicMaterial({map:mat.map,color:0x06111d,transparent:true,opacity:.22,alphaTest:.02,depthWrite:false,toneMapped:false,side:T.DoubleSide});
  const g=new T.PlaneGeometry(1,1);g.translate(0,.5,0);const shadow=new T.Mesh(g,shadowMat);shadow.rotation.set(-Math.PI/2,0,-.65);shadow.userData.source=sprite;scene.add(shadow);shadows.push(shadow);
 }
 function waterGrade(mesh){const m=mesh.material;if(m.userData.renderWater)return;m.userData.renderWater=true;
  m.onBeforeCompile=s=>{s.uniforms.renderTime=time;s.uniforms.renderDusk=light;s.uniforms.renderFinish=finish;s.vertexShader='varying vec3 waterWorld;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nwaterWorld=(modelMatrix*vec4(position,1.)).xyz;');s.fragmentShader='uniform float renderTime;uniform float renderDusk;uniform float renderFinish;varying vec3 waterWorld;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float wave=sin(waterWorld.x*5.3+waterWorld.z*3.4+renderTime*.35)*sin(waterWorld.x*2.4-waterWorld.z*5.1-renderTime*.22);
   float glint=pow(max(0.,wave),9.);
   diffuseColor.rgb*=mix(vec3(1.),mix(vec3(.79,1.0,1.04),vec3(.42,.63,.87),renderDusk),renderFinish);
   diffuseColor.rgb+=renderFinish*glint*mix(vec3(.13,.16,.12),vec3(.045,.09,.15),renderDusk);
  `);};m.needsUpdate=true;
 }
 function setMode(next){if(!['before','day','dusk'].includes(next))return;mode=next;finish.value=mode==='before'?0:1;light.value=mode==='dusk'?1:0;document.body.dataset.rendering=mode;for(const b of document.querySelectorAll('[data-render-mode]'))b.setAttribute('aria-pressed',String(b.dataset.renderMode===mode));for(const s of shadows)s.visible=mode!=='before';for(const g of glows)g.visible=mode!=='before';for(const l of lamps){l.object.intensity=l.intensity*(mode==='dusk'?.48:1);}for(const f of frames)f.object.material=mode==='before'?f.original:f.finished;for(const g of guides)g.object.material.opacity=mode==='before'?g.opacity:.065;}
 function setup(r,s,c,tiles,units){renderer=r;scene=s;camera=c;camera.lookAt(0,.65,0);document.body.dataset.rendering='day';renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const controls=document.createElement('div');controls.className='render-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Rendering comparison');controls.innerHTML='<button data-render-mode="before" aria-pressed="false">Before</button><button data-render-mode="day" aria-pressed="true">Daylight</button><button data-render-mode="dusk" aria-pressed="false">Dusk</button><a href="architecture.html">Architecture</a>';document.querySelector('#battlefield').append(controls);const boardLink=document.createElement('a'),url=new URL(location.href);if(CrownBoard.enabled)url.searchParams.delete('board');else url.searchParams.set('board','compact');boardLink.href=url.pathname+url.search;boardLink.textContent=CrownBoard.enabled?'Full board · 35':'Compact board · 25';controls.append(boardLink);const playLink=document.createElement('a'),playURL=new URL(location.href),isBattle=playURL.searchParams.get('play')==='skirmish';if(isBattle)playURL.searchParams.delete('play');else{playURL.searchParams.set('play','skirmish');playURL.searchParams.set('board','compact');}playLink.href=playURL.pathname+playURL.search;playLink.textContent=isBattle?'Art study':'Play skirmish';controls.append(playLink);controls.addEventListener('click',e=>{const b=e.target.closest('[data-render-mode]');if(b)setMode(b.dataset.renderMode);});
  const tx=radialTexture();for(const tile of tiles)if(!['water','bridge'].includes(tile.type))contact(tile.x,tile.y-.05,tile.z,1.93,1.68,tx);
  for(const unit of Object.values(units)){const o=contact(0,0,0,1.65,1.3,tx);o.userData.unitRoot=unit.model;}
  scene.traverse(o=>{if(o.isLight)lamps.push({object:o,intensity:o.intensity});if(o.isLineSegments){guides.push({object:o,opacity:o.material.opacity});o.userData.originalOpacity=o.material.opacity;o.material.opacity=.065;}
   if(o.geometry?.parameters?.width===CrownBoard.frame.width){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#162320';ctx.fillRect(0,0,512,128);for(let y=0;y<128;y++){ctx.strokeStyle=`rgba(148,126,85,${.025+(Math.sin(y*3.41)+1)*.025})`;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(160,y+Math.sin(y)*5,350,y-3,512,y);ctx.stroke();}const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;const original=o.material;o.material=new T.MeshStandardMaterial({map,roughness:.6,metalness:.13});frames.push({object:o,original,finished:o.material});}
  });
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const gx=glowCanvas.getContext('2d'),gg=gx.createRadialGradient(64,64,0,64,64,64);gg.addColorStop(0,'rgba(255,255,255,1)');gg.addColorStop(.18,'rgba(255,255,255,.65)');gg.addColorStop(.5,'rgba(255,255,255,.14)');gg.addColorStop(1,'rgba(255,255,255,0)');gx.fillStyle=gg;gx.fillRect(0,0,128,128);const glowMap=new T.CanvasTexture(glowCanvas);
  function glow(x,y,z,size,color,opacity){const o=new T.Sprite(new T.SpriteMaterial({map:glowMap,color,transparent:true,opacity,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));o.position.set(x,y,z);o.scale.setScalar(size);o.userData.renderGlow=true;o.userData.strength=opacity;scene.add(o);glows.push(o);return o;}
  const shrine=tiles.find(t=>t.type==='shrine'),cottage=tiles.find(t=>t.q===-2&&t.r===-1);
  glow(shrine.x,shrine.y+.86,shrine.z+.08,.61,0x65e9df,.32);
  glow(cottage.x+.12,cottage.y+.42,cottage.z+.17,.28,0xffb665,.4);
  for(let i=0;i<12;i++){const angle=i*2.39996,radius=.35+(i%4)*.14,o=glow(shrine.x+Math.cos(angle)*radius,shrine.y+.28+(i%5)*.15,shrine.z+Math.sin(angle)*radius,.035,0x90eddf,.6);o.userData.origin=o.position.clone();o.userData.phase=i;motes.push(o);}
  window.crownRender={setMode,snapshot:()=>({mode,graded:graded.size,shadows:shadows.length,reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches})};
 }
 function render(now,reduced){
  time.value=reduced?0:now*.001;
  for(const g of glows)g.material.opacity=g.userData.strength*(mode==='dusk'?1.3:.7);for(const o of motes){o.position.copy(o.userData.origin);if(!reduced)o.position.y+=Math.sin(now*.0005+o.userData.phase)*.055;}
  const sprites=[];scene.traverse(o=>{if((o.isSprite||o.userData.architectureAsset==='bridge')&&o.material.map)sprites.push(o);if(o.userData.waterTopology){const surface=o.children[0];if(surface?.material.map)waterGrade(surface);}});for(const s of sprites)grade(s);
  const p=new T.Vector3();for(const o of shadows){const src=o.userData.source;if(src){src.getWorldPosition(p);o.position.set(p.x+.15,p.y+.025,p.z+.06);o.scale.set(src.scale.x*.83,src.scale.y*.66,1);o.visible=mode!=='before'&&src.parent.visible;o.material.opacity=mode==='dusk'?.30:.22;}if(o.userData.unitRoot){o.userData.unitRoot.getWorldPosition(p);o.position.set(p.x,p.y+.018,p.z);o.scale.setScalar(o.userData.unitRoot.scale.x);}}
  // The comparison bypass is a shader uniform, preserving the same camera and controls.
  renderer.render(scene,camera);
 }
 return {enabled,setup,render};
})();
