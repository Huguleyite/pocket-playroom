const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg',KEY='hidden-magic-midnight-passage-v1',MOTION_KEY='hidden-magic-midnight-motion';
const estateImage = 'assets/hidden-magic-estate.jpg';
const VILLAGE_DATA = {
 image: 'assets/moonlit-passage-midnight.png',
 scene: { x: 0, y: 0, w: 2508, h: 2508 },
 world: { x: 0, y: 0, w: 1536, h: 1024 },
 scenes: [
  { id: 'moonlit-passage', title: 'The Moonlit Passage', image: 'assets/moonlit-passage-midnight.png',
   worldCrop: { x: 24, y: 503, w: 580, h: 500 } },
  { id: 'midnight-archives', title: 'Midnight Archives',
   worldCrop: { x: 18, y: 18, w: 718, h: 490 } },
  { id: 'mirrorwater-canal', title: 'Mirrorwater Canal',
   worldCrop: { x: 564, y: 427, w: 972, h: 597 } },
  { id: 'starwatch-heights', title: 'Starwatch Heights',
   worldCrop: { x: 770, y: 10, w: 766, h: 520 } },
 ],
 pictures: [
  ['moonlit-cabinet', 'The Moonlit Cabinet', 'moonlit-cabinet-nebula.png', 'moonlit-passage'],
  ['moonlit-garden', 'Moonlit Garden', 'moonlit-garden-midnight.png', 'moonlit-passage'],
  ['lantern-greenhouse', 'Lantern Greenhouse', 'lantern-greenhouse-midnight.png', 'moonlit-passage'],
  ['starwell', 'The Starwell', 'starwell-midnight.png', 'moonlit-passage'],
  ['mothlight-library', 'Mothlight Library', 'mothlight-library.jpg', 'midnight-archives'],
  ['ink-alchemist', 'The Ink Alchemist', 'ink-alchemist.jpg', 'midnight-archives'],
  ['clockwork-archive', 'The Clockwork Archive', 'clockwork-archive.jpg', 'midnight-archives'],
  ['constellation-gallery', 'The Constellation Gallery', 'constellation-gallery.jpg', 'midnight-archives'],
  ['firefly-ferry', 'The Firefly Ferry', 'firefly-ferry.jpg', 'mirrorwater-canal'],
  ['mirrorwater-bridge', 'The Mirrorwater Bridge', 'mirrorwater-bridge.jpg', 'mirrorwater-canal'],
  ['pearl-grotto', 'The Pearl Grotto', 'pearl-grotto.jpg', 'mirrorwater-canal'],
  ['tideglass-workshop', 'The Tideglass Workshop', 'tideglass-workshop.jpg', 'mirrorwater-canal'],
  ['stair-of-stars', 'The Stair of Stars', 'stair-of-stars.jpg', 'starwatch-heights'],
  ['orrery-chamber', 'The Orrery Chamber', 'orrery-chamber.jpg', 'starwatch-heights'],
  ['comet-observatory', 'The Comet Observatory', 'comet-observatory.jpg', 'starwatch-heights'],
  ['aurora-terrace', 'The Aurora Terrace', 'aurora-terrace.jpg', 'starwatch-heights'],
 ].map(([id, title, file, sceneId]) => ({
  ...(id === 'moonlit-cabinet' ? MOONLIT_CABINET_MAP : MIDNIGHT_MAPS.maps[id] ?? HIDDEN_MAGIC_EXPANSION[id]),
  id, title, image: 'assets/' + file, sceneId,
  crop: { x: 0, y: 0, w: 1254, h: 1254 },
 })),
};

