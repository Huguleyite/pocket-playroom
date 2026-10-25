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
 const properties=[
 {id:'atlas',title:'Atlas Valley Books',line:'Find your next read.',mark:'AV',url:'https://www.atlasvalleybooks.com/'},
 {id:'helios',title:'Helios Valley',line:'Your next world is waiting for color.',mark:'HV',url:'https://www.atlasvalleybooks.com/helios/'},
 {id:'halloween',title:'Crow’s Hollow',line:'Find your shade of spooky.',mark:'CH',url:'https://www.atlasvalleybooks.com/helios/halloween/'},
 {id:'room',title:'Read the Room',line:'Politics, explained without the spin.',mark:'RTR',url:'https://readtheroom.news/'},
 {id:'frequency',title:'The Frequency',line:'Alabama and Chambers County. Tune in.',mark:'TF',url:'https://readtheroom.news/the-frequency/'},
 {id:'vibe',title:'VibeFrag',line:'Explore your next fragrance.',mark:'VF',url:'https://vibefrag.com/index.html'}
 ];
 let propertyCursor=Math.floor(Math.random()*properties.length);
 let cursor=Math.floor(Math.random()*catalogue.length);
 const selector='.ad-space,[data-ad-slot],[data-ad-placement],[data-display-ad]';
 function fill(){
  const current=location.hash.split('/').pop()||location.pathname.split('/').at(-2);
  document.querySelectorAll(selector).forEach(slot=>{
   if(slot.dataset.houseFor===current||slot.querySelector('a:not(.house-promo)'))return;
   if(slot.closest('.anchor-ad,.ad-anchor,.ad-anchor-wrapper')&&window!==window.top)return;
   const choices=catalogue.filter(g=>g[0]!==current),g=choices[cursor++%choices.length];
   const property=properties[propertyCursor++%properties.length];
   const route=['chronodeck','hex-gambit','lineage','quantum-draft'].includes(g[0])?'big-screen/':'games/';
   const link=document.createElement('a');link.className='house-promo';link.href=new URL('index.html#'+route+g[0],base);link.href=property.url;link.target='_blank';link.rel='noopener noreferrer';
   const mark=document.createElement('span');mark.className='house-mark';mark.textContent=property.mark;
   const copy=document.createElement('span');copy.className='house-copy';
   const label=document.createElement('small');label.textContent='Advertisement · From our family of sites';
   const title=document.createElement('strong');title.textContent=property.title;
   const line=document.createElement('span');line.textContent=property.line;
   copy.append(label,title,line);const arrow=document.createElement('span');arrow.textContent='→';arrow.setAttribute('aria-hidden','true');
   link.append(mark,copy,arrow);slot.replaceChildren(link);slot.dataset.houseFor=current;slot.classList.add('house-slot');
   slot.classList.toggle('house-tall',parseFloat(getComputedStyle(slot).height)>120);
   slot.setAttribute('aria-label','Advertisement: '+property.title);
   const wrapper=slot.closest('aside');if(wrapper)wrapper.setAttribute('aria-label','More from Pocket Playroom');
   const labelNode=slot.parentElement?.querySelector(':scope > .ad-label');if(labelNode)labelNode.textContent='Advertisement · Our sites';
  });
 }
 fill();new MutationObserver(fill).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('hashchange',fill);
})();
