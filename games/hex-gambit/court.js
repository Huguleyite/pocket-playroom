/* Presentation preferences never enter the saved match or alter move rules. */
(() => {
  let settings={view:matchMedia('(max-width:999px)').matches?'overhead':'angled',effects:'full',board:'obsidian'};
  try { const saved=JSON.parse(localStorage.getItem('hex-gambit.court.v1')); if(['obsidian','ivory','astral'].includes(saved?.board))settings.board=saved.board; if(['overhead','angled'].includes(saved?.view))settings.view=saved.view;if(['full','reduced','off'].includes(saved?.effects))settings.effects=saved.effects; } catch {}
  const controls=document.createElement('div');controls.className='court-controls';
  controls.innerHTML='<span class="court-signature">OBSIDIAN COURT · VOLCANIC GLASS / BRASS</span><label>Board <select aria-label="Board design"><option value="obsidian">Obsidian Court</option><option value="ivory">Ivory Citadel</option><option value="astral">Astral Nexus</option></select></label><label>View <select aria-label="Board view"><option value="overhead">Overhead</option><option value="angled">Angled table</option></select></label><label>Effects <select aria-label="Board effects"><option value="full">Full</option><option value="reduced">Reduced</option><option value="off">Off</option></select></label>';
  document.querySelector('#battleView').before(controls);
  const wrap=document.querySelector('.board-wrap'),stage=document.createElement('div');stage.className='court-stage';wrap.before(stage);stage.append(wrap);
  const apply=()=>{document.body.dataset.courtBoard=settings.board;controls.querySelector('[aria-label="Board design"]').value=settings.board;controls.querySelector('.court-signature').textContent=({obsidian:'OBSIDIAN COURT · VOLCANIC GLASS / BRASS',ivory:'IVORY CITADEL · POLISHED STONE / WALNUT',astral:'ASTRAL NEXUS · CELESTIAL CRYSTAL / SILVER'})[settings.board];document.body.dataset.courtView=settings.view;document.body.dataset.courtEffects=settings.effects;controls.querySelector('[aria-label="Board view"]').value=settings.view;controls.querySelector('[aria-label="Board effects"]').value=settings.effects;};
  controls.addEventListener('change',e=>{cleanupFX();document.querySelectorAll('.court-trail').forEach(e=>e.remove());settings[e.target.getAttribute('aria-label')==='Board view'?'view':e.target.getAttribute('aria-label')==='Board design'?'board':'effects']=e.target.value;apply();try{localStorage.setItem('hex-gambit.court.v1',JSON.stringify(settings))}catch{}});
  apply();
  const sync=()=>{controls.hidden=document.querySelector('#battleView').hidden;};
  new MutationObserver(sync).observe(document.querySelector('#battleView'),{attributes:true,attributeFilter:['hidden']});sync();
  const originalReduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

  const originalMove=animateMove;
  animateMove=function(m,attacker,victim,snapshot,promoted){
    originalMove(m,attacker,victim,snapshot,promoted);
    if(originalReduce()||settings.effects==='off')return;
    const dest=document.querySelector('[data-square="'+m.to+'"]');
    dest?.classList.add(promoted?'court-crowned':'court-arrival');
    setTimeout(()=>dest?.classList.remove('court-crowned','court-arrival'),1100);
    if(settings.effects!=='full'||!snapshot.from||!snapshot.to)return;
    const from=center(snapshot.from),to=center(snapshot.to),count=victim?18:10;
    for(let i=0;i<count;i++){
      const dot=document.createElement('i');dot.className='court-trail';const t=i/(count-1);dot.style.left=(from.x+(to.x-from.x)*t)+'px';dot.style.top=(from.y+(to.y-from.y)*t)+'px';document.body.append(dot);
      const anim=dot.animate([{opacity:0,transform:'scale(.3)'},{opacity:1,offset:.3},{opacity:0,transform:'translateY(-18px) scale(0)'}],{duration:650,delay:t*240,easing:'ease-out'});anim.finished.finally(()=>dot.remove());
    }
    const color=({obsidian:'#efc879',ivory:'#ddb77a',astral:'#a6c9ff'})[settings.board];
    ringAt(snapshot.to,color,230);
    if(victim)ringAt(snapshot.capture||snapshot.to,color,150);
    if(settings.board==='astral')ringAt(snapshot.to,'#bba5ff',350);
  };
})();
