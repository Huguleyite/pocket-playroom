const goal=(key,target,label)=>({key,target,label});
const make=(id,name,subtitle,rows,inventory,goals,story)=>({id,name,subtitle,n:rows.length,map:rows.join('').split(''),inventory:{fern:0,bridge:0,...inventory},goals,story});
export const levels=[
 make('courtyard','The quiet courtyard','01 / FIRST WATER',['##I##','.....','.....','=...=','##=##'],{channel:6,reeds:0,tree:0,flowers:6},[goal('wet',3,'Connect 3 flowing channels'),goal('flowers',4,'Bloom 4 flower beds')],'Behind an old bakery, a spring still runs. Give it somewhere to go.'),
 make('pond','The forgotten pond','02 / A CLEAR BEGINNING',['##I##','.....','..PP.','..PP.','=...='],{channel:8,reeds:4,tree:0,flowers:6},[goal('ponds',1,'Fill & clean the pond'),goal('reeds',2,'Grow 2 thriving reed beds'),goal('flowers',3,'Bloom 3 flower beds')],'The basin is still here beneath the dust. A little water will remember its shape.'),
 make('railway','The railway garden','03 / ROOM FOR SHADE',['##I###','......','......','==..==','......','==..=='],{channel:14,reeds:0,tree:4,flowers:9,fern:4},[goal('trees',2,'Grow 2 healthy trees'),goal('ferns',1,'Unfurl a fern in moist shade'),goal('flowers',3,'Keep 3 flower beds in sunlight')],'No trains stop here now. Make a place where something else might pause.'),
 make('walled','The walled garden','04 / THROUGH THE GATE',['###I##','#....#','...PP#','#..PP.','#....#','##==##'],{channel:11,reeds:4,tree:4,flowers:8,fern:4},[goal('ponds',1,'Fill & clean the pond'),goal('trees',2,'Grow 2 healthy trees'),goal('flowers',4,'Bloom 4 flower beds')],'Warm brick, a small gate, a pocket of possibility. Let the light find its way in.'),
 make('community','The common ground','05 / A LITTLE MORE ALIVE',['###I###','.......','..PP...','..PP...','.......','=..T..=','===.==='],{channel:18,reeds:5,tree:5,flowers:12,fern:5,bridge:3},[goal('ponds',1,'Fill & clean the pond'),goal('bridges',1,'Flow beneath a first bridge'),goal('flowers',5,'Bloom 5 flower beds')],'A place for everyone begins with a few small acts of care. Make this one your own.'),
 make('schoolyard','The old schoolyard','06 / UNDER THE CANOPY',['###I##','......','......','A....B','......','##==##'],{channel:14,reeds:0,tree:5,flowers:8,fern:7,bridge:4},[goal('ferns',3,'Unfurl 3 fern beds'),goal('trees',2,'Grow 2 healthy trees'),goal('access',1,'Open the gate-to-seat walk')],'Under the bell tower, find a place for cool green shade and muddy little boots.'),
 make('library','The library courtyard','07 / BETWEEN THE BANKS',['###I###','.......','.......','A.....B','.......','...=...','###=###'],{channel:17,reeds:0,tree:5,flowers:10,fern:7,bridge:5},[goal('bridges',2,'Flow beneath 2 bridges'),goal('access',1,'Open the gate-to-seat walk'),goal('flowers',5,'Bloom 5 flower beds')],'A quiet reading seat waits on the other bank. Bring water, and leave a way across.'),
 make('glasshouse','The sleeping glasshouse','08 / GREEN RETURNS',['###I###','.......','..PP...','..PP...','.......','A.....B','##===##'],{channel:18,reeds:5,tree:5,flowers:10,fern:8,bridge:5},[goal('ponds',1,'Fill & clean the pond'),goal('ferns',3,'Unfurl 3 fern beds'),goal('flowers',5,'Bloom 5 flower beds'),goal('access',1,'Keep the gate-to-seat walk open')],'Glass catches the light again. Let the old growing house fill with layers of green.'),
 make('millpond','The millpond walk','09 / WATER UNDER WOOD',['###I###','.......','.PP.PP.','.PP.PP.','.......','A.....B','##===##'],{channel:17,reeds:6,tree:5,flowers:9,fern:7,bridge:5},[goal('ponds',2,'Fill & clean both ponds'),goal('bridges',2,'Flow beneath 2 bridges'),goal('access',1,'Open the gate-to-seat walk')],'The wheel is still. The banks can be busy: two pools, little crossings, a place to linger.'),
 make('rooftop','The rooftop refuge','10 / A GARDEN ABOVE',['###I###','.......','..PP...','..PP...','.......','A.....B','=.....='],{channel:19,reeds:5,tree:6,flowers:12,fern:9,bridge:6},[goal('ponds',1,'Fill & clean the pond'),goal('ferns',4,'Unfurl 4 fern beds'),goal('flowers',6,'Bloom 6 flower beds'),goal('bridges',2,'Flow beneath 2 bridges'),goal('access',1,'Keep the gate-to-seat walk open')],'Above the chimney pots, make a soft landing for wings and a little room for yourself.')
];

const themes=['bakery','pond','railway','walled','community','school','library','glasshouse','mill','rooftop'];
levels.forEach((l,i)=>{l.theme=themes[i];l.chapter=i<5?'Hidden corners':'Places remembered';l.decorations={bench:3,pot:4,birdbath:2,lantern:4,stones:6};});

// Learning sequence: introduce one relationship at a time, then combine them.
const focus=[
 ['First water','Water + sunlight','Connect a waterway and bring four flower beds into bloom. Three blooms will also welcome butterflies.'],
 ['A living pond','Water + clean ponds','Fill the basin, then let two reed beds clear its water. Sunny banks can support flowers.'],
 ['Sun and shade','Trees + ferns','A healthy tree creates shade. A fern needs both that shade and moisture; flowers still need sunlight.'],
 ['Shared banks','Ponds + trees + flowers','Balance a clean pond, healthy trees and sunny flowers in a smaller enclosed space.'],
 ['A first crossing','Bridges + ponds','A bridge carries water like a channel, with a walkable deck above. Use one in a flowing waterway.'],
 ['Leave a way through','Shade + walking access','Grow a shaded fern garden while keeping a walk from gate to seat. Plants and open channels block walkers.'],
 ['Between the banks','Bridges + walking access','Keep two bridges flowing and leave a connected walk. Bare soil and dry bridges are also walkable.'],
 ['Layers of green','Clean water + shade + access','Balance pond care, moist shade and sunny flowers while keeping the walk open.'],
 ['Two living pools','Two ponds + crossings','Each pond needs its own two thriving reed beds. Connect both pools and preserve the crossings.'],
 ['Everything together','The final restoration','Bring clean water, ferns, sunny flowers and two flowing bridges together, with an open walk. All five goals must hold at once.']
];
levels.forEach((l,i)=>{[l.lesson,l.focus,l.guidance]=focus[i];});

levels.forEach(l=>l.goals.forEach(g=>{g.short={ponds:g.target===2?'2 clean ponds':'Clean pond',ferns:g.target+' fern beds',flowers:g.target+' flower beds',trees:g.target+' healthy trees',bridges:g.target+' flowing bridges',access:'Open walk',wet:g.target+' flowing channels'}[g.key]||g.label;}));
