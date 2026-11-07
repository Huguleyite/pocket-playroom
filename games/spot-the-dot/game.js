'use strict';

const $ = selector => document.querySelector(selector);
const canvas = $('#board > canvas');
const ctx = canvas.getContext('2d');
const panel = $('#panel');
const scenes = [
  ['Canopy Mosaic', 'Find the tilted leaf', '#295847', ['#61a97e','#a0cb75','#ddc47e','#478968'], 'leaf'],
  ['Cell Culture', 'Find the tilted cell', '#3e275f', ['#ad8fdb','#6bc6ca','#e9a8d6','#7f81c9'], 'cell'],
  ['Deep Field', 'Find the tilted star', '#252958', ['#bbc8ff','#f7d48e','#a890db','#8198c5'], 'star'],
  ['Signal Board', 'Find the chip with the shifted pin', '#184b4c', ['#7ed6ae','#ffcb83','#90e5df','#5396ae'], 'chip'],
  ['Pigment Study', 'Find the tilted brushmark', '#604239', ['#e99e84','#d9c37f','#ac9fd0','#c37c7c'], 'paint'],
  ['Emoji Mosaic', 'Find the face with one raised eyebrow', '#604d24', ['#eab650','#ffdf78','#ffac8e','#b89ade'], 'face']
];
const cols = 84, rows = 60, pitch = 18;
const targetTilt = 0.15;
const stationNames = {
  leaf:'Canopy Field Kit', cell:'Culture Lab Bench', star:'Observatory Console',
  chip:'Circuit Repair Bench', paint:'Painter’s Worktable', face:'Sticker Press'
};
const worldW = cols * pitch, worldH = rows * pitch;
let state = 'MENU', scene, target, signature, tiles, tier, mistakes, cooldown;
let focus, camera, puzzle, notice, w, h, raf, audio, sonarBand;
let touch = null;
let muted = false, musicEnabled = true, musicTimer, musicBus, musicStep = 0;
const saveKey = 'pocket-playroom:spot-the-dot:v1';
function readSave() {
  try { return JSON.parse(localStorage.getItem(saveKey)) || {}; }
  catch { return {}; }
}
const saved = readSave();
muted = saved.muted === true;
musicEnabled = saved.music !== false;
const soundButton = $('#sound');
const musicButton = $('#music');
function audioLabels() {
  soundButton.textContent = muted ? 'Sound off' : 'Sound on';
  soundButton.setAttribute('aria-pressed',String(!muted));
  musicButton.textContent = musicEnabled ? 'Music on' : 'Music off';
  musicButton.setAttribute('aria-pressed',String(musicEnabled));
}
audioLabels();
musicButton.onclick = () => {
  musicEnabled = !musicEnabled;
  if (musicBus) musicBus.gain.setTargetAtTime(musicEnabled ? 1 : 0,audio.currentTime,.06);
  audioLabels();
  saveRun();
};

function note(frequency,duration,volume,delay = 0,type = 'sine',destination = audio?.destination,attack = .018) {
  if (muted || audio?.state !== 'running') return;
  const oscillator = audio.createOscillator(), envelope = audio.createGain();
  const start = audio.currentTime + delay;
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  envelope.gain.setValueAtTime(.0001,start);
  envelope.gain.exponentialRampToValueAtTime(volume,start+attack);
  envelope.gain.exponentialRampToValueAtTime(.0001,start+duration);
  oscillator.connect(envelope);
  envelope.connect(destination);
  oscillator.start(start);
  oscillator.stop(start+duration);
  oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
}
function wakeAudio() {
  if (muted) return;
  try {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
  } catch {}
}
function musicTick() {
  if (!musicEnabled || document.hidden || state === 'MENU' || state === 'LEVEL_COMPLETE') return;
  if (muted || audio?.state !== 'running') return;
  if (!musicBus) {
    musicBus = audio.createGain();
    musicBus.connect(audio.destination);
  }
  const chords = [
    [130.81,196,261.63,329.63],
    [110,164.81,261.63,329.63],
    [87.31,174.61,220,261.63],
    [98,196,246.94,293.66]
  ];
  for (const frequency of chords[musicStep]) {
    note(frequency,6.2,.012,0,'sine',musicBus,1.65);
  }
  musicStep = (musicStep+1)%chords.length;
}
function chime(clear = false) {
  (clear ? [392,523.25,659.25,783.99] : [392,493.88,659.25])
    .forEach((frequency,index) => note(frequency,.28,.046,index*.075,'triangle'));
}
document.addEventListener('click',event => {
  if (!event.target.closest('button') || event.target.closest('#sound')) return;
  wakeAudio();
  note(520,.085,.029,0,'triangle');
  if (!musicTimer) musicTimer = setInterval(musicTick,4500);
},true);
soundButton.onclick = () => {
  muted = !muted;
  audioLabels();
  saveRun();
  if (muted) audio?.suspend().catch(() => {});
  else wakeAudio();
};
let bounds = {x:0,y:0,width:worldW,height:worldH};
let dimmed, playtest, challenge;
const board = $('#board');
let boardBase;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const layer = document.createElement('canvas');
layer.width = worldW;
layer.height = worldH;
const art = layer.getContext('2d');

