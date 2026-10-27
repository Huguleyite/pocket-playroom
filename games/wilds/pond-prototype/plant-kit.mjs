// Shared atlas selection for the next illustrated gardens. State comes from rules.mjs.
export const kitSprites={tree:[0,0],dormantTree:[1,0],slenderTree:[2,0],dormantSlenderTree:[3,0],fern:[0,1],curledFern:[1,1],bridgeAcross:[2,1],bridgeAlong:[3,1]};
export function kitState(type,index,environment,{tree='round',bridge='across'}={}){
 if(type==='tree')return environment.trees.has(index)?tree==='slender'?'slenderTree':'tree':tree==='slender'?'dormantSlenderTree':'dormantTree';
 if(type==='fern')return environment.ferns.has(index)?'fern':'curledFern';
 if(type==='bridge')return bridge==='along'?'bridgeAlong':'bridgeAcross';
 return null;
}
// Explicit source rectangles keep irregular generated silhouettes inside their own piece.
const regions={tree:[0,0,450,490],dormantTree:[455,0,435,490],slenderTree:[930,0,405,490],dormantSlenderTree:[1370,0,400,480],fern:[0,500,450,370],curledFern:[480,530,390,330],bridgeAcross:[885,540,515,300],bridgeAlong:[1450,485,285,390]};
export function kitSprite(name,cls=''){
 const r=regions[name];if(!r)return '';
 const [x,y,w,h]=r,side=Math.max(w,h);
 return `<span class="kit-sprite ${cls}" data-sprite="${name}" aria-hidden="true"><span class="kit-ink" style="width:${w/side*100}%;height:${h/side*100}%;background-size:${1774/w*100}% ${887/h*100}%;background-position:${x/(1774-w)*100}% ${y/(887-h)*100}%"></span></span>`;
}
