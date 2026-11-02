(() => {
  const milestones = [3,7,14,30];
  window.celebrateStreak = (id,day,count,dialog) => {
    if (!dialog || window.PocketChallenge?.incoming || day!==PocketDay.today()) return;
    const themes={lock:['🔓','Days unlocked'],binario:['✦','Days in balance'],shift:['◆','Days connected']};
    const [symbol,label]=themes[id];
    let panel=dialog.querySelector('.streak-celebration');
    if(!panel){panel=document.createElement('div');panel.className='streak-celebration';panel.setAttribute('role','status');dialog.querySelector('h2')?.after(panel);}
    panel.replaceChildren();
    const title=document.createElement('strong');title.textContent=`${symbol} ${count} ${label.toLowerCase().replace('days',count===1?'day':'days')}`;
    const copy=document.createElement('span');copy.textContent=milestones.includes(count)?`${count}-day milestone! A little play, every day.`:'Daily puzzle complete. Your streak is growing.';
    panel.append(title,copy);
    const key=`pocket-playroom:streak-celebrated:${id}:${day}`;
    let first=true;try{first=!localStorage.getItem(key);localStorage.setItem(key,'true');}catch{}
    panel.classList.toggle('milestone',milestones.includes(count));
    panel.classList.toggle('celebrate',first);
  };
})();
