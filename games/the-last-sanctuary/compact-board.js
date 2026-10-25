/* Optional smaller battlefield. Artwork and rules are shared with the full study. */
(function(root,factory){const config=factory(typeof location==='undefined'?'':location.search);if(typeof module==='object'&&module.exports)module.exports=config;else root.CrownBoard=config;})(typeof window==='undefined'?globalThis:window,function(search){
 'use strict';
 const scenario=new URLSearchParams(search).get('play')==='battle';
 const enabled=!scenario&&new URLSearchParams(search).get('board')==='compact';
 const minQ=scenario?-4:enabled?-2:-3,maxQ=scenario?4:enabled?2:3,minR=scenario?-3:-2,maxR=scenario?3:2;
 const forests=new Set(['-3,-2','-2,-2','-3,-1','3,1','3,2']);
 function contains(q,r){return Number.isInteger(q)&&Number.isInteger(r)&&q>=minQ&&q<=maxQ&&r>=minR&&r<=maxR;}
 function type(q,r){if(!contains(q,r))return null;if(r===0)return q===0?'bridge':scenario&&q===-2?'land':'water';if(forests.has(q+','+r))return 'forest';if(q===2&&r===-2)return 'ruin';if(q===1&&r===(scenario?-3:-2))return 'shrine';return 'land';}
 // Keep labels identical between layouts so a saved move remains recognizable.
 function label(q,r){return contains(q,r)?(scenario?'ABCDEFG'[r+3]:'ABCDE'[r+2])+(q+(scenario?5:4)):null;}
 return Object.freeze({enabled,id:enabled?'compact':'full',minQ,maxQ,minR,maxR,count:(maxQ-minQ+1)*(maxR-minR+1),contains,type,label,starts:Object.freeze({mage:Object.freeze(scenario?[-1,3]:[-2,1]),guardian:Object.freeze(scenario?[0,3]:[0,1])}),cottage:Object.freeze([-2,-1]),frame:Object.freeze({width:scenario?19.5:enabled?12:15.6,depth:scenario?13.5:9.9,centerX:0,centerZ:0}),view:Object.freeze({desktopSpan:10.5,mobileWidth:scenario?21:enabled?14:16.8}),physicalAreaReduction:enabled?1-12/15.6:0});
});
