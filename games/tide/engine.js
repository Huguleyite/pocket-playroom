/** WordDrop: dependency-free ES module. Coordinates are { row, col }, zero-based.
 * Import with <script type="module">. Dates use UTC unless supplied explicitly.
 * Prototype dictionary only: this intentionally is not a complete English lexicon.
 */
export const SIZE = 5;
export const COMMON_WORDS = Object.freeze(`
ace act add age ago aid aim air all and ant any ape apt arc are arm art ash ask ate
bad bag ban bar bat bay bed bee beg bet big bin bit boa bog bow box boy bud bug bun
bus but buy cab can cap car cat cob cod cog cop cot cow coy cry cub cup cut dad dam
day den dew did die dig dim dip dog dot dry dub due dug duo dye ear eat eel egg ego
elf elk elm end era eve ewe eye fan far fat fax fed fee few fig fin fir fit fix flu
fly foe fog for fox fry fun fur gap gas gel gem get gig gin god got gum gun gut guy
gym had ham has hat hay hem hen her hey hid him hip his hit hog hop hot how hub hue
hug hum hut ice icy ill imp ink inn ion ire ivy jab jam jar jaw jay jet job jog jot
joy jug key kid kin kit lab lad lag lap law lay led leg let lid lie lip lit log lot
low lug mad man map mat may men met mid mix mob mop mud mug nab nag nap net new nib
nil nip nit nod nor not now nun nut oak oar oat odd off oil old one opt orb ore our
out owe owl own pad pal pan par pat paw pay pea peg pen pep per pet pie pig pin pit
ply pod pop pot pow pro pry pub pug pun pup put rag ram ran rap rat raw ray red rib
rid rig rim rip rob rod rot row rub rug rum run rut rye sad sag sap sat saw say sea
see set sew she shy sin sip sir sit six ski sky sly sob sod son sow soy spa spy sub
sue sum sun tab tag tan tap tar tax tea tee ten the tie tin tip toe ton too top tow
toy try tub tug two use van vat vet via vie vow wad wag war was wax way web wed wee
wet who why wig win wit woe won woo wow yak yam yap yaw yea yes yet yew you zap zen
zip zoo able ache acid acre aged also area army atom aunt away baby back bake ball
band bank bark barn base bath bead beam bean bear beat beef been beer bell belt bend
best bird bite blow blue boat body boil bold bolt bond bone book boot born both bowl
bulk burn bush busy cake calf call calm came camp card care cart case cash cast cave
chat chip city clam clap clay clip club coal coat code coil coin cold come cook cool
cope copy core corn cost cozy crab crew crop cube curl cute dark dart data date dawn
days dead deal dear deck deep deer desk dial dice diet dirt dish dive dock does done
door down draw drop drum duck dull dust duty each earn ease east easy edge else even
ever face fact fade fail fair fall farm fast fate fear feed feel feet fell felt file
fill film find fine fire firm fish fist five flag flat flea fled flew flip flow foam
fold folk food fool foot fork form fort four free frog from fuel full game gate gave
gear gift girl give glad glow glue goat goes gold golf gone good grab gray grew grid
grin grip grow gulf hair half hall hand hang hard harm hate have head heal heap hear
heat held help herb herd here hero hide high hike hill hint hold hole holy home hood
hook hope horn host hour huge hung hunt hurt idea inch into iron item jack jail join
joke jump just keen keep kept kick kind king kiss kite knee knew knit knot know lace
lack lady lake lamb lamp land lane last late lawn lead leaf lean leap left lend lens
less life lift like lime line link lion list live load loan lock loft logo lone long
look loop lord lose loss lost loud love luck made mail main make male many mark mask
mass mate math meal mean meat meet melt memo menu mere mesh mild mile milk mill mind
mine mint miss mist mode mood moon more most move much must nail name near neat neck
need nest news next nice nine node none noon nose note obey odds once only onto open
oval over pace pack page paid pain pair pale palm park part pass past path peak pear
peel peer pick pier pile pine pink pipe plan play plot plug plus poem poet pole poll
pond pool poor port pose post pour pray prey pull pure push quit quiz race rack rage
raid rail rain rake rank rare rate read real rear reef rent rest rice rich ride ring
rise risk road roam roar robe rock rode role roll roof room root rope rose rule rush
safe said sail sake sale salt same sand sang save seal seam seat seed seek seem seen
self sell send sent shed ship shoe shop shot show shut sick side sigh sign silk sing
sink site size skin skip slab slam slap sled slim slip slow snap snow soap sock soda
soft soil sold sole some song soon sore sort soul soup sour span spin spit spot star
stay stem step stir stop such suit sure swim tail take tale talk tall tame tank tape
task team tear tell tend tent term test text than that them then they thin this thus
tide tidy tile till time tiny tire toad told tone took tool torn tour town trap tray
tree trim trio trip true tube tune turn twin type unit upon urge used user vain vary
vast veil vein very view vine visa void vote wage wait wake walk wall want warm warn
wash wave weak wear weed week well went were west what when whip wide wife wild will
wind wine wing wink wire wise wish with wolf wood wool word wore work worm worn wrap
yard yarn year yell yoga your zero zone
about above after again agent agree ahead alarm album alert alien alive alone along
alter among angel anger angle angry apple apply argue arise armor aside asset audio
avoid award aware baker basic beach began begin begun being below bench berry birth
black blade blame blank blast blaze blend bless blind block blood bloom board boost
bound brain brake brand brave bread break breed brick bride brief bring broad broke
brown brush build built burst buyer cable carry catch cause chain chair chalk charm
chart chase cheap check cheek cheer chess chest chief child chill choir chose civic
claim class clean clear clerk click climb clock close cloth cloud coast color coral
could count court cover crack craft crash crawl crazy cream creek crime crisp cross
crowd crown curve cycle daily dairy dance dealt death debug delay depth devil diary
dirty doubt dough dozen draft drain drama drank dream dress dried drink drive drove
eager early earth eight elder elect empty enemy enjoy enter entry equal error essay
event every exact exist extra faint fairy faith false fancy fault feast fence ferry
fetch fever fiber field fifth fifty fight final first fixed flame flash fleet flesh
float flood floor flour fluid focus force forge forth forty found frame frank fresh
front frost fruit fully funny ghost giant given glass globe glory glove going grace
grade grain grand grant grape graph grasp grass grave great green greet grief grind
groan gross group grove grown guard guess guest guide guilt habit happy hardy harsh
haste hatch haven heart heavy hence hobby honey honor horse hotel house human humid
humor hurry ideal image imply index inner input issue ivory jelly jewel joint judge
juice juicy knife knock known label labor large laser later laugh layer learn lease
least leave legal lemon level light limit linen liver local logic loose loser lover
lower lucky lunch magic major maker mango maple march match maybe mayor meant medal
media melon mercy merge merit merry metal meter micro might minor model money month
moral motor mount mouse mouth moved movie music naive nasty naval nerve never newly
night noble noise north noted novel nurse ocean offer often olive onion opera orbit
order organ other outer owner paint panel panic paper party pasta paste patch pause
peace peach pearl pedal penny phase phone photo piano piece pilot pitch place plain
plane plant plate plead point polar porch pound power press price pride prime print
prior prize proof proud prove pulse punch pupil puppy queen query quest queue quick
quiet quite quote radio raise rally range rapid ratio reach react ready realm rebel
refer relax relay renew reply reset rhyme rider ridge right rigid rival river robin
robot rocky roman rough round route royal rural sadly saint salad sales sandy sauce
scale scare scarf scene scent scope score scout screw seeds sense serve seven shade
shake shall shame shape share shark sharp sheep sheer sheet shelf shell shift shine
shirt shock shook shoot shore short shout shown siege sight silly since skill skirt
skull slate sleep slept slice slide slope small smart smell smile smoke snake solar
solid solve sorry sound south space spare spark speak speed spell spend spent spice
spike spill spine spite split spoil spoke spoon sport spray stack staff stage stain
stair stake stale stall stamp stand stare start state steak steal steam steel steep
steer stick stiff still stock stole stone stood stool store storm story stove strap
straw stray strip stuck study stuff style sugar suite sunny super surge sweet swept
swift swing swirl table taken taste teach teeth tense thank theft their theme there
these thick thief thing think third thorn those three threw throw thumb tiger tight
timer tired title toast today token topic total touch tough towel tower trace track
trade trail train trait trash treat trend trial tribe trick tried troop truck truly
trunk trust truth twice twist under union unity until upper upset urban usage usual
valid value valve verse video virus visit vital vivid vocal voice voter wagon waist
waste watch water weary weave wedge weird whale wheat wheel where which while white
whole whose wider widow width woman women world worry worse worst worth would wound
wrath wreck wrist write wrong wrote yield young youth zebra
`.trim().split(/\s+/));
const DICTIONARY = new Set(COMMON_WORDS);
export function isValidWord(word) {
  return typeof word === 'string' && /^[a-z]{3,}$/i.test(word) &&
    DICTIONARY.has(word.toLowerCase());
}

