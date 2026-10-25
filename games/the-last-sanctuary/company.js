'use strict';
(()=>{
 const {roster}=CrownMiniatureStudy,$=s=>document.querySelector(s);let selected=0;
 roster.forEach((unit,i)=>{
  const b=document.createElement('button');b.type='button';b.className='figure-card';b.dataset.figure=unit.id;b.setAttribute('aria-label',`Inspect ${unit.name}, ${unit.role}`);
  const stage=document.createElement('span');stage.className='figure-stage';const img=document.createElement('img');img.src=unit.image;img.alt=unit.copy;stage.append(img);b.append(stage);
  const index=document.createElement('span');index.className='figure-index';index.textContent='0'+(i+1);b.append(index);
  const name=document.createElement('h2');name.textContent=unit.name;b.append(name);const role=document.createElement('span');role.className='figure-role';role.textContent=unit.role.toUpperCase();b.append(role);const hint=document.createElement('span');hint.className='figure-hint';hint.textContent='Examine miniature ↗';b.append(hint);
  img.addEventListener('error',()=>{const note=document.createElement('p');note.className='image-error';note.textContent='This miniature could not load. Refresh to try again.';b.append(note);});
  b.addEventListener('click',()=>open(i));$('#lineup').append(b);
 });
 function show(i){selected=(i+roster.length)%roster.length;const u=roster[selected];$('#figure-image').src=u.image;$('#figure-image').alt=u.copy;$('#figure-tag').textContent=u.tag;$('#figure-title').textContent=u.name+' · '+u.role;$('#figure-copy').textContent=u.copy;$('#figure-identity').textContent=u.identity;}
 function open(i){show(i);$('#figure-dialog').showModal();}
 $('#close-figure').addEventListener('click',()=>$('#figure-dialog').close());$('#previous-figure').addEventListener('click',()=>show(selected-1));$('#next-figure').addEventListener('click',()=>show(selected+1));
 $('#figure-dialog').addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(selected+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(selected-1);}});
 function size(board){$('#lineup').classList.toggle('board-size',board);$('#board-size').setAttribute('aria-pressed',board);$('#detail-size').setAttribute('aria-pressed',!board);}
 $('#board-size').addEventListener('click',()=>size(true));$('#detail-size').addEventListener('click',()=>size(false));
})();
