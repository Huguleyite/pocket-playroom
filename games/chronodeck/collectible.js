export const COLLECTIBLE_ART = './assets/cards/the-last-word.png';
export async function exportCollectible(award, wallpaper = false, share = false) {
  const image = new Image(); image.src = COLLECTIBLE_ART; await image.decode();
  const canvas = document.createElement('canvas'); canvas.width = 1440; canvas.height = wallpaper ? 2560 : 2160;
  const c = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  c.fillStyle = '#060d19'; c.fillRect(0, 0, w, h);
  const scale = Math.max(w / image.width, h / image.height);
  c.drawImage(image, (w-image.width*scale)/2, (h-image.height*scale)/2, image.width*scale, image.height*scale);
  const shade = c.createLinearGradient(0, 0, 0, h);
  shade.addColorStop(0, '#040a18e8'); shade.addColorStop(.25, '#040a1800'); shade.addColorStop(.6, '#040a1800'); shade.addColorStop(1, '#040a18ff');
  c.fillStyle = shade; c.fillRect(0, 0, w, h);
  c.strokeStyle = '#e5ca88'; c.lineWidth = 4; c.strokeRect(36, 36, w-72, h-72);
  c.textAlign = 'center'; c.fillStyle = '#7af3ec'; c.font = '24px sans-serif'; c.fillText('CHRONODECK: BREACH  /  FIRST CLEAR', w/2, wallpaper ? 320 : 130);
  c.fillStyle = '#f8e9bf'; c.font = 'bold 88px serif'; c.fillText('THE LAST WORD', w/2, h-440);
  c.font = '30px sans-serif'; c.fillStyle = '#e5eef8';
  ['Erase one enemy from the timeline.', 'Act final bosses lose half their remaining HP.', 'Recharges after clearing 3 subsequent floors.'].forEach((line,i) => c.fillText(line, w/2, h-345+i*48));
  c.font = '24px sans-serif'; c.fillStyle = '#edd59b';
  c.fillText(award.name ? `Earned by ${award.name.slice(0,32)}` : 'THREE ACTS. ONE TIMELINE RECLAIMED.', w/2, h-155);
  c.font = '18px monospace'; c.fillStyle = '#a8bbcd';
  c.fillText(`${new Date(award.earnedAt).toLocaleDateString()}  /  ${award.id}`, w/2, h-107);
  c.fillText('Browser-local collectible · Artwork does not unlock gameplay', w/2, h-72);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw Error('Could not create the image. Please try again.');
  const filename = `chronodeck-the-last-word-${wallpaper ? 'wallpaper' : 'card'}.png`;
  const file = new File([blob], filename, {type:'image/png'});
  if (share && navigator.canShare?.({files:[file]})) {
    try { await navigator.share({title:'The Last Word — ChronoDeck',files:[file]}); return; }
    catch(error) { if(error.name === 'AbortError') return; }
  }
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
