/** WordWeave: dependency-free ES module. Coordinates are zero-based.
 * Rows read left-to-right; columns read top-to-bottom. Matches clear rather
 * than permanently lock. All matches in a wave clear together; intersections
 * score once per word but clear once per cell. Gravity acts downward.
 */
export const SIZE = 4;
export const WORDS = Object.freeze(`
able acid acre aged also area army away baby back bake ball band bank bare bark
barn base bath bead beam bean bear beat beef been beer bell belt bend bent best
bill bind bird bite blow blue boat body boil bold bolt bond bone book boot bore
born boss both bowl bulk bull burn bush busy cake calm came camp cane cape card
care cart case cash cast cave cell chat chef chin chip city clay clip club coal
coat code coin cold come cook cool cope copy cord core corn cost cozy crab crew
crop crow cube cure curl cute dale damp dare dark data date dawn days dead deaf
deal dear debt deck deed deep deer desk dial dice diet dime dine dirt dish dive
dock does doll dome done door dose down drag draw drew drip drop drum duck dull
dumb dump dusk dust duty each earn ease east easy echo edge edit else even ever
evil exam exit face fact fade fail fair fall fame farm fast fate fear feed feel
feet fell felt file fill film find fine fire firm fish fist five flag flap flat
flaw fled flew flip flow foam fold folk food fool foot fork form fort foul four
free frog from fuel full fund gain gale game gang gate gave gaze gear gene gift
girl give glad glow glue goal goat gold golf gone good grab gray grew grey grid
grim grin grip grow gulf gust hair half hall hand hang hard hare harm harp hate
haul have hawk haze head heal heap hear heat heel held help herb herd here hero
hide high hike hill hint hire hold hole holy home hood hook hope horn host hour
huge hung hunt hurt idea idle inch into iron item jack jail jars jazz jerk join
joke jump jury just keen keep kept kick kind king kite knee knew knit knob knot
know lace lack lady laid lake lamb lame lamp land lane last late lawn lazy lead
leaf leak lean leap left lend lens less liar life lift like limb lime limp line
link lion list live load loaf loan lock loft logo lone long look loop lord lose
loss lost loud love luck lump lung made maid mail main make male mall many mare
mark mask mass mate math meal mean meat meet melt menu mere mess mild mile milk
mill mind mine mint miss mist mode mold mole monk mood moon more most move much
must nail name navy near neat neck need nest news next nice nick nine node none
noon nose note noun obey odds once only onto open oral oven over pace pack page
paid pail pain pair pale palm park part pass past path peak pear peel peer pick
pile pill pine pink pipe plan play plot plug plum plus poem poet pole poll pond
pool poor pork port pose post pour pray prey pull pump pure push quit quiz race
rack rage raid rail rain rake rank rare rash rate read real rear reed reef rent
rest rice rich ride ring riot rise risk road roam roar robe rock rode role roll
roof room root rope rose ruby rude ruin rule rush rust safe said sail sake sale
salt same sand sang save scan scar seal seam seat seed seek seem seen self sell
send sent shed shin ship shoe shop shot show shut sick side sigh sign silk sing
sink site size skin skip slab slam slap sled slim slip slot slow slug snap snow
soap soak soar sock soda sofa soft soil sold sole some song soon sore sort soul
soup sour span spin spit spot star stay stem step stew stir stop such suit sung
sunk sure surf swam swan swap swim tail take tale talk tall tame tank tape task
team tear teen tell tend tent term test text than that them then they thin this
thus tick tide tidy tied tier tile till tilt time tiny tire toad told toll tone
took tool torn tour town trap tray tree trim trio trip true tube tune turn twin
type ugly undo unit upon urge used user vain vale vary vase vast veil vein verb
very vest veto view vine visa void vote wage wait wake walk wall want warm warn
wash wave weak wear weed week well went were west what when whip whom wide wife
wild will wind wine wing wink wipe wire wise wish with wolf wood wool word wore
work worm worn wrap yard yarn yeah year yell yoga your zero zest zinc zone zoom
`.trim().split(/\s+/));
const DICTIONARY = new Set(WORDS);
export function isValidWord(word) {
  return typeof word === 'string' && DICTIONARY.has(word.toLowerCase());
}

/** FNV-1a hashes the exact calendar date into Mulberry32's 32-bit seed. */
export function createPRNG(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
    throw new TypeError('Expected a valid YYYY-MM-DD calendar date.');
  }
  let seed = 2166136261;
  for (const char of date) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  return () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), seed | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const copy = grid => grid.map(row => [...row]);
function validateGrid(grid) {
  if (!Array.isArray(grid) || grid.length !== SIZE ||
      grid.some(row => !Array.isArray(row) || row.length !== SIZE ||
        row.some(letter => typeof letter !== 'string' || !/^[A-Z]$/.test(letter)))) {
    throw new TypeError('Expected a 4x4 array of uppercase A-Z letters.');
  }
}

