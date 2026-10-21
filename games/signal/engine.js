/* Signal Flow — standalone classic script; API is available as SignalFlow.
 * Coordinates include the perimeter: only rows/columns 1..4 are playable.
 * Directions and rotation: 0=N, 1=E, 2=S, 3=W; clockwise quarter turns.
 * Tiles connect ports bidirectionally. A splitter sends an incoming ray out
 * every other connected port. Filters transmit only their exact named color.
 * Colors remain separate through intersections; they never mix.
 */
const SignalFlow = (() => {
  'use strict';
  const SIZE = 6;
  const COLORS = Object.freeze(['cyan', 'magenta', 'gold']);
  const DELTAS = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  const PORTS = { straight: [0, 2], corner: [0, 1], splitter: [0, 1, 3], filter: [0, 2] };
  let currentBoard = null;

  function dateSeed(date) {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new TypeError('Expected a date string in YYYY-MM-DD format.');
    }
    const parsed = new Date(`${date}T00:00:00.000Z`);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
      throw new RangeError('Invalid calendar date.');
    }
    // FNV-1a hashes the complete date into the 32-bit Mulberry32 seed.
    let hash = 2166136261;
    for (let i = 0; i < date.length; i++) hash = Math.imul(hash ^ date.charCodeAt(i), 16777619);
    return hash >>> 0;
  }

  function mulberry32(seed) {
    let state = seed >>> 0;
    return function random() {
      state = (state + 0x6D2B79F5) >>> 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const portsFor = tile => (PORTS[tile.type] || []).map(p => (p + tile.rotation) % 4);
  const inside = (r, c) => r >= 0 && c >= 0 && r < SIZE && c < SIZE;

  /** Pure trace: does not modify board. Segments use grid-cell center coordinates.
   * hitTargets contains {row,col,color,requiredColor,matched}; all arrivals are
   * retained, so wrong-color arrivals invalidate a target even when its correct color arrives.
   * A visited (cell, direction, color) state bounds even cyclic split networks.
   */
  function traceBeams(board) {
    const segments = [];
    const hitTargets = [];
    const visited = new Set();
    const hits = new Set();
    const queue = [];
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const tile = board.grid[row][col];
        if (tile.type === 'source') queue.push({ row, col, direction: tile.direction, color: tile.color });
      }
    }
    for (let index = 0; index < queue.length; index++) {
      const ray = queue[index];
      const key = `${ray.row},${ray.col},${ray.direction},${ray.color}`;
      if (visited.has(key)) continue;
      visited.add(key);
      const [dr, dc] = DELTAS[ray.direction];
      const row = ray.row + dr;
      const col = ray.col + dc;
      if (!inside(row, col)) continue;
      segments.push({ from: { row: ray.row, col: ray.col }, to: { row, col }, color: ray.color });
      const tile = board.grid[row][col];
      if (tile.type === 'target') {
        const hitKey = `${row},${col},${ray.color}`;
        if (!hits.has(hitKey)) {
          hits.add(hitKey);
          hitTargets.push({ row, col, color: ray.color, requiredColor: tile.color, matched: ray.color === tile.color });
        }
        continue;
      }
      const incoming = (ray.direction + 2) % 4;
      const ports = portsFor(tile);
      if (!ports.includes(incoming) || (tile.type === 'filter' && tile.color !== ray.color)) continue;
      for (const direction of ports) {
        if (direction !== incoming) queue.push({ row, col, direction, color: ray.color });
      }
    }
    return { segments, hitTargets };
  }

  function checkVictory(board = currentBoard) {
    if (!board) return false;
    const hits=traceBeams(board).hitTargets;
    const wrong=new Set(hits.filter(h=>!h.matched).map(h=>`${h.row},${h.col}`));
    const matched = new Set(hits.filter(h=>h.matched&&!wrong.has(`${h.row},${h.col}`)).map(h=>`${h.row},${h.col}`));
    let targets = 0;
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board.grid[row][col].type === 'target') {
          targets++;
          if (!matched.has(`${row},${col}`)) return false;
        }
      }
    }
    return targets > 0;
  }

  /** Experimental shared-bus circuit. Six mandatory filters protect targets;
   * every source must traverse the same branching network. */
  function generateBoard(date){
    const random=mulberry32(dateSeed(date)^0x53484152),integer=n=>Math.floor(random()*n);
    const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=integer(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
    const pos=i=>[1+Math.floor(i/4),1+i%4],id=(r,c)=>(r-1)*4+c-1;
    const neighbors=i=>{const [r,c]=pos(i);return DELTAS.map(([dr,dc],d)=>({r:r+dr,c:c+dc,d})).filter(p=>p.r>0&&p.r<5&&p.c>0&&p.c<5).map(p=>({i:id(p.r,p.c),d:p.d}));};
    const boundary=Array.from({length:16},(_,i)=>i).filter(i=>pos(i).some(v=>v===1||v===4));
    for(let attempt=0;attempt<30000;attempt++){
      const filterIds=new Set(shuffle(boundary).slice(0,6)),core=Array.from({length:16},(_,i)=>i).filter(i=>!filterIds.has(i));
      const attachments=[];let fail=false;
      for(const i of filterIds){const [r,c]=pos(i);const opts=neighbors(i).filter(n=>!filterIds.has(n.i)&&(()=>{const [dr,dc]=DELTAS[n.d];return r-dr===0||r-dr===5||c-dc===0||c-dc===5;})());if(!opts.length){fail=true;break;}const n=opts[integer(opts.length)];attachments.push({i,core:n.i,d:n.d});}
      if(fail)continue;
      const req=new Map(core.map(i=>[i,[]]));for(const a of attachments)req.get(a.core).push((a.d+2)%4);
      const seen=new Set();function grow(i){seen.add(i);for(const n of shuffle(neighbors(i).filter(n=>req.has(n.i)))){if(seen.has(n.i)||req.get(i).length>=3||req.get(n.i).length>=3)continue;req.get(i).push(n.d);req.get(n.i).push((n.d+2)%4);grow(n.i);}}grow(core[integer(core.length)]);if(seen.size!==10)continue;
      const sourceOptions=[];for(const i of core){const [r,c]=pos(i);for(let d=0;d<4;d++){const [dr,dc]=DELTAS[d];if((r+dr===0||r+dr===5||c+dc===0||c+dc===5)&&req.get(i).length<3)sourceOptions.push({i,d,r:r+dr,c:c+dc});}}
      const sources=[];for(const o of shuffle(sourceOptions)){if(req.get(o.i).length>=3)continue;req.get(o.i).push(o.d);sources.push(o);if(sources.length===3)break;}if(sources.length!==3)continue;
      const grid=Array.from({length:6},()=>Array.from({length:6},()=>({type:'wall',rotation:0,locked:true})));
      const colors=shuffle(COLORS);sources.forEach((o,j)=>{grid[o.r][o.c]={type:'source',direction:(o.d+2)%4,color:colors[j],rotation:0,locked:true};});
      shuffle(attachments).forEach((o,j)=>{const [r,c]=pos(o.i),[dr,dc]=DELTAS[o.d],color=colors[j%3];grid[r][c]={type:'filter',color,rotation:o.d%2,locked:false};grid[r-dr][c-dc]={type:'target',color,rotation:0,locked:true};});
      for(const [i,ports]of req){const [r,c]=pos(i);const type=ports.length===3?'splitter':ports.length===2&&(ports[0]+2)%4===ports[1]?'straight':'corner';const rots=[0,1,2,3].filter(rot=>ports.every(d=>PORTS[type].map(p=>(p+rot)%4).includes(d)));if(!rots.length){fail=true;break;}grid[r][c]={type,rotation:rots[integer(rots.length)],locked:false};}
      if(fail)continue;const board={date,size:6,generatorVersion:3,grid,solution:grid.map(r=>r.map(t=>t.rotation))};if(!checkVictory(board))continue;
      const trace=traceBeams(board),shared=new Map();for(const s of trace.segments){const k=s.from.row+','+s.from.col;if(!shared.has(k))shared.set(k,new Set());shared.get(k).add(s.color);}if([...shared.values()].filter(cs=>cs.size===3).length<5)continue;
      let changed=0,distance=0;for(let r=1;r<5;r++)for(let c=1;c<5;c++){const t=grid[r][c],solution=board.solution[r][c];t.rotation=(solution+1+integer(3))%4;const same=portsFor(t).sort().join()===PORTS[t.type].map(p=>(p+solution)%4).sort().join();if(!same)changed++;distance+=(solution-t.rotation+4)%((t.type==='straight'||t.type==='filter')?2:4);}
      if(changed<13||distance<24||checkVictory(board))continue;currentBoard=board;return board;
    }
    throw new Error('Unable to generate shared circuit');
  }

  /** Recalculate after a tap; caller renders the returned trace immediately.
   * Optional board argument supports independent instances without shared state.
   */
  function rotateTile(row, col, board = currentBoard) {
    if (!board) throw new Error('Call generateBoard(date) first or supply a board.');
    if (!Number.isInteger(row) || !Number.isInteger(col) || !inside(row, col)) throw new RangeError('Invalid grid coordinates.');
    const tile = board.grid[row][col];
    const rotated = row > 0 && col > 0 && row < SIZE - 1 && col < SIZE - 1 && !tile.locked && Boolean(PORTS[tile.type]);
    if (rotated) tile.rotation = (tile.rotation + 1) % 4;
    return { rotated, ...traceBeams(board), victory: checkVictory(board) };
  }

  return Object.freeze({ SIZE, COLORS, dateSeed, mulberry32, generateBoard, traceBeams, rotateTile, checkVictory });
})();

// Works with a normal <script src="engine.js"> and with Node's require().
if (typeof globalThis !== 'undefined') globalThis.SignalFlow = SignalFlow;
if (typeof module !== 'undefined' && module.exports) module.exports = SignalFlow;
