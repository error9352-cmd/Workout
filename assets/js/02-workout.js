/* Extracted from the original app core. Classic script: shared global scope is intentional. */

function startWorkout(dow){let a=getA();if(!PROG[dow]||!PROG[dow].ex.length){toast('Tambahkan latihan ke hari ini dulu.');return}
 if(a&&a.dow!==dow){tab='workout';render();toast('Selesaikan atau batalkan workout yang sedang berjalan dulu.');return}
 if(!a||a.dow!==dow){const p=PROG[dow];a={date:todayIso,dow,name:p.n,start:Date.now(),sets:p.ex.map(e=>{const pv=prev(e[0]);const k=pv&&pv.length?pv:null,m=exMode(e);return Array.from({length:P(e[1]).sets},(_,j)=>({kg:m==='weight'&&k?String((k[j]||k[k.length-1]).kg||''):'',reps:m!=='time'&&k?String((k[j]||k[k.length-1]).reps||''):'',value:m==='time'&&k?String((k[j]||k[k.length-1]).value??(k[j]||k[k.length-1]).time??''):'',done:false}))})};ls.set('ap_active',a)}
 tab='workout';render();scrollTo(0,0)}

function swRow(i,n){return `<div class="f" style="margin-top:8px"><button class="btn ghost sm" data-swap="${i}" style="margin:0;flex:1">Ganti gerakan</button>${i<n-1?`<button class="btn ghost sm" data-later="${i}" style="margin:0;flex:1">Tunda ke akhir</button>`:''}</div>`}

function ssRow(a,p,i){const pj=a.pair?a.pair[i]:null,o=p.ex.map((e,k)=>k===i?'':`<option value="${k}" ${pj===k?'selected':''}>${esc(e[0])}</option>`).join('');return `<div class="ssr"><label for="ss${i}">Superset</label><select id="ss${i}" data-ss="${i}" aria-label="Superset dengan gerakan lain"><option value="">Tidak ada</option>${o}</select></div>${pj!=null&&p.ex[pj]?`<p class="prev">Selesai satu set di sini, lanjut ke ${esc(p.ex[pj][0])} tanpa istirahat. Timer jalan setelah keduanya.</p>`:''}`}

function rpeRow(i,j,v){const T={6:'Ringan, masih sisa 4 rep atau lebih',7:'Terkendali, masih sisa sekitar 3 rep',8:'Berat, masih sisa 2 rep',9:'Sangat berat, masih sisa 1 rep',10:'Mentok, tidak sanggup tambah rep'};return `<div class="rpe" role="group" aria-label="RPE set ${j+1}"><small>RPE</small><button type="button" class="rpeq" data-rpeinfo="1" aria-label="Apa itu RPE?">?</button>${[6,7,8,9,10].map(n=>`<button data-rpe="${i}-${j}-${n}" aria-pressed="${+v===n}" aria-label="RPE ${n}">${n}</button>`).join('')}${T[+v]?`<span class="rpec" role="status">${T[+v]}</span>`:''}</div>`}

function wtTargetSeconds(i,j){
 const a=getA();if(!a||!a.sets[i]||!a.sets[i][j])return 0;
 const e=SX(a).ex[i],unit=modeUnit(e),st=a.sets[i][j];
 const saved=parseInt(st.timerSec,10);if(saved>0)return saved;
 const target=String(e&&e[1]||'').match(/(\d+(?:[.,]\d+)?)\s*(?:–|-|to)?\s*(\d+(?:[.,]\d+)?)?\s*(detik|menit)/i);
 let value=0;
 if(target){const n=parseFloat(String(target[2]||target[1]).replace(',','.'));value=unit==='detik'?n:n*60;}
 if(value<=0){const entered=parseFloat(String(st.value??st.time??'').replace(',','.'));if(entered>0)value=unit==='detik'?entered:entered*60;}
 return Math.max(1,Math.round(value));
}

function wtElapsed(i,j){if(!WT||WT.i!==i||WT.j!==j)return 0;return Math.max(0,Math.floor((Date.now()-WT.start)/1000));}

