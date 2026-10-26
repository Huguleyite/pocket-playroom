/* Shared rules, speculative copy only. Queues never spend live resources. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SanctuaryPlanner=api;})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x));
 function create({tiles,initial,fork}){
  let orders=[];const baseline=copy(initial),budget=initial.actionsLeft;
  const cost=o=>o.type==='press'?2:1;
  function projection(){const engine=fork(copy(baseline));let display=engine.snapshot();for(const order of orders){const result=engine.action(order);if(!result.ok)throw Error('Plan became invalid.');const enemy=result.events.find(e=>e.type==='enemyTurn');display=enemy?enemy.frame:result.state;}return {engine,state:copy(display),remaining:budget-orders.reduce((n,o)=>n+cost(o),0)};}
  function path(unit,targetKey){const {engine,state,remaining}=projection(),u=state.units[unit];if(!u?.alive||u.team!=='player'||u.rooted||state.status!=='playing'||remaining<=0)return null;
   const occupied=new Set(Object.values(state.units).filter(x=>x.alive).map(x=>x.key));
   const valid=t=>!t.blocked&&!state.walls.includes(t.key)&&!['water','forest','ruin','shrine'].includes(t.type)&&!occupied.has(t.key);
   const queue=[[u.key]],seen=new Set([u.key]);while(queue.length){const p=queue.shift(),last=p[p.length-1];if(last===targetKey)return p.slice(1);if(p.length-1>=remaining)continue;for(const t of tiles)if(!seen.has(t.key)&&valid(t)&&engine.distance(last,t.key)===1){seen.add(t.key);queue.push([...p,t.key]);}}return null;
  }
  function append(unit,targetKey){const steps=path(unit,targetKey);if(!steps?.length)return {ok:false,reason:'Choose an empty reachable hex within the remaining actions.'};const old=orders.length;try{const engine=projection().engine;for(const key of steps){const order={type:'move',unit,targetKey:key};if(!engine.action(order).ok)throw Error('That route is blocked.');orders.push(order);}return {ok:true};}catch(e){orders.length=old;return {ok:false,reason:e.message};}}
  function attackPreview(unit,targetKey,pressed=false){const {engine,state,remaining}=projection();if(remaining<(pressed?2:1)||state.status!=='playing')return null;const p=engine.previewAttack(unit,targetKey,pressed);return p.legal?p:null;}
  function appendAttack(unit,targetKey){const preview=attackPreview(unit,targetKey);if(!preview)return {ok:false,reason:'That enemy is outside this hero’s attack range, or no actions remain.'};orders.push({type:'attack',unit,targetKey});return {ok:true,preview};}
  function legal(type,unit,targetKey){const {engine,state,remaining}=projection();return state.status==='playing'&&remaining>=cost({type})&&!!state.units[unit]?.alive&&engine.legal(type,unit,targetKey);}
  function appendOrder(order){if(!['move','attack','portal','rampart','ward','brace','press'].includes(order.type)||!legal(order.type,order.unit,order.targetKey))return {ok:false,reason:'This order is unavailable: check the target, actions, mana and unit conditions.'};orders.push(copy(order));return {ok:true};}
  return {path,append,attackPreview,appendAttack,appendOrder,legal,projection,cost,orders:()=>copy(orders),undo(){orders.pop();},clear(){orders=[];},matches:s=>JSON.stringify(s)===JSON.stringify(baseline),baseline:()=>copy(baseline)};
 }
 return {create};
});
