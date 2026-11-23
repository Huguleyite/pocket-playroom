/* Shared with the original Section War combat rules. Keep in sync with index.html when combat rules change. */
window.SectionWarBattle = function(picks, checkpoint) {
let mode='local',completed=0,lineup=picks,state;
const fighterEffect=()=>{},cue=()=>{},brassWave=()=>{};
const cards = {
  secondWind:{name:"Second Wind",cost:1,damage:4,block:3,target:true,detail:"Deal 4 damage and gain 3 Block. You still gain Block if Squeak makes the attack miss."},
  screech:{name:"Screech Blast",cost:2,damage:9,tune:2,target:true,detail:"Deal 9 damage and apply 2 Out of Tune if the attack lands."},
  taunt:{name:"Taunt",cost:1,block:4,tune:1,target:true,detail:"Gain 4 Block and apply 1 Out of Tune. Against AI, replace its first defensive move with Warm-Up Hit."},
  wall:{name:"Brass Wall",cost:1,block:8,detail:"Gain 8 Block."},
  brake:{name:"Tempo Brake",cost:2,damage:5,block:4,brake:true,target:true,detail:"Deal 5 damage, gain 4 Block, and reduce the rival’s next successful attack by 4."},
  cadence:{name:"Cadence",cost:0,energy:1,detail:"Gain 1 Energy. Once per turn."},
  roll:{name:"Roll Finish",cost:2,damage:10,target:true,detail:"Deal 10 damage."},
  stab:  {name:"Slide Stab", cost:1, damage:7, target:true, detail:"Deal 7 damage."},
  sweep: {name:"Slide Sweep", cost:2, damage:12, target:true, cleave:true, detail:"Deal 12 damage in a duel."},
  hit:   {name:"Warm-Up Hit", cost:1, damage:6, target:true, detail:"Deal 6 damage."},
  guard: {name:"Brass Guard", cost:1, block:7, detail:"Gain 7 Block."},
  tape:  {name:"Duct Tape", cost:1, block:3, detail:"Clear Squeak and Out of Tune. Gain 3 Block."},
  oil:   {name:"Valve Oil", cost:0, detail:"Draw 1 card."},
  mute:  {name:"Mute", cost:1, target:true, detail:"Apply Squeak."}
};

const shortEffects = {
  secondWind:"4 damage · 3 Block",
  screech:"9 damage · 2 Out of Tune", taunt:"4 Block · Out of Tune", wall:"8 Block",
  brake:"5 damage · 4 Block · Slow", cadence:"+1 Energy", roll:"10 damage",
  stab:"7 damage", sweep:"12 duel damage", hit:"6 damage",
  guard:"7 Block", tape:"Clear debuffs · 3 Block", oil:"Draw 1 card", mute:"Apply Squeak"
};

const cardHelp = {
  secondWind:cards.secondWind.detail,
  screech:cards.screech.detail, taunt:cards.taunt.detail, wall:cards.wall.detail,
  brake:cards.brake.detail, cadence:cards.cadence.detail, roll:cards.roll.detail,
  stab:"A cheap single-target attack. Use it first to get +2 damage from Long Reach. Tap Nia to confirm.",
  sweep:"A wide attack. It deals 12 to Nia in this duel. In battles with multiple rivals it deals 9 to your target and 5 to each other rival. It does not use Long Reach.",
  hit:"A basic single-target attack. It can use Long Reach or clear Squeak cheaply by taking the miss.",
  guard:"Use this before End Turn to absorb Nia's attack. Unused Block expires when your next turn starts.",
  tape:"Removes Squeak before it makes your attack miss and clears Out of Tune. You also gain 3 Block.",
  oil:"Draw another card without spending Energy. Useful when your current hand does not have the move you need.",
  mute:"Tap Nia to apply Squeak. Her next attack misses, but she can still gain Block or use utility moves. Squeak expires at the end of her turn."
};


const core = ["hit","hit","guard","tape","oil","mute"];
const plans = {
  Trombones:[["stab","guard","hit"],["sweep","stab"],["mute","sweep"],["stab","stab","guard"]],
  Trumpets:[["screech","taunt"],["taunt","hit","guard"],["screech","hit"],["mute","screech"]],
  Tubas:[["brake","wall"],["hit","hit","guard"],["hit","wall","tape"],["hit","brake"],["hit","mute","guard"]],
  Drumline:[["cadence","guard","roll","hit"],["cadence","mute","roll","hit"],["guard","hit","hit"],["cadence","tape","roll","hit"]]
};

const sections = {
  Trombones:{signature:["stab","sweep"], image:"assets/a8c100af4cfd011dd305.webp", ability:"Long Reach · Your first single-target attack each turn deals +2 damage."},
  Trumpets:{signature:["screech","taunt"], image:"assets/3192a0a269627d08df0f.webp", ability:"Lead Voice · The first time you apply Out of Tune each turn, deal 2 extra damage."},
  Tubas:{signature:["wall","brake"], image:"assets/3c5c4bacf67a24b7e9c1.webp", ability:"Heavy Brass · Start Fortified. Once per turn, gain 2 extra Block when adding to existing Block."},
  Drumline:{signature:["cadence","roll"], image:"assets/18a543a8f565648b5a27.webp", ability:"In the Pocket · Your first attack played as your third card or later each turn deals ×1.5 damage."}
};

function shuffle(list) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function fighter() {
  return {hp:60,block:0,squeak:false,braked:false,fortified:false,outOfTune:0,played:0,leadUsed:false,heavyUsed:false,cadenceUsed:false};
}
function buildDeck(pick) {
  const signature = sections[pick.section].signature;
  const deck = [...core,...signature,...signature];
  if (mode === "local" && completed >= 10 && pick.secondWind) {
    deck[deck.indexOf("hit")] = "secondWind";
  }
  return shuffle(deck);
}
function draw(count) {
  for (let i = 0; i < count; i++) {
    if (!state.pile.length) {
      state.pile = shuffle(state.discard);
      state.discard = [];
    }
    if (!state.pile.length) return;
    state.hand.push(state.pile.shift());
  }
}
function attacks(card) { return !!card.damage; }
function attackValue(card, actor = state.player, section = lineup[0].section) {
  const bonus = section === "Trombones" && !actor.leadUsed && !card.cleave ? 2 : 0;
  const combo = section === "Drumline" && !actor.leadUsed && actor.played >= 2;
  const base = Math.floor((card.damage + bonus) * (combo ? 1.5 : 1));
  const reduced = actor.braked ? 4 : 0;
  return {bonus, combo, base, reduced, value:Math.max(0,base - reduced)};
}
function log(message) { state.events.unshift(message); }
function applyCard(id, side, delay = 0) {
  const index = side === "player" ? 0 : 1;
  const {name, section} = lineup[index];
  const rival = lineup[1-index].name;
  const actor = state[side];
  const defender = state[index ? "player" : "enemy"];
  const target = index ? "player" : "enemy";
  const card = cards[id];
  let landed = true;
  if (attacks(card)) {
    const {base, combo} = attackValue(card,actor,section);
    landed = hit(actor,defender,base,name + " · " + card.name,delay);
    if (combo) log(name + " triggered In the Pocket.");
    if ((section === "Trombones" && !card.cleave) || combo) actor.leadUsed = true;
  }
  if (id === "tape") {
    actor.squeak = false;
    actor.outOfTune = 0;
    log(name + " cleared Squeak and Out of Tune.");
  }
  if (card.block) {
    const heavy = section === "Tubas" && !actor.heavyUsed && actor.block > 0;
    const gained = grantBlock(actor,card.block + (heavy ? 2 : 0));
    if (heavy) actor.heavyUsed = true;
    log(name + " gained " + gained + " Block.");
    fighterEffect(side,"shield","+" + gained + " Block",delay + (card.damage ? 180 : 0));
  }
  if (id === "oil" && side === "player") {
    draw(1);
    log("Valve Oil drew a card.");
  }
  if (card.energy) {
    actor.cadenceUsed = true;
    if (side === "player") state.energy += card.energy;
    log(name + " gained " + card.energy + " Energy.");
  }
  if (card.brake && landed && defender.hp) {
    defender.braked = true;
    log(rival + " gained Tempo Brake.");
  }
  if (id === "mute") {
    defender.squeak = true;
    log(rival + " gained Squeak.");
    fighterEffect(target,"status-fx","Squeak",delay);
  }
  if (card.tune && landed && defender.hp) {
    defender.outOfTune = Math.min(3,defender.outOfTune + card.tune);
    log(rival + " has " + defender.outOfTune + " Out of Tune.");
    if (section === "Trumpets" && !actor.leadUsed) {
      actor.leadUsed = true;
      const blocked = Math.min(2,defender.block);
      defender.block -= blocked;
      const damage = Math.min(defender.hp,2 - blocked);
      defender.hp -= damage;
  if (defender.hp > 0 && defender.hp <= 15 && defender.hp + damage > 15) cue(delay, () => impact(target,"low"));
  else if (damage >= 9) cue(delay, () => impact(source,"big"));
  else if (blocked >= 5 && damage === 0) cue(delay, () => impact(target,"block"));
      log(name + " triggered Lead Voice for " + damage + " HP damage.");
    }
  }
  if (mode === "ai" && id === "taunt" && side === "player") state.taunted = true;
  actor.played++;
}
function beginTurn(side) {
  const actor = state[side];
  const name = lineup[side === "player" ? 0 : 1].name;
  actor.block = 0;
  actor.played = 0;
  actor.leadUsed = false;
  actor.heavyUsed = false;
  actor.cadenceUsed = false;
  if (actor.outOfTune) {
    const damage = Math.min(actor.hp,actor.outOfTune * 2);
    actor.hp -= damage;
    actor.outOfTune--;
    log(name + " took " + damage + " HP damage from Out of Tune.");
    fighterEffect(side,"status-fx","−" + damage + " HP · Out of Tune");
  }
}
function eligible(card) {
  return card.cost <= state.energy && !(card.energy && state.player.cadenceUsed);
}
function hit(attacker, defender, amount, label, delay = 0) {
  const source = attacker === state.player ? "player" : "enemy";
  const target = source === "player" ? "enemy" : "player";
  if (attacker.squeak) {
    attacker.squeak = false;
    cue(delay, () => {impact(source,"miss");playSound("miss");});
    fighterEffect(source, "status-fx", "Squeak · Miss", delay);
    state.events.unshift(label + " missed (Squeak).");
    return false;
  }
  if (attacker.braked) {
    attacker.braked = false;
    amount = Math.max(0, amount - 4);
  }
  const blocked = Math.min(amount, defender.block);
  defender.block -= blocked;
  const damage = Math.min(defender.hp, amount - blocked);
  defender.hp -= damage;
  if (defender.hp > 0 && defender.hp <= 15 && defender.hp + damage > 15) cue(delay, () => impact(target,"low"));
  else if (damage >= 9) cue(delay, () => impact(source,"big"));
  else if (blocked >= 5 && damage === 0) cue(delay, () => impact(target,"block"));
  brassWave(source, delay);
  cue(delay, () => playSound(damage ? "attack" : "block"));
  fighterEffect(target, damage ? "impact" : "shield", damage ? "−" + damage + " HP" : "Blocked", delay + 180);
  state.events.unshift(label + " dealt " + damage + " HP damage" +
    (blocked ? " (" + blocked + " blocked)." : "."));
  return true;
}
function grantBlock(who, amount) {
  const total = amount + (who.fortified ? 3 : 0);
  who.fortified = false;
  who.block += total;
  return total;
}
function endIfDefeated() {
  if (state.outcome) return true;
  if (state.enemy.hp && state.player.hp) return false;
  state.outcome = state.enemy.hp === 0 ? "Victory" : "Defeat";
  state.prompt = lineup[state.outcome === "Victory" ? 0 : 1].name + (mode === "local" ? " wins the duel." : " wins the scrimmage.");
  if (mode === "ai" && completed < 10) {
    completed++;
    try {localStorage.setItem(saveKey,String(completed));} catch {}
    state.reward = completed === 10;
  }
  state.selected = null;
  return true;
}
if(checkpoint){state=checkpoint.state;lineup=checkpoint.lineup;}
else {
 state={player:fighter(),enemy:fighter(),turn:1,seat:1,energy:2,hand:[],pile:buildDeck(lineup[0]),discard:[],events:[],selected:null,outcome:null};
 state.player.fortified=lineup[0].section==='Tubas';state.enemy.fortified=lineup[1].section==='Tubas';
 state.waitingDeck={pile:buildDeck(lineup[1]),discard:[]};draw(5);
}
return {
 checkpoint:()=>JSON.parse(JSON.stringify({state,lineup})),
 action(seat,action,index){
  if(state.seat!==seat||state.outcome)throw Error('It is not your turn.');
  if(action==='play'){
   if(!Number.isInteger(index)||index<0||index>=state.hand.length)throw Error('Invalid card.');
   const id=state.hand[index];if(!eligible(cards[id]))throw Error('Card unavailable.');
   state.hand.splice(index,1);state.energy-=cards[id].cost;applyCard(id,'player');state.discard.push(id);endIfDefeated();
  }else if(action==='end'){
   state.player.squeak=false;state.player.braked=false;
   const next=state.waitingDeck;state.waitingDeck={pile:state.pile,discard:[...state.discard,...state.hand]};
   state.pile=next.pile;state.discard=next.discard;state.hand=[];
   [state.player,state.enemy]=[state.enemy,state.player];[lineup[0],lineup[1]]=[lineup[1],lineup[0]];
   state.seat=3-state.seat;state.turn++;state.energy=3;beginTurn('player');if(!endIfDefeated())draw(5);
  }else throw Error('Unknown action.');
 },
 view(seat){
  const active=state.seat===seat,s=state;
  const winner=s.outcome?(s.enemy.hp===0?s.seat:3-s.seat):null;
  return JSON.parse(JSON.stringify({activeSeat:s.seat,lineup:active?lineup:[lineup[1],lineup[0]],state:{
   player:active?s.player:s.enemy,enemy:active?s.enemy:s.player,seat,turn:s.turn,
   energy:active?s.energy:0,hand:active?s.hand:[],pile:Array(active?s.pile.length:0).fill(null),
   discard:Array(active?s.discard.length:0).fill(null),events:s.events.slice(0,40),selected:null,passing:!active,
   outcome:winner?(winner===seat?'Victory':'Defeat'):null,
   prompt:winner?'Battle complete.':active?'Your turn. Choose a card.':'Waiting for your opponent’s turn.'
  }}));
 }
};
};
