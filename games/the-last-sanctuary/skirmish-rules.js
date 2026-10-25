/* Deterministic combat rules: no DOM, rendering, timers or randomness. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CrownSkirmish=api;})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 function create(tiles){
  const board=new Map(tiles.map(t=>[t.key||`${t.q},${t.r}`,{...t,key:t.key||`${t.q},${t.r}`} ]));
  const units={};let round=1,actionsLeft=2,mana=3,status='playing',phase='player';const walls=new Set();
  for(const [id,team,key,hp,attack,range]of [['mage','player','-2,1',3,1,2],['guardian','player','0,1',5,2,1],['raider1','enemy','-1,-1',3,1,1],['raider2','enemy','2,-1',3,1,1]])units[id]={id,team,key,hp,maxHp:hp,attack,range,alive:true,ward:false,braced:false,rooted:false,stamina:2};
  function axial(key){const t=board.get(key);return t?[t.q-(t.r-(t.r&1))/2,t.r]:null;}
  function distance(a,b){const x=axial(a),y=axial(b);return x&&y?(Math.abs(x[0]-y[0])+Math.abs(x[1]-y[1])+Math.abs(x[0]+x[1]-y[0]-y[1]))/2:Infinity;}
  function occupied(key){return Object.values(units).find(u=>u.alive&&u.key===key);}
  function passable(key){const t=board.get(key);return !!t&&!t.blocked&&!['water','forest','ruin','shrine'].includes(t.type)&&!walls.has(key);}
  function snapshot(){return {round,actionsLeft,mana,status,phase,units:JSON.parse(JSON.stringify(units)),walls:[...walls]};}
  function legal(type,id,targetKey){const u=units[id];if(status!=='playing'||!u?.alive||u.team!=='player'||actionsLeft<1)return false;const t=board.get(targetKey),d=distance(u.key,targetKey),other=occupied(targetKey);
   if(type==='brace')return id==='guardian'&&u.key==='0,0'&&!u.braced&&(!targetKey||targetKey===u.key);
   if(type==='press')return actionsLeft===2&&!!other&&other.team==='enemy'&&d<=u.range;
   if(type==='move')return !u.rooted&&d===1&&passable(targetKey)&&!other;
   if(type==='attack')return !!other&&other.team==='enemy'&&d<=u.range;
   if(type==='portal')return !u.rooted&&id==='mage'&&mana>=2&&d>=2&&d<=4&&passable(targetKey)&&!other;
   if(type==='rampart')return id==='mage'&&mana>=1&&d>=1&&d<=3&&passable(targetKey)&&t.type!=='bridge'&&!other;
   if(type==='ward')return mana>=1&&units.guardian.alive&&!units.guardian.ward&&targetKey===units.guardian.key;
   return false;
  }
  function emit(events,event){events.push({...event,frame:snapshot()});}
  function outcome(events){if(!Object.values(units).some(u=>u.team==='enemy'&&u.alive))status='won';else if(!Object.values(units).some(u=>u.team==='player'&&u.alive))status='lost';if(status!=='playing')emit(events,{type:status});}
  function previewAttack(id,key,pressed=false){const attacker=units[id],target=occupied(key);const valid=!!attacker?.alive&&!!target&&target.team!==attacker.team&&distance(attacker.key,key)<=attacker.range&&status==='playing';const rawDamage=attacker?(attacker.attack+(pressed?1:0)):0,reduction=target?.braced?1:0,wardBlocked=!!target?.ward;const damage=valid?(wardBlocked?0:Math.min(target.hp,Math.max(0,rawDamage-reduction))):0;return {legal:valid&&(attacker.team==='enemy'||legal(pressed?'press':'attack',id,key)),damage,rawDamage,reduction,wardBlocked,hpBefore:target?.hp??null,hpAfter:target?target.hp-damage:null};}
  function damage(attacker,target,events,pressed=false){const preview=previewAttack(attacker.id,target.key,pressed);if(target.ward){target.ward=false;emit(events,{type:'wardBlocked',unit:target.id,attacker:attacker.id,target:target.id,damage:0,hpBefore:target.hp,hpAfter:target.hp,rawDamage:preview.rawDamage,reduction:preview.rawDamage});return;}const hpBefore=target.hp;target.hp=preview.hpAfter;target.alive=target.hp>0;emit(events,{type:'attack',unit:attacker.id,target:target.id,damage:preview.damage,hp:target.hp,hpBefore,hpAfter:target.hp,rawDamage:preview.rawDamage,reduction:preview.reduction,pressed});if(!target.alive)emit(events,{type:'defeated',unit:target.id});outcome(events);}
  function path(enemy){const queue=[[enemy.key]],seen=new Set([enemy.key]);while(queue.length){const p=queue.shift(),last=p[p.length-1];if(Object.values(units).some(u=>u.team==='player'&&u.alive&&distance(last,u.key)<=1))return p;for(const t of board.values())if(!seen.has(t.key)&&distance(last,t.key)===1&&passable(t.key)&&!occupied(t.key)){seen.add(t.key);queue.push([...p,t.key]);}}return null;}
  function enemyTurn(events){phase='enemy';emit(events,{type:'enemyTurn'});for(const enemy of Object.values(units).filter(u=>u.team==='enemy'&&u.alive)){if(status!=='playing')break;const adjacent=Object.values(units).filter(u=>u.team==='player'&&u.alive&&distance(enemy.key,u.key)<=1).sort((a,b)=>a.hp-b.hp||a.id.localeCompare(b.id));if(adjacent.length)damage(enemy,adjacent[0],events);else{const p=path(enemy);if(p?.length>1){const from=enemy.key;enemy.key=p[1];emit(events,{type:'move',unit:enemy.id,from,to:enemy.key});}else{const wall=[...walls].find(key=>distance(enemy.key,key)===1);if(wall){walls.delete(wall);emit(events,{type:'wallBroken',unit:enemy.id,key:wall});}}}}
   if(status==='playing'){round++;actionsLeft=2;mana=3;phase='player';for(const unit of Object.values(units)){unit.braced=false;unit.rooted=false;unit.stamina=2;}emit(events,{type:'playerTurn',round});}
  }
  function action({type,unit,targetKey}){if(!legal(type,unit,targetKey))return {ok:false,reason:'That order is not available.',events:[],state:snapshot()};const events=[],u=units[unit],spent=type==='press'?actionsLeft:1;actionsLeft-=spent;u.stamina=Math.max(0,u.stamina-spent);if(type==='move'||type==='portal'){const from=u.key;u.key=targetKey;if(type==='portal')mana-=2;emit(events,{type,unit,from,to:targetKey});}else if(type==='attack'||type==='press')damage(u,occupied(targetKey),events,type==='press');else if(type==='brace'){u.braced=true;u.rooted=true;emit(events,{type,unit,key:u.key});}else if(type==='rampart'){walls.add(targetKey);mana--;emit(events,{type,unit,key:targetKey});}else if(type==='ward'){units.guardian.ward=true;mana--;emit(events,{type,unit:'guardian'});}if(actionsLeft===0&&status==='playing')enemyTurn(events);return {ok:true,events,state:snapshot()};}
  function endTurn(){if(status!=='playing')return {ok:false,reason:'The battle has ended.',events:[],state:snapshot()};const events=[];enemyTurn(events);return {ok:true,events,state:snapshot()};}
  return {action,endTurn,legal,snapshot,distance,previewAttack};
 }
 return {create};
});
