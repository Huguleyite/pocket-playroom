const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg',KEY='pocket-worlds-village-shaded-v1',MOTION_KEY='pocket-worlds-motion';
const REGION_MAP = 3;

function migrateRegions(stored) {
 if (stored?.regionMap === REGION_MAP) return;
 for (const picture of VILLAGE_DATA.pictures) {
  if (picture.id === 'bookshop' && stored?.bookshopMap === 2) continue;
  const saved = stored?.pictures?.[picture.id];
  if (!Array.isArray(saved?.filled)) continue;

  const legacy = new Set(saved.filled.filter(i => Number.isInteger(i) && i >= 0 && i < picture.legacyRegionCount));
  if (legacy.size === picture.legacyRegionCount) {
   saved.filled = picture.regions.map((_, index) => index);
   continue;
  }
  saved.filled = picture.regions.flatMap((region, index) => {
   const covered = picture.legacyOverlap[index].reduce((sum, [i, pixels]) => sum + (legacy.has(i) ? pixels : 0), 0);
   return covered >= region.area * .95 ? [index] : [];
  });
  if (picture.id !== 'bookshop') {
   const filled = new Set(saved.filled);
   saved.selected = picture.regions.find((_, index) => !filled.has(index))?.c ?? 1;
  }
 }
}

