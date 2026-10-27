export const tools=['channel','reeds','tree','flowers','fern','bridge'];
export const decorations=['bench','pot','birdbath','lantern','stones'];
export const waterItem=t=>t==='channel'||t==='bridge';
export const neighbors=(i,n)=>[i>=n?i-n:-1,i%n<n-1?i+1:-1,i<n*(n-1)?i+n:-1,i%n?i-1:-1].filter(x=>x>=0);
export function derive(level,items){
 const {n,map}=level,adj=i=>neighbors(i,n),wet=new Set(),queue=[];
 map.forEach((v,i)=>{if(v==='I'){wet.add(i);queue.push(i);}});
 for(let q=0;q<queue.length;q++)for(const j of adj(queue[q]))if(!wet.has(j)&&(waterItem(items[j])||map[j]==='P')){wet.add(j);queue.push(j);}
 const ponds=[],seen=new Set();map.forEach((v,i)=>{if(v!=='P'||seen.has(i))return;const cells=[i];seen.add(i);for(let q=0;q<cells.length;q++)for(const j of adj(cells[q]))if(map[j]==='P'&&!seen.has(j)){seen.add(j);cells.push(j);}ponds.push({cells,filled:cells.some(j=>wet.has(j)),reeds:new Set(),clean:false});});
 const moist=new Set(),reeds=new Set(),trees=new Set(),shade=new Set(),flowers=new Set(),ferns=new Set();
 const wetNeighbor=i=>adj(i).some(j=>wet.has(j)&&(waterItem(items[j])||map[j]==='P'));
 map.forEach((v,i)=>{if(v==='.'&&wetNeighbor(i))moist.add(i);});
 items.forEach((v,i)=>{if(v==='reeds')for(const pond of ponds)if(pond.filled&&adj(i).some(j=>pond.cells.includes(j))){reeds.add(i);pond.reeds.add(i);}});
 ponds.forEach(p=>p.clean=p.filled&&p.reeds.size>=2);
 map.forEach((v,i)=>{if((items[i]==='tree'||v==='T')&&wetNeighbor(i)){trees.add(i);adj(i).forEach(j=>shade.add(j));}});
 items.forEach((v,i)=>{if(v==='flowers'&&moist.has(i)&&!shade.has(i))flowers.add(i);if(v==='fern'&&moist.has(i)&&shade.has(i))ferns.add(i);});
 const walkable=i=>['=','A','B'].includes(map[i])||(map[i]==='.'&&(!items[i]||items[i]==='bridge'));
 const entrance=map.indexOf('A'),destination=map.indexOf('B'),walk=new Set(),route=[];
 if(entrance>=0){const q=[entrance],prev=new Map();walk.add(entrance);for(let k=0;k<q.length;k++)for(const j of adj(q[k]))if(walkable(j)&&!walk.has(j)){walk.add(j);prev.set(j,q[k]);q.push(j);}if(walk.has(destination)){let i=destination;while(i!==undefined){route.push(i);i=prev.get(i);}route.reverse();}}
 const bridges=new Set([...wet].filter(i=>items[i]==='bridge'));
 const counts={wet:[...wet].filter(i=>waterItem(items[i])).length,flowers:flowers.size,trees:trees.size,reeds:reeds.size,ferns:ferns.size,bridges:bridges.size,access:route.length?1:0,ponds:ponds.filter(p=>p.clean).length};
 const goals=level.goals.map(g=>({...g,value:counts[g.key],met:counts[g.key]>=g.target}));
 return {wet,moist,reeds,trees,shade,flowers,ferns,bridges,ponds,walk,route,counts,goals,complete:goals.every(g=>g.met),wildlife:{butterflies:flowers.size>=3,frogs:ponds.some(p=>p.clean),birds:trees.size>=2}};
}
export function remaining(level,items,type){return (level.inventory[type]||0)-items.filter(v=>v===type).length;}
export function place(level,items,i,type){
 if(type==='inspect')return {items};
 if(level.map[i]!=='.')return {error:'This is a fixed feature. Work in the soil spaces.'};
 if(type==='remove'){const next=[...items];next[i]=null;return {items:next};}
 if(!tools.includes(type)||!level.inventory[type])return {error:'This tool is introduced in a later place.'};
 if(type==='reeds'&&!neighbors(i,level.n).some(j=>level.map[j]==='P'))return {error:'Plant reeds beside a pond basin, sharing an edge.'};
 if(items[i]===type)return {items};
 if(remaining(level,items,type)<=0)return {error:'All of these are in the garden. Remove one to use it elsewhere; everything is refunded.'};
 const next=[...items];next[i]=type;return {items:next};
}
export function decorate(level,items,decs,i,type){
 if(!['.','='].includes(level.map[i])||items[i])return {error:'Decorate an empty soil space or a fixed path. Plants and waterways need their own space.'};
 if(!decorations.includes(type))return {error:'Choose a decoration from the tray.'};
 if(decs[i]===type)return {decs};
 if(decs.filter(v=>v===type).length>=(level.decorations?.[type]||0))return {error:'All of these are placed. Remove one for a full refund.'};
 const next=[...decs];next[i]=type;return {decs:next};
}
export function describe(level,items,s,i){
 const feature=level.map[i],item=items[i];
 if(feature==='I')return 'Water inlet: connect a channel or bridge beside the spring.';
 if(feature==='#')return 'Old masonry and climbing ivy. This fixed feature stays.';
 if(feature==='=')return 'A fixed garden path. Decorations may sit here without closing the walk.';
 if(feature==='A')return 'Garden gate: keep a walk open to the seat marked with a flag. Bare soil, paths and bridges are walkable.';
 if(feature==='B')return s.counts.access?'Meeting seat: the walk from the gate is open.':'Meeting seat: connect to the gate across bare soil, paths and bridges. Plants and channels block the walk.';
 if(feature==='P'){const p=s.ponds.find(p=>p.cells.includes(i));return !p.filled?'Dry basin: bring an unbroken waterway here.':p.clean?'Clear pond: thriving reeds have welcomed the frogs.':`This pond needs ${2-p.reeds.size===1?'one more thriving reed bed.':'two thriving reed beds.'}`;}
 if(item==='channel')return s.wet.has(i)?'Flowing channel: moist banks, but walkers need a bridge to cross.':'Dry channel: join it to the inlet through channels, bridges or ponds.';
 if(item==='bridge')return s.wet.has(i)?'Flowing footbridge: water passes below, walkers pass above. It moistens the banks just like a channel.':'Dry footbridge: connect to the inlet for water below. The deck is already walkable.';
 if(item==='reeds')return s.reeds.has(i)?'Thriving reeds: cleaning this connected pond.':'Reeds will thrive when this pond fills.';
 if(item==='tree'||feature==='T')return s.trees.has(i)?'Healthy tree: shades its four neighboring spaces. Ferns can unfurl in moist shade.':'Dormant tree: bring water beside this space.';
 if(item==='flowers')return !s.moist.has(i)?'Dormant flowers: bring water beside this space.':s.shade.has(i)?'These flowers need sunlight. Try ferns here, or move the tree.':'Blooming flowers: water and sunlight, just right.';
 if(item==='fern')return !s.moist.has(i)?'Curled fern: bring water beside this space.':!s.shade.has(i)?'This fern needs shade from a healthy neighboring tree.':'Unfurled fern: cool, moist shade is just right.';
 return s.moist.has(i)?s.shade.has(i)?'Moist, shaded soil: a good place for ferns.':'Moist, sunny soil: flowers will bloom here.':'Dry soil: bring water beside this space.';
}
export function advice(level,s){
 if(!s.counts.wet)return 'Start beside the inlet. Channels and bridges both carry water when joined edge to edge.';
 const goal=key=>level.goals.find(g=>g.key===key)?.target||0;
 if(s.counts.ponds<goal('ponds'))return s.ponds.some(p=>!p.filled)?'Reach each basin with a continuous waterway. Corners do not connect.':'Each separate pond needs two thriving reed beds of its own.';
 if(s.counts.trees<goal('trees'))return 'Trees need a wet neighbor. Keep some sunny banks for flowers and some shaded banks for ferns.';
 if(s.counts.ferns<goal('ferns'))return s.trees.size?'Ferns need both moisture and shade. Look for a space beside a healthy tree AND a flowing waterway.':'Grow a tree beside water, then plant a fern on a neighboring bank that is also moist.';
 if(s.counts.bridges<goal('bridges'))return 'A bridge carries water like a channel. Replace a flowing channel with a bridge; the channel returns to your tray.';
 if(s.counts.access<goal('access'))return 'Follow the gate-to-seat walk. Bare soil, fixed paths and bridges are open; plants and channels block it. Turn on Walk to see the reachable spaces.';
 if(s.counts.flowers<goal('flowers'))return 'Flowers need a wet neighbor and sunlight. Ferns enjoy the shaded banks instead.';
 return s.complete?'All three goals hold. Add a bench, pots or lanterns to make it yours, or visit the next little wild.':'Extend the waterway to make more useful banks. Every item can be moved and reused.';
}