export function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createDailyRandom(dateString) {
  if (typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new TypeError('Expected a valid YYYY-MM-DD date.');
  }
  const parsed = new Date(`${dateString}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateString) {
    throw new TypeError('Expected a valid YYYY-MM-DD date.');
  }
  let hash = 2166136261;
  for (const char of dateString) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return mulberry32(hash);
}

/** Geometry validation only; dictionary validation happens on submission. */
export function validatePath(coordsArray) {
  if (!Array.isArray(coordsArray) || coordsArray.length < 3 || coordsArray.length > 25) return false;
  const visited = new Set();
  for (let i = 0; i < coordsArray.length; i++) {
    const cell = coordsArray[i];
    if (!cell || !Number.isInteger(cell.row) || !Number.isInteger(cell.col) ||
        cell.row < 0 || cell.row >= SIZE || cell.col < 0 || cell.col >= SIZE) return false;
    const key = cell.row * SIZE + cell.col;
    if (visited.has(key)) return false;
    visited.add(key);
    if (i > 0 && (Math.abs(cell.row - coordsArray[i - 1].row) > 1 ||
        Math.abs(cell.col - coordsArray[i - 1].col) > 1)) return false;
  }
  return true;
}

const VOWELS = 'AAAAAAAAAEEEEEEEEEEEEIIIIIIIIIOOOOOOOOUUUU';
const CONSONANTS = 'BBCCDDDFFGGHHHHHHJKLLLLMMNNNNNNPPQRRRRRRSSSSSSTTTTTTTTTVVWWXYZ';
const DIRECTIONS = [[0, 1], [1, 0], [1, 1], [1, -1]];
const keyOf = ({ row, col }) => row * SIZE + col;
const copyPath = path => path.map(({ row, col }) => ({ row, col }));

/** Independent game instance. Same date + submissions => identical boards/refills.
 * Cascades: contiguous straight lines, both directions, length 3–5. A match must
 * touch a moved/refilled cell. Overlapping matches clear their union once.
 * Each wave scores length² per distinct path; initial submission costs one move.
 */
export function createWordDrop(dateString = new Date().toISOString().slice(0, 10)) {
  const random = createDailyRandom(dateString);
  const pick = pool => pool[Math.floor(random() * pool.length)];
  const freshLetter = () => pick(random() < 0.4 ? VOWELS : CONSONANTS);
  // Exactly 10 vowels and 15 consonants; Fisher–Yates avoids positional bias.
  const letters = Array.from({ length: 25 }, (_, i) => pick(i < 10 ? VOWELS : CONSONANTS));
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  let board = Array.from({ length: SIZE }, (_, r) => letters.slice(r * SIZE, (r + 1) * SIZE));
  let score = 0;
  let moves = 0;
  const snapshot = () => board.map(row => row.slice());
  const state = () => ({ date: dateString, board: snapshot(), score, moves, movesRemaining: 10 - moves });
  const wordAt = path => path.map(({ row, col }) => board[row][col]).join('');

  function findCascadeMatches(changedCells) {
    const matches = [];
    const seen = new Set();
    for (let row = 0; row < SIZE; row++) for (let col = 0; col < SIZE; col++) {
      for (const [dr, dc] of DIRECTIONS) {
        const path = [];
        for (let step = 0; step < SIZE; step++) {
          const r = row + dr * step, c = col + dc * step;
          if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) break;
          path.push({ row: r, col: c });
          if (path.length < 3 || !path.some(cell => changedCells.has(keyOf(cell)))) continue;
          const forward = wordAt(path);
          for (const reverse of [false, true]) {
            const word = reverse ? [...forward].reverse().join('') : forward;
            const identity = path.map(keyOf).join(',');
            // Palindromes and reverse-word pairs count once for the same tiles.
            if (!isValidWord(word) || seen.has(identity)) continue;
            seen.add(identity);
            matches.push({ word, path: reverse ? copyPath(path).reverse() : copyPath(path) });
          }
        }
      }
    }
    return matches;
  }

  function clearAndDrop(matches) {
    const unique = new Map();
    for (const { path } of matches) for (const cell of path) unique.set(keyOf(cell), cell);
    const before = snapshot();
    for (const { row, col } of unique.values()) board[row][col] = null;
    const cleared = snapshot();
    const changed = new Set();
    const falls = [], spawns = [];
    for (let col = 0; col < SIZE; col++) {
      let target = SIZE - 1;
      for (let row = SIZE - 1; row >= 0; row--) {
        if (board[row][col] === null) continue;
        const letter = board[row][col];
        board[target][col] = letter;
        if (target !== row) {
          changed.add(target * SIZE + col);
          falls.push({ letter, from: { row, col }, to: { row: target, col } });
        }
        target--;
      }
      for (let row = target; row >= 0; row--) {
        const letter = freshLetter();
        board[row][col] = letter;
        changed.add(row * SIZE + col);
        spawns.push({ letter, to: { row, col } });
      }
    }
    return { changed, event: { matches, removed: copyPath([...unique.values()]), before,
      cleared, after: snapshot(), falls, spawns } };
  }

  function processWordClear(pathCoords) {
    const reject = reason => ({ accepted: false, reason, ...state(), waves: [] });
    if (moves >= 10) return reject('No moves remaining.');
    if (!validatePath(pathCoords)) return reject('Invalid tile path.');
    const word = wordAt(pathCoords);
    if (!isValidWord(word)) return reject('Word is not in the prototype dictionary.');
    moves++;
    let matches = [{ word, path: copyPath(pathCoords) }];
    const waves = [];
    let points = 0;
    // One player clear plus at most ten automatic waves; pending matches remain.
    for (let wave = 0; wave <= 10 && matches.length; wave++) {
      const { changed, event } = clearAndDrop(matches);
      const earned = matches.reduce((sum, match) => sum + match.word.length ** 2, 0);
      points += earned;
      waves.push({ ...event, bonus: wave > 0, points: earned });
      matches = findCascadeMatches(changed);
    }
    score += points;
    return { accepted: true, word, points, ...state(), waves,
      cascadeLimitReached: matches.length > 0 };
  }

  return Object.freeze({ getState: state, validatePath, isValidWord, processWordClear });
}