let stored = null;
try {
 stored = JSON.parse(localStorage.getItem(KEY) || 'null');
 if (!stored) {
  const prior = JSON.parse(localStorage.getItem('hidden-magic-midnight-cabinet-art-v1') || 'null');
  if (Array.isArray(prior?.filled)) {
   const filled = prior.filled.length === MIDNIGHT_MAPS.previousIds.length
    ? MOONLIT_CABINET_MAP.regions.map((_, index) => index)
    : prior.filled.map(id => MIDNIGHT_MAPS.previousIds[id]).filter(id => Number.isInteger(id) && id >= 0);
   stored = { active: 'moonlit-cabinet', pictures: {
    'moonlit-cabinet': { filled, selected: MIDNIGHT_MAPS.previousColors[prior.selected - 1] },
   }};
  }
 }
} catch {}
const discoveries = [
 {picture:'moonlit-cabinet',title:'Bottled Moon',message:'The emerald door opens on a tiny bottled moon.',regions:[0,1]},
 {picture:'moonlit-cabinet',title:'Lantern Sprout',message:'A lantern sprout wakes behind the amethyst door.',regions:[2,3]},
 {picture:'moonlit-cabinet',title:'Sleeping Comet',message:'A sleeping comet glimmers behind the teal door.',regions:[4,5]},
 {picture:'moonlit-garden',title:'Frog Lantern',message:'A frog lantern rises from the pond.',regions:[173,164,192]},
 {picture:'lantern-greenhouse',title:'Moon Moth',message:'A moon moth emerges from the ferns.',regions:[59,111,98]},
];
const discoveryIcons = [
 'M24 4h16v9l-4 3v5l12 11v24q-16 9-32 0V32l12-11v-5l-4-3Zm8 24a11 11 0 1 0 8 15 10 10 0 0 1-8-15Z',
 'M19 50h26l-5 12H24Zm11-4V34Q12 33 9 18q18 1 23 15 1-18 18-24-1 19-15 27v10ZM33 4q9 0 9 9t-9 9-9-9 9-9Z',
 'M38 5l6 13 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2ZM7 38q8 5 19 4-9 8-21 1Zm3 12q12 4 22-1-9 11-23 6Z',
 'M16 22a9 9 0 1 1 15-7h2a9 9 0 1 1 15 7q12 12 4 24-8 12-20 12T12 46q-8-12 4-24Zm8 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM23 38q9 13 18 0Z',
 'M32 27Q16 9 3 13q0 18 17 22Q4 40 12 49q9 6 20-9 11 15 20 9 8-9-8-14 17-4 17-22-13-4-29 14Zm0-9-5-8 2-2 3 6 3-6 2 2Z',
];

