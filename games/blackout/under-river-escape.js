(() => {
  if(!window.location)return;
  const query=new URLSearchParams(location.search);
  if(query.get('level')!=='14'||query.get('escape')!=='1')return;

  const receiverX=2130;
  const exit=4420;
  const floodSpeed=168;
  let floodStart=0;

  function configure(level) {
    return {...level,
      subtitle:'Outrun the Flood',
      story:'Teleport across the broken track. Shield the flood receiver to open the far exit, then outrun the surge to the green door.',
      ending:'Under-River Line complete. The flood door shuts behind the courier.',
      generators:[],
      checkpoints:[{x:1380,y:340},{x:receiverX,y:340}],
      station:{...level.station,finish:'You outran the flood.',pads:[],gates:[],hint:'Teleport over the breach, then Shield at the flood receiver.'}
    };
  }

  function front() {
    return receiverX-260+(time-floodStart)*floodSpeed;
  }

  function respawn() {
    if(checkpoint===1){
      floodStart=time;
      Combat2D.shieldVerified=true;
    }
  }

  function placeSupplies() {
    grid.sources=grid.sources.filter(source=>source.x<=receiverX+30);
    grid.sources.push({x:2995,y:320,type:'node',drained:false});
  }

  function update() {
    if(checkpoint===0&&Combat2D.shieldVerified){
      checkpoint=1;
      floodStart=time;
      grid.say('FLOOD INCOMING · Run for the green exit!',{priority:3,duration:4});
      Progress.save();
    }
    if(checkpoint===1&&p.x+p.w<front()){
      deaths++;
      spawn();
      grid.say('FLOOD RETRY · Run from the receiver.',{priority:3,duration:3});
    }
  }

  function draw() {
    rect(exit-17,222,52,78,'#16323d');
    rect(exit-13,226,44,74,checkpoint===1?'#288977':'#4f5357');
    rect(exit-9,230,36,5,checkpoint===1?'#9df7cc':'#dca578');
    ctx.font='bold 12px monospace';
    ctx.fillStyle='#baffed';
    ctx.fillText('FLOOD EXIT',exit-27,214);
    if(checkpoint!==1||won)return;
    const edge=front();
    rect(0,282,edge,215,'#1b6974a8');
    for(let y=287;y<465;y+=16)rect(edge-55+Math.sin(time*11+y)*7,y,53,3,'#96d5d99e');
    rect(edge-4,282,4,215,'#a0eee1b5');
  }

  window.UnderRiverEscape={
    configure,respawn,placeSupplies,update,draw,complete:()=>checkpoint===1&&p.ground&&p.x>=exit-18,
    restoreFinish(){p.x=exit;p.y=266;},
    objective:()=>won?'Under-River Line complete':checkpoint===1?'Outrun the flood to the green exit':'Shield the flood receiver',
    status:()=>won?'FLOOD DOOR SEALED':checkpoint===1?'FLOOD SURGE · RUN TO THE EXIT':'BLOCK THE RECEIVER PULSE',
    hint:()=>checkpoint===1?'FLOOD SURGE · Keep moving toward the green exit.':'Teleport across the breach. Raise Shield before the receiver pulse.'
  };
})();
