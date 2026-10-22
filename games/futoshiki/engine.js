/** Static Futoshiki engine. Import using <script type="module">.
 * Boards are square arrays; 0 means empty. Coordinates are zero-based.
 * Inequality: { row, col, direction: 'right' | 'down', sign: '<' | '>' }.
 * The sign compares (row, col) with its right/down neighbor.
 */

export function mulberry32(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function dateToSeed(dateString) {
  if (typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new TypeError('Expected a date string in YYYY-MM-DD format.');
  }
  const date = new Date(`${dateString}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== dateString) {
    throw new RangeError('Invalid calendar date.');
  }
  // FNV-1a hashes the complete date without locale or timezone dependence.
  let hash = 2166136261;
  for (let i = 0; i < dateString.length; i++) {
    hash = Math.imul(hash ^ dateString.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}

function shuffled(items, random) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function validShape(board) {
  return Array.isArray(board) && board.length >= 2 && board.every(row =>
    Array.isArray(row) && row.length === board.length && row.every(value =>
      Number.isInteger(value) && value >= 0 && value <= board.length));
}

function validInequalities(inequalities, size) {
  return Array.isArray(inequalities) && inequalities.every(rule => {
    if (!rule || !Number.isInteger(rule.row) || !Number.isInteger(rule.col)) return false;
    const { row, col, direction, sign } = rule;
    return row >= 0 && row < size && col >= 0 && col < size &&
      (sign === '<' || sign === '>') &&
      ((direction === 'right' && col < size - 1) ||
       (direction === 'down' && row < size - 1));
  });
}

/** Returns whether all filled cells obey the rules. Empty cells are allowed.
 * Malformed input returns false. For victory, also call isBoardComplete().
 */
export function validateBoard(board, inequalities = []) {
  if (!validShape(board) || !validInequalities(inequalities, board.length)) return false;
  const size = board.length;
  for (let i = 0; i < size; i++) {
    const row = new Set();
    const column = new Set();
    for (let j = 0; j < size; j++) {
      const a = board[i][j];
      const b = board[j][i];
      if ((a && row.has(a)) || (b && column.has(b))) return false;
      if (a) row.add(a);
      if (b) column.add(b);
    }
  }
  return inequalities.every(({ row, col, direction, sign }) => {
    const a = board[row][col];
    const b = board[row + (direction === 'down' ? 1 : 0)]
      [col + (direction === 'right' ? 1 : 0)];
    return !a || !b || (sign === '<' ? a < b : a > b);
  });
}

export function isBoardComplete(board, inequalities = []) {
  return validateBoard(board, inequalities) && board.every(row => row.every(value => value !== 0));
}

// Count up to two solutions, choosing the most constrained empty cell first.
function countSolutions(board, inequalities) {
  let best = null;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      if (board[row][col]) continue;
      const candidates = [];
      for (let value = 1; value <= board.length; value++) {
        board[row][col] = value;
        if (validateBoard(board, inequalities)) candidates.push(value);
      }
      board[row][col] = 0;
      if (!candidates.length) return 0;
      if (!best || candidates.length < best.candidates.length) best = { row, col, candidates };
    }
  }
  if (!best) return 1;
  let count = 0;
  for (const value of best.candidates) {
    board[best.row][best.col] = value;
    count += countSolutions(board, inequalities);
    board[best.row][best.col] = 0;
    if (count >= 2) return 2;
  }
  return count;
}

/** Generate a deterministic 5x5 daily puzzle with exactly one solution.
 * Same date and engine version produce the same puzzle on every device.
 * clueCount is a target: extra givens remain when uniqueness requires them.
 * The returned solution is for local hints; keep it separate from player state.
 */
export function generateDailyPuzzle(dateString, { inequalityCount = 12, clueCount = 7 } = {}) {
  const seed = dateToSeed(dateString);
  const size = 5;
  if (!Number.isInteger(inequalityCount) || inequalityCount < 1 || inequalityCount >= 40) {
    throw new RangeError('inequalityCount must be an integer from 1 to 39.');
  }
  if (!Number.isInteger(clueCount) || clueCount < 0 || clueCount >= 25) {
    throw new RangeError('clueCount must be an integer from 0 to 24.');
  }
  const random = mulberry32(seed);
  const indices = [0, 1, 2, 3, 4];
  const rows = shuffled(indices, random);
  const columns = shuffled(indices, random);
  const digits = shuffled([1, 2, 3, 4, 5], random);
  const solution = rows.map(row => columns.map(col => digits[(row + col) % size]));
  const edges = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      for (const direction of ['right', 'down']) {
        const nextRow = row + (direction === 'down' ? 1 : 0);
        const nextCol = col + (direction === 'right' ? 1 : 0);
        if (nextRow < size && nextCol < size) {
          edges.push({ row, col, direction,
            sign: solution[row][col] < solution[nextRow][nextCol] ? '<' : '>' });
        }
      }
    }
  }
  const inequalities = shuffled(edges, random).slice(0, inequalityCount);
  const board = solution.map(row => row.slice());
  let remaining = size * size;
  for (const index of shuffled(Array.from({ length: 25 }, (_, i) => i), random)) {
    if (remaining <= clueCount) break;
    const row = Math.floor(index / size);
    const col = index % size;
    const value = board[row][col];
    board[row][col] = 0;
    if (countSolutions(board, inequalities) === 1) remaining--;
    else board[row][col] = value;
  }
  return { date: dateString, seed, size, board, inequalities, solution };
}