let stored=null;try{stored=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}
migrateRegions(stored);
const progress=new VillageProgress(VILLAGE_DATA,stored),art=$('#art'),scene=$('#scene'),defs=$('#artDefs');
let scenePreview=false;
let regions=[],filled=new Set(),mode='coloring',history={},view={x:0,y:0,w:640,h:600},epoch=0,timers=[],fitFrame=0;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');let motion=true;try{motion=localStorage.getItem(MOTION_KEY)!=='off'}catch{}
function node(tag,attrs){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({...progress.serialize(),bookshopMap:2,regionMap:REGION_MAP}))}catch{say('Progress cannot be saved in this browser; keep this tab open.')}}
function currentScene(){return VILLAGE_DATA.scenes.find(item=>item.id===progress.sceneId())}
function say(text){$('#status').textContent=text}
function stopSequence(){epoch++;timers.forEach(clearTimeout);timers=[];if(fitFrame)cancelAnimationFrame(fitFrame);fitFrame=0;document.querySelectorAll('.painted-flight').forEach(e=>e.remove());$('#toast').classList.remove('visible')}
function later(fn,ms){const token=epoch;timers.push(setTimeout(()=>{if(token===epoch)fn()},ms))}
function animateEnabled(){return motion&&!reduce.matches}
function announce(title,text){$('#toast').innerHTML='';const a=document.createElement('strong'),b=document.createElement('small');a.textContent=title;b.textContent=text;$('#toast').append(a,b);$('#toast').classList.add('visible');later(()=>$('#toast').classList.remove('visible'),4200)}
function image(attrs={}){return node('image',{href:VILLAGE_DATA.image,width:1254,height:1254,'pointer-events':'none',...attrs})}
function setupArt(crop){scene.innerHTML='';defs.innerHTML='<filter id="gray" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/></filter>';const clip=node('clipPath',{id:'cropClip'});clip.append(node('rect',{x:0,y:0,width:crop.w,height:crop.h}));defs.append(clip);const scale=Math.min(616/crop.w,576/crop.h),tx=(640-crop.w*scale)/2,ty=(600-crop.h*scale)/2;scene.setAttribute('transform',`translate(${tx} ${ty}) scale(${scale})`);const cropped=node('g',{'clip-path':'url(#cropClip)'});scene.append(cropped);art.setAttribute('role',mode==='coloring'||mode==='world'||(mode==='scene'&&!scenePreview&&!progress.sceneComplete())?'group':'img');art.setAttribute('aria-label',mode==='scene'?currentScene().title+' connected scene':mode==='world'?'Connected world collection':progress.picture().title+' coloring picture');return cropped}
function drawPicture(){const p=progress.picture(),crop=p.crop,g=setupArt(crop);regions=p.regions;filled=progress.entry().filled;
 const original=image({id:'pictureSource',href:p.image,x:-crop.x,y:-crop.y});defs.append(original);g.append(node('use',{href:'#pictureSource',filter:mode==='coloring'?'url(#gray)':'none','pointer-events':'none'}));
 if(mode==='coloring')regions.forEach((r,i)=>{const group=node('g',{}),clip=node('clipPath',{id:`region${i}`});const shape={d:r.d};clip.append(node('path',shape));const color=node('use',{href:'#pictureSource','clip-path':`url(#region${i})`,class:'paint-wash','pointer-events':'none'}),path=node('path',{...shape,class:'region',fill:'transparent',tabindex:0,role:'button','aria-label':`${r.name}, color ${r.c}`}),text=node('text',{x:r.x,y:r.y,class:'num','font-size':Math.max(14,Math.min(32,r.radius*1.4))});text.style.fontSize=Math.max(14,Math.min(32,r.radius*1.4))+'px';group.append(clip,color,path,text);g.append(group);r.p=path;r.t=text;r.color=color;path.onclick=()=>paint(i);path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();paint(i)}}});
 else if(progress.complete())addAmbient(g,crop,false,p.id);
}
function svgCrop(crop,gray=false,href=VILLAGE_DATA.image){return `<svg viewBox="${crop.x} ${crop.y} ${crop.w} ${crop.h}" aria-hidden="true"><image href="${href}" width="1254" height="1254" ${gray?'style="filter:grayscale(1)"':''}/></svg>`}
function renderUI(){const p=progress.picture(),entry=progress.entry();$('#title').textContent=p.title;$('#eyebrow').textContent=currentScene().title;updateCollectionButtons();$('#percent').textContent=Math.floor(entry.filled.size*100/p.regions.length)+'%';$('#bar').style.width=$('#percent').textContent;$('#count').textContent=`${entry.filled.size} of ${p.regions.length} regions brought to life`;
 if(mode==='coloring')regions.forEach((r,i)=>{const done=entry.filled.has(i);r.color.setAttribute('opacity',done?'1':'0');r.p.classList.toggle('match',!done&&r.c===entry.selected);r.p.setAttribute('aria-label',`${r.name}, color ${r.c}${done?', colored':''}`);r.t.textContent=done?'':r.c});
 const palette = $('#palette');
 palette.style.setProperty('--swatch-columns', Math.max(4, Math.ceil(p.palette.length / 2)));
 const counts = p.palette.map(() => 0);
 regions.forEach((region, index) => { if (!entry.filled.has(index)) counts[region.c - 1]++; });
 const previousFocus = [...palette.children].indexOf(document.activeElement);
 palette.replaceChildren(...p.palette.map(([name, color], index) => {
  const num = index + 1, left = counts[index], selected = entry.selected === num;
  const button = document.createElement('button');
  button.className = 'swatch' + (selected ? ' selected' : '') + (left === 0 ? ' completed' : '');
  button.style.background = color;
  const channels = color.slice(1).match(/../g).map(hex => parseInt(hex, 16) / 255);
  const [r, g, b] = channels.map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  button.style.color = .2126 * r + .7152 * g + .0722 * b > .20 ? '#182c40' : '#fff9ec';
  button.setAttribute('aria-label', `Color ${num}, ${name}, ${left} remaining`);
  button.setAttribute('aria-pressed', String(selected));
  button.title = name;
  button.innerHTML = `${num}<em>${left || '✓'}</em>`;
  button.onclick = () => {
   entry.selected = num;
   persist();
   renderUI();
   say(`${name}: ${left} regions remaining.`);
  };
  return button;
 }));
 if (previousFocus >= 0) palette.children[previousFocus]?.focus({preventScroll: true});
 $('#undo').disabled = !(history[p.id]?.length);
}
function loadPicture(id,completedView=false){if(!progress.select(id))return;stopSequence();mode=completedView&&progress.complete()?'picture':'coloring';persist();document.body.classList.toggle('gallery',mode!=='coloring');document.body.classList.remove('tools-hidden');$('#sceneTitle').hidden=mode==='coloring';drawPicture();renderUI();resetView();updateTools();if(mode==='coloring'&&document.body.classList.contains('canvas-expanded'))frameView(true);if(mode!=='coloring')setTitle(progress.picture().title,'Collected picture');say('Choose a color, then tap its matching numbers.');}
function paint(i){if(mode!=='coloring')return;const id=progress.active;if(!progress.fill(i)){if(!filled.has(i))say(`Choose color ${regions[i].c} for this region.`);return}(history[id]??=[]).push(i);persist();renderUI();const r=regions[i];if(animateEnabled()){const star=node('path',{d:`M${r.x-4} ${r.y} h8 M${r.x} ${r.y-4} v8`,class:'art-sparkle','pointer-events':'none'});scene.lastChild.append(star);later(()=>star.remove(),700)}say('A little more life in your village.');if(!regions.some((v,j)=>v.c===r.c&&!filled.has(j))){$('#palette').children[r.c-1].classList.add('color-complete');say(`Color ${r.c} complete.`)}if(progress.complete())celebratePicture();}
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
 setTitle(currentScene().title,subtitle);
 resetView();
 updateTools();
}

