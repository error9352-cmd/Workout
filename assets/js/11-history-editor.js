/* Athletic Physique — extracted from original index.html script block 12 (line 3559) */
(function(){
const num=v=>parseFloat(String(v).replace(',','.'));
function edit(k){const arr=(window.apTraining?window.apTraining.all():ls.get('ap_sessions',[])),s=arr[k];if(!s)return;
const log=Object.fromEntries(Object.entries(s.log||{}).map(([n,v])=>[n,v.map(x=>x.mode==='time'?[String(x.value??x.time??''),String(x.unit||'menit'),'time']:x.mode==='bodyweight'?[String(x.reps||''),'','bodyweight',x.rpe?String(x.rpe):'']:[String(x.kg),String(x.reps),x.rpe?String(x.rpe):'','weight'])]));
const o=document.createElement('div');o.className='sheetbg';
o.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="Ubah sesi"><div class="grab"></div><h2>Ubah sesi: ${esc(s.name)}</h2><label for="hd">Tanggal</label><input type="date" id="hd" value="${s.date}" max="${todayIso}"><label for="hm">Durasi (menit)</label><input id="hm" inputmode="numeric" value="${s.minutes}"><label for="hn">Catatan</label><textarea id="hn" rows="2" maxlength="200">${esc(s.note||'')}</textarea><div id="hl"></div><button class="btn" id="hs">Simpan</button><button class="btn ghost sm" id="hc">Batal</button></div>`;
const q=t=>o.querySelector(t),hl=q('#hl');
const draw=()=>{hl.innerHTML=Object.entries(log).map(([n,v],i)=>{const mode=v[0]&&v[0][2]||'weight';const isTime=mode==='time',isBody=mode==='bodyweight';return `<b style="display:block;margin-top:14px">${esc(n)}</b><div class="hs">${isTime?'<small class="prev">durasi</small>':isBody?'<small class="prev">repetisi</small>':'<small class="prev">kg</small><small class="prev">repetisi</small>'}<span></span></div>`+v.map((r,j)=>`<div class="hs">${isTime?`<input inputmode="decimal" data-n="${i}" data-r="${j}" data-c="0" value="${esc(r[0])}" aria-label="Durasi ${esc(n)} set ${j+1}"><small class="prev">${esc(r[1]||'menit')}</small>`:isBody?`<input inputmode="numeric" data-n="${i}" data-r="${j}" data-c="0" value="${esc(r[0])}" aria-label="Repetisi ${esc(n)} set ${j+1}"><span></span>`:`<input inputmode="decimal" data-n="${i}" data-r="${j}" data-c="0" value="${esc(r[0])}" aria-label="Beban ${esc(n)} set ${j+1}"><input inputmode="numeric" data-n="${i}" data-r="${j}" data-c="1" value="${esc(r[1])}" aria-label="Repetisi ${esc(n)} set ${j+1}">`}<button class="ok" data-x="${i}-${j}" aria-label="Hapus set ${j+1}">×</button></div>`).join('')+`<button class="btn ghost sm" data-a="${i}" style="margin-top:8px">+ Set</button>`}).join('')};
hl.oninput=e=>{const t=e.target;if(t.dataset.n!=null)log[Object.keys(log)[+t.dataset.n]][+t.dataset.r][+t.dataset.c]=t.value};
hl.onclick=e=>{const nm=Object.keys(log),x=e.target.closest('[data-x]'),a=e.target.closest('[data-a]');
if(x){const[i,j]=x.dataset.x.split('-').map(Number);log[nm[i]].splice(j,1);draw()}
else if(a){const v=log[nm[+a.dataset.a]],l=v[v.length-1];v.push(l?[l[0],l[1],l[2],l[3]]:['','','weight']);draw()}};
const close=()=>{o.classList.add('out');setTimeout(()=>o.remove(),250);document.removeEventListener('keydown',kd)},kd=e=>{if(e.key==='Escape')close()};
q('#hs').onclick=()=>{const log2={};let vol=0;
Object.entries(log).forEach(([n,v])=>{const mode=v[0]&&v[0][2]||'weight';let d;if(mode==='time')d=v.map(r=>({mode:'time',value:num(r[0])||0,unit:r[1]||'menit'})).filter(x=>x.value>0);else if(mode==='bodyweight')d=v.map(r=>({mode:'bodyweight',reps:parseInt(r[0])||0})).filter(x=>x.reps>0);else d=v.map(r=>({mode:'weight',kg:num(r[0])||0,reps:parseInt(r[1])||0,...(r[2]?{rpe:+r[2]}:{})})).filter(x=>x.reps>0);if(d.length){log2[n]=d;if(mode==='weight')d.forEach(x=>vol+=x.kg*x.reps)}});
if(!Object.keys(log2).length){toast('Minimal satu set dengan data yang valid.');return}
const dt=q('#hd').value||s.date,ch=dt!==s.date;s.log=log2;s.volume=vol;s.minutes=Math.max(1,parseInt(q('#hm').value)||s.minutes);s.note=q('#hn').value.trim().slice(0,200);s.date=dt;
if(ch)arr.sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0);
if(window.apTraining)window.apTraining.update(s.id,{date:s.date,minutes:s.minutes,note:s.note,log:s.log,volume:s.volume,hgEvaluation:s.hgEvaluation});
else ls.set('ap_sessions',arr);close();rr();toast('Sesi diperbarui.')};
q('#hc').onclick=close;o.onclick=e=>{if(e.target===o)close()};draw();document.body.appendChild(o);document.addEventListener('keydown',kd)}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-hed]');if(b)edit(+b.dataset.hed)});
})();
