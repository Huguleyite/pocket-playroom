(() => {
  if (parent === window) return;
  document.documentElement.classList.add('spot-embedded');
  let previous, queued;
  function fit() {
    queued = false;
    const frame = window.frameElement;
    if (!frame) return;
    const viewport = parent.visualViewport?.height || parent.innerHeight;
    const top = frame.getBoundingClientRect().top + parent.scrollY;
    const anchor = parent.document.getElementById('mobile-ad-anchor');
    const reserve = anchor && !anchor.hidden ? anchor.getBoundingClientRect().height : 0;
    const height = Math.max(300,Math.floor(viewport - top - reserve - 12));
    if (height === previous) return;
    previous = height;
    parent.postMessage({type:'room:height',height},location.origin);
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(fit); }
  }
  parent.addEventListener('resize',schedule);
  parent.visualViewport?.addEventListener('resize',schedule);
  const observer = new ResizeObserver(schedule);
  observer.observe(parent.document.body);
  window.addEventListener('pagehide',() => {
    parent.removeEventListener('resize',schedule);
    parent.visualViewport?.removeEventListener('resize',schedule);
    observer.disconnect();
  });
  schedule();
})();
