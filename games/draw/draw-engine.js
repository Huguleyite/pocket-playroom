(function(root){
const suits=['♠','♥','♦','♣'];
function start(seed=42){let hand=[{rank:7,suit:1},{rank:7,suit:0},{rank:8,suit:1}],market=[{rank:9,suit:1},{rank:2,suit:3},{rank:11,suit:0}];let used=[...hand,...market].map(c=>c.rank+':'+c.suit);let deck=[];for(let s=0;s<4;s++)for(let r=1;r<=13;r++)if(!used.includes(r+':'+s))deck.push({rank:r,suit:s});for(let i=deck.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;let j=seed%(i+1);[deck[i],deck[j]]=[deck[j],deck[i]]}return{hand,market,deck,table:Array(6).fill(null),phase:'play',score:0,combos:0,turns:0}}
function kind(cards){if(cards.some(c=>!c))return null;if(cards.length===2&&cards[0].rank===cards[1].rank)return'Pair';if(cards.length===3){let ranks=cards.map(c=>c.rank).sort((a,b)=>a-b);if(ranks[1]===ranks[0]+1&&ranks[2]===ranks[1]+1)return'Run';if(cards.every(c=>c.suit===cards[0].suit))return'Flush'}return null}
function available(g){for(let a=0;a<6;a++)for(let b=a+1;b<6;b++){if(kind([g.table[a],g.table[b]]))return[a,b];for(let c=b+1;c<6;c++)if(kind([g.table[a],g.table[b],g.table[c]]))return[a,b,c]}return null}
function status(g){if(g.combos>=5)return'won';if(g.table.every(Boolean)&&!available(g))return'lost';if(!g.hand.length&&!g.deck.length&&!g.market.some(Boolean)&&!available(g))return'finished';return'playing'}
function orderedSix(table){return table.length===6&&table.every((c,i)=>c&&c.rank===table[0].rank+i)&&table[0].rank>=1&&table[5].rank<=13}
function play(g,hand,pos){if(status(g)!=='playing'||g.phase!=='play'||!g.hand[hand]||g.table[pos])return false;g.lastBonus=null;g.table[pos]=g.hand.splice(hand,1)[0];g.turns++;g.phase=g.deck.length||g.market.some(Boolean)?'draw':'play';if(orderedSix(g.table)){g.score+=100;g.combos++;g.sixRunBonuses=(g.sixRunBonuses||0)+1;g.lastBonus='SixRun';g.table.fill(null)}return true}
function draw(g,source){if(g.phase!=='draw'||status(g)!=='playing')return false;let c;if(source==='deck'){if(!g.deck.length)return false;c=g.deck.pop()}else{if(!Number.isInteger(source)||source<0||source>2||!g.market[source])return false;c=g.market[source];g.market[source]=g.deck.pop()||null}g.hand.push(c);g.phase='play';return c}
function claim(g,positions){if(status(g)!=='playing'||new Set(positions).size!==positions.length)return false;let k=kind(positions.map(p=>g.table[p]));if(!k)return false;positions.forEach(p=>g.table[p]=null);g.combos++;g.score+=({Pair:20,Run:40,Flush:30})[k];return k}
root.TheDraw={suits,start,kind,available,status,play,draw,claim,orderedSix};
})(typeof module!=='undefined'?module.exports:globalThis);