function glyph(c, x, y, color, isTarget = false) {
  c.save();
  c.translate(x, y);
  const shape = scene[4];
  if (isTarget && shape !== 'chip' && shape !== 'face') c.rotate(targetTilt);
  c.fillStyle = c.strokeStyle = color;
  c.beginPath();
  switch (shape) {
    case 'leaf':
      c.moveTo(-7,3); c.quadraticCurveTo(-7,-5,-.5,-5.4);
      c.quadraticCurveTo(3,-5.8,7,-7);
      c.quadraticCurveTo(7,5,-.5,5.8);
      c.quadraticCurveTo(-4.5,6,-7,3); break;
    case 'cell':
      c.moveTo(-7,1); c.bezierCurveTo(-7,-2,-5,-5,-2,-4.8);
      c.bezierCurveTo(2,-7,6,-4,7,-.5);
      c.bezierCurveTo(9,2,5,5.5,1,5.1);
      c.bezierCurveTo(-3,6.8,-7,4,-7,1); break;
    case 'star':
      c.moveTo(0,-7.5); c.lineTo(2.5,-3.4); c.lineTo(7.4,-2.1); c.lineTo(4,1.5);
      c.lineTo(4.7,6.8); c.lineTo(0,4.5); c.lineTo(-4.7,6.8);
      c.lineTo(-4,1.5); c.lineTo(-7.4,-2.1); c.lineTo(-2.5,-3.4); break;
    case 'chip':
      c.rect(-5,-4,10,8);
      for (const pin of [-4,0,4]) {
        c.rect(pin-1+(isTarget && pin === 0 ? 1.5 : 0),-6,2,2);
        c.rect(pin-1,4,2,2);
      }
      break;
    case 'face':
      c.arc(0,0,7,0,Math.PI*2); break;
    case 'paint':
      c.moveTo(-7,2); c.quadraticCurveTo(-5,-5,1,-4.8);
      c.quadraticCurveTo(4,-5.4,7,-6.4);
      c.lineTo(5,-2.3); c.lineTo(7,-2.9);
      c.quadraticCurveTo(5,5.3,-1,5.5);
      c.quadraticCurveTo(-5,6,-7,2); break;
  }
  c.fill();
  c.fillStyle = '#10202c';
  if (shape === 'face') {
    c.strokeStyle = c.fillStyle;
    c.lineWidth = 1.05;
    c.lineCap = 'round';
    c.fillRect(-3.2,-1,1.3,1.6);
    c.fillRect(1.9,-1,1.3,1.6);
    c.beginPath();
    c.moveTo(-3.8,isTarget ? -3.65 : -2.65);
    c.lineTo(-1.4,-2.65);
    c.moveTo(1.4,-2.65); c.lineTo(3.8,-2.65);
    c.moveTo(-2.35,2.15); c.quadraticCurveTo(0,4.4,2.35,2.15);
    c.stroke();
  } else {
    characterFace(c,shape);
  }
  c.restore();
}

function characterFace(c,shape) {
  c.strokeStyle = c.fillStyle;
  c.lineWidth = 1;
  c.lineCap = 'round';
  c.beginPath();
  switch (shape) {
    case 'leaf':
      // A wink and a crooked grin.
      c.moveTo(-4,-.6); c.quadraticCurveTo(-3,-2,-1.9,-.75);
      c.moveTo(-2,2); c.quadraticCurveTo(.7,3.9,2.6,1.35);
      c.fillRect(1.6,-1.8,1.3,1.9);
      break;
    case 'cell':
      // Uneven eyes and a surprised little mouth.
      c.fillRect(-3.6,-1.65,1.55,2);
      c.fillRect(1.75,-2.25,1.8,2.45);
      c.ellipse(.3,2.35,1.05,1.2,0,0,Math.PI*2);
      break;
    case 'star':
      // Squinting eyes above a laughing mouth.
      c.moveTo(-3.2,-.7); c.quadraticCurveTo(-2.4,-1.8,-1.4,-.7);
      c.moveTo(1.3,-.7); c.quadraticCurveTo(2.2,-1.8,3.1,-.7);
      c.moveTo(-1.8,1); c.quadraticCurveTo(0,4.2,1.8,1); c.closePath();
      break;
    case 'chip':
      // A deadpan face leaves the top pins clear.
      c.fillRect(-3,-1.45,1.55,1.2);
      c.fillRect(1.5,-1.45,1.55,1.2);
      c.moveTo(-1.25,1.7); c.lineTo(1.55,1.45);
      break;
    case 'paint':
      // A sideways glance and a lopsided smile.
      c.fillRect(-2.8,-1.45,1.35,1.95);
      c.fillRect(1.1,-1.9,1.4,1.95);
      c.moveTo(-2,2.2); c.quadraticCurveTo(.2,3.25,2.25,1.15);
      break;
  }
  c.stroke();
}

function drawMark(context,col,row) {
  const index = row*cols+col;
  const color = tier && dimmed.has(index) ? '#34424b' : scene[3][tiles[index]];
  glyph(context,(col+.5)*pitch,(row+.5)*pitch,color,index === target);
}

function rebuild() {
  art.fillStyle = scene[4] === 'leaf' ? '#0d291d' : boardBase;
  art.fillRect(0,0,worldW,worldH);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) drawMark(art,col,row);
  }
}

function saveRun() {
  const run = scene && state !== 'LEVEL_COMPLETE' ? {
    index:scenes.indexOf(scene), tiles, target, dimmed:[...dimmed], tier,
    mistakes, bounds, focus, camera, challenge, inPuzzle:state === 'ASSIST_PUZZLE'
  } : scene ? null : saved.run;
  try { localStorage.setItem(saveKey,JSON.stringify({run,muted,music:musicEnabled})); }
  catch {}
}
window.addEventListener('pagehide',saveRun);
document.addEventListener('visibilitychange',() => { if (document.hidden) saveRun(); });

