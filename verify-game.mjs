// Run with Node: node checks/verify-game.mjs
// Exercises the real game logic and Three.js scene with a stub renderer/DOM.
// This does not measure GPU frame rate or replace real-device playtesting.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {performance} from 'node:perf_hooks';
const root=path.resolve(import.meta.dirname,'..');
const gameDir=fs.existsSync(path.join(root,'dist/game.js'))?path.join(root,'dist'):root;
const source=fs.readFileSync(path.join(gameDir,'game.js'),'utf8');
const nodes=new Map(),events={},writes=[];
const ctx=new Proxy({},{get:()=>()=>{}});
function element(id){
  if(!nodes.has(id))nodes.set(id,{textContent:'',style:{},hidden:false,dataset:{},attrs:{},
    classList:{add(){},remove(){},toggle(){}},setAttribute(k,v){this.attrs[k]=v;},
    getContext:()=>ctx,addEventListener(k,v){events[id+':'+k]=v;},
    setPointerCapture(){},getBoundingClientRect:()=>({left:0,top:0,width:110,height:110})});
  return nodes.get(id);
}
const buttons=Array.from({length:4},(_,i)=>{const el=element('tool'+i);el.dataset.tool=i;return el;});
globalThis.document={querySelector:element,querySelectorAll:()=>buttons,createElement:()=>element('canvas'+nodes.size),addEventListener(k,v){events[k]=v;},body:element('body'),hidden:false};
globalThis.window=globalThis;globalThis.innerWidth=1280;globalThis.innerHeight=800;globalThis.devicePixelRatio=2;
globalThis.matchMedia=()=>({matches:false});globalThis.addEventListener=(k,v)=>events[k]=v;
globalThis.requestAnimationFrame=()=>{};
const seed=process.env.GAME_TEST_SAVE||'{}';
globalThis.localStorage={getItem:()=>seed,setItem:(k,v)=>writes.push(JSON.parse(v))};
globalThis.__testWrites=writes;globalThis.__testEvents=events;globalThis.__perf=performance;
const stub=`class TestRenderer {constructor(){this.shadowMap={};this.calls=0;}setPixelRatio(n){this.ratio=n;}setSize(){}setClearColor(){}render(){this.calls++;}}`;
const importLine=`import * as THREE from '${pathToFileURL(path.join(gameDir,'three.module.js'))}';\n${stub}\nconst T={...THREE,WebGLRenderer:TestRenderer};`;
const tests=String.raw`
let assertions=0;
function assert(condition,message){assertions++;if(!condition)throw Error(message);}
function reset(x=0,z=-60,y=0){
  clearInputs();player.position.set(x,y,z);active=true;paused=false;onGround=y===0;vy=0;coyote=.12;airJump=true;
  yaw=Math.PI;dashTime=dashCooldown=actionCooldown=0;grapple=null;boostLeft=comboLeft=0;combo=0;
  sprintToggle=false;accumulator=0;race.active=false;lastFrame=null;
  bubbles.forEach(b=>{b.life=0;b.m.visible=false;b.target=null;});
}
function step(seconds,fps=60){for(let i=0;i<Math.round(seconds*fps);i++)advanceFrame(1/fps);}
assert([...unlocked].every(n=>[0,1,2,3].includes(n)),'Save normalizes gadget ids');
assert([...collected].every(n=>Number.isInteger(n)&&n>=0&&n<82),'Save normalizes star ids');
assert([...visited].every(n=>Number.isInteger(n)&&n>=0&&n<9),'Save normalizes neighborhood ids');
if(Array.isArray(saved.tools)&&saved.tools.includes(1))assert(unlocked.has(1),'Existing grapple preserved');
if(Array.isArray(saved.stars)&&saved.stars.includes(15))assert(collected.has(15),'Existing star preserved');
assert(stars.length===82,'Original stars plus the world expansion are present');assert(crates.length===3,'All gadgets preserved');
assert(expansion.districts.length===9,'Nine explorable districts are present');assert(expansion.crystals.length===6&&expansion.relays.length===3&&expansion.rescues.length===5,'New activities are present');
powered.clear();expansion.relays.forEach(r=>r.m.visible=true);reset(expansion.relays[0].x,expansion.relays[0].z);currentArea=4;interact();assert(powered.has(0)&&!expansion.relays[0].m.visible,'Moonbase relay interaction works');
foundCrystals.clear();expansion.crystals.forEach(c=>c.m.visible=true);reset(147,-155);currentArea=5;advanceFrame(1/60);assert(foundCrystals.has(0)&&!expansion.crystals[0].m.visible,'Canyon crystal pickup works');
rescued.clear();expansion.rescues.forEach(r=>r.g.visible=true);const buddy0=expansion.rescues[0];reset(buddy0.x,buddy0.z);currentArea=6;interact();assert(rescued.has(0)&&!buddy0.g.visible,'Grove rescue interaction works');
boardOwned=false;expansion.boardPickup.visible=true;reset(146,146);currentArea=7;interact();assert(boardOwned&&!expansion.boardPickup.visible,'Hoverboard pickup works');startRace();assert(raceKind==='neon'&&course===neonCourse,'Neon Loop starts after board pickup');endRace(false);
skyLit=false;reset(16,237,62.6);currentArea=8;interact();assert(skyLit,'Cloudtop beacon interaction works');
assert(renderer.shadowMap.enabled===false,'Realtime shadows disabled');
assert(batches.size<originalSceneryMeshes*.4,'Static scenery batches cut submissions by over 60%');
const distances=[];
for(const fps of [5,15,20,30,60,120]){reset();keys.KeyW=true;step(1,fps);distances.push(player.position.z+60);}
assert(Math.max(...distances)-Math.min(...distances)<.01,'Movement must remain consistent from 5 to 120 FPS');
assert(distances[0]>17&&distances[0]<18.1,'Run speed is approximately 18 units/second');
reset();keys.KeyW=true;keys.ShiftLeft=true;step(1);assert(player.position.z+60>25,'Sprint increases travel speed');
reset();dash();step(.2);assert(player.position.z+60>8,'Dash covers at least 8 units');assert(dashCooldown>0,'Dash cooldown enforced');
const before=dashCooldown;dash();assert(dashCooldown===before,'Dash cannot be spammed');
reset();jump();assert(vy===14,'First jump launches');step(.15);jump();assert(vy===13&&!airJump,'Second jump launches once');step(.02);jump();assert(vy<13,'Third jump cannot fly indefinitely');step(1.5);assert(onGround&&airJump,'Landing restores air jump');
reset();onGround=false;coyote=.05;airJump=false;jump();assert(vy===14,'Coyote time accepts edge jump');
reset(0,-60,.1);onGround=false;coyote=0;airJump=false;vy=-2;jump();assert(jumpBuffer>0,'Late air press buffered');step(.05);assert(vy>0,'Buffered jump triggers on landing');
reset(-27,24,16);vy=-2;step(.8);assert(Math.abs(player.position.y-13.6)<.01,'Rooftop landing supported');
reset(-15,24);keys.KeyD=true;step(1);assert(player.position.x>=-18.5,'Running blocked by building wall');
reset(-15,24);dashX=-1;dashZ=0;dashTime=.19;step(.2,15);assert(player.position.x>=-18.5,'Low-frame-rate dash cannot tunnel through wall');
reset(300,0);advanceFrame(1/60);assert(player.position.distanceTo(spawn)<.01,'Boundary rescue');
for(const c of crates){unlocked.delete(c.type);reset(c.x,c.z);advanceFrame(1/60);assert(unlocked.has(c.type),'Pickup unlocks gadget '+c.type);assert(!c.m.visible&&!c.band.visible&&!c.sign.visible,'Entire collected crate hidden');}
reset();select(3);use();assert(vy===29,'Super bounce launches');step(.1);use();assert(airJump,'Cooldown protects bounce');step(.15);use();assert(!airJump&&vy===18,'Bounce allows one midair boost');step(2);assert(onGround,'Super bounce lands');
reset(0,24);select(1);yaw=Math.PI/2;pitch=-.12;cameraReady=false;cameraFrame(1/60);assert(chooseAnchor()!==null,'Grapple aim assist acquires a visible anchor '+JSON.stringify(anchors.slice(0,3).map(a=>a.position.clone().project(camera).toArray())));use();assert(grapple!==null,'Grapple starts');step(2);assert(!grapple&&player.position.y>=12,'Grapple reaches a rooftop '+player.position.toArray());
reset();grapple={target:new T.Vector3(0,20,0),start:player.position.clone(),progress:0,duration:1};jump();assert(!grapple&&vy===13,'Jump releases grapple');
reset(-35,-23);yaw=0;select(2);bots.forEach(b=>b.cool=0);const hits=botHits;use();step(.4);assert(botHits>hits,'Bubble reaches robot');
keys.KeyE=true;step(3);keys.KeyE=false;assert(botHits>hits+1,'Hold-to-fire keeps working after robot cooldown');
assert(bubbles.length===12&&particles.length===96,'Effect pools stay bounded');
const meshesBefore=scene.children.length;for(let i=0;i<100;i++)burst(player.position,0xffffff);visuals();assert(scene.children.length===meshesBefore,'Particle bursts do not allocate scene meshes');assert(fx.count<=96,'Particle count capped');
reset();collected.clear();combo=0;comboLeft=0;for(const id of [11,12,13]){const s=stars[id];player.position.set(s.m.position.x,0,s.m.position.z);advanceFrame(1/60);}assert(combo>=3&&boostLeft>0,'Three quick stars award a speed boost');
startRace();assert(race.active&&raceMarker.visible,'Race starts');
for(const [x,z]of course){player.position.set(x,0,z);advanceFrame(1/60);}assert(!race.active&&raceBest>0,'Race finishes and records time');
startRace();step(.5);const elapsed=race.elapsed;setPause(true);render(0);render(1000);assert(race.elapsed===elapsed,'Paused race clock stays frozen');
keys.KeyW=true;useHeld=true;setPause(false);assert(!keys.KeyW&&!useHeld,'Resume clears stuck inputs');endRace(false);
reset();render(0);render(16);const oldPos=player.position.clone();setPause(true);keys.KeyW=true;const renders=renderer.calls;render(1016);assert(player.position.equals(oldPos)&&renderer.calls===renders,'Pause stops simulation and expensive rendering');setPause(false);
reset();onGround=true;step(.2);save();flushSave();assert(__testWrites.at(-1).tools.includes(3),'Saved progress retains gadgets');assert(__testWrites.at(-1).raceBest>0,'Saved progress retains race record');
quality='auto';setQuality();const initial=renderScale;for(let i=0;i<125;i++)adaptQuality(1/30);assert(renderScale<initial,'Auto quality lowers resolution under sustained slow frames');quality='smooth';setQuality();assert(renderer.ratio===.85,'Manual Smooth setting works');
// Approximate structural draw-submission count. Actual GPU time is device-dependent.
let renderables=0;scene.traverse(o=>{if(o.isMesh||o.isSprite||o.isLine)renderables++;});
reset();const t0=__perf.now();for(let i=0;i<1200;i++){update(STEP);cameraFrame(STEP);visuals();}const cpu=__perf.now()-t0;
console.log(JSON.stringify({passed:assertions,runDistanceByFPS:distances.map(n=>+n.toFixed(4)),sceneryBefore:originalSceneryMeshes,sceneryAfter:batches.size,sceneRenderables:renderables,geometryCount:new Set([...scene.children].filter(o=>o.geometry).map(o=>o.geometry)).size,logicCameraAndVisuals1200StepsMs:+cpu.toFixed(1),note:'Stub renderer: no GPU or real-browser FPS measured'},null,2));
clearTimeout(saveTimer);clearTimeout(toastTimer);
`;
const expansionLine=`import {buildExpansion} from '${pathToFileURL(path.join(gameDir,'expansion.js')).href}';`;
try { await import('data:text/javascript;base64,'+Buffer.from(source.replace("import * as T from './three.module.js';",importLine).replace("import {buildExpansion} from './expansion.js?v=1.2.0';",expansionLine)+tests).toString('base64')); } catch(e) { console.error('CHECK FAILED:',e.message); process.exit(1); }
