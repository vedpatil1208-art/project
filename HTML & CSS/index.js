// ── Refs ──
const C=24,COLS=21,ROWS=22;
const arena=document.getElementById('arena');
const pacEl=document.getElementById('pac');
const ov=document.getElementById('ov');
const cells=[...document.querySelectorAll('.maze > *')]; // all 462 cells
const gEls=[0,1,2,3].map(i=>document.getElementById('g'+i));

// ── State ──
let score=0,hi=0,lives=3,running=false,fright=0,raf;
let px=10,py=16,dx=0,dy=0,nx=0,ny=0; // pac position & queued dir
const GS=[{x:8,y:9},{x:9,y:9},{x:10,y:9},{x:11,y:9}] // ghost start
  .map((s,i)=>({...s,dx:0,dy:-1,out:i===0,outT:i*1400,dead:false}));

// ── Maze data from DOM ──
const TAG=cells.map(c=>c.tagName.toLowerCase()); // 's','d','p','e','g'
const live=cells.map(c=>true); // dot/pellet alive?

function cell(x,y){return y*COLS+x}
function isWall(x,y){x=(x+COLS)%COLS;y=(y+ROWS)%ROWS;return TAG[cell(x,y)]==='s'}
function canGo(x,y,ddx,ddy){return !isWall(x+ddx,y+ddy)}

// ── Render: only set style/class, CSS does visuals ──
function draw(){
  pacEl.style.left=px*C+'px'; pacEl.style.top=py*C+'px';
  pacEl.className='pac '+(dx===1?'r':dx===-1?'l':dy===1?'d':dy===-1?'u':'r');
  GS.forEach((g,i)=>{
    gEls[i].style.left=g.x*C+'px'; gEls[i].style.top=g.y*C+'px';
    gEls[i].className='ghost '+['red','pink','cyan','orange'][i]
      +(fright>0&&!g.dead?' fright'+(fright<2000?' warn':''):'')
      +(g.dead?' dead':'');
  });
  document.getElementById('sc').textContent=score;
  document.getElementById('hi').textContent=hi;
  ['l1','l2','l3'].forEach((id,i)=>document.getElementById(id).classList.toggle('gone',i>=lives));
}

// ── Game loop ──
let lt=0,pt=0,gt=[0,0,0,0];
function loop(ts){
  if(!running)return;
  const dt=ts-lt; lt=ts;
  if(fright>0)fright-=dt;

  // Pac move every 160ms
  pt+=dt;
  if(pt>160){pt-=160;
    if(canGo(px,py,nx,ny)){dx=nx;dy=ny}
    if(canGo(px,py,dx,dy)){px=(px+dx+COLS)%COLS;py=(py+dy+ROWS)%ROWS}
    // eat
    const ci=cell(px,py),t=TAG[ci];
    if((t==='d'||t==='p')&&live[ci]){
      live[ci]=false; cells[ci].classList.add('eaten');
      score+=(t==='p'?50:10); if(score>hi)hi=score;
      if(t==='p'){fright=7000;GS.forEach(g=>{if(!g.dead)g.fright=true})}
      if(cells.filter((_,i)=>( TAG[i]==='d'||TAG[i]==='p')&&live[i]).length===0)win();
    }
  }

  // Ghost move every 220ms (110ms if dead, 300ms if frightened)
  GS.forEach((g,i)=>{
    if(!g.out){g.outT-=dt;if(g.outT<=0){g.out=true;g.x=10;g.y=7}return}
    gt[i]+=dt;
    const spd=g.dead?110:fright>0?300:220;
    if(gt[i]<spd)return; gt[i]-=spd;
    if(g.dead&&g.x===GS[i].x+(i>1?i-2:0)&&g.y===9){g.dead=false;return}
    // pick direction: avoid reverse, prefer toward target
    const dirs=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
    const ok=dirs.filter(d=>!(d.x===-g.dx&&d.y===-g.dy)&&canGo(g.x,g.y,d.x,d.y));
    if(!ok.length)return;
    const tx=g.dead?10:px, ty=g.dead?9:py;
    const best=fright>0?ok[Math.random()*ok.length|0]
      :ok.reduce((a,b)=>Math.hypot(g.x+b.x-tx,g.y+b.y-ty)<Math.hypot(g.x+a.x-tx,g.y+a.y-ty)?b:a);
    g.dx=best.x;g.dy=best.y;
    g.x=(g.x+best.x+COLS)%COLS; g.y=(g.y+best.y+ROWS)%ROWS;
    // collision mid-move
    if(g.x===px&&g.y===py) hit(g);
  });

  // Collision check
  GS.forEach(g=>{if(g.out&&!g.dead&&g.x===px&&g.y===py)hit(g)});
  draw();
  raf=requestAnimationFrame(loop);
}

function hit(g){
  if(fright>0&&!g.dead){g.dead=true;score+=200;if(score>hi)hi=score}
  else{lives--;if(lives<=0)gameover();else reset()}
}

function reset(){
  px=10;py=16;dx=0;dy=0;nx=0;ny=0;
  GS.forEach((g,i)=>{g.x=[8,9,10,11][i];g.y=9;g.dx=0;g.dy=-1;g.out=i===0;g.outT=i*1400;g.dead=false});
  fright=0; pt=0; gt.fill(0);
}

function win(){end('YOU WIN! 🎉')}
function gameover(){end('GAME OVER')}
function end(msg){
  running=false; cancelAnimationFrame(raf);
  document.getElementById('otitle').textContent=msg;
  document.getElementById('osub').innerHTML='SCORE: '+score+'<br>HIGH: '+hi;
  document.getElementById('obtn').textContent='PLAY AGAIN';
  ov.classList.remove('off');
}

function start(){
  // reset dots
  cells.forEach((c,i)=>{if(TAG[i]==='d'||TAG[i]==='p'){live[i]=true;c.classList.remove('eaten')}});
  score=0;lives=3;running=true;
  reset(); ov.classList.add('off');
  lt=performance.now(); raf=requestAnimationFrame(loop);
}

// ── Input: keyboard + touch swipe ──
const KEYS={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowDown:[0,1],ArrowUp:[0,-1]};
document.addEventListener('keydown',e=>{if(KEYS[e.key]){e.preventDefault();[nx,ny]=KEYS[e.key]}});
let tx0,ty0;
document.addEventListener('touchstart',e=>{tx0=e.touches[0].clientX;ty0=e.touches[0].clientY},{passive:true});
document.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-tx0, dy=e.changedTouches[0].clientY-ty0;
  if(Math.abs(dx)<10&&Math.abs(dy)<10)return;
  Math.abs(dx)>Math.abs(dy)?[nx,ny]=[dx>0?1:-1,0]:[nx,ny]=[0,dy>0?1:-1];
},{passive:true});
document.getElementById('obtn').onclick=start;

draw();