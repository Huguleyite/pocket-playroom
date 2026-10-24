// Local catalogue fallback. Slots containing an advertiser link are left intact.
(() => {
 const base=new URL('./',document.currentScript.src);
 const catalogue=[
  ['binario','Binario','A fresh daily logic puzzle.','01'],
  ['futoshiki','Futoshiki','Make every inequality count.','<>'],
  ['weave','Weave It to Me','Good words come together.','W'],
  ['tide','Tile Tide','Find words. Make waves.','≈'],
  ['shift','Shift & Lock','Find your daily connection.','↔'],
  ['lock','LetterLock','Crack your next word puzzle.','L'],
  ['deli','Stack to the Future','Build your next great sandwich.','★'],
  ['chronodeck','ChronoDeck: Breach','Explore a tactical card adventure.','✦'],
  ['hex-gambit','Hex-Gambit','Step into a new tactical challenge.','⬡'],
  ['lineage','Lineage: Kingdom Architect','Build a kingdom of your own.','♜'],
  ['quantum-draft','Quantum Draft','Learn a new card game.','Q']
 ];
 let cursor=Math.floor(Math.random()*catalogue.length);
 const selector='.ad-space,[data-ad-slot],[data-ad-placement],[data-display-ad]';
 function fill(){
  const current=location.hash.split('/').pop()||location.pathname.split('/').at(-2);
  document.querySelectorAll(selector).forEach(slot=>{
   if(slot.dataset.houseFor===current||slot.querySelector('a:not(.house-promo)'))return;
   if(slot.closest('.anchor-ad,.ad-anchor,.ad-anchor-wrapper')&&window!==window.top)return;
   const choices=catalogue.filter(g=>g[0]!==current),g=choices[cursor++%choices.length];
   const route=['chronodeck','hex-gambit','lineage','quantum-draft'].includes(g[0])?'big-screen/':'games/';
   const link=document.createElement('a');link.className='house-promo';link.href=new URL('index.html#'+route+g[0],base);link.target='_top';
   const mark=document.createElement('span');mark.className='house-mark';mark.textContent=g[3];
   const copy=document.createElement('span');copy.className='house-copy';
   const label=document.createElement('small');label.textContent='More from Pocket Playroom';
   const title=document.createElement('strong');title.textContent=g[1];
   const line=document.createElement('span');line.textContent=g[2];
   copy.append(label,title,line);const arrow=document.createElement('span');arrow.textContent='→';arrow.setAttribute('aria-hidden','true');
   link.append(mark,copy,arrow);slot.replaceChildren(link);slot.dataset.houseFor=current;slot.classList.add('house-slot');
   slot.classList.toggle('house-tall',parseFloat(getComputedStyle(slot).height)>120);
   slot.setAttribute('aria-label','More from Pocket Playroom');
   const wrapper=slot.closest('aside');if(wrapper)wrapper.setAttribute('aria-label','More from Pocket Playroom');
   const labelNode=slot.parentElement?.querySelector(':scope > .ad-label');if(labelNode)labelNode.textContent='More from Pocket Playroom';
  });
 }
 fill();new MutationObserver(fill).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('hashchange',fill);
})();
