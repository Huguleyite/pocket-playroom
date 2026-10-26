import {regionalPuzzles} from './regional-puzzles.mjs';
const grid=[[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[3,6],[4,7],[5,8],[6,7],[7,8],[0,4],[4,8]];
const names=['Harbor HQ','Pine Ridge','Lighthouse','Orchard','Market','Cliff House','Marsh End','Ferry Dock','Observatory'];
const positions=[[14,16],[50,12],[86,18],[14,45],[50,44],[86,46],[14,70],[50,70],[86,70]];
function level(title,needs,backup,intro,walkthrough,custom){return {title,intro,walkthrough,nodes:[...needs].map((v,i)=>({name:names[i],need:+v,backup:i===backup,x:positions[i][0],y:positions[i][1]})),edges:custom||grid.filter(e=>e.every(v=>v<needs.length))};}
export const puzzles=[
 level('First contact','13121',-1,'Start at Pine Ridge: it needs 3 connections and has only 3 possible links. Tap a dashed link to connect it. Tap again to rule it out.', 'Pine Ridge needs every available link: HQ, Lighthouse and Orchard. Orchard then needs Market. HQ and Market are satisfied, so their direct link stays inactive.',[[0,1],[1,2],[1,3],[3,4],[0,4]]),
 level('The long way home','222222',-1,'Every station needs 2. A closed group is not enough: everyone must reach Harbor HQ.', 'Pine Ridge needs HQ and Lighthouse; Market needs Orchard and Cliff House. HQ–Lighthouse would close a separate triangle, so rule it out. HQ must reach Orchard and Lighthouse must reach Cliff House. The two halves now form one loop.',[[0,1],[1,2],[2,0],[3,4],[4,5],[5,3],[0,3],[2,5]]),
 level('Orchard dispatch','1222221',-1,'One connection can open the whole valley. Begin with the stations that have the fewest options.', 'Marsh End has only Orchard, forcing that link. Lighthouse forces Pine Ridge and Cliff House. Cliff House forces Market. HQ has just one connection: avoid sealing the eastern stations away; connect HQ to Pine Ridge, then Orchard to Market.'),
 level('Ferry crossing','22233121',-1,'The ferry is waiting. Connect eight communities to the same headquarters.', 'Lighthouse forces Pine Ridge and Cliff House. Cliff House is full. Orchard needs all three candidates: HQ, Market and Marsh End. Marsh End then needs Ferry Dock, filling the ferry. Market must reach Pine Ridge and HQ; Pine Ridge is full, ruling out HQ–Pine.'),
 level('Across the inlet','231331221',-1,'Trace the consequences of a satisfied station before adding another connection.', 'Pine Ridge needs all three links: HQ, Lighthouse and Market. Lighthouse is full. Orchard needs HQ, Market and Marsh; HQ is full. Marsh forces Ferry. Cliff House cannot reach the network through Observatory alone: Observatory has only one connection, so Market–Cliff is forced. Market is now full; Ferry connects Observatory.'),
 level('A second way home','222132',1,'Pine Ridge: Backup required. This station must stay connected if any one link fails.', 'Lighthouse forces Pine and Cliff. Orchard needs one, so it cannot carry a backup route. Pine must connect directly to HQ, rather than via Market. HQ then needs Market. Market needs Cliff and Orchard to finish the protected loop.'),
 level('Keep the ferry talking','22223122',3,'Orchard needs a backup route. Two routes may share stations, but never a link.', 'Marsh and Ferry force the three southern links. Orchard already reaches Marsh, so its other link must reach HQ; connecting only through Market would leave a vulnerable route to HQ. Lighthouse forces Pine and Cliff. Cliff is full; Market connects Pine and Ferry, and Pine completes HQ.'),
 level('The resilient coast','322232112',8,'The Observatory must stay on air after any single link fails. Bring the whole coast home.', 'HQ needs all three links. Lighthouse forces Pine and Cliff, filling Pine. Orchard–Market would fill Orchard and strand Marsh or leave the Observatory behind a bridge; rule it out and connect Orchard–Marsh. Market–Cliff would close the upper loop, leaving Observatory connected through Market alone. Rule it out. Market must connect Ferry and Observatory; Cliff then connects Observatory, completing both backup routes.')
];


puzzles[0].nodes.forEach((n,i)=>{[n.x,n.y]=[[18,22],[53,22],[84,22],[53,69],[18,69]][i];});
puzzles[1].nodes.forEach((n,i)=>{[n.x,n.y]=[[15,18],[15,72],[39,45],[85,18],[85,72],[61,45]][i];});

puzzles.forEach((p,i)=>{p.region=0;p.difficulty=i<2?"Training":i<5?"Gentle":"Thoughtful";});
puzzles.push(...regionalPuzzles);
