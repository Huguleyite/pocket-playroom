/* A quiet game invitation, separate from the scored challenge on results. */
(() => {
 const base=new URL('./',document.currentScript.src);
 function install(){
  if(window!==top)return;
  const game=window.PocketRecent?.currentGame();
  if(!game)return;
  const existing=document.querySelector('.game-invite-area'),barHost=document.querySelector('.game-invite-bar');
  // Signal Station's top controls share one wrapping row with the invitation.
  const night=document.querySelector('body.game-station .night-controls');
  if(barHost&&night&&night.parentElement!==barHost)barHost.append(night);
  if(existing&&barHost){const destination=document.querySelector('dialog[open] .overlay-tools')||barHost;if(existing.parentElement!==destination)destination.append(existing);return;}
  const anchor=document.querySelector('#main > .back-link,#main > .picture-return > .back-link,.playroom-return');
  if(!anchor||anchor.closest('.game-invite-bar'))return;
  const bar=document.createElement('div');bar.className='game-invite-bar';anchor.before(bar);bar.append(anchor);
  const area=document.createElement('div');area.className='game-invite-area';
  const button=document.createElement('button');button.type='button';button.className='game-invite-button';
  button.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 16V3m-4 4 4-4 4 4M6 11H4v10h16V11h-2"/></svg><span>Share this game</span>';
  const status=document.createElement('span');status.className='game-invite-status';status.setAttribute('role','status');
  const fallback=document.createElement('input');fallback.type='text';fallback.readOnly=true;fallback.hidden=true;fallback.setAttribute('aria-label','Game link to copy');
  area.append(button,status,fallback);bar.append(area);
  if(night)bar.append(night);
  button.onclick=async()=>{
   const active=window.PocketRecent.currentGame()||game,url=new URL('index.html'+active.route,base).href;
   status.textContent='';fallback.hidden=true;
   if(navigator.share)try{await navigator.share({title:active.name,text:'Come play '+active.name+' on Pocket Playroom.',url});status.textContent='Shared.';return;}catch(e){if(e.name==='AbortError')return;}
   try{await navigator.clipboard.writeText(url);status.textContent='Game link copied.';}catch{fallback.value=url;fallback.hidden=false;fallback.focus();fallback.select();status.textContent='Select and copy the game link.';}
  };
 }
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',install,{once:true});else install();
 new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});
})();
