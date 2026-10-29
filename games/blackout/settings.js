const settingsDialog=document.querySelector('#settings-dialog');let settingsWasPaused=true;
function storeSettings(){try{localStorage.setItem('blackout.settings.v1',JSON.stringify({master:BlackoutAudio.volume,music:BlackoutAudio.musicVolume,ambience:BlackoutAudio.ambienceVolume,effects:BlackoutAudio.effectsVolume,enabled:BlackoutAudio.enabled,motion:document.querySelector('#reduced-motion').checked}))}catch{}}
window.saveSettings=storeSettings;
try{const saved=JSON.parse(localStorage.getItem('blackout.settings.v1')||'null');if(saved){for(const [key,value]of [['volume',saved.master],['musicVolume',saved.music],['effectsVolume',saved.effects],['ambienceVolume',saved.ambience]])if(Number.isFinite(value))BlackoutAudio[key]=Math.max(0,Math.min(1,value));if(typeof saved.enabled==='boolean')BlackoutAudio.enabled=saved.enabled;document.querySelector('#reduced-motion').checked=!!saved.motion}}catch{}
for(const [id,key]of [['volume','volume'],['music-volume','musicVolume'],['effects-volume','effectsVolume'],['ambience-volume','ambienceVolume']]){const slider=document.querySelector('#'+id);slider.value=BlackoutAudio[key]*100;slider.oninput=()=>{BlackoutAudio[key]=Number(slider.value)/100;storeSettings()}}
document.querySelector('#reduced-motion').onchange=()=>{CityScene.setReducedMotion(document.querySelector('#reduced-motion').checked);storeSettings()};CityScene.setReducedMotion(document.querySelector('#reduced-motion').checked);
function refreshSoundButton(){const b=document.querySelector('#sound');b.textContent=BlackoutAudio.enabled?'Sound on':'Sound off';b.setAttribute('aria-pressed',String(BlackoutAudio.enabled))}refreshSoundButton();
document.querySelector('#sound').onclick=()=>{BlackoutAudio.enabled=!BlackoutAudio.enabled;BlackoutAudio.start().catch(console.warn);refreshSoundButton();storeSettings()};
document.querySelector('#settings').onclick=()=>{settingsWasPaused=paused;if(active&&!paused&&!won)togglePause();keys.clear();pressed.clear();settingsDialog.showModal()};
document.querySelector('#close-settings').onclick=()=>settingsDialog.close();settingsDialog.addEventListener('close',()=>{BlackoutAudio.preview=false;document.querySelector('#preview-score').textContent='Listen to soundtrack';if(active&&!won&&!settingsWasPaused){paused=false;showPause();canvas.focus()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){Progress.save();keys.clear();pressed.clear();if(active&&!paused&&!won){paused=true;showPause()}}});

document.querySelectorAll('[data-bind]').forEach(button=>button.onclick=()=>Controller.bind(button.dataset.bind));document.querySelector('#reset-bindings').onclick=()=>Controller.resetBindings();

document.querySelector('#preview-score').onclick=async function(){await BlackoutAudio.start();BlackoutAudio.preview=!BlackoutAudio.preview;this.textContent=BlackoutAudio.preview?'Stop soundtrack preview':'Listen to soundtrack'};
document.querySelector('#score-intensity').onchange=function(){Soundtrack.previewScene=this.value};
document.querySelectorAll('[data-sound]').forEach(button=>button.onclick=async()=>{await BlackoutAudio.start();BlackoutAudio.effect(button.dataset.sound)});