function start(index,run) {
  scene = scenes[index];
  challenge = run?.challenge ?? {};
  board.dataset.scene = scene[4];
  $('#scene-stage').dataset.scene = scene[4];
  panel.dataset.scene = scene[4];
  $('#puzzle-station').textContent = stationNames[scene[4]];
  boardBase = getComputedStyle(board).getPropertyValue('--board-base').trim() || '#0c1722';
  playtest = index === 0 && !run ? {
    started:performance.now(), firstPuzzle:null, solves:[], lensUsed:false, quadrantAt:null
  } : null;
  tier = run?.tier ?? 0;
  mistakes = run?.mistakes ?? 0;
  cooldown = 0;
  bounds = run?.bounds ?? {x:0,y:0,width:worldW,height:worldH};
  board.classList.toggle('frozen',tier >= 2);
  focus = run?.focus ?? {x:worldW/2,y:worldH/2};
  camera = run?.camera ?? {...focus};
  sonarBand = null;
  tiles = run?.tiles ?? Array.from({length:cols*rows}, (_, i) => {
    const x = (i%cols - cols/2)/cols, y = (Math.floor(i/cols)-rows/2)/rows;
    const pick = Math.floor(Math.random()*4);
    if (scene[4] === 'face') {
      if (Math.random() < .22) return pick;
      const disk = (x/.36)**2+(y/.44)**2 < 1;
      const eye = ((Math.abs(x)-.115)/.053)**2+((y+.09)/.079)**2 < 1;
      const smile = Math.abs(y-(.23-3.2*x*x)) < .033 && Math.abs(x) < .21;
      return disk ? eye || smile ? 0 : 1 : 3;
    }
    if (index !== 0 || Math.random() < .24) return pick;
    // Two ears, a head and an offset trunk form the elephant silhouette.
    const ear = ((Math.abs(x)-.17)/.15)**2 + ((y+.08)/.27)**2 < 1;
    const head = (x/.16)**2 + ((y+.06)/.25)**2 < 1;
    const trunk = ((x-.08)/.055)**2 + ((y-.24)/.22)**2 < 1;
    if ((Math.abs(Math.abs(x)-.065)<.025) && Math.abs(y+.06)<.025) return 1;
    return head || trunk ? 2 : ear ? 1 : 3;
  });
  target = run?.target ?? Math.floor(Math.random()*tiles.length);
  signature = tiles[target];
  const distractors = tiles.flatMap((color,index) => color === signature ? [] : [index]);
  // Fade up to 70% of the board, exclusively from outside the target hue.
  for (let i = distractors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [distractors[i],distractors[j]] = [distractors[j],distractors[i]];
  }
  dimmed = new Set(run?.dimmed ?? distractors.slice(0,Math.floor(tiles.length*.7)));
  document.body.style.setProperty('--ambient',scene[2]);
  $('#clue').textContent = scene[1];
  const ref = $('#reference canvas').getContext('2d');
  ref.clearRect(0,0,30,30);
  ref.save(); ref.scale(1.5,1.5); glyph(ref,10,10,scene[3][signature],true); ref.restore();
  rebuild();
  resume(run ? 'Run resumed. Match the sample.' : 'Drag to scan. Match the sample.');
  if (run?.inPuzzle) workbench();
}

function scale() {
  const fit = Math.min(w/bounds.width,h/bounds.height);
  return tier >= 3 ? fit : Math.max(.38,Math.min(1,fit));
}
function origin() {
  const s = scale();
  return {x:w/2-camera.x*s,y:h/2-camera.y*s,s};
}
function centerCamera(x,y) {
  const s = scale();
  const halfW = Math.min(bounds.width/2,w/2/s);
  const halfH = Math.min(bounds.height/2,h/2/s);
  camera.x = clamp(x,bounds.x+halfW,bounds.x+bounds.width-halfW);
  camera.y = clamp(y,bounds.y+halfH,bounds.y+bounds.height-halfH);
}
function drawBoard(x,y,s) {
  const {x:left,y:top,width,height} = bounds;
  ctx.drawImage(layer,left,top,width,height,x+left*s,y+top*s,width*s,height*s);
}
function draw() {
  raf = 0;
  if (!scene || !w || !h) return;
  const {x,y,s} = origin();
  ctx.fillStyle = boardBase;
  ctx.fillRect(0,0,w,h);
  drawBoard(x,y,s);
  const lensBoost = tier >= 2 ? 1.2 : 1;
  const r = Math.min(72*lensBoost,w*.22*lensBoost,h*.34*lensBoost);
  const zoom = 2.45*lensBoost;
  const px = clamp(x+focus.x*s,r,w-r), py = clamp(y+focus.y*s,r,h-r);
  ctx.save();
  ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.clip();
  ctx.fillStyle = scene[4] === 'leaf' ? '#0d291d' : boardBase; ctx.fillRect(px-r,py-r,r*2,r*2);
  ctx.translate(px,py); ctx.scale(zoom,zoom); ctx.translate(-focus.x,-focus.y);
  const extent = r/zoom;
  const firstCol = Math.max(bounds.x/pitch,Math.floor((focus.x-extent)/pitch));
  const lastCol = Math.min((bounds.x+bounds.width)/pitch,Math.ceil((focus.x+extent)/pitch));
  const firstRow = Math.max(bounds.y/pitch,Math.floor((focus.y-extent)/pitch));
  const lastRow = Math.min((bounds.y+bounds.height)/pitch,Math.ceil((focus.y+extent)/pitch));
  for (let row = firstRow; row < lastRow; row++) {
    for (let col = firstCol; col < lastCol; col++) drawMark(ctx,col,row);
  }
  const now = performance.now();
  ctx.restore();
  ctx.strokeStyle = '#e2fff1'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2);
  ctx.moveTo(px-7,py); ctx.lineTo(px+7,py);
  ctx.moveTo(px,py-7); ctx.lineTo(px,py+7); ctx.stroke();
  if (now < cooldown) {
    ctx.fillStyle = '#c0bfd446'; ctx.fillRect(0,0,w,h);
  } else if (notice === 'Miss. Lens cooling down…') {
    setStatus('Lens ready. Keep scanning.');
  }
  if (state === 'SEARCHING' && now < cooldown) render();
}
function render() { if (!raf) raf = requestAnimationFrame(draw); }
new ResizeObserver(() => {
  const rect = canvas.getBoundingClientRect();
  w = rect.width; h = rect.height;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  if (camera) centerCamera(camera.x,camera.y);
  render();
}).observe(canvas);

