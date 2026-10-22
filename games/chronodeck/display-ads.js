/** Desktop display-ad lifecycle. No network, subscription or API dependency.
 * Optional provider: window.ChronoDeckDisplayAds = { render, refresh, destroy }.
 * render(slot, {size, signal}); refresh(slot, {size, signal}); destroy(slot).
 */
const REFRESH_MS = 45000, IDLE_MS = 120000;
const slots = [...document.querySelectorAll('[data-display-ad]')];
const visible = new Set(), mounted = new Set(), timers = new Map(), controllers = new Map();
let observer, idleTimer, geometryFrame, lastActivity = Date.now(), focused = document.hasFocus(), stopped = false;
document.body.classList.add('desktop-ads');
function phaseAllowsAds() {
  const screen = document.getElementById('screen');
  if (document.querySelector('dialog[open]:not(#screen)')) return false;
  return screen.open ? screen.dataset.view === 'map' : document.body.dataset.runStage === 'combat';
}
function engaged() { return !stopped && focused && document.visibilityState === 'visible' && Date.now() - lastActivity < IDLE_MS && phaseAllowsAds(); }
function sizeOf(slot) { return `${slot.clientWidth}x${slot.clientHeight}`; }
function report(slot, type) { slot.dispatchEvent(new CustomEvent(`chronodeck:ad-${type}`, { bubbles: true, detail: { slot: slot.dataset.displayAd, size: slot.dataset.adSize, refreshSeconds: REFRESH_MS / 1000 } })); }
function invoke(method, slot) {
  try { Promise.resolve(window.ChronoDeckDisplayAds?.[method]?.(slot, { size: slot.dataset.adSize, signal: controllers.get(slot)?.signal })).catch(() => {}); }
  catch { /* An unavailable provider never interrupts a turn. */ }
}
function unmount(slot) {
  controllers.get(slot)?.abort(); controllers.delete(slot);
  if (mounted.delete(slot)) invoke('destroy', slot);
  clearTimeout(timers.get(slot)); timers.delete(slot);
}
function schedule(slot) {
  if (timers.has(slot)) return;
  timers.set(slot, setTimeout(() => {
    timers.delete(slot);
    if (!engaged() || !visible.has(slot) || !slot.getClientRects().length) return;
    invoke('refresh', slot); report(slot, 'refresh'); schedule(slot);
  }, REFRESH_MS));
}
function sync() {
  const active = engaged();
  for (const slot of slots) {
    if (active && visible.has(slot) && slot.getClientRects().length) {
      if (!mounted.has(slot)) {
        mounted.add(slot); controllers.set(slot, new AbortController()); invoke('render', slot); report(slot, 'render');
      }
      schedule(slot);
    } else { clearTimeout(timers.get(slot)); timers.delete(slot); }
  }
}
function updateGeometry() {
  geometryFrame = null;
  const app = document.querySelector('.app'), rect = app.getBoundingClientRect();
  document.documentElement.style.setProperty('--game-left', `${rect.left}px`);
  document.documentElement.style.setProperty('--game-width', `${rect.width}px`);
  document.documentElement.style.setProperty('--game-top', `${Math.max(8, rect.top)}px`);
  for (const slot of slots) {
    if (!slot.getClientRects().length) { visible.delete(slot); unmount(slot); continue; }
    const size = sizeOf(slot);
    if (slot.dataset.adSize !== size) { unmount(slot); slot.dataset.adSize = size; }
  }
  sync();
}
function queueGeometry() { if (!geometryFrame) geometryFrame = requestAnimationFrame(updateGeometry); }
function activity(event) {
  if (event && !event.target.closest?.('.app, #screen')) return;
  const now = Date.now(); if (now - lastActivity < 1000 && event?.type === 'pointermove') return;
  lastActivity = now; clearTimeout(idleTimer); idleTimer = setTimeout(sync, IDLE_MS); sync();
}
function start() {
  stopped = false; focused = document.hasFocus(); lastActivity = Date.now();
  updateGeometry();
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= .5) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      sync();
    }, { threshold: [0, .5, 1] });
    slots.forEach(slot => observer.observe(slot));
  } // Without viewability observation, leave placeholders and skip provider requests.
  clearTimeout(idleTimer); idleTimer = setTimeout(sync, IDLE_MS);
}
for (const event of ['pointerdown', 'pointermove', 'keydown']) document.addEventListener(event, activity, { passive: true });
window.addEventListener('focus', () => { focused = true; activity(); });
window.addEventListener('blur', () => { focused = false; sync(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') activity(); else sync(); });
window.addEventListener('resize', queueGeometry);
window.addEventListener('scroll', queueGeometry, { passive: true });
new MutationObserver(sync).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open', 'data-run-stage', 'data-view'] });
window.addEventListener('pagehide', () => {
  stopped = true; observer?.disconnect(); visible.clear(); clearTimeout(idleTimer); cancelAnimationFrame(geometryFrame); geometryFrame = null;
  slots.forEach(unmount);
});
window.addEventListener('pageshow', event => { if (event.persisted) start(); });
start();
