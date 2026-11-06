/* Direct local entry to the first Meridian Station level. */
(() => {
  if (!window.location) return;
  const entry = new URLSearchParams(location.search).get('level');
  if (!/^(9|1[0-6])$/.test(entry??'')) return;

  const chapter = Number(entry)-1;
  const level = {
    name: 'Station Square',
    subtitle: 'Meridian Station',
    story: 'Meridian’s entrance is locked. Learn Arc Link at the first signal pad, cross the live maintenance line, and redirect the Gatekeeper’s power to open the station.',
    ending: 'The doors swing open. Deep inside the concourse, a departure bell answers. The next delivery is waiting.',
    boss: 'Gatekeeper', kind: 'lock', health: 3, rangedBoss: true,
    width: 4240, arena: 3790, core: 4040,
    platforms: [
      [0, 420, 348], [348, 411, 21], [369, 403, 21],
      [450, 398, 220], [730, 374, 235], [1010, 398, 260],
      [1330, 355, 185], [1585, 374, 225], [1818, 313, 58], [1890, 350, 215],
      [2185, 366, 170], [2430, 342, 235], [2750, 360, 225], [3060, 335, 240],
      [3370, 323, 170], [3610, 312, 115], [3790, 300, 450]
    ],
    generators: [
      {x:1080,y:398,checkpoint:1}, {x:2635,y:342,checkpoint:2},
      {x:3440,y:323,checkpoint:3}, {x:4160,y:300,checkpoint:4}
    ],
    checkpoints: [{x:70,y:386},{x:1080,y:364},{x:2635,y:308},{x:3440,y:289}],
    hazards: [
      {x:1430,y:355,w:38,type:'vent',period:4.8,offset:1},
      {x:1610,y:374,w:64,type:'wire',period:4.8,offset:3.1},
      {x:2480,y:342,w:51,type:'wire',period:4.3,offset:.4}
    ],
    enemies: [{id:'station-patrol',x:2840,y:308,hp:2,type:'drone'}],
    station:{style:'square',music:'district8',finish:'Meridian Station is open.',
      pads:[{x:787,y:374},{x:2310,y:366}],gates:[[820,286],[2555,254]],
      hint:'Read the signal. Jump the steam to save energy for Shield or Teleport at the live line.'}
  };

  const stationLevel = () => Campaign.level.station;
  const gateFor = (pad,index) => grid.doors[pad.door ?? index];
  const lanes = () => [75,190,370].map((offset,i)=>({
    left:Campaign.arena+i*150,right:Campaign.arena+(i+1)*150,pad:Campaign.arena+offset,
    name:['LEFT','CENTER','RIGHT'][i]
  }));
  const capacity = () => Campaign.index>=12 || grid.generators[stationLevel().powerBank-1]?.on ? 3 : 2;
  const timing = {...ChapterAbilities.timing,cycle:6.5,firstStrike:1.85,open:2.45,recharge:2.15,strikeFlash:.4};
  ChapterAbilities.timing = timing;
  ChapterAbilities.timeline = boss => {
    const firstStrike=(stationLevel().strike??timing.firstStrike)-(boss.health===1?.3:0);
    if(stationLevel().secondPulse&&boss.health<=2) {
      return {...timing,firstStrike,double:true,secondLock:2.02,secondStrike:3.65,recharge:3.9,open:4.14};
    }
    return {...timing,firstStrike,double:false};
  };
  ChapterAbilities.fusePoint = () => Campaign.index===8?{x:1850,y:279}:{x:Campaign.level.generators[1].x-75,y:Campaign.level.generators[1].y-34};
  const laneFor = boss => {
    const current=ChapterAbilities.timeline(boss);
    const handoff=current.double&&boss.clock%current.cycle>=current.secondLock;
    const index=(Math.floor(boss.clock/current.cycle)+Number(handoff))%3;
    return lanes()[(stationLevel().laneOrder??[0,2,1])[index]];
  };
  const nextStrike = ({cycle,timing:current}) => current.double&&cycle>=current.secondLock?current.secondStrike:current.firstStrike;
  const standingAt = (x,y) => p.ground && Math.abs(p.x+9-x)<29 && Math.abs(p.y+p.h-y)<7;

  function link() {
    const boss=ChapterAbilities.boss;
    if (boss) {
      if (stationLevel().sequence) return linkSequence(boss);
      const lane=laneFor(boss);
      const state=ChapterAbilities.encounterState(boss);
      if (!standingAt(lane.pad,300)) return false;
      if (state.recovering || state.coreOpen) return true;
      if (state.cycle<state.timing.open) {
        grid.say('ARC LINK · Wait for the signal pulse to pass.');
        return true;
      }
      if (p.charges<1) {
        grid.say('ARC LINK · Needs one charge. The signal relay refills after each pulse.');
        return true;
      }
      ChapterAbilities.spend();
      boss.linkedCycle=state.cycleId;
      flashLink(lane.pad,270,Campaign.core,265);
      grid.say('CORE EXPOSED · Face the Gatekeeper and fire Bolt.');
      return true;
    }
    const pads=stationLevel().pads;
    const index=pads.findIndex((pad,i)=>!gateFor(pad,i).open&&standingAt(pad.x,pad.y));
    if (index<0) return false;
    if (p.charges<1) {
      grid.say('ARC LINK · Touch a cyan cabinet first.');
      return true;
    }
    ChapterAbilities.spend();
    const door=gateFor(pads[index],index);
    door.open=true;
    door.onOpen(door);
    flashLink(pads[index].x,pads[index].y-24,door.x+door.w/2,door.y+28);
    grid.say(Campaign.index===8&&index===0?'ARC LINK LEARNED · One charge powers a marked relay at a distance.':'ARC LINK · Remote gate opened.',{priority:2,duration:4});
    return true;
  }

  let linkFlash, departureAt=null;
  function flashLink(x,y,toX,toY) {
    linkFlash={x,y,toX,toY,until:time+.35};
    burst(toX,toY,24);
    window.BlackoutAudio?.effect('power');
  }

  function updateBoss(boss,dt) {
    if (stationLevel().sequence) {
      if (boss.sequenceUntil && time>=boss.sequenceUntil) {
        boss.sequence=0;
        boss.sequenceUntil=0;
        grid.say('SEQUENCE RESET · Return to relay 1.');
      }
      return;
    }
    const prior=ChapterAbilities.encounterState(boss);
    boss.clock+=dt;
    const state=ChapterAbilities.encounterState(boss);
    const lane=laneFor(boss);
    if (state.cycleId!==prior.cycleId) window.BlackoutAudio?.effect('bossLock');
    const strike=nextStrike(state);
    if (state.timing.double && prior.cycle<state.timing.secondLock && state.cycle>=state.timing.secondLock) {
      window.BlackoutAudio?.effect('bossLock');
    }
    if (prior.cycle<strike && state.cycle>=strike) {
      window.BlackoutAudio?.effect('bossStrike');
      const center=p.x+9;
      if (!p.teleport && (center<lane.left || center>=lane.right) && !Combat2D.absorb()) {
        if (boss.shield) {boss.shield=false;grid.say('FUSE SHIELD · Signal pulse absorbed.');}
        else Combat2D.hurt('signal');
      }
    }
    if (state.cycle>=state.timing.recharge && boss.rechargedCycle!==state.cycleId && standingAt(lane.pad,300)) {
      boss.rechargedCycle=state.cycleId;
      p.charges=p.capacity;
      p.charge=true;
    }
  }

  function bossMessage(boss) {
    if (stationLevel().sequence) {
      const remaining=boss.sequenceUntil?Math.max(0,boss.sequenceUntil-time):stationLevel().sequenceTime;
      return {phase:`${stationLevel().sequenceName??'DEPARTURE BOARD'} · RELAY ${(boss.sequence||0)+1} / 3`,remaining,total:stationLevel().sequenceTime,tip:'Arc Link the cyan relays in order. The timer starts at relay 1.',tone:'open'};
    }
    const {cycle,timing:current,coreOpen}=ChapterAbilities.encounterState(boss);
    const lane=laneFor(boss);
    if (coreOpen) return {phase:'CORE EXPOSED · BOLT',remaining:current.cycle-cycle,total:current.cycle-current.open,tip:'Face the Gatekeeper and fire Bolt (1 energy).',tone:'open'};
    const strike=nextStrike({cycle,timing:current});
    if (cycle<strike) return {phase:`${strike===current.firstStrike?'SIGNAL LOCK':'SECOND PULSE'} · ${lane.name} IS SAFE`,remaining:strike-cycle,total:strike===current.firstStrike?strike:strike-current.secondLock,tip:'Move onto the cyan signal lane before the amber lanes fire.',tone:'warning'};
    if(current.double&&cycle<current.secondLock) return {phase:'SIGNAL CHANGING',remaining:current.secondLock-cycle,total:current.secondLock-current.firstStrike,tip:'Watch for the next cyan lane.',tone:'strike'};
    if (cycle<current.open) return {phase:'SIGNAL PULSE',remaining:current.open-cycle,total:current.open-current.firstStrike,tip:'Stand on the safe relay to refill energy. Arc Link is ready when the pulse clears.',tone:'strike'};
    return {phase:`ARC LINK · ${lane.name} RELAY`,remaining:current.cycle-cycle,total:current.cycle-current.open,tip:'Stand on the cyan pad and press Power / E (1 energy) to expose the core.',tone:'open'};
  }

  function linkSequence(boss) {
    const sequence=stationLevel().sequence;
    const index=boss.sequence||0;
    if (!standingAt(sequence[index],300)) return false;
    if (!p.charges) {grid.say('ARC LINK · Recharge at the cabinet beside the relay.');return true;}
    ChapterAbilities.spend();
    if (index===0) boss.sequenceUntil=time+stationLevel().sequenceTime;
    boss.sequence=index+1;
    flashLink(sequence[index],272,Campaign.core,218);
    if(boss.sequence===sequence.length) {
      ChapterAbilities.defeated=true;
      ChapterAbilities.boss=null;
      Soundtrack.setEncounter(null);
      grid.say(stationLevel().sequenceName?'EXPRESS READY · Power the final cab relay.':'BOARD ONLINE · Power the final platform shutter.',{priority:3,duration:6});
      window.Progress?.save();
    }
    return true;
  }

  window.StationSquare = {chapter, get completionTitle(){return stationLevel().finish},get pads(){return stationLevel().pads},
    get sequence(){return stationLevel().sequence},get blink(){return stationLevel().blink},capacity,link,updateBoss,bossMessage,laneFor,
    coreLinked:(boss,cycleId)=>!stationLevel().sequence&&boss.linkedCycle===cycleId,
    doorCountFor:index=>Campaign.levels[index]?.station?.gates.length,
    allGatesOpen:()=>grid.doors.every(door=>door.open||door.optional)};
  StationSquare.finishReady = () => {
    if(!stationLevel().departure)return true;
    if(departureAt===null){
      departureAt=time;
      grid.say('EASTBOUND SIGNAL CLEAR · The express is departing.',{priority:3,duration:4});
      window.BlackoutAudio?.effect('door');
    }
    return time-departureAt>=3.1;
  };
  EncounterPatterns.tip = boss => bossMessage(boss).tip;
  Campaign.levels.push(level,...MeridianLevels);
  if(window.UnderRiverEscape){
    Campaign.levels[13]=UnderRiverEscape.configure(Campaign.levels[13]);
    Campaign.advance=()=>false;
  }
  if(window.PlatformNine){
    Campaign.levels[10]=PlatformNine.level;
    Campaign.advance=()=>false;
  }
  const validateCampaign=Campaign.valid.bind(Campaign);
  Campaign.valid = save => {
    if((save?.chapter===8&&save.completed?.length===9)||(save?.chapter>=8&&save.chapter<12&&save.completed?.length===12)) {
      const completed=Array.from({length:Campaign.levels.length},(_,i)=>save.completed[i]??false);
      return validateCampaign({...save,completed});
    }
    return validateCampaign(save);
  };
  const showIntro=Campaign.intro.bind(Campaign);
  Campaign.intro = () => {
    showIntro();
    document.querySelector('#overlay span').textContent = `DAWN / ${Campaign.level.name.toUpperCase()}`;
  };
  Campaign.reset = function () {
    this.completed = Array.from({length:this.levels.length}, (_, i) => i < chapter);
    this.apply(chapter);
    this.intro();
  };
  Campaign.isComplete = () => false;

  Districts.apply = () => {
    const stage=stationLevel();
    if(window.PlatformNine){
      grid.doors=[];
      PlatformNine.createSurfaces();
      return;
    }
    grid.sources = grid.sources.filter(source => platforms.some(surface =>
      surface.w >= 80 && source.x > surface.x && source.x < surface.x + surface.w));
    if (Campaign.index===8) {
      const cabinet=grid.sources.find(source=>source.x>884&&source.x<914);
      if(cabinet)cabinet.x=942;
      grid.sources=grid.sources.filter(source=>source.x<1585||source.x>=1810);
      grid.sources.push({x:1847,y:282,type:'node',drained:false});
    }
    grid.doors = stage.gates.map(([x,y],i)=>({
      x,y,w:64,h:88,open:false,remote:true,optional:stage.optionalGates?.includes(i),draw:drawGate,
      onOpen(door) { door.openedAt=time; }
    }));
    for(const door of grid.doors) {
      const floor=platforms.find(surface=>surface.x<=door.x&&surface.x+surface.w>=door.x+door.w);
      if(!floor)continue;
      for(const source of grid.sources.filter(source=>source.x>door.x-12&&source.x<door.x+door.w+33)) {
        source.x=floor.x+floor.w-17;
      }
    }
    if(stage.sequence) {
      grid.sources=grid.sources.filter(source=>source.x<Campaign.arena);
      for(const x of stage.sequence)grid.sources.push({x:x-20,y:270,type:'cabinet',drained:false});
      grid.sources.push({x:Campaign.width-40,y:270,type:'cabinet',drained:false});
    }
    for(const supply of stage.supplies??[])grid.sources.push({...supply,type:'cabinet',drained:false});
    for(const lift of stage.lifts??[]) {
      const platform={x:lift.x,y:lift.low,w:lift.w,h:12,lift};
      platforms.splice(platforms.findIndex(surface=>surface.x>lift.x),0,platform);
    }
    for(const [x,y,w] of stage.branches??[]) {
      platforms.splice(platforms.findIndex(surface=>surface.x>x),0,{x,y,w,h:12,branch:true});
    }
    if(stage.branchNode)grid.sources.push({...stage.branchNode,drained:false});
    window.UnderRiverEscape?.placeSupplies();
    linkFlash=null;
    departureAt=null;
  };

  StationSquare.moveSurfaces = dt => {
    const foot=p.y+p.h;
    for(const surface of platforms) {
      const lift=surface.lift;
      if(!lift || (lift.gate!==undefined&&!grid.doors[lift.gate].open))continue;
      const wasOn=p.ground&&Math.abs(foot-surface.y)<2&&p.x+p.w>surface.x&&p.x<surface.x+surface.w;
      const previous=surface.y;
      const phase=(time%lift.period)/lift.period;
      surface.y=lift.low-(lift.low-lift.high)*(.5-.5*Math.cos(phase*Math.PI*2));
      if(wasOn)p.y+=surface.y-previous;
    }
    for(const belt of stationLevel().belts??[]) {
      if(p.ground&&Math.abs(foot-belt.y)<2&&p.x+9>belt.left&&p.x+9<belt.right)p.x+=belt.speed*dt;
    }
  };

  StationSquare.refreshCapacity = () => {
    const next=capacity();
    if(next>p.capacity){
      p.charges=next;
      p.charge=true;
      grid.say('POWER BANK ONLINE · Third energy slot unlocked.',{priority:3,duration:6});
    }
    p.capacity=next;
  };

  Districts.hint = () => {
    if (ChapterAbilities.boss || ChapterAbilities.defeated) return null;
    if(stationLevel().pads.some((pad,i)=>!gateFor(pad,i).open&&Math.abs(p.x-pad.x)<180)) return 'ARC LINK · Stand on the cyan signal pad and press Power / E. Cost: 1 energy.';
    if(Campaign.index!==8 || (p.x>1270&&p.x<1780))return stationLevel().hint;
    return null;
  };
  for(let i=8;i<16;i++)WorldArt.themes[i]=WorldArt.themes[[7,3,4,5,4,6,3,7][i-8]];
  CityScene.story = () => '';
  Districts.draw = () => {
    for(const [i,pad] of stationLevel().pads.entries())drawPad(pad.x,pad.y,gateFor(pad,i).open?'LINKED':'E / ARC LINK');
    const boss=ChapterAbilities.boss;
    if(stationLevel().sequence){
      const count=ChapterAbilities.defeated?3:boss?.sequence||0;
      drawDepartureBoard(count);
      if(boss)for(const [i,x] of stationLevel().sequence.entries())drawPad(x,300,i<count?'LINKED':i===count?`${i+1} / ARC LINK`:`RELAY ${i+1}`);
    }else if(boss){
      const safe=laneFor(boss);
      const state=ChapterAbilities.encounterState(boss);
      const {cycle,timing:current}=state;
      const strike=nextStrike(state);
      for(const lane of lanes()){
        const live=lane!==safe && cycle<strike+current.strikeFlash;
        rect(lane.left,298,lane.right-lane.left-2,4,lane===safe?'#7de3cf':live?'#e7a467':'#655e63');
        if(live)rect(lane.left,211,lane.right-lane.left-2,87,cycle<strike?'#e78a3730':'#ffaa5469');
      }
      drawPad(safe.pad,300);
    }
    drawBelts();
    if(linkFlash && time<linkFlash.until){
      ctx.save();
      ctx.strokeStyle='#a1ffed';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(linkFlash.x,linkFlash.y);
      ctx.lineTo((linkFlash.x+linkFlash.toX)/2,Math.min(linkFlash.y,linkFlash.toY)-22);
      ctx.lineTo(linkFlash.toX,linkFlash.toY);ctx.stroke();ctx.restore();
    }
  };

  StationSquare.drawBossLabel = () => {
    const boss=ChapterAbilities.boss;
    if(!boss||stationLevel().sequence)return;
    const {cycle,timing:current}=ChapterAbilities.encounterState(boss);
    const x=laneFor(boss).pad, y=245;
    const label=cycle<current.open?'SAFE RELAY':'E / ARC LINK';
    ctx.save();
    ctx.font='bold 10px monospace';
    ctx.textAlign='center';
    const width=Math.ceil(ctx.measureText(label).width)+12;
    rect(x-width/2,y-11,width,16,'#142b37');
    rect(x-width/2,y+4,width,1,'#6fe5d6');
    rect(x,y+5,1,8,'#6fe5d6');
    ctx.fillStyle='#d0fff5';
    ctx.fillText(label,x,y);
    ctx.restore();
  };

  function drawDepartureBoard(count) {
    const x=Campaign.arena+105,y=139;
    rect(x-3,y-4,248,73,'#84674a');
    rect(x,y,242,65,'#17232c');
    ctx.save();ctx.font='10px monospace';ctx.fillStyle='#e6bc83';
    ctx.fillText(stationLevel().sequenceName??'MERIDIAN DEPARTURES',x+13,y+15);
    (stationLevel().sequenceLines??['SIGNALS ONLINE','PLATFORM NINE','BOARDING ROUTE OPEN']).forEach((label,i)=>{
      rect(x+9,y+22+i*12,222,9,i<count?'#374b44':'#26323b');
      ctx.fillStyle=i<count?'#9ff3d6':'#798180';
      ctx.fillText(i<count?label:'— — —',x+13,y+30+i*12);
    });
    ctx.restore();
  }

  function drawBelts() {
    for(const belt of stationLevel().belts??[]) {
      rect(belt.left,belt.y,belt.right-belt.left,12,'#384049');
      const offset=((time*belt.speed)%18+18)%18;
      for(let x=belt.left+offset;x<belt.right-6;x+=18){
        rect(x,belt.y+2,6,2,'#d1a368');
        rect(x,belt.y+7,3,3,'#1c2830');
      }
    }
  }

  function drawPad(x,y,label){
    rect(x-17,y-3,34,3,'#6fe5d6');
    rect(x-4,y-22,8,19,'#394d57');
    rect(x-7,y-28,14,9,'#1b3541');
    rect(x-5,y-26,10,5,'#95f1df');
    if(!label)return;
    ctx.save();ctx.textAlign='center';ctx.fillStyle='#d0fff5';ctx.font='9px monospace';
    ctx.fillText(label,x,y-34);ctx.restore();
  }

  function drawGate(door, fill, context, tick) {
    const {x,y,w,h,open} = door;
    const floor = y+h;
    const indicator = open ? '#8cf8df' : '#ffc77f';
    const travel = open ? Math.min(1,Math.max(0,(tick-(door.openedAt ?? -1))/.22)) : 0;
    const offset = Math.round(w*travel);

    // The leaf slides along a bronze track into the receiving pier.
    fill(x-3,floor-3,w+8,3,'#51423d');
    fill(x,floor-3,w,1,'#b29a71');
    if (offset<w) {
      context.save();
      context.beginPath();
      context.rect(x,y,w,h);
      context.clip();
      const leaf=x+offset;
      if(stationLevel().style==='tunnel'){
        fill(leaf,y+5,w,h-10,'#2c4953');
        fill(leaf+3,y+8,w-6,h-17,'#395863');
        for(let seam=y+12;seam<floor-8;seam+=13) {
          fill(leaf+4,seam,w-8,2,'#253d48');
          fill(leaf+5,seam+2,w-10,1,'#6f7e78');
        }
      }
      fill(leaf,y+10,w,5,'#27343c');
      fill(leaf,y+10,w,1,'#7c8279');
      fill(leaf,floor-14,w,7,'#23333e');
      fill(leaf,floor-13,w,1,'#78817c');
      for(let bar=leaf+3;bar<leaf+w;bar+=7) {
        fill(bar,y+5,3,h-19,'#22313c');
        fill(bar,y+5,1,h-19,'#818781');
        fill(bar+1,y+2,1,4,'#9a8b76');
        fill(bar+1,y+12,1,1,'#c7aa80');
      }
      for(const wheel of [leaf+5,leaf+w-10]) {
        fill(wheel,floor-10,7,7,'#4a423e');
        fill(wheel+1,floor-9,5,5,'#997f59');
        fill(wheel+2,floor-8,3,3,'#26343d');
      }
      context.restore();
    }

    for(const pier of [x-15,x+w]) {
      fill(pier,floor-78,15,78,'#8b796c');
      fill(pier+1,floor-77,11,76,'#ae9780');
      fill(pier+12,floor-76,2,75,'#6f645e');
      for(let joint=floor-64;joint<floor-5;joint+=13) {
        fill(pier+1,joint,13,1,'#766b62');
        fill(pier+2,joint+1,9,1,'#c2aa90');
      }
      fill(pier-2,floor-81,19,5,'#c5ac8d');
      fill(pier-1,floor-81,17,1,'#e6c7a2');
      fill(pier-1,floor-7,17,7,'#9a8370');
    }

    const motor=x+w+13;
    fill(motor,floor-17,13,17,'#263741');
    fill(motor+1,floor-16,11,2,'#828176');
    for(let vent=floor-12;vent<floor-2;vent+=3)fill(motor+3,vent,7,1,'#64726d');
    fill(x+w+6,floor-61,7,10,'#343942');
    fill(x+w+8,floor-59,3,5,indicator);
    fill(x+w+9,floor-51,1,34,'#534c43');
    if (open) return;

    context.fillStyle = '#ffda9d';
    context.font = '9px monospace';
    context.textAlign = 'center';
    context.fillText('REMOTE GRILLE',x+w/2,y-8);
    context.textAlign = 'start';
  }

  CityScene.rooftops = (context, surfaces, power, tick, camera, width) => {
    if(window.PlatformNine){PlatformNine.drawTrain();return;}
    const fill = (x,y,w,h,color) => {
      context.fillStyle = color;
      context.fillRect(Math.round(x),Math.round(y),w,h);
    };
    if (stationLevel().style!=='square') {
      drawInteriorPlatforms(fill,surfaces,camera,width);
      return;
    }
    const street = 446;
    fill(camera,street,width,350,'#2a3342');
    for(let row=0;row<15;row++) {
      const y=street+row*9;
      fill(camera,y,width,1,'#536075');
      for(let x=Math.floor(camera/40)*40-(row%2)*20;x<camera+width;x+=40) {
        fill(x,y+1,1,8,'#1d2837');
        const patch=Math.abs(Math.sin(x*1.21+row*4.3));
        if(patch>.57)fill(x+5,y+3,7+patch*15,1,row%4===0?'#8e726a':'#465972');
      }
    }
    for(const surface of surfaces) {
      const {x,y,w}=surface;
      if(x+w<camera-5||x>camera+width+5)continue;
      fill(x,y,w,street-y,'#414754');
      for(let row=0;y+7+row*13<street;row++) {
        const top=y+7+row*13;
        fill(x,top,w,1,'#252f3c');
        for(let block=-(row%2)*15;block<w;block+=30) {
          const start=Math.max(0,block), end=Math.min(w,block+29);
          if(end<=start)continue;
          fill(x+start,top+1,end-start,Math.min(11,street-top-1),['#454c59','#4b515d','#3a4453'][(row+Math.floor((block+30)/30))%3]);
          fill(x+start,top+1,Math.max(1,end-start-3),1,'#60616a');
        }
      }
      fill(x,y,w,2,'#d3c1a7');
      fill(x,y+2,w,4,'#8d8b87');
      fill(x,y+6,w,1,'#343743');
      for(let edge=10;edge<w-10;edge+=65) {
        fill(x+edge,y+3,Math.min(16,w-edge),1,'#a4e0d7');
      }
    }
    drawSquareFixtures(fill,power);
  };

  function drawInteriorPlatforms(fill,surfaces,camera,width) {
    const style=stationLevel().style;
    const floor=482;
    const isCarriage=({x,y,w})=>(style==='platform'||style==='express')&&w>=180&&y<390&&x<Campaign.arena;
    const flooded=style==='tunnel';
    fill(camera,floor,width,180,flooded?'#172d38':'#252c37');
    fill(camera,floor,width,2,flooded?'#42666b':'#514c4b');
    if(flooded)for(let x=Math.floor(camera/41)*41;x<camera+width;x+=41) {
      const ripple=(Math.round(time*8)+Math.floor(x/4))%24;
      fill(x+ripple/2,floor+7+ripple%16,14+ripple/3,1,'#35545f');
    }
    if(style==='concourse') {
      for(let x=Math.floor(camera/48)*48;x<camera+width;x+=48) {
        fill(x,floor+2,1,32,'#1c2633');
      }
    }
    for(const surface of surfaces) {
      const {x,y,w,lift}=surface;
      if(x+w<camera-6||x>camera+width+5)continue;
      if(lift){
        for(const railX of [x+3,x+w-6]) {
          const top=lift.high-25;
          fill(railX,top,3,floor-top,'#475660');
          fill(railX,top,1,floor-top,'#a58f72');
          fill(railX-4,floor-4,11,5,'#777065');
        }
      }else if(style==='concourse')drawConcourseSupports(fill,x,y,w,floor);
      else drawSteelSupports(fill,x,isCarriage(surface)?y+76:y+15,w,floor);
    }
    if(departureAt!==null)drawDepartureTrain(fill);
    for(const surface of surfaces) {
      const {x,y,w,lift}=surface;
      if(x+w<camera-6||x>camera+width+6)continue;
      const rail=style==='concourse'?'#a18565':style==='platform'?'#586b71':'#716355';
      fill(x,y,w,2,'#d5c1a0');
      fill(x,y+2,w,lift?10:14,lift?'#48565b':rail);
      fill(x,y+5,w,2,'#273643');
      if(lift){
        fill(x+4,y-3,w-8,2,'#efbe77');
        continue;
      }
      const carriage=isCarriage(surface);
      for(let post=x+13;post<x+w-6;post+=44){
        fill(post,y+2,15,1,'#a3d8c5');
        if(carriage){
          fill(post-6,y+16,41,42,'#36404b');
          fill(post-5,y+18,39,2,'#926850');
          fill(post,y+26,22,16,'#aa7448');
          fill(post+1,y+27,20,12,'#c78e5e');
          fill(post+11,y+26,2,16,'#51414a');
        }
      }
      if(carriage){
        fill(x,y+58,w,4,'#343743');
        for(const truck of [x+22,x+w-56]){
          fill(truck,y+62,34,6,'#29333c');
          for(const wheel of [truck+2,truck+21]){
            fill(wheel,y+64,10,9,'#202933');
            fill(wheel+2,y+66,6,5,'#7c7263');
          }
        }
        fill(x,y+73,w,3,'#867b69');
        fill(x,y+76,w,4,'#363d45');
      }
    }
  }

  function drawDepartureTrain(fill) {
    const progress=Math.min(1,(time-departureAt)/3.1);
    const start=Campaign.arena-360+progress*progress*920;
    const y=351;
    fill(Campaign.arena-500,y+59,1330,3,'#807568');
    for(let i=0;i<3;i++){
      const x=start+i*126;
      fill(x+3,y,117,5,'#51656b');
      fill(x,y+5,120,43,'#243a49');
      fill(x+2,y+7,116,2,'#b78a62');
      for(let windowX=x+10;windowX<x+110;windowX+=22){
        fill(windowX,y+13,15,18,'#bc8958');
        fill(windowX+2,y+15,11,14,'#f3cb8a');
        fill(windowX+7,y+15,1,14,'#7b6252');
      }
      fill(x,y+38,120,2,'#a27c54');
      fill(x+15,y+48,89,6,'#293642');
      for(const wheel of [x+21,x+82]){
        fill(wheel,y+52,13,7,'#1b2630');
        fill(wheel+2,y+53,9,4,'#786c63');
      }
      if(i===2)fill(x+115,y+23,6,4,'#f5d396');
    }
  }

  function drawSteelSupports(fill,x,top,width,floor) {
    const count=Math.max(2,Math.ceil(width/108));
    const inset=Math.min(13,width/4);
    for(let i=0;i<count;i++) {
      const post=x+inset+(width-2*inset)*i/(count-1);
      fill(post-3,top,7,floor-top,'#34424d');
      fill(post-2,top,1,floor-top,'#74807f');
      fill(post-6,top,13,4,'#58636a');
      fill(post-7,floor-6,15,7,'#6e655b');
      fill(post-8,floor-2,17,3,'#918071');
      for(let depth=0;depth<Math.min(16,(width-2*inset)/2);depth+=2) {
        const brace=post+(i===count-1?-1:1)*(16-depth);
        fill(brace-1,top+depth,3,3,'#59656a');
      }
    }
  }

  function drawConcourseSupports(fill,x,y,width,floor) {
    const count=Math.max(2,Math.ceil(width/120));
    for(let i=0;i<count;i++) {
      const center=Math.round(x+15+(width-30)*i/(count-1));
      const top=y+15;
      fill(center-7,top,14,floor-top,'#645749');
      fill(center-5,top+4,3,floor-top-8,'#94806c');
      fill(center+4,top+4,2,floor-top-8,'#423f3e');
      for(let joint=top+27;joint<floor-6;joint+=18)fill(center-7,joint,14,1,'#4e4842');
      fill(center-11,top,22,5,'#9c866b');
      fill(center-10,top+5,20,2,'#51473f');
      fill(center-10,floor-7,20,7,'#776757');
      fill(center-12,floor-3,24,4,'#8a775f');
      for(const side of [-1,1]) {
        if((side<0&&i===0)||(side>0&&i===count-1))continue;
        for(let depth=0;depth<22;depth+=2) {
          const brace=center+side*(27-depth);
          fill(brace-2,top+depth,5,3,'#39434a');
          fill(brace-2,top+depth,1,2,'#8d795d');
        }
      }
    }
  }

  function drawSquareFixtures(fill,power) {
    // Shuttered newsstand and benches sit behind the walking surface.
    const base=420;
    fill(12,base-68,58,68,'#333946');
    fill(16,base-52,50,47,'#58606a');
    for(let y=base-49;y<base-7;y+=4)fill(17,y,48,1,'#303c4a');
    fill(10,base-74,62,10,'#334b58');
    fill(8,base-75,66,2,'#a89173');
    fill(17,base-62,48,9,'#5e4940');
    ctx.fillStyle='#ecd0a2';
    ctx.font='7px monospace';
    ctx.fillText('NEWS',31,base-55);
    for(const x of [257,554,1160,2240]) {
      const y=Campaign.surface(x);
      fill(x,y-17,40,3,'#a37a56');
      fill(x,y-12,40,3,'#7f5c45');
      fill(x-2,y-7,44,3,'#aa805c');
      fill(x+3,y-4,3,4,'#26343c');
      fill(x+34,y-4,3,4,'#26343c');
    }
    for(const [x,y,lit] of [[310,420,true],[1200,398,power.generators[0].on],[2370,328,power.generators[2].on]]) {
      fill(x-4,y-4,10,4,'#23333e');
      fill(x,y-51,3,51,'#293844');
      fill(x-4,y-55,11,12,'#283644');
      fill(x-2,y-53,7,7,lit?'#f7c784':'#5a5757');
      fill(x-5,y-57,13,2,'#938373');
    }
  }

  const station = new Image();
  station.src = 'assets/art-refresh/station-square-approved-reference.png';
  const interiors = new Image();
  interiors.src = 'assets/art-refresh/meridian-interiors.png';
  const railway = new Image();
  railway.src = 'assets/art-refresh/meridian-railway.png';
  const fallback = CityScene.background;
  CityScene.background = (context, width, height, camera, time) => {
    const band=stationLevel().art;
    const image=stationLevel().atlas==='railway'?railway:band?interiors:station;
    if (!image.complete || !image.naturalWidth) {
      fallback(context, width, height, camera, time);
      return;
    }
    // Frame the terminal from the approved concept above its mock gameplay layer.
    const [top,bottom]=band??[.13,.69];
    const sourceHeight = Math.round(image.naturalHeight * (bottom-top));
    const sourceTop = Math.round(image.naturalHeight * top);
    const drawHeight = Math.max(height * (band ? .95 : .85), width * sourceHeight / image.naturalWidth);
    const drawWidth = drawHeight * image.naturalWidth / sourceHeight;
    const progress=Math.min(1, camera / Math.max(1, Campaign.width - width));
    const pan = band ? .05+progress*.9 : .3+progress*.7;
    context.fillStyle = '#26364a';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, sourceTop, image.naturalWidth, sourceHeight,
      -(drawWidth-width)*pan, 0, drawWidth, drawHeight);
    const shade = context.createLinearGradient(0, height*.45, 0, height);
    shade.addColorStop(0, 'transparent');
    shade.addColorStop(1, '#152335');
    context.fillStyle = shade;
    context.fillRect(0, 0, width, height);
  };

  const chooseMusic = Soundtrack.choose.bind(Soundtrack);
  Soundtrack.choose = (x, finished) => Soundtrack.encounter || (finished ? chooseMusic(x, true) : stationLevel().music);
  const drawWeather=CityScene.foreground;
  CityScene.foreground=(...args)=>{
    if(['square','platform','yard'].includes(stationLevel().style))drawWeather(...args);
  };
  StationSquare.drawPatrol = (x,y,tick) => {
    const blade=Math.floor(tick*24)%3;
    for(const side of [-1,1]) {
      const rotor=x+side*18;
      rect(rotor-5,y-7,10,8,'#162733');
      rect(rotor-4,y-6,8,2,'#7b8b8c');
      rect(rotor-3,y+1,6,3,'#a37e56');
      rect(rotor-1,y-11,2,5,'#b69c78');
      rect(rotor-7+blade,y-12,14-blade*2,2,'#708488');
      rect(rotor-4,y-12,8,1,'#b3b6a8');
      rect(x+side*12-4,y-4,8,4,'#566972');
    }
    rect(x-11,y-11,22,3,'#ab936e');
    rect(x-14,y-8,28,14,'#1b2c38');
    rect(x-12,y-7,24,12,'#53666d');
    rect(x-11,y-7,22,2,'#9b9f94');
    rect(x-8,y+5,16,4,'#2e414b');
    rect(x-10,y+2,20,1,'#b08a61');
    rect(x-7,y-5,14,9,'#182c38');
    rect(x-4,y-4,8,7,'#b47b47');
    rect(x-3,y-3,6,5,'#ffbd79');
    rect(x-2,y-3,3,2,'#fff0c0');
  };
  document.querySelector('#journey').hidden = true;
})();