function setStatus(message) {
  notice = message;
  $('#status').textContent = message;
  $('#assist').textContent = tier < 4 ? 'Solve for ' + toolNames[tier] : 'Puzzle rewards';
}
function show(next,title,description,actions) {
  state = next;
  panel.classList.toggle('puzzle-panel',next === 'ASSIST_PUZZLE');
  $('#panel-label').textContent = {
    MENU:'FIELD SELECT', ASSIST_PUZZLE:'SOLVE & REVEAL', LEVEL_COMPLETE:'FIELD REPORT'
  }[next];
  $('#title').textContent = title;
  $('#description').textContent = description;
  $('#choices').className = '';
  $('#choices').replaceChildren(...actions.map(([label,action]) => {
    const button = document.createElement('button');
    button.textContent = label; button.onclick = action;
    return button;
  }));
  if (!panel.open) panel.showModal();
  $('#choices button')?.focus();
  saveRun();
}
function resume(message) {
  state = 'SEARCHING';
  if (panel.open) panel.close();
  setStatus(message);
  saveRun();
  canvas.focus({preventScroll:true});
  render();
}
function menu() {
  const actions = scenes.map(([name], index) => [name, () => start(index)]);
  const run = saved.run;
  if (!scene && Number.isInteger(run?.index) && scenes[run.index] &&
      run.tiles?.length === cols*rows && Number.isInteger(run.target) && run.target >= 0 && run.target < run.tiles.length) {
    actions.unshift(['Resume '+scenes[run.index][0],() => start(run.index,run)]);
  }
  if (scene && state === 'SEARCHING') actions.push(['Resume', () => resume('Keep scanning.')]);
  show('MENU','Choose a scene','Inspect 5,040 marks for the one that matches your scene’s clue. Drag or use arrow keys to move the lens. Tap FOUND IT! or press Space to submit.',actions);
}
function confirm() {
  if (state !== 'SEARCHING' || performance.now() < cooldown) return;
  const index = Math.floor(focus.y/pitch)*cols + Math.floor(focus.x/pitch);
  if (index === target) {
    const rank = !tier && !mistakes ? 'Master / Perfect' : tier ? 'Assisted clear' : 'Unassisted clear';
    window.roomComplete?.('spot-the-dot');
    chime(true);
    const finished = performance.now();
    const replayIndex = scenes.indexOf(scene);
    show('LEVEL_COMPLETE',rank,scene[0] + ' cleared. Puzzles solved: ' + tier + ' of 4. Misses: ' + mistakes,
      [['Choose scene',menu],['Replay',() => start(replayIndex)]]);
    if (playtest) showPlaytest(finished);
    saved.run = null;
    scene = null;
  } else {
    note(147,.2,.045,0,'triangle');
    mistakes++;
    cooldown = performance.now()+850;
    setStatus('Miss. Lens cooling down…'); render();
  }
}

function showPlaytest(finished) {
  const elapsed = (start,end) => Math.round((end-start)/1000) + 's';
  const {started,firstPuzzle,solves,lensUsed,quadrantAt} = playtest;
  const summary = document.createElement('details');
  const title = document.createElement('summary');
  title.textContent = 'Canopy playtest results';
  const results = document.createElement('ul');
  const entries = [
    'Time to clear: ' + elapsed(started,finished),
    'First Workbench visit: ' + (firstPuzzle === null ? 'Skipped' : elapsed(started,firstPuzzle)),
    'Rewards earned: ' + (solves.map(({reward,at}) => reward + ' at ' + elapsed(started,at)).join(', ') || 'None'),
    'Used the upgraded lens before solve 3: ' + (solves.length < 2 ? 'Upgrade locked' : lensUsed ? 'Yes' : 'No'),
    'Time from quadrant unlock to clear: ' + (quadrantAt === null ? 'Quadrant locked' : elapsed(quadrantAt,finished))
  ];
  for (const entry of entries) {
    const item = document.createElement('li');
    item.textContent = entry;
    results.append(item);
  }
  summary.append(title,results);
  $('#choices').append(summary);
}

