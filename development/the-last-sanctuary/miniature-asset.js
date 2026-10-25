/* Approved fixed-view illustrated miniature approach. These assets are not rotatable sculpts. */
'use strict';
window.CrownMiniatureStudy=(()=>{
 const mode=new URLSearchParams(location.search).get('miniature'),enabled=['seren','company'].includes(mode);
 const roster=[
  {id:'mage',name:'Seren',role:'Arcane Mage',image:'assets/seren-miniature-study-03.png',height:2.65,anchor:.008,tag:'THE PATHMAKER',copy:'Teal robes, an ivory mantle, individually defined braids and a crescent crystal staff. The approved reference for the company.',identity:'Changes paths, terrain and tactical possibilities.'},
  {id:'guardian',name:'Aldric',role:'Shield Guardian',image:'assets/guardian-miniature-04.png',height:2.55,anchor:.008,tag:'THE UNYIELDING',copy:'A broad ivory tower shield, layered plate armor and a raised blade. A grounded silhouette built to protect the company.',identity:'Holds crossings and protects allies.'},
  {id:'commander',name:'Commander',role:'Banner Commander',image:'assets/commander-miniature-05.png',height:3.12,anchor:.06,tag:'THE RALLYING STANDARD',copy:'A seasoned older commander with short silver hair, a broad face and a steady authoritative expression. Her heraldic banner and ivory command cloak preserve the company’s shared visual identity.',identity:'Coordinates allies and controls objectives.'},
  {id:'rider',name:'Rider',role:'Mounted Lancer',image:'assets/rider-miniature-05.png',height:3.15,anchor:.06,tag:'THE SWIFT RESPONSE',copy:'A younger freckled cavalry soldier with auburn hair and an open-faced steel helmet. Her dapple-grey horse and teal pennant keep her mounted role unmistakable.',identity:'Flanks and intercepts.'},
  {id:'ranger',name:'Ranger',role:'Hooded Ranger',image:'assets/ranger-miniature-04.png',height:2.55,anchor:.06,tag:'THE WATCHFUL EYE',copy:'A deep teal hood, weathered leather, a curved longbow and a sculpted quiver. A lighter silhouette with a clear ranged identity.',identity:'Controls open lanes from a distance.'}
 ];
 const get=id=>roster.find(u=>u.id===id);
 const uses=id=>enabled&&(id==='mage'||mode==='company'&&id==='guardian');
 let pending=0,failed=false;
 function create(id='mage'){
  const item=get(id),root=new THREE.Group();root.userData.role=id;pending++;document.body.dataset.miniatureAsset='loading';
  new THREE.TextureLoader().load(item.image,texture=>{
   texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
   const material=new THREE.SpriteMaterial({map:texture,transparent:true,alphaTest:.025,depthWrite:false,toneMapped:false});
   const sprite=new THREE.Sprite(material);sprite.center.set(.5,['mage','guardian'].includes(id)?.10:item.anchor);sprite.scale.set(item.height*texture.image.width/texture.image.height,item.height,1);sprite.userData.unit=id;sprite.renderOrder=3;root.add(sprite);
   const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),g=ctx.createRadialGradient(64,64,8,64,64,61);g.addColorStop(0,'rgba(0,0,0,.42)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
   const contact=new THREE.Mesh(new THREE.PlaneGeometry(1.35,1.35),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,toneMapped:false}));contact.rotation.x=-Math.PI/2;contact.position.y=.012;root.add(contact);
   pending--;document.body.dataset.miniatureAsset=failed?'failed':pending?'loading':'ready';
  },undefined,()=>{if(CrownModels[id])root.add(CrownModels[id]());pending--;failed=true;document.body.dataset.miniatureAsset='failed';});
  return root;
 }
 function inspect(id='mage'){
  const item=get(id);let dialog=document.querySelector('#illustrated-mini-dialog');
  if(!dialog){dialog=document.createElement('dialog');dialog.id='illustrated-mini-dialog';dialog.className='mini-dialog';dialog.innerHTML='<button class="dialog-close" aria-label="Close illustrated miniature">×</button><span class="eyebrow">THE COMPANY · MINIATURE PHASE</span><h2></h2><img style="display:block;max-height:58vh;max-width:100%;margin:0 auto"><p>This is a detailed illustrated miniature used in the fixed-view board test. It is not a rotatable 3D model.</p>';document.body.append(dialog);dialog.querySelector('button').addEventListener('click',()=>dialog.close());}
  dialog.querySelector('h2').textContent=item.name+', '+item.role;const img=dialog.querySelector('img');img.src=item.image;img.alt=item.copy;dialog.showModal();
 }
 return {enabled,mode,roster,get,uses,create,inspect};
})();
