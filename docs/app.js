import {projects} from './projects.js';

const $ = s => document.querySelector(s);
const canvas = $('#model'), ctx = canvas.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
let key = Object.hasOwn(projects,location.hash.slice(1)) ? location.hash.slice(1) : 'associa';
let project = projects[key], selected = 0, spread = 65, target = 65;
let yaw = -.53, tilt = 1.0, wire = false, pointer = null, frame = null, hitAreas = [];
let dpr = 1;
let viewScale = 1, viewX = 0, viewY = 0;
const INK = '#343a32', PAPER = '#f3f1e9', LINE = '#b7bdaf';

function point(x,y,z){
  const a = x*Math.cos(yaw)-y*Math.sin(yaw), b = x*Math.sin(yaw)+y*Math.cos(yaw);
  return [435+a*1.55, 322+(b*Math.cos(tilt)-z*Math.sin(tilt))*1.55];
}
function path(points,fill=null,stroke=INK,width=1){
  ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));
  if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
}
function line3(points,z,color=LINE,width=.8){path(points.map(p=>point(p[0],p[1],z)),null,color,width);}
function box(x,y,w,h,z,fill=null,color=INK,width=1){
  path([[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]].map(p=>point(...p,z)),fill,color,width);
}
function circle(x,y,r,z,color=INK,fill=null){
  const pts=Array.from({length:25},(_,i)=>point(x+r*Math.cos(i/24*Math.PI*2),y+r*Math.sin(i/24*Math.PI*2),z));
  path(pts,fill,color,.8);
}
function planeText(text,x,y,z,size=10,color=INK){
  const p=point(x,y,z), px=point(x+1,y,z), py=point(x,y+1,z);
  ctx.save();ctx.transform(px[0]-p[0],px[1]-p[1],py[0]-p[0],py[1]-p[1],p[0],p[1]);
  ctx.font=`${size}px "Courier New",monospace`;ctx.fillStyle=color;ctx.fillText(text,0,0);ctx.restore();
}
function screw(x,y,z){circle(x,y,3.5,z,LINE);line3([[x-2,y],[x+2,y]],z,LINE);}
function chip(x,y,w,h,z,filled=true){
  box(x,y,w,h,z,filled&&!wire?'#dfe3d7':null,INK,1.15);
  box(x+5,y+5,w-10,h-10,z+.1,null,LINE,.6);
  for(let i=8;i<w-4;i+=10){line3([[x+i,y-7],[x+i,y]],z,INK);line3([[x+i,y+h],[x+i,y+h+7]],z,INK);}
  for(let i=8;i<h-4;i+=10){line3([[x-7,y+i],[x,y+i]],z,INK);line3([[x+w,y+i],[x+w+7,y+i]],z,INK);}
}
function screen(x,y,w,h,z,mobile=false){
  box(x,y,w,h,z,wire?null:'#f8f7f0',INK,1.3);
  box(x+5,y+8,w-10,h-17,z,null,LINE);
  if(mobile){line3([[x+w*.38,y+4],[x+w*.62,y+4]],z,INK);circle(x+w/2,y+h-4,1.5,z,INK);}
  else{line3([[x,y+9],[x+w,y+9]],z,INK);for(let i=0;i<3;i++)circle(x+6+i*5,y+4,1,z,LINE);}
  for(let i=0;i<3;i++)line3([[x+12,y+24+i*10],[x+w-13-(i%2)*12,y+24+i*10]],z,LINE);
}
function decorate(shape,z,i){
  planeText(project.layers[i].code,-135,-90,z,9,project.color);
  planeText(`HB / ${project.number}.${i+1}`,65,96,z,7);
  for(let x=-120;x<=120;x+=40)for(let y=-65;y<=65;y+=32){
    line3([[x-1.2,y],[x+1.2,y]],z,'#d8dccf',.6);line3([[x,y-1.2],[x,y+1.2]],z,'#d8dccf',.6);
  }
  if(shape==='screens'){
    screen(-113,-59,142,105,z);screen(52,-48,53,102,z,true);
    line3([[29,12],[41,12],[41,28],[52,28]],z,project.color,1.4);
    line3([[-42,46],[-42,63],[-73,63],[-13,63]],z,INK,1.1);
  }else if(shape==='mobile'){
    screen(-36,-69,72,138,z,true);screen(-111,-42,49,87,z,true);screen(64,-42,49,87,z,true);
    line3([[-62,0],[-36,0]],z,project.color,1.4);line3([[36,0],[64,0]],z,project.color,1.4);
  }else if(shape==='terminal'){
    screen(-118,-63,160,119,z);box(60,-44,56,28,z,null,project.color);box(60,7,56,40,z,null,project.color);
    planeText('>_',-103,-12,z,22,project.color);planeText('RUN',70,-25,z,8);planeText('EVENT',64,31,z,8);
    line3([[42,-10],[51,-10],[51,-29],[60,-29]],z,project.color);line3([[51,-10],[51,25],[60,25]],z,project.color);
  }else if(shape==='contracts'){
    const xs=[-114,-25,64];
    xs.forEach((x,j)=>{box(x,-42,51,79,z,wire?null:'#e9eade',INK);planeText(['IN','MAP','OUT'][j],x+12,-20,z,9);planeText(['{ }','< >','{ }'][j],x+7,10,z,16,project.color);});
    line3([[-63,-2],[-25,-2]],z,project.color,1.4);line3([[26,-2],[64,-2]],z,project.color,1.4);
    line3([[-90,37],[-90,63],[90,63],[90,37]],z,LINE);
  }else if(shape==='processor'){
    chip(-41,-44,82,82,z);planeText(project.name==='Swarms'?'RUN':'JOB',-19,3,z,13,project.color);
    for(let side of [-1,1]){
      for(let j=0;j<4;j++){
        let yy=-35+j*22;line3([[side*48,yy],[side*67,yy],[side*80,yy-10],[side*119,yy-10]],z,j===1?project.color:LINE,j===1?1.3:.8);
        box(side<0?-129:119,yy-14,10,8,z,wire?null:'#dce0d3',LINE);
      }
    }
    for(let j=0;j<3;j++)box(-32+j*28,61,17,10,z,wire?null:'#dce0d3',INK,.7);
  }else{
    for(let j=0;j<3;j++){
      let x=-115+j*84;chip(x,-49,57,96,z,false);
      for(let q=0;q<5;q++){line3([[x+12,-30+q*15],[x+44,-30+q*15]],z,q===j?project.color:LINE,q===j?1.2:.7);}
    }
    line3([[-87,55],[-87,72],[83,72],[83,55]],z,project.color,1.2);
  }
}
function inside(p,poly){
  let yes=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;
  }return yes;
}
function draw(){
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);
  viewScale=Math.min(canvas.width/900,canvas.height/640);
  viewX=(canvas.width-900*viewScale)/2;viewY=(canvas.height-640*viewScale)/2;
  ctx.setTransform(viewScale,0,0,viewScale,viewX,viewY);hitAreas=[];
  // Registration marks and a faint construction ellipse frame the object.
  ctx.setLineDash([2,5]);ctx.strokeStyle='#d6dacd';ctx.lineWidth=.7;
  ctx.beginPath();ctx.ellipse(435,440,238,100,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  [[165,95],[750,95],[165,550],[750,550]].forEach(([x,y])=>{path([[x-6,y],[x+6,y]],null,LINE,.7);path([[x,y-6],[x,y+6]],null,LINE,.7)});
  const gap=14+spread*.72;
  const zs=[1.5,.5,-.5,-1.5].map(z=>z*gap);
  // Dashed guides connect responsibilities; these are not physical servers.
  ctx.setLineDash([3,5]);
  [[-139,-92],[139,92]].forEach(([x,y])=>path([point(x,y,zs[0]),point(x,y,zs[3])],null,LINE,.8));ctx.setLineDash([]);
  for(let i=3;i>=0;i--){
    const z=zs[i],corners=[[-154,-108],[137,-108],[154,-91],[154,108],[-154,108],[-154,-108]];
    const upper=corners.map(p=>point(...p,z));
    if(!wire){
      for(let edge=0;edge<corners.length-1;edge++){
        const a=corners[edge],b=corners[edge+1];
        path([point(...a,z),point(...b,z),point(...b,z-6),point(...a,z-6)],'#ccd2c3',LINE,.7);
      }
      path(upper,i===selected?'#faf9f1':'#eeeee3',i===selected?project.color:INK,i===selected?1.6:1);
    }else path(upper,null,i===selected?project.color:LINE,i===selected?1.5:.8);
    decorate(project.layers[i].shape,z+.2,i);
    [[-143,-97],[126,-97],[-143,97],[143,97]].forEach(p=>screw(...p,z+.3));
    hitAreas.push({i,poly:upper});
  }
  if(spread>25){
    // Each numbered callout follows its own plane while rotating.
    zs.forEach((z,i)=>{
      const p=point(152,94,z), end=[728,p[1]+(i-1.5)*6];
      path([p,[p[0]+18,p[1]],end],null,i===selected?project.color:LINE,.7);
      ctx.fillStyle=i===selected?project.color:INK;ctx.font='11px "Courier New",monospace';ctx.fillText(`0${i+1}`,end[0]+7,end[1]+3);
    });
  }
  // A small orientation triad remains tied to the same projection.
  const origin=[192,570];
  [[1,0,0,'x'],[0,1,0,'y'],[0,0,1,'z']].forEach(([x,y,z,label])=>{
    const p=point(x*22,y*22,z*22),o=point(0,0,0),q=[origin[0]+p[0]-o[0],origin[1]+p[1]-o[1]];
    path([origin,q],null,LINE,.8);ctx.fillStyle='#7c8275';ctx.font='8px "Courier New",monospace';ctx.fillText(label,q[0]+3,q[1]);
  });
}
function resize(){
  const rect=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,1.5);
  const width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}draw();
}
function tick(){
  spread += (target-spread)*.18;
  if(Math.abs(target-spread)<.08)spread=target;
  draw();frame=spread===target?null:requestAnimationFrame(tick);
}
function animate(){if(reduced.matches){spread=target;draw();}else if(frame===null)frame=requestAnimationFrame(tick);}
function inspect(index){
  selected=index;const layer=project.layers[index];
  $('#layer-index').textContent=`LAYER 0${index+1}`;$('#layer-name').textContent=layer.name;
  $('#layer-description').textContent=layer.description;$('#layer-stack').textContent=layer.stack;
  document.querySelectorAll('[data-layer]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.layer)===index)));draw();
}
function choose(id,updateHash=true){
  if(!Object.hasOwn(projects,id))return;key=id;project=projects[key];
  document.documentElement.style.setProperty('--accent',project.color);
  $('#project-name').textContent=project.name;$('#project-kind').textContent=project.kind;$('#project-description').textContent=project.description;
  $('#drawing-caption').textContent=`FIG. ${project.number} / ${project.name.toUpperCase()}`;
  $('#project-notes').href=`https://github.com/hamzaxbella/hamzaxbella/blob/master/PROJECTS.md#${key}`;
  canvas.setAttribute('aria-label',`${project.name} interactive cutaway. Drag to rotate. Arrow keys rotate; Home resets. Use the layer buttons for descriptions.`);
  document.querySelectorAll('[data-project]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.project===key)));
  const list=$('.layers');list.replaceChildren();
  project.layers.forEach((layer,i)=>{const b=document.createElement('button');b.dataset.layer=i;b.setAttribute('aria-pressed','false');
    const n=document.createElement('span');n.textContent=`0${i+1}`;b.append(n,document.createTextNode(layer.name));b.addEventListener('click',()=>inspect(i));list.append(b);});
  inspect(0);if(updateHash)history.replaceState(null,'',`#${key}`);
}
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.project)));
$('#spread').addEventListener('input',event=>{target=Number(event.target.value);$('#spread-value').textContent=`${target}%`;animate();});
$('#wire').addEventListener('click',()=>{wire=!wire;$('#wire').setAttribute('aria-pressed',String(wire));draw();});
function reset(){yaw=-.53;tilt=1.0;draw();}
$('#reset').addEventListener('click',reset);
canvas.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;
  event.preventDefault();if(event.key==='Home')reset();
  else{yaw=clamp(yaw+({'ArrowLeft':-.12,'ArrowRight':.12}[event.key]||0),-1.1,.3);tilt=clamp(tilt+({'ArrowUp':.08,'ArrowDown':-.08}[event.key]||0),.3,1.2);draw();}
});
canvas.addEventListener('pointerdown',event=>{
  if(event.button!==0)return;pointer={id:event.pointerId,x:event.clientX,y:event.clientY,yaw,tilt,moved:false};
  canvas.setPointerCapture(event.pointerId);canvas.classList.add('dragging');
});
canvas.addEventListener('pointermove',event=>{
  if(!pointer||event.pointerId!==pointer.id)return;
  const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
  if(Math.abs(dx)+Math.abs(dy)>5)pointer.moved=true;
  yaw=clamp(pointer.yaw+dx*.004,-1.1,.3);tilt=clamp(pointer.tilt+dy*.003,.3,1.2);draw();
});
function release(event){
  if(!pointer||event.pointerId!==pointer.id)return;
  if(!pointer.moved&&event.type==='pointerup'){
    const r=canvas.getBoundingClientRect(),p=[((event.clientX-r.left)*canvas.width/r.width-viewX)/viewScale,((event.clientY-r.top)*canvas.height/r.height-viewY)/viewScale];
    const hit=[...hitAreas].reverse().find(item=>inside(p,item.poly));if(hit)inspect(hit.i);
  }
  if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
  pointer=null;canvas.classList.remove('dragging');
}
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame!==null){cancelAnimationFrame(frame);frame=null;spread=target;}else if(!document.hidden)draw();});
addEventListener('hashchange',()=>choose(location.hash.slice(1),false));
new ResizeObserver(resize).observe(canvas);choose(key,false);resize();
