/* Each independently completed puzzle owns exactly one permanent mosaic piece. */
const Keepsake=(()=>{
 const titles={home:'A Thousand Little Evenings',space:'The Garden Between Stars'};
 const tileFor=index=>(index*13+7)%36;
 const solvedIndices=(book,theme)=>Array.from({length:36},(_,i)=>i).filter(i=>book.puzzles?.[`${theme}-${i}`]?.solved===true);
 function sync(book,theme,now=()=>new Date().toISOString(),id=()=>crypto.randomUUID()){
  const solved=solvedIndices(book,theme);
  if(solved.length===36&&!book.collectible)book.collectible={id:id(),earnedAt:now(),title:titles[theme]};
  return {solved,tiles:solved.map(tileFor),award:book.collectible||null};
 }
 async function exportImage({art,title,award,theme,wallpaper=false}){
  if(!award)throw Error('Complete all 36 pictures to collect this image.');
  const image=new Image();image.src=art;await image.decode();
  const canvas=document.createElement('canvas');canvas.width=1440;canvas.height=wallpaper?2560:2160;
  const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.fillStyle='#07121e';c.fillRect(0,0,w,h);
  const scale=Math.max(w/image.width,h/image.height);c.drawImage(image,(w-image.width*scale)/2,(h-image.height*scale)/2,image.width*scale,image.height*scale);
  const shade=c.createLinearGradient(0,h*.58,0,h);shade.addColorStop(0,'#06112000');shade.addColorStop(1,'#061120fa');c.fillStyle=shade;c.fillRect(0,0,w,h);
  c.strokeStyle=theme==='space'?'#9ae8f6':'#ecc783';c.lineWidth=3;c.strokeRect(35,35,w-70,h-70);c.textAlign='center';c.fillStyle='#fff0cc';c.font='bold 62px Georgia';c.fillText(title,w/2,h-245,w-140);
  c.fillStyle='#d5e8ee';c.font='26px sans-serif';c.fillText(`${theme==='space'?'DEEP SPACE DECODER':'WINDOW LIGHTS'} · 36 PICTURES DISCOVERED`,w/2,h-175);
  c.font='22px sans-serif';c.fillText(`Collected ${new Date(award.earnedAt).toLocaleDateString()}`,w/2,h-125);
  c.font='17px monospace';c.fillText(award.id,w/2,h-85);c.font='16px sans-serif';c.fillText('A browser-local keepsake',w/2,h-55);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Image could not be created. Please try again.');
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${theme==='space'?'deep-space-decoder':'window-lights'}-${wallpaper?'wallpaper':'collectible'}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
 }
 return {titles,tileFor,solvedIndices,sync,exportImage};
})();
if(typeof module!=='undefined')module.exports=Keepsake;
