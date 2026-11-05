const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg',KEY='pocket-worlds-village-shaded-v1';
const colors=['#f6eedb','#eab94f','#ee826a','#a6b681','#507650','#a77448','#b79ad5','#4f9796'];
let stored=null;try{stored=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}
const progress=new VillageProgress(VILLAGE_DATA,stored),art=$('#art'),scene=$('#scene'),defs=$('#artDefs');
let scenePreview=false;
let regions=[],filled=new Set(),mode='coloring',history={},view={x:0,y:0,w:640,h:600},epoch=0,timers=[],fitFrame=0;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');let motion=true;try{motion=localStorage.getItem('pocket-worlds-motion')!=='off'}catch{}
function node(tag,attrs){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(progress.serialize()))}catch{say('Progress cannot be saved in this browser; keep this tab open.')}}
function say(text){$('#status').textContent=text}
function stopSequence(){epoch++;timers.forEach(clearTimeout);timers=[];if(fitFrame)cancelAnimationFrame(fitFrame);fitFrame=0;document.querySelectorAll('.painted-flight').forEach(e=>e.remove());$('#toast').classList.remove('visible')}
function later(fn,ms){const token=epoch;timers.push(setTimeout(()=>{if(token===epoch)fn()},ms))}
function animateEnabled(){return motion&&!reduce.matches}
function announce(title,text){$('#toast').innerHTML='';const a=document.createElement('strong'),b=document.createElement('small');a.textContent=title;b.textContent=text;$('#toast').append(a,b);$('#toast').classList.add('visible');later(()=>$('#toast').classList.remove('visible'),4200)}
function image(attrs={}){return node('image',{href:VILLAGE_DATA.image,width:1254,height:1254,'pointer-events':'none',...attrs})}
function setupArt(crop){scene.innerHTML='';defs.innerHTML='<filter id="gray" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/></filter>';const clip=node('clipPath',{id:'cropClip'});clip.append(node('rect',{x:0,y:0,width:crop.w,height:crop.h}));defs.append(clip);const scale=Math.min(616/crop.w,576/crop.h),tx=(640-crop.w*scale)/2,ty=(600-crop.h*scale)/2;scene.setAttribute('transform',`translate(${tx} ${ty}) scale(${scale})`);const cropped=node('g',{'clip-path':'url(#cropClip)'});scene.append(cropped);art.setAttribute('role',mode==='coloring'||mode==='world'||(mode==='scene'&&!scenePreview&&!progress.sceneComplete())?'group':'img');art.setAttribute('aria-label',mode==='scene'?'Storybook Village connected scene':mode==='world'?'Connected world collection':progress.picture().title+' coloring picture');return cropped}
function drawPicture(){const p=progress.picture(),crop=p.crop,g=setupArt(crop);regions=p.regions;filled=progress.entry().filled;
 const original=image({id:'pictureSource',href:p.image,x:-crop.x,y:-crop.y});defs.append(original);g.append(node('use',{href:'#pictureSource',filter:mode==='coloring'?'url(#gray)':'none','pointer-events':'none'}));
 if(mode==='coloring')regions.forEach((r,i)=>{const group=node('g',{}),clip=node('clipPath',{id:`region${i}`});clip.append(node('path',{d:r.d}));const color=node('use',{href:'#pictureSource','clip-path':`url(#region${i})`,class:'paint-wash','pointer-events':'none'}),path=node('path',{d:r.d,class:'region',fill:'transparent',tabindex:0,role:'button','aria-label':`${r.name}, color ${r.c}`}),text=node('text',{x:r.x,y:r.y,class:'num','font-size':Math.max(14,Math.min(32,r.radius*1.4))});text.style.fontSize=Math.max(14,Math.min(32,r.radius*1.4))+'px';group.append(clip,color,path,text);g.append(group);r.p=path;r.t=text;r.color=color;path.onclick=()=>paint(i);path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();paint(i)}}});
 else if(progress.complete())addAmbient(g,crop,false,p.id);
}
function svgCrop(crop,gray=false,href=VILLAGE_DATA.image){return `<svg viewBox="${crop.x} ${crop.y} ${crop.w} ${crop.h}" aria-hidden="true"><image href="${href}" width="1254" height="1254" ${gray?'style="filter:grayscale(1)"':''}/></svg>`}
function renderUI(){const p=progress.picture(),entry=progress.entry();$('#title').textContent=p.title;$('#eyebrow').textContent=`Storybook Village · Picture ${VILLAGE_DATA.pictures.indexOf(p)+1} of 4`;$('#percent').textContent=Math.round(entry.filled.size/p.regions.length*100)+'%';$('#bar').style.width=$('#percent').textContent;$('#count').textContent=`${entry.filled.size} of ${p.regions.length} regions brought to life`;$('#colcount').textContent=`${progress.completedCount()} / 4`;
 if(mode==='coloring')regions.forEach((r,i)=>{const done=entry.filled.has(i);r.color.setAttribute('opacity',done?'1':'0');r.p.classList.toggle('match',!done&&r.c===entry.selected);r.p.setAttribute('aria-label',`${r.name}, color ${r.c}${done?', colored':''}`);r.t.textContent=done?'':r.c});
 $('#palette').innerHTML='';colors.forEach((c,i)=>{const num=i+1,left=p.regions.filter((r,j)=>r.c===num&&!entry.filled.has(j)).length,b=document.createElement('button');b.className='swatch'+(entry.selected===num?' selected':'');b.style.background=c;b.style.color=(num===5||num===6||num===8)?'#fff9ec':'#203347';b.setAttribute('aria-label',`Color ${num}, ${left} remaining`);b.setAttribute('aria-pressed',String(entry.selected===num));b.innerHTML=`${num}<em>${left||'✓'}</em>`;b.onclick=()=>{entry.selected=num;persist();renderUI();say(`Color ${num}: ${left} regions remaining.`)};$('#palette').append(b)});$('#undo').disabled=!(history[p.id]?.length);}
