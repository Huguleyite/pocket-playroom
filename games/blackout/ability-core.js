/* Shared teleport targeting and timing for the chapter and ability lab. */
(function(root){
function overlaps(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function teleportTarget(p,dx,dy,solids,range=420,bounds=1900){const n=Math.hypot(dx,dy)||1;let target={x:p.x,y:p.y};for(let d=6;d<=range;d+=6){const probe={x:Math.max(0,Math.min(bounds-p.w,p.x+dx/n*d)),y:p.y+dy/n*d,w:p.w,h:p.h};if(probe.y<35||solids.some(b=>overlaps(probe,b)))break;target={x:probe.x,y:probe.y}}return {...target,distance:Math.hypot(target.x-p.x,target.y-p.y)}}
function beginTeleport(p,dx,dy,solids,range=420,bounds=1900){if(p.charges<2||p.teleport)return false;const target=teleportTarget(p,dx,dy,solids,range,bounds);if(target.distance<30)return false;p.charges-=2;p.teleport={age:0,from:{x:p.x,y:p.y},to:target,moved:false};p.vx=p.vy=0;return true}
function advanceTeleport(p,dt){const a=p.teleport;if(!a)return false;a.age+=dt;if(a.age>=.22&&!a.moved){p.x=a.to.x;p.y=a.to.y;a.moved=true}if(a.age>=.55){p.teleport=null;p.vx=p.vy=0}return true}
function foresight(p,hasItem,clock,last){return !hasItem&&p.x>1300&&clock-last>=6}
function needsPreview(p,dx,dy,solids,range=420,bounds=1900){if(p.charges<2||p.teleport||(!dx&&!dy))return false;const target=teleportTarget(p,dx,dy,solids,range,bounds);if(target.distance<30)return false;const support=solids.find(b=>p.x+p.w>b.x&&p.x<b.x+b.w&&Math.abs(p.y+p.h-b.y)<12);return !support||!!dy||(dx>0? support.x+support.w-(p.x+p.w)<95:p.x-support.x<95)}
const api={needsPreview,overlaps,teleportTarget,beginTeleport,advanceTeleport,foresight};root.AbilityCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
