'use strict';
(() => {
  const $ = s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let renderer, scene, camera, miniRenderer, miniScene, miniCamera, inspectedModel;
  let view=0, inspectorAngle=.35, inspectedUnit='mage', raf=0, lastFrame=0, announcementTimer;
  const models=window.CrownModels, T=window.THREE;
  const tiles=[],units={},tileByKey=new Map(), highlights=new T.Group(),previewFX=new T.Group(),liveFX=new T.Group();
  const scenario=new URLSearchParams(location.search).get('play')==='battle',playing=scenario||new URLSearchParams(location.search).get('play')==='skirmish',foes={};
 const createBattle=()=>scenario?SanctuaryBattle.create(tiles):CrownSkirmish.create(tiles);let battle=null,battleDisplay=null,feedback=null;
  const state={selected:'mage',card:null,target:null,mana:3,busy:false,ward:false,barriers:[],lastOrder:null};
  const cards={
    portal:{title:'Fold the Path',cost:2,copy:'Choose a distant, empty land hex. Seren will step through a portal to reach it.',detail:'2 mana · Seren moves · Range: 4 hexes',confirm:'Open the portal'},
    rampart:{title:'Living Rampart',cost:1,copy:'Choose an empty land hex within 3 hexes of Seren. Stone will rise to block it.',detail:'1 mana · Temporary terrain · No combat in this study',confirm:'Raise the rampart'},
    ward:{title:'Echo Ward',cost:1,copy:'Choose Aldric on the board or in your company. Preview a protective arcane shield.',detail:'1 mana · Shield guardian · Visual protection study',confirm:'Cast Echo Ward'}
  };
  const key=(q,r)=>`${q},${r}`;
  const dist=(a,b)=>{const ax=a.q-(a.r-(a.r&1))/2,bx=b.q-(b.r-(b.r&1))/2;return (Math.abs(ax-bx)+Math.abs(a.r-b.r)+Math.abs(ax+a.r-bx-b.r))/2;};
  const occupied=t=>Object.values(units).some(u=>u.tile===t&&u.model.visible)||Object.values(foes).some(u=>u.tile===t&&u.model.visible);
  const walkable=t=>t&&!t.blocked&&!t.barrier&&t.type!=='water';
  const canTarget=(t,card=state.card)=>{
    if(playing&&battle){const enemy=Object.values(foes).find(u=>u.tile===t&&u.model.visible);if(enemy)return !card&&battle.legal(state.tactic==='press'?'press':'attack',state.selected,key(t.q,t.r));if(battle.snapshot().status!=='playing')return false;return battle.legal(card||'move',card?'mage':state.selected,key(t.q,t.r));}
    if(!walkable(t)||occupied(t))return false;
    const d=dist(units[card?'mage':state.selected].tile,t);
    return card==='portal'?d>1&&d<=4:card==='rampart'?d>=1&&d<=3&&t.type!=='bridge':!card&&d===1;
  };
  function notify(msg){if(playing&&$('#action-notice'))$('#action-notice').textContent=msg;$('#announcement').textContent=msg;$('#announcement').classList.add('visible');clearTimeout(announcementTimer);announcementTimer=setTimeout(()=>$('#announcement').classList.remove('visible'),8000);}
  function clearGroup(g){while(g.children.length){const item=g.children[0];item.userData.disposed=true;item.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(m.userData.transient)m.dispose();});}});g.remove(item);}}
  function ephemeral(color,opacity=1){const m=new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:T.DoubleSide,toneMapped:false});m.userData.transient=true;return m;}
  function ring(group,t,color=0x72e8d1,large=false){const m=ephemeral(color,large?.9:.38);const o=new T.Mesh(new T.RingGeometry(large?.79:.15,large?.85:.20,large?6:28),m);o.rotation.x=-Math.PI/2;o.rotation.z=Math.PI/6;o.position.set(t.x,t.y+.025,t.z);if(CrownTerrain.enabled){o.material.depthTest=false;o.material.opacity=.95;o.renderOrder=10;}group.add(o);return o;}
  function pos(t,y=0){return new T.Vector3(t.x,t.y+y+(CrownArchitecture.enabled&&t.type==='bridge'?CrownArchitecture.bridgeDeckOffset:0),t.z);}
  function seedRandom(seed){let a=seed;return()=>{a=(a*1664525+1013904223)>>>0;return a/4294967296;};}
  const rnd=seedRandom(6231);
  function setup(){
    try{
      renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
      $('#scene').append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
      scene=new T.Scene();scene.environment=CrownArt.studio(renderer);camera=new T.OrthographicCamera(-10,10,7,-7,.1,100);camera.position.set(3.5,16,20);camera.lookAt(0,.2,0);
      scene.add(new T.HemisphereLight(0xe3f3ec,0x273329,1.6));
      const sun=new T.DirectionalLight(0xffdfaa,3.2);sun.position.set(-7,16,7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;sun.shadow.bias=-.0005;sun.shadow.normalBias=.035;scene.add(sun);
      const fill=new T.DirectionalLight(0x72b8c6,1.0);fill.position.set(8,5,-8);scene.add(fill);
      const table=models.mesh(scene,new T.PlaneGeometry(200,200),models.mat(0x101c21,.05,.95),0,-.76,0);table.rotation.x=-Math.PI/2;
      makeBoard();scene.add(highlights,previewFX,liveFX);makeUnits();makeBoardButtons();if(playing)setupBattle();setupDrag();
      if(CrownRendering.enabled)CrownRendering.setup(renderer,scene,camera,tiles,units);
      renderer.domElement.addEventListener('click',onCanvasClick);
      renderer.domElement.addEventListener('pointermove',onCanvasHover);
      renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();notify('The 3D view paused. Reload this page to restore it.');});
      window.addEventListener('resize',resize);new ResizeObserver(resize).observe($('#scene'));
      resize();drawPreview();updateUI();if(CrownMiniatureStudy.enabled) $('.prototype-badge').textContent=CrownMiniatureStudy.mode==='company'?'THE COMPANY · 04':'MINIATURE STUDY · 03';if(CrownTerrain.enabled){$('.prototype-badge').textContent='TERRAIN STUDY · 06';$('#camera').disabled=true;$('#camera').textContent='Fixed terrain view';}if(CrownArchitecture.enabled)$('.prototype-badge').textContent='ARCHITECTURE STUDY · 08';if(CrownRendering.enabled)$('.prototype-badge').textContent=playing?(scenario?'BATTLE I · THE BROKEN CROSSING':'SKIRMISH · 16'):CrownBoard.enabled?'COMPACT CROSSING · 13':'THE LAST SANCTUARY · 13';$('#loading').style.display='none';$('#battlefield').dataset.ready='true';requestAnimationFrame(animate);
    }catch(e){if(CrownArchitecture.enabled)$('.prototype-badge').textContent='ARCHITECTURE STUDY · 08';if(CrownRendering.enabled)$('.prototype-badge').textContent=playing?(scenario?'BATTLE I · THE BROKEN CROSSING':'SKIRMISH · 16'):CrownBoard.enabled?'COMPACT CROSSING · 13':'THE LAST SANCTUARY · 13';$('#loading').style.display='none';$('#fallback').hidden=false;console.error(e);}
  }
  function makeBoard(){
    const {mesh,box,cylinder,mat,torus}=models;
    // A framed physical table with individually cast terrain tiles.
    const frameWidth=CrownBoard.frame.width;
    box(scene,mat(0x1b2626,.2,.6),0,-.48,0,frameWidth,.53,9.9);
    box(scene,mat(0x9c7b44,.7,.4),0,-.26,0,frameWidth-.1,.065,9.8);
    box(scene,mat(0x293b36,.2,.8),0,-.2,0,frameWidth-.3,.09,9.6);
    for(let x of [-frameWidth/2+.24,frameWidth/2-.24])box(scene,models.M.gold,x,-.10,0,.035,.03,9.4);
    for(let z of [-4.66,4.66])box(scene,models.M.gold,0,-.10,z,frameWidth-.45,.03,.035);
    // Small corner studs and inlaid ornaments.
    for(const x of [-frameWidth/2+.4,frameWidth/2-.4])for(const z of [-4.5,4.5]){cylinder(scene,models.M.gold,x,-.08,z,.075,.075,.06,16);}
    const side=mat(0x4a5140,.1,.95),base=mat(0x273b33,.1,1);
    const water=CrownArt.waterMaterial(),stone=CrownArt.stoneMaterial(),earth=mat(0x80715b,.1,.9);
    const forestSet=new Set(['-3,-2','-2,-2','-3,-1','3,1','3,2']);
    for(let r=CrownBoard.minR;r<=CrownBoard.maxR;r++)for(let q=CrownBoard.minQ;q<=CrownBoard.maxQ;q++){
      const x=Math.sqrt(3)*1.04*(q+.5*(r&1)),z=1.56*r;
      const type=CrownBoard.type(q,r);
      const h=type==='water'?.22:.33+(rnd()*.08),y=-.14+h/2;
      const top=type==='water'?water:type==='bridge'||type==='ruin'||type==='shrine'?stone:CrownArt.topMaterial();
      const tile=mesh(scene,new T.CylinderGeometry(1.015,1.02,h,6),[side,top,base],x,y,z);tile.rotation.y=Math.PI/6;
      const t={q,r,x,z,y:-.14+h,type,blocked:['forest','ruin','shrine'].includes(type),mesh:tile,label:CrownBoard.label(q,r)};tile.userData.tile=t;tiles.push(t);tileByKey.set(key(q,r),t);
      if(CrownTerrain.enabled){tile.visible=false;CrownTerrain.attach(scene,t);}
      const edge=new T.LineSegments(new T.EdgesGeometry(new T.CylinderGeometry(1.019,1.019,.012,6)),new T.LineBasicMaterial({color:0xbac49a,transparent:true,opacity:.26}));edge.position.set(x,t.y+.003,z);edge.rotation.y=Math.PI/6;if(CrownTerrain.enabled){edge.material.depthTest=false;edge.material.opacity=.16;edge.renderOrder=2;if(type==='water'||type==='bridge')edge.visible=false;}scene.add(edge);
      if(type==='forest'&&!CrownTerrain.enabled){
        for(let i=0;i<4;i++){let a=i*2.4;models.tree(scene,x+Math.cos(a)*.43,t.y,z+Math.sin(a)*.43,.65+rnd()*.35,i);}
        models.rock(scene,x-.55,t.y+.1,z+.3,.8);
      }
      if(type==='land'&&!CrownTerrain.enabled){
        if(rnd()>.65){for(let i=0;i<3;i++)models.rock(scene,x+.6+rnd()*.1,t.y+.08,z-.4+rnd()*.2,.35+rnd()*.5);}
        for(let i=0;i<4;i++){const gx=x+(rnd()-.5)*1.2,gz=z+(rnd()-.5)*1.2;const blade=mesh(scene,new T.ConeGeometry(.025,.13,3),mat(0x9caa75,.05,1),gx,t.y+.06,gz);blade.rotation.z=(rnd()-.5)*.5;}
      }
      if(type==='water'&&!CrownTerrain.enabled){
        for(let i=0;i<3;i++){const line=box(scene,mat(0x8bc6b9,.4,.3),x+(rnd()-.5)*.8,t.y+.006,z+(i-1)*.32,.3+rnd()*.2,.004,.012);line.rotation.y=.1;}
      }
      if(type==='ruin'&&!CrownArchitecture.enabled){
        for(let i=0;i<3;i++){box(scene,stone,x+(i-1)*.45,t.y+.32,z,.4,.64,.3);if(i!==1)box(scene,stone,x+(i-1)*.45,t.y+.79,z,.4,.29,.32);}
        for(let i=0;i<4;i++)models.rock(scene,x+(rnd()-.5)*1.2,t.y+.1,z+.5+(rnd()-.5)*.3,.7);
      }
      if(type==='shrine'&&!CrownArchitecture.enabled)makeShrine(t);
      if(CrownArchitecture.enabled&&['shrine','ruin'].includes(type))CrownArchitecture.attach(scene,type==='ruin'?'ruins':'shrine',t);
      if(!CrownTerrain.enabled)CrownArt.decorate(scene,t);
    }
    const bridge=tileByKey.get('0,0');
    if(CrownArchitecture.enabled)CrownArchitecture.attach(scene,'bridge',bridge);
    else for(let i=0;i<9;i++){const zz=bridge.z+(i-4)*.24;const yy=bridge.y+.12+Math.cos((i-4)/5*Math.PI/2)*.13;box(scene,stone,bridge.x,yy,zz,1.05,.16,.23);for(const side of [-1,1]){box(scene,stone,bridge.x+side*.56,yy+.21,zz,.14,.43,.22);}}
    // Distant scenery at opposite corners anchors the diorama without hiding objectives.
    for(const q of [-2,2]){
      const t=tileByKey.get(key(q,-1));const g=new T.Group();g.position.set(t.x,t.y,t.z);scene.add(g);
      if(q===-2&&CrownArchitecture.enabled)CrownArchitecture.attach(scene,'cottage',scenario?tileByKey.get('-3,2'):t);
      if(q===-2&&!CrownArchitecture.enabled){box(g,stone,0,.25,0,.44,.5,.42);const roof=mesh(g,new T.ConeGeometry(.43,.43,4),mat(0x535f56),0,.68,0);roof.rotation.y=Math.PI/4;box(g,models.M.wood,0,.15,.22,.13,.3,.02);}
    }
    // Two banks of lilies emphasize the river instead of adding busy particles.
    if(!CrownTerrain.enabled)for(const q of [-2,2]){const t=tileByKey.get(key(q,0));for(let i=0;i<3;i++){const leaf=cylinder(scene,mat(0x51866d),t.x-.4+i*.22,t.y+.009,t.z+.44,.08,.08,.009,10);}}
    CrownArt.finishBoard(scene,tiles,{bridge:!CrownArchitecture.enabled});if(CrownTerrain.enabled)CrownWater.build(scene,tiles);
  }
  function makeShrine(t){
    const {cylinder,mesh,torus}=models;
    cylinder(scene,models.M.stone,t.x,t.y+.08,t.z,.61,.7,.16,6);
    cylinder(scene,models.M.stone,t.x,t.y+.21,t.z,.43,.5,.13,6);
    cylinder(scene,models.M.gold,t.x,t.y+.37,t.z,.15,.25,.23,6);
    const gem=mesh(scene,new T.OctahedronGeometry(.24),models.M.crystal,t.x,t.y+.88,t.z);gem.scale.y=1.6;gem.userData.relic=true;
    const hoop=torus(scene,models.M.gold,t.x,t.y+.9,t.z,.46,.026);hoop.rotation.y=.3;
    for(const x of [-.57,.57]){cylinder(scene,models.M.stone,t.x+x,t.y+.65,t.z+.1,.09,.14,1.1,8);cylinder(scene,models.M.gold,t.x+x,t.y+1.2,t.z+.1,.14,.14,.06,8);}
  }
  function makeUnits(){
    for(const [id,start] of Object.entries(CrownBoard.starts)){
      const model=CrownMiniatureStudy.uses(id)?CrownMiniatureStudy.create(id):models[id]();model.rotation.y=Math.PI+.12;const tile=tileByKey.get(key(...start));model.position.copy(pos(tile));scene.add(model);model.traverse(o=>{if(o.isMesh)o.userData.unit=id;});units[id]={model,tile,start};
    }
  }
  function makeBoardButtons(){
    const root=$('#board-controls');
    for(const t of tiles){if(t.blocked||t.type==='water')continue;const b=document.createElement('button');b.className='hex-hit';b.dataset.hex=key(t.q,t.r);b.textContent=t.label;b.setAttribute('aria-label',`${t.label}: ${t.type==='bridge'?'stone bridge':'land hex'}`);b.addEventListener('click',()=>chooseTile(t));root.append(b);t.button=b;}
    for(const id of ['mage','guardian']){const b=document.createElement('button');b.className='hex-hit unit-label';b.dataset.unit=id;b.textContent=id==='mage'?'✧ Seren':'⛨ Aldric';b.setAttribute('aria-label',`Select ${id==='mage'?'Seren, arcane mage':'Aldric, shield guardian'} on the board`);b.addEventListener('click',()=>chooseUnit(id));root.append(b);units[id].button=b;}
  }
  function updateLabels(){
    const rect=$('#scene').getBoundingClientRect();if(!rect.width)return;
    function project(v,b){const a=v.clone().project(camera);b.style.left=`${(a.x*.5+.5)*rect.width}px`;b.style.top=`${(-a.y*.5+.5)*rect.height}px`;b.hidden=a.z>1||a.z<-1;}
    for(const t of tiles)if(t.button){project(pos(t,.04),t.button);t.button.style.visibility=occupied(t)?'hidden':'visible';t.button.setAttribute('aria-label',`${t.label}: ${t.barrier?'blocked by rampart':t.type==='bridge'?'stone bridge':'land hex'}${canTarget(t)?', available destination':''}`);t.button.disabled=state.busy;}
    for(const [id,u]of Object.entries({...units,...foes})){if(playing&&!u.model.visible){u.button.hidden=true;continue;}project(u.model.position.clone().add(new T.Vector3(0,-.03,.50)),u.button);u.button.classList.toggle('active',state.selected===id);u.button.disabled=state.busy;}
  }
  function resize(){
    if(!renderer)return;const w=$('#scene').clientWidth,h=$('#scene').clientHeight;renderer.setSize(w,h,false);
    const a=w/h,span=a<1.25?CrownBoard.view.mobileWidth/a:CrownRendering.enabled?10.5:11.6;camera.left=-span*a/2;camera.right=span*a/2;camera.top=span/2;camera.bottom=-span/2;camera.updateProjectionMatrix();updateLabels();feedback?.refresh();
    if(miniRenderer&&$('#mini-dialog').open)resizeMini();
  }
  function castRay(e){const rect=renderer.domElement.getBoundingClientRect(),p=new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new T.Raycaster();ray.setFromCamera(p,camera);return ray.intersectObjects([...Object.values(units).map(u=>u.model),...Object.values(foes).map(u=>u.model),...tiles.map(t=>t.mesh)],true);}
  function setupBattle(){
    battle=createBattle();document.body.dataset.play='skirmish';document.body.dataset.enemyAsset='loading';let enemiesLoaded=0;cards.rampart.detail='1 mana · 1 action · Blocks a hex; raiders can break it';cards.ward.detail='1 mana · 1 action · Absorbs the next hit on Aldric';cards.ward.copy='Choose Aldric. Echo Ward absorbs the next enemy hit.';
    const panel=document.createElement('section');panel.className='battle-panel';panel.innerHTML='<strong id="battle-status"></strong><p id="battle-health"></p><button id="end-turn" class="commit">End turn</button><p id="battle-log" aria-live="polite"></p>';$('.roster').after(panel);
    $('#end-turn').addEventListener('click',()=>{if(!state.busy){state.card=null;state.target=null;state.attack=false;state.tactic=null;clearGroup(previewFX);syncBattle(battle.endTurn());}});
    for(const id of Object.keys(battle.snapshot().units).filter(id=>id.startsWith('raider'))){const root=new T.Group(),tile=tileByKey.get(battle.snapshot().units[id].key);root.position.copy(pos(tile));scene.add(root);const b=document.createElement('button');b.className='hex-hit unit-label enemy-label';b.dataset.enemy=id;b.textContent='Raider · 3 HP';b.addEventListener('click',()=>chooseTile(foes[id].tile));$('#board-controls').append(b);foes[id]={model:root,tile,button:b};new T.TextureLoader().load(scenario?({raider1:'assets/rider-miniature-05.png',raider2:'assets/guardian-miniature-04.png',raider3:'assets/ranger-miniature-04.png',raider4:'assets/commander-miniature-05.png'}[id]):'assets/ranger-miniature-04.png',tx=>{tx.colorSpace=T.SRGBColorSpace;const sprite=new T.Sprite(new T.SpriteMaterial({map:tx,color:0xd8b7ac,transparent:true,alphaTest:.025,depthWrite:false,toneMapped:false}));sprite.center.set(.5,.1);sprite.scale.set(2.15*tx.image.width/tx.image.height,2.15,1);sprite.renderOrder=3;sprite.userData.foe=id;root.add(sprite);if(++enemiesLoaded===Object.keys(foes).length)document.body.dataset.enemyAsset='ready';});}
    $('.board-heading h2').textContent='Hold the crossing.';$('.board-heading .eyebrow').textContent='SKIRMISH · DEFEAT BOTH RAIDERS';$('.study-note').textContent='2 actions per turn. Move, attack or cast. Defeat both raiders to win.';$('#reset').textContent='Restart battle';$('#story').hidden=true;$('#help-dialog h2').textContent='Hold the crossing.';$('#help-dialog ol').innerHTML='<li>Defeat both red Ash Raiders. Your company has 2 actions each round.</li><li>Drag or tap to move, or select a red enemy in range and confirm an attack. Seren: 1 damage at range 2. Aldric: 2 damage next to a foe.</li><li>Each move, attack or spell uses 1 action. You regain 3 mana each round. Your second action triggers the raiders, or choose End turn.</li><li>Fold the Path costs 2 mana; Rampart blocks ground; Echo Ward absorbs one hit. Lose both heroes and the battle is lost.</li>';$('#help-dialog>p').textContent='A short tactical skirmish. The red names identify your opponents.';
    setupCombatUI();if(scenario)setupScenario({scene,T,tileByKey,pos,units,chooseTile,getTargets:()=>tiles.filter(t=>canTarget(t))});syncBattle({ok:true,events:[],state:battle.snapshot()});
  }
  function battleUI(){
    const b=battleDisplay||battle.snapshot(),selected=b.units[state.selected];$('#battle-status').textContent=state.busy?(b.phase==='enemy'?'Raiders’ turn — watch the board':`Round ${b.round} · resolving order`):b.status==='won'?'Victory — the crossing is yours.':b.status==='lost'?'Defeat — restart and try another approach.':`Round ${b.round} · ${b.actionsLeft} actions · ${b.mana} mana`;
    $('.board-foot>span').textContent=b.status==='playing'?`Round ${b.round} · ${b.actionsLeft} actions`:(b.status==='won'?'VICTORY':'DEFEAT');
    $('#battle-health').textContent=`Seren ${b.units.mage.hp}/${b.units.mage.maxHp} HP · Aldric ${b.units.guardian.hp}/${b.units.guardian.maxHp} HP`;
    $('#end-turn').disabled=state.busy||b.status!=='playing';$('#commit').disabled=state.busy||!state.target||b.status!=='playing';
    for(const id of ['mage','guardian']){$(`.roster [data-unit=${id}]`).disabled=state.busy||!b.units[id].alive||b.status!=='playing';units[id].button.textContent=id==='mage'?'Seren':'Aldric';}
    for(const button of $$('.command-card'))button.disabled=button.disabled||!b.units.mage.alive||b.status!=='playing';
    if(state.attack){$('#order-title').textContent=state.selected==='mage'?'Arcane Bolt':'Shield Strike';$('#order-copy').textContent=`Deal ${selected.attack} damage. Uses 1 action; no mana.`;const preview=battle.previewAttack(state.selected,key(state.target.q,state.target.r),state.tactic==='press');$('#order-title').textContent=state.tactic==='press'?'Press the Advantage':$('#order-title').textContent;$('#order-copy').textContent=`${preview.damage} damage · Raider HP ${preview.hpBefore} → ${preview.hpAfter}`;$('#order-detail').textContent=state.tactic==='press'?(scenario?'Uses 2 actions. Raiders respond when your actions are spent.':'Uses both actions. Raiders respond immediately.'):'1 action · No mana';$('#commit').textContent=`Strike · ${preview.damage} damage`;}
    else if(state.tactic==='brace'){$('#order-title').textContent='Hold the Crossing';$('#order-copy').textContent='Aldric takes 1 less damage per hit until your next turn. He cannot move this turn.';$('#order-detail').textContent='1 action · 0 mana · Requires the bridge';$('#commit').textContent='Brace · spend 1 action';}
    else if(!state.card&&!state.target){$('#order-title').textContent=b.status==='playing'?'Choose your action':b.status==='won'?'Victory':'Defeat';$('#order-copy').textContent='Drag or tap to move. Select a red raider in range to attack. End turn lets the raiders respond.';$('#order-detail').textContent='Seren: range 2, damage 1 · Aldric: range 1, damage 2';if(b.status!=='playing'){$('#order-copy').textContent=b.status==='won'?'Both raiders are defeated. The crossing is secure.':'Both heroes have fallen. Begin another battle and try a different approach.';$('#order-detail').textContent='Restart battle begins a fresh skirmish.';}}
    const finished=b.status!=='playing'&&!state.busy;document.body.dataset.battleResult=finished?b.status:'playing';$('#commit').hidden=finished;$('#play-again').hidden=!finished;if(finished){$('#action-notice').textContent='';$('#cancel').hidden=true;$('#order-detail').textContent=b.status==='won'?'Your company holds the crossing.':'A fresh battle is a chance to try another approach.';}$('#spell-hand-hint').textContent=finished?'The battle is over. Begin another to play your hand.':state.busy?'Your order is unfolding.':'Choose a spell, then its destination.';
    if($('#combat-dock')){const show=!!state.target&&!state.busy&&b.status==='playing';$('#combat-dock').hidden=!show;document.body.classList.toggle('has-combat-dock',show);$('#dock-summary').textContent=$('#order-copy').textContent+' · '+$('#order-detail').textContent;$('#dock-confirm').textContent=$('#commit').textContent;}
    if(scenario)scenarioUI(b);
    const canBrace=b.status==='playing'&&state.selected==='guardian'&&battle.legal('brace','guardian','0,0');const canPress=b.status==='playing'&&Object.values(foes).some(u=>u.model.visible&&battle.legal('press',state.selected,key(u.tile.q,u.tile.r)));
    if($('#tactic-brace')){$('#tactic-brace').hidden=!canBrace;$('#tactic-press').hidden=!canPress;$('#tactic-brace').disabled=state.busy;$('#tactic-press').disabled=state.busy;$('#tactical-hint').textContent=state.busy?'Watch the order unfold.':canBrace||canPress?'Choose a tradeoff, then confirm.':state.selected==='guardian'?'Move Aldric onto the bridge to unlock Hold the Crossing.':'With both actions and a foe in range, unlock Press the Advantage.';}
  }
  function applyBattleFrame(b){
    battleDisplay=b;
    for(const [id,u]of Object.entries({...units,...foes})){const current=b.units[id];u.tile=tileByKey.get(current.key);u.model.position.copy(pos(u.tile));u.model.visible=current.alive;u.button.hidden=!current.alive;if(foes[id])u.button.textContent=scenario?({raider1:'Scout',raider2:'Reaver',raider3:'Bowman',raider4:'Captain'}[id]+' · '+current.hp+' HP'):(id==='raider1'?'Raider I':'Raider II');}
    state.mana=b.mana;state.ward=b.units.guardian.ward;if(!state.ward&&persistentWard){persistentWard.parent?.remove(persistentWard);persistentWard=null;}
    if(!b.units[state.selected].alive)state.selected=b.units.mage.alive?'mage':'guardian';
    state.barriers=state.barriers.filter(w=>{if(b.walls.includes(key(w.tile.q,w.tile.r)))return true;scene.remove(w.model);CrownCardPieces.dispose(w.model);w.tile.barrier=false;w.tile.blocked=false;return false;});
    updateLabels();battleUI();
  }
  async function syncBattle(result){
    if(!result.ok){notify(result.reason);return;}
    const before=battleDisplay||result.state;
    if(feedback&&result.events.length){state.busy=true;state.card=null;state.target=null;state.attack=false;state.tactic=null;clearGroup(previewFX);clearGroup(highlights);updateUI();await feedback.play(result.events,before,result.state);}
    applyBattleFrame(result.state);state.busy=false;feedback?.setState(result.state);
    const names={mage:'Seren',guardian:'Aldric',raider1:'Ash Raider I',raider2:'Ash Raider II',raider3:'Ash Bowman',raider4:'Ash Captain'};
    const messages=result.events.map(e=>e.type==='attack'?`${names[e.unit]} → ${names[e.target]}: ${e.damage} damage (${e.hpBefore} → ${e.hpAfter} HP).`:e.type==='wardBlocked'?'Echo Ward absorbs a hit.':e.type==='defeated'?`${names[e.unit]} falls.`:e.type==='brace'?'Aldric braces on the crossing.':e.type==='wallBroken'?'A raider breaks the rampart.':e.type==='enemyTurn'?'Raiders’ turn.':e.type==='playerTurn'?`Your turn · round ${e.round}.`:e.type==='move'&&foes[e.unit]?'A raider advances.':e.type==='won'?'Victory!':e.type==='lost'?'Defeat.':'').filter(Boolean);
    if(messages.length){const list=$('#battle-history');for(const message of messages){const item=document.createElement('li');item.textContent=message;list.prepend(item);}while(list.children.length>30)list.lastChild.remove();}
    $('#battle-log').textContent=result.state.status==='playing'?'Choose a piece or an ability.':'Restart battle to play again.';drawPreview();updateUI();
  }
  function setupCombatUI(){
    const tray=document.createElement('section');tray.className='ability-tray spell-hand';tray.innerHTML='<div class="spell-hand-heading"><span class="eyebrow">SEREN’S GRIMOIRE</span><h2>A little magic.</h2><p id="spell-hand-hint">Choose a spell, then its destination.</p></div><div class="ability-buttons"></div>';
    for(const card of $$('.command-card')){tray.querySelector('.ability-buttons').append(card);card.title=cards[card.dataset.card].copy;const cost=document.createElement('b');cost.className='ability-cost';cost.textContent=card.dataset.card==='portal'?'2 mana':'1 mana';card.append(cost);}
    $('.workspace').append(tray);
    const decisions=document.createElement('section');decisions.className='field-decisions';decisions.innerHTML='<span class="eyebrow">FIELD DECISIONS</span><p id="tactical-hint"></p><button id="tactic-brace" class="tactical-card"><strong>Hold the Crossing</strong><span>Take 1 less damage per hit. Aldric gives up movement this turn.</span><small>1 action · Bridge only</small></button><button id="tactic-press" class="tactical-card"><strong>Press the Advantage</strong><span>Strike for +1 damage. Commit both actions and let the raiders respond.</span><small>2 actions · No retreat this turn</small></button>';
    $('.unit-description').after(decisions);
    $('#tactic-brace').addEventListener('click',()=>{if(state.busy||!battle.legal('brace','guardian','0,0'))return;chooseUnit('guardian');state.tactic='brace';state.target='guardian';drawPreview();updateUI();});
    $('#tactic-press').addEventListener('click',()=>{if(state.busy)return;const target=Object.values(foes).find(u=>u.model.visible&&battle.legal('press',state.selected,key(u.tile.q,u.tile.r)));if(!target)return;state.card=null;state.tactic='press';state.attack=true;state.target=target.tile;drawPreview();updateUI();});
    const again=document.createElement('button');again.id='play-again';again.className='commit';again.textContent='Begin another battle';again.hidden=true;again.addEventListener('click',reset);$('.order-panel').append(again);
    const dock=document.createElement('div');dock.id='combat-dock';dock.className='combat-dock';dock.hidden=true;dock.innerHTML='<span id="dock-summary"></span><button id="dock-confirm">Confirm</button><button id="dock-cancel" aria-label="Cancel order">×</button>';document.body.append(dock);$('#dock-confirm').addEventListener('click',commit);$('#dock-cancel').addEventListener('click',cancel);
    const notice=document.createElement('p');notice.id='action-notice';notice.setAttribute('role','status');$('#order-detail').after(notice);
    const history=document.createElement('details');history.className='battle-history';history.innerHTML='<summary>Battle history</summary><ol id="battle-history"></ol>';$('.battle-panel').append(history);
    const legend=document.createElement('div');legend.className='board-legend';legend.innerHTML='<span>○ Move</span><span>◎ Attack</span><span>▧ Enemy reach</span><span>◇ Protected</span>';$('#battlefield').append(legend);
    const project=(k,id)=>{const unit={...units,...foes}[id],tile=tileByKey.get(k),root=unit?.model;const base=root?root.position.clone():pos(tile),height=id==='mage'?2.65:id==='guardian'?2.55:2.15,rect=$('#scene').getBoundingClientRect();const point=base.clone().add(new T.Vector3(0,height*.42,0).applyQuaternion(camera.quaternion)).project(camera),head=base.clone().add(new T.Vector3(0,height*.96+.10,0).applyQuaternion(camera.quaternion)).project(camera);return {x:(point.x*.5+.5)*rect.width,y:(-point.y*.5+.5)*rect.height,headY:(-head.y*.5+.5)*rect.height};};
    feedback=CrownFeedback.create({element:$('#battlefield'),project,reduced:()=>reduced.matches,applyFrame:applyBattleFrame,animateMove:async(id,from,to,duration)=>{if(units[id])return;const root=foes[id].model,a=root.position.clone(),b=pos(tileByKey.get(to));await visualTween(duration,p=>{root.position.lerpVectors(a,b,p);updateLabels();feedback?.refresh();});},animateDefeat:async(id,duration)=>{const model={...units,...foes}[id].model;await visualTween(duration,p=>{model.scale.setScalar(1-p*.35);model.traverse(o=>{if(o.isSprite)o.material.opacity=1-p;});});model.visible=false;}});
    window.crownFeedback=feedback;
    $('#help-dialog ol').innerHTML+='<li>On-board health bars and damage previews show consequences. Warm ground marks enemy reach. Field decisions appear when their conditions are met.</li>';
  }
  function visualTween(duration,update){return new Promise(resolve=>{const start=performance.now();function tick(now){const p=Math.min(1,(now-start)/Math.max(1,duration));update(p);if(p<1)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);});}
  function setupDrag(){
    if(CrownCardPieces.enabled){const b=document.createElement('button');b.id='inspect-card-piece';b.className='text-button';b.textContent='Inspect Living Rampart';b.hidden=true;b.addEventListener('click',()=>CrownCardPieces.inspect());$('#order-detail').after(b);}
    function pickTile(e){const rect=renderer.domElement.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)return null;const p=new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new T.Raycaster();scene.updateMatrixWorld(true);ray.setFromCamera(p,camera);return ray.intersectObjects(tiles.map(t=>t.mesh),false)[0]?.object.userData.tile||null;}
    window.crownDrag=CrownDrag.setup({element:$('#battlefield'),pickUnit:e=>{const button=document.elementFromPoint(e.clientX,e.clientY)?.closest('.hex-hit');if(button)return button.dataset.unit||null;return castRay(e).find(h=>h.object.userData.unit)?.object.userData.unit||null;},pickTile,selectUnit:chooseUnit,chooseTile,isBusy:()=>state.busy,isValidDrop:(id,t)=>{if(playing&&(!battle.snapshot().units[id].alive||battle.snapshot().status!=='playing'))return false;if(playing)return battle.legal('attack',id,key(t.q,t.r))||battle.legal('move',id,key(t.q,t.r))||(id==='mage'&&battle.legal('portal',id,key(t.q,t.r)));if(!walkable(t)||occupied(t))return false;const d=dist(units[id].tile,t);return d===1||(id==='mage'&&d>1&&d<=4&&state.mana>=2);},imageForUnit:id=>CrownMiniatureStudy.get(id).image,labelForUnit:id=>id==='mage'?'Seren':'Aldric',notify});
    $('.board-heading p').textContent='Drag or tap to act.';
  }
  function onCanvasClick(e){if(state.busy)return;const hit=castRay(e)[0];if(!hit)return;if(hit.object.userData.foe)chooseTile(foes[hit.object.userData.foe].tile);else if(hit.object.userData.unit)chooseUnit(hit.object.userData.unit);else if(hit.object.userData.tile)chooseTile(hit.object.userData.tile);}
  function onCanvasHover(e){if(state.busy)return;const hit=castRay(e)[0];renderer.domElement.style.cursor=hit?'pointer':'default';}
  function chooseUnit(id){
    if(state.busy||(playing&&(!battle.snapshot().units[id]?.alive||battle.snapshot().status!=='playing')))return;state.attack=false;state.tactic=null;
    if(state.card==='ward'&&id==='guardian'){
      if(state.ward){notify('Aldric already carries Echo Ward. Reset the study to cast it again.');return;}
      state.target='guardian';drawPreview();updateUI();return;
    }
    state.selected=id;state.card=null;state.target=null;drawPreview();updateUI();
  }
  function chooseCard(id){
    if(scenario&&id==='portal'&&battle?.snapshot().carrier==='mage'){notify('Seren carries the relic. It cannot travel through a portal — return by the bridge or ford.');return;}
    state.attack=false;state.tactic=null;if(playing&&(!battle.snapshot().units.mage.alive||battle.snapshot().status!=='playing'))return;
    if(state.busy||state.mana<cards[id].cost)return;
    state.card=state.card===id?null:id;state.selected='mage';state.target=null;drawPreview();updateUI();
  }
  function chooseTile(t){
    if(state.busy)return;if($('#action-notice'))$('#action-notice').textContent='';
    if(playing&&battle){if(battle.snapshot().status!=='playing')return;const foe=Object.entries(foes).find(([id,u])=>u.tile===t&&u.model.visible);if(foe){if(state.card||!battle.legal(state.tactic==='press'?'press':'attack',state.selected,key(t.q,t.r))){notify('Select a fighter in range: Seren attacks within 2 hexes; Aldric within 1.');return;}state.attack=true;state.target=t;drawPreview();updateUI();return;}}
    state.attack=false;state.tactic=null;const unit=Object.keys(units).find(id=>units[id].tile===t&&units[id].model.visible);if(unit){chooseUnit(unit);return;}
    if(!walkable(t)){notify(t.type==='water'?'Choose land on the other bank. The river itself is not a landing place.':'That hex is occupied by terrain. Choose an open land hex.');return;}
    if(state.card==='ward'){notify('Choose Aldric to preview Echo Ward.');return;}
    if(!state.card&&state.selected==='mage'&&dist(units.mage.tile,t)>1){
      if(state.mana<2){notify('A distant move needs Fold the Path and 2 mana. You can still move one hex for free.');return;}
      if(dist(units.mage.tile,t)>4){notify('That destination is beyond the portal’s 4-hex range.');return;}
      state.card='portal';
    }
    if(!canTarget(t)){if(playing&&battle.snapshot().units[state.selected].rooted){notify('Aldric is holding the crossing and cannot move until your next turn.');return;}notify(state.card==='portal'?'Choose an empty land hex 2–4 hexes from Seren.':state.card==='rampart'?'Choose an empty land hex within 3 hexes of Seren. Keep the only bridge open.':'A basic move reaches one neighboring land hex.');return;}
    state.target=t;drawPreview();updateUI();
  }
  function cancel(){if(state.busy)return;state.attack=false;state.tactic=null;state.card=null;state.target=null;drawPreview();updateUI();}
  function portalAt(group,t,opacity=.65){
    const g=new T.Group();g.position.copy(pos(t));group.add(g);
    for(const [r,tube,col]of [[.7,.032,0x87fff1],[.75,.014,0xa78aff]]){const o=new T.Mesh(new T.TorusGeometry(r,tube,8,72),ephemeral(col,opacity));o.position.y=.95;o.rotation.y=.10;g.add(o);}
    const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,uniforms:{time:{value:0},strength:{value:opacity}},
      vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:'varying vec2 vUv;uniform float time;uniform float strength;void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float a=atan(p.y,p.x);float ring=exp(-pow((r-.76)*16.,2.));float thread=pow(max(0.,sin(a*5.+r*17.-time*2.)),9.)*.75;float spiral=pow(max(0.,sin(a*3.-r*12.+time*1.3)),16.)*.48;float dust=pow(max(0.,sin(a*29.+r*51.+time)),35.)*.35;float fade=(1.-smoothstep(.82,1.,r))*smoothstep(.05,.32,r);float glow=(ring+thread+spiral+dust)*fade;vec3 color=mix(vec3(.30,.12,.95),vec3(.17,1.,.91),.5+.5*sin(a+r*4.+time*.35));gl_FragColor=vec4(color*(.5+glow),min(.9,glow)*strength);}'
    });material.userData.transient=true;
    const disc=new T.Mesh(new T.PlaneGeometry(1.95,1.95),material);disc.position.y=.95;disc.rotation.y=.10;g.add(disc);
    const swirl=new T.CatmullRomCurve3(Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*4,r=.65*(1-i/80);return new T.Vector3(Math.cos(a)*r,.95+Math.sin(a)*r,.01);}));
    g.add(new T.Mesh(new T.TubeGeometry(swirl,64,.009,5,false),ephemeral(0xb6f5ff,.8*opacity)));
    if(CrownTerrain.enabled)g.traverse(o=>{if(o.isMesh){o.renderOrder=6;o.material.depthTest=false;}});
    return g;
  }
  function wardShape(group,u,opacity=.17){
    const shield=new T.Group();shield.position.copy(u.model.position);group.add(shield);
    const illustrated=CrownMiniatureStudy.uses('guardian'),item=CrownMiniatureStudy.get('guardian');
    // Billboard art needs a camera-facing enclosure; world-height alone foreshortens it.
    if(illustrated){
      const sprite=u.model.children.find(o=>o.isSprite),height=item.height,width=sprite?sprite.scale.x:height*.8;
      const shell=new T.Group();shell.quaternion.copy(camera.quaternion);
      shell.position.copy(new T.Vector3(0,height*.49,0).applyQuaternion(camera.quaternion));
      shell.scale.set(width*.5+.27,height*.5+.30,.72);shield.add(shell);
      shell.add(new T.Mesh(new T.SphereGeometry(1,40,28),ephemeral(0x7debdc,opacity)));
      for(let i=0;i<3;i++){const hoop=new T.Mesh(new T.TorusGeometry(1,.009,6,80),ephemeral(0x9df4df,.7));hoop.rotation.y=i*Math.PI/3;shell.add(hoop);}
      shell.traverse(o=>{if(o.isMesh)o.renderOrder=4;});
      shield.userData.wardCoverage={height,width,verticalRadius:height*.5+.30,horizontalRadius:width*.5+.27};
    }else{
      const ball=new T.Mesh(new T.SphereGeometry(1,32,20),ephemeral(0x7debdc,opacity));ball.position.y=1.18;ball.scale.set(.84,1.18,.84);shield.add(ball);
      for(let i=0;i<3;i++){const hoop=new T.Mesh(new T.TorusGeometry(.88,.012,6,60),ephemeral(0x9df4df,.7));hoop.position.y=1.15;hoop.scale.y=1.25;hoop.rotation.y=i*Math.PI/3;shield.add(hoop);}
    }
    const ground=new T.Mesh(new T.RingGeometry(.72,.78,60),ephemeral(0xa6f9e5,.65));ground.rotation.x=-Math.PI/2;ground.position.y=.03;shield.add(ground);
    return shield;
  }
  function drawPreview(){
    feedback?.clearPreview();clearGroup(highlights);clearGroup(previewFX);ring(highlights,units[state.selected].tile,0xe6c378,true);
    if(playing&&battle&&!state.busy){const b=battleDisplay||battle.snapshot();for(const t of tiles){const k=key(t.q,t.r),threat=Object.values(b.units).some(u=>u.team==='enemy'&&u.alive&&battle.distance(u.key,k)<=u.range);if(threat&&walkable(t)){const o=new T.Mesh(new T.CircleGeometry(.82,6),ephemeral(0xf48675,.12));o.rotation.x=-Math.PI/2;o.rotation.z=Math.PI/6;o.position.copy(pos(t,.012));o.material.depthTest=false;o.renderOrder=4;highlights.add(o);}}}
    if(state.card==='ward')ring(highlights,units.guardian.tile,0x82eedb,true);
    else for(const t of tiles)if(canTarget(t))ring(highlights,t,state.card==='rampart'?0xf0cf8d:0x65d6c4);
    if(!state.target)return;
    if(state.tactic==='brace'){ring(previewFX,units.guardian.tile,0x82eedb,true);return;}
    if(state.attack){ring(previewFX,state.target,0xffaa87,true);if(feedback){const target=Object.entries(foes).find(([id,u])=>u.tile===state.target&&u.model.visible)?.[0],preview=battle.previewAttack(state.selected,key(state.target.q,state.target.r),state.tactic==='press');feedback.preview({attacker:state.selected,target,damage:preview.damage,hpBefore:preview.hpBefore,hpAfter:preview.hpAfter,cost:state.tactic==='press'?'2 actions · turn ends':'1 action · 0 mana',label:state.tactic==='press'?'Press the Advantage':state.selected==='mage'?'Arcane Bolt':'Shield Strike'});}return;}
    if(state.card==='ward'){wardShape(previewFX,units.guardian,.12);return;}
    const target=state.target;ring(previewFX,target,0xd5ffe9,true);
    if(state.card==='portal'){
      portalAt(previewFX,units.mage.tile,.45);portalAt(previewFX,target,.75);
      const from=pos(units.mage.tile,1),to=pos(target,1),mid=from.clone().lerp(to,.5);mid.y+=1.5;
      const curve=new T.QuadraticBezierCurve3(from,mid,to);previewFX.add(new T.Mesh(new T.TubeGeometry(curve,48,.015,6,false),ephemeral(0x7eddd8,.7)));
    }else if(state.card==='rampart'){
      const wall=CrownCardPieces.enabled?CrownCardPieces.rampart(true):models.rampart();wall.position.copy(pos(target));if(!CrownCardPieces.enabled)wall.traverse(o=>{if(o.isMesh)o.material=ephemeral(0xc2d5ad,.3);});previewFX.add(wall);
    }else{
      const points=[pos(units[state.selected].tile,.15),pos(target,.15)];previewFX.add(new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0xe3c383})));
    }
  }
  function updateUI(){
    const mage=state.selected==='mage';$('#unit-name').textContent=mage?'Seren, Arcane Mage':'Aldric, Shield Guardian';$('#unit-role').textContent=mage?'THE PATHMAKER':'THE UNYIELDING';$('#unit-copy').textContent=mage?'Where others see a river, she sees a shorter journey.':'A steady shield. A promise that someone gets home.';
    $$('.roster [data-unit]').forEach(b=>{const active=b.dataset.unit===state.selected;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active);b.disabled=state.busy;});
    $$('.command-card').forEach(b=>{const id=b.dataset.card;b.classList.toggle('selected',state.card===id);b.setAttribute('aria-pressed',state.card===id);b.disabled=state.busy||state.mana<cards[id].cost||(id==='ward'&&state.ward);});
    $('#mana').textContent='◆ '.repeat(state.mana)+'◇ '.repeat(3-state.mana);$('#mana').setAttribute('aria-label',`${state.mana} of 3 mana`);
    const c=cards[state.card];$('#order-title').textContent=c?c.title:state.target?'Reposition':'Choose your approach';
    $('#order-copy').textContent=c?state.target?state.card==='ward'?'Aldric will receive a protective arcane shield. Confirm to cast.':`${state.card==='portal'?'Seren will arrive at':'A barrier will rise on'} ${state.target.label}. Confirm when you’re ready.`:c.copy:state.target?`${mage?'Seren':'Aldric'} will move to ${state.target.label}. No card or mana needed.`:'Select a card below, or choose a highlighted destination on the board to find its matching order.';
    $('#order-detail').textContent=c?c.detail:state.target?'Free basic move · One neighboring hex':'Nothing is spent until you confirm.';
    $('#commit').disabled=!state.target||state.busy;$('#commit').textContent=state.busy?'The order unfolds…':state.target?c?c.confirm:'Move miniature':state.card==='ward'?'Choose Aldric':'Choose a destination';$('#cancel').hidden=(!state.card&&!state.target)||state.busy;
    if($('#inspect-card-piece'))$('#inspect-card-piece').hidden=state.card!=='rampart'&&state.lastOrder!=='rampart';
    if(playing)battleUI();
    $('#reset').disabled=state.busy;$('#inspect-mini').disabled=state.busy;updateLabels();
  }
  let animation=null,persistentWard=null;
  function commit(){
    if(!state.target||state.busy)return;
    if(playing&&innerWidth<=760)$('#battlefield').scrollIntoView({behavior:'auto',block:'start'});
    if(playing&&state.tactic==='brace'){const result=battle.action({type:'brace',unit:'guardian',targetKey:'0,0'});state.tactic=null;state.target=null;syncBattle(result);return;}
    if(playing&&state.attack){const result=battle.action({type:state.tactic==='press'?'press':'attack',unit:state.selected,targetKey:key(state.target.q,state.target.r)});state.attack=false;state.tactic=null;state.target=null;clearGroup(previewFX);syncBattle(result);return;}
    if(playing&&!battle.legal(state.card||'move',state.selected,state.card==='ward'?key(units.guardian.tile.q,units.guardian.tile.r):key(state.target.q,state.target.r))){notify('That order is unavailable.');return;}
    const card=state.card,target=state.target,id=state.selected,u=units[id],from=u.model.position.clone();
    if(card&&state.mana<cards[card].cost)return;
    state.busy=true;if(card)state.mana-=cards[card].cost;state.lastOrder=card||'move';clearGroup(previewFX);clearGroup(highlights);
    const duration=reduced.matches?0:card==='portal'?1900:card==='rampart'?1100:card==='ward'?1000:650;
    const data={card,target,id,from,to:card!=='ward'?pos(target):null,start:performance.now(),duration};
    if(card==='portal'){data.source=portalAt(liveFX,u.tile,1);data.destination=portalAt(liveFX,target,1);data.spark=new T.PointLight(0x76ecff,8,5);data.spark.position.copy(pos(target,1));liveFX.add(data.spark);}
    else if(card==='rampart'){data.wall=CrownCardPieces.enabled?CrownCardPieces.rampart():models.rampart();data.wall.position.copy(pos(target));data.wall.scale.y=.02;scene.add(data.wall);}
    else if(card==='ward'){persistentWard=wardShape(liveFX,units.guardian,.16);persistentWard.scale.setScalar(.01);}
    animation=data;updateUI();
    if(!duration)finishAnimation();
  }
  function finishAnimation(){
    const a=animation;if(!a)return;
    let msg;
    if(a.card==='ward'){state.ward=true;persistentWard.scale.setScalar(1);msg='Echo Ward surrounds Aldric. A promise, made visible.';}
    else if(a.card==='rampart'){a.wall.scale.y=1;a.target.barrier=true;a.target.blocked=true;state.barriers.push({tile:a.target,model:a.wall});msg=`Living Rampart rises on ${a.target.label}. Reset clears the study’s terrain.`;}
    else{const u=units[a.id];u.model.position.copy(a.to);u.model.scale.setScalar(1);u.tile=a.target;msg=a.card==='portal'?`The path folds. Seren arrives at ${a.target.label}.`:`${a.id==='mage'?'Seren':'Aldric'} moves to ${a.target.label}.`;if(state.ward&&a.id==='guardian'){persistentWard.position.copy(u.model.position);}}
    if(a.card==='portal')clearGroup(liveFX);
    // A ward persists across other orders, so rebuild it if a portal effect cleared its group.
    if(state.ward&&(!persistentWard||!persistentWard.parent))persistentWard=wardShape(liveFX,units.guardian,.16);
    animation=null;state.busy=false;state.card=null;state.target=null;if(playing){syncBattle(battle.action({type:a.card||'move',unit:a.id,targetKey:a.card==='ward'?key(units.guardian.tile.q,units.guardian.tile.r):key(a.target.q,a.target.r)}));return;}drawPreview();updateUI();notify(msg);
  }
  function reset(){
    if(state.busy)return;
    if($('#action-notice'))$('#action-notice').textContent='';
    feedback?.clearPreview();
    state.barriers.forEach(b=>{scene.remove(b.model);if(b.model.userData.cardPiece)CrownCardPieces.dispose(b.model);b.tile.barrier=false;b.tile.blocked=false;});state.barriers=[];clearGroup(liveFX);clearGroup(previewFX);persistentWard=null;state.ward=false;state.mana=3;state.card=null;state.target=null;state.selected='mage';state.lastOrder=null;
    for(const u of Object.values({...units,...foes})){u.model.scale.setScalar(1);u.model.traverse(o=>{if(o.isSprite)o.material.opacity=1;});}for(const u of Object.values(units)){u.tile=tileByKey.get(key(...u.start));u.model.position.copy(pos(u.tile));u.model.scale.setScalar(1);}
    state.attack=false;state.tactic=null;if(playing){for(const u of Object.values({...units,...foes})){u.model.scale.setScalar(1);u.model.traverse(o=>{if(o.isSprite)o.material.opacity=1;});}battle=createBattle();syncBattle({ok:true,events:[],state:battle.snapshot()});return;}
    drawPreview();updateUI();notify('The table is reset. Your company has 3 mana again.');
  }
  function animate(now){
    raf=requestAnimationFrame(animate);if(document.hidden||now-lastFrame<1000/40)return;lastFrame=now;
    if(animation){const a=animation,p=a.duration?Math.min(1,(now-a.start)/a.duration):1,e=p*p*(3-2*p);
      if(a.card==='portal'){
        const u=units[a.id];if(p<.44){u.model.position.copy(a.from);u.model.scale.setScalar(Math.max(.01,1-p/.44));}else{u.model.position.copy(a.to);u.model.scale.setScalar(Math.min(1,(p-.44)/.45));}
        a.source.children.forEach((o,i)=>o.rotation.z=now*.001*(i%2?1:-1));a.destination.children.forEach((o,i)=>o.rotation.z=-now*.001*(i%2?1:-1));
      }else if(a.card==='rampart')a.wall.scale.y=Math.max(.01,e);
      else if(a.card==='ward')persistentWard.scale.setScalar(Math.max(.01,e));
      else{units[a.id].model.position.lerpVectors(a.from,a.to,e);units[a.id].model.position.y+=Math.sin(p*Math.PI)*.08;}
      updateLabels();if(p>=1)finishAnimation();
    }
    if(!reduced.matches){
      previewFX.children.forEach(o=>{if(o.isGroup&&state.card==='portal')o.children.forEach((x,i)=>{if(x.geometry?.type==='TorusGeometry')x.rotation.z=now*.00035*(i?1:-1);});});
      scene.children.forEach(o=>{if(o.userData.relic)o.rotation.y=now*.0004;});
      if(persistentWard&&state.ward&&!CrownMiniatureStudy.uses('guardian'))persistentWard.children.forEach(o=>{if(o.geometry?.type==='TorusGeometry')o.rotation.y+=.002;});
    }
    if(persistentWard&&state.ward)persistentWard.position.copy(units.guardian.model.position);
    for(const group of [previewFX,liveFX])group.traverse(o=>{if(o.material?.uniforms?.time)o.material.uniforms.time.value=reduced.matches?0:now*.001;});
    feedback?.refresh();CrownArt.update(now,reduced.matches);if(CrownRendering.enabled)CrownRendering.render(now,reduced.matches);else renderer.render(scene,camera);
    if(miniRenderer&&$('#mini-dialog').open){if(!reduced.matches)inspectorAngle+=.003;inspectedModel.rotation.y=Math.PI+inspectorAngle;miniRenderer.render(miniScene,miniCamera);}
  }
  function initMini(){
    if(miniRenderer)return;
    miniRenderer=new T.WebGLRenderer({alpha:true,antialias:true});miniRenderer.setPixelRatio(Math.min(devicePixelRatio,1.5));miniRenderer.toneMapping=T.ACESFilmicToneMapping;miniRenderer.toneMappingExposure=1.35;$('#mini-scene').append(miniRenderer.domElement);
    miniScene=new T.Scene();miniScene.environment=CrownArt.studio(miniRenderer);miniScene.add(new T.HemisphereLight(0xeaf8ee,0x3f4238,1.7));const l=new T.DirectionalLight(0xffe2ae,3);l.position.set(-3,5,7);miniScene.add(l);const r=new T.DirectionalLight(0x5bafbf,1.5);r.position.set(3,2,-3);miniScene.add(r);miniCamera=new T.PerspectiveCamera(33,1,.1,30);miniCamera.position.set(0,1.9,5.5);miniCamera.lookAt(0,1.22,0);
  }
  function resizeMini(){const el=$('#mini-scene');miniRenderer.setSize(el.clientWidth,el.clientHeight,false);miniCamera.aspect=el.clientWidth/el.clientHeight;miniCamera.updateProjectionMatrix();}
  function showMini(id){
    if(CrownMiniatureStudy.uses(id)){CrownMiniatureStudy.inspect(id);return;}
    inspectedUnit=id;initMini();if(inspectedModel)miniScene.remove(inspectedModel);inspectedModel=models[id]();inspectorAngle=.35;inspectedModel.rotation.y=Math.PI+inspectorAngle;miniScene.add(inspectedModel);$('#mini-title').textContent=id==='mage'?'Seren, Arcane Mage':'Aldric, Shield Guardian';$('#mini-copy').textContent=id==='mage'?'Teal robes, an ivory mantle, braided hair and a crescent crystal staff. A silhouette built around movement and possibility.':'Layered armor, an ivory tower shield and a raised blade. A broad, grounded silhouette built to hold the line.';$('#switch-mini').textContent=id==='mage'?'Show guardian':'Show mage';if(!$('#mini-dialog').open)$('#mini-dialog').showModal();resizeMini();
  }
  $$('.command-card').forEach(b=>b.addEventListener('click',()=>chooseCard(b.dataset.card)));
  $$('.roster [data-unit]').forEach(b=>b.addEventListener('click',()=>chooseUnit(b.dataset.unit)));
  $('#commit').addEventListener('click',commit);$('#cancel').addEventListener('click',cancel);$('#reset').addEventListener('click',reset);
  $('#camera').addEventListener('click',()=>{view=(view+1)%2;camera.position.set(view?-7:3.5,view?19:16,view?18:20);camera.lookAt(0,.2,0);camera.updateMatrixWorld();updateLabels();});
  $('#inspect-mini').addEventListener('click',()=>showMini(state.selected));$('#switch-mini').addEventListener('click',()=>showMini(inspectedUnit==='mage'?'guardian':'mage'));$('#rotate-mini').addEventListener('click',()=>{inspectorAngle+=Math.PI/3;});
  $('#help').addEventListener('click',()=>$('#help-dialog').showModal());$('#story').addEventListener('click',()=>$('#story-dialog').showModal());
  $$('.dialog-close,.dialog-close-action').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  $$('[data-story]').forEach(b=>b.addEventListener('click',()=>{$('#story-result').textContent=b.dataset.story==='guard'?'Choice preview: Aldric stays. The village remembers your protection.':'Choice preview: the company stays together. The village remembers your departure.';$$('[data-story]').forEach(x=>x.setAttribute('aria-pressed',x===b));}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]'))cancel();});
  // Read-only inspection surface for repeatable visual and interaction checks.
  window.crownStudy={snapshot:()=>({selected:state.selected,card:state.card,target:typeof state.target==='string'?state.target:state.target?.label||null,mana:state.mana,busy:state.busy,ward:state.ward,barriers:state.barriers.map(b=>b.tile.label),battle:playing?battle.snapshot():null,board:{id:CrownBoard.id,hexes:tiles.length},positions:Object.fromEntries(Object.entries(units).map(([id,u])=>[id,u.tile.label])),lastOrder:state.lastOrder}),hexes:()=>tiles.filter(t=>t.button).map(t=>({label:t.label,key:key(t.q,t.r),available:canTarget(t),distanceFromMage:dist(units.mage.tile,t)}))};
  setup();
})();




