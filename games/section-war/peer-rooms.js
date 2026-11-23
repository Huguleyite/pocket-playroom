/* GRIDSHIFT-style PeerJS rooms: static hosting, four-character codes, tab recovery. */
(() => {
  const KEY='section-war.peer-room.v1',PREFIX='section-war-sw-',PROTOCOL=1;
  const OPTIONS={config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]}};
  let peer,conn,local=null,room=null,battle=null,current=null,generation=0,retryTimer,attempts=0;
  const pending=new Map();
  const clone=x=>JSON.parse(JSON.stringify(x));
  function save(){if(!local)return;try{sessionStorage.setItem(KEY,JSON.stringify({local,room:local.seat===1?room:null,checkpoint:local.seat===1?battle?.checkpoint():null,current}));}catch{}}
  function view(seat){return {code:local.code,seat,revision:room.revision,phase:battle?'battle':'lobby',joined:!!room.guestToken,ready:room.picks.map(Boolean),connected:[true,!!conn?.open],...(battle?battle.view(seat):{})};}
  function publish(){save();current=view(1);if(conn?.open)conn.send({type:'snapshot',protocol:PROTOCOL,data:view(2)});return clone(current);}
  function command(seat,endpoint,body){
    if(endpoint==='ready'){
      if(battle)throw Error('Battle already started.');
      const pick=body.pick;
      if(!['Malik','Maya','Eli','Samira','Jae','Nia','Mateo'].includes(pick?.name)||!['Trombones','Trumpets','Tubas','Drumline'].includes(pick?.section))throw Error('Choose a character and section.');
      room.picks[seat-1]={name:pick.name,section:pick.section,secondWind:false};
      if(room.picks.every(Boolean))battle=new SectionWarBattle(clone(room.picks));
    }else if(endpoint==='action'){
      if(!conn?.open)throw Error('Connection interrupted. Reconnect to continue.');
      if(body.revision!==room.revision)throw Error('The battle changed. Try again.');
      if(!battle)throw Error('Waiting for both players.');
      battle.action(seat,body.action,body.index);
    }else if(endpoint==='rematch'){
      if(seat!==1||!battle?.checkpoint().state.outcome)throw Error('The host can start a rematch after this battle.');
      battle=null;room.picks=[null,null];
    }else throw Error('Unknown room action.');
    room.revision++;publish();return view(seat);
  }
  function retry(){if(!local||retryTimer||conn?.open||attempts>=12)return;retryTimer=setTimeout(()=>{retryTimer=null;attempts++;openPeer().catch(()=>retry());},1500);}
  function rejectPending(){for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('Connection interrupted. Reconnect to continue.'));}pending.clear();}
  function attach(connection,isHost,gen){
    conn=connection;
    const valid=()=>gen===generation&&conn===connection;
    connection.on('open',()=>{if(!valid())return;attempts=0;if(!isHost)connection.send({type:'hello',protocol:PROTOCOL,token:local.token});});
    connection.on('data',msg=>{
      if(!valid()||!msg||typeof msg!=='object')return;
      if(msg.protocol!==PROTOCOL){current={...current,error:'Online play was updated. Both players must reload Section War.'};connection.close();return;}
      if(isHost&&msg.type==='hello'){
        if(room.guestToken&&room.guestToken!==msg.token){connection.send({type:'rejected',protocol:PROTOCOL,error:'This room already has two players.'});setTimeout(()=>connection.close(),100);return;}
        room.guestToken=msg.token;room.revision++;publish();
      }else if(isHost&&msg.type==='request'){
        try{
          if(msg.token!==room.guestToken)throw Error('Invalid player session.');
          const data=command(2,msg.endpoint,msg.body||{});
          connection.send({type:'reply',protocol:PROTOCOL,id:msg.id,data});
        }catch(error){connection.send({type:'reply',protocol:PROTOCOL,id:msg.id,error:error.message});}
      }else if(!isHost&&msg.type==='snapshot'){
        current=msg.data;save();
      }else if(!isHost&&msg.type==='reply'){
        const p=pending.get(msg.id);if(!p)return;clearTimeout(p.timer);pending.delete(msg.id);
        if(msg.error)p.reject(Error(msg.error));else {current=msg.data;save();p.resolve(clone(current));}
      }else if(!isHost&&msg.type==='rejected'){
        current={...current,error:msg.error};
      }
    });
    const lost=()=>{if(!valid())return;rejectPending();if(current)current.connected=[false,false];save();retry();};
    connection.on('close',lost);connection.on('error',lost);
  }
  function openPeer(){
    if(typeof Peer==='undefined')return Promise.reject(Error('Online play could not load. Reload and try again.'));
    const gen=++generation;clearTimeout(retryTimer);retryTimer=null;
    if(current)current.connected=[false,false];
    try{conn?.close();peer?.destroy();}catch{}conn=null;
    return new Promise((resolve,reject)=>{
      const isHost=local.seat===1;
      peer=isHost?new Peer(PREFIX+local.code,OPTIONS):new Peer(OPTIONS);
      const timeout=setTimeout(()=>{reject(Error('Could not connect. Check your connection and nearby-device permission.'));retry();},15000);
      peer.on('open',()=>{
        if(gen!==generation)return;clearTimeout(timeout);
        if(isHost){current=view(1);save();resolve({...clone(current),token:local.token});}
        else{
          attach(peer.connect(PREFIX+local.code,{reliable:true}),false,gen);
          const start=Date.now();
          const wait=()=>{if(gen!==generation){reject(Error('Connection replaced.'));return;}if(current?.error){reject(Error(current.error));return;}if(conn?.open&&current?.connected?.every(Boolean)){resolve({...clone(current),token:local.token});return;}if(Date.now()-start>15000){reject(Error('Room unavailable. Check the code and nearby-device permission.'));retry();return;}setTimeout(wait,100);};wait();
        }
      });
      peer.on('connection',connection=>{if(gen!==generation||!isHost||conn?.open){connection.close();return;}attach(connection,true,gen);});
      peer.on('disconnected',()=>{if(gen!==generation)return;try{peer.reconnect();}catch{retry();}});
      peer.on('error',error=>{if(gen!==generation)return;clearTimeout(timeout);reject(Error(error.type==='unavailable-id'?'Room code is busy. Try hosting again.':'Room connection failed. Check the code and nearby-device permission.'));if(current)current.connected=[false,false];retry();});
    });
  }
  async function request(endpoint,body={}){
    if(endpoint==='create'||endpoint==='join'){
      leave();
      const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const code=endpoint==='create'?Array.from(crypto.getRandomValues(new Uint8Array(4)),n=>alphabet[n%32]).join(''):String(body.code||'').toUpperCase();
      if(!/^[A-Z2-9]{4}$/.test(code))throw Error('Enter a four-character room code.');
      local={code,seat:endpoint==='create'?1:2,token:crypto.randomUUID()};
      room=local.seat===1?{picks:[null,null],revision:0,guestToken:null}:null;
      save();return openPeer();
    }
    if(!local)throw Error('Host or join a room first.');
    if(endpoint==='state'){
      if(local.seat===1)current=view(1);
      if(current?.error)throw Error(current.error);
      if(!current)throw Error('Connecting to your room…');
      const result=clone(current);if(!conn?.open)result.connected=[local.seat===1,local.seat===2];return result;
    }
    if(local.seat===1)return command(1,endpoint,body);
    if(!conn?.open)throw Error('Connection interrupted. Reconnect to continue.');
    return new Promise((resolve,reject)=>{const id=crypto.randomUUID();const timer=setTimeout(()=>{pending.delete(id);reject(Error('Host did not respond. Reconnect to continue.'));},8000);pending.set(id,{resolve,reject,timer});conn.send({type:'request',protocol:PROTOCOL,id,token:local.token,endpoint,body});});
  }
  function leave(){generation++;clearTimeout(retryTimer);retryTimer=null;rejectPending();try{conn?.close();peer?.destroy();}catch{}peer=null;conn=null;local=null;room=null;battle=null;current=null;attempts=0;try{sessionStorage.removeItem(KEY);}catch{}}
  function restore(){try{const saved=JSON.parse(sessionStorage.getItem(KEY));if(!saved?.local||!/^[A-Z2-9]{4}$/.test(saved.local.code)||![1,2].includes(saved.local.seat))return null;local=saved.local;room=saved.room;current=saved.current;if(saved.checkpoint)battle=new SectionWarBattle(null,saved.checkpoint);openPeer().catch(()=>retry());return local;}catch{return null;}}
  window.SectionWarRooms={request,leave,restore,reconnect:()=>{attempts=0;return openPeer();}};
})();