const toolNames = ['Color Filter','Movement Freeze','Grid Reduction','Sonar Sweep'];
const back = ['Return to board',() => resume('Keep scanning.')];

function unlock() {
  const reward = toolNames[tier++];
  chime();
  if (playtest) {
    const at = performance.now();
    playtest.solves.push({reward,at});
    if (tier === 3) playtest.quadrantAt = at;
  }
  if (tier === 1) rebuild();
  if (tier === 2) board.classList.add('frozen');
  if (tier === 3) {
    const width = worldW/2, height = worldH/2;
    const x = target%cols >= cols/2 ? width : 0;
    const y = Math.floor(target/cols) >= rows/2 ? height : 0;
    bounds = {x,y,width,height};
    if (focus.x < x || focus.x >= x+width || focus.y < y || focus.y >= y+height) {
      focus = {x:x+width/2,y:y+height/2};
    }
    centerCamera(x+width/2,y+height/2);
  }
  resume(tier === 2 ? 'Motion frozen. Larger lens unlocked.' : reward + ' active.');
}

const codeWords = [
  'JUNGLE','ORCHID','CANOPY','PARROT','VIOLET','SPORES','CULTURE','VESSEL',
  'COMETS','NEBULA','QUASAR','METEOR','CIRCUIT','SIGNAL','SWITCH','MODULE',
  'CANVAS','GESSO','BRUSH','PALETTE','PIGMENT','STICKER','MISCHIEF','CONFETTI',
  'FRECKLE','PENCIL','LANTERN','COMPASS','POCKET','MOSAIC','PATTERN','CLUSTER'
];

function shuffled(items) {
  const result = [...items];
  for (let i = result.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [result[i],result[j]] = [result[j],result[i]];
  }
  return result;
}

const digits = [1,2,3,4];
const gridPeers = Array.from({length:16},(_,i) => {
  const row = Math.floor(i/4), col = i%4;
  return Array.from({length:16},(_,j) => j).filter(j => j !== i && (
    Math.floor(j/4) === row || j%4 === col ||
    (Math.floor(j/8) === Math.floor(row/2) && Math.floor(j%4/2) === Math.floor(col/2))
  ));
});

function solveGrid(cells,limit,randomize = false) {
  let solution, count = 0;
  function search() {
    let cell = -1, candidates = digits;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i]) continue;
      const options = digits.filter(n => gridPeers[i].every(peer => cells[peer] !== n));
      if (!options.length) return;
      if (cell < 0 || options.length < candidates.length) {
        cell = i;
        candidates = options;
      }
    }
    if (cell < 0) {
      solution ??= [...cells];
      count++;
      return;
    }
    for (const n of randomize ? shuffled(candidates) : candidates) {
      cells[cell] = n;
      search();
      cells[cell] = 0;
      if (count >= limit) break;
    }
  }
  search();
  return {solution,count};
}

function canSolveWithSingles(givens,solution) {
  const cells = [...givens];
  while (cells.includes(0)) {
    const next = cells.findIndex((value,i) => !value &&
      digits.filter(n => gridPeers[i].every(peer => cells[peer] !== n)).length === 1);
    if (next < 0) return false;
    cells[next] = solution[next];
  }
  return true;
}

function makeGrid() {
  const {solution} = solveGrid(Array(16).fill(0),1,true);
  const givens = [...solution];
  let blanks = 0;
  for (const cell of shuffled(givens.keys())) {
    givens[cell] = 0;
    if (canSolveWithSingles(givens,solution)) blanks++;
    else givens[cell] = solution[cell];
    if (blanks === 10) break;
  }
  return {solution,givens,entries:[...givens],selected:givens.indexOf(0)};
}

function sliderNeighbors(cell) {
  return [0,1,2,3,4,5].filter(i =>
    Math.abs(i%3-cell%3)+Math.abs(Math.floor(i/3)-Math.floor(cell/3)) === 1);
}

function makeSlider() {
  const goal = [1,2,3,4,5,0];
  const queue = [{tiles:goal,distance:0}];
  const seen = new Set([goal.join('')]);
  const options = [];
  for (const {tiles,distance} of queue) {
    if (distance >= 8) options.push(tiles);
    if (distance === 13) continue;
    const blank = tiles.indexOf(0);
    for (const cell of sliderNeighbors(blank)) {
      const next = [...tiles];
      [next[cell],next[blank]] = [next[blank],next[cell]];
      const key = next.join('');
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push({tiles:next,distance:distance+1});
    }
  }
  return {tiles:shuffled(options)[0],moves:0};
}

function makePipe() {
  function extend(route) {
    const cell = route.at(-1);
    if (cell%3 === 2 && route.length >= 6) return route;
    for (const next of shuffled([cell-3,cell+3,cell-1,cell+1])) {
      if (next < 0 || next > 8 || route.includes(next)) continue;
      if (Math.abs(next-cell) === 1 && Math.floor(next/3) !== Math.floor(cell/3)) continue;
      const result = extend([...route,next]);
      if (result) return result;
    }
  }
  const route = extend([shuffled([0,3,6])[0]]);
  return {route,rotations:route.map(() => shuffled([1,3])[0]),selected:0};
}