function assemblySvg(){
 return `<svg viewBox="0 0 2508 2508" aria-hidden="true"><image href="${currentScene().image}" width="2508" height="2508"/></svg>`;
}

function drawScene(){
 const group=setupArt(VILLAGE_DATA.scene);
 const complete=progress.sceneComplete();
 const source=node('image',{id:'connectedVillageSource',href:currentScene().image,width:2508,height:2508});
 defs.append(source);
 group.append(node('use',{href:'#connectedVillageSource',filter:complete||scenePreview?'none':'url(#gray)','pointer-events':'none'}));
 if(complete){
  const ambient=node('g',{class:'scene-ambient awake','aria-hidden':'true'});
  const effects={
   village:'<ellipse class="window-glow" cx="331" cy="322" rx="83" ry="60"/><ellipse class="window-glow" cx="1000" cy="297" rx="60" ry="63"/><ellipse class="lamp-glow" cx="340" cy="805" rx="65" ry="42"/><ellipse class="pond-ripple" cx="954" cy="1041" rx="95" ry="25"/>',
   'willow-waters':'<ellipse class="pond-ripple" cx="960" cy="987" rx="105" ry="27"/><ellipse class="pond-ripple" cx="408" cy="1024" rx="68" ry="22"/><path class="path-light" d="M649 410 Q646 533 518 616 T392 967 Q366 1098 458 1220"/>',
   'lantern-woods':'<ellipse class="lamp-glow" cx="219" cy="682" rx="43" ry="55"/><ellipse class="lamp-glow" cx="372" cy="681" rx="26" ry="35"/><ellipse class="lamp-glow" cx="529" cy="698" rx="22" ry="29"/><ellipse class="window-glow" cx="1004" cy="874" rx="60" ry="52"/>',
   'hilltop-observatory':'<ellipse class="lamp-glow" cx="355" cy="291" rx="36" ry="26"/><ellipse class="lamp-glow" cx="1018" cy="744" rx="37" ry="35"/><ellipse class="pond-ripple" cx="786" cy="1152" rx="78" ry="20"/><circle class="mote" cx="435" cy="128" r="4"/>'
  };
  ambient.innerHTML=`<g transform="scale(2)">${effects[currentScene().id]}</g><circle class="village-firefly" r="9"/><circle class="village-firefly delay" r="8"/>`;
  group.append(ambient);
  return;
 }
 if(scenePreview)return;
 progress.scenePictures().forEach((picture,index)=>{
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
  label.textContent=`${picture.title} · ${done?'Collected':Math.floor(count*100/picture.regions.length)+'%'}`;
  group.append(tile,label);
 });
}
function showWorld(){
 stopSequence();
 mode='world';
 gallery();
 const crop=VILLAGE_DATA.world;
 const group=setupArt(crop);
 const complete=progress.worldComplete();
 const source=node('image',{id:'worldSource',href:VILLAGE_DATA.image,x:-crop.x,y:-crop.y,width:1254,height:1254});
 defs.append(source);
 group.append(node('use',{href:'#worldSource',filter:complete?'none':'url(#gray)','pointer-events':'none'}));
 for(const item of VILLAGE_DATA.scenes){
  const {x:worldX,y:worldY,w:width,h:height}=item.worldCrop;
  const x=worldX-crop.x,y=worldY-crop.y;
  const done=progress.sceneComplete(item.id);
  if(done&&!complete){
   const clipId='world-quarter-'+item.id;
   const clip=node('clipPath',{id:clipId});
   clip.append(node('rect',{x,y,width,height}));
   defs.append(clip);
   group.append(node('use',{href:'#worldSource','clip-path':`url(#${clipId})`,'pointer-events':'none'}));
  }
  const tile=node('rect',{x,y,width,height,class:complete?'scene-tile world-complete-tile':'scene-tile',tabindex:0,role:'button','aria-label':'Open '+item.title});
  tile.onclick=()=>{
   const pictures=progress.scenePictures(item.id);
   const next=pictures.find(picture=>!progress.complete(picture.id))??pictures[0];
   progress.select(next.id);
   persist();
   showScene();
  };
  tile.onkeydown=event=>{
   if(event.key==='Enter'||event.key===' '){event.preventDefault();tile.onclick()}
  };
  group.append(tile);
  if(!complete){
   const label=node('text',{x:x+width/2,y:y+height-55,class:'future-label'});
   label.style.fontSize='38px';
   label.textContent=item.title;
   const count=node('text',{x:x+width/2,y:y+height-23,class:'future-label'});
   count.style.fontSize='26px';
   count.textContent=done?'Scene collected':`${progress.completedCount(item.id)} / 4 pictures`;
   group.append(label,count);
  }
 }
 if(complete)addWorldAmbient(group);
 setTitle('The Connected World',complete?'All 16 pictures collected · a living world':`${progress.completedScenes()} of 4 scenes collected · select a scene`);
 resetView();
 updateTools();
}