function wtRemaining(i,j){return Math.max(0,wtTargetSeconds(i,j)-wtElapsed(i,j));}

function wtText(sec){return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');}

function wtCommit(){if(!WT)return;const a=getA();if(!a||!a.sets[WT.i]||!a.sets[WT.i][WT.j]){WT=null;return}const e=SX(a).ex[WT.i],unit=modeUnit(e),target=wtTargetSeconds(WT.i,WT.j),elapsed=Math.min(target,wtElapsed(WT.i,WT.j));a.sets[WT.i][WT.j].value=String(unit==='detik'?elapsed:Math.round((elapsed/60)*10)/10);ls.set('ap_active',a);WT=null;}

function wtAutoComplete(i,j){
 const a=getA();if(!a||!a.sets[i]||!a.sets[i][j])return;
 const e=SX(a).ex[i],st=a.sets[i][j],unit=modeUnit(e),target=wtTargetSeconds(i,j);
 st.value=String(unit==='detik'?target:Math.round((target/60)*10)/10);
 st.done=true;
 let adv=false;
 if(st.done&&a.sets[i].every(x=>x.done)&&i<a.sets.length-1&&(a.cur||0)===i){
   a.cur=i+1;adv=true;slideDir='r';
   toast('Latihan selesai. Lanjut: '+SX(a).ex[i+1][0]);
 }
 ls.set('ap_active',a);
 const nm=e[0],pj=a.pair?a.pair[i]:null;
 let sw=false;
 if(pj!=null&&!st.w&&a.sets[pj]){
   const dA=a.sets[i].filter(x=>x.done&&!x.w).length,dB=a.sets[pj].filter(x=>x.done&&!x.w).length,left=a.sets[pj].some(x=>!x.done&&!x.w);
   sw=true;
   if(dA>dB&&left){
     a.cur=pj;slideDir=pj>i?'r':'l';ls.set('ap_active',a);stopRest();toast('Superset: lanjut ke '+SX(a).ex[pj][0]);
   }else if(a.sets[i].every(x=>x.done)&&a.sets[pj].every(x=>x.done)&&(i===a.sets.length-1||pj===a.sets.length-1)){
     stopRest();
   }else{
     restStart(Math.max(restFor(nm),restFor(SX(a).ex[pj][0])));
   }
 }
 if(!sw){
   if(i===a.sets.length-1&&a.sets[i].every(x=>x.done))stopRest();
   else restStart(restFor(nm));
 }
 ls.set('ap_active',a);
 WT=null;
 rr();
 if(adv){scrollTo(0,0);const n=$('slide');if(n)n.scrollTop=0}
}

function wtRefresh(){
 if(!WT)return;
 const rem=wtRemaining(WT.i,WT.j);
 document.querySelectorAll('[data-wtimer-display]').forEach(el=>{if(+el.dataset.i===WT.i&&+el.dataset.j===WT.j)el.textContent=wtText(rem)});
 document.querySelectorAll('[data-wtimer]').forEach(b=>{if(+b.dataset.i===WT.i&&+b.dataset.j===WT.j){b.classList.add('running');const sm=b.querySelector('small');if(sm)sm.textContent='Berhenti'}});
 if(rem<=0)wtAutoComplete(WT.i,WT.j);
}

function wtStart(i,j){if(WT&&!(WT.i===i&&WT.j===j)){wtCommit();rr()}if(WT&&WT.i===i&&WT.j===j){wtCommit();rr();return}WT={i,j,start:Date.now()};wtRefresh();}

function workoutStopwatchRefresh(){
 const a=getA();
 if(!a||tab!=='workout')return;
 const el=document.querySelector('[data-workout-elapsed]');
 if(!el)return;
 const sec=Math.max(0,Math.floor((Date.now()-(a.start||Date.now()))/1000));
 el.textContent=wtText(sec);
}

function activeView(){const a=getA(),p=SX(a);const tt=a.sets.reduce((x,l)=>x+l.length,0),dn=a.sets.reduce((x,l)=>x+l.filter(s=>s.done).length,0),elapsed=Math.max(0,Math.floor((Date.now()-(a.start||Date.now()))/1000)),cur=Math.min(a.cur||0,p.ex.length-1),pct=tt?Math.round(dn/tt*100):0;
 const cards=p.ex.map((e,i)=>{const m=exMode(e),unit=modeUnit(e),pv=prev(e[0]),firstOpen=a.sets[i].findIndex(s=>!s.done&&!s.w),activeSet=firstOpen>=0?firstOpen:-1;const rows=a.sets[i].map((st,j)=>{const cls='set mode-'+m+' '+(st.done?'done ':'')+(st.w?' warm ':'')+(j===activeSet?' active':'');const field=m==='time'?`<button type="button" class="time-timer${WT&&WT.i===i&&WT.j===j?' running':''}" data-wtimer="${i}-${j}" data-i="${i}" data-j="${j}" aria-label="Timer ${e[0]} set ${j+1}"><span data-wtimer-display data-i="${i}" data-j="${j}">${WT&&WT.i===i&&WT.j===j?wtText(wtRemaining(i,j)):wtText(wtTargetSeconds(i,j))}</span><small>${WT&&WT.i===i&&WT.j===j?'Berhenti':'Mulai'}</small></button>${!st.done&&activeSet===j?adjRow2(i,j,pv,m):''}`:m==='bodyweight'?`<input inputmode="numeric" aria-label="Repetisi set ${j+1}" placeholder="rep" data-f="reps" data-i="${i}" data-j="${j}" value="${esc(String(st.reps??''))}">`:`<input inputmode="decimal" aria-label="Beban set ${j+1}" placeholder="kg" data-f="kg" data-i="${i}" data-j="${j}" value="${esc(String(st.kg??''))}"><input inputmode="numeric" aria-label="Repetisi set ${j+1}" placeholder="rep" data-f="reps" data-i="${i}" data-j="${j}" value="${esc(String(st.reps??''))}">`;return `<div class="${cls}"><button class="num wb" data-w="${i}-${j}" aria-label="${st.w?'Set warm-up, ketuk untuk jadikan set kerja':'Set '+(j+1)+', ketuk untuk tandai warm-up'}">${st.w?'W':j+1}</button>${field}<button class="ok" data-done="${i}-${j}">${st.done?'Selesai':'Catat'}</button></div>${st.w?'':(m==='weight'?rpeRow(i,j,st.rpe):'')}${m!=='time'&&!st.done&&activeSet===j?adjRow2(i,j,pv,m):''}`}).join('');const currentBest=Math.max(0,...a.sets[i].filter(s=>!s.w).map(s=>parseFloat(String(s.kg).replace(',','.'))||0)),previousBest=bestKg(e[0]),prPotential=m==='weight'&&currentBest>0&&currentBest>previousBest;const history=pv&&pv.length?(m==='weight'?pv.map(x=>`${x.kg} kg × ${x.reps}`).join(' · '):m==='bodyweight'?pv.map(x=>`${x.reps} reps`).join(' · '):pv.map(x=>`${x.value??x.time??''} ${unit}`).join(' · ')):'Belum ada data';const header=m==='weight'?`<div class="wk-set-head weight"><span>SET</span><span>BEBAN</span><span>REPETISI</span><span></span></div>`:m==='bodyweight'?`<div class="wk-set-head bodyweight"><span>SET</span><span>REPETISI</span><span></span></div>`:`<div class="wk-set-head time"><span>SET</span><span>TIMER</span><span>ATUR</span><span></span></div>`;return `<section class="card wk-exercise-card mode-${m}"><div class="wk-exercise-top"><div class="wk-step"><span>LATIHAN ${i+1} / ${p.ex.length}</span><span class="wk-set-status">${a.sets[i].filter(s=>s.done).length}/${a.sets[i].length} set</span></div><div class="hd"><h2>${esc(e[0])}${prPotential?' <span class="pr-tag" style="vertical-align:middle;margin-left:5px">PR potensial</span>':''}</h2><span class="wk-mode-pill ${m}">${modeLabel(m)}</span>${m==='weight'?`<button class="chip pl" data-plat="${i}" aria-label="Kalkulator plat">Plat</button>`:''}</div><div class="wk-target-line"><p class="mute">Target ${esc(e[1])}</p><span class="wk-target-note">${m==='weight'?'Masukkan beban dan repetisi':m==='bodyweight'?'Gunakan repetisi saja':'Catat durasi per set'}</span></div></div><div class="wl">${musBlock2(e[0])}<details class="xdt" data-dk="${esc(e[0])}" ${window.apDet&&window.apDet.has(e[0])?'open':''}><summary>Opsi gerakan<small>ganti, superset, catatan</small></summary>${swRow(i,p.ex.length)}${ssRow(a,p,i)}<input class="xnt" data-xnt="${i}" maxlength="120" placeholder="Catatan gerakan, mis. kursi posisi 4" aria-label="Catatan gerakan" value="${esc(xnote(e[0]))}"><p class="prev">Ketuk nomor set untuk tandai warm-up (W).</p></details>${a.pair&&a.pair[i]!=null&&p.ex[a.pair[i]]?`<p class="prev" style="color:var(--blue2)">Superset dengan ${esc(p.ex[a.pair[i]][0])}, lanjut tanpa istirahat</p>`:''}</div><div class="wr"><div class="wk-data-head"><span>PERFORMA TERAKHIR</span></div><div class="wk-history-line"><span>${esc(history)}</span></div>${rec(e,i,pv,a)}${header}${rows}<div class="f"><button class="btn ghost sm" data-add="${i}" style="flex:1">+ Tambah set</button>${m==='weight'?`<button class="btn ghost sm" data-addw="${i}" style="flex:1">Warm-up otomatis</button>`:''}</div></div></section>`});return `<div class="wk-session-head"><div class="wk-session-title"><span class="wk-kicker">WORKOUT AKTIF</span><h1>${esc(a.name)}</h1><div class="wk-session-info"><span>${dn}/${tt} set</span><span>${p.ex.length} latihan</span><span class="wk-started"><span>Mulai</span><b>${new Date(a.start||Date.now()).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})}</b></span><span class="wk-elapsed"><span>Durasi</span><b data-workout-elapsed>${wtText(elapsed)}</b></span></div></div><div class="wk-session-progress"><b>${pct}%</b><span>selesai</span></div></div><div class="wk-session-bar"><div class="bar"><b style="width:${pct}%"></b></div></div>${slideNav(a,p)}<div class="slide ${sc()}" id="slide">${cards[cur]}</div>${slideBtns(a,cards.length)}<button class="btn ghost" data-cancel="1">Batalkan workout</button>`}

function est1(a){let m=0;a.forEach(x=>{const v=x.reps>1?x.kg*(1+x.reps/30):x.kg;if(v>m)m=v});return Math.round(m*2)/2}

function prHtml(){const best={},all={};sessions().forEach(s=>{for(const n in (s.log||{}))s.log[n].forEach(x=>{(all[n]=all[n]||[]).push(x);if(!best[n]||x.kg>best[n])best[n]=x.kg})});
 const l=Object.entries(best).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,3);
 return l.length?l.map(x=>`<div class="row"><span>${x[0]}<small class="prev" style="display:block">est. 1RM ${est1(all[x[0]])} kg</small></span><span class="num" style="font-size:22px">${x[1]} kg</span></div>`).join(''):'<p class="empty">PR muncul setelah Anda menyelesaikan satu workout.</p>'}

function prCount(k){const ss=sessions(),s=ss[k];let n=0;for(const nm in (s.log||{})){const m=Math.max(...s.log[nm].map(x=>x.kg));let o=0;for(let i=0;i<k;i++){const l=ss[i].log&&ss[i].log[nm];if(l)l.forEach(x=>{if(x.kg>o)o=x.kg})}if(o>0&&m>o)n++}return n}
