/* One source for attack geometry: damage, warnings and instructions agree. */
window.EncounterPatterns={
 kind(b){const i=Campaign.index,n=Math.floor(b.clock/ChapterAbilities.timing.cycle),low=b.health<=2;
  if(i===1&&low)return n%2?'sweep':'paired';
  if(i===2&&low)return n%2?'lock':'sweep';
  if(i===4)return n%2?'sweep':'paired';
  if(i===5)return low?'storm':'lock';
  if(i===6)return n%2?'paired':'sweep';
  if(i===7)return ['lock','sweep','gridheart'][n%3];
  return Campaign.level.kind;
 },
 targets(b,aim){const i=Campaign.index,kind=this.kind(b),a=Campaign.arena;
  if(i===4&&kind==='paired')return [a+95,a+335];
  if(i===6&&kind==='paired')return [a+65,a+365];
  return kind==='paired'||['storm','gridheart'].includes(kind)?[aim,aim+(b.health%2?90:-90)]:[aim];
 },
 tip(b){const kind=this.kind(b);return kind==='sweep'?'Jump over the low beam. The orange line shows its height.':Campaign.index===4&&kind==='paired'?'Leave the two outer rail lanes. The center lane is safe.':Campaign.index===6&&kind==='paired'?'Outer conduits are live. Move into the center pocket.':'Orange columns lock in place. Move clear before they fire.'},
 label(b){return this.kind(b)==='sweep'?'SWEEP LOCK · JUMP':Campaign.index===4?'RAIL LANES · FIND THE SAFE GAP':Campaign.index===6?'CONDUIT LOCK · FIND THE SAFE GAP':'TARGET LOCK · LEAVE ORANGE ZONES'}
};