function loadPicture(id,completedView=false){if(!progress.select(id))return;stopSequence();mode=completedView&&progress.complete()?'picture':'coloring';persist();document.body.classList.toggle('gallery',mode!=='coloring');document.body.classList.remove('tools-hidden');$('#sceneTitle').hidden=mode==='coloring';drawPicture();renderUI();resetView();updateTools();if(mode!=='coloring')setTitle(progress.picture().title,'Collected picture');say('Choose a color, then tap its matching numbers.');}
function paint(i){if(mode!=='coloring')return;const id=progress.active;if(!progress.fill(i)){if(!filled.has(i))say(`Choose color ${regions[i].c} for this region.`);return}(history[id]??=[]).push(i);persist();renderUI();const r=regions[i];if(animateEnabled()){const star=node('path',{d:`M${r.x-4} ${r.y} h8 M${r.x} ${r.y-4} v8`,class:'art-sparkle','pointer-events':'none'});scene.lastChild.append(star);later(()=>star.remove(),700)}say('A little more life in your village.');if(!regions.some((v,j)=>v.c===r.c&&!filled.has(j))){$('#palette').children[r.c-1].classList.add('color-complete');say(`Color ${r.c} complete.`)}if(progress.complete()){if(progress.sceneComplete()){showScene();awaken(true)}else{showPicture();awaken(false)}}}
function setTitle(title,subtitle){$('#sceneTitle').innerHTML='';const a=document.createElement('span'),b=document.createElement('small');a.textContent=title;b.textContent=subtitle;$('#sceneTitle').append(a,b);$('#sceneTitle').hidden=false}
function gallery(){document.body.classList.add('gallery');document.body.classList.remove('tools-hidden')}
function showPicture(){stopSequence();mode='picture';gallery();drawPicture();renderUI();setTitle(progress.picture().title,progress.complete()?'Collected picture':'Finished-picture preview · progress unchanged');resetView();updateTools()}
function showScene(previewArtwork=false){
 stopSequence();
 mode='scene';
 scenePreview=previewArtwork===true && !progress.sceneComplete();
 gallery();
 drawScene();
 const subtitle=progress.sceneComplete()
  ? 'Four pictures collected · a living village'
  : scenePreview ? 'Full-color preview · progress unchanged'
  : `${progress.completedCount()} of 4 pictures complete · select a picture to color`;
 setTitle('Storybook Village',subtitle);
 resetView();
 updateTools();
}

