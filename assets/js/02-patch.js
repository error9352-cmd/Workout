(function(){
const rm=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
new MutationObserver(()=>{if(!document.body.classList.contains('tabchg')||rm())return;
document.querySelectorAll('#app .stat .num').forEach(n=>{const t=n.firstChild;if(!t||t.nodeType!==3)return;const v=parseInt(t.nodeValue);if(!(v>0))return;const t0=performance.now();
(function f(now){const k=Math.min(1,(now-t0)/700);t.nodeValue=Math.round(v*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0)})
}).observe(document.getElementById('app'),{childList:true});
let lr=null,tot=1,vib=0;
setInterval(()=>{const el=document.getElementById('rest');if(!R||el.hidden){lr=null;return}
const l=R.paused?R.left:R.end-Date.now();if(R!==lr){lr=R;tot=Math.max(l,1000);vib=0}
tot=Math.max(tot,l);el.style.setProperty('--p',Math.max(0,Math.min(1,l/tot)));el.classList.toggle('low',l<=10000);
if(l<=500&&!vib&&!R.paused){vib=1;navigator.vibrate&&navigator.vibrate([300,150,300,150,300,150,300,150,300])}},200);
function summary(prs,nb){const s=sessions().slice(-1)[0];if(!s)return;
const sets=Object.values(s.log||{}).reduce((a,v)=>a+v.length,0),ex=Object.keys(s.log||{}).length;
const cell=(v,l)=>`<div class="stat"><div class="num">${v}</div><small>${l}</small></div>`;
const o=document.createElement('div');o.className='sheetbg';
o.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="Ringkasan workout"><div class="grab"></div><h2>${esc(s.name)} selesai</h2><div class="grid">${cell(s.minutes,'menit')}${cell(Math.round(s.volume||0).toLocaleString('id-ID'),'kg volume')}${cell(sets,'set, '+ex+' latihan')}</div>${prs.length?`<div class="prbox"><b>Rekor baru</b>${prs.map(x=>`<div>${esc(x)}</div>`).join('')}</div>`:''}${nb&&nb.length?`<div class="prbox nbox"><b>Pencapaian baru</b>${nb.map(x=>`<div>${esc(x.n)}</div>`).join('')}</div>`:''}<label for="shn">Catatan sesi (opsional)</label><textarea id="shn" rows="2" maxlength="200" placeholder="Contoh: bahu kiri agak nyeri"></textarea><button class="btn" id="shx">Tutup</button></div>`;
const x=()=>{o.classList.add('out');setTimeout(()=>o.remove(),250);document.removeEventListener('keydown',kd)},kd=e=>{if(e.key==='Escape')x()};
o.onclick=e=>{if(e.target===o)x()};document.body.appendChild(o);const c=o.querySelector('#shx');c.onclick=x;c.focus();document.addEventListener('keydown',kd)}
function celebrate(prs,nb){
summary(prs,nb);
if(rm())return;const cs=getComputedStyle(document.documentElement),cols=[cs.getPropertyValue('--a2').trim(),cs.getPropertyValue('--a1').trim(),'#FFB454','#34D399','#fff'],n=prs.length?36:16;
for(let i=0;i<n;i++){const c=document.createElement('i');c.className='cf';c.style.cssText='left:'+(Math.random()*100)+'vw;background:'+cols[i%5]+';--dx:'+((Math.random()-.5)*160)+'px;--r:'+(Math.random()*720)+'deg;animation-delay:'+(Math.random()*.3)+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),2300)}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-finish]');if(!b)return;const a=getA();if(!a)return;const prs=[];
SX(a).ex.forEach((x,i)=>{let m=0;(a.sets[i]||[]).forEach(s=>{if(s.done&&!s.w){const k=parseFloat(String(s.kg).replace(',','.'))||0;if(k>m)m=k}});const old=bestKg(x[0]);if(old>0&&m>old)prs.push(x[0]+' '+m+' kg')});
const n=sessions().length,bf=badges().filter(x=>x.ok).map(x=>x.id);setTimeout(()=>{if(sessions().length>n)celebrate(prs,badges().filter(x=>x.ok&&!bf.includes(x.id)))},80)},true);
})();
