/* Terrain phase: optional fixed-view illustrated terrain assets. */
'use strict';
window.CrownTerrain=(()=>{
 const enabled=new URLSearchParams(location.search).get('terrain')==='illustrated';
 const catalog=[
  {id:'meadow',title:'Meadow',image:'assets/terrain-meadow-06.png',width:2.08,vertical:.74,anchor:.48,copy:'Fine grass, exposed soil, moss, scattered slate and small wildflowers. A clear center leaves room for a miniature.',rules:'Open ground · walkable'},
  {id:'woodland',title:'Woodland',image:'assets/terrain-woodland-06.png',width:2.20,vertical:1.20,anchor:.20,copy:'Natural branching trees, layered foliage, roots, leaf litter and ferns. A distinct forest profile with a visible ground footprint.',rules:'Forest · blocked in the current test'},
  {id:'rocky',title:'Rocky ground',image:'assets/terrain-rocky-06.png',width:2.08,vertical:.78,anchor:.46,copy:'Weathered slate, fractured rock, lichen and grass. The outcrop sits toward the back, leaving the front and center open.',rules:'Ground treatment · existing tile rules retained'},
  {id:'river',title:'Shoreline reference',image:'assets/terrain-river-06.png',width:2.08,vertical:.74,anchor:.48,copy:'The water-and-bank art reference. The board now builds connected water areas and land-facing shorelines instead of repeating this straight segment.',rules:'Art reference · water connections are generated'}
 ];
 const byId=id=>catalog.find(t=>t.id===id),textures=new Map();let loaded=0,failed=false,foundationTexture;
 function load(item){
  if(!textures.has(item.id))textures.set(item.id,new Promise((resolve,reject)=>{
   new THREE.TextureLoader().load(item.image,texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;loaded++;resolve(texture);if(loaded===3&&!failed)document.body.dataset.terrainAsset='ready';},undefined,error=>{failed=true;document.body.dataset.terrainAsset='failed';reject(error);});
  }));
  return textures.get(item.id);
 }
 function attach(scene,tile){
  if(tile.type==='water'||tile.type==='bridge')return;
  // Artwork silhouettes are decorative, not the boundary of a playable hex.
  // A real ground footprint shares the water lattice so banks cannot float apart.
  const axial=CrownWaterTopology.axial(tile),corners=CrownWaterTopology.vertices(axial.a,axial.b),top=tile.y-.055,bottom=.09;
  const positions=[tile.x,top,tile.z],uvs=[.5,.5],indices=[];
  for(const v of corners){positions.push(v.x,top,v.z);uvs.push(.5+(v.x-tile.x)/2.08,.5+(v.z-tile.z)/2.08);}
  for(let i=0;i<6;i++)indices.push(0,(i+1)%6+1,i+1);
  const groundGeo=new THREE.BufferGeometry();groundGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));groundGeo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));groundGeo.setIndex(indices);groundGeo.computeVertexNormals();
  const groundMat=new THREE.MeshBasicMaterial({color:0x77794b,side:THREE.DoubleSide,toneMapped:false});
  const ground=new THREE.Mesh(groundGeo,groundMat);ground.userData.terrainFoundation=true;scene.add(ground);
  const sides=[];
  for(let i=0;i<6;i++){const a=corners[i],b=corners[(i+1)%6];sides.push(a.x,top,a.z,b.x,top,b.z,a.x,bottom,a.z,b.x,top,b.z,b.x,bottom,b.z,a.x,bottom,a.z);}
  const sideGeo=new THREE.BufferGeometry();sideGeo.setAttribute('position',new THREE.Float32BufferAttribute(sides,3));sideGeo.computeVertexNormals();
  const bank=new THREE.Mesh(sideGeo,new THREE.MeshBasicMaterial({color:0x514a34,side:THREE.DoubleSide,toneMapped:false}));bank.userData.terrainBank=true;scene.add(bank);
  load(byId('meadow')).then(source=>{if(scene.userData.disposed)return;if(!foundationTexture){foundationTexture=source.clone();foundationTexture.repeat.set(.18,.18);foundationTexture.offset.set(.24,.54);foundationTexture.needsUpdate=true;}groundMat.map=foundationTexture;groundMat.color.set(0xffffff);groundMat.needsUpdate=true;}).catch(()=>{});
  const id=tile.type==='forest'?'woodland':['ruin','shrine','rocky'].includes(tile.type)?'rocky':'meadow',item=byId(id);
  document.body.dataset.terrainAsset='loading';
  load(item).then(texture=>{
   if(scene.userData.disposed)return;
   const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,alphaTest:.035,depthWrite:false,toneMapped:false}));
   sprite.renderOrder=1;
   sprite.center.set(.5,item.anchor);sprite.scale.set(item.width,item.width*texture.image.height/texture.image.width*item.vertical,1);sprite.position.set(tile.x,tile.y-.025,tile.z);sprite.userData.terrainAsset=id;scene.add(sprite);if(loaded===3&&!failed)document.body.dataset.terrainAsset='ready';
  }).catch(()=>{tile.mesh.visible=true;});
 }
 return {enabled,catalog,attach};
})();
