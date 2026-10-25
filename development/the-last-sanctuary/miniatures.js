/* Original The Last Sanctuary geometric sculpture studies. Three.js: vendor/THREE-LICENSE.txt. */
'use strict';
window.CrownModels = (() => {
  const T = THREE;
  const mat = (color, metalness = .1, roughness = .65) => new T.MeshStandardMaterial({color, metalness, roughness});
  const M = {
    gold: mat(0xc3a367,.78,.34), goldLight: mat(0xe1c78c,.65,.3), bronze: mat(0x80603b,.75,.4),
    teal: mat(0x17666a,.2,.65), deepTeal: mat(0x123f47,.15,.7), cloth: mat(0xe6ddc0,.1,.85),
    armor: mat(0x8d9894,.75,.36), dark: mat(0x223836,.4,.6), skin: mat(0x674333,.07,.8),
    skinLight: mat(0x92684d,.08,.8), hair: mat(0x231c1c,.12,.75), eye: mat(0x0d1618,.1,.4),
    stone: mat(0x89918a,.1,.95), crystal: new T.MeshStandardMaterial({color:0x96fff0,emissive:0x28bcca,emissiveIntensity:1.1,metalness:.3,roughness:.2}),
    wood: mat(0x554231,.1,.9)
  };
  function mesh(parent, geo, material, x=0,y=0,z=0) {
    const a = new T.Mesh(geo,material); a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a;
  }
  function sphere(p,m,x,y,z,rx,ry=rx,rz=rx){const a=mesh(p,new T.SphereGeometry(1,16,12),m,x,y,z);a.scale.set(rx,ry,rz);return a;}
  function cylinder(p,m,x,y,z,rt,rb,h,n=16){return mesh(p,new T.CylinderGeometry(rt,rb,h,n),m,x,y,z);}
  function box(p,m,x,y,z,w,h,d){return mesh(p,new T.BoxGeometry(w,h,d),m,x,y,z);}
  function rod(p,m,a,b,r=.04,r2=r){const start=new T.Vector3(...a),end=new T.Vector3(...b);const o=mesh(p,new T.CylinderGeometry(r2,r,start.distanceTo(end),10),m);o.position.copy(start.clone().add(end).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),end.sub(start).normalize());return o;}
  function torus(p,m,x,y,z,r,tube,arc=Math.PI*2){return mesh(p,new T.TorusGeometry(r,tube,8,36,arc),m,x,y,z);}
  function clothPanel(p,material,rows){
    const verts=[],uv=[],indices=[],count=15;
    rows.forEach((row,j)=>{for(let i=0;i<count;i++){const f=i/(count-1),angle=(f-.5)*Math.PI*1.06;const wave=Math.cos(f*Math.PI*8)*row[4];verts.push(Math.sin(angle)*row[1],row[0]+wave*.2,Math.cos(angle)*row[2]+row[3]+wave);uv.push(f,j/(rows.length-1));}});
    for(let j=0;j<rows.length-1;j++)for(let i=0;i<count-1;i++){let a=j*count+i;indices.push(a,a+count,a+1,a+1,a+count,a+count+1);}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const mm=material.clone();mm.side=T.DoubleSide;return mesh(p,g,mm);
  }
  function base(g){
    cylinder(g,M.bronze,0,.07,0,.58,.63,.14,48);
    cylinder(g,M.gold,0,.14,0,.57,.6,.06,48);
    cylinder(g,M.dark,0,.18,0,.53,.55,.06,48);
    const rim=torus(g,M.goldLight,0,.21,0,.53,.016);rim.rotation.x=Math.PI/2;
    // Engraved directional dots remain legible on both faction bases.
    for(let i=0;i<8;i++){const a=i*Math.PI/4;sphere(g,M.goldLight,Math.cos(a)*.56,.172,Math.sin(a)*.56,.014);}
    for(let i=0;i<32;i++){const a=i*Math.PI/16;const line=box(g,M.bronze,Math.cos(a)*.605,.08,Math.sin(a)*.605,.008,.06,.016);line.rotation.y=-a;}
  }
  function pleatedRobe(g){
    const geo=new T.LatheGeometry([[.46,.23],[.49,.3],[.46,.42],[.38,.65],[.29,.88],[.225,1.07],[.23,1.24],[.30,1.44],[.26,1.54]].map(a=>new T.Vector2(...a)),64);
    const vertices=geo.attributes.position;
    for(let i=0;i<vertices.count;i++){
      const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i),a=Math.atan2(x,z),fold=(Math.sin(a*13+y*.7)*.022+Math.sin(a*7-y*1.3)*.013)*Math.max(.1,1.4-y);
      vertices.setXYZ(i,x+Math.sin(a)*fold,y,z*.82+Math.cos(a)*fold*.82);
    }
    geo.computeVertexNormals();mesh(g,geo,M.teal);
    const hem=torus(g,M.goldLight,0,.27,0,.475,.015);hem.rotation.x=Math.PI/2;hem.scale.y=.82;
    for(let i=0;i<24;i++){const a=i*Math.PI/12;const dot=sphere(g,M.gold,Math.sin(a)*.46,.34,Math.cos(a)*.38,.009,.014,.008);}
  }
  function chain(p,points,r=.012){const curve=new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a)));return mesh(p,new T.TubeGeometry(curve,32,r,6,false),M.goldLight);}
  function faceDetail(g,y){
    // Raised brow ridges, cheek planes and a recessed lip replace a blank rounded face.
    for(const x of [-.052,.052]){
      rod(g,M.hair,[x-.025,y+.047,-.143],[x+.022,y+.052,-.147],.009);
      sphere(g,M.skin,x*1.45,y-.055,-.105,.043,.045,.035);
      sphere(g,M.cloth,x,y+.017,-.149,.013,.006,.004);
      sphere(g,M.eye,x,y+.017,-.153,.006,.006,.004);
    }
    rod(g,M.skinLight,[-.029,y-.086,-.142],[.029,y-.086,-.142],.005);
  }
  function mage(){
    const g=new T.Group();base(g);
    // Contoured robes, pleats, trailing mantle and separate sleeves form a readable silhouette.
    pleatedRobe(g);
    clothPanel(g,M.cloth,[[.25,.63,.44,.03,.06],[.40,.58,.43,.02,.05],[.65,.49,.38,.01,.045],[.9,.42,.29,.02,.035],[1.12,.35,.24,.03,.025],[1.34,.32,.19,.03,.02],[1.52,.30,.15,.02,.01]]);
    for(let i=-3;i<=3;i++){const a=i*.23;rod(g,M.deepTeal,[Math.sin(a)*.22,1.17,Math.cos(a)*.18-.04],[Math.sin(a)*.43,.28,Math.cos(a)*.35-.04],.017,.009);}
    for(let side of [-1,1]){
      rod(g,M.gold,[side*.11,1.44,-.20],[side*.18,.35,-.30],.017);
      rod(g,M.goldLight,[side*.18,.35,-.30],[side*.24,.26,-.34],.018);
    }
    cylinder(g,M.gold,0,1.08,0,.245,.25,.08,24).scale.z=.84;
    sphere(g,M.crystal,0,1.08,-.219,.065,.09,.025);
    sphere(g,M.skin,0,1.64,0,.09,.13,.09);
    sphere(g,M.skin,0,1.85,-.015,.145,.20,.14);
    sphere(g,M.skinLight,0,1.81,-.143,.024,.043,.025);
    for(const x of [-.052,.052]){sphere(g,M.eye,x,1.88,-.14,.017,.012,.009);sphere(g,M.gold,x*2.1,1.73,-.012,.023,.043,.023);}
    rod(g,M.skinLight,[-.045,1.75,-.145],[.04,1.75,-.145],.009);
    faceDetail(g,1.863);
    sphere(g,M.hair,0,1.99,.015,.155,.075,.15);
    for(let i=0;i<8;i++){
      const a=i/7*Math.PI;const x=Math.cos(a)*.16;
      const curve=new T.CatmullRomCurve3([new T.Vector3(x,2,.03),new T.Vector3(x*1.5,1.86,.13),new T.Vector3(x*1.8-.12,1.61,.25),new T.Vector3(x*2.1-.18,1.48,.39)]);
      mesh(g,new T.TubeGeometry(curve,12,.024,6,false),M.hair);
      sphere(g,M.gold,x*2.1-.18,1.50,.37,.025);
      for(let j=0;j<6;j++){const p=curve.getPoint(.18+j*.13);sphere(g,M.hair,p.x+.008*(j%2?1:-1),p.y,p.z,.027,.019,.026);}
    }
    // Brow circlet and a centered blue gemstone.
    const crown=torus(g,M.gold,0,1.97,-.01,.145,.014);crown.rotation.x=Math.PI/2;
    sphere(g,M.crystal,0,1.98,-.15,.027,.038,.02);
    sphere(g,M.teal,-.29,1.44,0,.16,.15,.15);
    sphere(g,M.teal,.29,1.44,0,.16,.15,.15);
    // Layered embroidered mantle, clasp chains and inset shoulder gems.
    for(const side of [-1,1]){
      const mantle=sphere(g,M.cloth,side*.255,1.50,.012,.195,.074,.21);mantle.rotation.z=side*.15;
      const trim=torus(g,M.gold,side*.255,1.48,-.02,.15,.012,Math.PI*1.4);trim.rotation.x=Math.PI/2;
      sphere(g,M.gold,side*.24,1.48,-.168,.044,.045,.018);
      sphere(g,M.crystal,side*.24,1.48,-.189,.021,.028,.009);
    }
    chain(g,[[-.24,1.48,-.19],[0,1.32,-.25],[.24,1.48,-.19]],.01);
    chain(g,[[-.24,1.45,-.19],[0,1.27,-.25],[.24,1.45,-.19]],.007);
    const sigil=torus(g,M.goldLight,0,1.27,-.24,.055,.011);sphere(g,M.crystal,0,1.27,-.25,.025,.04,.012);
    rod(g,M.teal,[-.28,1.43,0],[-.53,1.25,-.07],.105,.075);
    rod(g,M.teal,[-.53,1.25,-.07],[-.74,1.43,-.11],.075,.065);
    sphere(g,M.gold,-.74,1.43,-.11,.072,.043,.07);
    sphere(g,M.skin,-.80,1.49,-.11,.07,.09,.06);
    rod(g,M.teal,[.28,1.43,0],[.47,1.42,-.05],.11,.08);
    rod(g,M.teal,[.47,1.42,-.05],[.72,1.64,-.11],.08,.055);
    sphere(g,M.skin,.76,1.68,-.12,.077,.045,.06);
    for(const [a,b] of [[[-.61,1.31,-.09],[-.71,1.40,-.11]],[[.61,1.54,-.09],[.71,1.63,-.11]]]){rod(g,M.gold,a,b,.074,.065);}
    for(let i=0;i<3;i++)rod(g,M.skin,[.79,1.68+i*.018,-.15],[.90+i*.025,1.72+i*.022,-.15],.013);
    rod(g,M.gold,[-.82,.25,-.1],[-.82,2.33,-.1],.028);
    for(let h of [.45,1.3,1.61,2.12])cylinder(g,M.goldLight,-.82,h,-.1,.045,.045,.04,12);
    const moon=torus(g,M.goldLight,-.82,2.43,-.1,.23,.034,Math.PI*1.62);moon.rotation.z=-.97;
    const gem=mesh(g,new T.OctahedronGeometry(.14),M.crystal,-.82,2.43,-.1);gem.scale.y=1.5;
    g.userData.role='mage';return g;
  }
  function guardian(){
    const g=new T.Group();base(g);
    clothPanel(g,M.teal,[[.25,.47,.32,.03,.03],[.55,.43,.3,.02,.03],[1.0,.34,.23,.02,.02],[1.46,.34,.17,0,.01]]);
    for(let side of [-1,1]){
      const x=side*.17;box(g,M.dark,x,.31,-.10,.22,.19,.36);
      rod(g,M.armor,[x,.38,0],[x,.88,.02],.09,.12);
      sphere(g,M.gold,x,.67,-.09,.13,.15,.09);
      rod(g,M.armor,[x,.86,0],[x*.7,1.10,0],.13,.15);
    }
    const chest=sphere(g,M.armor,0,1.28,0,.33,.39,.22);
    for(const side of [-1,1]){
      chain(g,[[side*.06,1.55,-.19],[side*.16,1.36,-.217],[side*.23,1.20,-.17]],.013);
      for(let j=0;j<4;j++){const plate=box(g,M.armor,side*.19,1.04-j*.07,-.05,.20,.065,.31);plate.rotation.z=-side*.13;}
    }
    const chestBadge=torus(g,M.goldLight,0,1.38,-.218,.078,.013);sphere(g,M.gold,0,1.38,-.226,.034,.034,.014);
    cylinder(g,M.gold,0,1.05,0,.32,.32,.08,24).scale.z=.8;
    box(g,M.goldLight,0,1.08,-.26,.10,.13,.04);
    for(let side of [-1,1]){
      sphere(g,M.gold,side*.34,1.52,0,.23,.13,.22);
      sphere(g,M.armor,side*.34,1.56,-.01,.17,.08,.18);
      rod(g,M.armor,[side*.35,1.4,0],[side*.45,1.13,-.08],.10,.09);
      sphere(g,M.gold,side*.45,1.13,-.08,.10);
      rod(g,M.armor,[side*.45,1.13,-.08],[side*.45,1.22,-.30],.09,.08);
      for(let i=0;i<3;i++){const plate=sphere(g,i===0?M.gold:M.armor,side*(.33+i*.038),1.53-i*.065,-.015,.19-i*.018,.065,.19-i*.013);}
    }
    cylinder(g,M.dark,0,1.65,0,.10,.12,.13);
    sphere(g,M.skin,0,1.83,-.015,.15,.19,.14);
    sphere(g,M.skinLight,0,1.79,-.145,.026,.04,.025);
    for(const x of [-.056,.056])sphere(g,M.eye,x,1.85,-.145,.017,.013,.01);
    sphere(g,M.hair,0,1.96,.015,.157,.08,.14);
    sphere(g,M.hair,0,1.73,-.085,.13,.10,.09);
    faceDetail(g,1.833);
    for(let i=-3;i<=3;i++){rod(g,M.hair,[i*.027,1.75,-.14],[i*.022,1.66,-.11],.009);}
    // Open-faced helmet, ridged brow and ear guards.
    const helmet=mesh(g,new T.SphereGeometry(.179,20,12,0,Math.PI*2,0,Math.PI*.50),M.armor,0,1.95,0);
    const brow=torus(g,M.gold,0,1.95,0,.175,.025);brow.rotation.x=Math.PI/2;
    for(let side of [-1,1])box(g,M.gold,side*.15,1.82,.015,.065,.23,.07);
    rod(g,M.gold,[0,1.98,-.16],[0,2.10,.12],.025);
    // Long tapered tower shield with a raised metal rim and central sunburst.
    const shield=new T.Group();shield.position.set(-.42,1.12,-.42);shield.rotation.z=-.08;g.add(shield);
    const s=new T.Shape();s.moveTo(-.31,.53);s.lineTo(.31,.53);s.lineTo(.34,-.23);s.lineTo(0,-.65);s.lineTo(-.34,-.23);s.closePath();
    mesh(shield,new T.ExtrudeGeometry(s,{depth:.07,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.025}),M.gold);
    const inset=new T.Shape();inset.moveTo(-.26,.46);inset.lineTo(.26,.46);inset.lineTo(.28,-.20);inset.lineTo(0,-.56);inset.lineTo(-.28,-.20);inset.closePath();mesh(shield,new T.ShapeGeometry(inset),M.cloth,0,0,-.028).rotation.y=Math.PI;
    rod(shield,M.goldLight,[0,-.42,-.045],[0,.38,-.045],.025);
    rod(shield,M.goldLight,[-.19,.05,-.045],[.19,.05,-.045],.025);
    sphere(shield,M.gold,0,.05,-.07,.08,.08,.035);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;rod(shield,M.gold,[Math.cos(a)*.1,.05+Math.sin(a)*.1,-.05],[Math.cos(a)*.19,.05+Math.sin(a)*.19,-.05],.009);}
    for(let side of [-1,1])for(let i=0;i<5;i++)sphere(shield,M.goldLight,side*.283,.38-i*.13,-.039,.012,.012,.009);
    for(let i=0;i<3;i++){chain(shield,[[-.22,.35-i*.18,-.04],[-.10,.28-i*.18,-.046],[0,.32-i*.18,-.047]],.004);}
    // Upright sword in the free hand.
    sphere(g,M.dark,.45,1.22,-.3,.08);
    rod(g,M.dark,[.45,1.14,-.3],[.45,1.48,-.3],.032);
    rod(g,M.gold,[.30,1.43,-.3],[.6,1.43,-.3],.027);
    const bladeShape=new T.Shape();bladeShape.moveTo(-.045,0);bladeShape.lineTo(.045,0);bladeShape.lineTo(.035,.68);bladeShape.lineTo(0,.85);bladeShape.lineTo(-.035,.68);bladeShape.closePath();
    mesh(g,new T.ExtrudeGeometry(bladeShape,{depth:.022,bevelEnabled:true,bevelSize:.01,bevelThickness:.008,bevelSegments:1,steps:1}),M.armor,.45,1.46,-.31);
    rod(g,M.goldLight,[.45,1.5,-.318],[.45,2.11,-.318],.005);
    g.userData.role='guardian';return g;
  }
  function tree(parent,x,y,z,scale=1,seed=0){
    const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(scale);parent.add(g);
    cylinder(g,M.wood,0,.27,0,.05,.08,.54,7);
    const green=mat([0x47694c,0x697948,0x365e4d][seed%3],.03,.98),light=mat([0x718554,0x87905a,0x5c7c59][seed%3],.03,.98);
    if(seed%3===1){
      cylinder(g,M.wood,0,.5,0,.035,.075,1,9);
      for(let i=0;i<7;i++){const a=i*2.4,rr=i<4?.28:.16,yy=.85+(i%3)*.18;rod(g,M.wood,[0,.5,0],[Math.cos(a)*rr,yy,Math.sin(a)*rr],.018,.009);const clump=mesh(g,new T.IcosahedronGeometry(.32,1),i%2?green:light,Math.cos(a)*rr,yy,Math.sin(a)*rr);clump.scale.set(1,.83,1);clump.rotation.y=a;}
    }else{
      for(let i=0;i<5;i++){
        const yy=.40+i*.19,rr=.38-i*.056;
        const geo=new T.ConeGeometry(rr,.48,12,3);const v=geo.attributes.position;
        for(let j=0;j<v.count;j++){const xx=v.getX(j),zz=v.getZ(j),angle=Math.atan2(zz,xx),factor=1+Math.sin(angle*7+seed+i)*.10;v.setX(j,xx*factor);v.setZ(j,zz*factor);}
        geo.computeVertexNormals();const o=mesh(g,geo,i%2?green:light,Math.sin(i*2+seed)*.025,yy,0);o.rotation.y=seed*.7+i*.3;
      }
    }
    return g;
  }
  function rock(parent,x,y,z,s=1){const a=mesh(parent,new T.DodecahedronGeometry(.25,0),M.stone,x,y,z);a.scale.set(s,s*.65,s*.8);a.rotation.set(.2,x,z);return a;}
  function rampart(){
    const g=new T.Group();
    for(let i=0;i<3;i++){box(g,M.stone,(i-1)*.42,.32,0,.39,.6,.26);box(g,M.stone,(i-1)*.42+.03,.76,0,.39,.26,.28);box(g,M.gold,(i-1)*.42,.55,-.145,.16,.025,.015);}
    for(const x of [-.55,.55])box(g,M.stone,x,1,0,.22,.27,.30);
    return g;
  }
  return {M,mat,mesh,sphere,cylinder,rod,box,torus,mage,guardian,tree,rock,rampart};
})();