function workbench() {
  if (state !== 'SEARCHING') return;
  if (playtest) playtest.firstPuzzle ??= performance.now();
  switch (tier) {
    case 0:
      challenge.grid ??= makeGrid();
      patternGrid(challenge.grid);
      break;
    case 1:
      if (['cell','chip'].includes(scene[4])) {
        challenge.pipe ??= makePipe();
        pipeConnect(challenge.pipe.route,challenge.pipe.rotations,challenge.pipe.selected);
      } else {
        challenge.slider ??= makeSlider();
        slide(challenge.slider.tiles,challenge.slider.moves);
      }
      break;
    case 2:
      challenge.cipher ??= {word:shuffled(codeWords)[0],shift:shuffled([2,3,4,5])[0],input:''};
      cipher(challenge.cipher,challenge.cipher.input);
      break;
    case 3:
      puzzle = challenge.memory ??= Array.from({length:7}, () => Math.floor(Math.random()*4));
      if (challenge.recallStep != null) recall(challenge.recallStep);
      else showPattern();
      break;
    default:
      show('ASSIST_PUZZLE','Puzzle rewards','All four rewards are active. Inspect the remaining quadrant with your lens.',[back]);
  }
}

function patternGrid(grid,message = '',focusCell = false) {
  const {givens,entries,selected,solution} = grid;
  show('ASSIST_PUZZLE','1 · Complete the grid',
    'Place 1–4 once in each row, column and outlined box. Pick a blank cell, then choose a number.\n' +
    (message || entries.filter(n => !n).length + ' cells left. Complete the grid to unlock the Color Filter.'),
    [...digits.map(n => [String(n),() => {
      if (givens[selected]) return;
      entries[selected] = n;
      patternGrid(grid,'',true);
    }]),['Erase',() => {
      if (givens[selected]) return;
      entries[selected] = 0;
      patternGrid(grid,'',true);
    }],['Check grid',() => {
      if (entries.includes(0)) patternGrid(grid,'Fill every blank before checking.');
      else if (entries.every((n,i) => n === solution[i])) unlock();
      else patternGrid(grid,'Some numbers conflict. Check the rows, columns and boxes.');
    }],back]);
  const layout = document.createElement('div');
  layout.className = 'number-grid sudoku';
  entries.forEach((value,i) => {
    const cell = document.createElement(givens[i] ? 'span' : 'button');
    cell.textContent = value || '·';
    cell.classList.toggle('box-alt',(Math.floor(i/8)+Math.floor(i%4/2))%2 === 1);
    if (i === selected) cell.classList.add('active-cell');
    if (givens[i]) {
      cell.tabIndex = -1;
      cell.setAttribute('aria-label','Preset '+value+', row '+(Math.floor(i/4)+1)+', column '+(i%4+1));
    } else {
      cell.setAttribute('aria-label','Row '+(Math.floor(i/4)+1)+', column '+(i%4+1)+', '+(value || 'blank'));
      cell.setAttribute('aria-pressed',String(i === selected));
      cell.onclick = () => { grid.selected = i; patternGrid(grid,'',true); };
    }
    layout.append(cell);
  });
  const row = document.createElement('div');
  row.className = 'card-row';
  row.append(layout);
  $('#choices').prepend(row);
  const keys = document.createElement('div');
  keys.className = 'sudoku-keys';
  const choices = $('#choices');
  keys.append(...Array.from(choices.children).slice(1,5));
  row.after(keys);
  if (focusCell) layout.children[selected].focus();
}