function showDiscovery(item) {
 $('#foundTitle').textContent = item.title;
 $('#foundMessage').textContent = item.message;
 $('#discoveryIcon path').setAttribute('d', discoveryIcons[discoveries.indexOf(item)]);
 $('#discoveryIcon path').setAttribute('fill-rule', 'evenodd');
 $('#discoveryReveal').showModal();
}
const progress=new VillageProgress(VILLAGE_DATA,stored),art=$('#art'),scene=$('#scene'),defs=$('#artDefs');
let scenePreview=false;
let regions=[],filled=new Set(),mode='coloring',history={},view={x:0,y:0,w:640,h:600},epoch=0,timers=[],fitFrame=0;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');let motion=true;try{motion=localStorage.getItem(MOTION_KEY)!=='off'}catch{}
function node(tag,attrs){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(progress.serialize()))}catch{say('Progress cannot be saved in this browser; keep this tab open.')}}
function currentScene(){return VILLAGE_DATA.scenes.find(item=>item.id===progress.sceneId())}
function say(text){$('#status').textContent=text}
function stopSequence(){epoch++;timers.forEach(clearTimeout);timers=[];if(fitFrame)cancelAnimationFrame(fitFrame);fitFrame=0;document.querySelectorAll('.painted-flight').forEach(e=>e.remove());$('#toast').classList.remove('visible')}
function later(fn,ms){const token=epoch;timers.push(setTimeout(()=>{if(token===epoch)fn()},ms))}
function animateEnabled(){return motion&&!reduce.matches}
function announce(title,text){$('#toast').innerHTML='';const a=document.createElement('strong'),b=document.createElement('small');a.textContent=title;b.textContent=text;$('#toast').append(a,b);$('#toast').classList.add('visible');later(()=>$('#toast').classList.remove('visible'),4200)}
function image(attrs={}){return node('image',{href:VILLAGE_DATA.image,width:1254,height:1254,'pointer-events':'none',...attrs})}
function setupArt(crop){scene.innerHTML='';defs.innerHTML='<filter id="gray" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/></filter>';const clip=node('clipPath',{id:'cropClip'});clip.append(node('rect',{x:0,y:0,width:crop.w,height:crop.h}));defs.append(clip);const scale=Math.min(616/crop.w,576/crop.h),tx=(640-crop.w*scale)/2,ty=(600-crop.h*scale)/2;scene.setAttribute('transform',`translate(${tx} ${ty}) scale(${scale})`);const cropped=node('g',{'clip-path':'url(#cropClip)'});scene.append(cropped);art.setAttribute('role',mode==='coloring'||(mode==='world'&&!progress.worldComplete())||(mode==='scene'&&!scenePreview&&!progress.sceneComplete())?'group':'img');art.setAttribute('aria-label',mode==='scene'?currentScene().title+' connected scene':mode==='world'?'Hidden Magic estate':progress.picture().title+' coloring picture');return cropped}
function drawPicture(){const p=progress.picture(),crop=p.crop,g=setupArt(crop);regions=p.regions;filled=progress.entry().filled;
 const original=image({id:'pictureSource',href:p.image,x:-crop.x,y:-crop.y});defs.append(original);g.append(node('use',{href:'#pictureSource',filter:mode==='coloring'?'url(#gray)':'none','pointer-events':'none'}));
 if(mode==='coloring')regions.forEach((r,i)=>{const group=node('g',{}),clip=node('clipPath',{id:`region${i}`});const shape={d:r.d};clip.append(node('path',{...shape,'clip-rule':'evenodd'}));const color=node('use',{href:'#pictureSource','clip-path':`url(#region${i})`,class:'paint-wash','pointer-events':'none'}),path=node('path',{...shape,class:'region','fill-rule':'evenodd',fill:'transparent',tabindex:0,role:'button','aria-label':`${r.name}, color ${r.c}`}),text=node('text',{x:r.x,y:r.y,class:'num','font-size':Math.max(14,Math.min(32,r.radius*1.4))});text.style.fontSize=Math.max(14,Math.min(32,r.radius*1.4))+'px';group.append(clip,color,path,text);g.append(group);r.p=path;r.t=text;r.color=color;path.onclick=()=>paint(i);path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();paint(i)}}});
 else if(progress.complete())addAmbient(g,crop,false,p.id);
}
function svgCrop(crop,gray=false,href=VILLAGE_DATA.image){return `<svg viewBox="${crop.x} ${crop.y} ${crop.w} ${crop.h}" aria-hidden="true"><image href="${href}" width="1254" height="1254" ${gray?'style="filter:grayscale(1)"':''}/></svg>`}
function renderUI(){const p=progress.picture(),entry=progress.entry();$('#title').textContent=p.title;$('#eyebrow').textContent=currentScene().title;updateCollectionButtons();$('#percent').textContent=Math.floor(entry.filled.size*100/p.regions.length)+'%';$('#bar').style.width=$('#percent').textContent;$('#count').textContent=`${entry.filled.size} of ${p.regions.length} regions brought to life`;
 if(mode==='coloring')regions.forEach((r,i)=>{const done=entry.filled.has(i);r.color.setAttribute('opacity',done?'1':'0');r.p.classList.toggle('match',!done&&r.c===entry.selected);r.p.setAttribute('tabindex',!done&&r.c===entry.selected?'0':'-1');r.p.setAttribute('aria-label',`${r.name}, color ${r.c}${done?', colored':''}`);r.t.textContent=done?'':r.c});
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
function paint(i){if(mode!=='coloring')return;const id=progress.active;if(!progress.fill(i)){if(!filled.has(i))say(`Choose color ${regions[i].c} for this region.`);return}(history[id]??=[]).push(i);persist();renderUI();const r=regions[i];const found=discoveries.find(item=>item.picture===id&&item.regions.includes(i)&&item.regions.every(index=>filled.has(index)));if(animateEnabled()){const star=node('path',{d:`M${r.x-4} ${r.y} h8 M${r.x} ${r.y-4} v8`,class:'art-sparkle','pointer-events':'none'});scene.lastChild.append(star);later(()=>star.remove(),700)}say('Color restored.');if(!regions.some((v,j)=>v.c===r.c&&!filled.has(j))){$('#palette').children[r.c-1].classList.add('color-complete');say(`Color ${r.c} complete.`)}if(progress.complete())celebratePicture();else if(found){say(found.title+' discovered!');showDiscovery(found);}}
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
  ? 'Four pictures collected · a living scene'
  : scenePreview ? 'Full-color preview · progress unchanged'
  : `${progress.completedCount()} of 4 pictures complete · select a picture to color`;
 setTitle(currentScene().title,subtitle);
 resetView();
 updateTools();
}

