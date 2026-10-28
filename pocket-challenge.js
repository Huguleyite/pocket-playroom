/* Versioned round identities. No changes to the browser clock or native storage API. */
(() => {
  'use strict';
  const VERSION = '1', ids = ['weave','tide','shift','lock','deli','binario','futoshiki','signal','draw','draw-scorecard'];
  const raw = new URLSearchParams(location.search).get('challenge');
  let incoming = null, invalid = false, roundSeed = crypto.getRandomValues(new Uint32Array(1))[0], rng, randomCount=0;
  function decode(value) {
    if (!value || value.length > 1200) throw Error('Invalid challenge');
    const c = JSON.parse(atob(value.replace(/-/g,'+').replace(/_/g,'/')));
    if (c.v !== VERSION || !ids.includes(c.id) || !/^\d{4}-\d{2}-\d{2}$/.test(c.day) ||
        !Number.isFinite(Date.parse(c.day+'T12:00:00Z')) || new Date(c.day+'T12:00:00Z').toISOString().slice(0,10)!==c.day ||
        !Number.isSafeInteger(c.seed) || c.seed<0 || c.seed>4294967295 || !Number.isSafeInteger(c.target) || c.target<0 || c.target>1000000000 ||
        !['daily','extra','retro','garden','future','classic','scorecard','guided'].includes(c.mode)) throw Error('Unsupported challenge');
    const modes={binario:['daily','extra'],deli:['retro','garden','future'],draw:['classic'],'draw-scorecard':['scorecard','guided']};
    if (!(modes[c.id] || ['daily']).includes(c.mode)) throw Error('Invalid mode');
    if(c.variant!==undefined && (c.id!=='binario'||!['balanced-v1','balanced-v2'].includes(c.variant)))throw Error('Invalid puzzle edition');
    return c;
  }
  if (raw) { try { incoming=decode(raw); } catch { invalid=true; } }
  const localDay=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  function encode(c) { return btoa(JSON.stringify(c)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
  const storage = {
    getItem(key) { return localStorage.getItem(incoming ? `pocket:challenge:${raw}:${key}` : key); },
    setItem(key,value) { localStorage.setItem(incoming ? `pocket:challenge:${raw}:${key}` : key,value); },
    removeItem(key) { localStorage.removeItem(incoming ? `pocket:challenge:${raw}:${key}` : key); }
  };
  function seed(isGuided=false) {
    roundSeed = incoming ? incoming.seed : isGuided ? 42 : crypto.getRandomValues(new Uint32Array(1))[0];
    let s=roundSeed;randomCount=0;
    rng=()=>{randomCount++;s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};
    return roundSeed;
  }
  function calendarDate() {
    if (!incoming) return new Date();
    const d=new Date(incoming.day+'T12:00:00Z');
    // Calendar getters keep local-day generators on the pinned date in every timezone.
    d.getFullYear=()=>d.getUTCFullYear();d.getMonth=()=>d.getUTCMonth();d.getDate=()=>d.getUTCDate();
    return d;
  }
  function metric(id) { return ['weave','tide','deli','draw','draw-scorecard'].includes(id) ? {unit:'points',lower:false} : {unit:'moves',lower:true}; }
  function link(id,data) {
    const c={v:VERSION,id,day:data.day||incoming?.day||localDay(),seed:roundSeed,mode:data.mode||'daily',target:data.value,...(data.variant?{variant:data.variant}:{})};
    decode(encode(c));
    const url=new URL('../../index.html',location.href);
    url.search='';url.hash=`challenge/${encode(c)}`;
    return url.href;
  }
  function compare(id,value) {
    if (!incoming || incoming.id!==id) return '';
    if(value===incoming.target)return 'You tied the challenge.';
    return (metric(id).lower ? value<incoming.target : value>incoming.target) ? 'You beat the challenge!' : 'Challenge complete.';
  }
  function banner() {
    if (!incoming) return;
    const box=document.createElement('section');box.className='pocket-challenge-banner';
    const h=document.createElement('strong');h.textContent=`Beat ${incoming.target} ${metric(incoming.id).unit}`;
    const p=document.createElement('p');p.textContent=`${incoming.day} · ${incoming.mode} · Separate challenge save`;
    const back=document.createElement('a');back.textContent="Back to today's game";back.href='../../index.html#games/'+(incoming.id==='draw-scorecard'?'draw/scorecard':incoming.id);back.target='_top';
    box.append(h,p,back);(document.querySelector('main')||document.body).prepend(box);
  }
  window.PocketChallenge=Object.freeze({incoming,invalid,decode,encode,storage,calendarDate,seed,random:()=>rng(),randomCount:()=>randomCount,restoreRandom:n=>{seed();if(Number.isSafeInteger(n)&&n>=0&&n<100000)for(let i=0;i<n;i++)rng();},link,metric,compare,day:()=>incoming?.day||localDay(),getSeed:()=>roundSeed});
  addEventListener('DOMContentLoaded',banner);
})();
