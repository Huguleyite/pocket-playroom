/* Collection presentation only. Move existing nodes; retain game listeners and saves. */
(() => {
  if (parent === window) return;
  const id=location.pathname.match(/games\/([^/]+)\//)?.[1];
  const layouts={
    weave:['#board',['.goal','main > progress','#start','.controls','#message','#peek','#peekWord']],
    tide:['#boardWrap',['#word','#message','#hint','.actions']],
    shift:['main > .board',['.legend','#shiftlock-status','main > .controls','#shiftlock-answer','.keyboard']],
    lock:['#safe',['#feedback','.proximity','.section-title','#words','#bonus']],
    deli:['#ticket',['#feedback','#tray','#start']],
    binario:['#board',['#legend','#status','.controls','#hint-text','#instruction','#reset']],
    futoshiki:['#board',['#status','.digit-dock','.board-actions','#results']],
    signal:['#board',['.legend','#instruction','.puzzle-actions','#answer-note','#status']]
  };
  const layout=layouts[id],main=document.querySelector('main');
  if(!layout||!main)return;
  const board=main.querySelector(layout[0]);if(!board)return;
  document.documentElement.classList.add('pocket-fit');
  document.body.dataset.pocketGame=id;
  const stage=document.createElement('section');stage.className='pocket-stage';
  stage.setAttribute('aria-label','Game board and controls');
  const boardColumn=document.createElement('div');boardColumn.className='pocket-board-column';
  const actions=document.createElement('div');actions.className='pocket-actions';
  const nodes=[...new Set(layout[1].flatMap(selector=>[...main.querySelectorAll(selector)]))];
  if(id==='weave')nodes.sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);
  if(id==='deli'){
    const sound=document.getElementById('sound'),round=main.querySelector('.roundControls');
    if(sound&&round)round.append(sound);
  }
  board.before(stage);boardColumn.append(board);stage.append(boardColumn,actions);
  for(let node of nodes){
    // Tile Tide's hint has a presentation wrapper; move that wrapper too.
    if(id==='tide'&&node.id==='hint')node=node.parentElement;
    actions.append(node);
  }
  let queued=false,lastSize=-1,lastHeight=-1;
  const queue=()=>{if(!queued){queued=true;requestAnimationFrame(fit);}};
  function fit(){
    queued=false;
    const wide=innerWidth>=580;
    stage.classList.toggle('pocket-wide',wide);
    let available=innerHeight;
    try{
      const frame=window.frameElement;
      const viewport=parent.visualViewport?.height||parent.innerHeight;
      const frameTop=frame.getBoundingClientRect().top;
      const top=frameTop+parent.scrollY;
      const anchor=parent.document.getElementById('mobile-ad-anchor');
      const reserve=anchor&&!anchor.hidden?anchor.getBoundingClientRect().height:0;
      available=Math.max(100,viewport-top-reserve-12);
      const visibleTop=Math.max(0,-frameTop),visibleBottom=Math.min(innerHeight,viewport-frameTop);
      document.documentElement.style.setProperty('--pocket-dialog-top',visibleTop+12+'px');
      document.documentElement.style.setProperty('--pocket-dialog-height',Math.max(80,visibleBottom-visibleTop-24)+'px');
    }catch{}
    const top=stage.getBoundingClientRect().top+scrollY;
    const actionsHeight=actions.getBoundingClientRect().height;
    const width=boardColumn.clientWidth;
    const minimum={weave:192,tide:225,shift:215,binario:252,futoshiki:235,signal:264,lock:180,deli:180}[id];
    const budget=available-top-(wide?0:actionsHeight+10)-10;
    const size=Math.floor(Math.min(width,Math.max(minimum,budget),wide?460:440));
    if(size!==lastSize){lastSize=size;document.documentElement.style.setProperty('--pocket-board-size',size+'px');}
    // The parent already accepts natural-height messages. Include secondary content.
    const height=Math.ceil(main.getBoundingClientRect().bottom+scrollY+12);
    if(height!==lastHeight){lastHeight=height;parent.postMessage({type:'room:height',height},location.origin);}
  }
  new ResizeObserver(queue).observe(main);
  new ResizeObserver(queue).observe(actions);
  new MutationObserver(queue).observe(main,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden','class']});
  addEventListener('resize',queue);
  parent.addEventListener('resize',queue);
  parent.addEventListener('scroll',queue,{passive:true});
  new MutationObserver(queue).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
  parent.visualViewport?.addEventListener('resize',queue);
  addEventListener('room:night',queue);
  document.fonts?.ready.then(queue);
  queue();
})();
