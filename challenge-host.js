(() => {
  const titles={weave:'Weave It to Me',tide:'Tile Tide',shift:'Shift & Lock',lock:'LetterLock',deli:'Stack to the Future',binario:'Binario / Neon Logic',futoshiki:'Futoshiki',signal:'Signal Flow',draw:'The Draw','draw-scorecard':'The Draw: Scorecard'};
  let version=0;
  window.PocketChallengeHost={render(){
    const n=++version;
    if(!location.hash.startsWith('#challenge/'))return false;
    const main=document.getElementById('main'),token=location.hash.slice(11);
    document.getElementById('mobile-ad-anchor').hidden=true;
    document.body.className='challenge-page';document.documentElement.removeAttribute('style');
    main.replaceChildren();
    const back=document.createElement('a');back.href='#home';back.className='back-link';back.textContent='← Pocket Games';main.append(back);
    let c;try{c=PocketChallenge.decode(token);}catch{
      const p=document.createElement('p');p.textContent='This challenge is unavailable or uses an unsupported rules version. Ask your friend for a new link.';p.setAttribute('role','alert');main.append(p);return true;
    }
    document.title=titles[c.id]+' · Beat my score · Pocket Playroom';
    const intro=document.createElement('section');intro.className='challenge-intro';
    const h=document.createElement('h1');h.textContent=titles[c.id];
    const target=document.createElement('h2');target.textContent=`Beat ${c.target} ${PocketChallenge.metric(c.id).unit}`;
    const p=document.createElement('p');p.textContent=`Same round. Same rules. ${c.day} · ${c.mode}. Your daily progress stays saved separately.`;
    const start=document.createElement('button');start.textContent='Start challenge';start.className='pill-link';
    const status=document.createElement('p');status.setAttribute('role','status');
    const ad=document.createElement('aside');ad.className='challenge-landing-ad';ad.setAttribute('aria-label','Advertisement');
    const slot=document.createElement('div');slot.className='ad-space';slot.dataset.adSlot='challenge-landing';slot.dataset.adWidth='320';slot.dataset.adHeight='90';slot.textContent='ADVERTISEMENT';
    ad.append(slot);
    intro.append(h,target,p,start,status,ad);main.append(intro);
    start.onclick=async()=>{
      start.disabled=true;status.textContent='Getting your challenge ready…';
      const access=await window.roomAdAccess.check();if(n!==version)return;
      if(access==='blocked'){status.textContent='Please allow ads for Pocket Playroom, then try again.';start.disabled=false;return;}
      const frame=document.createElement('iframe');frame.id='game-frame';frame.title='Play '+titles[c.id];frame.allow='web-share; clipboard-write';
      const file=c.id==='draw-scorecard'?'draw/scorecard.html':c.id+'/index.html';
      frame.src='games/'+file+'?challenge='+encodeURIComponent(token);
      frame.onload=()=>{status.textContent='';intro.hidden=true;};
      main.append(frame);
      const onHeight=e=>{if(e.source===frame.contentWindow&&e.origin===location.origin&&e.data?.type==='room:height'&&Number.isFinite(e.data.height))frame.style.height=Math.max(350,Math.min(5000,e.data.height))+'px';};
      addEventListener('message',onHeight);
      frame.addEventListener('load',()=>{if(c.id==='signal'||c.id==='binario')frame.contentWindow.postMessage({type:'room:night',enabled:true},location.origin);});
    };
    return true;
  }};
})();
