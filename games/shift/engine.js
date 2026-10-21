/** Shift & Lock rules engine. ES module; coordinates are zero-based. */
export const SIZE = 4;
const DELTA = { N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1] };
const OPPOSITE = { N: 'S', E: 'W', S: 'N', W: 'E' };
const SHAPES = [['N', 'S'], ['E', 'W'], ['N', 'E'], ['E', 'S'], ['S', 'W'], ['W', 'N']];

export function createPRNG(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
    throw new TypeError('Seed must be a valid YYYY-MM-DD date.');
  }
  // FNV-1a string hash followed by Mulberry32.
  let seed = 2166136261;
  for (const char of date) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  return function random() {
    seed = (seed + 0x6D2B79F5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function checkIndex(index) {
  if (!Number.isInteger(index) || index < 0 || index >= SIZE) throw new RangeError('Index must be 0–3.');
}

function validateGrid(grid) {
  const ids = new Set();
  if (!Array.isArray(grid) || grid.length !== SIZE || grid.some(row =>
    !Array.isArray(row) || row.length !== SIZE)) throw new TypeError('Expected a 4×4 grid.');
  for (const tile of grid.flat()) {
    if (!tile || typeof tile.id !== 'string' || ids.has(tile.id) ||
        !Array.isArray(tile.connections) || tile.connections.length !== 2 ||
        new Set(tile.connections).size !== 2 || tile.connections.some(side => !DELTA[side])) {
      throw new TypeError('Tiles require unique string IDs and two distinct N/E/S/W connections.');
    }
    ids.add(tile.id);
  }
}

/** A reversible scramble of a route with four required turns and offset terminals. */
export function createDailyPuzzle(date) {
  const random = createPRNG(date);
  const flip = random() < 0.5;
  const route = [[0,0,['W','E']],[0,1,['W','E']],[0,2,['W','S']],
    [1,2,['N','S']],[2,2,['N','W']],[2,1,['E','S']],
    [3,1,['N','E']],[3,2,['W','E']],[3,3,['W','E']]];
  const grid = Array.from({length:4},(_,r)=>Array.from({length:4},(_,c)=>({
    id:r+':'+c,connections:[...SHAPES[Math.floor(random()*SHAPES.length)]],isLocked:false
  })));
  for (const [r,c,sides] of route) grid[flip?3-r:r][c].connections=sides.map(side=>flip?(side==='N'?'S':side==='S'?'N':side):side);
  const terminals=[{pair:'A',side:'W',index:flip?3:0},{pair:'A',side:'E',index:flip?0:3}];
  const scramble=[];
  function shift(axis,index,direction) {
    const line=Array.from({length:4},(_,i)=>axis==='row'?grid[index][i]:grid[i][index]);
    for(let i=0;i<4;i++){const tile=line[(i-direction+4)%4];if(axis==='row')grid[index][i]=tile;else grid[i][index]=tile;}
    scramble.push([axis,index,direction]);
  }
  for(let i=0;i<24;i++)shift(random()<0.5?'row':'col',Math.floor(random()*4),random()<0.5?-1:1);
  // Never ship an already-complete daily board.
  if(createEngine(date,{grid,terminals}).getState().isSolved) {
    // Moving the entry straight into a corner orientation breaks the route,
    // while retaining its type; include the rotation in the inverse witness.
    const tile=grid[terminals[0].index][0];
    const cw={N:'E',E:'S',S:'W',W:'N'};
    let turns=0;
    while(tile.connections.includes('W')){tile.connections=tile.connections.map(side=>cw[side]);turns++;}
    for(let i=0;i<turns;i++)scramble.push(['rotate',terminals[0].index,0]);
  }
  const solution=[];
  for(const [axis,index,direction] of scramble.reverse()) {
    if(axis==='rotate')for(let i=0;i<3;i++)solution.push(['rotate',index,direction]);
    else solution.push([axis,index,-direction]);
  }
  return {grid,terminals,solution};
}

/** Terminal: { pair: string, side: 'N'|'E'|'S'|'W', index: 0..3 }.
 * N/S indices are columns; E/W indices are rows. Terminals stay fixed.
 */
export function createEngine(date, options = {}) {
  const random = createPRNG(date);
  let grid;
  const generated = options.grid ? null : createDailyPuzzle(date);
  const terminals = (options.terminals ?? generated?.terminals ?? [
    { pair: 'A', side: 'W', index: 0 }, { pair: 'A', side: 'E', index: 0 }
  ]).map(terminal => ({ ...terminal }));
  const slots = new Set();
  const counts = new Map();
  if (!terminals.length) throw new TypeError('At least one terminal pair is required.');
  for (const terminal of terminals) {
    checkIndex(terminal.index);
    const slot = `${terminal.side}:${terminal.index}`;
    if (!DELTA[terminal.side] || typeof terminal.pair !== 'string' || !terminal.pair || slots.has(slot)) {
      throw new TypeError('Invalid or duplicate terminal.');
    }
    slots.add(slot);
    counts.set(terminal.pair, (counts.get(terminal.pair) ?? 0) + 1);
  }
  if ([...counts.values()].some(count => count !== 2)) throw new TypeError('Each pair needs exactly two terminals.');
  if (options.grid) {
    validateGrid(options.grid);
    grid = options.grid.map(row => row.map(tile => ({ ...tile, connections: [...tile.connections], isLocked: false })));
  } else {
    if (options.terminals) throw new TypeError('Custom terminals require a custom grid.');
    grid = generated.grid.map(row => row.map(tile => ({...tile, connections:[...tile.connections]})));
  }
  let moves = 0;
  let paths = [];
  let lockedRows = new Set();
  let lockedCols = new Set();

  function rotate(axis, index, direction) {
    const line = Array.from({ length: SIZE }, (_, i) => axis === 'row' ? grid[index][i] : grid[i][index]);
    for (let i = 0; i < SIZE; i++) {
      const tile = line[(i - direction + SIZE) % SIZE];
      if (axis === 'row') grid[index][i] = tile;
      else grid[i][index] = tile;
    }
  }

  function cellFor(terminal) {
    return terminal.side === 'N' ? [0, terminal.index] : terminal.side === 'S' ? [3, terminal.index] :
      terminal.side === 'W' ? [terminal.index, 0] : [terminal.index, 3];
  }

  function trace(start) {
    let [row, col] = cellFor(start);
    let entry = start.side;
    const cells = [];
    const visited = new Set();
    while (true) {
      const key = `${row}:${col}`;
      const tile = grid[row][col];
      if (visited.has(key) || !tile.connections.includes(entry)) return null;
      visited.add(key);
      cells.push([row, col]);
      const exit = tile.connections.find(side => side !== entry);
      const [dr, dc] = DELTA[exit];
      const nextRow = row + dr, nextCol = col + dc;
      if (nextRow < 0 || nextRow >= SIZE || nextCol < 0 || nextCol >= SIZE) {
        const index = exit === 'N' || exit === 'S' ? col : row;
        const end = terminals.find(t => t.side === exit && t.index === index);
        return end && end !== start && end.pair === start.pair ? { pair: start.pair, cells } : null;
      }
      row = nextRow;
      col = nextCol;
      entry = OPPOSITE[exit];
    }
  }

  function checkConnections() {
    paths = [];
    const found = new Set();
    lockedRows = new Set();
    lockedCols = new Set();
    for (const tile of grid.flat()) tile.isLocked = false;
    for (const terminal of terminals) {
      if (found.has(terminal.pair)) continue;
      const path = trace(terminal);
      if (!path) continue;
      found.add(path.pair);
      paths.push(path);
      for (const [row, col] of path.cells) {
        grid[row][col].isLocked = true;
        lockedRows.add(row);
        lockedCols.add(col);
      }
    }
    return getState();
  }

  function shift(axis, index, direction) {
    checkIndex(index);
    // +1 means right/down; -1 means left/up. Tile orientation never changes.
    if (direction !== 1 && direction !== -1) throw new RangeError('Direction must be +1 or -1.');
    if ((axis === 'row' ? lockedRows : lockedCols).has(index)) return { moved: false, reason: 'locked', state: getState() };
    rotate(axis, index, direction);
    moves++;
    return { moved: true, state: checkConnections() };
  }

  function getState() {
    // Defensive snapshots keep callers from bypassing movement and lock rules.
    return {
      date, moves,
      grid: grid.map(row => row.map(tile => ({ ...tile, connections: [...tile.connections] }))),
      terminals: terminals.map(t => ({ ...t })),
      paths: paths.map(path => ({ pair: path.pair, cells: path.cells.map(cell => [...cell]) })),
      lockedRows: [...lockedRows].sort(), lockedCols: [...lockedCols].sort(),
      isSolved: paths.length === counts.size
    };
  }

  checkConnections();
  return {
    getState, checkConnections,
    rotateTile(row, col) {
      checkIndex(row); checkIndex(col);
      if (grid[row][col].isLocked) return { moved: false, reason: 'locked', state: getState() };
      const clockwise = { N: 'E', E: 'S', S: 'W', W: 'N' };
      grid[row][col].connections = grid[row][col].connections.map(side => clockwise[side]);
      moves++;
      return { moved: true, state: checkConnections() };
    },
    shiftRow: (index, direction) => shift('row', index, direction),
    shiftCol: (index, direction) => shift('col', index, direction)
  };
}

// Connections stop at board edges; only tile movement wraps. Unlock actions are
// intentionally left to a later rule specification. Scrambles are deterministic,
// and include a reversible solution witness. They are not difficulty-rated.