function addWorldAmbient(group){
 const ambient=node('g',{class:'scene-ambient awake','aria-hidden':'true'});
 ambient.innerHTML='<ellipse class="window-glow" cx="191" cy="215" rx="55" ry="39"/><ellipse class="window-glow" cx="775" cy="180" rx="58" ry="38"/><ellipse class="lamp-glow" cx="230" cy="922" rx="62" ry="45"/><ellipse class="window-glow" cx="1015" cy="810" rx="58" ry="45"/><path class="path-light" d="M210 276 Q480 340 641 487 T1010 507 M205 925 Q430 1050 643 914 T1015 832"/><circle class="world-firefly" r="5"/><circle class="world-firefly delay" r="4"/>';
 group.append(ambient);
}
function addAmbient(g,crop,connected,id=progress.active){const a=node('g',{class:'scene-ambient awake','aria-hidden':'true'});const effects={bookshop:'<ellipse class="window-glow" cx="710" cy="670" rx="150" ry="140"/><ellipse class="window-glow" cx="230" cy="660" rx="100" ry="150"/><circle class="smoke" cx="435" cy="66" r="12"/><circle class="smoke s2" cx="435" cy="64" r="10"/>','tea-shop':'<ellipse class="window-glow" cx="840" cy="635" rx="145" ry="135"/><ellipse class="lamp-glow" cx="535" cy="575" rx="34" ry="57"/>',greenhouse:'<ellipse class="lamp-glow" cx="695" cy="545" rx="80" ry="40"/><ellipse class="window-glow" cx="630" cy="700" rx="230" ry="170"/>','hidden-garden':'<ellipse class="pond-ripple" cx="680" cy="960" rx="200" ry="60"/><circle class="mote" cx="480" cy="350" r="5"/><circle class="mote m2" cx="795" cy="420" r="5"/>'};a.innerHTML=effects[id]||'';g.append(a)}
function animateSceneReveal(){if(!animateEnabled())return;const isWorld=mode==='world',c=isWorld?VILLAGE_DATA.world:VILLAGE_DATA.scene,index=progress.scenePictures().findIndex(v=>v.id===progress.active),p=isWorld?currentScene().worldCrop:{x:index%2*1254,y:Math.floor(index/2)*1254,w:1254,h:1254},scale=Math.min(616/c.w,576/c.h),cx=(640-c.w*scale)/2+(p.x-c.x+p.w/2)*scale,cy=(600-c.h*scale)/2+(p.y-c.y+p.h/2)*scale;view={w:Math.min(480,Math.max(260,p.w*scale+24)),h:0,x:0,y:0};view.h=view.w*600/640;view.x=cx-view.w/2;view.y=cy-view.h/2;constrainView();const from={...view},start=performance.now(),token=epoch;updateView();function frame(now){if(token!==epoch)return;const t=Math.min(1,(now-start)/1450),ease=1-Math.pow(1-t,3);view={x:from.x*(1-ease),y:from.y*(1-ease),w:from.w+(640-from.w)*ease,h:from.h+(600-from.h)*ease};updateView();if(t<1)fitFrame=requestAnimationFrame(frame);else fitFrame=0;}fitFrame=requestAnimationFrame(frame);}
function awaken(connected){if(connected)animateSceneReveal();const a=scene.querySelector('.scene-ambient');if(a){a.classList.remove('awake');later(()=>a.classList.add('awake'),400)}announce(connected?'Storybook Village awakens':progress.picture().title,connected?'Four pictures joined · scene collected':'Picture collected · saved to your village');if(animateEnabled()&&mode!=='world')later(flyToCollection,1200);later(()=>$('#pick').focus(),2200)}
function flyToCollection(){const target=$('#sceneView'),box=target.getBoundingClientRect(),pic=$('.picture').getBoundingClientRect(),flight=document.createElement('div');flight.className='painted-flight';flight.innerHTML=mode==='scene'?assemblySvg():svgCrop(progress.picture().crop,false,progress.picture().image);const x=pic.left+pic.width/2-42,y=pic.top+pic.height/2-42;flight.style.left=x+'px';flight.style.top=y+'px';document.body.append(flight);const token=epoch,anim=flight.animate([{transform:'translate(0,0) scale(1)',opacity:0},{transform:'translate(0,0) scale(1)',opacity:1,offset:.2},{transform:`translate(${box.left+box.width/2-x-42}px,${box.top+box.height/2-y-42}px) scale(.2)`,opacity:0}],{duration:1100,easing:'ease-in-out',fill:'forwards'});anim.onfinish=()=>{flight.remove();if(token===epoch)target.classList.add('next-color')}}
function updateTools(){const complete=mode==='world'?progress.worldComplete():mode==='scene'?progress.sceneComplete():mode==='picture'&&progress.complete();$('#replay').hidden=!complete;$('#previewScene').hidden=mode!=='scene'||progress.sceneComplete();$('#previewScene').textContent=scenePreview?'Show scene progress':'Preview full scene';$('#back').textContent='Back to coloring';applyMotion();}
function applyMotion(){if(!animateEnabled()){if(fitFrame){cancelAnimationFrame(fitFrame);fitFrame=0;resetView()}document.querySelectorAll('.painted-flight').forEach(e=>e.remove())}document.body.classList.toggle('motion-off',!animateEnabled());$('#motion').textContent=animateEnabled()?'Motion on':'Motion off';$('#motion').setAttribute('aria-pressed',String(animateEnabled()));$('#motion').disabled=reduce.matches}
function updateCollectionButtons() {
 const total = VILLAGE_DATA.pictures.length;
 const count = VILLAGE_DATA.pictures.filter(picture => progress.complete(picture.id)).length;
 for (const id of ['pictures','collection','pick']) $(`#${id}`).textContent = `My Pictures · ${count}/${total}`;
}

