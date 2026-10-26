export function inspect(p,states){
 const counts=p.nodes.map(()=>0),adj=p.nodes.map(()=>[]);
 p.edges.forEach(([a,b],i)=>{if(states[i]===1){counts[a]++;counts[b]++;adj[a].push([b,i]);adj[b].push([a,i]);}});
 const reach=(skip=-1)=>{const seen=new Set([0]),q=[0];for(const a of q)for(const [b,i]of adj[a])if(i!==skip&&!seen.has(b)){seen.add(b);q.push(b);}return seen;};
 const home=reach(),backup=p.nodes.map((n,a)=>!n.backup||home.has(a)&&p.edges.every((_,i)=>states[i]!==1||reach(i).has(a)));
 return {counts,home,backup,valid:counts.every((c,i)=>c===p.nodes[i].need)&&home.size===p.nodes.length&&backup.every(Boolean)};
}
export function solutions(p,states=p.edges.map(()=>0)){
 const out=[],counts=p.nodes.map(()=>0),remaining=p.nodes.map(()=>0),work=states.slice();
 p.edges.forEach(([a,b])=>{remaining[a]++;remaining[b]++;});
 function search(i){if(i===p.edges.length){if(inspect(p,work).valid)out.push(work.slice());return;}
 const [a,b]=p.edges[i];remaining[a]--;remaining[b]--;
 for(const v of states[i]===0?[1,-1]:[states[i]]){work[i]=v;if(v===1){counts[a]++;counts[b]++;}
 if([a,b].every(k=>counts[k]<=p.nodes[k].need&&counts[k]+remaining[k]>=p.nodes[k].need))search(i+1);
 if(v===1){counts[a]--;counts[b]--;}}
 remaining[a]++;remaining[b]++;
 }search(0);return out;
}
export function deduction(p,states){
 const all=solutions(p,states);if(!all.length)return {text:'A previous choice needs revisiting. These decisions cannot form a complete network. Undo a recent choice or return a ruled-out link to undecided.'};
 const info=inspect(p,states);
 for(let a=0;a<p.nodes.length;a++){
 const unknown=p.edges.map((e,i)=>e.includes(a)&&states[i]===0?i:-1).filter(i=>i>=0),left=p.nodes[a].need-info.counts[a];
 if(unknown.length&&(left===0||left===unknown.length))return {edge:unknown[0],value:left===0?-1:1,text:`${p.nodes[a].name} ${left===0?'already has all its connections. Its remaining links can be ruled out.':`needs ${left} more connection${left===1?'':'s'}, with exactly ${left} available. Each is required.`}`};
 }
 const i=states.findIndex((v,i)=>v===0&&all.every(s=>s[i]===all[0][i]));
 if(i<0)return {text:'Your network is complete.'};
 const [a,b]=p.edges[i],value=all[0][i];
 return {edge:i,value,text:`${p.nodes[a].name} ↔ ${p.nodes[b].name} must ${value===1?'connect':'stay inactive'}. ${explainOpposite(p,states,i,value)}`};
}

function explainOpposite(p,states,edge,value){
 const work=states.slice();work[edge]=-value;let changed=true;
 while(changed){changed=false;const r=inspect(p,work);
 for(let a=0;a<p.nodes.length;a++){
 const unknown=p.edges.map((e,i)=>e.includes(a)&&work[i]===0?i:-1).filter(i=>i>=0),left=p.nodes[a].need-r.counts[a];
 if(left<0||left>unknown.length)return `The opposite choice forces ${p.nodes[a].name} to ${left<0?'exceed its count':'run out of available links'}.`;
 if(unknown.length&&(left===0||left===unknown.length)){for(const i of unknown)work[i]=left===0?-1:1;changed=true;break;}
 }
 const possible=inspect(p,work.map(v=>v===0?1:v));
 if(possible.home.size<p.nodes.length){const a=p.nodes.findIndex((_,i)=>!possible.home.has(i));return `The opposite choice, followed through the station counts, cuts ${p.nodes[a].name} off from HQ.`;}
 const vulnerable=p.nodes.findIndex((n,i)=>n.backup&&!possible.backup[i]);
 if(vulnerable>=0)return `The opposite choice forces ${p.nodes[vulnerable].name} behind a single vulnerable link. A backup route must survive any one link failing.`;
 }
 return 'Following the opposite choice through every remaining count leaves no network that reaches HQ with the required backup routes.';
}
