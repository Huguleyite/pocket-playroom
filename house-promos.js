// Free Helios pages; paid advertiser links retain priority.
(()=>{
 const version='freepages2';
 if(window.PocketHouseAds?.version===version){window.PocketHouseAds.refresh();return;}
 const base=new URL('./',document.currentScript.src);
 const offers=[
 {id:'landscapes',title:'Color a world beyond ours.',short:'Your next world. In color.',line:'Free alien landscapes to download and print.',art:'gps-bonus-detailed.webp',tone:'cosmic'},
 {id:'creatures',title:'Meet your next coloring obsession.',short:'Creatures worth coloring.',line:'Free alien creature pages. Let your imagination loose.',art:'ufo-bonus-detailed.webp',tone:'violet'},
 {id:'botanicals',title:'Let your imagination bloom.',short:'Something wild to color.',line:'Free alien botanical pages, ready for your colors.',art:'xenobotanica-bonus-detailed.webp',tone:'botanical'}];
 let cursor=Math.floor(Math.random()*offers.length);
 // Match the legacy slot marker so an older observer won't overwrite upgraded ads.
 function fill(){const current=location.hash.split('/').pop()||location.pathname.split('/').at(-2);
 document.querySelectorAll('.ad-space,[data-ad-slot],[data-ad-placement],[data-display-ad]').forEach(slot=>{
 if((slot.dataset.houseFor===current&&slot.dataset.houseVersion===version&&slot.querySelector('.house-creative'))||slot.querySelector('a:not(.house-promo)'))return;
 if(slot.closest('.anchor-ad,.ad-anchor,.ad-anchor-wrapper')&&window!==window.top)return;
 const offer=offers.find(o=>o.id===slot.dataset.houseTheme)||offers[cursor++%offers.length];
 const link=document.createElement('a');link.className='house-promo house-creative house-'+offer.tone;link.href='https://www.atlasvalleybooks.com/helios/#bonus-downloads';link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',offer.title+' Get free coloring pages from Helios Valley. Opens in a new tab.');
 const visual=document.createElement('span');visual.className='house-visual';const image=document.createElement('img');image.src=new URL('assets/ads/'+offer.art,base).href;image.alt='Free '+offer.id+' coloring page preview';image.decoding='async';visual.append(image);
 const badge=document.createElement('span');badge.className='house-free';badge.textContent='FREE';visual.append(badge);
 const copy=document.createElement('span');copy.className='house-copy';
 for(const [tag,cls,text]of [['small','house-disclosure','ADVERTISEMENT · HELIOS VALLEY'],['strong','house-headline',offer.title],['strong','house-short',offer.short],['span','house-description',offer.line],['span','house-note','Print at home. No email required.'],['span','house-cta','Get free pages ↗']]){const el=document.createElement(tag);el.className=cls;el.textContent=text;copy.append(el);}
 link.append(visual,copy);slot.replaceChildren(link);slot.dataset.houseFor=current;slot.dataset.houseVersion=version;slot.classList.add('house-slot');slot.setAttribute('aria-label','Advertisement: Free Helios Valley coloring pages');const wrapper=slot.closest('aside');if(wrapper)wrapper.setAttribute('aria-label','Advertisement: Free Helios Valley coloring pages');
 });}
 window.PocketHouseAds=Object.freeze({version,refresh:fill});fill();new MutationObserver(fill).observe(document.body,{childList:true,subtree:true});addEventListener('hashchange',fill);
})();