function slide(tiles,moves) {
  challenge.slider = {tiles,moves};
  const blank = tiles.indexOf(0);
  show('ASSIST_PUZZLE','2 · Slide the tiles',
    'Slide tiles next to the gap. Make the top row 1 2 3 and the bottom row 4 5 □ to freeze the moving particles and upgrade the lens.\nMoves: ' + moves,[]);
  const grid = document.createElement('div');
  grid.className = 'slider';
  tiles.forEach((tile,i) => {
    const button = document.createElement('button');
    button.textContent = tile || '□';
    button.disabled = Math.abs(i%3-blank%3)+Math.abs(Math.floor(i/3)-Math.floor(blank/3)) !== 1;
    button.onclick = () => {
      const next = [...tiles];
      [next[i],next[blank]] = [next[blank],next[i]];
      if (next.join('') === '123450') unlock();
      else slide(next,moves+1);
    };
    grid.append(button);
  });
  const exit = document.createElement('button');
  exit.textContent = back[0];
  exit.onclick = back[1];
  $('#choices').append(grid,exit);
  grid.querySelector('button:enabled').focus();
}
function pipeConnect(route,rotations,selected) {
  challenge.pipe = {route,rotations,selected};
  const directions = [-3,1,3,-1];
  const names = ['north','east','south','west'];
  const glyphs = {3:'└',5:'│',6:'┌',9:'┘',10:'─',12:'┐'};
  const ports = route.map((cell,i) => [
    i === 0 ? 3 : directions.indexOf(route[i-1]-cell),
    i === route.length-1 ? 1 : directions.indexOf(route[i+1]-cell)
  ]);
  const turned = ports.map((pair,i) => pair.map(direction => (direction+rotations[i])%4));
  const aligned = turned.map((pair,i) => ports[i].every(direction => pair.includes(direction)));
  if (aligned.every(Boolean)) { unlock(); return; }

  show('ASSIST_PUZZLE','2 · Connect the pipes',
    'Tap a pipe to turn it clockwise. Join the inlet on the left to the outlet on the right to freeze the motion and upgrade the lens.',[back]);
  const grid = document.createElement('div');
  grid.className = 'pipe-grid';
  for (let cell = 0; cell < 9; cell++) {
    const index = route.indexOf(cell);
    if (index < 0) {
      const empty = document.createElement('span');
      empty.className = 'pipe-empty';
      grid.append(empty);
      continue;
    }
    const button = document.createElement('button');
    button.textContent = glyphs[(1 << turned[index][0]) | (1 << turned[index][1])];
    button.setAttribute('aria-label','Rotate pipe, row ' + (Math.floor(cell/3)+1) + ', column ' +
      (cell%3+1) + ', openings ' + turned[index].map(direction => names[direction]).join(' and '));
    if (index === 0) button.classList.add('pipe-inlet');
    if (index === route.length-1) button.classList.add('pipe-outlet');
    button.onclick = () => {
      const next = [...rotations];
      next[index] = (next[index]+1)%4;
      pipeConnect(route,next,index);
    };
    grid.append(button);
    if (index === selected) button.dataset.selected = 'true';
  }
  $('#choices').prepend(grid);
  grid.querySelector('[data-selected]').focus();
}
function cardStrip(values,label,lit = -1) {
  const strip = document.createElement('div');
  strip.className = 'card-strip';
  strip.setAttribute('role','group');
  strip.setAttribute('aria-label',label);
  values.forEach((value,index) => {
    const card = document.createElement('span');
    card.className = 'puzzle-card';
    card.textContent = value;
    if (index === lit) card.classList.add('lit');
    strip.append(card);
  });
  const row = document.createElement('div');
  row.className = 'card-row';
  row.append(strip);
  $('#choices').prepend(row);
}
function showPattern() {
  delete challenge.recallStep;
  show('ASSIST_PUZZLE','4 · Repeat the signal',
    'Read the cards from left to right. When you’re ready, enter the sequence to unlock Sonar Sweep.',
    [['Ready',() => recall(0)],back]);
  cardStrip(puzzle.map(n => n+1),'Sequence to memorize');
}
function recall(step) {
  challenge.recallStep = Math.min(step,puzzle.length-1);
  const keys = Array.from({length:4}, (_, key) => [String(key+1), () => {
    if (puzzle[step] !== key) {
      delete challenge.recallStep;
      note(147,.2,.045,0,'triangle');
      show('ASSIST_PUZZLE','Signal mismatch','Review the cards and try again.',[['Review',showPattern],back]);
      return;
    }
    note([330,415,494,587][key],.17,.038,0,'triangle');
    recall(step+1);
    if (step+1 === puzzle.length) {
      const accepted = $('#choices .lit');
      setTimeout(() => {
        if (state === 'ASSIST_PUZZLE' && $('#choices').contains(accepted)) unlock();
      },220);
    }
  }]);
  const complete = step === puzzle.length;
  show('ASSIST_PUZZLE','Repeat the signal',complete ? 'Signal matched.' : 'Matched ' + step + ' of ' + puzzle.length,
    complete ? [back] : [...keys,back]);
  cardStrip(puzzle.map((value,index) => index < step ? value+1 : '·'),'Your sequence',step-1);
  if (!complete) $('#choices').classList.add('signal-keys');
}
function cipherWheel(set,alphabet) {
  const wheel = document.createElement('div');
  wheel.className = 'cipher-wheel';
  const dial = document.createElement('div');
  dial.className = 'cipher-dial';
  dial.setAttribute('aria-hidden','true');
  const outer = document.createElement('div');
  outer.className = 'cipher-ring cipher-ring-outer';
  const inner = document.createElement('div');
  inner.className = 'cipher-ring cipher-ring-inner';
  for (const [i,letter] of [...alphabet].entries()) {
    const angle = i*360/alphabet.length;
    for (const ring of [outer,inner]) {
      const mark = document.createElement('span');
      mark.textContent = letter;
      mark.style.setProperty('--angle',angle+'deg');
      ring.append(mark);
    }
  }
  const readout = document.createElement('div');
  readout.className = 'cipher-readout';
  readout.setAttribute('aria-live','polite');
  set.turns ??= 0;
  function update() {
    outer.style.setProperty('--turn',set.turns*360/alphabet.length+'deg');
    const offset = ((-set.turns%26)+26)%26;
    readout.textContent = 'Outer '+alphabet[offset]+' aligns with inner A';
  }
  const controls = document.createElement('div');
  controls.className = 'cipher-wheel-controls';
  for (const [label,step] of [['↶',-1],['↷',1]]) {
    const button = document.createElement('button');
    button.textContent = label;
    button.setAttribute('aria-label',step < 0 ? 'Spin counterclockwise' : 'Spin clockwise');
    button.onclick = () => { set.turns += step; update(); };
    controls.append(button);
  }
  dial.append(outer,inner);
  wheel.append(dial,controls,readout);
  update();
  $('#choices').prepend(wheel);
}