function areaSize(item=currentScene()) {
 if (item.image) return VILLAGE_DATA.scene;
 return {x:0,y:0,w:item.worldCrop.w,h:item.worldCrop.h};
}

function areaArt(item) {
 if (item.image) return {href:item.image, x:0, y:0, width:2508, height:2508};
 const {x,y}=item.worldCrop;
 return {href:estateImage, x:-x, y:-y, width:1536, height:1024};
}

function assemblySvg(){
 const {w,h}=areaSize();
 const attrs=Object.entries(areaArt(currentScene())).map(([key,value])=>key+'="'+value+'"').join(' ');
 return '<svg viewBox="0 0 '+w+' '+h+'" aria-hidden="true"><image '+attrs+'/></svg>';
}

function addMapTarget(group, bounds, title, activate) {
 const tile=node('rect',{...bounds,class:'scene-tile',tabindex:0,role:'button','aria-label':title});
 tile.onclick=activate;
 tile.onkeydown=event=>{
  if(event.key==='Enter'||event.key===' '){event.preventDefault();activate()}
 };
 group.append(tile);
}

function showWorld(){
 stopSequence();
 mode='world';
 gallery();
 const group=setupArt(VILLAGE_DATA.world);
 const complete=progress.worldComplete();
 group.append(node('image',{href:estateImage,width:1536,height:1024,
  filter:complete?'none':'url(#gray)','pointer-events':'none'}));
 if(complete){
  const ambient=node('g',{class:'scene-ambient awake','aria-hidden':'true'});
  ambient.append(node('circle',{r:5,class:'world-firefly'}),node('circle',{r:4,class:'world-firefly delay'}));
  group.append(ambient);
 }else{
  const markers=[[275,780],[290,245],[1050,780],[1195,302]];
  VILLAGE_DATA.scenes.forEach((item,index)=>{
   const [x,y]=markers[index];
   const count=progress.completedCount(item.id);
   addMapTarget(group,{x:x-210,y:y-40,width:420,height:80,rx:18},
    'Open '+item.title+', '+count+' of 4 pictures collected',()=>{
     const pictures=progress.scenePictures(item.id);
     progress.select((pictures.find(picture=>!progress.complete(picture.id))??pictures[0]).id);
     persist();
     showScene();
     $('#sceneView').focus();
    });
   const label=node('text',{x,y:y+10,class:'future-label'});
   label.style.fontSize='34px';
   label.textContent=item.title+' · '+count+'/4';
   group.append(label);
  });
 }
 setTitle('Hidden Magic',complete?'All 16 pictures collected':progress.completedScenes()+' of 4 areas complete');
 resetView();
 updateTools();
}

