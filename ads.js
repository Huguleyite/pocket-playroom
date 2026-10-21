// Provider-neutral refresh hooks; never requests or sends an advertisement.
(() => {
 'use strict';
 const mobile=(window.top===window?window:window.top).matchMedia('(max-width: 767px)'),states=new Map();
 const eligible=s=>s.visible&&!document.hidden&&mobile.matches&&s.slot.isConnected;
 function stop(s){clearTimeout(s.timer);s.timer=null;}
 function start(s){stop(s);if(!eligible(s))return;s.timer=setTimeout(()=>{
   s.timer=null;if(!eligible(s))return;
   s.slot.dispatchEvent(new CustomEvent('ad:refresh',{bubbles:true,detail:{slotId:s.slot.id,visibleMilliseconds:30000}}));
   start(s);
 },30000);}
 const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){const s=states.get(entry.target);const visible=entry.isIntersecting&&entry.intersectionRatio>=0.5;if(visible!==s.visible){s.visible=visible;visible?start(s):stop(s);}}
 },{threshold:[0,0.5,1]});
 document.querySelectorAll('[data-ad-slot]').forEach(slot=>{states.set(slot,{slot,visible:false,timer:null});observer.observe(slot);});
 // Re-observing forces a fresh geometry measurement on resume, never crediting hidden time.
 function reset(){for(const s of states.values()){stop(s);s.visible=false;observer.unobserve(s.slot);observer.observe(s.slot);}}
 document.addEventListener('visibilitychange',reset);mobile.addEventListener('change',reset);
 window.addEventListener('pagehide',()=>{for(const s of states.values())stop(s);});window.addEventListener('pageshow',reset);
})();