function cipher(set,input,message = '') {
  const {word,shift} = set;
  set.input = input;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const coded = [...word].map(letter => alphabet[(alphabet.indexOf(letter)+shift)%26]);
  set.keys ??= [...new Set(word+shuffled(alphabet).slice(0,5).join(''))].sort();
  const keys = set.keys;
  const places = ['','','two','three','four','five'][shift];
  show('ASSIST_PUZZLE','3 · Decode the message',
    'Shift each letter back ' + places + (shift === 1 ? ' place.' : ' places.') + ' For example, ' + alphabet[shift] + ' becomes A. Spin the outer ring to line up that pair. Read the coded letters outside and their matches inside.' + (message ? '\n' + message : ''),
    [...keys.map(letter => [letter,() => {
      const next = input + letter;
      if (next === word) unlock();
      else if (next.length === word.length) cipher(set,'','Try again. Check the shift for each letter.');
      else cipher(set,next);
    }]),['Erase',() => cipher(set,input.slice(0,-1))],back]);
  cardStrip([...input.padEnd(word.length,'·')],'Decoded letters',input.length-1);
  cardStrip(coded,'Encrypted letters');
  cipherWheel(set,alphabet);
}
function move(x,y,follow) {
  const nextX = clamp(x,bounds.x,bounds.x+bounds.width-.01);
  const nextY = clamp(y,bounds.y,bounds.y+bounds.height-.01);
  if (playtest && tier === 2 && Math.hypot(nextX-focus.x,nextY-focus.y) >= 1) {
    playtest.lensUsed = true;
  }
  focus.x = nextX;
  focus.y = nextY;
  if (follow && tier < 3) centerCamera(focus.x,focus.y);
  if (tier === 4) {
    const distance = Math.hypot(focus.x-(target%cols+.5)*pitch,focus.y-(Math.floor(target/cols)+.5)*pitch);
    const band = distance < 90 ? 'Nearby' : 'Scanning';
    if (band !== sonarBand) {
      sonarBand = band;
      if (performance.now() >= cooldown) setStatus('Sonar · ' + band);
      if (band === 'Nearby' && touch) navigator.vibrate?.(35);
      if (band === 'Nearby') note(440,.12,.05);
    }
  }
  render();
}
function point(event) {
  const rect = canvas.getBoundingClientRect(), {x,y,s} = origin();
  return [(event.clientX-rect.left-x)/s,(event.clientY-rect.top-y)/s];
}
canvas.addEventListener('pointerdown', event => {
  if (state !== 'SEARCHING' || event.button !== 0 || touch) return;
  if (event.pointerType === 'mouse') { move(...point(event),false); confirm(); return; }
  touch = {id:event.pointerId,x:event.clientX,y:event.clientY};
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove', event => {
  if (state !== 'SEARCHING') return;
  if (touch?.id === event.pointerId) {
    const s = scale();
    move(focus.x+(event.clientX-touch.x)/s,focus.y+(event.clientY-touch.y)/s,true);
    touch.x = event.clientX; touch.y = event.clientY;
  } else if (!touch && event.pointerType === 'mouse') move(...point(event),false);
});
for (const type of ['pointerup','pointercancel','lostpointercapture']) {
  canvas.addEventListener(type,event => { if (touch?.id === event.pointerId) touch = null; });
}
canvas.addEventListener('wheel',event => {
  if (state !== 'SEARCHING') return;
  event.preventDefault();
  move(focus.x+event.deltaX/scale(),focus.y+event.deltaY/scale(),true);
},{passive:false});
canvas.addEventListener('keydown',event => {
  if (state !== 'SEARCHING') return;
  if (event.code === 'Space') { event.preventDefault(); if (!event.repeat) confirm(); return; }
  const arrows = {ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
  const direction = arrows[event.key];
  if (!direction) return;
  event.preventDefault();
  const step = pitch*(event.shiftKey ? 10 : 1);
  move((Math.floor(focus.x/pitch)+.5)*pitch+direction[0]*step,
    (Math.floor(focus.y/pitch)+.5)*pitch+direction[1]*step,true);
});
panel.addEventListener('keydown',event => {
  if (state !== 'ASSIST_PUZZLE' || event.ctrlKey || event.altKey || event.metaKey) return;
  if (event.code === 'Space') {
    event.preventDefault();
    if (!event.repeat) musicButton.click();
    return;
  }
  const sudoku = $('#choices .sudoku');
  if (sudoku && event.key === 'Enter') {
    event.preventDefault();
    if (!event.repeat) {
      [...$('#choices').children].find(button => button.textContent === 'Check grid')?.click();
    }
    return;
  }
  if (!sudoku && !$('#choices.signal-keys')) return;
  const direction = {KeyW:[0,-1],KeyA:[-1,0],KeyS:[0,1],KeyD:[1,0]}[event.code];
  if (sudoku && direction) {
    event.preventDefault();
    const {selected} = challenge.grid;
    const [dx,dy] = direction;
    const col = selected%4+dx, row = Math.floor(selected/4)+dy;
    if (col >= 0 && col < 4 && row >= 0 && row < 4) {
      challenge.grid.selected = row*4+col;
      patternGrid(challenge.grid,'',true);
    }
    return;
  }
  const digit = /^(?:Digit|Numpad)([1-6])$/.exec(event.code)?.[1];
  if (!digit || event.key !== digit) return;
  const key = [...$(sudoku ? '.sudoku-keys' : '#choices').children].find(button =>
    button.tagName === 'BUTTON' && button.textContent === digit);
  if (!key) return;
  event.preventDefault();
  if (!event.repeat) key.click();
});
panel.addEventListener('cancel',event => {
  event.preventDefault();
  if (state === 'ASSIST_PUZZLE' || (state === 'MENU' && scene && $('#choices').lastChild.textContent === 'Resume')) resume('Keep scanning.');
  else if (state === 'LEVEL_COMPLETE') menu();
});
$('#menu').onclick = menu;
$('#assist').onclick = workbench;
$('#found').onclick = confirm;
menu();

