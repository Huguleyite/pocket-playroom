'use strict';
const $ = id => document.getElementById(id);
const cabinet = $('cabinet');
const date = new Date().toLocaleDateString('sv-SE', {timeZone:'America/New_York'});
const day = (Date.parse(date) - Date.UTC(2026,10,16)) / 86400000;
const index = (day % puzzles.length + puzzles.length) % puzzles.length;
const puzzle = puzzles[index];
const solution = puzzle.answer.replace(/[^A-Z]/g, '');
const key = 'letterlock:attempt:' + date;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let phase = 'splash';
let picks = [], tiles = [], slots = [];
let deadline, audio, audioBus;
let muted = localStorage.getItem('letterlock:mute') === '1';

const rewardsKey = 'hows-it-go:rewards';
let rewards = JSON.parse(localStorage.getItem(rewardsKey) || '{}');


function saveRewards() {
  localStorage.setItem(rewardsKey, JSON.stringify(rewards));
}

function visit() {
  if (rewards.lastDay !== day) {
    const previous = rewards.lastDay === day - 1 ? rewards.streak || 0 : 0;
    rewards.streak = previous % 20 + 1;
    rewards.lastDay = day;
    rewards.bank ||= 0;
    if ([3, 10, 15].includes(rewards.streak)) rewards.bank = Math.min(3, rewards.bank + 1);
    saveRewards();
  }
  updateRewards();
}

function updateRewards() {
  $('rewards').hidden = false;
  $('rewards').textContent = 'Try Again: ' + (rewards.bank === 3 ? 'Max' : rewards.bank || 0)
    + ' · Streak: ' + rewards.streak + '/20 days';
}

function retryOffer() {
  const latest = JSON.parse(localStorage.getItem(rewardsKey) || '{}');
  if (!latest.firstFinished) return 'free';
  return latest.bank > 0 ? 'bank' : '';
}

function closeFirstPlay() {
  rewards = JSON.parse(localStorage.getItem(rewardsKey) || '{}');
  rewards.firstFinished = true;
  saveRewards();
}

function fail() {
  const offer = retryOffer();
  if (!offer) {
    record({state:'expired'});
    closeFirstPlay();
    finish(false,0);
    return;
  }
  phase = 'retry';
  cabinet.classList.remove('wrong');
  tiles.forEach(tile => {tile.disabled = true;});
  clock(0,0);
  record({state:'retry'});
  $('status').textContent = 'Time’s up';
  $('retry-actions').hidden = false;
  $('retry').textContent = offer === 'free' ? 'Try again for free' : 'Use a Try Again';
}

function retry() {
  if (phase !== 'retry') return;
  if (readResult()?.state !== 'retry') return;
  const offer = retryOffer();
  if (!offer) return endRetry();
  {
    closeFirstPlay();
    if (offer === 'bank') rewards.bank--;
    saveRewards();
    updateRewards();
  }
  $('retry-actions').hidden = true;
  $('status').textContent = '';
  picks = [];
  renderPicks();
  unlockAudio();
  record({state:'started'});
  startPreview();
}

function endRetry() {
  if (phase !== 'retry') return;
  $('retry-actions').hidden = true;
  record({state:'expired'});
  closeFirstPlay();
  finish(false,0);
}

function record(result) {
  localStorage.setItem(key, JSON.stringify(result));
}

function readResult() {
  try { return JSON.parse(localStorage.getItem(key)); }
  catch { return null; }
}

function unlockAudio() {
  if (muted || !window.AudioContext) return;
  if (!audio) {
    audio = new AudioContext();
    audioBus = audio.createGain();
    audioBus.connect(audio.destination);
  }
  audio.resume().catch(() => {});
}

function note(hz, offset=0, length=.12) {
  if (!audio || muted) return;
  const at = audio.currentTime + offset;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'triangle';
  osc.frequency.value = hz;
  gain.gain.setValueAtTime(.001, at);
  gain.gain.exponentialRampToValueAtTime(.045, at+.012);
  gain.gain.exponentialRampToValueAtTime(.001, at+length);
  osc.connect(gain).connect(audioBus);
  osc.start(at);
  osc.stop(at+length);
}

function soundLabel() {
  $('sound').textContent = muted ? 'Sound off' : 'Sound on';
  $('sound').setAttribute('aria-pressed', String(!muted));
  if (audioBus) audioBus.gain.value = muted ? 0 : 1;
}

function lettersForBoard() {
  if (index === 0) return [...'PSRIHNAKSTLINHBSEQ'];
  let seed = (index+1)*57841;
  function random(n) {
    seed = (Math.imul(seed,1664525)+1013904223) >>> 0;
    return Math.floor(seed/4294967296*n);
  }
  const decoys = 'ETAOINSHRDLUCMFWYGPBVK';
  const letters = [...solution];
  while (letters.length < 18) letters.push(decoys[random(decoys.length)]);
  for (let i = letters.length-1; i>0; i--) {
    const j = random(i+1);
    [letters[i],letters[j]] = [letters[j],letters[i]];
  }
  return letters;
}

function reveal() {
  $('splash').hidden = true;
  $('play').hidden = false;
  $('clue').textContent = puzzle.prompt;
  for (const word of puzzle.answer.split(' ')) {
    const group = document.createElement('span');
    group.className = 'word';
    for (const letter of word) {
      const cell = document.createElement('span');
      if (/[A-Z]/.test(letter)) {
        cell.className = 'slot';
        slots.push(cell);
      } else {
        cell.className = 'punctuation';
        cell.textContent = letter;
      }
      group.append(cell);
    }
    $('answer').append(group);
  }
  tiles = lettersForBoard().map((letter,i) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.textContent = letter;
    tile.className = 'tile';
    tile.disabled = true;
    tile.style.setProperty('--wave', ((i%6)*100+Math.floor(i/6)*55)+'ms');
    tile.style.setProperty('--spark',['#40f9de','#73caff','#b685ff'][(i+Math.floor(i/6))%3]);
    tile.onclick = () => pick(i);
    return tile;
  });
  $('board').replaceChildren(...tiles);
  renderPicks();
}

