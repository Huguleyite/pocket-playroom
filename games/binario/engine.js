// Neon Logic: deterministic daily boards, unique puzzles, and partial-board rules.
export const SIZE = 6;
const empty = () => Array.from({length:SIZE},()=>Array(SIZE).fill(null));
const copy = b => b.map(r=>[...r]);
export function mulberry32(seed){return ()=>{seed=(seed+0x6D2B79F5)>>>0;let t=Math.imul(seed^(seed>>>15),seed|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function dateSeed(date){if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw Error('Invalid date');let h=2166136261;for(const c of date)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
function assertBoard(b){if(!Array.isArray(b)||b.length!==SIZE||!Array.from(b).every(r=>Array.isArray(r)&&r.length===SIZE&&Array.from(r).every(v=>v===null||v==='C'||v==='M')))throw Error('Expected a 6×6 board containing null, C, or M');}
function groups(b){return [b,Array.from({length:SIZE},(_,c)=>b.map(r=>r[c]))];}
export function checkMaxAdjacent(b){assertBoard(b);return groups(b).flat().every(l=>l.every((v,i)=>i<2||v===null||v!==l[i-1]||v!==l[i-2]));}
export function checkEqualCounts(b){assertBoard(b);return groups(b).flat().every(l=>['C','M'].every(v=>l.filter(x=>x===v).length<=SIZE/2));}
export function checkUniqueLines(b){assertBoard(b);return groups(b).every(ls=>{const done=ls.filter(l=>!l.includes(null)).map(l=>l.join(''));return new Set(done).size===done.length;});}
export const isLegal=b=>checkMaxAdjacent(b)&&checkEqualCounts(b)&&checkUniqueLines(b);
export const isSolved=b=>isLegal(b)&&b.every(r=>!r.includes(null));
function shuffled(a,rng){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const patterns=Array.from({length:64},(_,m)=>Array.from({length:SIZE},(_,i)=>(m>>i)&1?'M':'C')).filter(r=>r.filter(v=>v==='C').length===3&&r.every((v,i)=>i<2||v!==r[i-1]||v!==r[i-2]));
function solve(clues,limit=2,orders=Array.from({length:SIZE},()=>patterns)){
 const b=empty();let count=0,solution=null;
 function visit(r){if(r===SIZE){count++;solution=copy(b);return count>=limit;}for(const p of orders[r]){if(p.some((v,c)=>clues[r][c]!==null&&clues[r][c]!==v))continue;b[r]=[...p];if(isLegal(b)&&visit(r+1))return true;}b[r]=Array(SIZE).fill(null);return false;}visit(0);return {count,solution};
}
export function generateSolution(date){const rng=mulberry32(dateSeed(date));return solve(empty(),1,Array.from({length:SIZE},()=>shuffled(patterns,rng))).solution;}
// Only local, explainable rules are used to certify the daily difficulty.
export function findDeduction(b){
 assertBoard(b);
 for(const [axis,lines] of groups(b).entries())for(const [lineIndex,line] of lines.entries()){
  const at=i=>axis===0?{row:lineIndex,col:i}:{row:i,col:lineIndex};
  for(let i=0;i<SIZE;i++)if(line[i]===null){
   for(const value of ['C','M']){
    if(line.filter(v=>v===value).length===3)return {...at(i),value:value==='C'?'M':'C',axis,line:lineIndex,rule:'balance'};
    for(let start=Math.max(0,i-2);start<=Math.min(i,SIZE-3);start++)if([start,start+1,start+2].filter(j=>j!==i).every(j=>line[j]===value))return {...at(i),value:value==='C'?'M':'C',axis,line:lineIndex,rule:'triple'};
   }
  }
 }
 return null;
}
export function solveByDeduction(clues){
 const board=copy(clues),steps=[];let step;
 while(isLegal(board)&&(step=findDeduction(board))){board[step.row][step.col]=step.value;steps.push(step);}
 return {board,steps,solved:isSolved(board)};
}
export function generatePuzzle(date,round='daily'){
 if(round==='extra'){
  // A fixed offset gives the bonus its own deterministic seed without changing
  // existing daily boards. Guard against the rare identical solution as well.
  const daily=generatePuzzle(date),seedDate=new Date(Date.parse(date+'T00:00:00Z')+86400000*7919).toISOString().slice(0,10),extra=generatePuzzle(seedDate);
  if(JSON.stringify(extra.solution)===JSON.stringify(daily.solution))for(const board of [extra.clues,extra.solution])for(const row of board)for(let c=0;c<SIZE;c++)if(row[c]!==null)row[c]=row[c]==='C'?'M':'C';
  return {...extra,date,round};
 }
 if(round!=='daily')throw Error('Invalid round');
 const solution=generateSolution(date),clues=copy(solution),rng=mulberry32(dateSeed(date)^0x9E3779B9);
 let remaining=36;
 for(const i of shuffled(Array.from({length:36},(_,i)=>i),rng)){
  if(remaining<=17)break;
  const r=Math.floor(i/SIZE),c=i%SIZE,v=clues[r][c];clues[r][c]=null;
  const distributed=groups(clues).flat().every(line=>line.filter(v=>v!==null).length>=2);
  if(!distributed||!solveByDeduction(clues).solved||solve(clues).count!==1)clues[r][c]=v;
  else remaining--;
 }
 return {date,clues,solution};
}
export function countSolutions(b){assertBoard(b);return solve(b).count;}
let board=empty(),clues=empty();
export function initializeGame(date,round='daily'){const puzzle=generatePuzzle(date,round);clues=copy(puzzle.clues);board=copy(clues);return {date,clues:copy(clues),board:copy(board),solution:copy(puzzle.solution)};}
export function getBoard(){return copy(board);}
export function restoreBoard(saved){assertBoard(saved);if(clues.some((r,i)=>r.some((v,j)=>v!==null&&saved[i][j]!==v)))throw Error('Saved clues do not match');board=copy(saved);return getBoard();}
export function toggleCell(row,col){if(!Number.isInteger(row)||!Number.isInteger(col)||row<0||row>=SIZE||col<0||col>=SIZE)throw Error('Invalid cell');if(clues[row][col]!==null)return false;const states=[null,'C','M'];board[row][col]=states[(states.indexOf(board[row][col])+1)%3];return true;}
