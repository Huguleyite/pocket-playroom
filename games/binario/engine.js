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
export function generatePuzzle(date){const solution=generateSolution(date),clues=copy(solution),rng=mulberry32(dateSeed(date)^0x9E3779B9);for(const i of shuffled(Array.from({length:36},(_,i)=>i),rng)){const r=Math.floor(i/SIZE),c=i%SIZE,v=clues[r][c];clues[r][c]=null;if(solve(clues).count!==1)clues[r][c]=v;}// Retain one extra central clue after the minimal unique puzzle is built.
const extra=Array.from({length:36},(_,i)=>i).filter(i=>clues[Math.floor(i/6)][i%6]===null).sort((a,b)=>{const distance=i=>Math.abs(Math.floor(i/6)-2.5)+Math.abs(i%6-2.5);return distance(a)-distance(b)||a-b;})[0];if(extra!==undefined)clues[Math.floor(extra/6)][extra%6]=solution[Math.floor(extra/6)][extra%6];return {date,clues,solution};}
export function countSolutions(b){assertBoard(b);return solve(b).count;}
let board=empty(),clues=empty();
export function initializeGame(date){const puzzle=generatePuzzle(date);clues=copy(puzzle.clues);board=copy(clues);return {date,clues:copy(clues),board:copy(board)};}
export function getBoard(){return copy(board);}
export function restoreBoard(saved){assertBoard(saved);if(clues.some((r,i)=>r.some((v,j)=>v!==null&&saved[i][j]!==v)))throw Error('Saved clues do not match');board=copy(saved);return getBoard();}
export function toggleCell(row,col){if(!Number.isInteger(row)||!Number.isInteger(col)||row<0||row>=SIZE||col<0||col>=SIZE)throw Error('Invalid cell');if(clues[row][col]!==null)return false;const states=[null,'C','M'];board[row][col]=states[(states.indexOf(board[row][col])+1)%3];return true;}
