import * as T from './three.module.js';
// Pocket City 1.1 — shared geometry, instanced scenery, fixed-step movement.
const elements=new Map();
const $=s=>{if(!elements.has(s))elements.set(s,document.querySelector(s));return elements.get(s);};
const canvas=$('#world');
const coarse=matchMedia('(pointer:coarse)').matches;
let renderer;
try{renderer=new T.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});}catch(e){$('#start').textContent='3D is unavailable in this browser';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,coarse?1:1.25));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=false;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0xa9def0);
const scene=new T.Scene();scene.fog=new T.Fog(0xa9def0,100,235);const camera=new T.PerspectiveCamera(58,innerWidth/innerHeight,.1,350);
scene.add(new T.HemisphereLight(0xd8f6ff,0x67935b,2.3));const sun=new T.DirectionalLight(0xfff2d4,2.6);sun.position.set(-45,85,35);sun.castShadow=false;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-95,right:95,top:95,bottom:-95,far:220});sun.shadow.bias=-.0005;scene.add(sun);
const cubeGeometry=new T.BoxGeometry(1,1,1), ballGeometry=new T.IcosahedronGeometry(1,0);
const starGeometry=new T.OctahedronGeometry(.65), ringGeometry=new T.TorusGeometry(1,.19,5,16);
const starMaterial=new T.MeshLambertMaterial({color:0xffcf35,emissive:0x684300});
const mats=new Map(), boxes=[], stars=[], crates=[], anchors=[], bots=[], particles=[], pads=[];
function mat(c){if(!mats.has(c))mats.set(c,new T.MeshLambertMaterial({color:c}));return mats.get(c);}
function box(x,y,z,w,h,d,c,solid=false){const m=new T.Mesh(cubeGeometry,mat(c));m.scale.set(w,h,d);m.position.set(x,y+h/2,z);m.castShadow=h>1;m.receiveShadow=true;scene.add(m);if(solid)boxes.push({x,z,w,d,top:y+h,bottom:y});return m;}
function ball(x,y,z,r,c){const m=new T.Mesh(ballGeometry,mat(c));m.scale.setScalar(r);m.position.set(x,y,z);m.castShadow=true;scene.add(m);return m;}
function label(text,x,y,z,color='#214652',scale=1){let c=document.createElement('canvas');c.width=512;c.height=96;let ctx=c.getContext('2d');ctx.fillStyle='#fff8e6';ctx.beginPath();ctx.roundRect(0,0,512,96,20);ctx.fill();ctx.fillStyle=color;ctx.font='bold 35px sans-serif';ctx.textAlign='center';ctx.fillText(text,256,60);let m=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c)}));m.position.set(x,y,z);m.scale.set(14*scale,2.63*scale,1);scene.add(m);return m;}
function tree(x,z,s=1){box(x,0,z,.8*s,3*s,.8*s,0x946c48);ball(x,4*s,z,2.1*s,0x4baf72);ball(x+.8*s,5*s,z,.95*s,0x76c578);}
function ring(x,y,z){const m=new T.Mesh(ringGeometry,mat(0x4ff2ff));m.position.set(x,y,z);scene.add(m);anchors.push(m);return m;}
function star(x,y,z){let m=new T.Mesh(starGeometry,starMaterial);m.position.set(x,y,z);scene.add(m);stars.push({m,id:stars.length,y});}
function crate(x,z,type){let m=box(x,0,z,2.4,2.4,2.4,[0,0x29bfe6,0xff866e,0xc197ff][type]);const band=box(x,1,z,2.6,.4,2.6,0xfff2c9);const sign=label(['','GRAPPLE HOOK','BUBBLE BLASTER','SUPER BOUNCE'][type],x,5,z,'#214652',.7);crates.push({m,band,sign,x,z,type});}
// A compact continuous world, with recognizable landmarks and short paths.
box(0,-2,0,190,2,190,0x8fcf89);box(0,-3,0,210,1,210,0x55c3d5);
box(0,0,0,22,.08,184,0x70888e);box(0,0,0,184,.08,18,0x70888e);
box(-13,0,0,3,.16,184,0xd9ddd0);box(13,0,0,3,.16,184,0xd9ddd0);box(0,0,-11,184,.16,3,0xd9ddd0);box(0,0,11,184,.16,3,0xd9ddd0);
for(let i=-85;i<90;i+=10){if(Math.abs(i)>13){box(0,.09,i,.3,.01,4,0xffedac);box(i,.09,0,4,.01,.3,0xffedac);}}
// Fountain square and colorful city blocks.
box(27,0,28,29,.2,28,0xe5d9b5);box(27,.2,29,10,.8,10,0xfff3d8,true);box(27,1,29,8,.12,8,0x46c6e4);box(27,1.1,29,2,2.2,2,0xf7edcd,true);ball(27,3.7,29,.85,0x6de0ec);
label('SUNSHINE SQUARE',24,10,46,'#307f72',1);
const colors=[0xf3b258,0xe78978,0x72b9c7,0xa797cd,0xedd17b];let bi=0;
for(const [x,z,w,d,h]of [[-27,24,16,14,13],[-47,24,14,16,20],[-68,25,16,17,12],[-27,48,16,15,24],[-49,50,15,14,16],[-69,52,16,14,30],[49,24,13,16,12],[67,26,14,17,19],[48,51,16,17,23],[69,52,14,14,13]]){const c=colors[bi++%5];box(x,0,z,w,h,d,c,true);box(x,h,z,w+1,.6,d+1,0xfff4d7,true);for(let floor=3;floor<h-1;floor+=4)for(let a=-w/2+2;a<w/2-1;a+=3.5){box(x+a,floor,z-d/2-.04,1.5,2,.15,0x355868);box(x+a,floor,z+d/2+.04,1.5,2,.15,0x355868);}box(x,0,z-d/2-.2,3,3.6,.5,0x325467);ring(x,h+3,z);star(x,h+1.6,z+3);}
label('ROOFTOP CLUB',-69,34,52,'#8162b6',.8);
// Park and friendly target robots.
box(-47,.01,-48,67,.1,64,0x6ebd82);box(-47,.12,-48,56,.08,4,0xe5d7ad);box(-47,.12,-48,4,.08,56,0xe5d7ad);label('BOTANICAL BOT PARK',-45,10,-18,'#308461',1);
for(let i=0;i<12;i++){let x=-77+(i%4)*19,z=-73+Math.floor(i/4)*22;if(Math.abs(x+47)>8)tree(x,z,1+(i%3)*.18);}
function makeBot(x,z){const g=new T.Group();function part(w,h,d,c,px,py,pz){const m=new T.Mesh(cubeGeometry,mat(c));m.scale.set(w,h,d);m.position.set(px,py,pz);m.castShadow=true;g.add(m);}part(2,1.7,1.5,0xffb877,0,1.5,0);part(2.3,1.6,1.7,0x9bddcd,0,3.1,0);part(.4,.4,.1,0x214b59,-.55,3.3,.89);part(.4,.4,.1,0x214b59,.55,3.3,.89);part(.65,.8,.65,0x34586a,-.6,.4,0);part(.65,.8,.65,0x34586a,.6,.4,0);g.position.set(x,0,z);scene.add(g);bots.push({g,x,z,cool:0,hits:0});}
for(const [x,z]of [[-35,-34],[-61,-49],[-32,-66],[-65,-70],[-55,-27]])makeBot(x,z);
// Beach and pier.
box(49,0,-42,65,.13,62,0xf3db97);box(58,.01,-77,75,.16,22,0x54c8db);box(48,.3,-70,8,.7,32,0xb99064,true);box(48,.3,-85,24,.7,7,0xb99064,true);label('BUBBLE BEACH',44,10,-18,'#25899c',.95);
for(let i=0;i<5;i++){let x=24+i*13,z=-33-(i%2)*21;box(x,.15,z,.35,4,.35,0x946d4a);const roof=new T.Mesh(new T.ConeGeometry(3.3,1.3,8),mat(i%2?0xe98480:0x6fc2c0));roof.position.set(x,4.5,z);scene.add(roof);box(x+2,.13,z+1,1.5,.4,3,0xfff6d5);}
// Mountain stepping trail and launch pads.
box(0,.1,76,28,3,25,0x9dad82,true);box(0,3.1,81,19,4,16,0xadb696,true);box(0,7.1,85,11,5,9,0xc3c6a9,true);ring(0,16,85);star(0,13.5,85);label('SKYHOP HILL',1,21,86,'#777652',.8);
for(const [x,z]of [[20,65],[-18,70],[0,64],[-45,74],[65,75]]){let m=box(x,.05,z,4,.35,4,0xb586ee);pads.push({x,z,m});ring(x,5,z);}
for(let i=0;i<16;i++){let x=-83+(i%8)*23,z=i<8?86:-87;if(Math.abs(x)>17)tree(x,z,1.1);}
crate(20,17,1);crate(-23,-22,2);crate(27,-60,3);
for(const [x,z]of [[17,12],[19,15],[24,21],[34,34],[37,44],[-18,12],[-36,12],[-59,12],[-19,-17],[-26,-26],[-44,-47],[-69,-50],[-33,-66],[22,-18],[35,-38],[63,-53],[48,-65],[48,-83],[0,55],[-18,67],[64,74]])star(x,1.7,z);
// Clouds beyond the island.
for(let i=0;i<12;i++){let x=Math.sin(i*2.4)*115,z=Math.cos(i*2.4)*115;for(let j=0;j<3;j++)box(x+j*5,42+(i%4)*5,z,9,3+j%2*2,6,0xffffff);}
// Blocky explorer, intentionally readable at a distance.
const player=new T.Group();scene.add(player);function limb(w,h,d,c,x,y,z){let m=new T.Mesh(cubeGeometry,mat(c));m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=true;player.add(m);return m;}
limb(1.35,1.35,.8,0xf5b943,0,1.8,0);limb(1.15,1.1,1.05,0xf3cf9c,0,3,0);limb(1.3,.32,1.15,0x326a78,0,3.65,0);limb(1.4,.12,.5,0x326a78,0,3.54,.5);limb(.16,.16,.05,0x273f49,-.25,3.1,.55);limb(.16,.16,.05,0x273f49,.25,3.1,.55);limb(.62,.8,.4,0xe77e4e,0,1.8,-.54);const legs=[limb(.49,.95,.6,0x3b677b,-.37,.53,0),limb(.49,.95,.6,0x3b677b,.37,.53,0)],arms=[limb(.43,1.15,.57,0xf3cf9c,-.9,1.9,0),limb(.43,1.15,.57,0xF3cf9c,.9,1.9,0)];player.position.set(14,0,5);