function drawScene(){
 const size=areaSize();
 const group=setupArt(size);
 const width=size.w/2,height=size.h/2;
 const complete=progress.sceneComplete();
 const source=node('image',{id:'connectedVillageSource',...areaArt(currentScene())});
 defs.append(source);
 group.append(node('use',{href:'#connectedVillageSource',filter:complete||scenePreview?'none':'url(#gray)','pointer-events':'none'}));
 if (complete) {
  const ambient = node('g', {class:'scene-ambient awake', 'aria-hidden':'true'});
  if(currentScene().image) ambient.innerHTML = '<ellipse class="lamp-glow" cx="1540" cy="2030" rx="100" ry="105"/><ellipse class="pond-ripple" cx="1070" cy="1850" rx="235" ry="60"/><path class="area-moth" d="M0 0q-17-21-32-9 2 14 22 15-14 12-1 15 8-3 11-13 3 10 11 13 13-3-1-15 20-1 22-15Q17-21 0 0Z"/>';
  else {
   const lantern=node('circle',{cx:size.w*.48,cy:size.h*.68,r:9,class:'lamp-glow'});
   ambient.append(lantern);
  }
  group.append(ambient);
  return;
 }
 progress.scenePictures().forEach((picture,index)=>{
  const x=index%2*width;
  const y=Math.floor(index/2)*height;
  const done=progress.complete(picture.id);
  if(done){
   const clipId=`collected-quarter-${index}`;
   const clip=node('clipPath',{id:clipId});
   clip.append(node('rect',{x,y,width,height}));
   defs.append(clip);
   group.append(node('use',{href:'#connectedVillageSource','clip-path':`url(#${clipId})`,'pointer-events':'none'}));
  }
  const count=progress.entry(picture.id).filled.size;
  addMapTarget(group,{x,y,width,height},'Open '+picture.title+', '+count+' of '+picture.regions.length+' regions',
   ()=>loadPicture(picture.id,done));
  const label=node('text',{x:x+width/2,y:y+height*.95,class:'tile-label'});
  label.style.fontSize=size.w*.026+'px';
  label.style.strokeWidth=size.w*.003+'px';
  label.textContent=picture.title+' · '+(done?'Collected':Math.floor(count*100/picture.regions.length)+'%');
  group.append(label);
 });
}
function addAmbient(group, crop, connected, id = progress.active) {
 const locations = {'moonlit-cabinet':[110,232], 'moonlit-garden':[622,562], 'lantern-greenhouse':[629,426], 'starwell':[630,804]};
 const [cx, cy] = locations[id];
 group.append(node('ellipse', {class:'lamp-glow', cx, cy, rx:45, ry:35, 'pointer-events':'none'}));
}
function animateSceneReveal(){if(!animateEnabled())return;const isWorld=mode==='world',c=isWorld?VILLAGE_DATA.world:areaSize(),index=progress.scenePictures().findIndex(v=>v.id===progress.active),p=isWorld?currentScene().worldCrop:{x:index%2*c.w/2,y:Math.floor(index/2)*c.h/2,w:c.w/2,h:c.h/2},scale=Math.min(616/c.w,576/c.h),cx=(640-c.w*scale)/2+(p.x-c.x+p.w/2)*scale,cy=(600-c.h*scale)/2+(p.y-c.y+p.h/2)*scale;view={w:Math.min(480,Math.max(260,p.w*scale+24)),h:0,x:0,y:0};view.h=view.w*600/640;view.x=cx-view.w/2;view.y=cy-view.h/2;constrainView();const from={...view},start=performance.now(),token=epoch;updateView();function frame(now){if(token!==epoch)return;const t=Math.min(1,(now-start)/1450),ease=1-Math.pow(1-t,3);view={x:from.x*(1-ease),y:from.y*(1-ease),w:from.w+(640-from.w)*ease,h:from.h+(600-from.h)*ease};updateView();if(t<1)fitFrame=requestAnimationFrame(frame);else fitFrame=0;}fitFrame=requestAnimationFrame(frame);}
function awaken(connected){if(connected)animateSceneReveal();const a=scene.querySelector('.scene-ambient');if(a){a.classList.remove('awake');later(()=>a.classList.add('awake'),400)}announce(connected?(mode==='world'?'Hidden Magic awakens':currentScene().title+' awakens'):progress.picture().title,connected?(mode==='world'?'All 16 pictures joined · estate collected':'Four pictures joined · scene collected'):'Picture collected · saved to My Pictures');if(animateEnabled()&&mode!=='world')later(flyToCollection,1200);later(()=>$('#pick').focus(),2200)}
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
 if (progress.worldComplete()) return;
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
$('#discoveries').onclick = () => {
 const list = $('#discoveryList');
 list.replaceChildren();
 for (const item of discoveries) {
  const found = item.regions.every(id => progress.entry(item.picture).filled.has(id));
  const row = document.createElement('p');
  row.textContent = found ? item.title + ' · ' + item.message : 'Undiscovered · ' + VILLAGE_DATA.pictures.find(p => p.id === item.picture).title;
  if (!found && item.picture === progress.active && mode === 'coloring') {
   const guide = document.createElement('button');
   guide.textContent = 'Find a clue';
   guide.onclick = () => {
    $('#discoveryDialog').close();
    const id = item.regions.find(index => !filled.has(index));
    const r = regions[id];
    progress.entry().selected = r.c;
    persist();
    renderUI();
    const artScale = 576 / 1254;
    view = {w:200,h:187.5,x:32+r.x*artScale-100,y:12+r.y*artScale-93.75};
    constrainView();
    updateView();
    r.p.focus({preventScroll:true});
    say('Color the highlighted surface to uncover a clue.');
   };
   row.append(' ', guide);
  }
  list.append(row);
 }
 $('#discoveryDialog').showModal();
};
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
