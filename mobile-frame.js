/* Match the page viewport, not the iframe width: desktop boards are narrow too. */
(() => {
  if (window.parent === window) return;
  let mobile;
  try { mobile = window.parent.matchMedia('(max-width:600px)'); } catch { return; }
  const update = () => document.documentElement.classList.toggle('room-mobile', mobile.matches);
  update();
  mobile.addEventListener('change', update);
})();