// Bake scenery into spatial batches. Moving objects and pickups stay independent.
const dynamicMeshes=new Set([...stars.map(s=>s.m),...anchors,...crates.flatMap(c=>[c.m,c.band])]);
const batches=new Map();
let originalSceneryMeshes=0;
for(const mesh of [...scene.children]){
  if(!mesh.isMesh||dynamicMeshes.has(mesh))continue;
  const key=`${mesh.geometry.uuid}/${mesh.material.uuid}/${Math.floor(mesh.position.x/48)}/${Math.floor(mesh.position.z/48)}`;
  if(!batches.has(key))batches.set(key,[]);
  batches.get(key).push(mesh);originalSceneryMeshes++;
}
for(const meshes of batches.values()){
  const first=meshes[0];
  const batch=new T.InstancedMesh(first.geometry,first.material,meshes.length);
  meshes.forEach((mesh,i)=>{mesh.updateMatrix();batch.setMatrixAt(i,mesh.matrix);scene.remove(mesh);});
  batch.computeBoundingSphere();batch.matrixAutoUpdate=false;scene.add(batch);
}
// Cache collider bounds once instead of constructing them for every frame.
for(const b of boxes)b.bounds=new T.Box3(new T.Vector3(b.x-b.w/2-.15,b.bottom,b.z-b.d/2-.15),new T.Vector3(b.x+b.w/2+.15,b.top+.15,b.z+b.d/2+.15));
const v1=new T.Vector3(), v2=new T.Vector3(), v3=new T.Vector3();
const ray=new T.Ray(), rayHit=new T.Vector3(), cameraTarget=new T.Vector3(), cameraOffset=new T.Vector3();
const UP=new T.Vector3(0,1,0);
const names=['Sunshine Square','Botanical Bot Park','Bubble Beach','Skyhop Hill'];
let saved={};
try{const value=JSON.parse(localStorage.getItem('pocketCity-v1')||'{}');if(value&&typeof value==='object')saved=value;}catch{}
const validArray=(a,test)=>Array.isArray(a)?a.filter(test):[];
const unlocked=new Set([0,...validArray(saved.tools,n=>[1,2,3].includes(n))]);
const collected=new Set(validArray(saved.stars,n=>Number.isInteger(n)&&n>=0&&n<stars.length));
const visited=new Set(validArray(saved.areas,n=>Number.isInteger(n)&&n>=0&&n<4));
let botHits=Number.isFinite(saved.hits)?Math.max(0,Math.floor(saved.hits)):0;
let raceBest=Number.isFinite(saved.raceBest)&&saved.raceBest>0?saved.raceBest:null;
for(const s of stars)s.m.visible=!collected.has(s.id);
for(const c of crates){c.m.visible=c.band.visible=c.sign.visible=!unlocked.has(c.type);}
let tool=0,active=false,paused=false,yaw=Math.PI*.8,pitch=.32,vy=0,onGround=true;
let time=0,actionCooldown=0,grapple=null,drag=null,joystick={x:0,y:0},sound=!!saved.sound,audio;
let currentArea=-1,toastTimer,saveTimer,saveDirty=false;
let sprintToggle=false,dashTime=0,dashCooldown=0,dashX=0,dashZ=0;
let velocityX=0,velocityZ=0,coyote=.12,jumpBuffer=0,airJump=true,useHeld=false;
let combo=0,comboLeft=0,boostLeft=0,bubbleStreak=0,bubbleStreakLeft=0;
let accumulator=0,lastFrame=null,hudClock=0,qualityClock=0,frameTotal=0,frameCount=0;
let quality=['auto','smooth','crisp'].includes(saved.quality)?saved.quality:'auto';
let renderScale=Math.min(devicePixelRatio,coarse?1:1.25),cameraDistance=20,cameraReady=false;
const keys={};
const STEP=1/120,MAX_FRAME=.2;
const RUN_SPEED=18,SPRINT_SPEED=27,DASH_SPEED=45;
const rope=new T.Line(new T.BufferGeometry().setAttribute('position',new T.BufferAttribute(new Float32Array(6),3)),new T.LineBasicMaterial({color:0x42eaff}));
rope.frustumCulled=false;rope.visible=false;scene.add(rope);
// Fixed-capacity effects: no new meshes/geometries are allocated during play.
const MAX_PARTICLES=96,MAX_BUBBLES=12;
const fx=new T.InstancedMesh(ballGeometry,new T.MeshBasicMaterial({color:0xffffff}),MAX_PARTICLES);
fx.instanceMatrix.setUsage(T.DynamicDrawUsage);fx.frustumCulled=false;fx.count=0;scene.add(fx);
const fxMatrix=new T.Matrix4(),fxColor=new T.Color();
for(let i=0;i<MAX_PARTICLES;i++)particles.push({life:0,x:0,y:0,z:0,vx:0,vy:0,vz:0,color:0xffffff});
const bubbles=[];
for(let i=0;i<MAX_BUBBLES;i++){
  const m=new T.Mesh(ballGeometry,mat(0x86eeff));m.scale.setScalar(.55);m.visible=false;scene.add(m);
  bubbles.push({m,life:0,v:new T.Vector3(),target:null});
}
// A cheap contact shadow replaces the expensive moving shadow map.
const contact=new T.Mesh(new T.CircleGeometry(.95,16),new T.MeshBasicMaterial({color:0x365b52,transparent:true,opacity:.25,depthWrite:false}));
contact.rotation.x=-Math.PI/2;scene.add(contact);
// Optional repeatable course; all checkpoints are on unobstructed roads.
const course=[[0,5],[0,-21],[-21,-11],[-43,-11],[-43,0],[0,0],[0,37],[0,56],[14,55],[14,15]];
let race={active:false,index:0,elapsed:0};
const raceMarker=new T.Mesh(new T.TorusGeometry(2.7,.23,6,28),new T.MeshBasicMaterial({color:0xffce43}));
raceMarker.visible=false;scene.add(raceMarker);
const raceBeam=new T.Mesh(new T.CylinderGeometry(.16,.16,18,5),new T.MeshBasicMaterial({color:0xffce43,transparent:true,opacity:.38,depthWrite:false}));
raceBeam.visible=false;scene.add(raceBeam);
const spawn=new T.Vector3(14,0,5);

