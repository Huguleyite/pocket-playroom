(()=>{
 document.body.classList.add('room-embedded');
 const main=document.querySelector('main'),layout=document.querySelector('.layout'),coach=document.getElementById('coach'),meter=document.getElementById('collection-meter');
 let queued=false,last=0,completed=false;
 function fit(){
  queued=false;
  const frame=window.frameElement,hostHeight=parent.visualViewport?.height||parent.innerHeight;
  const frameTop=frame.getBoundingClientRect().top;
  const top=frameTop+parent.scrollY;
  const anchor=parent.document.getElementById('mobile-ad-anchor');
  const reserve=anchor&&!anchor.hidden?anchor.getBoundingClientRect().height:0;
  const available=Math.max(260,hostHeight-top-reserve-16);
  document.body.classList.toggle('coach-beside',innerWidth>=940&&!coach.hidden);
  const before=layout.getBoundingClientRect().top+scrollY;
  const budget=available-before-8;
  const width=document.getElementById('table').parentElement.clientWidth;
  const handWidth=document.getElementById('hand-zone').clientWidth;
  const adaptive=innerWidth>=580&&budget>=280;
  document.body.classList.toggle('viewport-fit',adaptive);
  document.body.classList.toggle('fit-tight',adaptive&&budget<430);
  if(adaptive){
   const cardHeight=Math.max(58,Math.min(220,Math.floor((budget-196)/2),Math.floor(((width-60)/3)*1.45),Math.floor(((handWidth-52)/3)*1.5)));
   main.style.setProperty('--draw-card-height',cardHeight+'px');
  }
  const visibleTop=Math.max(0,-frameTop),visibleBottom=Math.min(innerHeight,hostHeight-frameTop);
  document.documentElement.style.setProperty('--draw-dialog-top',visibleTop+12+'px');
  document.documentElement.style.setProperty('--draw-dialog-height',Math.max(80,visibleBottom-visibleTop-24)+'px');
  const height=Math.ceil(main.getBoundingClientRect().bottom+scrollY+8);
  if(height!==last){last=height;parent.postMessage({type:'room:height',height},location.origin)}
 }
 function queue(){if(!queued){queued=true;requestAnimationFrame(fit)}}
 new ResizeObserver(queue).observe(main);new ResizeObserver(queue).observe(coach);
 new MutationObserver(queue).observe(coach,{attributes:true,attributeFilter:['hidden']});
 addEventListener('resize',queue);parent.addEventListener('resize',queue);parent.addEventListener('scroll',queue,{passive:true});parent.visualViewport?.addEventListener('resize',queue);
 addEventListener('load',queue);document.fonts?.ready.then(queue);
 addEventListener('message',event=>{if(event.source===parent&&event.origin===location.origin&&event.data?.type==='room:night')document.documentElement.classList.toggle('collection-night',event.data.enabled===true)});
 new MutationObserver(()=>{const n=Number(meter.dataset.collected);if(n<5)completed=false;if(n===5&&!completed){completed=true;const d=new Date(),date=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(!window.PocketChallenge.incoming)parent.postMessage({type:'room:completed',id:'draw',date},location.origin)}}).observe(meter,{attributes:true,attributeFilter:['data-collected']});queue();
})();


