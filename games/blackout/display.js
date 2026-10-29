const fullscreenButton=document.querySelector('#fullscreen');
fullscreenButton.onclick=async()=>{
 try{
  if(document.fullscreenElement)await document.exitFullscreen();
  else if(document.documentElement.requestFullscreen&&document.fullscreenEnabled)await document.documentElement.requestFullscreen();
  else grid.say('This browser limits fullscreen. The game already fills this tab; open it in your main browser for system fullscreen.');
 }catch(error){grid.say('Fullscreen was blocked by the browser. The game still fills this tab.');console.info('Fullscreen unavailable:',error.message)}
 canvas.focus();
};
document.addEventListener('fullscreenchange',()=>{const full=!!document.fullscreenElement;fullscreenButton.textContent=full?'Exit fullscreen ⛶':'Fullscreen ⛶';fullscreenButton.setAttribute('aria-label',full?'Exit fullscreen':'Enter fullscreen')});
