/* Action effects and city ambience. Recorded SiriusStyle music uses Soundtrack. */
window.BlackoutAudio={context:null,enabled:true,volume:1,musicVolume:.7,effectsVolume:1,ambienceVolume:.65,stepIndex:0,nextNote:0,playing:false,powerLevel:0,preview:false,previewPower:0,lastFootstep:-1,
 async start(){if(!this.context){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;const c=this.context=new Audio();this.master=c.createGain();this.master.gain.value=0;const limiter=c.createDynamicsCompressor();limiter.threshold.value=-16;limiter.knee.value=12;limiter.ratio.value=4;limiter.attack.value=.005;limiter.release.value=.18;this.master.connect(limiter);limiter.connect(c.destination);
  this.musicBus=c.createGain();this.effectsBus=c.createGain();this.ambienceBus=c.createGain();for(const bus of [this.musicBus,this.effectsBus,this.ambienceBus])bus.connect(this.master);
  this.musicInput=c.createGain();this.musicInput.connect(this.musicBus);const delay=c.createDelay(1),feedback=c.createGain(),low=c.createBiquadFilter(),wet=c.createGain();delay.delayTime.value=60/88*.75;feedback.gain.value=.22;low.type='lowpass';low.frequency.value=1900;wet.gain.value=.15;this.musicInput.connect(delay);delay.connect(low);low.connect(feedback);feedback.connect(delay);low.connect(wet);wet.connect(this.musicBus);
  this.noise=c.createBuffer(1,c.sampleRate*3,c.sampleRate);const data=this.noise.getChannelData(0);let seed=23;for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/2147483647*2-1)}
  const rain=c.createBufferSource(),hp=c.createBiquadFilter(),lp=c.createBiquadFilter(),rainGain=c.createGain();rain.buffer=this.noise;rain.loop=true;hp.type='highpass';hp.frequency.value=500;lp.type='lowpass';lp.frequency.value=4200;rainGain.gain.value=.04;rain.connect(hp);hp.connect(lp);lp.connect(rainGain);rainGain.connect(this.ambienceBus);rain.start();
  for(const hz of [50,100]){const o=c.createOscillator(),g=c.createGain();o.frequency.value=hz;g.gain.value=.003;o.connect(g);g.connect(this.ambienceBus);o.start()}
 }window.Soundtrack?.init(this.context,this.musicBus);await this.context.resume();},
 voice(hz,at,length,shape,level,bus='music',end=hz,attack=.012,pan=0){if(!this.context)return;const c=this.context,o=c.createOscillator(),g=c.createGain(),filter=c.createBiquadFilter(),panner=c.createStereoPanner();o.type=shape;o.frequency.setValueAtTime(Math.max(20,hz),at);if(end!==hz)o.frequency.exponentialRampToValueAtTime(Math.max(20,end),at+length);filter.type='lowpass';filter.frequency.value=bus==='music'?1900:6000;panner.pan.value=pan;g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(level,at+Math.min(attack,length*.4));g.gain.exponentialRampToValueAtTime(.0001,at+length);o.connect(filter);filter.connect(g);g.connect(panner);panner.connect(bus==='music'?this.musicInput:this.effectsBus);o.start(at);o.stop(at+length+.03)},
 noiseHit(at,length,level,hz=1800,bus='effects'){if(!this.context)return;const c=this.context,n=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();n.buffer=this.noise;f.type='bandpass';f.frequency.value=hz;f.Q.value=.6;g.gain.setValueAtTime(level,at);g.gain.exponentialRampToValueAtTime(.0001,at+length);n.connect(f);f.connect(g);g.connect(bus==='music'?this.musicInput:this.effectsBus);n.start(at);n.stop(at+length)},
 effect(kind){if(!this.context||!this.enabled)return;const t=this.context.currentTime+.004;
  if(kind==='bossLock'){this.voice(430,t,.12,'triangle',.065,'effects',620);this.voice(620,t+.12,.14,'sine',.07,'effects',850)}
  if(kind==='bossStrike'){this.noiseHit(t,.2,.12,900);this.voice(90,t,.2,'triangle',.09,'effects',35)}
  if(kind==='coreOpen'){this.voice(660,t,.3,'sine',.075,'effects',880);this.voice(990,t+.09,.35,'sine',.065,'effects',1320)}
  if(kind==='jump'){this.voice(180,t,.12,'sine',.09,'effects',330);this.noiseHit(t,.045,.025,1400)}
  if(kind==='land'){this.voice(78,t,.10,'sine',.12,'effects',32);this.noiseHit(t,.065,.045,700)}
  if(kind==='step')this.noiseHit(t,.04,.035,950);
  if(kind==='dash'){this.noiseHit(t,.18,.19,2500);this.voice(700,t,.16,'triangle',.085,'effects',90);this.voice(1050,t,.11,'sine',.04,'effects',260)}
  if(kind==='teleport'){this.noiseHit(t,.22,.13,3800);this.voice(880,t,.22,'sine',.1,'effects',70);this.voice(110,t+.28,.26,'triangle',.1,'effects',880);this.voice(1320,t+.33,.35,'sine',.07,'effects',660)}
  if(kind==='foresight'){for(const [i,hz]of [784,1174.66,1568].entries())this.voice(hz,t+i*.095,.55,'sine',.065,'effects',hz*1.012,.025,i%2?.35:-.35)}
  if(kind==='slide'){this.noiseHit(t,.15,.035,1700);this.voice(90,t,.1,'triangle',.018,'effects',65)}
  if(kind==='power'){for(const [i,m]of [74,77,81].entries())this.voice(440*2**((m-69)/12),t+i*.045,.32,'sine',.12);this.noiseHit(t,.08,.045,5000)}
  if(kind==='generator'){this.voice(42,t,1.1,'triangle',.11,'effects',84,.2);for(const [i,m]of [62,65,69,74].entries())this.voice(440*2**((m-69)/12),t+i*.09,.8,'sine',.12)}
  if(kind==='door'){this.noiseHit(t,.35,.13,450);this.voice(85,t,.35,'triangle',.1,'effects',55)}
  if(kind==='retry'){this.voice(220,t,.3,'sine',.065,'effects',110);this.noiseHit(t,.12,.03,800)}
  if(kind==='complete'){for(const [i,m]of [62,65,69,74,76,81].entries())this.voice(440*2**((m-69)/12),t+i*.15,1.8,'sine',.09)}
 },
 tick(time,running,restored=0,walking=false,x=0,finished=false){if(!this.context)return;const c=this.context,t=c.currentTime,live=running||this.preview;this.master.gain.setTargetAtTime(this.enabled?this.volume*.65:0,t,.06);this.musicBus.gain.setTargetAtTime(this.musicVolume*(live?1:finished?.65:.18),t,.15);this.effectsBus.gain.setTargetAtTime(this.effectsVolume,t,.06);this.ambienceBus.gain.setTargetAtTime(this.ambienceVolume*(live?1:.35),t,.15);
  window.Soundtrack?.update({running:live,enabled:this.enabled,preview:this.preview,x,finished});const status=document.querySelector('#music-status');if(status&&window.Soundtrack)status.textContent=Soundtrack.status;
  if(live&&this.enabled&&walking){const foot=Math.floor(time/.24);if(foot!==this.lastFootstep){this.lastFootstep=foot;this.effect('step')}}
 }
};
