// Collection-owned advertising. Games and saved progress stay independent.
(() => {
  'use strict';
  // Welcome/showcase pages never carry desktop ads, even with a cached script tag.
  if (!document.body.dataset.desktopAdGame) return;
  if (window.PocketDesktopAds) return;
  const base = new URL('./', document.currentScript.src);
  const games = ['chronodeck', 'lineage', 'hex-gambit', 'quantum-draft', 'frequency-1984', 'blackout'];
  const offers = [
    {id:'atlas', name:'Atlas Valley', title:'Your next story is waiting.', cta:'Explore books', href:'https://www.atlasvalleybooks.com/', art:'assets/brands/atlas-valley.png'},
    {id:'vibefrag', name:'VibeFrag', title:'Find your next signature scent.', cta:'Explore VibeFrag', href:'https://www.vibefrag.com/', art:'assets/brands/vibefrag.png'},
    {id:'helios', name:'Helios Valley', title:'Color a world beyond ours.', cta:'Get free pages', href:'https://www.atlasvalleybooks.com/helios/#bonus-downloads', art:'assets/brands/helios-valley.png'},
    {id:'read-the-room', name:'Read the Room', title:'Read beyond the headline.', cta:'Read the Room', href:'https://www.readtheroom.news/', art:'assets/brands/read-the-room.png'},
    {id:'nordvpn', name:'NordVPN', title:'Explore VPN plans.', cta:'Explore NordVPN', href:'https://www.kqzyfj.com/click-101910956-15640650', art:'assets/ads/nordvpn-300x250.png', affiliate:true}
  ];
  let route = '', cursor = 0, host;
  const el = (tag, cls, text) => {const node=document.createElement(tag);node.className=cls;if(text)node.textContent=text;return node;};
  function paint() {
    const offer=offers[cursor%offers.length];
    const link=el('a','desktop-ad-link');link.href=offer.href;link.target='_blank';link.rel=offer.affiliate?'sponsored noopener noreferrer':'noopener noreferrer';
    link.setAttribute('aria-label',offer.name+': '+offer.title+' '+offer.cta+'. Opens in a new tab.');
    const image=el('img','desktop-ad-art');image.src=new URL(offer.art,base).href;image.alt=offer.name;image.width=80;image.height=48;
    const copy=el('span','desktop-ad-copy');
    copy.append(el('small','desktop-ad-label','ADVERTISEMENT · '+offer.name),el('strong','desktop-ad-headline',offer.title));
    if(offer.affiliate)copy.append(el('small','desktop-ad-disclosure','We may earn a commission if you purchase through this ad.'));
    link.append(image,copy,el('span','desktop-ad-cta',offer.cta+' ↗'));
    const next=el('button','desktop-ad-next','Next ad');next.type='button';next.setAttribute('aria-label','Show next advertisement');
    next.addEventListener('click',()=>{cursor++;paint();host.querySelector('button').focus({preventScroll:true});});
    host.dataset.advertiser=offer.id;host.replaceChildren(link,next);
  }
  function sync() {
    const game=document.body.dataset.desktopAdGame;
    const key=game;
    if(!games.includes(key)){host?.remove();host=null;route='';return;}
    const parent=game?document.body:document.getElementById('main');
    if(!parent)return;
    if(!host?.isConnected){host=el('aside','desktop-promo');host.setAttribute('aria-label','Advertisement');
      if(game){const tools=document.querySelector('.playroom-tools');if(tools)tools.append(host);else {
        parent.prepend(host);
        const measure=()=>document.documentElement.style.setProperty('--desktop-ad-height',host.getBoundingClientRect().height+'px');
        new ResizeObserver(measure).observe(host);measure();
      }}
      else parent.prepend(host);
    }
    if(key!==route||!host.childElementCount){route=key;cursor=games.indexOf(key)%offers.length;paint();}
  }
  window.PocketDesktopAds=Object.freeze({refresh:sync});
  sync();
  if(document.body.dataset.desktopAdGame==='frequency-1984'){
    const scene=document.querySelector('.scene');
    if(scene){
      const fit=()=>{
        if(innerWidth<1000||innerHeight<720){scene.style.removeProperty('max-width');return;}
        const top=scene.getBoundingClientRect().top+scrollY;
        const width=`min(100%, ${Math.floor(Math.max(220,innerHeight-top-16)*1672/941)}px)`;
        if(scene.style.maxWidth!==width)scene.style.maxWidth=width;
      };
      new ResizeObserver(fit).observe(document.body);
      addEventListener('resize',fit);document.fonts?.ready.then(fit);fit();
    }
  }
  // Route renderers replace main's children; observe child lists, never ad attributes.
  const main=document.getElementById('main');
  if(main)new MutationObserver(sync).observe(main,{childList:true});
  addEventListener('hashchange',sync);
  // No animation or background refresh: change only a visible, unattended ad.
  setInterval(()=>{
    if(!host?.isConnected||document.hidden||!document.hasFocus()||host.matches(':hover,:focus-within'))return;
    const r=host.getBoundingClientRect();
    if(r.top>=0&&r.bottom<=innerHeight){cursor++;paint();}
  },60000);
})();
