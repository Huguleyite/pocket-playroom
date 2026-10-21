(() => {
 'use strict';
 const $=id=>document.getElementById(id),binary=document.body.dataset.game==='binario',size=binary?6:5,count=size*size;
 const solution=binary?[...'001011001101110010010011101100110100'].map(Number):Array.from({length:25},(_,i)=>(Math.floor(i/5)+i%5)%5+1);
 const givens=new Set(binary?[0,3,5,7,9,12,16,20,23,25,29,30,33]:[0,4,6,13,16,20,24]);
 const key=`room-for-play:sample:${binary?'binario':'futoshiki'}:v1`;
 let values=solution.map((v,i)=>givens.has(i)?v:null),notes={},moves=0,selected=1,pencil=false,history=[];
 const horizontal=[0,3,6,8,11,17,21],vertical=[1,4,7,10,14,16,19];
 try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&Array.isArray(saved.values)&&saved.values.length===count&&saved.values.every(v=>v===null||Number.isInteger(v)&&v>=(binary?0:1)&&v<=(binary?1:5))){values=saved.values.map((v,i)=>givens.has(i)?solution[i]:v);moves=Number.isSafeInteger(saved.moves)&&saved.moves>=0?saved.moves:0;if(saved.notes&&typeof saved.notes==='object')for(const [i,marks]of Object.entries(saved.notes))if(Number.isInteger(Number(i))&&Number(i)>=0&&Number(i)<count&&!givens.has(Number(i))&&Array.isArray(marks))notes[i]=[...new Set(marks.filter(n=>Number.isInteger(n)&&n>=1&&n<=5))];}}catch{}
 function persist(){try{localStorage.setItem(key,JSON.stringify({values,notes,moves}));}catch{$('saving').textContent='Saving is unavailable in this browser. You can still play this visit.';}}
 function snapshot(){history.push({values:[...values],notes:JSON.parse(JSON.stringify(notes)),moves});if(history.length>100)history.shift();}
 function label(i){return `Row ${Math.floor(i/size)+1}, column ${i%size+1}, ${values[i]===null?'empty':values[i]}${givens.has(i)?', fixed clue':''}`;}
 function render(){
  $('filled').textContent=values.filter(v=>v!==null).length+'/'+count;$('moves').textContent=moves;$('undo').disabled=history.length===0;
  if(binary)$('board').innerHTML=`<div class="binary-board">${values.map((v,i)=>`<button class="binary-cell ${givens.has(i)?'fixed':''}" data-cell="${i}" data-value="${v??''}" aria-label="${label(i)}" ${givens.has(i)?'disabled':''}>${v??'·'}</button>`).join('')}</div>`;
  else{
   let html='';for(let r=0;r<9;r++)for(let c=0;c<9;c++){
    const position=`grid-row:${r+1};grid-column:${c+1}`;
    if(r%2===0&&c%2===0){const i=r/2*5+c/2;html+=`<button class="futo-cell ${givens.has(i)?'fixed':''} ${selected===i?'selected':''} ${values[i]===null&&notes[i]?.length?'pencil':''}" style="${position}" data-cell="${i}" aria-label="${label(i)}" ${givens.has(i)?'disabled':''}>${values[i]??notes[i]?.join(' ')??''}</button>`;}
    else if(r%2===0&&c%2===1){const i=r/2*5+(c-1)/2;if(horizontal.includes(i)){const less=solution[i]<solution[i+1];html+=`<span class="inequality" style="${position}" aria-label="Left number ${less?'less':'greater'} than right">${less?'&lt;':'&gt;'}</span>`;}}
    else if(r%2===1&&c%2===0){const i=(r-1)/2*5+c/2;if(vertical.includes(i)){const less=solution[i]<solution[i+5];html+=`<span class="inequality" style="${position}" aria-label="Top number ${less?'less':'greater'} than bottom">${less?'⌃':'⌄'}</span>`;}}
   }$('board').innerHTML=`<div class="futo-board">${html}</div>`;
  }
  $('board').querySelectorAll('[data-cell]').forEach(button=>button.addEventListener('click',()=>{const i=Number(button.dataset.cell);if(binary){snapshot();values[i]=values[i]===null?0:values[i]===0?1:null;moves++;persist();}else selected=i;render();$('board').querySelector(`[data-cell="${i}"]`)?.focus({preventScroll:true});}));
 }
 function place(n){if(binary||givens.has(selected))return;snapshot();if(pencil){values[selected]=null;const marks=new Set(notes[selected]||[]);if(marks.has(n))marks.delete(n);else marks.add(n);notes[selected]=[...marks].sort();}else{values[selected]=n;delete notes[selected];}moves++;persist();render();$('status').textContent=pencil?'A possibility, penciled in.':'A number finds its place.';}
 function check(){
  const rows=Array.from({length:size},(_,r)=>values.slice(r*size,r*size+size)),cols=Array.from({length:size},(_,c)=>Array.from({length:size},(_,r)=>values[r*size+c]));let bad;
  if(binary){bad=[...rows,...cols].some(line=>line.filter(v=>v===0).length>size/2||line.filter(v=>v===1).length>size/2||line.some((v,i)=>i<size-2&&v!==null&&v===line[i+1]&&v===line[i+2]))||[rows,cols].some(lines=>{const complete=lines.filter(line=>!line.includes(null)).map(line=>line.join(''));return new Set(complete).size!==complete.length;});}
  else bad=[...rows,...cols].some(line=>{const filled=line.filter(v=>v!==null);return new Set(filled).size!==filled.length;})||horizontal.some(i=>values[i]!==null&&values[i+1]!==null&&(solution[i]<solution[i+1]?values[i]>=values[i+1]:values[i]<=values[i+1]))||vertical.some(i=>values[i]!==null&&values[i+5]!==null&&(solution[i]<solution[i+5]?values[i]>=values[i+5]:values[i]<=values[i+5]));
  if(bad)$('status').textContent=binary?'Check balance, triples, and duplicate lines.':'Check repeated numbers and inequality signs.';
  else if(values.includes(null))$('status').textContent='No rule conflicts so far. Keep going.';
  else{window.roomComplete?.('futoshiki');$('status').textContent='✓ Sample solved. Everything clicks.';$('complete-text').textContent=`You solved this practice board in ${moves} moves.`;if(!$('complete').open)$('complete').showModal();}
 }
 $('size').textContent=size+' × '+size;
 $('instruction').textContent=binary?'Tap to cycle: blank → 0 → 1 → blank. Dotted tiles are fixed clues.':'Select a square, then choose 1–5. Pencil toggles candidate marks.';
 if(!binary){$('keypad').hidden=false;$('pencil').hidden=false;$('erase').hidden=false;$('keypad').innerHTML=[1,2,3,4,5].map(n=>`<button data-number="${n}" aria-label="Enter ${n}">${n}</button>`).join('');$('keypad').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>place(Number(button.dataset.number))));}
 $('pencil').onclick=()=>{pencil=!pencil;$('pencil').setAttribute('aria-pressed',String(pencil));};
 $('erase').onclick=()=>{if(givens.has(selected))return;snapshot();values[selected]=null;delete notes[selected];moves++;persist();render();};
 $('undo').onclick=()=>{const prior=history.pop();if(prior){values=prior.values;notes=prior.notes;moves=prior.moves;persist();render();}};
 $('check').onclick=check;$('close-complete').onclick=()=>$('complete').close();
 $('reset').onclick=()=>{if(!confirm('Restart this sample and clear its saved progress?'))return;values=solution.map((v,i)=>givens.has(i)?v:null);notes={};moves=0;history=[];persist();render();$('status').textContent='A fresh start. Make your next move.';};
 document.addEventListener('keydown',event=>{if(!binary&&/^[1-5]$/.test(event.key)&&!$('complete').open){event.preventDefault();place(Number(event.key));}});
 $('status').textContent='A little logic. A little room to think.';render();
})();
