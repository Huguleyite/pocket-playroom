import {kitSprite,kitState} from './pond-prototype/plant-kit.mjs';
import {neighbors,waterItem} from './rules.mjs';
const positions={flowers:[0,0],buds:[1,0],reeds:[2,0],dryreeds:[3,0],bench:[0,1],pot:[1,1],birdbath:[2,1],lantern:[3,1],stones:[0,2],frog:[1,2],butterfly:[2,2],channel:[3,2]};
export function painted(name,cls=''){
 if(!positions[name])return '';
 const [x,y]=positions[name];return `<span class="painted ${cls}" data-painted="${name}" style="--px:${x/3*100}%;--py:${y/2*100}%" aria-hidden="true"></span>`;
}
export function illustratedPlant(type,i,s,style){
 if(type==='tree'||type==='fern')return kitSprite(kitState(type,i,s,{tree:style.tree==='cypress'?'slender':'round'}),'plant');
 if(type==='flowers')return painted(s.flowers.has(i)?'flowers':'buds','plant');
 if(type==='reeds')return painted(s.reeds.has(i)?'reeds':'dryreeds','plant');
 return '';
}
export function illustratedBridge(i,l,items){
 // Deck crosses the water direction. A junction still has a usable deck.
 const across=neighbors(i,l.n).some(j=>Math.abs(j-i)===l.n&&(waterItem(items[j])||['I','P'].includes(l.map[j])));
 return kitSprite(across?'bridgeAcross':'bridgeAlong','footbridge');
}
export function basinLayers(l,items,s){
 const feeds=[];
 const layers=s.ponds.map(p=>{
  const rows=p.cells.map(i=>Math.floor(i/l.n)),cols=p.cells.map(i=>i%l.n),r=Math.min(...rows),c=Math.min(...cols),w=Math.max(...cols)-c+1,h=Math.max(...rows)-r+1,ports=[];
  for(const i of p.cells)for(const j of neighbors(i,l.n))if(waterItem(items[j]))ports.push({from:j,to:i});
  for(const {from,to} of ports){const xy=i=>`${(i%l.n)*100+50} ${Math.floor(i/l.n)*100+50}`;feeds.push(`<path d="M${xy(from)}L${xy(to)}" stroke="${s.wet.has(from)?'#62a9af':'#786947'}"/>`);}
  const point=i=>[(((i%l.n)-c)+.5)*100/w,((Math.floor(i/l.n)-r)+.5)*100/h];
  const lines=ports.map(({from,to})=>{const a=point(from),b=point(to);return `<path d="M${a}L${b}"/>`;}).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="white"/><g fill="none" stroke="black" stroke-width="${27/Math.max(w,h)}" stroke-linecap="round">${lines}</g></svg>`;
  const mask=`url(&quot;data:image/svg+xml,${encodeURIComponent(svg)}&quot;)`;
  return `<span class="painted-basin ${p.filled?p.clean?'clear':'cloudy':'dry'}" data-basin="${p.cells.join(',')}" data-ports="${ports.length}" style="left:${c/l.n*100}%;top:${r/l.n*100}%;width:${w/l.n*100}%;height:${h/l.n*100}%;mask-image:${mask};-webkit-mask-image:${mask}" aria-hidden="true"></span>`;
 }).join('');
 return `<svg class="basin-feeds" viewBox="0 0 ${l.n*100} ${l.n*100}" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke-width="27" stroke-linecap="round">${feeds.join('')}</g></svg>`+layers;
}