function flushSave(){
  if(!saveDirty)return;
  try{localStorage.setItem('pocketCity-v1',JSON.stringify({tools:[...unlocked],stars:[...collected],areas:[...visited],hits:botHits,raceBest,sound,quality}));saveDirty=false;}catch{}
}
function save(){saveDirty=true;clearTimeout(saveTimer);saveTimer=setTimeout(flushSave,400);}
addEventListener('pagehide',flushSave);
function tone(f=600){
  if(!sound)return;
  try{audio??=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});
    const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=f;
    g.gain.setValueAtTime(.045,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.14);
    o.onended=()=>{o.disconnect();g.disconnect();};o.start();o.stop(audio.currentTime+.14);
  }catch{}
}
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2800);}
function ui(){
  $('#stars').textContent=collected.size;$('#progress').style.width=visited.size/4*100+'%';
  $('#progressText').textContent=visited.size+' of 4 neighborhoods explored';
  document.querySelectorAll('[data-tool]').forEach(b=>{b.classList.toggle('unlocked',unlocked.has(+b.dataset.tool));b.classList.toggle('selected',+b.dataset.tool===tool);b.setAttribute('aria-pressed',String(+b.dataset.tool===tool));});
  let title,text;
  if(!unlocked.has(1)){title='Your first gadget is close';text='Follow the stars to the blue crate beside the fountain.';}
  else if(!unlocked.has(2)){title='Bubble dance party';text='Find the orange crate across the road in the robot park.';}
  else if(!unlocked.has(3)){title='Bounce into the beach';text='The purple crate by the beach unlocks giant jumps.';}
  else if(visited.size<4){title='Head for Skyhop Hill';text='Try a double jump or a giant bounce on the mountain trail.';}
  else{title=collected.size===stars.length?'City superstar!':'Race or reach the rooftops';text=collected.size===stars.length?'All stars found! Beat your race time or start a robot dance party.':`${stars.length-collected.size} stars to go. Chain 3 quick pickups for a speed boost!`;}
  $('#questTitle').textContent=title;$('#questText').textContent=text;
}
function select(n){
  if(!unlocked.has(n)){toast(['','Blue crate: beside the fountain','Orange crate: robot park','Purple crate: beach'][n]);return;}
  tool=n;useHeld=false;ui();
  $('#tip').textContent=coarse?'Drag to look · Tap Jump twice · Dash for a boost':[
    'WASD / arrows · Shift to sprint · Space ×2 to double jump · Q to dash',
    'Aim near a blue ring · E / click to grapple · Space to release · Q to dash',
    'Face a robot · Hold E / USE to fire bubbles · Q to dash',
    'E / click for a giant bounce · Space for an extra jump · Q to dash'
  ][n];
}
function burst(pos,color,count=10){
  for(const p of particles){if(p.life>0)continue;
    p.life=.5+Math.random()*.2;p.x=pos.x;p.y=pos.y+1;p.z=pos.z;
    p.vx=(Math.random()-.5)*9;p.vy=Math.random()*7;p.vz=(Math.random()-.5)*9;p.color=color;
    if(--count<=0)break;
  }
}
function segmentClear(from,to){
  v3.subVectors(to,from);const len=v3.length();if(len<.01)return true;
  ray.set(from,v3.multiplyScalar(1/len));
  for(const b of boxes){const hit=ray.intersectBox(b.bounds,rayHit);if(hit&&hit.distanceToSquared(from)<(len-.3)**2)return false;}
  return true;
}
function chooseAnchor(){
  let best=null,score=Infinity;
  camera.updateMatrixWorld();
  for(const a of anchors){
    const d=a.position.distanceToSquared(player.position);if(d>85*85||d<9)continue;
    v1.copy(a.position).project(camera);const s=Math.hypot(v1.x,v1.y);
    if(v1.z< -1||v1.z>1||s>.92)continue;
    const candidate=s+Math.sqrt(d)*.002;
    if(candidate<score){best=a;score=candidate;}
  }
  return best;
}
function takeJump(power){vy=power;onGround=false;coyote=0;jumpBuffer=0;tone(420);}
function jump(){
  if(!active||paused)return;
  if(grapple){grapple=null;takeJump(13);airJump=true;return;}
  if(onGround||coyote>0){takeJump(14);return;}
  if(airJump){airJump=false;takeJump(13);burst(player.position,0xffffff,6);return;}
  jumpBuffer=.15;
}
function dash(){
  if(!active||paused||dashCooldown>0)return;
  const speed=Math.hypot(velocityX,velocityZ);
  dashX=speed>1?velocityX/speed:-Math.sin(yaw);dashZ=speed>1?velocityZ/speed:-Math.cos(yaw);
  dashTime=.19;dashCooldown=.95;burst(player.position,0xffe39a,5);tone(280);
}
function use(){
  if(!active||paused||actionCooldown>0)return;
  if(tool===0){dash();return;}
  actionCooldown=tool===2?.19:.22;
  if(tool===1){
    const a=chooseAnchor();
    if(a){grapple={target:a.position.clone().addScaledVector(UP,1),start:player.position.clone(),progress:0};grapple.duration=Math.max(.25,grapple.start.distanceTo(grapple.target)/58);onGround=false;vy=0;airJump=true;tone(780);}
    else toast('Turn toward a blue ring, then press USE.');
  }
  if(tool===2){
    const bubble=bubbles.find(b=>b.life<=0);if(!bubble)return;
    let target=null,best=45;
    const sx=player.position.x,sz=player.position.z,fx=-Math.sin(yaw),fz=-Math.cos(yaw);
    v1.copy(player.position);v1.y+=2.5;
    for(const b of bots){
      const dx=b.g.position.x-sx,dz=b.g.position.z-sz,d=Math.hypot(dx,dz);
      if(b.cool>0||d>=best||(dx*fx+dz*fz)/Math.max(.01,d)<.3)continue;
      v2.copy(b.g.position);v2.y+=2.3;if(!segmentClear(v1,v2))continue;
      target=b;best=d;
    }
    bubble.m.position.copy(v1);bubble.m.visible=true;bubble.target=target;
    if(target){v2.copy(target.g.position);v2.y+=2.3;}else{v2.copy(v1);v2.x+=fx*45;v2.z+=fz*45;}
    bubble.v.subVectors(v2,v1).normalize().multiplyScalar(65);bubble.life=.8;tone(490);
  }
  if(tool===3){
    if(onGround||coyote>0){takeJump(29);airJump=true;burst(player.position,0xc394ff);tone(820);}
    else if(airJump){airJump=false;takeJump(18);burst(player.position,0xc394ff,6);}
  }
}
function clearInputs(){
  Object.keys(keys).forEach(k=>delete keys[k]);joystick.x=joystick.y=0;$('#thumb').style.transform='';
  drag=null;stickId=null;useHeld=false;velocityX=velocityZ=0;jumpBuffer=0;
}
function setPause(p){paused=p;$('#menu').hidden=!p;clearInputs();lastFrame=null;accumulator=0;if(p)flushSave();}
function respawn(message='Back at the fountain. Ready to go!'){
  player.position.copy(spawn);vy=0;grapple=null;dashTime=0;onGround=true;airJump=true;coyote=.12;cameraReady=false;
  clearInputs();if(race.active)endRace(false);toast(message);
}
function setQuality(){
  renderScale=quality==='smooth'?.85:quality==='crisp'?Math.min(devicePixelRatio,1.6):Math.min(devicePixelRatio,coarse?1:1.25);
  renderer.setPixelRatio(renderScale);renderer.setSize(innerWidth,innerHeight);
  $('#quality').textContent='Graphics: '+({auto:'Auto',smooth:'Smooth',crisp:'Crisp'}[quality]);
  qualityClock=frameTotal=frameCount=0;
}
function startRace(){
  setPause(false);respawn('City Sprint! Follow the gold checkpoints.');
  yaw=Math.PI/2;race={active:true,index:0,elapsed:0};raceMarker.visible=raceBeam.visible=true;placeCheckpoint();
  $('#raceButton').textContent='Stop race';
}
function placeCheckpoint(){const [x,z]=course[race.index];raceMarker.position.set(x,2.7,z);raceBeam.position.set(x,10,z);}
function endRace(finished){
  if(finished){
    const record=raceBest===null||race.elapsed<raceBest;if(record){raceBest=race.elapsed;save();}
    toast(`${record?'New best!':'Race complete!'} ${race.elapsed.toFixed(1)} seconds ★`);burst(player.position,0xffd342,20);
  }
  race.active=false;raceMarker.visible=raceBeam.visible=false;$('#raceButton').textContent='▶ City Sprint';
}
$('#start').onclick=()=>{
  active=true;document.body.classList.add('playing');yaw=Math.PI;pitch=.28;lastFrame=null;cameraReady=false;select(unlocked.has(1)?1:0);
  toast(unlocked.has(1)?'Welcome back! Try a dash or the City Sprint.':'Follow the stars to your first gadget!');
};
$('#pause').onclick=()=>{if(active)setPause(true);};$('#resume').onclick=()=>setPause(false);
$('#home').onclick=()=>{respawn();setPause(false);};
$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent='Sound: '+(sound?'on':'off');save();tone();};
$('#quality').onclick=()=>{quality=['auto','smooth','crisp'][(['auto','smooth','crisp'].indexOf(quality)+1)%3];setQuality();save();};
$('#raceButton').onclick=()=>{if(active&&!paused){if(race.active)endRace(false);else startRace();}};
$('#sprint').onclick=()=>{sprintToggle=!sprintToggle;$('#sprint').classList.toggle('enabled',sprintToggle);$('#sprint').setAttribute('aria-pressed',String(sprintToggle));};
$('#dash').onpointerdown=e=>{e.preventDefault();dash();};
$('#jump').onpointerdown=e=>{e.preventDefault();jump();};
$('#use').onpointerdown=e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);use();useHeld=tool===2;};
$('#use').onpointerup=$('#use').onpointercancel=()=>useHeld=false;
$('#use').addEventListener('lostpointercapture',()=>useHeld=false);
for(const b of document.querySelectorAll('[data-tool]'))b.onclick=()=>select(+b.dataset.tool);
addEventListener('keydown',e=>{
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&active)e.preventDefault();
  if(e.repeat)return;
  if(e.code==='Escape'&&active){setPause(!paused);return;}
  if(!active||paused)return;
  keys[e.code]=true;
  if(e.code==='Space')jump();if(e.code==='KeyE')use();if(e.code==='KeyQ')dash();
  if(/^Digit[1-4]$/.test(e.code))select(+e.code.slice(-1)-1);
});
addEventListener('keyup',e=>keys[e.code]=false);
addEventListener('blur',()=>{if(active)setPause(true);});
document.addEventListener('visibilitychange',()=>{if(document.hidden){flushSave();if(active)setPause(true);}});
canvas.onpointerdown=e=>{if(!active||paused||drag)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,move:0};canvas.setPointerCapture(e.pointerId);};
canvas.onpointermove=e=>{
  if(!drag||drag.id!==e.pointerId)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.move+=Math.abs(dx)+Math.abs(dy);
  yaw-=dx*.005;pitch=T.MathUtils.clamp(pitch+dy*.004,-.22,1.05);drag.x=e.clientX;drag.y=e.clientY;
};
canvas.onpointerup=e=>{if(drag&&drag.id===e.pointerId){if(drag.move<8)use();drag=null;}};
canvas.onpointercancel=()=>drag=null;
canvas.oncontextmenu=e=>e.preventDefault();
const stick=$('#stick');let stickId=null;
function moveStick(e){
  const r=stick.getBoundingClientRect(),radius=r.width*.36;
  let x=(e.clientX-r.left-r.width/2)/radius,y=(e.clientY-r.top-r.height/2)/radius;
  const len=Math.max(1,Math.hypot(x,y));x/=len;y/=len;
  joystick.x=Math.abs(x)<.08?0:x;joystick.y=Math.abs(y)<.08?0:y;
  $('#thumb').style.transform=`translate(${x*30}px,${y*30}px)`;
}
stick.onpointerdown=e=>{if(stickId!==null)return;stickId=e.pointerId;stick.setPointerCapture(e.pointerId);moveStick(e);};
stick.onpointermove=e=>{if(e.pointerId===stickId)moveStick(e);};
function stopStick(){stickId=null;joystick.x=joystick.y=0;$('#thumb').style.transform='';}
stick.onpointerup=stick.onpointercancel=stopStick;
stick.addEventListener('lostpointercapture',stopStick);

