import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=new URL('../games/daily-stars/',import.meta.url);
await mkdir(out,{recursive:true});
let seed=Number(process.argv[2]||20261101)>>>0;
const initialSeed=seed;
function random(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;}
const pick=a=>a[Math.floor(random()*a.length)];
const permutations=[];
function enumerate(p=[],used=0){if(p.length===7){permutations.push(p);return;}for(let c=0;c<7;c++)if(!(used&(1<<c))&&(!p.length||Math.abs(p.at(-1)-c)>1))enumerate([...p,c],used|(1<<c));}
enumerate();
const neighbors=i=>[i%7?i-1:-1,i%7<6?i+1:-1,i>=7?i-7:-1,i<42?i+7:-1].filter(x=>x>=0);
function grow(solution){const a=Array(49).fill(-1),sizes=Array(7).fill(1);solution.forEach((c,r)=>a[r*7+c]=r);for(let n=7;n<49;n++){
 const edges=[];for(let i=0;i<49;i++)if(a[i]<0)for(const j of neighbors(i))if(a[j]>=0&&sizes[a[j]]<12)edges.push([i,a[j]]);
 if(!edges.length)return null;const [i,region]=pick(edges);a[i]=region;sizes[region]++;
 }return sizes.every(n=>n>=2&&n<=12)?a:null;}
export function canonical(a){const forms=[];for(let flip=0;flip<2;flip++)for(let rotation=0;rotation<4;rotation++){
 const b=[];for(let r=0;r<7;r++)for(let c=0;c<7;c++){let x=r,y=flip?6-c:c;for(let k=0;k<rotation;k++)[x,y]=[y,6-x];b[x*7+y]=a[r*7+c];}
 const labels=new Map();forms.push(b.map(v=>{if(!labels.has(v))labels.set(v,labels.size);return labels.get(v);}).join(''));
 }return forms.sort()[0];}
// Independent verifier: chooses the most constrained unfilled row, tracking
// occupied columns, occupied regions, and a cell-level king-neighborhood mask.
export function independentCount(regions){let count=0;function visit(rows,columns,colors,blocked){if(count>1)return;if(rows===127){count++;return;}
 let candidates=null,row=-1;for(let r=0;r<7;r++)if(!(rows&(1<<r))){const options=[];for(let c=0;c<7;c++){const i=r*7+c;if(!(columns&(1<<c))&&!(colors&(1<<regions[i]))&&!(blocked&(1n<<BigInt(i))))options.push(c);}if(!options.length)return;if(!candidates||options.length<candidates.length){candidates=options;row=r;}}
 for(const col of candidates){let next=blocked;for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){const r=row+dr,c=col+dc;if(r>=0&&r<7&&c>=0&&c<7)next|=1n<<BigInt(r*7+c);}visit(rows|(1<<row),columns|(1<<col),colors|(1<<regions[row*7+col]),next);}
 }visit(0,0,0,0n);return count;}
const bank=[],seen=new Set(),log=[`Daily Stars verification | seed ${initialSeed}`,`Enumerated ${permutations.length} non-touching row/column permutations.`];let attempts=0;
while(bank.length<400){attempts++;const solution=pick(permutations),regions=grow(solution);if(!regions)continue;
 let count=0;for(const p of permutations){let mask=0;for(let r=0;r<7;r++)mask|=1<<regions[r*7+p[r]];if(mask===127&&++count>1)break;}if(count!==1)continue;
 const signature=canonical(regions);if(seen.has(signature))continue;
 assert.equal(independentCount(regions),1);seen.add(signature);
 const sizes=Array(7).fill(0);regions.forEach(v=>sizes[v]++);
 const askRow=solution.reduce((best,c,r)=>sizes[regions[r*7+c]]>sizes[regions[best*7+solution[best]]]?r:best,0);
 bank.push({regions,solution,askRow});log.push(`Puzzle ${String(bank.length).padStart(3,'0')}: enumeration=1 independent=1 unique-D4=yes sizes=${sizes.join(',')} askRow=${askRow+1}`);
 if(bank.length%100===0)console.log(`${bank.length}/400 verified (${attempts} candidates)`);
}
assert.equal(seen.size,400);
log.push(`PASS: 400/400 independently verified, 400 unique under rotation/reflection and region relabeling. ${attempts} candidates.`);
await writeFile(new URL('puzzles.json',out),JSON.stringify(bank)+'\n');
// Ship the identical static bank as a script too: no runtime fetch or API calls.
await writeFile(new URL('bank.js',out),'export default '+JSON.stringify(bank)+';\n');
await mkdir(new URL('../docs/',import.meta.url),{recursive:true});
await writeFile(new URL('../docs/daily-stars-verification.log',import.meta.url),log.join('\n')+'\n');
console.log(log.at(-1));
