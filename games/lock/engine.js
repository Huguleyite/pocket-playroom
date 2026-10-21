/** LetterLock: dependency-free ES module. Dial index 0 is the center line.
 * Use <script type="module"> and import { createGame } from './engine.js'.
 * The bundled dictionary is deliberately small; supply bonusWords to expand it.
 */
export const CATEGORIES = Object.freeze([
  Object.freeze({ category: 'FRUIT', words: Object.freeze(['APPLE', 'GRAPE', 'MANGO', 'PEACH', 'LEMON', 'GUAVA']) }),
  Object.freeze({ category: 'SPACE', words: Object.freeze(['STAR', 'MOON', 'MARS', 'DUST', 'VOID']) }),
  Object.freeze({ category: 'ANIMALS', words: Object.freeze(['TIGER', 'ZEBRA', 'HORSE', 'OTTER', 'CAMEL', 'LEMUR']) })
]);

const BONUS_WORDS = ['STONE', 'NOTES', 'TONES', 'RATES', 'TEARS', 'STARE',
  'HEART', 'EARTH', 'OTHER', 'REACH', 'TEACH', 'CHARM', 'LIGHT', 'NIGHT',
  'TIME', 'TIDE', 'RIDE', 'ROAD', 'SAND', 'HAND', 'HARD', 'CARD', 'COLD'];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const normalize = word => typeof word === 'string' ? word.trim().toUpperCase() : '';

export function mulberry32(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createPRNG(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
    throw new TypeError('Expected a valid YYYY-MM-DD date.');
  }
  let seed = 2166136261;
  for (const char of date) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  return mulberry32(seed);
}

function shuffle(values, random) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** All date decisions use the supplied date; default daily rollover is UTC.
 * Each puzzle has a single word length, so every target fits the same board.
 */
export function createDailyPuzzle(date = new Date().toISOString().slice(0, 10)) {
  const random = createPRNG(date);
  const entry = CATEGORIES[Math.floor(random() * CATEGORIES.length)];
  const targets = shuffle(entry.words, random).slice(0, 3 + Math.floor(random() * 3));
  const columnCount = targets[0].length;
  const dials = Array.from({ length: columnCount }, (_, column) => {
    const required = [...new Set(targets.map(word => word[column]))];
    const distractors = shuffle([...ALPHABET].filter(letter => !required.includes(letter)), random);
    return shuffle([...required, ...distractors.slice(0, 10 - required.length)], random);
  });
  return { date, category: entry.category, targets, columnCount, dials };
}

/** Returns target | bonus | invalid. Target words always take precedence. */
export function validateWord(word, targets, dictionary = BONUS_WORDS) {
  const candidate = normalize(word);
  if (!/^[A-Z]{4,5}$/.test(candidate)) return 'invalid';
  if ([...targets].some(value => normalize(value) === candidate)) return 'target';
  return [...dictionary].some(value => normalize(value) === candidate) ? 'bonus' : 'invalid';
}

export function createGame(date, { bonusWords = BONUS_WORDS, savedState = null } = {}) {
  const puzzle = createDailyPuzzle(date);
  const dials = puzzle.dials.map(dial => [...dial]);
  const targets = new Set(puzzle.targets);
  const dictionary = new Set([...bonusWords].map(normalize));
  const unlocked = new Set();
  const bonuses = new Set();
  const getCurrentWord = () => dials.map(dial => dial[0]).join('');

  /** Defensive snapshots prevent callers from moving other columns accidentally. */
  function getState() {
    return {
      date: puzzle.date, category: puzzle.category, columnCount: puzzle.columnCount,
      targets: [...targets], dials: dials.map(dial => [...dial]),
      currentWord: getCurrentWord(), unlockedWords: [...unlocked], bonusWords: [...bonuses],
      remainingWords: [...targets].filter(word => !unlocked.has(word)),
      complete: unlocked.size === targets.size
    };
  }

  /** Call on settling a dial; repeated submissions do not award duplicates. */
  function checkCurrentWord() {
    const word = getCurrentWord();
    const kind = validateWord(word, targets, dictionary);
    const collection = kind === 'target' ? unlocked : kind === 'bonus' ? bonuses : null;
    const isNew = collection !== null && !collection.has(word);
    if (isNew) collection.add(word);
    return { word, kind, isNew, complete: unlocked.size === targets.size };
  }

  /** up: next letter enters center; down: previous letter enters center.
   * Mutates exactly one dial, then checks the newly aligned center word.
   */
  function spinColumn(columnIndex, direction) {
    if (!Number.isInteger(columnIndex) || columnIndex < 0 || columnIndex >= dials.length) {
      throw new RangeError('Column index is out of bounds.');
    }
    if (direction !== 'up' && direction !== 'down') {
      throw new TypeError('Direction must be "up" or "down".');
    }
    const dial = dials[columnIndex];
    if (direction === 'up') dial.push(dial.shift());
    else dial.unshift(dial.pop());
    return { ...checkCurrentWord(), columnIndex, direction, proximity: getProximity() };
  }

  /** Score is the fraction of aligned columns (0..1). Circular distance is
   * the minimum number of one-step spins, used to break equal-score ties.
   * No remaining targets returns score 1 and word null.
   */
  function getProximity() {
    const candidates = [...targets].filter(word => !unlocked.has(word)).map(word => {
      const columns = dials.map((dial, index) => {
        const up = dial.indexOf(word[index]);
        const down = (dial.length - up) % dial.length;
        return { columnIndex: index, letter: word[index], aligned: up === 0,
          steps: Math.min(up, down), direction: up === 0 ? null : up <= down ? 'up' : 'down' };
      });
      const matchedColumns = columns.filter(column => column.aligned).length;
      return { word, score: matchedColumns / dials.length, matchedColumns,
        totalSteps: columns.reduce((sum, column) => sum + column.steps, 0), columns };
    });
    candidates.sort((a, b) => b.score - a.score || a.totalSteps - b.totalSteps);
    return candidates[0] || { word: null, score: 1, matchedColumns: dials.length, totalSteps: 0, columns: [] };
  }

  // Restore rotations directly so loading never awards intermediate words.
  if (savedState && savedState.date === puzzle.date) {
    const rotations = dials.map((dial, i) => {
      const saved = savedState.dials?.[i];
      if (!Array.isArray(saved) || saved.length !== dial.length) return -1;
      const offset = dial.indexOf(saved[0]);
      return offset >= 0 && saved.every((letter, j) => letter === dial[(j + offset) % dial.length]) ? offset : -1;
    });
    if (rotations.every(offset => offset >= 0)) {
      rotations.forEach((offset, i) => { dials[i] = [...dials[i].slice(offset), ...dials[i].slice(0, offset)]; });
      for (const word of Array.isArray(savedState.unlockedWords) ? savedState.unlockedWords : []) {
        if (targets.has(word)) unlocked.add(word);
      }
      for (const word of Array.isArray(savedState.bonusWords) ? savedState.bonusWords : []) {
        if (validateWord(word, targets, dictionary) === 'bonus') bonuses.add(word);
      }
    }
  }
  // A randomly generated opening alignment can itself be a valid word.
  checkCurrentWord();
  return Object.freeze({ getState, getCurrentWord, checkCurrentWord, spinColumn, getProximity });
}
