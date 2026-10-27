import {levels} from './levels.mjs';
import {tools,decorations,neighbors} from './rules.mjs';
export const KEY='little-wilds:v2',LEGACY_KEY='little-wilds:v1';
export const empty=level=>Array(level.n**2).fill(null);
export const defaultStyle=()=>({flowers:'meadow',tree:'oak'});
export function fresh(){return {version:2,current:0,completed:[],gardens:levels.map(empty),decorations:levels.map(empty),styles:levels.map(defaultStyle)};}
export function load(storage){
 const state=fresh();try{
  const stored=storage.getItem(KEY);let raw;try{raw=JSON.parse(stored);}catch{}
  if(!raw||raw.version!==2){const legacy=storage.getItem(LEGACY_KEY);try{raw=JSON.parse(legacy);}catch{}}
  if(![1,2].includes(raw?.version))return {state,available:true};
  if(Array.isArray(raw.completed))state.completed=[...new Set(raw.completed.filter(x=>Number.isInteger(x)&&x>=0&&x<levels.length))];
  if(Number.isInteger(raw.current)&&raw.current>=0&&raw.current<levels.length&&(raw.current===0||state.completed.includes(raw.current-1)))state.current=raw.current;
  levels.forEach((l,k)=>{
   const a=raw.gardens?.[k],counts={};
   if(Array.isArray(a)&&a.length===l.map.length)a.forEach((v,i)=>{if(!tools.includes(v)||l.map[i]!=='.'||(v==='reeds'&&!neighbors(i,l.n).some(j=>l.map[j]==='P')))return;counts[v]=(counts[v]||0)+1;if(counts[v]<=(l.inventory[v]||0))state.gardens[k][i]=v;});
   const d=raw.decorations?.[k],dc={};if(Array.isArray(d)&&d.length===l.map.length)d.forEach((v,i)=>{if(!decorations.includes(v)||!['.','='].includes(l.map[i])||state.gardens[k][i])return;dc[v]=(dc[v]||0)+1;if(dc[v]<=(l.decorations[v]||0))state.decorations[k][i]=v;});
   const style=raw.styles?.[k];if(['meadow','rose','gold'].includes(style?.flowers))state.styles[k].flowers=style.flowers;if(['oak','cypress'].includes(style?.tree))state.styles[k].tree=style.tree;
  });return {state,available:true};
 }catch{return {state,available:false};}
}
export function save(storage,state){try{storage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
