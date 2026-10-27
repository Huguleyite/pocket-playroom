(()=>{
 const button=document.createElement('button');button.id='focus-view';button.textContent='Closer';button.setAttribute('aria-pressed','false');button.title='Bring the board forward';
 document.querySelector('#compact-view').after(button);
 let manual=false,category='';
 const help=document.querySelector('#help');help.textContent='? Help';document.querySelector('.journey').append(help);
 function measureChrome(){const height=document.querySelector('.view-tools').getBoundingClientRect().height+document.querySelector('.journey').getBoundingClientRect().height;document.body.style.setProperty('--play-chrome',`${height}px`)}
 const observer=new ResizeObserver(measureChrome);observer.observe(document.querySelector('.view-tools'));observer.observe(document.querySelector('.journey'));
 function closer(){document.body.classList.remove('desktop');document.body.classList.add('focus');document.querySelector('#compact-view').setAttribute('aria-pressed','false');document.querySelector('#desktop-view').setAttribute('aria-pressed','false');button.setAttribute('aria-pressed','true')}
 button.onclick=()=>{manual=true;closer()};
 for(const id of ['compact-view','desktop-view'])document.querySelector('#'+id).addEventListener('click',()=>{manual=true;document.body.classList.remove('focus');button.setAttribute('aria-pressed','false')},true);
 function auto(){const next=innerWidth>=580&&innerWidth<1200&&innerHeight>=450?'fold':'other';if(next!==category){manual=false;category=next}if(manual)return;if(next==='fold')closer();else {document.body.classList.remove('focus','desktop');button.setAttribute('aria-pressed','false');document.querySelector('#compact-view').setAttribute('aria-pressed','true');document.querySelector('#desktop-view').setAttribute('aria-pressed','false')}}
 addEventListener('resize',auto);auto();measureChrome();
})();