function floorAt(x,z,oldY,newY){
  let floor=0;
  for(const b of boxes)if(Math.abs(x-b.x)<b.w/2+.48&&Math.abs(z-b.z)<b.d/2+.48&&oldY>=b.top-.12&&newY<=b.top)floor=Math.max(floor,b.top);
  return floor;
}
function surfaceBelow(x,z,y){
  let floor=0;for(const b of boxes)if(b.top<=y+.12&&Math.abs(x-b.x)<b.w/2+.48&&Math.abs(z-b.z)<b.d/2+.48)floor=Math.max(floor,b.top);return floor;
}
function moveAxis(axis,amount){
  if(!amount)return;
  const next=player.position[axis]+amount;
  const x=axis==='x'?next:player.position.x,z=axis==='z'?next:player.position.z;
  for(const b of boxes)if(player.position.y<b.top-.1&&player.position.y+3.5>b.bottom+.1&&Math.abs(x-b.x)<b.w/2+.6&&Math.abs(z-b.z)<b.d/2+.6)return;
  player.position[axis]=next;
}
function update(dt){
  time+=dt;actionCooldown=Math.max(0,actionCooldown-dt);dashCooldown=Math.max(0,dashCooldown-dt);
  comboLeft=Math.max(0,comboLeft-dt);boostLeft=Math.max(0,boostLeft-dt);bubbleStreakLeft=Math.max(0,bubbleStreakLeft-dt);
  coyote=onGround?.12:Math.max(0,coyote-dt);jumpBuffer=Math.max(0,jumpBuffer-dt);
  if(tool===2&&(useHeld||keys.KeyE))use();
  let x=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joystick.x;
  let z=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0)+joystick.y;
  const len=Math.max(1,Math.hypot(x,z));x/=len;z/=len;
  const moving=Math.hypot(x,z)>.05,sprinting=sprintToggle||keys.ShiftLeft||keys.ShiftRight;
  const speed=(sprinting?SPRINT_SPEED:RUN_SPEED)*(boostLeft>0?1.25:1);
  const smooth=1-Math.exp(-dt*(moving?24:32));
  velocityX+=((Math.cos(yaw)*x+Math.sin(yaw)*z)*speed-velocityX)*smooth;
  velocityZ+=((-Math.sin(yaw)*x+Math.cos(yaw)*z)*speed-velocityZ)*smooth;
  let vx=velocityX,vz=velocityZ;
  if(dashTime>0){vx=dashX*DASH_SPEED;vz=dashZ*DASH_SPEED;dashTime=Math.max(0,dashTime-dt);}
  if(grapple){
    grapple.progress=Math.min(1,grapple.progress+dt/grapple.duration);
    const t=grapple.progress;
    // A gentle vault clears the roof edge rather than pulling through a building.
    player.position.lerpVectors(grapple.start,grapple.target,t);
    player.position.y+=Math.sin(Math.PI*t)*Math.min(18,grapple.start.distanceTo(grapple.target)*.32);
    if(t>=1){grapple=null;vy=3;airJump=true;}onGround=false;
  }else{
    moveAxis('x',vx*dt);moveAxis('z',vz*dt);
    const oldY=player.position.y;vy-=32*dt;let newY=oldY+vy*dt;
    if(vy>0){for(const b of boxes){if(b.bottom>oldY+3.45&&b.bottom<=newY+3.5&&Math.abs(player.position.x-b.x)<b.w/2+.48&&Math.abs(player.position.z-b.z)<b.d/2+.48){newY=b.bottom-3.5;vy=0;}}}
    const floor=floorAt(player.position.x,player.position.z,oldY,newY);
    if(newY<=floor&&vy<=0){player.position.y=floor;vy=0;onGround=true;airJump=true;if(jumpBuffer>0)takeJump(14);}
    else{player.position.y=newY;onGround=false;}
  }
  if(Math.hypot(vx,vz)>1){
    const desired=Math.atan2(vx,vz),delta=Math.atan2(Math.sin(desired-player.rotation.y),Math.cos(desired-player.rotation.y));player.rotation.y+=delta*Math.min(1,dt*20);
  }
  if(Math.abs(player.position.x)>94||Math.abs(player.position.z)>94||player.position.y< -8)respawn('Splash! Back on dry land.');
  const area=player.position.z>62?3:player.position.z< -14?(player.position.x<0?1:2):0;
  if(area!==currentArea){currentArea=area;$('#area').textContent=names[area];if(!visited.has(area)){visited.add(area);ui();save();if(visited.size>1)toast('Discovered '+names[area]+'!');}}
  for(const s of stars){
    if(collected.has(s.id))continue;
    const dx=s.m.position.x-player.position.x,dy=s.y-player.position.y-1.5,dz=s.m.position.z-player.position.z;
    if(dx*dx+dy*dy+dz*dz<8.4){
      collected.add(s.id);s.m.visible=false;burst(s.m.position,0xffda45,8);tone(700+collected.size*10);
      combo=comboLeft>0?combo+1:1;comboLeft=4;
      if(combo>=3){boostLeft=5;toast(`★ ${combo} star streak! Speed boost!`);}
      ui();save();if(collected.size===stars.length)toast('★ All 32 stars! You’re a city superstar!');
    }
  }
  for(const c of crates){
    if(unlocked.has(c.type))continue;
    if(Math.hypot(player.position.x-c.x,player.position.z-c.z)<3.5&&player.position.y<4){
      unlocked.add(c.type);c.m.visible=c.band.visible=c.sign.visible=false;select(c.type);save();burst(player.position,0x69ddec);
      toast(['','Grapple! Aim near a blue ring and press USE.','Bubble blaster! Hold USE near the robots.','Super bounce! USE to launch, Jump to go higher.'][c.type]);tone(950);
    }
  }
  for(const p of pads)if(onGround&&Math.hypot(player.position.x-p.x,player.position.z-p.z)<2.3){takeJump(29);airJump=true;tone(850);}
  for(const b of bots)b.cool=Math.max(0,b.cool-dt);
  for(const bubble of bubbles){
    if(bubble.life<=0)continue;
    bubble.life-=dt;
    if(bubble.target&&bubble.target.cool<=0){v1.copy(bubble.target.g.position);v1.y+=2.3;bubble.v.subVectors(v1,bubble.m.position).normalize().multiplyScalar(65);}
    v1.copy(bubble.m.position);v2.copy(v1).addScaledVector(bubble.v,dt);
    if(!segmentClear(v1,v2))bubble.life=0;
    bubble.m.position.copy(v2);
    if(bubble.life>0&&bubble.target&&bubble.target.cool<=0){
      v1.copy(bubble.target.g.position);v1.y+=2.3;
      if(v1.distanceToSquared(bubble.m.position)<3){
        bubble.target.cool=1.25;botHits++;bubble.life=0;bubbleStreak=bubbleStreakLeft>0?bubbleStreak+1:1;bubbleStreakLeft=4;
        burst(bubble.target.g.position,0x6aeee5,8);tone(1000);save();
        if(botHits===1)toast('Nice! Hold USE to keep the dance party going.');
        else if(bubbleStreak%5===0)toast(`${bubbleStreak} bubble combo!`);
      }
    }
    if(bubble.life<=0){bubble.m.visible=false;bubble.target=null;}
  }
  for(const p of particles){if(p.life<=0)continue;p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vy-=15*dt;}
  if(race.active){
    race.elapsed+=dt;const [cx,cz]=course[race.index];
    if(Math.hypot(player.position.x-cx,player.position.z-cz)<4&&player.position.y<8){
      burst(player.position,0xffd342,6);tone(600+race.index*60);race.index++;
      if(race.index>=course.length)endRace(true);else placeCheckpoint();
    }
  }
}