function clock(ms, fraction) {
  $('time').textContent = '0:'+String(Math.ceil(Math.max(0,ms)/1000)).padStart(2,'0');
  $('bar').style.transform = 'scaleX('+Math.max(0,Math.min(1,fraction))+')';
}

function renderPicks() {
  tiles.forEach((tile,i) => tile.setAttribute('aria-pressed',String(picks.includes(i))));
  slots.forEach((slot,i) => {
    const letter = tiles[picks[i]]?.textContent || '';
    slot.textContent = letter;
    slot.classList.toggle('filled',!!letter);
  });
  $('answer').setAttribute('aria-label','Answer: '+slots.map(cell => cell.textContent || 'blank').join(' '));
}

function finish(won, remaining, celebrate=false, interrupted=false) {
  phase = 'finished';
  cabinet.classList.remove('wrong');
  cabinet.classList.toggle('won',won);
  tiles.forEach(tile => {tile.disabled = true;});
  clock(remaining,remaining/(puzzle.seconds*1000));
  const result = won ? 'Solved · '+Math.ceil(remaining/1000)+'s left' : interrupted ? 'Today’s attempt ended' : 'Time’s up';
  $('status').textContent = result+' · '+puzzle.answer+' · Next puzzle at midnight ET';
  if (!celebrate) return;
  cabinet.classList.add('celebrate');
  const step = Math.min(135, 1450/picks.length);
  picks.forEach((tileIndex,i) => {
    const delay = i*step;
    tiles[tileIndex].style.setProperty('--hit',delay+'ms');
    slots[i].style.setProperty('--hit',delay+'ms');
    note(440*2**(i/12),delay/1000);
  });
  const payout = picks.length*step+240;
  cabinet.style.setProperty('--final',payout+'ms');
  [659,831,988,1319].forEach((hz,i) => note(hz,payout/1000+i*.12,.5));
  [523,659,784,1047].forEach(hz => note(hz,payout/1000+.92,.72));
}

function expire() { fail(); }

function pick(i) {
  if (phase !== 'playing') return;
  const remaining = deadline-Date.now();
  if (remaining <= 0) return expire();
  const position = picks.indexOf(i);
  if (position >= 0) picks.splice(position,1);
  else if (picks.length < solution.length) picks.push(i);
  else return;
  renderPicks();
  const full = picks.length === solution.length;
  const correct = full && picks.map(id => tiles[id].textContent).join('') === solution;
  cabinet.classList.toggle('wrong',full && !correct);
  if (correct) {
    record({state:'won',remaining,picks});
    closeFirstPlay();
    finish(true,remaining,true);
  } else {
    $('status').textContent = full ? 'Try again' : '';
    note(full ? 150 : position < 0 ? 370 : 260);
  }
}

function tick() {
  if (phase !== 'playing') return;
  const remaining = deadline-Date.now();
  if (remaining <= 0) return expire();
  clock(remaining,remaining/(puzzle.seconds*1000));
  requestAnimationFrame(tick);
}

function showResult(result) {
  reveal();
  if (result.state === 'won') {
    picks = result.picks;
    renderPicks();
    finish(true,result.remaining);
  } else if (result.state === 'retry' || result.state === 'started') fail();
  else finish(false,0);
}

async function start() {
  if (phase !== 'splash') return;
  const existing = readResult();
  if (existing) return showResult(existing);
  phase = 'starting';
  $('go').disabled = true;
  record({state:'started'});
  unlockAudio();
  if (!reduced.matches && $('splash').animate) {
    await $('splash').animate([{opacity:1},{opacity:0,transform:'scale(.985)'}],
      {duration:280,easing:'ease-out',fill:'forwards'}).finished;
  }
  reveal();
  startPreview();
}

function startPreview() {
  phase = 'starting';
  cabinet.classList.add('preview');
  const duration = puzzle.seconds*1000;
  const begin = performance.now();
  function ready(now) {
    const progress = (now-begin)/1500;
    clock(duration,progress);
    if (progress < 1) return requestAnimationFrame(ready);
    cabinet.classList.remove('preview');
    phase = 'playing';
    tiles.forEach(tile => {tile.disabled = false;});
    deadline = Date.now()+duration;
    note(530,0,.16);
    tick();
  }
  requestAnimationFrame(ready);
}

document.addEventListener('keydown',event => {
  if (phase !== 'playing' || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
  if (event.key === 'Backspace' && picks.length) {
    event.preventDefault();
    pick(picks.at(-1));
  } else if (/^[a-z]$/i.test(event.key)) {
    const id = tiles.findIndex((tile,i) => tile.textContent === event.key.toUpperCase() && !picks.includes(i));
    if (id >= 0) pick(id);
  }
});
$('sound').onclick = () => {
  muted = !muted;
  localStorage.setItem('letterlock:mute',muted ? '1' : '0');
  unlockAudio();
  soundLabel();
};
$('go').onclick = start;
$('category').textContent = puzzle.category;
$('allowance').textContent = puzzle.seconds+' seconds';
soundLabel();
$('retry').onclick = retry;
$('end-retry').onclick = endRetry;
visit();
const previous = readResult();
if (previous) showResult(previous);





