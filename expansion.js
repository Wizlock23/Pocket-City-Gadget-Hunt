// Pocket City v1.2.0 — append-only world content keeps original star IDs stable.
export function buildExpansion({T,scene,box,ball,label,tree,ring,star,pads}){
  const dynamic=[],crystals=[],rescues=[],relays=[];
  const districts=[
    {name:'Sunshine Square',x:14,y:0,z:5,color:0xe8c674,activity:'Gadgets, rooftop stars & City Sprint'},
    {name:'Botanical Bot Park',x:-23,y:0,z:-22,color:0x70c394,activity:'Bubble-blaster dance party'},
    {name:'Bubble Beach',x:27,y:0,z:-60,color:0xf4d787,activity:'Find Super Bounce beside the umbrellas'},
    {name:'Skyhop Hill',x:0,y:0,z:55,color:0xaaba87,activity:'Launch pads & the sky trail'},
    {name:'Moonbase Marshmallow',x:-185,y:0,z:-185,color:0xb1b5e2,activity:'Low gravity · repair 3 power relays'},
    {name:'Prism Canyon',x:185,y:0,z:-185,color:0xdfa376,activity:'Find 6 crystals to open the treasure vault'},
    {name:'Gigglecap Grove',x:-185,y:0,z:185,color:0x82c495,activity:'Rescue 5 tiny lost robots'},
    {name:'Neon Boardwalk',x:185,y:0,z:185,color:0x88bddd,activity:'Find a hoverboard & race the Neon Loop'},
    {name:'Cloudtop Islands',x:0,y:22.6,z:145,color:0xd3e2f0,activity:'Grapple between floating islands to the beacon'}
  ];
  // Long-distance routes connect every district. The original city stays intact.
  for(const z of [-185,185]){box(0,.02,z,550,.08,12,0x81969b);for(let x=-265;x<270;x+=16)box(x,.11,z,5,.01,.3,0xffedac);}
  for(const x of [-185,185]){box(x,.02,0,12,.08,550,0x81969b);for(let z=-265;z<270;z+=16)box(x,.11,z,.3,.01,5,0xffedac);}
  label('MOONBASE ↖  ·  CANYON ↗',0,10,-103,'#52608c',1.15);
  label('GROVE ↙  ·  NEON ↘',0,10,105,'#36806b',1.15);
  // Moonbase: gentle crater landscape, launch rocket, three walk-up relays.
  box(-185,.15,-185,140,.12,140,0xb9b9d2);
  for(let i=0;i<13;i++){const a=i*2.4,r=28+(i%4)*12;ball(-185+Math.sin(a)*r,1,-185+Math.cos(a)*r,3+i%3,0x999ab8);}
  for(const [x,z]of [[-227,-155],[-226,-218],[-148,-222]]){
    box(x,0,z,19,9,18,0xe9ebfa,true);box(x,9,z,21,1,20,0x8e8cb8,true);
    for(let j=-1;j<=1;j++)box(x+j*4,3,z+9.1,2.8,2,.2,0x62679f);
    ring(x,14,z);
  }
  box(-185,0,-205,21,.5,21,0x777998,true);
  box(-185,.5,-205,4,15,4,0xfff3dd,true);box(-185,7,-205,4.3,2,4.3,0xeb867c);
  ball(-185,17,-205,2.8,0xffcf69);
  for(const x of [-189,-181])box(x,0,-205,2,5,3,0xa4bdd1);
  label('MOONBASE MARSHMALLOW',-185,24,-180,'#646197',1.5);
  label('3 RELAYS → ROCKET RIDE',-185,6,-193,'#646197',.8);
  for(const [x,z]of [[-156,-169],[-224,-180],[-185,-238]]){
    box(x,0,z,4,2,4,0x737c9f);const m=ball(x,3,z,1.2,0xffc84f);dynamic.push(m);relays.push({m,x,z,id:relays.length});
    label('POWER RELAY',x,6,z,'#626292',.6);
  }
  // Canyon: walkable stepped mesas, crystalline arches, a visible treasure vault.
  box(185,.15,-185,140,.12,140,0xe9b784);
  for(const [x,z,h]of [[135,-225,9],[160,-240,16],[208,-237,11],[237,-215,19],[233,-153,12],[188,-139,8]]){
    box(x,0,z,17,h,17,0xc98260,true);box(x,h,z,19,.6,19,0xf2cf99,true);ring(x,h+4,z);
    for(let y=3;y<h;y+=5)box(x,y,z,17.2,.6,17.2,0xe5a276);
  }
  box(185,0,-220,3,16,4,0xaf81c7,true);box(213,0,-220,3,16,4,0xaf81c7,true);box(199,16,-220,31,3,4,0xcfa6e8,true);
  const crystalPlaces=[[147,1.8,-155],[135,11,-225],[160,18,-240],[212,1.8,-168],[233,14,-153],[200,1.8,-218]];
  for(const [x,y,z]of crystalPlaces){const m=new T.Mesh(new T.OctahedronGeometry(1.3),new T.MeshLambertMaterial({color:0xb4faff,emissive:0x22666c}));m.position.set(x,y,z);scene.add(m);dynamic.push(m);crystals.push({m,x,y,z,id:crystals.length});}
  box(248,0,-245,18,8,3,0x9c7274,true);box(239,0,-237,3,8,16,0x9c7274,true);box(257,0,-237,3,8,16,0x9c7274,true);box(248,8,-237,21,2,19,0xc49a9c,true);
  const vault=box(248,0,-235,5,3,4,0xf4c64e);dynamic.push(vault);
  label('PRISM CANYON',184,22,-140,'#995637',1.25);label('6 CRYSTALS = TREASURE',248,13,-235,'#995637',.8);
  // Mushroom forest: giant bouncy caps, stepping trail, five friendly rescues.
  box(-185,.15,185,140,.12,140,0x6bb393);
  const caps=[];
  for(let i=0;i<15;i++){
    const x=-240+(i%5)*27,z=143+Math.floor(i/5)*45,h=5+(i%4)*3;
    box(x,0,z,2,h,2,0xeadabe,true);box(x,h,z,13,1.5,13,i%2?0xe791b3:0xa29dda,true);
    box(x,h+1.5,z,8,.5,8,0xffeecf,true);ring(x,h+5,z);caps.push({x,z,y:h+2});
    for(const offset of [-3,3])box(x+offset,h+1.52,z-3,1,.2,1,0xffeecf);
    if(i%3===0){const m=box(x,h+2,z,3,.2,3,0xb586ee);pads.push({x,z,y:h+2,m});}
  }
  for(const [i,y]of [[0,0],[3,0],[6,0],[10,0],[14,0]]){
    const c=caps[i],g=new T.Group();
    const body=new T.Mesh(new T.BoxGeometry(1.6,1.6,1.2),new T.MeshLambertMaterial({color:0xffcc6c}));body.position.y=1.2;g.add(body);
    for(const x of [-.35,.35]){const eye=new T.Mesh(new T.BoxGeometry(.22,.3,.1),new T.MeshBasicMaterial({color:0x244459}));eye.position.set(x,1.45,.66);g.add(eye);}
    g.position.set(c.x+8,y,c.z+7);scene.add(g);rescues.push({g,x:c.x+8,y,z:c.z+7,id:rescues.length});
    label('LOST BUDDY',c.x+8,4,c.z+7,'#618559',.55);
  }
  label('GIGGLECAP GROVE',-185,24,130,'#35765e',1.35);
  // Neon district: colorful towers around an unobstructed rectangular race loop.
  box(185,.15,185,140,.12,140,0x6f91a8);
  for(const [x,z,h]of [[160,165,13],[208,163,22],[164,211,18],[211,211,15]]){
    box(x,0,z,14,h,14,0x536387,true);box(x,h,z,16,.6,16,0xa9def3,true);
    for(let y=2;y<h;y+=4)box(x,y,z+7.1,14,.5,.2,y%8===2?0x7af9ed:0xff9bde);
    ring(x,h+4,z);
  }
  for(const z of [132,240])box(185,.3,z,112,.1,9,0x354d67);
  for(const x of [132,240])box(x,.3,185,9,.1,112,0x354d67);
  for(let n=0;n<7;n++){box(139+n*15,.4,127,6,.2,.3,0x72f7e0);box(139+n*15,.4,245,6,.2,.3,0xff91d4);}
  label('NEON BOARDWALK',185,28,132,'#565686',1.35);
  const boardPickup=box(146,1,146,3,.4,1.3,0x75ffe0);dynamic.push(boardPickup);label('FREE HOVERBOARD',146,6,146,'#376e86',.7);
  // Floating islands: each is within grapple range of its neighbors. Rocket is an alternative entry.
  const islands=[[0,22,145],[-24,32,168],[18,42,187],[-20,52,212],[16,62,237]];
  for(const [x,y,z]of islands){
    box(x,y-6,z,9,6,9,0xa1b7bd,true);box(x,y,z,18,.6,18,0xdff1e2,true);
    ring(x,y+5,z);box(x-5,y+.6,z,1,4,1,0xb59b79);ball(x-5,y+6,z,3,0xa7dcbe);
  }
  // Approach rings create a readable ascent from the existing hill.
  ring(0,17,117);label('CLOUDTOP ISLANDS',0,31,132,'#6586a1',1.15);
  const beacon=box(16,62.6,237,2,7,2,0xfce37d);dynamic.push(beacon);label('SKY BEACON',16,74,237,'#728ca8',.7);
  // Ten extra stars per new district; first 32 star identities remain untouched.
  for(const [cx,cz]of [[-185,-185],[185,-185],[-185,185],[185,185]]){
    for(let i=0;i<10;i++){const a=i*Math.PI*2/10;star(cx+Math.cos(a)*48,1.8,cz+Math.sin(a)*48);}
  }
  for(const [x,y,z]of islands){star(x+4,y+2,z);star(x-3,y+2,z+4);}
  // Small landmarks break up the travel corridors without expensive detailed geometry.
  for(const [x,z]of [[90,150],[-90,-150],[150,90],[-150,-90],[80,-240],[-85,245]]){tree(x,z,2);tree(x+9,z+5,1.5);}
  return {districts,dynamic,crystals,rescues,relays,vault,boardPickup,beacon,islands};
}