function assemblySvg(){
 return `<svg viewBox="0 0 2508 2508" aria-hidden="true"><image href="${VILLAGE_DATA.sceneImage}" width="2508" height="2508"/></svg>`;
}

function drawScene(){
 const group=setupArt(VILLAGE_DATA.scene);
 const complete=progress.sceneComplete();
 const source=node('image',{id:'connectedVillageSource',href:VILLAGE_DATA.sceneImage,width:2508,height:2508});
 defs.append(source);
 group.append(node('use',{href:'#connectedVillageSource',filter:complete||scenePreview?'none':'url(#gray)','pointer-events':'none'}));
 if(complete){
  const ambient=node('g',{class:'scene-ambient awake','aria-hidden':'true'});
  ambient.innerHTML='<g transform="scale(2)"><ellipse class="window-glow" cx="331" cy="322" rx="83" ry="60"/><ellipse class="window-glow" cx="1000" cy="297" rx="60" ry="63"/><ellipse class="lamp-glow" cx="340" cy="805" rx="65" ry="42"/><ellipse class="pond-ripple" cx="954" cy="1041" rx="95" ry="25"/></g><circle class="village-firefly" r="9"/><circle class="village-firefly delay" r="8"/>';
  group.append(ambient);
  return;
 }
 if(scenePreview)return;
 VILLAGE_DATA.pictures.forEach((picture,index)=>{
  const x=index%2*1254;
  const y=Math.floor(index/2)*1254;
  const done=progress.complete(picture.id);
  if(done){
   const clipId=`collected-quarter-${index}`;
   const clip=node('clipPath',{id:clipId});
   clip.append(node('rect',{x,y,width:1254,height:1254}));
   defs.append(clip);
   group.append(node('use',{href:'#connectedVillageSource','clip-path':`url(#${clipId})`,'pointer-events':'none'}));
  }
  const count=progress.entry(picture.id).filled.size;
  const tile=node('rect',{x,y,width:1254,height:1254,class:'scene-tile',tabindex:0,role:'button','aria-label':`Open ${picture.title}, ${count} of ${picture.regions.length} regions`});
  tile.onclick=()=>loadPicture(picture.id,done);
  tile.onkeydown=event=>{
   if(event.key==='Enter'||event.key===' '){
    event.preventDefault();
    tile.onclick();
   }
  };
  const label=node('text',{x:x+627,y:y+1205,class:'tile-label'});
  label.style.fontSize='65px';
  label.textContent=`${picture.title} · ${done?'Collected':Math.round(count/picture.regions.length*100)+'%'}`;
  group.append(tile,label);
 });
}
function showWorld(){stopSequence();mode='world';gallery();const crop=VILLAGE_DATA.world,g=setupArt(crop);g.append(image({x:-crop.x,y:-crop.y,filter:'url(#gray)'}));if(progress.sceneComplete()){const c={x:12,y:53,w:613,h:562},clip=node('clipPath',{id:'worldVillage'});clip.append(node('rect',{x:c.x-crop.x,y:c.y-crop.y,width:c.w,height:c.h}));defs.append(clip);g.append(image({x:-crop.x,y:-crop.y,'clip-path':'url(#worldVillage)'}));}
 const scenes=[['Storybook Village',0,0],['Willow Waters',613,0],['Lantern Woods',0,562],['Hilltop Observatory',613,562]];scenes.forEach(([name,x,y],i)=>{const tile=node('rect',{x,y,width:613,height:562,class:'scene-tile',tabindex:0,role:'button','aria-label':i===0?'Open Storybook Village':name+', future scene preview'});tile.onclick=()=>{if(i===0)showScene();else announce(name,'Future scene · not playable in this test')};tile.onkeydown=e=>{if(e.key==='Enter')tile.onclick()};const text=node('text',{x:x+306,y:y+510,class:'future-label'});text.style.fontSize='40px';text.textContent=name;const sub=node('text',{x:x+306,y:y+539,class:'future-label','font-size':15});sub.style.fontSize='28px';sub.textContent=i===0?(progress.sceneComplete()?'Scene collected':`${progress.completedCount()} / 4 pictures`):'Future scene';g.append(tile,text,sub)});setTitle('The Connected World',`${progress.sceneComplete()?1:0} of 4 scenes collected · 16-picture layout reference`);resetView();updateTools()}
