export const LAUNCH_DATE='2026-11-01';
export const PREVIEW_KEY='CHANGE_ME';
export const BOARD_THEMES=[
 {id:'classic',days:0,name:'Classic',description:'Your original everyday board.',scene:null},
 {id:'prismatic',days:3,name:'Prismatic Starboard',description:'Polished colored glass and luminous gold stars.',scene:'prismatic-constellations.webp'},
 {id:'moonstone',days:10,name:'Moonstone Observatory',description:'Pearlescent moonstone, silver and sapphire light.',scene:'moonstone-scene.webp'},
 {id:'aurora',days:25,name:'Aurora Garden',description:'Matte botanical porcelain under the northern lights.',scene:'aurora-scene.webp'},
 {id:'orrery',days:50,name:'Celestial Orrery',description:'Riveted enamel plates and engraved brass stars.',scene:'orrery-scene.webp'},
 {id:'starforge',days:100,name:'Eclipse Starforge',description:'Rough meteorite stone with stellar cores.',scene:'starforge-scene.webp'},
 {id:'nebula',days:200,name:'Nebula Outline',description:'Only light: hollow stars and region outlines over space.',scene:'nebula-scene.webp'}
];
export const COLORS=['purple','teal','gold','rose','blue','green','orange'];
export function easternDate(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function serial(date){return Math.round(Date.parse(date+'T00:00:00Z')/86400000);}
export function dayNumber(now=new Date()){return Math.max(1,serial(easternDate(now))-serial(LAUNCH_DATE)+1);}
export function selectedDay(params,now=new Date()){const today=dayNumber(now),n=Number(params.get('day'));return Number.isSafeInteger(n)&&n>=1&&(n<=today||params.get('key')===PREVIEW_KEY)?n:today;}
export function nextMidnight(now=new Date()){
 // Search for the first instant whose Eastern calendar date changes. This also
 // handles 23/25-hour days without assuming an offset or a 24-hour local day.
 const date=easternDate(now);let lo=now.getTime(),hi=lo+27*3600000;
 while(hi-lo>1){const mid=Math.floor((lo+hi)/2);if(easternDate(new Date(mid))===date)lo=mid;else hi=mid;}return hi;
}
export function conflicts(grid,regions){const bad=new Set(),messages=new Set(),stars=[];grid.forEach((v,i)=>{if(v===2)stars.push(i);});
 for(let a=0;a<stars.length;a++)for(let b=a+1;b<stars.length;b++){const i=stars[a],j=stars[b],r=Math.floor(i/7),s=Math.floor(j/7),c=i%7,d=j%7;let conflict=false;
 if(r===s){messages.add(`Row ${r+1} has more than one star.`);conflict=true;}
 if(c===d){messages.add(`Column ${c+1} has more than one star.`);conflict=true;}
 if(regions[i]===regions[j]){messages.add(`${COLORS[regions[i]]} region has more than one star.`);conflict=true;}
 if(Math.abs(r-s)<=1&&Math.abs(c-d)<=1){messages.add('Stars must not touch, even diagonally.');conflict=true;}
 if(conflict){bad.add(i);bad.add(j);}}
 return {bad,messages:[...messages]};}
export function solved(grid,regions){return grid.filter(v=>v===2).length===7&&conflicts(grid,regions).bad.size===0;}
// Reveal an easy clue, keeping the asked/largest-region star for the player.
export function givenIndex(puzzle){const sizes=Array(7).fill(0);puzzle.regions.forEach(v=>sizes[v]++);let row=-1;for(let r=0;r<7;r++)if(r!==puzzle.askRow&&(row<0||sizes[puzzle.regions[r*7+puzzle.solution[r]]]<sizes[puzzle.regions[row*7+puzzle.solution[row]]]))row=r;return row*7+puzzle.solution[row];}
export function freshGrid(puzzle){const grid=Array(49).fill(0);grid[givenIndex(puzzle)]=2;return grid;}
export function streakFor(days,date){const set=new Set(days),today=serial(date);let n=0,at=set.has(today)?today:today-1;while(set.has(at--))n++;return n;}
export function rewardProgress(stats,date){
 const today=serial(date),first=serial(LAUNCH_DATE),days=[...new Set((Array.isArray(stats?.days)?stats.days:[]).filter(n=>Number.isSafeInteger(n)&&n>=first&&n<=today))].sort((a,b)=>a-b);
 let run=0,best=0,last=null;for(const day of days){run=day===last+1?run+1:1;best=Math.max(best,run);last=day;}
 best=Math.max(best,Number.isSafeInteger(stats?.bestStreak)&&stats.bestStreak>=0?stats.bestStreak:0);
 const earned=new Set(Array.isArray(stats?.unlocked)?stats.unlocked:[]),unlocked=BOARD_THEMES.filter(t=>t.days===0||t.days<=best||earned.has(t.id)).map(t=>t.id);
 return {current:streakFor(days,date),best,unlocked,next:BOARD_THEMES.find(t=>!unlocked.includes(t.id))||null};
}
export const timeText=ms=>{const s=Math.floor(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;};