function nextPicture() {
 const pictures = VILLAGE_DATA.pictures;
 const active = pictures.indexOf(progress.picture());
 const ordered = [...pictures.slice(active), ...pictures.slice(0, active)];
 return ordered.find(picture => !progress.complete(picture.id) && progress.entry(picture.id).filled.size) ??
  ordered.find(picture => !progress.complete(picture.id));
}

function openCollectedPicture(picture) {
 $('#pictureDialog').close();
 loadPicture(picture.id, true);
 if (progress.complete()) $('#pick').focus();
 else $('#title').focus();
}

function pictureCard(picture, featured = false) {
 const complete = progress.complete(picture.id);
 const filled = progress.entry(picture.id).filled.size;
 const percent = Math.min(99, Math.floor(filled * 100 / picture.regions.length));
 const button = document.createElement('button');
 button.className = 'picture-card' + (featured ? ' featured-picture' : '');
 button.innerHTML = svgCrop(picture.crop, !complete, picture.image);
 const copy = document.createElement('span');
 const title = document.createElement('strong');
 const status = document.createElement('small');
 title.textContent = picture.title;
 status.textContent = complete ? 'Complete · View artwork' : filled ? `${percent}% complete · Continue` : 'Start picture';
 copy.append(title, status);
 button.append(copy);
 button.onclick = () => openCollectedPicture(picture);
 return button;
}

