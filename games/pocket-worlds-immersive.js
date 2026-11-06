(() => {
 const body = document.body;
 const expandButton = document.querySelector('#expandCanvas');
 const hideButton = document.querySelector('#hideColorControls');
 const showButton = document.querySelector('#restoreColorControls');
 const canvas = document.querySelector('#art');

 function expanded() {
  return body.classList.contains('canvas-expanded');
 }

 function setHidden(hidden) {
  if (hidden && !expanded()) expandButton.click();
  body.classList.toggle('controls-hidden', hidden);
  showButton.hidden = !hidden;
  (hidden ? showButton : hideButton).focus({ preventScroll: true });
 }

 hideButton.addEventListener('click', () => setHidden(true));
 showButton.addEventListener('click', () => setHidden(false));
 expandButton.addEventListener('click', () => {
  if (!expanded() && body.classList.contains('controls-hidden')) setHidden(false);
 });

 // Keep the SVG at screen-fill framing when entering the controls-free viewer.
 document.querySelector('#hideTools').addEventListener('click', () => {
  if (mode === 'picture') frameView(true);
 });
 document.querySelector('#showTools').addEventListener('click', () => {
  if (mode === 'picture') resetView();
 });

 document.addEventListener('keydown', event => {
  if (mode !== 'coloring' || document.querySelector('dialog[open]')) return;
  if (event.key.toLowerCase() === 'h' && !event.altKey && !event.ctrlKey && !event.metaKey) {
   event.preventDefault();
   setHidden(!body.classList.contains('controls-hidden'));
  } else if (event.key === 'Escape' && body.classList.contains('controls-hidden')) {
   setHidden(false);
  }
 });

 function reportCanvas() {
  if (parent === window) return;
  const { width, height } = canvas.getBoundingClientRect();
  parent.postMessage({
   type: 'pocket-preview-size',
   url: location.href,
   viewport: [innerWidth, innerHeight],
   canvas: [Math.round(width), Math.round(height)],
  }, '*');
 }
 new ResizeObserver(reportCanvas).observe(canvas);
 window.addEventListener('resize', reportCanvas);
})();