export function findMatches(grid) {
  validateGrid(grid);
  const matches = [];
  for (const axis of ['row', 'col']) {
    for (let index = 0; index < SIZE; index++) {
      const cells = Array.from({ length: SIZE }, (_, i) =>
        axis === 'row' ? [index, i] : [i, index]);
      const word = cells.map(([r, c]) => grid[r][c]).join('');
      if (isValidWord(word)) matches.push({ axis, index, word, cells });
    }
  }
  return matches;
}

function rotate(grid, axis, index, direction) {
  if (!Number.isInteger(index) || index < 0 || index >= SIZE) {
    throw new RangeError('Index must be an integer from 0 to 3.');
  }
  // Numeric -1/+1 or explicit direction names; no silent coercion.
  const names = axis === 'row' ? { left: -1, right: 1 } : { up: -1, down: 1 };
  const delta = typeof direction === 'string' ? names[direction] : direction;
  if (delta !== -1 && delta !== 1) throw new RangeError('Invalid shift direction.');
  const line = Array.from({ length: SIZE }, (_, i) =>
    axis === 'row' ? grid[index][i] : grid[i][index]);
  for (let i = 0; i < SIZE; i++) {
    const letter = line[(i - delta + SIZE) % SIZE];
    if (axis === 'row') grid[index][i] = letter;
    else grid[i][index] = letter;
  }
}

const LETTERS = 'EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNRRRRRRTTTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ';
const pick = (items, random) => items[Math.floor(random() * items.length)];

/** Construct a match-free board with a verified one-move word witness.
 * This guarantees an available scoring move, not a particular target score.
 * Retry work is bounded; the fixed fallback has the same guarantee.
 */
export function createDailyPuzzle(date) {
  const random = createPRNG(date);
  for (let attempt = 0; attempt < 256; attempt++) {
    const grid = Array.from({ length: SIZE }, () =>
      Array.from({ length: SIZE }, () => pick(LETTERS, random)));
    const row = Math.floor(random() * SIZE);
    const col = Math.floor(random() * SIZE);
    grid[row] = pick(WORDS, random).toUpperCase().split('');
    rotate(grid, 'col', col, 1);
    if (findMatches(grid).length) continue;
    const solved = copy(grid);
    rotate(solved, 'col', col, -1);
    if (findMatches(solved).length) {
      return { date, grid, solution: { axis: 'col', index: col, direction: -1 } };
    }
  }
  return { date, grid: ['ZAT E'.replace(/ /g, ''), 'CZZZ', 'ZZZZ', 'ZZZZ']
    .map(row => row.split('')), solution: { axis: 'col', index: 0, direction: -1 } };
}

/** Each instance owns its grid, score and deterministic refill stream.
 * A wave scores 100 x number of matched words x wave number (1,2,3...).
 * A 64-wave safety limit leaves matches pending; call checkBoard() to resume
 * the same combo. Shifts are rejected until pending cascades are resolved.
 */
export function createEngine(date, options = {}) {
  const puzzle = createDailyPuzzle(date);
  let grid = copy(options.grid === undefined ? puzzle.grid : options.grid);
  validateGrid(grid);
  const random = createPRNG(date);
  let score = 0;
  let moves = 0;
  let nextMultiplier = 1;
  let pending = false;
  const getState = () => ({ date, grid: copy(grid), score, moves, pending });

  function checkBoard() {
    const waves = [];
    let points = 0;
    for (let wave = 0; wave < 64; wave++) {
      const matches = findMatches(grid);
      if (!matches.length) break;
      const cleared = new Set(matches.flatMap(match =>
        match.cells.map(([r, c]) => r * SIZE + c)));
      const before = copy(grid);
      const multiplier = nextMultiplier++;
      const wavePoints = 100 * matches.length * multiplier;
      points += wavePoints;
      score += wavePoints;
      for (let c = 0; c < SIZE; c++) {
        const survivors = [];
        for (let r = 0; r < SIZE; r++) {
          if (!cleared.has(r * SIZE + c)) survivors.push(grid[r][c]);
        }
        const missing = SIZE - survivors.length;
        const column = Array.from({ length: missing }, () => pick(LETTERS, random))
          .concat(survivors);
        for (let r = 0; r < SIZE; r++) grid[r][c] = column[r];
      }
      waves.push({ matches, multiplier, points: wavePoints,
        cleared: [...cleared].map(id => [Math.floor(id / SIZE), id % SIZE]),
        before, after: copy(grid) });
    }
    pending = findMatches(grid).length > 0;
    if (!pending) nextMultiplier = 1;
    return { ...getState(), points, waves };
  }

  function shift(axis, index, direction) {
    if (pending) throw new Error('Call checkBoard() to finish the pending cascade.');
    rotate(grid, axis, index, direction);
    moves++;
    return checkBoard();
  }

  return {
    getState,
    checkBoard,
    shiftRow: (index, direction) => shift('row', index, direction),
    shiftCol: (index, direction) => shift('col', index, direction)
  };
}