function showPictures() {
 const featured = $('#continuePicture');
 const list = $('#pictureList');
 const next = nextPicture();
 featured.replaceChildren();
 featured.hidden = !next;
 if (next) {
  const heading = document.createElement('h3');
  heading.textContent = progress.entry(next.id).filled.size ? 'Continue coloring' : 'Next to color';
  featured.append(heading, pictureCard(next, true));
 }
 list.replaceChildren(...VILLAGE_DATA.scenes.map(item => {
  const section = document.createElement('section');
  section.className = 'collection-area';
  const title = document.createElement('h3');
  const pictures = progress.scenePictures(item.id);
  title.textContent = item.title;
  const count = document.createElement('p');
  count.className = 'muted';
  const done = progress.completedCount(item.id);
  count.textContent = `${done} of ${pictures.length} complete`;
  const cards = document.createElement('div');
  cards.className = 'picture-list';
  cards.append(...pictures.map(picture => pictureCard(picture)));
  section.append(title, count, cards);
  if (done === pictures.length) {
   const viewScene = document.createElement('button');
   viewScene.textContent = 'View animated scene';
   viewScene.onclick = () => {
    $('#pictureDialog').close();
    progress.select(pictures[0].id);
    persist();
    showScene();
    $('#pick').focus();
   };
   section.append(viewScene);
  }
  return section;
 }));
 const completed = VILLAGE_DATA.pictures.filter(picture => progress.complete(picture.id)).length;
 $('#sceneProgress').textContent = `${completed} of ${VILLAGE_DATA.pictures.length} pictures complete`;
 $('#pictureDialog').showModal();
 $('#pictureDialog').scrollTop = 0;
}

function celebratePicture() {
 const title = progress.picture().title;
 if (progress.worldComplete()) { showWorld(); awaken(true); }
 else if (progress.sceneComplete()) { showScene(); awaken(true); }
 else { showPicture(); awaken(false); }
 const offerNext = () => {
  if (document.querySelector('dialog[open]')) return;
  $('#finishedTitle').textContent = `${title} complete!`;
  $('#colorAnother').hidden = !nextPicture();
  $('#finishedDialog').showModal();
 };
 if (animateEnabled()) later(offerNext, 2450);
 else offerNext();
}

$('#seePictures').onclick = () => {
 $('#finishedDialog').close();
 showPictures();
};
$('#colorAnother').onclick = () => {
 const next = nextPicture();
 if (!next) return;
 $('#finishedDialog').close();
 loadPicture(next.id);
 $('#title').focus();
};
$('#openWorld').onclick=()=>{$('#pictureDialog').close();showWorld()};$('#pictures').onclick=showPictures;$('#pick').onclick=showPictures;$('#collection').onclick=showPictures;$('#sceneView').onclick=()=>showScene();$('#previewScene').onclick=()=>showScene(!scenePreview);$('#worldMap').onclick=showWorld;$('#worldView').onclick=showWorld;$('#preview').onclick=showPicture;$('#back').onclick=()=>loadPicture(progress.active);$('#replay').onclick=()=>{const connected=mode!=='picture';if(mode==='world')showWorld();else if(connected)showScene();else showPicture();awaken(connected)};
$('#undo').onclick=()=>{const i=history[progress.active]?.pop();if(i!==undefined){progress.undo(i);persist();renderUI();say('Last region undone.')}};$('#hint').onclick=()=>{const i=regions.findIndex((r,j)=>!filled.has(j)&&r.c===progress.entry().selected),next=i>=0?i:regions.findIndex((r,j)=>!filled.has(j));if(next<0){say('This picture is complete. Preview the finished artwork.');return}progress.entry().selected=regions[next].c;persist();renderUI();resetView();regions[next].p.focus();say(`Try ${regions[next].name.toLowerCase()}.`)};
$('#help').onclick=()=>$('#helpDialog').showModal();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('#reset').onclick=()=>{$('#resetNote').textContent=`Only progress on this picture will be cleared.`;$('#resetDialog').showModal()};$('#confirmReset').onclick=()=>{$('#resetDialog').close();progress.reset();history[progress.active]=[];persist();loadPicture(progress.active)};
$('#motion').onclick=()=>{motion=!motion;try{localStorage.setItem(MOTION_KEY,motion?'on':'off')}catch{}applyMotion()};reduce.addEventListener('change',applyMotion);$('#hideTools').onclick=()=>{document.body.classList.add('tools-hidden');$('#showTools').focus()};$('#showTools').onclick=()=>{document.body.classList.remove('tools-hidden');$('#hideTools').focus()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mode!=='coloring'&&!document.querySelector('dialog[open]'))loadPicture(progress.active)});

