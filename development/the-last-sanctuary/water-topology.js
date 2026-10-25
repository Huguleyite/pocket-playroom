/* Shared hex adjacency and water boundaries. No rendering or asset assumptions. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.CrownWaterTopology=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const steps=[[0,1],[-1,1],[-1,0],[0,-1],[1,-1],[1,0]],corners=[[1,1],[0,2],[-1,1],[-1,-1],[0,-2],[1,-1]];
 const id=(a,b)=>`${a},${b}`;
 function axial(t){return {a:t.a??(t.q-(t.r-(t.r&1))/2),b:t.b??t.r};}
 function cell(a,b,type='land'){return {a,b,q:a+(b-(b&1))/2,r:b,type};}
 function point(a,b,radius=1.04){return {x:Math.sqrt(3)*radius*(a+b/2),z:1.5*radius*b};}
 function vertices(a,b,radius=1.04){return corners.map(([dx,dz])=>{const ix=2*a+b+dx,iz=3*b+dz;return {key:`${ix}:${iz}`,x:ix*Math.sqrt(3)*radius/2,z:iz*radius/2};});}
 function isWater(t){return t.water===true||t.type==='water'||t.type==='bridge';}
 function analyze(tiles,radius=1.04){
  const map=new Map(tiles.map(source=>{const {a,b}=axial(source);return [id(a,b),{a,b,id:id(a,b),source,...point(a,b,radius)}];}));
  const waterCells=[...map.values()].filter(t=>isWater(t.source)),water=new Map(waterCells.map(t=>[t.id,t]));
  const shoreEdges=[],openEdges=[],sharedEdges=[],allBoundaryEdges=[];
  for(const t of waterCells){const vs=vertices(t.a,t.b,radius);for(let side=0;side<6;side++){
   const [da,db]=steps[side],neighborId=id(t.a+da,t.b+db),neighbor=map.get(neighborId),a=vs[side],b=vs[(side+1)%6];
   const e={cell:t.id,side,a,b,neighbor:neighborId};
   if(water.has(neighborId)){if(t.id<neighborId)sharedEdges.push(e);continue;}
   allBoundaryEdges.push(e);
   if(neighbor){const mx=(a.x+b.x)/2,mz=(a.z+b.z)/2,nx=t.x-mx,nz=t.z-mz,l=Math.hypot(nx,nz);shoreEdges.push({...e,nx:nx/l,nz:nz/l});}else openEdges.push(e);
  }}
  const seen=new Set(),components=[];
  for(const start of waterCells){if(seen.has(start.id))continue;const component=[],queue=[start];seen.add(start.id);while(queue.length){const current=queue.pop();component.push(current.id);for(const [da,db]of steps){const next=water.get(id(current.a+da,current.b+db));if(next&&!seen.has(next.id)){seen.add(next.id);queue.push(next);}}}components.push(component);}
  return {waterCells,shoreEdges,openEdges,sharedEdges,allBoundaryEdges,components};
 }
 return {steps,corners,id,axial,cell,point,vertices,isWater,analyze};
});
