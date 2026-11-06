/* Platform Nine pursuit playtest. The train decks are moving collision surfaces. */
(() => {
  if(!window.location)return;
  const query=new URLSearchParams(location.search);
  if(query.get('level')!=='11'||query.get('chase')!=='1')return;

  const limit=22;
  const trainSpeed=56;
  const beams=[1250,1800,2355].map(x=>({x,y:258,w:23,h:24}));
  const cars=[
    {x:390,y:400,w:350,roof:[545,333,160],safe:true},
    {x:795,y:400,w:340,roof:[820,309,270]},
    {x:1185,y:405,w:320,roof:[1205,309,270]},
    {x:1560,y:401,w:340,roof:[1590,310,255]},
    {x:1955,y:394,w:330,roof:[1980,305,250]},
    {x:2338,y:392,w:280,roof:[2360,304,217]},
    {x:2708,y:370,w:330,runaway:true}
  ];
  let startedAt, launchOffset, stationOffset, stopped, recharge;

  const level={
    name:'Platform Nine',subtitle:'Catch the Runaway',width:4520,arena:4400,core:4450,
    story:'Board the carriage, then chase down the runaway maintenance car. Hold Down under roof gantries or take the sheltered aisles. Save one charge to Arc Link the brake and finish Platform Nine.',
    ending:'Platform Nine complete. The maintenance car has stopped and the passenger line is clear.',
    platforms:[[0,420,335]],generators:[],hazards:[],enemies:[],
    checkpoints:[{x:70,y:386},{x:465,y:366},{x:465,y:366},{x:465,y:366}],
    station:{art:[.382,.698],style:'platform',music:'district5',finish:'The runaway is stopped.',pads:[],gates:[]}
  };

  function createSurfaces() {
    for(const car of cars) {
      platforms.push({x:car.x,baseX:car.x,y:car.y,w:car.w,h:12,car});
      if(car.roof){
        const [x,y,w]=car.roof;
        platforms.push({x,baseX:x,y,w,h:10,car,roof:true});
      }
    }
    recharge={x:1750,y:370,type:'node',drained:false};
    grid.sources=[{x:125,y:390,type:'cabinet',drained:false},
      {x:232,y:390,type:'cabinet',drained:false},recharge];
    resetMotion();
  }

  function resetMotion() {
    stationOffset=0;
    launchOffset=0;
    startedAt=checkpoint===1?time:null;
    stopped=false;
    for(const surface of platforms)if(surface.car)surface.x=surface.baseX;
    if(recharge)recharge.x=1750;
  }

  function retry() {
    deaths++;
    window.BlackoutAudio?.effect('retry');
    spawn();
    grid.say('CHASE RETRY · Safe carriage checkpoint.',{priority:3,duration:3});
  }

  function support() {
    if(!p.ground)return null;
    return platforms.find(surface=>p.x+p.w>surface.x&&p.x<surface.x+surface.w&&Math.abs(p.y+p.h-surface.y)<2);
  }

  function move() {
    const rider=support()||p.hang?.b;
    const foot=p.y+p.h;
    p.h=held('ArrowDown','KeyS')&&!p.teleport?20:34;
    p.y=foot-p.h;
    if(stopped)return;
    if(checkpoint===0&&rider?.car?.safe) {
      checkpoint=1;
      launchOffset=stationOffset;
      startedAt=time;
      p.charges=2;p.charge=true;
      Combat2D.heal();
      Progress.save();
      grid.say('CHASE STARTED · Catch the car and save one charge for its brake.',{priority:3,duration:4});
    }
    const elapsed=startedAt===null?0:time-startedAt;
    if(startedAt!==null&&elapsed>=limit){retry();return;}
    const offset=startedAt===null?21*(1-Math.cos(time*1.5)):launchOffset+elapsed*trainSpeed;
    if(startedAt===null)stationOffset=offset;
    for(const surface of platforms){
      if(!surface.car)continue;
      const next=surface.baseX+offset+(surface.car.runaway?Math.min(52,elapsed*5):0);
      if(surface===rider)p.x+=next-surface.x;
      surface.x=next;
    }
    recharge.x=1750+offset;
  }

  function checkBeams() {
    if(checkpoint!==1||p.teleport||stopped)return;
    if(!beams.some(beam=>overlap(p,beam)))return;
    const guard=Combat2D.guard;
    Combat2D.hurt('gantry');
    if(Combat2D.guard!==guard)grid.say('GANTRY HIT · Hold Down or use the sheltered aisle.',{priority:2,duration:2});
  }

  function brake() {
    const car=support();
    if(!car?.car?.runaway||Math.abs(p.x+9-(car.x+175))>36)return false;
    if(!p.charges){grid.say('BRAKE RELAY · Needs one charge. Retry from the safe carriage if you are empty.');return true;}
    ChapterAbilities.spend();
    stopped=true;
    burst(car.x+175,car.y-18,28);
    window.BlackoutAudio?.effect('power');
    return true;
  }

  function drawTrain() {
    for(const surface of platforms){
      const {x,y,w,car,roof}=surface;
      if(!car){
        rect(x,y,w,16,'#70737a');rect(x,y,w,3,'#debe92');
        rect(x,y+16,w,58,'#444750');
        continue;
      }
      if(roof){
        rect(x,y,w,3,'#b7a086');rect(x+2,y+3,w-4,7,'#415867');
        for(let rib=x+14;rib<x+w-8;rib+=29)rect(rib,y+4,2,5,'#718688');
        if(car.safe)label('ROOF ROUTE · HOLD ↓ AT GANTRIES',x+w/2,y-48,'#ffdb9a',true);
        continue;
      }
      if(car.roof){
        const top=car.roof[1]+10;
        rect(x+10,top,w-20,y-top,'#152632d9');
        rect(x+13,top+8,w-26,2,'#866a53');
        for(let seat=x+33;seat<x+w-26;seat+=51){
          rect(seat,top+19,25,17,'#614b44');rect(seat+2,top+20,21,10,'#ba8c62');
          rect(seat+2,y-17,20,12,'#6c4f48');
        }
      }
      rect(x,y,w,3,car.runaway?'#f4bd75':'#b8a386');
      rect(x,y+3,w,16,car.runaway?'#654c40':'#344a59');
      rect(x+4,y+13,w-8,2,'#a77e55');
      for(const truck of [x+28,x+w-62]){
        rect(truck,y+18,34,7,'#293742');
        for(const wheel of [truck+1,truck+20]){
          rect(wheel,y+23,12,9,'#18252f');rect(wheel+3,y+25,6,5,'#827266');
        }
      }
      rect(x+2,y+32,w-4,2,'#6e655a');
      if(car.runaway){
        const relay=x+175;
        rect(relay-7,y-25,14,25,'#304c56');rect(relay-5,y-23,10,6,'#a0f1dc');
        label('FINISH · STOP THE CAR',relay,y-54,'#baffed',true);
        label('E / POWER · BRAKE',relay,y-32,'#baffed');
      }
    }
    if(checkpoint===1)for(const beam of beams){
      rect(beam.x,beam.y-100,6,beam.h+100,'#47525a');
      rect(beam.x-10,beam.y,beam.w+20,beam.h,'#3d4c56');
      rect(beam.x-10,beam.y+beam.h-4,beam.w+20,4,'#db9b54');
      for(let stripe=beam.x-8;stripe<beam.x+beam.w+7;stripe+=7)rect(stripe,beam.y+beam.h-4,3,4,'#35414a');
      rect(beam.x-104,beam.y-8,86,2,'#c08b4b');
      label('LOW GANTRY · HOLD ↓',beam.x-112,beam.y-13,'#ffdb9a',true);
    }
  }

  function label(text,x,y,color,emphasis=false){
    ctx.save();ctx.font=`bold ${emphasis?13:10}px monospace`;ctx.textAlign='center';
    const width=Math.ceil(ctx.measureText(text).width)+14;
    rect(x-width/2,y-14,width,20,'#142634');
    if(emphasis)rect(x-width/2,y+5,width,2,color);
    ctx.fillStyle=color;ctx.fillText(text,x,y);ctx.restore();
  }

  window.PlatformNine={level,createSurfaces,move,brake,checkBeams,drawTrain,complete:()=>stopped,
    respawn(){resetMotion();if(checkpoint===1){p.charges=2;p.charge=true;}},
    restoreStopped(){stopped=true;p.x=cars.at(-1).x+160;p.y=cars.at(-1).y-p.h;},
    speed(){return checkpoint===1&&p.y+p.h>=385&&p.x<platforms.find(surface=>surface.car?.runaway).x?162:p.h===20?195:235;},
    objective:()=>stopped?'Platform Nine complete':checkpoint===0?'Board the safe carriage':'Stop the runaway to finish Platform Nine',
    hint(){
      if(checkpoint===0)return 'Jump to the carriage as it pulls alongside. It becomes your checkpoint.';
      if(stopped)return 'Passenger line clear.';
      if(beams.some(beam=>beam.x>=p.x-20&&beam.x<p.x+250)&&p.y+p.h<370)return 'LOW GANTRY AHEAD · Hold Down to duck.';
      return 'Roof route: duck at gantries. Aisle route: one recharge. Use one charge at the final brake.';
    },
    status:()=>startedAt===null?'BOARD THE SAFE CARRIAGE':stopped?'RUNAWAY STOPPED':`${Math.max(0,limit-(time-startedAt)).toFixed(1)} s TO CATCH THE CAR`,
    beams
  };
})();
