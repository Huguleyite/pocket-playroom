/* Pointer-only preview controller. Game actions remain behind their existing confirmation. */
'use strict';
window.CrownDrag=(()=>{
 function setup(options){
  const {element,pickUnit,pickTile,selectUnit,chooseTile,isValidDrop,isBusy=()=>false,imageForUnit=()=>null,labelForUnit=id=>id,notify=()=>{}}=options;
  if(!element||![pickUnit,pickTile,selectUnit,chooseTile,isValidDrop].every(f=>typeof f==='function'))throw new TypeError('CrownDrag needs a board and selection callbacks.');
  let active=null,suppress=null,destroyed=false;const priorTouchAction=element.style.touchAction;
  element.style.touchAction='none';
  if(!document.querySelector('#crown-drag-style')){const style=document.createElement('style');style.id='crown-drag-style';style.textContent=`
   .crown-drag-ghost{position:fixed;left:0;top:0;z-index:1000;pointer-events:none;transform:translate(-50%,-100%);display:grid;justify-items:center;filter:drop-shadow(0 8px 10px #0009);opacity:.87;max-width:150px}
   .crown-drag-ghost img{display:block;height:112px;max-width:115px;object-fit:contain}.crown-drag-ghost span{padding:5px 9px;background:#102d2b;border:1px solid #87dfcd;color:#d7fff5;font:12px Georgia,serif;white-space:nowrap;border-radius:3px}.crown-drag-ghost[data-valid=false] span{border-color:#d9b47d;color:#ffe1b1}
   [data-dragging=true]{cursor:grabbing!important;user-select:none;-webkit-user-select:none}
  `;document.head.append(style);}
  function clear(){const old=active;active=null;if(!old)return;old.ghost?.remove();delete element.dataset.dragging;try{if(element.hasPointerCapture(old.pointer))element.releasePointerCapture(old.pointer);}catch(_){}return old;}
  function suppressClick(event){suppress={until:performance.now()+650,x:event.clientX,y:event.clientY};}
  function cancel(){if(active?.dragging)suppressClick(active.lastEvent);clear();}
  function move(event){
   if(!active||event.pointerId!==active.pointer)return;active.lastEvent=event;
   if(isBusy()){cancel();return;}
   if(!active.dragging){if(Math.hypot(event.clientX-active.x,event.clientY-active.y)<active.threshold)return;
    active.dragging=true;element.dataset.dragging='true';try{element.setPointerCapture(active.pointer);}catch(_){}
    const ghost=document.createElement('div');ghost.className='crown-drag-ghost';ghost.setAttribute('aria-hidden','true');const src=imageForUnit(active.id);
    if(src){const img=document.createElement('img');img.src=src;img.alt='';img.draggable=false;ghost.append(img);}
    const caption=document.createElement('span');ghost.append(caption);document.body.append(ghost);active.ghost=ghost;active.caption=caption;
   }
   const tile=pickTile(event);active.tile=tile;active.valid=!!tile&&isValidDrop(active.id,tile);
   active.ghost.style.left=`${event.clientX}px`;active.ghost.style.top=`${event.clientY-(active.touch?36:12)}px`;active.ghost.dataset.valid=String(active.valid);active.caption.textContent=active.valid?'Release to preview':'Choose an open hex';
  }
  function down(event){
   if(destroyed||active||isBusy()||event.isPrimary===false||event.button!==0)return;
   if(event.target.closest?.('a,[data-render-mode],#camera,#reset'))return;
   const id=pickUnit(event);if(!id)return;
   active={id,pointer:event.pointerId,x:event.clientX,y:event.clientY,threshold:event.pointerType==='touch'?12:8,touch:event.pointerType==='touch',dragging:false,lastEvent:event};
  }
  function up(event){
   if(!active||event.pointerId!==active.pointer)return;
   const wasDragging=active.dragging;
   if(wasDragging){move(event);if(!active)return;suppressClick(event);}
   const touchTap=!wasDragging&&active.touch;
   if(touchTap)suppressClick(event);
   const ended=clear();if(!ended)return;
   if(touchTap&&!isBusy()){selectUnit(ended.id);return;}
   if(!wasDragging)return;
   if(isBusy())return;
   if(ended.valid){selectUnit(ended.id);chooseTile(ended.tile);notify(`${labelForUnit(ended.id)}: destination previewed. Confirm the order to move.`);}
   else notify('No move made. Drop on an available land hex.');
  }
  function cancelled(event){if(event.type==='lostpointercapture'&&event.target!==element)return;if(active&&event.pointerId===active.pointer)cancel();}
  function click(event){if(suppress&&performance.now()<suppress.until&&Math.hypot(event.clientX-suppress.x,event.clientY-suppress.y)<45){event.preventDefault();event.stopImmediatePropagation();suppress=null;}}
  function key(event){if(event.key==='Escape'&&active){event.preventDefault();cancel();}}
  element.addEventListener('pointerdown',down,true);element.addEventListener('pointermove',move,{passive:false});element.addEventListener('pointerup',up);element.addEventListener('pointercancel',cancelled);element.addEventListener('lostpointercapture',cancelled);element.addEventListener('click',click,true);document.addEventListener('keydown',key);
  return {cancel,snapshot:()=>({active:!!active,dragging:!!active?.dragging,unit:active?.id||null,valid:!!active?.valid,hasGhost:!!active?.ghost}),destroy(){cancel();destroyed=true;element.style.touchAction=priorTouchAction;element.removeEventListener('pointerdown',down,true);element.removeEventListener('pointermove',move);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',cancelled);element.removeEventListener('lostpointercapture',cancelled);element.removeEventListener('click',click,true);document.removeEventListener('keydown',key);}};
 }
 return {setup};
})();
