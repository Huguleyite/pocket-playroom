/* Meridian routes. Arena floors are at y=300 for the shared combat renderer. */
(() => {
  function makeLevel(config) {
    const {width, feeds, ...details}=config;
    return {
      ...details,width,arena:width-450,core:width-200,kind:'lock',health:details.health??3,rangedBoss:true,
      generators:feeds.map(([x,y],i)=>({x,y,checkpoint:i+1})),
      checkpoints:[{x:70,y:386},...feeds.slice(0,3).map(([x,y])=>({x,y:y-34}))]
    };
  }

  window.MeridianLevels = [
    makeLevel({
      name:'The Grand Concourse',subtitle:'Restore the Departure Board',boss:'Departure Board',width:3510,
      story:'The board is dark and the platform shutters are locked. Arc Link the ticket hall relays and climb to the balcony. At the board, link its three marked relays in order before the signal expires.',
      ending:'The board clatters back to life. Platform Nine appears on the bottom row, and its shutter lifts.',
      platforms:[[0,420,380],[445,402,230],[735,382,180],[982,310,210],[1255,278,210],[1535,254,190],[1785,306,225],[2075,350,240],[2380,323,220],[2670,315,145],[2880,315,115],[3060,300,450]],
      feeds:[[1120,310],[2180,350],[2745,315],[3440,300]],
      hazards:[{x:1605,y:254,w:42,type:'vent',period:5.1,offset:1.7}],
      enemies:[],
      station:{art:[.002,.374],style:'concourse',music:'district4',finish:'The departure board is online.',
        pads:[{x:839,y:382,door:0},{x:1006,y:310,door:0},{x:1350,y:278,door:1}],
        gates:[[1045,222],[1850,218]],
        lifts:[{x:920,w:59,low:382,high:314,gate:0,period:5}],
        sequence:[3150,3265,3390],sequenceTime:9,
        hint:'Power the lift from the ticket hall, or reach the balcony pad with a high dash.'}
    }),
    makeLevel({
      name:'Platform Nine',subtitle:'Read the Signals',boss:'Signal Inspector',width:3900,
      story:'The platforms have power, but the signal system is cycling live track. Read the amber warning before you cross. Save a charge on the lower walkway or spend energy to cross the train roofs faster.',
      ending:'The platform signals turn cyan. A maintenance stair opens below the passenger line.',
      platforms:[[0,420,370],[430,405,220],[710,382,235],[1005,352,255],[1325,344,220],[1557,403,90],[1660,366,230],[1950,330,235],[2250,356,225],[2550,326,230],[2840,347,190],[3095,320,145],[3305,315,115],[3450,300,450]],
      feeds:[[1060,352],[2355,356],[3160,320],[3825,300]],
      hazards:[{x:1100,y:352,w:70,type:'wire',period:4.3,offset:1.6},{x:1450,y:344,w:48,type:'wire',period:4.8,offset:2.4},{x:2040,y:330,w:70,type:'wire',period:4.1,offset:.7},{x:2630,y:326,w:58,type:'wire',period:4.4,offset:3}],
      enemies:[{id:'platform-watch',x:2700,y:278,hp:2,type:'drone'}],
      station:{art:[.382,.698],style:'platform',music:'district5',finish:'Platform Nine is clear.',
        pads:[{x:1840,y:366}],gates:[[2265,268]],laneOrder:[1,0,2],strike:1.65,
        hint:'Amber signals warn of a live line. Take the lower step, wait, or cross with Shield or Teleport.'}
    }),
    makeLevel({
      name:'Baggage Below',subtitle:'Bring the Sorter Online',boss:'Baggage Sorter',width:4140,
      story:'Follow the belts through the service vaults. Restore the baggage power bank to unlock a third energy slot, then use the sorter’s service signals to reach its core.',
      ending:'The baggage line is running again. Beyond the sorting vault, the switching yard waits.',
      platforms:[[0,420,375],[430,406,220],[710,381,245],[1015,352,280],[1360,374,230],[1655,339,195],[1915,365,265],[2245,348,275],[2585,319,190],[2840,348,225],[3130,320,230],[3425,310,190],[3690,300,450]],
      feeds:[[1130,352],[2415,348],[3500,310],[4065,300]],
      hazards:[{x:1190,y:352,w:42,type:'vent',period:4.1,offset:1.8},{x:2010,y:365,w:46,type:'wire',period:4.8,offset:2.2},{x:3250,y:320,w:50,type:'vent',period:4.4,offset:0}],
      enemies:[{id:'sorter-drone',x:2920,y:300,hp:2,type:'drone'}],
      station:{art:[.705,.999],style:'baggage',music:'district6',finish:'The baggage line is running.',
        pads:[{x:2138,y:365}],gates:[[2285,260]],lifts:[{x:1593,w:60,low:389,high:343,period:4.4}],
        branches:[[1870,316,36],[1945,272,135],[2090,291,30]],branchNode:{x:2010,y:241,type:'node'},
        belts:[{left:1020,right:1292,y:352,speed:68},{left:1920,right:2176,y:365,speed:-63},{left:3140,right:3355,y:320,speed:79},
          {left:3696,right:3835,y:300,speed:43},{left:3990,right:4134,y:300,speed:-43}],
        powerBank:2,laneOrder:[0,2,1],strike:1.65,
        hint:'Use the lift or jump the gap. The baggage power bank adds a third energy slot.'}
    }),
    makeLevel({
      name:'The Switching Yard',subtitle:'Set the Points',boss:'Yard Interlock',width:4230,
      story:'Three charges are available now. Power the main switch and choose a route through the freight yard. A second Arc Link opens the raised service path. The ground route runs past a live switch.',
      ending:'The points lock into place. The only route to the stranded express leads through the river service tunnel.',
      platforms:[[0,420,390],[460,404,240],[765,382,240],[1070,352,250],[1380,372,245],[1700,370,270],[2040,355,240],[2350,345,245],[2660,359,240],[2965,326,235],[3260,316,230],[3560,312,155],[3780,300,450]],
      feeds:[[1140,352],[2180,355],[3375,316],[4140,300]],
      hazards:[{x:1490,y:372,w:52,type:'wire',period:4.7,offset:1.4},{x:1780,y:370,w:90,type:'vent',period:4.8,offset:2.6},{x:2470,y:345,w:58,type:'wire',period:4.3,offset:.8},{x:3040,y:326,w:68,type:'wire',period:4.5,offset:2}],
      enemies:[{id:'yard-watch',x:2750,y:308,hp:2,type:'drone'}],
      station:{art:[.002,.247],atlas:'railway',style:'yard',music:'district5',finish:'The yard is routed.',
        pads:[{x:932,y:382},{x:1550,y:372}],gates:[[1200,264],[1780,159]],optionalGates:[1],
        lifts:[{x:1630,w:66,low:375,high:255,gate:1,period:4.6}],
        branches:[[1698,247,178],[1890,275,83]],branchNode:{x:1908,y:245,type:'node'},
        laneOrder:[2,1,0],strike:1.7,
        hint:'Use the side relay for the raised bypass, or time the steam on the ground route.'}
    }),
    makeLevel({
      name:'Under-River Line',subtitle:'Through the Flood Doors',boss:'Flood Controller',width:4500,
      story:'The service track is gone where the river broke through. Keep two charges to teleport across the breach. At the flood receiver, raise Shield just before its pulse to unlock the next feeder.',
      ending:'The flood doors hold. The receiver sends a steady green signal to the express beyond the tunnel.',
      platforms:[[0,420,380],[445,405,235],[745,378,230],[1045,360,260],[1380,374,290],[1910,374,300],[2280,350,230],[2580,330,240],[2890,350,240],[3195,325,230],[3490,312,225],[3780,313,205],[4050,300,450]],
      feeds:[[1150,360],[2435,350],[3585,312],[4400,300]],
      hazards:[{x:864,y:378,w:48,type:'vent',period:4.5,offset:1.3},{x:1490,y:374,w:47,type:'wire',period:4.8,offset:2.5},{x:2680,y:330,w:65,type:'wire',period:4.4,offset:.8},{x:3270,y:325,w:63,type:'wire',period:4.6,offset:2}],
      shieldReceiver:{x:2130,y:374,relay:2},enemies:[],
      station:{art:[.252,.497],atlas:'railway',style:'tunnel',music:'district7',finish:'The flood doors are sealed.',
        pads:[{x:2765,y:330}],gates:[[2920,262]],blink:{x:1605,y:374},
        supplies:[{x:1617,y:344},{x:2153,y:344}],laneOrder:[0,2,1],strike:1.65,
        hint:'The flooded gap needs Teleport. Raise Shield at the receiver just before the pulse.'}
    }),
    makeLevel({
      name:'The Stranded Express',subtitle:'Wake the Passenger Cars',boss:'Express Startup',width:4040,
      story:'The passengers are still aboard. Cross the stationary coaches and restore their service feeders. In the cab, link the brakes, passenger doors and traction relays in the displayed order.',
      ending:'Light returns to the passenger cars. The driver answers over the intercom. “Meridian, we’re ready. All we need is an eastbound signal.”',
      platforms:[[0,420,375],[440,404,225],[735,382,265],[1065,360,255],[1390,380,235],[1700,348,240],[2005,364,235],[2305,332,240],[2615,353,215],[2895,325,230],[3190,315,140],[3390,312,135],[3590,300,450]],
      feeds:[[1140,360],[2360,332],[3260,315],[3960,300]],
      hazards:[{x:1820,y:348,w:48,type:'wire',period:5.2,offset:.6},{x:2690,y:353,w:40,type:'vent',period:4.7,offset:2}],
      enemies:[],
      station:{art:[.502,.747],atlas:'railway',style:'express',music:'district4',finish:'The express is ready.',
        pads:[{x:948,y:382},{x:2180,y:364}],gates:[[1185,272],[2420,244]],
        sequence:[3700,3910,3805],sequenceTime:10,sequenceName:'EXPRESS STARTUP',
        sequenceLines:['BRAKES RELEASED','PASSENGER DOORS SECURED','TRACTION POWER READY'],
        hint:'Restore the coach feeders. At the cab, follow the numbered startup relays.'}
    }),
    makeLevel({
      name:'Eastbound Signal',subtitle:'Clear the Line',boss:'Eastbound Interlock',width:4570,health:4,
      story:'The express is waiting. Bring the signal bridge online and face the interlock. Its last phase changes the safe lane between pulses. Arc Link the final safe relay, then fire Bolt at the exposed core.',
      ending:'The final signal turns cyan. The express rolls out of Meridian into the sunrise. Delivery complete.',
      platforms:[[0,420,390],[465,401,220],[750,376,240],[1055,348,245],[1365,365,225],[1650,331,235],[1950,349,245],[2260,325,235],[2560,345,235],[2860,319,215],[3140,339,225],[3430,316,235],[3730,313,150],[3935,312,130],[4120,300,450]],
      feeds:[[1180,348],[2640,345],[3535,316],[4470,300]],
      hazards:[{x:1120,y:348,w:55,type:'wire',period:4.2,offset:1.3},{x:1760,y:331,w:60,type:'wire',period:4.4,offset:2.1},{x:2370,y:325,w:66,type:'wire',period:4.2,offset:.4},{x:3220,y:339,w:51,type:'vent',period:4.6,offset:2.5}],
      enemies:[{id:'signal-watch',x:2910,y:272,hp:2,type:'drone'}],
      station:{art:[.752,.999],atlas:'railway',style:'signal',music:'district8',finish:'The express is eastbound.',
        pads:[{x:917,y:376},{x:2170,y:349}],gates:[[1230,260],[2580,257]],
        laneOrder:[0,2,1],strike:1.7,secondPulse:true,departure:true,
        hint:'Watch the next signal before spending energy. The interlock’s final phase fires twice.'}
    })
  ];
})();
