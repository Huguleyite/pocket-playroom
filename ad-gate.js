// Local ad-block detection only. No advertising or tracking requests are made.
(() => {
 'use strict';
 const base=new URL('.',document.currentScript.src);
 let pending;
 async function check(){
  if(pending)return pending;
  pending=(async()=>{
   const bait=document.createElement('div');
   bait.className='adsbox ad-banner adsbygoogle';bait.setAttribute('aria-hidden','true');
   bait.style.cssText='position:absolute;left:-10000px;top:-10000px;width:10px;height:10px;pointer-events:none;';
   document.body.append(bait);
   try{
    await new Promise(resolve=>setTimeout(resolve,120));
    const style=getComputedStyle(bait);
    if(bait.offsetHeight===0||bait.offsetWidth===0||style.display==='none'||style.visibility==='hidden')return 'blocked';
   }finally{bait.remove();}
   // A known healthy local control distinguishes blocking from an offline site.
   try{
    const control=await fetch(new URL('ad-check.json',base),{cache:'no-store',signal:AbortSignal.timeout(2500)});
    if(!control.ok||(await control.json()).adCheck!==1)return 'unknown';
   }catch{return 'unknown';}
   const probe=new URL('ads/advertisement.js',base);
   const script=document.createElement('script');script.src=probe.href;script.async=true;
   const loaded=await new Promise(resolve=>{const timer=setTimeout(()=>resolve(null),2500);script.onload=()=>{clearTimeout(timer);resolve(true);};script.onerror=()=>{clearTimeout(timer);resolve(false);};document.head.append(script);});
   script.remove();
   if(loaded===true)return 'allowed';
   if(loaded===null)return 'unknown';
   // HTTP failures (including a missing deployment file) are not ad blocking.
   try{const response=await fetch(probe,{cache:'no-store',signal:AbortSignal.timeout(2500)});return response.ok?'blocked':'unknown';}
   catch(error){return error.name==='AbortError'||error.name==='TimeoutError'?'unknown':'blocked';}
  })();
  try{return await pending;}finally{pending=null;}
 }
 window.roomAdAccess={check};
})();
