/* Card-created architecture shares the approved fixed-view miniature finish. */
'use strict';
window.CrownCardPieces=(()=>{
 const enabled=CrownTerrain.enabled,file='assets/rampart-13.png';let map=null,failed=false;
 const ready=enabled?new Promise(resolve=>{new THREE.TextureLoader().load(file,texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;map=texture;document.body.dataset.cardPieceAsset='ready';resolve(texture);},undefined,()=>{failed=true;document.body.dataset.cardPieceAsset='failed';resolve(null);});}):Promise.resolve(null);
 function rampart(preview=false){
  const root=new THREE.Group();root.userData.cardPiece='rampart';
  function add(texture){if(root.userData.disposed)return;if(!texture){root.add(CrownModels.rampart());return;}
   const material=new THREE.SpriteMaterial({map:texture,transparent:true,opacity:preview?.48:1,alphaTest:.025,depthWrite:false,toneMapped:false});material.userData.transient=true;
   const art=new THREE.Sprite(material);art.center.set(.5,.18);art.scale.set(1.85,1.85*texture.image.height/texture.image.width,1);art.renderOrder=2;art.userData.cardPiece='rampart';root.add(art);
   const rune=new THREE.Mesh(new THREE.RingGeometry(.68,.72,6),new THREE.MeshBasicMaterial({color:0x7ce5d4,transparent:true,opacity:preview?.6:.32,depthWrite:false,depthTest:false,side:THREE.DoubleSide,toneMapped:false}));rune.material.userData.transient=true;rune.rotation.x=-Math.PI/2;rune.rotation.z=Math.PI/6;rune.position.y=.025;rune.renderOrder=5;root.add(rune);
  }
  if(map||failed)add(map);else ready.then(add);return root;
 }
 function dispose(root){root.userData.disposed=true;root.traverse(o=>{o.geometry?.dispose();if(o.material?.userData.transient)o.material.dispose();});}
 function inspect(){let dialog=document.querySelector('#card-piece-dialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='card-piece-dialog';dialog.className='mini-dialog';dialog.innerHTML='<button class="dialog-close" aria-label="Close rampart inspection">&times;</button><span class="eyebrow">LIVING RAMPART</span><h2>Stone answers the call.</h2><img alt="Detailed limestone rampart with bronze carvings and teal banners" style="display:block;max-height:58vh;max-width:100%;margin:auto"><p>Weathered limestone, bronze inlays and teal banners, raised from the earth to hold a path.</p>';dialog.querySelector('img').src=file;dialog.querySelector('button').addEventListener('click',()=>dialog.close());document.body.append(dialog);}dialog.showModal();}
 return {enabled,rampart,ready,file,dispose,inspect};
})();