const expand = $('#expandCanvas');
let canvasFilled = false;

function updateView() {
 art.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
}

function frameView(fill = false) {
 canvasFilled = fill;
 if (fill) {
  const aspect = art.clientWidth / art.clientHeight || 1;
  const w = 576 * Math.min(aspect, 1), h = w / aspect;
  view = {x: (640 - w) / 2, y: (600 - h) / 2, w, h};
 } else {
  view = {x: 32, y: 12, w: 576, h: 576};
 }
 updateView();
}

function resetView() {
 if (mode === 'scene' || mode === 'world') {
  canvasFilled = false;
  view = {x: 0, y: 0, w: 640, h: 600};
  updateView();
 } else frameView();
}

function zoom(factor, x = view.w / 2, y = view.h / 2) {
 const ratio = view.w / view.h;
 const maxWidth = mode === 'scene' || mode === 'world' ? 640 : canvasFilled ? 576 * Math.max(1, ratio) : 576;
 const width = Math.max(110 * Math.min(1, ratio), Math.min(maxWidth, view.w * factor));
 const change = width / view.w;
 view.x += x * (1 - change);
 view.y += y * (1 - change);
 view.w = width;
 view.h = width / ratio;
 constrainView();
 updateView();
}

expand.onclick = () => {
 const expanded = document.body.classList.toggle('canvas-expanded');
 expand.textContent = expanded ? 'Exit expanded canvas' : 'Expand canvas';
 expand.setAttribute('aria-pressed', String(expanded));
 frameView(expanded);
};
window.addEventListener('resize', () => {
 if (canvasFilled && (mode === 'coloring' || mode === 'picture')) frameView(true);
});
$('#zoom').onclick = $('#plus').onclick = () => zoom(.8);
$('#out').onclick = $('#minus').onclick = () => zoom(1.25);
$('#fit').onclick = $('#viewerFit').onclick = resetView;

function wheelZoom(e) {
 e.preventDefault();
 const rect = art.getBoundingClientRect();
 const scale = Math.min(rect.width / view.w, rect.height / view.h);
 if (!scale) return;
 const x = (e.clientX - rect.left - (rect.width - view.w * scale) / 2) / scale;
 const y = (e.clientY - rect.top - (rect.height - view.h * scale) / 2) / scale;
 const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? rect.height : 1);
 zoom(Math.exp(Math.max(-600, Math.min(600, delta)) * .0015), x, y);
}
art.addEventListener('wheel',wheelZoom,{passive:false});
// A short press colors; movement beyond six CSS pixels becomes a pan.
const pointers=new Map();let gesture=null,suppressClick=false;
function constrainView() {
 const wide = mode === 'scene' || mode === 'world';
 const insetX = wide ? 0 : 32, insetY = wide ? 0 : 12;
 const maxX = 640 - insetX - view.w, maxY = 600 - insetY - view.h;
 view.x = maxX < insetX ? (640 - view.w) / 2 : Math.max(insetX, Math.min(maxX, view.x));
 view.y = maxY < insetY ? (600 - view.h) / 2 : Math.max(insetY, Math.min(maxY, view.y));
}
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
loadPicture(progress.active,true);applyMotion();
