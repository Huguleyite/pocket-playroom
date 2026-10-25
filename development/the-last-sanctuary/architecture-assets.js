/* Architecture study 08: fixed-view illustrated structures, optional board layer. */
'use strict';
window.CrownArchitecture=(()=>{
 const enabled=new URLSearchParams(location.search).get('architecture')==='illustrated'&&new URLSearchParams(location.search).get('terrain')==='illustrated';
 const catalog=[
  {id:'bridge',title:'The old crossing',image:'assets/architecture-bridge-08.png',width:2.35,anchor:.48,copy:'Individual cobbles, worn parapets and an open masonry arch. The shared water passes beneath it; no river is painted into the bridge.',rules:'Crossing · walkable'},
  {id:'shrine',title:'The wayshrine',image:'assets/architecture-shrine-08.png',width:1.68,anchor:.20,copy:'Carved stone, aged bronze and a suspended turquoise relic. Open space between the pillars keeps its silhouette distinct.',rules:'Relic landmark · blocked'},
  {id:'cottage',title:'The keeper’s cottage',image:'assets/architecture-cottage-08.png',width:1.12,anchor:.24,copy:'Uneven slate, oak beams, ironwork and climbing ivy. A small inhabited detail beside the crossing.',rules:'Scenery · existing movement retained'},
  {id:'ruins',title:'The fallen watch',image:'assets/architecture-ruins-08.png',width:1.64,anchor:.22,copy:'Broken limestone, an open pointed window and remnants of a teal banner. A recognizable landmark with a fractured silhouette.',rules:'Ruined walls · blocked'}
 ];
 const bridgeDeckOffset=.42;
 let attached=0;
 function attach(scene,id,tile){
  const item=catalog.find(i=>i.id===id);document.body.dataset.architectureAsset='loading';
  new THREE.TextureLoader().load(item.image,texture=>{
   if(scene.userData.disposed){texture.dispose();return;}
   texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
   let sprite;
   const height=item.width*texture.image.height/texture.image.width;
   if(id==='bridge'){
    // Project the approved artwork onto a raised ground quad. A billboard puts
    // both ramps at the centre's depth, letting the river hide the near ramp.
    // This fixed-view quad preserves the picture while giving each end its
    // actual bank depth; the water remains visible through the open arch.
    const horizontal=Math.hypot(3.5,20),rise=window.CrownRendering?.enabled?15.35:15.8,incline=rise/Math.hypot(horizontal,rise);
    const right=new THREE.Vector3(20/horizontal,0,-3.5/horizontal);
    const up=new THREE.Vector3(-3.5/horizontal/incline,0,-20/horizontal/incline);
    const vertices=[];
    for(const [u,v]of [[0,0],[1,0],[1,1],[0,1]]){
     const point=right.clone().multiplyScalar((u-.5)*item.width).addScaledVector(up,(v-item.anchor)*height);
     vertices.push(point.x,0,point.z);
    }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    geometry.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,1],2));
    geometry.setIndex([0,1,2,0,2,3]);geometry.computeVertexNormals();
    sprite=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.035,depthWrite:false,toneMapped:false,side:THREE.DoubleSide}));
   }else{
    sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,alphaTest:.035,depthWrite:false,toneMapped:false}));
    sprite.center.set(.5,item.anchor);sprite.scale.set(item.width,height,1);
   }
   sprite.position.set(tile.x,tile.y+(id==='bridge'?bridgeDeckOffset:.025),tile.z);sprite.userData.architectureAsset=id;sprite.renderOrder=2;scene.add(sprite);
   if(++attached===4)document.body.dataset.architectureAsset='ready';
  },undefined,()=>{document.body.dataset.architectureAsset='failed';});
 }
 return {enabled,catalog,attach,bridgeDeckOffset};
})();
