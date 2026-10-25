'use strict';
(()=>{
 const $=s=>document.querySelector(s),T=THREE,H=CrownWaterTopology,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const presets={
  straight:{title:'Straight river',copy:'A shared surface runs through neighboring water hexes. No repeated banks interrupt it.',cells:Array.from({length:7},(_,i)=>[i-3,0])},
  bend60:{title:'60° bend',copy:'A river can turn without colliding banks or a break in its surface.',cells:[[0,0],[-1,0],[-2,0],[-3,0],[0,1],[0,2],[0,3]]},
  bend120:{title:'120° bend',copy:'At a sharper turn, neighboring water still merges into one area. Banks follow the outside.',cells:[[0,0],[-1,0],[-2,0],[-3,0],[-1,1],[-2,2],[-3,3]]},
  junction:{title:'Three-way junction',copy:'Three branches meet in open water. There is no bank placed across the meeting point.',cells:[[0,0],[-1,0],[-2,0],[-3,0],[1,-1],[2,-2],[3,-3],[0,1],[0,2],[0,3]]},
  lake:{title:'Connected lake',copy:'A broad water area has one continuous surface, with banks only along its outer land boundary.',cells:[]},
  island:{title:'Island in a lake',copy:'The land in the center creates an inner shoreline. The surrounding water remains connected.',cells:[]}
 };
 const cells=[];for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)if(Math.max(Math.abs(a),Math.abs(b),Math.abs(a+b))<=3){const t=H.cell(a,b);t.id=H.id(a,b);const p=H.point(a,b);Object.assign(t,p,{y:.22,baseType:((a===-3&&b===2)||(a===3&&b===-2))?'forest':((a===-3&&b===1)||(a===3&&b===-1))?'rocky':'land'});cells.push(t);if(Math.max(Math.abs(a),Math.abs(b),Math.abs(a+b))<=2){presets.lake.cells.push([a,b]);if(a||b)presets.island.cells.push([a,b]);}}
 let selected='bend60',water=new Set(),root,guides=new T.Group(),camera,renderer,scene,last=0;
 function dispose(group){if(!group)return;group.userData.disposed=true;group.traverse(o=>o.userData.disposed=true);const materials=new Set();group.traverse(o=>{o.geometry?.dispose();if(o.material)materials.add(o.material);});materials.forEach(m=>m.dispose());scene.remove(group);}
 function rebuild(){dispose(root);root=new T.Group();scene.add(root);guides=new T.Group();root.add(guides);
  for(const t of cells){t.type=water.has(t.id)?'water':t.baseType;const dummy=new T.Mesh(new T.CylinderGeometry(1.04,1.04,.2,6),new T.MeshBasicMaterial({color:0x4f6246}));dummy.position.set(t.x,.1,t.z);dummy.visible=false;root.add(dummy);t.mesh=dummy;
   if(t.type!=='water')CrownTerrain.attach(root,t);
   const vs=H.vertices(t.a,t.b).map(v=>new T.Vector3(v.x,.245,v.z));vs.push(vs[0]);const line=new T.Line(new T.BufferGeometry().setFromPoints(vs),new T.LineBasicMaterial({color:0xbfe0cf,transparent:true,opacity:.35,depthTest:false}));line.renderOrder=10;guides.add(line);
  }
  const layer=CrownWater.build(root,cells),top=layer.userData.waterTopology;guides.visible=$('#show-grid').checked;
  $('#water-count').textContent=top.waterCells.length;$('#body-count').textContent=top.components.length;$('#join-count').textContent=top.sharedEdges.length;$('#shore-count').textContent=top.shoreEdges.length;
  $('#water-status').textContent=`${top.components.length} connected water area${top.components.length===1?'':'s'}. ${top.sharedEdges.length} shared water edges have no bank.`;
  for(const t of cells)t.button.setAttribute('aria-label',`${t.id}: ${t.type==='water'?'water, click to turn into land':'land, click to turn into water'}`);
 }
 function applyPreset(id){selected=id;water=new Set(presets[id].cells.map(([a,b])=>H.id(a,b)));$('#layout-title').textContent=presets[id].title;$('#layout-copy').textContent=presets[id].copy;document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.preset===id));rebuild();}
 function toggleCell(t){if(water.has(t.id))water.delete(t.id);else water.add(t.id);$('#layout-title').textContent='Your water layout';$('#layout-copy').textContent='Banks update automatically as you change neighboring hexes.';document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed','false'));rebuild();}
 function resize(){if(!renderer)return;const el=$('#water-scene'),w=el.clientWidth,h=el.clientHeight,aspect=w/h,span=aspect<1.1?13/aspect:12.4;renderer.setSize(w,h,false);camera.left=-span*aspect/2;camera.right=span*aspect/2;camera.top=span/2;camera.bottom=-span/2;camera.updateProjectionMatrix();camera.updateMatrixWorld();for(const t of cells){const v=new T.Vector3(t.x,.25,t.z).project(camera);t.button.style.left=(v.x*.5+.5)*w+'px';t.button.style.top=(-v.y*.5+.5)*h+'px';}}
 function init(){try{
  renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;scene=new T.Scene();camera=new T.OrthographicCamera(-10,10,7,-7,.1,100);camera.position.set(3.5,16,20);camera.lookAt(0,0,0);
  scene.add(new T.HemisphereLight(0xe7f0df,0x26382e,2));const sun=new T.DirectionalLight(0xffe0b2,2);sun.position.set(-7,12,8);scene.add(sun);
  const board=new T.Mesh(new T.BoxGeometry(13.3,.42,12),new T.MeshStandardMaterial({color:0x263e32,roughness:.85}));board.position.y=-.30;scene.add(board);const trim=new T.Mesh(new T.BoxGeometry(13.35,.045,12.05),new T.MeshStandardMaterial({color:0x9c8452,metalness:.45,roughness:.6}));trim.position.y=-.49;scene.add(trim);
  renderer.domElement.setAttribute('aria-hidden','true');$('#water-scene').prepend(renderer.domElement);
  for(const t of cells){const b=document.createElement('button');b.className='water-hex';b.dataset.hex=t.id;b.textContent='•';b.addEventListener('click',()=>toggleCell(t));$('#hex-buttons').append(b);t.button=b;}
  renderer.domElement.addEventListener('click',e=>{const rect=renderer.domElement.getBoundingClientRect(),pointer=new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new T.Raycaster();ray.setFromCamera(pointer,camera);scene.updateMatrixWorld(true);const hit=ray.intersectObjects(cells.map(t=>t.mesh),false)[0];if(hit){const target=cells.find(t=>t.mesh===hit.object);if(target)toggleCell(target);}});
  renderer.domElement.style.cursor='pointer';
  applyPreset(selected);new ResizeObserver(resize).observe($('#water-scene'));window.addEventListener('resize',resize);resize();$('#loading').hidden=true;document.body.dataset.waterStudy='ready';
  const draw=now=>{requestAnimationFrame(draw);if(document.hidden||now-last<(reduced.matches?100:33))return;last=now;renderer.render(scene,camera);};requestAnimationFrame(draw);
 }catch(error){$('#loading').hidden=true;$('#map-error').hidden=false;console.error(error);}}
 document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>applyPreset(b.dataset.preset)));$('#reset-water').addEventListener('click',()=>applyPreset(selected));$('#show-grid').addEventListener('change',()=>{guides.visible=$('#show-grid').checked;$('#hex-buttons').classList.toggle('guides',$('#show-grid').checked);});
 window.waterStudy={snapshot:()=>{const top=H.analyze(cells);return {preset:selected,water:[...water].sort(),components:top.components.length,sharedEdges:top.sharedEdges.length,shoreEdges:top.shoreEdges.length,shores:top.shoreEdges.map(e=>({cell:e.cell,neighbor:e.neighbor})),grid:$('#show-grid').checked};}};
 init();
})();

