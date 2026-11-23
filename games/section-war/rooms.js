/* Room transport and UI; solo and pass-and-play retain their existing rules. */
(() => {
  let session=null, snapshot=null, busy=false, timer, lastRevision=-1, choosing=false;
  const panel=document.createElement('dialog');
  panel.id='room-dialog';
  panel.innerHTML='<h2>Room Code · Two Devices</h2><p>Host a room, then share its four-character code.</p><button id="room-create">Host Room</button><form id="room-join-form"><label for="room-code">Room code</label><input id="room-code" maxlength="4" pattern="[A-Za-z2-9]{4}" autocomplete="off" autocapitalize="characters" required><button>Join Room</button></form><p id="room-message" role="status" aria-live="polite"></p><details><summary>Android Wi-Fi help: allow nearby devices</summary><p>On your phone, open Settings → Apps → your browser → Permissions → Nearby devices → Allow. The name may be Nearby connections or Local network access. Allow any local-network prompt for this site, then reload and rejoin on the joining phone. Each browser has separate permissions. Keep both devices on the main Wi-Fi.</p></details><button id="room-close">Close</button>';
  document.body.append(panel);
  const style=document.createElement('style');
  style.textContent='#room-dialog{max-width:440px;width:calc(100% - 40px);background:#09272b;color:#ffe1a2;border:2px solid #c9a85e;border-radius:16px;padding:24px}#room-dialog button,#room-dialog input{font:inherit;padding:12px;margin:6px 0;max-width:100%}#room-dialog label{display:block}#room-code{text-transform:uppercase;width:100%;box-sizing:border-box}#room-bar{position:relative;z-index:10;padding:10px;background:#09272b;color:#ffe1a2;text-align:center}#room-bar button{margin-left:12px}#room-dialog{max-height:85dvh;overflow:auto;box-sizing:border-box}';
  document.head.append(style);
  const button=el('mode-room');
  const bar=document.createElement('div');bar.id='room-bar';bar.hidden=true;
  const status=document.createElement('span');status.setAttribute('role','status');
  const leave=document.createElement('button');leave.textContent='Leave Room';const reconnect=document.createElement('button');reconnect.textContent='Reconnect';reconnect.onclick=()=>SectionWarRooms.reconnect().catch(e=>status.textContent=e.message);const copy=document.createElement('button');copy.textContent='Copy Code';copy.onclick=()=>navigator.clipboard.writeText(session.code).catch(()=>status.textContent='Room code: '+session.code);bar.append(status,copy,reconnect,leave);document.body.prepend(bar);
  const message=text=>el('room-message').textContent=text;
  async function request(endpoint,extra={}) {
    return SectionWarRooms.request(endpoint,extra);
  }
  function save(){try{sessionStorage.setItem('section-war.room',JSON.stringify(session));}catch{}}
  function reset(){SectionWarRooms.leave();clearTimeout(timer);session=null;snapshot=null;choosing=false;lastRevision=-1;bar.hidden=true;try{sessionStorage.removeItem('section-war.room');}catch{} }
  function show(data) {
    snapshot=data;bar.hidden=false;
    status.textContent='Room '+data.code+' · Player '+data.seat+' · '+(!data.joined?'Waiting for a friend':!data.connected[2-data.seat]?'Opponent disconnected · waiting to reconnect':data.phase==='lobby'?'Choose your lineup':data.activeSeat===data.seat?'Your turn':'Opponent’s turn');
    reconnect.hidden=data.connected.every(Boolean);
    if(data.phase==='battle')el('end').disabled=busy||!data.connected.every(Boolean)||(!data.state.outcome&&data.activeSeat!==data.seat)||!!data.state.outcome&&data.seat!==1;
    if(data.revision===lastRevision)return;
    lastRevision=data.revision;
    mode='local';
    if(data.phase==='lobby') {
      el('battle-screen').hidden=true;el('handoff-screen').hidden=true;el('opening-screen').hidden=true;el('mode-screen').hidden=true;
      if(!data.ready[data.seat-1]&&!choosing){choosing=true;openSetup();el('setup-seat').textContent='Player '+data.seat;}
      if(data.ready[data.seat-1]){choosing=false;el('setup-screen').hidden=true;status.textContent+=' · Lineup ready';}
      return;
    }
    el('opening-screen').hidden=true;el('mode-screen').hidden=true;el('handoff-screen').hidden=true;
    choosing=false;lineup=data.lineup;
    const announced=state?.outcome===data.state.outcome&&state?.announced;
    state={...data.state,announced};
    setBattleLineup();render();setMusicPhase(state.outcome?'silent':'battle');
    el('end').disabled=busy||!data.connected.every(Boolean)||(!state.outcome&&data.activeSeat!==data.seat)||!!state.outcome&&data.seat!==1;
    if(state.outcome)el('end').firstElementChild.textContent=data.seat===1?'Rematch · Choose Lineups':'Waiting for Host Rematch';
    el('restart').hidden=true;
  }
  async function poll(){
    if(!session)return;
    try{show(await request('state'));}catch(e){status.textContent='Room '+session.code+' · '+e.message+' Reconnecting…';}
    if(session)timer=setTimeout(poll,1000);
  }
  async function connect(endpoint){
    if(busy)return;busy=true;message('Connecting…');
    try{const data=await request(endpoint,{code:el('room-code').value.trim().toUpperCase()});session={code:data.code,token:data.token};save();panel.close();show(data);clearTimeout(timer);timer=setTimeout(poll,1000);}
    catch(e){message(e.message);}finally{busy=false;}
  }
  button.onclick=()=>{message('');panel.showModal();};
  el('room-close').onclick=()=>panel.close();el('room-create').onclick=()=>connect('create');
  el('room-join-form').onsubmit=e=>{e.preventDefault();connect('join');};
  leave.onclick=()=>{if(!confirm('Leave this room and clear this tab’s saved room session?'))return;reset();el('battle-screen').hidden=true;el('setup-screen').hidden=true;el('handoff-screen').hidden=true;el('mode-screen').hidden=false;};
  const oldRender=render;
  render=function(){oldRender();if(session){el('battle-mode-label').textContent='Band Room Battles · Room Code';if(!state.outcome)el('turn').textContent='Turn '+state.turn+' · '+(snapshot?.activeSeat===sessionSeat()?'Your Turn':'Opponent’s Turn');}};
  const oldRenderSetup=renderSetup;
  renderSetup=function(){oldRenderSetup();if(session){el('setup-seat').textContent='Player '+sessionSeat();if(setupStep===1)el('setup-next').textContent='Ready · Join Battle';el('second-wind-option').hidden=true;}};
  function sessionSeat(){return snapshot?.seat||1;}
  el('setup-next').addEventListener('click',async e=>{
    if(!session||setupStep!==1)return;e.stopImmediatePropagation();
    if(busy||!draftLineup[0].section)return;busy=true;el('setup-next').disabled=true;
    try{show(await request('ready',{pick:draftLineup[0]}));}catch(error){status.textContent=error.message;el('setup-next').disabled=false;}finally{busy=false;}
  },true);
  el('setup-back').addEventListener('click',e=>{if(session&&setupStep===0){e.stopImmediatePropagation();leave.click();}},true);
  const oldPlay=play;
  play=function(index){if(!session){oldPlay(index);return;}sendAction('play',index);};
  async function sendAction(action,index){
    if(busy||!snapshot||!snapshot.connected.every(Boolean)||snapshot.activeSeat!==sessionSeat()||state.outcome)return;
    busy=true;
    try{show(await request('action',{action,index,revision:snapshot.revision}));}
    catch(error){status.textContent=error.message;lastRevision=-1;}
    finally{busy=false;if(session&&snapshot)el('end').disabled=!snapshot.connected.every(Boolean)||(!state.outcome&&snapshot.activeSeat!==sessionSeat())||(!!state.outcome&&sessionSeat()!==1);}
  }
  el('end').addEventListener('click',async e=>{
    if(!session)return;e.stopImmediatePropagation();
    if(state.outcome){if(sessionSeat()!==1||busy)return;busy=true;try{show(await request('rematch'));}catch(error){status.textContent=error.message;}finally{busy=false;}}
    else sendAction('end');
  },true);
  for(const id of ['restart','change-mode'])el(id).addEventListener('click',e=>{if(session){e.stopImmediatePropagation();el('battle-tools').close();leave.click();}},true);
  const restored=SectionWarRooms.restore();if(restored){session={code:restored.code,token:restored.token};save();poll();}
})();