function addAmbient(g,crop,connected,id=progress.active){const a=node('g',{class:'scene-ambient awake','aria-hidden':'true'});const effects={bookshop:'<ellipse class="window-glow" cx="710" cy="670" rx="150" ry="140"/><ellipse class="window-glow" cx="230" cy="660" rx="100" ry="150"/><circle class="smoke" cx="435" cy="66" r="12"/><circle class="smoke s2" cx="435" cy="64" r="10"/>','tea-shop':'<ellipse class="window-glow" cx="840" cy="635" rx="145" ry="135"/><ellipse class="lamp-glow" cx="535" cy="575" rx="34" ry="57"/>',greenhouse:'<ellipse class="lamp-glow" cx="695" cy="545" rx="80" ry="40"/><ellipse class="window-glow" cx="630" cy="700" rx="230" ry="170"/>','hidden-garden':'<ellipse class="pond-ripple" cx="680" cy="960" rx="200" ry="60"/><circle class="mote" cx="480" cy="350" r="5"/><circle class="mote m2" cx="795" cy="420" r="5"/>'};a.innerHTML=effects[id]||'';g.append(a)}
function animateSceneReveal(){if(!animateEnabled())return;const c=VILLAGE_DATA.scene,index=VILLAGE_DATA.pictures.findIndex(v=>v.id===progress.active),p={x:index%2*1254,y:Math.floor(index/2)*1254,w:1254,h:1254},scale=Math.min(616/c.w,576/c.h),cx=(640-c.w*scale)/2+(p.x-c.x+p.w/2)*scale,cy=(600-c.h*scale)/2+(p.y-c.y+p.h/2)*scale;view={w:Math.min(480,Math.max(260,p.w*scale+24)),h:0,x:0,y:0};view.h=view.w*600/640;view.x=cx-view.w/2;view.y=cy-view.h/2;constrainView();const from={...view},start=performance.now(),token=epoch;updateView();function frame(now){if(token!==epoch)return;const t=Math.min(1,(now-start)/1450),ease=1-Math.pow(1-t,3);view={x:from.x*(1-ease),y:from.y*(1-ease),w:from.w+(640-from.w)*ease,h:from.h+(600-from.h)*ease};updateView();if(t<1)fitFrame=requestAnimationFrame(frame);else fitFrame=0;}fitFrame=requestAnimationFrame(frame);}
function awaken(connected){if(connected)animateSceneReveal();const a=scene.querySelector('.scene-ambient');if(a){a.classList.remove('awake');later(()=>a.classList.add('awake'),400)}announce(connected?'Storybook Village awakens':progress.picture().title,connected?'Four pictures joined · scene collected':'Picture collected · saved to your village');if(animateEnabled())later(flyToCollection,1200);later(()=>$('#pick').focus(),2200)}
function flyToCollection(){const target=$('#sceneView'),box=target.getBoundingClientRect(),pic=$('.picture').getBoundingClientRect(),flight=document.createElement('div');flight.className='painted-flight';flight.innerHTML=mode==='scene'?assemblySvg():svgCrop(progress.picture().crop,false,progress.picture().image);const x=pic.left+pic.width/2-42,y=pic.top+pic.height/2-42;flight.style.left=x+'px';flight.style.top=y+'px';document.body.append(flight);const token=epoch,anim=flight.animate([{transform:'translate(0,0) scale(1)',opacity:0},{transform:'translate(0,0) scale(1)',opacity:1,offset:.2},{transform:`translate(${box.left+box.width/2-x-42}px,${box.top+box.height/2-y-42}px) scale(.2)`,opacity:0}],{duration:1100,easing:'ease-in-out',fill:'forwards'});anim.onfinish=()=>{flight.remove();if(token===epoch)target.classList.add('next-color')}}
function updateTools(){const complete=mode==='scene'?progress.sceneComplete():mode==='picture'&&progress.complete();$('#replay').hidden=!complete;$('#previewScene').hidden=mode!=='scene'||progress.sceneComplete();$('#previewScene').textContent=scenePreview?'Show scene progress':'Preview full scene';$('#back').textContent='Back to coloring';applyMotion();}
function applyMotion(){if(!animateEnabled()){if(fitFrame){cancelAnimationFrame(fitFrame);fitFrame=0;resetView()}document.querySelectorAll('.painted-flight').forEach(e=>e.remove())}document.body.classList.toggle('motion-off',!animateEnabled());$('#motion').textContent=animateEnabled()?'Motion on':'Motion off';$('#motion').setAttribute('aria-pressed',String(animateEnabled()));$('#motion').disabled=reduce.matches}
function showPictures(){const list=$('#pictureList');list.innerHTML='';for(const p of VILLAGE_DATA.pictures){const b=document.createElement('button');b.className='picture-card'+(p.id===progress.active?' current':'');b.innerHTML=svgCrop(p.crop,!progress.complete(p.id),p.image);const title=document.createElement('strong'),sub=document.createElement('small');title.textContent=p.title;sub.textContent=progress.complete(p.id)?'Collected · view picture':`${progress.entry(p.id).filled.size} of ${p.regions.length} regions`;b.append(title,sub);b.onclick=()=>{$('#pictureDialog').close();loadPicture(p.id,true)};list.append(b)}$('#sceneProgress').textContent=`${progress.completedCount()} of 4 pictures complete`;$('#pictureDialog').showModal()}
$('#pictures').onclick=showPictures;$('#pick').onclick=showPictures;$('#collection').onclick=showScene;$('#openScene').onclick=()=>{$('#pictureDialog').close();showScene()};$('#sceneView').onclick=()=>showScene();$('#previewScene').onclick=()=>showScene(!scenePreview);$('#worldView').onclick=showWorld;$('#preview').onclick=showPicture;$('#back').onclick=()=>loadPicture(progress.active);$('#replay').onclick=()=>{const connected=mode==='scene';connected?showScene():showPicture();awaken(connected)};
$('#undo').onclick=()=>{const i=history[progress.active]?.pop();if(i!==undefined){progress.undo(i);persist();renderUI();say('Last region undone.')}};$('#hint').onclick=()=>{const i=regions.findIndex((r,j)=>!filled.has(j)&&r.c===progress.entry().selected),next=i>=0?i:regions.findIndex((r,j)=>!filled.has(j));if(next<0){say('This picture is complete. View your connected scene.');return}progress.entry().selected=regions[next].c;persist();renderUI();resetView();regions[next].p.focus();say(`Try ${regions[next].name.toLowerCase()}.`)};
$('#help').onclick=()=>$('#helpDialog').showModal();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('#reset').onclick=()=>{$('#resetNote').textContent=`Only ${progress.picture().title} will be cleared. The other pictures keep their progress.`;$('#resetDialog').showModal()};$('#confirmReset').onclick=()=>{$('#resetDialog').close();progress.reset();history[progress.active]=[];persist();loadPicture(progress.active)};
$('#motion').onclick=()=>{motion=!motion;try{localStorage.setItem('pocket-worlds-motion',motion?'on':'off')}catch{}applyMotion()};reduce.addEventListener('change',applyMotion);$('#hideTools').onclick=()=>{document.body.classList.add('tools-hidden');$('#showTools').focus()};$('#showTools').onclick=()=>{document.body.classList.remove('tools-hidden');$('#hideTools').focus()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mode!=='coloring'&&!document.querySelector('dialog[open]'))loadPicture(progress.active)});

