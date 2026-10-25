/* One continuous world-mapped water surface, with land-facing shores only. */
'use strict';
window.CrownWater=(()=>{
 const cache=new Map();
 function texture(file){if(!cache.has(file))cache.set(file,new Promise((resolve,reject)=>{new THREE.TextureLoader().load(file,t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;resolve(t);},undefined,reject);}));return cache.get(file);}
 function geometry(){const positions=[],uvs=[],indices=[],lookup=new Map();return {
  vertex(key,x,y,z){if(lookup.has(key))return lookup.get(key);const index=positions.length/3;positions.push(x,y,z);uvs.push((x+9)/18,(z+7.5)/15);lookup.set(key,index);return index;},
  triangle(a,b,c){indices.push(a,b,c);},
  finish(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();return g;}
 };}
 function mesh(g,material,geo){const o=new THREE.Mesh(geo,material);g.add(o);return o;}
 function build(parent,tiles,{level=.105,shoreWidth=.115}={}){
  const T=THREE,top=CrownWaterTopology.analyze(tiles),root=new T.Group();root.userData.waterTopology=top;parent.add(root);
  const surface=geometry();
  for(const cell of top.waterCells){const c=surface.vertex('c'+cell.id,cell.x,level,cell.z),vs=CrownWaterTopology.vertices(cell.a,cell.b).map(v=>surface.vertex(v.key,v.x,level,v.z));for(let i=0;i<6;i++)surface.triangle(c,vs[(i+1)%6],vs[i]);}
  const water=new T.MeshBasicMaterial({color:0x35888b,side:T.DoubleSide,toneMapped:false});mesh(root,water,surface.finish());
  const shore=new T.MeshBasicMaterial({color:0x776c54,side:T.DoubleSide,toneMapped:false});
  const bank=geometry(),innerNormals=new Map();
  for(const edge of top.shoreEdges)for(const v of [edge.a,edge.b]){if(!innerNormals.has(v.key))innerNormals.set(v.key,[]);innerNormals.get(v.key).push([edge.nx,edge.nz]);}
  const inset=v=>{const ns=innerNormals.get(v.key),sx=ns.reduce((s,n)=>s+n[0],0),sz=ns.reduce((s,n)=>s+n[1],0),length=Math.hypot(sx,sz)||1,nx=sx/length,nz=sz/length,miter=shoreWidth/Math.max(.45,nx*ns[0][0]+nz*ns[0][1]);return {x:v.x+nx*miter,z:v.z+nz*miter};};
  for(const edge of top.shoreEdges){const a=edge.a,b=edge.b,ia=inset(a),ib=inset(b),v0=bank.vertex('o'+a.key,a.x,level+.024,a.z),v1=bank.vertex('o'+b.key,b.x,level+.024,b.z),v2=bank.vertex('i'+a.key,ia.x,level+.012,ia.z),v3=bank.vertex('i'+b.key,ib.x,level+.012,ib.z);bank.triangle(v0,v2,v1);bank.triangle(v1,v2,v3);}
  mesh(root,shore,bank.finish());
  document.body.dataset.waterAsset='loading';
  Promise.all([texture('assets/water-surface-07.png'),texture('assets/shore-material-07.png')]).then(([waterTexture,shoreTexture])=>{if(root.userData.disposed)return;water.color.set(0xffffff);water.map=waterTexture;water.needsUpdate=true;shore.color.set(0xffffff);shore.map=shoreTexture;shore.needsUpdate=true;document.body.dataset.waterAsset='ready';}).catch(()=>{document.body.dataset.waterAsset='failed';});
  return root;
 }
 return {build};
})();
