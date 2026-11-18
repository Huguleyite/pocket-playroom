/* Dawn Exchange's restoration film plays before entering Meridian. */
(()=>{
 const dialog=document.createElement('dialog');
 dialog.id='restoration-film';
 dialog.setAttribute('aria-label','Dawn Exchange restored');
 dialog.style.cssText='position:fixed;inset:0;width:100vw;max-width:none;height:100dvh;max-height:none;margin:0;padding:0;border:0;background:#080f18;color:white';
 dialog.innerHTML='<video controls playsinline preload="none" style="width:100%;height:calc(100% - 64px);object-fit:contain" aria-label="The courier restores power to Mercy Hospital and the city"><source src="assets/video/dawn-exchange-restored.mp4" type="video/mp4"></video><div style="height:64px;display:flex;align-items:center;justify-content:center;gap:16px"><span role="status"></span><button type="button">Skip · Continue to Station Square →</button></div>';
 document.body.append(dialog);
 const video=dialog.querySelector('video'),status=dialog.querySelector('[role=status]');
 const advance=Campaign.advance.bind(Campaign);
 let pending=false;
 function finish(){
  if(!pending)return;
  pending=false;
  video.pause();
  dialog.close();
  window.Soundtrack.rewardActive=false;
  advance();
 }
 dialog.querySelector('button').onclick=finish;
 video.addEventListener('ended',finish);
 video.addEventListener('error',()=>{status.textContent='Video unavailable. Continue to Station Square.'});
 dialog.addEventListener('cancel',event=>{event.preventDefault();finish()});
 Campaign.advance=()=>{
  if(!won||Campaign.index!==7)return advance();
  if(pending)return true;
  pending=true;
  keys.clear();pressed.clear();
  window.Soundtrack.stop();
  window.Soundtrack.rewardActive=true;
  video.currentTime=0;
  video.muted=!BlackoutAudio.enabled;
  video.volume=BlackoutAudio.volume;
  status.textContent='';
  dialog.showModal();
  video.play().catch(()=>{status.textContent='Press Play to watch the restoration.'});
  return true;
 };
})();
