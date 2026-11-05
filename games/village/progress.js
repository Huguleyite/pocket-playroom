// Progress is stored per picture; scene completion is derived from all four.
class VillageProgress{
 constructor(data,stored){this.data=data;this.entries={};for(const picture of data.pictures){const prior=stored?.pictures?.[picture.id];this.entries[picture.id]={filled:new Set((Array.isArray(prior?.filled)?prior.filled:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<picture.regions.length)),selected:prior?.selected>=1&&prior.selected<=8?prior.selected:1};}this.active=this.entries[stored?.active]?stored.active:data.pictures[0].id;}
 picture(id=this.active){return this.data.pictures.find(p=>p.id===id)}
 entry(id=this.active){return this.entries[id]}
 select(id){if(!this.entries[id])return false;this.active=id;return true}
 complete(id=this.active){return this.entry(id).filled.size===this.picture(id).regions.length}
 sceneComplete(){return this.data.pictures.every(p=>this.complete(p.id))}
 completedCount(){return this.data.pictures.filter(p=>this.complete(p.id)).length}
 fill(index){const p=this.picture(),e=this.entry();if(!p.regions[index]||e.filled.has(index)||p.regions[index].c!==e.selected)return false;e.filled.add(index);return true}
 undo(index){return this.entry().filled.delete(index)}
 reset(){this.entry().filled.clear()}
 serialize(){return {active:this.active,pictures:Object.fromEntries(Object.entries(this.entries).map(([id,e])=>[id,{filled:[...e.filled],selected:e.selected}]))}}
}
if(typeof module!=='undefined')module.exports=VillageProgress;
