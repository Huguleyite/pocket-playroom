'use strict';
window.SanctuaryCampaign=(()=>{
 const missions=[
 {id:1,title:'The Broken Crossing',goal:'relic',limit:14,power:0,brief:'The shrine is cut off beyond the river. Recover its relic and bring the light home.',objective:'Recover the relic beside A6, then return its carrier to sanctuary G3.'},
 {id:2,title:'The Village Exodus',goal:'hold',limit:12,power:1,brief:'Villagers are fleeing the Ash host. Aldric must hold the central crossing while they escape.',objective:'Keep Aldric on bridge D5 through 3 enemy turns. You may leave and return; secured turns accumulate.'},
 {id:3,title:'The Captain’s Standard',goal:'captain',limit:12,power:2,brief:'An Ash Captain rallies the raiders at the northern ruins. Break their command before reinforcements arrive.',objective:'Defeat the Ash Captain. Other enemies can survive; no relic delivery is required.'},
 {id:4,title:'Two Keepers',goal:'escort',limit:14,power:2,brief:'The next relic needs both keepers. Seren and Aldric must survive the journey together.',objective:'Return the relic to G3 with BOTH heroes alive. Either hero falling means defeat.'},
 {id:5,title:'The Last Sanctuary',goal:'clear',limit:18,power:3,brief:'The final Ash company has reached the sanctuary. Recover the last light and end their assault.',objective:'Defeat every enemy AND return the relic to G3. Complete both objectives to finish the campaign.'}
 ];
 function read(k,f){try{return JSON.parse(localStorage.getItem(k))??f;}catch{return f;}}
 const progress=()=>Math.max(1,Math.min(5,Number(read('sanctuary:unlocked',1))||1));
 function current(){const id=Number(new URLSearchParams(location.search).get('mission'))||Number(read('sanctuary:current',1))||1;return missions[Math.max(0,Math.min(progress(),id)-1)]||missions[0];}
 function write(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}
 function save(s){write('sanctuary:current',s.missionId);write('sanctuary:battle:'+s.missionId,s);if(s.status==='won'){write('sanctuary:unlocked',Math.max(progress(),Math.min(5,s.missionId+1)));if(s.missionId===5)write('sanctuary:complete',true);}}
 function load(){const s=read('sanctuary:battle:'+current().id,null);return s?.missionId===current().id?s:null;}
 function go(id){const url=new URL(location.href);url.searchParams.set('mission',id);write('sanctuary:current',id);location.href=url.href;}
 return {missions,current,progress,save,load,go};
})();
