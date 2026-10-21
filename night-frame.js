(() => {
 const game=document.currentScript.dataset.game;
 const accents={weave:['#cba1fa','#332442'],tide:['#73d4bc','#566178'],shift:['#93d6a5','#34354c'],lock:['#f1cd7c','#332d20'],deli:['#ffac80','#3b2922'],futoshiki:['#a6b9ff','#292e48'],binario:['#00f3ff','#142438']};
 const [accent,tile]=accents[game];document.documentElement.style.setProperty('--night-accent',accent);document.documentElement.style.setProperty('--night-tile',tile);
 let prefs={};try{prefs=JSON.parse(localStorage.getItem('room-for-play:night'))||{};}catch{}
 let on=typeof prefs.overrides?.[game]==='boolean'?prefs.overrides[game]:prefs.global===true;
 if(game==='binario'&&prefs.global===undefined&&prefs.overrides?.binario===undefined){try{on=JSON.parse(localStorage.getItem('room-for-play:neon:mode'))===true;}catch{}}
 document.documentElement.classList.toggle('night-play',on);
 window.roomNightColor=(day,night)=>document.documentElement.classList.contains('night-play')?night:day;
 addEventListener('message',event=>{if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='room:night')return;document.documentElement.classList.toggle('night-play',event.data.enabled===true);dispatchEvent(new CustomEvent('room:night',{detail:event.data.enabled===true}));dispatchEvent(new Event('resize'));});
})();
