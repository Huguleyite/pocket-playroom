(()=>{
 const ui=window.DrawPolish;if(!ui)return;
 let previous=null;const original=ui.update;
 const label=document.querySelector('.felt>.label>span');
 if(label){const slots=document.createElement('small');slots.id='open-spaces';label.append(slots)}
 ui.update=function(game){
  original(game);
  const open=game.table.filter(c=>!c).length,slots=document.getElementById('open-spaces');
  if(slots)slots.textContent=`${open} open`;
  document.body.classList.toggle('combination-ready',!document.getElementById('collect').disabled);
  document.querySelectorAll('.card').forEach(card=>{const rank=card.querySelector('.rank')?.textContent;const court={J:'JACK',Q:'QUEEN',K:'KING'}[rank];if(court){card.classList.add('court-card');card.dataset.court=court}});
  if(previous&&game.combos===previous.combos){
   if(game.turns===previous.turns+1){const pos=game.table.findIndex((c,i)=>c&&(!previous.table[i]||previous.table[i]!==`${c.rank}:${c.suit}`));document.querySelector(`[data-slot="${pos}"]`)?.classList.add('card-arrived')}
   else if(game.turns===previous.turns&&previous.phase==='draw'&&game.phase==='play')document.querySelector('#hand .card:last-child')?.classList.add('card-drawn');
  }
  previous={turns:game.turns,phase:game.phase,combos:game.combos,table:game.table.map(c=>c?`${c.rank}:${c.suit}`:null)};
 };
})();
