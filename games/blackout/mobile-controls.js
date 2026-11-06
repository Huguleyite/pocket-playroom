(() => {
  const params=new URLSearchParams(location.search);
  if(params.get('touch')!=='1'&&params.get('touch')!=='fold')return;

  const shell=document.querySelector('main');
  const deck=document.querySelector('.touch');
  const split=matchMedia('(vertical-viewport-segments: 2)');
  let mode=params.get('touch')==='fold'?'fold':'auto';
  shell.classList.add('mobile-test');
  deck.innerHTML=`
    <div class="mobile-grip">
      <button data-mobile-key="KeyT">LB · Teleport</button>
      <div class="mobile-dpad" aria-label="Directional pad">
        <span aria-hidden="true">▲</span><span aria-hidden="true">◀</span>
        <span aria-hidden="true">▶</span><span aria-hidden="true">▼</span>
      </div>
    </div>
    <div class="mobile-menu">
      <button type="button" data-mobile-pause>Pause</button>
      <button type="button" data-mobile-fold>Auto</button>
    </div>
    <div class="mobile-grip">
      <button data-mobile-key="KeyQ">RB · Bolt</button>
      <div class="mobile-face" aria-label="Action buttons">
        <button data-mobile-key="KeyF"><b>Y</b> Shield</button>
        <button data-mobile-key="KeyE"><b>X</b> Power</button>
        <button data-mobile-key="ShiftLeft"><b>B</b> Dash</button>
        <button data-mobile-key="Space"><b>A</b> Jump</button>
      </div>
    </div>`;

  const pad=deck.querySelector('.mobile-dpad');
  const selector=deck.querySelector('[data-mobile-fold]');
  const fingers=new Map();
  const heldKeys=new Set();
  function update(id,codes) {
    if(codes.length)fingers.set(id,codes);
    else fingers.delete(id);
    const next=new Set([...fingers.values()].flat());
    for(const code of next)if(!heldKeys.has(code)&&!held(code))pressed.add(code);
    heldKeys.clear();
    for(const code of next)heldKeys.add(code);
    pad.classList.toggle('up',next.has('ArrowUp'));
    pad.classList.toggle('down',next.has('ArrowDown'));
    pad.classList.toggle('left',next.has('ArrowLeft'));
    pad.classList.toggle('right',next.has('ArrowRight'));
  }
  function clear() {
    for(const id of fingers.keys())update(id,[]);
  }
  function directions(event) {
    const bounds=pad.getBoundingClientRect();
    const x=(event.clientX-bounds.left)/bounds.width-.5;
    const y=(event.clientY-bounds.top)/bounds.height-.5;
    const codes=[];
    if(Math.abs(x)>.15)codes.push(x<0?'ArrowLeft':'ArrowRight');
    if(Math.abs(y)>.15)codes.push(y<0?'ArrowUp':'ArrowDown');
    return codes;
  }
  function bind(control,read,slide=false) {
    const captured=new Set();
    control.addEventListener('pointerdown',event=>{
      if(!active||paused||won||event.button!==0)return;
      event.preventDefault();
      control.setPointerCapture(event.pointerId);
      captured.add(event.pointerId);
      update(event.pointerId,read(event));
    });
    if(slide)control.addEventListener('pointermove',event=>{
      if(captured.has(event.pointerId)&&active&&!paused&&!won)update(event.pointerId,read(event));
    });
    for(const type of ['pointerup','pointercancel','lostpointercapture']){
      control.addEventListener(type,event=>{
        captured.delete(event.pointerId);
        update(event.pointerId,[]);
      });
    }
  }
  bind(pad,directions,true);
  for(const button of deck.querySelectorAll('[data-mobile-key]'))bind(button,()=>[button.dataset.mobileKey]);
  function layout() {
    clear();
    const folded=mode==='fold'||(mode==='auto'&&split.matches);
    shell.classList.toggle('mobile-fold',folded);
    shell.classList.toggle('mobile-segmented',folded&&split.matches);
    selector.textContent={auto:'Auto',fold:'Fold',flat:'Flat'}[mode];
    selector.setAttribute('aria-label',`Touch layout: ${selector.textContent}. Change layout`);
    resize();
  }
  selector.onclick=()=>{mode={auto:'fold',fold:'flat',flat:'auto'}[mode];layout();};
  deck.querySelector('[data-mobile-pause]').onclick=togglePause;
  split.addEventListener('change',layout);
  addEventListener('blur',clear);
  document.addEventListener('visibilitychange',clear);
  window.MobileControls={held:heldKeys,clear,separate:()=>shell.classList.contains('mobile-fold')};
  layout();
})();