// The map and interface update at 10 Hz; 3D motion remains display-rate smooth.
const mapContext=$('#map').getContext('2d');
const mapBackground=document.createElement('canvas');mapBackground.width=mapBackground.height=168;
const mapBase=mapBackground.getContext('2d');
mapBase.fillStyle='#b2d29b';mapBase.fillRect(0,0,168,168);mapBase.fillStyle='#77b98e';mapBase.fillRect(12,12,60,60);
mapBase.fillStyle='#eed49a';mapBase.fillRect(96,12,60,60);mapBase.fillStyle='#899996';mapBase.fillRect(76,0,16,168);mapBase.fillRect(0,77,168,14);
mapBase.fillStyle='#fff0cf';for(const b of boxes)if(b.top>5)mapBase.fillRect(84+b.x*.76-b.w*.38,84+b.z*.76-b.d*.38,b.w*.76,b.d*.76);
function drawMap(){
  const c=mapContext;c.clearRect(0,0,168,168);c.drawImage(mapBackground,0,0);
  for(const cr of crates)if(!unlocked.has(cr.type)){c.fillStyle=['','#21bde5','#f48164','#b189e1'][cr.type];c.fillRect(84+cr.x*.76-3,84+cr.z*.76-3,7,7);}
  c.fillStyle='#e8a92b';for(const s of stars)if(!collected.has(s.id)){c.beginPath();c.arc(84+s.m.position.x*.76,84+s.m.position.z*.76,1.6,0,7);c.fill();}
  if(race.active){const [x,z]=course[race.index];c.strokeStyle='#ac5b00';c.lineWidth=3;c.beginPath();c.arc(84+x*.76,84+z*.76,6,0,7);c.stroke();}
  c.save();c.translate(84+player.position.x*.76,84+player.position.z*.76);c.rotate(-yaw);c.fillStyle='#1b4356';
  c.beginPath();c.moveTo(0,-7);c.lineTo(5,5);c.lineTo(0,3);c.lineTo(-5,5);c.closePath();c.fill();c.restore();
}
function updateHud(){
  const a=tool===1&&active&&!paused?chooseAnchor():null;
  $('#aim').style.color=a?'#59ffff':'white';
  $('#targetHint').style.display=active&&!paused&&tool!==0?'block':'none';
  const action=coarse?'USE':'E / click';
  const hint=tool===1?(a?`✦ Grapple ready · ${action}`:'Turn toward a glowing blue ring'):tool===2?(bubbleStreakLeft>0?`${bubbleStreak} bubble combo · Hold ${coarse?'USE':'E'}!`:`Hold ${coarse?'USE':'E'} near a robot`):`Super bounce · ${action}`;
  if($('#targetHint').textContent!==hint)$('#targetHint').textContent=hint;
  $('#pace').textContent=boostLeft>0?`★ SPEED BOOST ${Math.ceil(boostLeft)}s`:dashCooldown>0?`DASH ${dashCooldown.toFixed(1)}s`:'Q / DASH READY';
  $('#dash').classList.toggle('cooling',dashCooldown>0);
  $('#dash').setAttribute('aria-label',dashCooldown>0?'Dash recharging':'Dash');
  $('#raceReadout').textContent=race.active?`${race.index}/${course.length} gates · ${race.elapsed.toFixed(1)}s`:raceBest?`Best ${raceBest.toFixed(1)}s · Beat your time`:'Follow the gold gates · Beat your time';
  drawMap();
}
function cameraFrame(dt){
  cameraTarget.copy(player.position);cameraTarget.y+=2.3;
  const movingFast=dashTime>0||grapple||boostLeft>0||sprintToggle||keys.ShiftLeft||keys.ShiftRight;
  const desiredDistance=(innerWidth<650?16:19)+(movingFast?1.2:0);
  cameraOffset.set(Math.sin(yaw)*Math.cos(pitch)*desiredDistance,Math.sin(pitch)*desiredDistance+5,Math.cos(yaw)*Math.cos(pitch)*desiredDistance);
  let distance=cameraOffset.length();ray.set(cameraTarget,v1.copy(cameraOffset).normalize());
  for(const b of boxes){const hit=ray.intersectBox(b.bounds,rayHit);if(hit)distance=Math.min(distance,Math.max(1.4,hit.distanceTo(cameraTarget)-.6));}
  // Move inward immediately to avoid clipping; ease outward to avoid camera popping.
  if(!cameraReady||distance<cameraDistance)cameraDistance=distance;
  else cameraDistance+=(distance-cameraDistance)*(1-Math.exp(-dt*7));
  cameraReady=true;camera.position.copy(cameraTarget).addScaledVector(cameraOffset.normalize(),cameraDistance);camera.lookAt(cameraTarget);camera.updateMatrixWorld();
  const fov=60+(movingFast?5:0);if(Math.abs(camera.fov-fov)>.05){camera.fov+=(fov-camera.fov)*(1-Math.exp(-dt*7));camera.updateProjectionMatrix();}
}
function visuals(){
  const movement=Math.hypot(velocityX,velocityZ),swing=onGround?Math.sin(time*(movement>21?19:15))*Math.min(.7,movement*.04):.3;
  legs[0].rotation.x=swing;legs[1].rotation.x=-swing;arms[0].rotation.x=-swing;arms[1].rotation.x=swing;
  for(const b of bots){b.g.rotation.y=Math.sin(time*.7+b.x)*.5;b.g.position.y=b.cool>0?1+Math.sin(time*9)*.6:Math.abs(Math.sin(time*2+b.x))*.12;b.g.rotation.z=b.cool>0?Math.sin(time*12)*.18:0;}
  for(const s of stars)if(s.m.visible){s.m.rotation.y=time*2;s.m.position.y=s.y+Math.sin(time*3+s.id)*.18;}
  for(const c of crates)if(c.m.visible){c.m.rotation.y=Math.sin(time)*.12;c.band.rotation.y=c.m.rotation.y;}
  for(const a of anchors)a.quaternion.copy(camera.quaternion);
  if(race.active)raceMarker.quaternion.copy(camera.quaternion);
  rope.visible=!!grapple;
  if(grapple){const p=rope.geometry.attributes.position;p.setXYZ(0,player.position.x,player.position.y+2,player.position.z);p.setXYZ(1,grapple.target.x,grapple.target.y-1,grapple.target.z);p.needsUpdate=true;}
  const floor=surfaceBelow(player.position.x,player.position.z,player.position.y);
  contact.position.set(player.position.x,floor+.18,player.position.z);contact.material.opacity=Math.max(.06,.25-(player.position.y-floor)*.012);
  let count=0;for(const p of particles){if(p.life<=0)continue;const scale=.1+Math.min(.12,p.life*.4);fxMatrix.makeScale(scale,scale,scale);fxMatrix.setPosition(p.x,p.y,p.z);fx.setMatrixAt(count,fxMatrix);fx.setColorAt(count,fxColor.setHex(p.color));count++;}
  fx.count=count;if(count){fx.instanceMatrix.needsUpdate=true;fx.instanceColor.needsUpdate=true;}
}
function advanceFrame(elapsed){
  // Up to 200 ms catches ordinary slow frames without slowing the entire game.
  // Longer stalls are bounded to prevent a runaway catch-up loop or teleport.
  accumulator+=Math.min(MAX_FRAME,Math.max(0,elapsed));
  let steps=0;while(accumulator+1e-9>=STEP&&steps<24){update(STEP);accumulator-=STEP;steps++;}
  accumulator=Math.max(0,accumulator);return steps;
}
function adaptQuality(dt){
  if(quality!=='auto'||!active||paused||dt<=0||dt>.15)return;
  frameTotal+=dt;frameCount++;qualityClock+=dt;
  if(qualityClock<3)return;
  const average=frameTotal/frameCount;
  if(average>1/42&&renderScale>.65){renderScale=Math.max(.65,renderScale-.15);renderer.setPixelRatio(renderScale);renderer.setSize(innerWidth,innerHeight);}
  else if(average<1/57&&renderScale<Math.min(devicePixelRatio,coarse?1:1.25)){renderScale=Math.min(Math.min(devicePixelRatio,coarse?1:1.25),renderScale+.1);renderer.setPixelRatio(renderScale);renderer.setSize(innerWidth,innerHeight);}
  qualityClock=frameTotal=frameCount=0;
}
function render(now){
  requestAnimationFrame(render);
  if(document.hidden){lastFrame=null;return;}
  const dt=lastFrame===null?0:Math.min(.25,Math.max(0,(now-lastFrame)/1000));lastFrame=now;
  if(paused)return;
  if(active)advanceFrame(dt);else yaw+=dt*.045;
  cameraFrame(dt||1/60);visuals();
  hudClock+=dt;if(hudClock>=.1){hudClock=0;updateHud();}
  adaptQuality(dt);renderer.render(scene,camera);
}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);cameraReady=false;});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(active)setPause(true);toast('Graphics paused. Reload the page to return to your adventure.');});
$('#sound').textContent='Sound: '+(sound?'on':'off');setQuality();ui();updateHud();
$('#start').disabled=false;$('#start').textContent='Let’s explore  →';requestAnimationFrame(render);
