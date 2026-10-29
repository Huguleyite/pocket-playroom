/* Finale reward: completion gate and listened-through coverage, not a seek-to-end flag. */
(function(root){
class ListeningCoverage{
 constructor(){this.ranges=[];this.previous=null}
 sample(position,clock,audible){const prior=this.previous;this.previous={position,clock,audible};if(!prior||!audible||!prior.audible)return;const delta=position-prior.position,elapsed=clock-prior.clock;if(delta<=0||elapsed<0||delta>elapsed*1.2+.25)return;this.ranges.push([prior.position,position]);this.ranges.sort((a,b)=>a[0]-b[0]);const merged=[];for(const range of this.ranges){const last=merged[merged.length-1];if(last&&range[0]<=last[1]+.1)last[1]=Math.max(last[1],range[1]);else merged.push([...range])}this.ranges=merged}
 complete(duration){return Number.isFinite(duration)&&duration>0&&this.ranges.length===1&&this.ranges[0][0]<.5&&this.ranges[0][1]>=duration-.5}
}
root.ListeningCoverage=ListeningCoverage;if(typeof module!=='undefined')module.exports=ListeningCoverage;
if(typeof document==='undefined')return;
const dialog=document.createElement('dialog');dialog.id='finale-reward';dialog.innerHTML='<h2>The city is listening.</h2><p>You made the final delivery. Thank you for playing Blackout.</p><p>Enjoy Upbeat in full. Listen all the way through to unlock your free copy.</p><audio controls preload="metadata" src="assets/music/upbeat-full-reward.mp3"></audio><p id="reward-status" role="status">Your thank-you gift unlocks after the full song.</p><a id="reward-download" href="assets/music/upbeat-full-reward.mp3" download="Upbeat.mp3" hidden>Download Upbeat — with our thanks</a><button id="reward-close">Back to the city</button>';document.body.append(dialog);
const audio=dialog.querySelector('audio'),status=dialog.querySelector('#reward-status'),download=dialog.querySelector('#reward-download'),coverage=new ListeningCoverage();let shown=false;
function refresh(){download.hidden=!FinaleReward.heard;if(FinaleReward.heard)status.textContent='Thanks for listening. Your free download is ready.'}
function sample(){coverage.sample(audio.currentTime,performance.now()/1000,!audio.paused&&!audio.muted&&audio.volume>0&&!audio.seeking);if(!FinaleReward.heard&&coverage.complete(audio.duration)){FinaleReward.heard=true;window.Progress?.save();refresh()}}
for(const event of ['timeupdate','play','pause','seeking','seeked','volumechange','ended'])audio.addEventListener(event,sample);
audio.addEventListener('ended',()=>{sample();if(!FinaleReward.heard)status.textContent='Some of the song was skipped or muted. Listen to the missed section to unlock your copy.'});
function close(){audio.pause();if(window.Soundtrack)Soundtrack.rewardActive=false}dialog.querySelector('#reward-close').onclick=()=>dialog.close();dialog.addEventListener('close',close);
root.FinaleReward={heard:false,
 // Add every authored level and boss here as the journey grows.
 eligible(){return !!window.Campaign?.isComplete()&&grid.generators.every(g=>g.on)&&grid.doors.every(d=>d.open)},
 open(){if(!this.eligible())return false;shown=true;dialog.querySelector('p').textContent=Campaign.level.ending+' Thank you for playing Blackout.';Soundtrack.stop();Soundtrack.rewardActive=true;refresh();dialog.showModal();audio.play().catch(()=>{status.textContent='Press play to hear Upbeat in full and unlock your free copy.'});return true},
 tick(){if(!this.eligible()){shown=false;return}if(!shown)this.open()},
 reset(){shown=false;audio.pause();audio.currentTime=0;coverage.ranges=[];coverage.previous=null;if(dialog.open)dialog.close();if(window.Soundtrack)Soundtrack.rewardActive=false}
};
try{const saved=JSON.parse(localStorage.getItem('blackout.progress.v1')||'null');FinaleReward.heard=saved?.rewardHeard===true}catch{}
const reopen=document.createElement('button');reopen.textContent='Finale song & gift';reopen.hidden=true;reopen.onclick=()=>FinaleReward.open();document.querySelector('#start').parentElement.append(reopen);const tick=()=>{FinaleReward.tick();reopen.hidden=!FinaleReward.eligible();requestAnimationFrame(tick)};requestAnimationFrame(tick);
})(typeof window!=='undefined'?window:globalThis);