function updateView(){art.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`)}function resetView(){view={x:0,y:0,w:640,h:600};updateView()}function zoom(f){let w=Math.max(120,Math.min(640,view.w*f)),h=w*600/640;view.x+=(view.w-w)/2;view.y+=(view.h-h)/2;view.w=w;view.h=h;constrainView();updateView()}$('#zoom').onclick=$('#plus').onclick=()=>zoom(.8);$('#out').onclick=$('#minus').onclick=()=>zoom(1.25);$('#fit').onclick=$('#viewerFit').onclick=resetView;
// Zoom toward the mouse position, preserving the artwork point beneath it.
function wheelZoom(e){
 e.preventDefault();
 const rect=art.getBoundingClientRect(),scale=Math.min(rect.width/view.w,rect.height/view.h);
 if(!scale)return;
 const localX=(e.clientX-rect.left-(rect.width-view.w*scale)/2)/scale;
 const localY=(e.clientY-rect.top-(rect.height-view.h*scale)/2)/scale;
 const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?rect.height:1);
 const newW=Math.max(120,Math.min(640,view.w*Math.exp(Math.max(-600,Math.min(600,delta))*.0015)));
 const factor=newW/view.w;
 view.x+=localX*(1-factor);view.y+=localY*(1-factor);view.w=newW;view.h=newW*600/640;
 constrainView();updateView();
}
art.addEventListener('wheel',wheelZoom,{passive:false});
// A short press colors; movement beyond six CSS pixels becomes a pan.
const pointers=new Map();let gesture=null,suppressClick=false;
function constrainView(){view.x=Math.max(0,Math.min(640-view.w,view.x));view.y=Math.max(0,Math.min(600-view.h,view.y));}
function pointerPair(){const a=[...pointers.values()];return {distance:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2};}
function panBy(dx,dy){const scale=Math.min(art.clientWidth/view.w,art.clientHeight/view.h);if(scale>0){view.x-=dx/scale;view.y-=dy/scale;constrainView();updateView();}}
art.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 if(!pointers.size){suppressClick=false;gesture={startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,panning:false};}
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 // Retain the original region as the capture target so a stationary tap still colors it.
 e.target.setPointerCapture(e.pointerId);
 if(pointers.size>=2){suppressClick=true;gesture.panning=true;art.classList.add('panning');}
});
art.addEventListener('pointermove',e=>{
 if(!pointers.has(e.pointerId)||!gesture)return;
 const before=pointers.size>=2?pointerPair():null;
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size>=2){
  const after=pointerPair();if(before.distance>0&&after.distance>0)zoom(before.distance/after.distance);
  panBy(after.x-before.x,after.y-before.y);suppressClick=true;gesture.panning=true;
 }else{
  if(!gesture.panning&&Math.hypot(e.clientX-gesture.startX,e.clientY-gesture.startY)>6){gesture.panning=true;suppressClick=true;art.classList.add('panning');}
  if(gesture.panning)panBy(e.clientX-gesture.x,e.clientY-gesture.y);
 }
 gesture.x=e.clientX;gesture.y=e.clientY;
});
function endPointer(e){
 if(!pointers.has(e.pointerId))return;
 if(e.type==='pointercancel'||e.type==='lostpointercapture')suppressClick=true;
 pointers.delete(e.pointerId);
 if(pointers.size===1){const remaining=[...pointers.values()][0];gesture={startX:remaining.x,startY:remaining.y,x:remaining.x,y:remaining.y,panning:true};}
 if(!pointers.size){gesture=null;art.classList.remove('panning');}
}
['pointerup','pointercancel','lostpointercapture'].forEach(type=>art.addEventListener(type,endPointer));
art.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation();}},true);

art.addEventListener('pointerdown',()=>{if(fitFrame){cancelAnimationFrame(fitFrame);fitFrame=0}});art.addEventListener('wheel',()=>{if(fitFrame){cancelAnimationFrame(fitFrame);fitFrame=0}},{passive:true});
loadPicture(progress.active,true);if(progress.sceneComplete())showScene();applyMotion();
