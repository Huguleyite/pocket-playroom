(() => {
  const params=new URLSearchParams(location.search);
  const touchMode=params.get('touch');
  const mobileViewport=matchMedia('(any-pointer: coarse), (max-width: 700px)').matches;
  if(touchMode!=='1'&&touchMode!=='fold'&&!mobileViewport)return;

  const shell=document.querySelector('main');
  const deck=document.querySelector('.touch');
  const split=matchMedia('(vertical-viewport-segments: 2)');
  let mode=touchMode==='fold'?'fold':'auto';
  shell.classList.add('mobile-test');
  deck.innerHTML=`
    <div class="mobile-grip">
      <button data-mobile-key="KeyT">LB · Teleport</button>
      <div class="mobile-stick" aria-label="Floating movement joystick">
        <span aria-hidden="true">MOVE</span><i aria-hidden="true"></i>
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

  const stick=deck.querySelector('.mobile-stick');
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
  }
  let origin=null;
  function releaseStick() {
    if(origin)update(origin.id,[]);
    origin=null;
    stick.classList.remove('engaged');
  }
  function clear() {
    releaseStick();
    for(const id of fingers.keys())update(id,[]);
  }
  stick.addEventListener('pointerdown',event=>{
    if(!active||paused||won||event.button!==0||origin)return;
    event.preventDefault();
    stick.setPointerCapture(event.pointerId);
    origin={id:event.pointerId,x:event.clientX,y:event.clientY};
    const bounds=stick.getBoundingClientRect();
    stick.style.setProperty('--origin-x',`${origin.x-bounds.left}px`);
    stick.style.setProperty('--origin-y',`${origin.y-bounds.top}px`);
    stick.style.setProperty('--dx','0px');
    stick.style.setProperty('--dy','0px');
    stick.classList.add('engaged');
  });
  stick.addEventListener('pointermove',event=>{
    if(event.pointerId!==origin?.id||!active||paused||won)return;
    const x=event.clientX-origin.x;
    const y=event.clientY-origin.y;
    const distance=Math.hypot(x,y);
    const travel=Math.min(1,24/(distance||1));
    stick.style.setProperty('--dx',`${x*travel}px`);
    stick.style.setProperty('--dy',`${y*travel}px`);
    const codes=[];
    if(distance>=9){
      if(Math.abs(x)>=distance*.42)codes.push(x<0?'ArrowLeft':'ArrowRight');
      if(Math.abs(y)>=distance*.42)codes.push(y<0?'ArrowUp':'ArrowDown');
    }
    update(event.pointerId,codes);
  });
  function haptic(event) {
    if(event.pointerType==='touch')navigator.vibrate?.(15);
  }
  for(const type of ['pointerup','pointercancel','lostpointercapture']){
    stick.addEventListener(type,event=>{if(event.pointerId===origin?.id)releaseStick();});
  }
  function bind(control,code) {
    control.addEventListener('pointerdown',event=>{
      if(!active||paused||won||event.button!==0)return;
      event.preventDefault();
      control.setPointerCapture(event.pointerId);
      update(event.pointerId,[code]);
      haptic(event);
    });
    for(const type of ['pointerup','pointercancel','lostpointercapture']){
      control.addEventListener(type,event=>update(event.pointerId,[]));
    }
  }
  for(const button of deck.querySelectorAll('[data-mobile-key]'))bind(button,button.dataset.mobileKey);
  for(const button of deck.querySelectorAll('.mobile-menu button'))button.addEventListener('pointerdown',haptic);
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
