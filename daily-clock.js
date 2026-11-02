/* One daily boundary across Pocket Playroom, including daylight saving time. */
(() => {
  const formatter = new Intl.DateTimeFormat('en-CA', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'});
  window.PocketDay = {
    today(date = new Date()) {
      if (window.PocketChallenge?.incoming) return window.PocketChallenge.incoming.day;
      const parts = Object.fromEntries(formatter.formatToParts(date).map(p => [p.type,p.value]));
      return `${parts.year}-${parts.month}-${parts.day}`;
    },
    previous(day) { return new Date(Date.parse(day+'T12:00:00Z')-86400000).toISOString().slice(0,10); }
  };
})();
