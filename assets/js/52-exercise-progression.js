/* ATHLETIC PHYSIQUE — Exercise-Level Progression
 * Stage 11: canonical exercise history, PR, estimated 1RM, trend and next-step guidance.
 * Read-only analytics layer. It never rewrites completed sessions.
 */
(function(){
  'use strict';
  const M=()=>window.apDataModel;
  if(!M)return;
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0};
  const escV=v=>typeof window.esc==='function'?window.esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const round=(v,d=1)=>Math.round(v*Math.pow(10,d))/Math.pow(10,d);
  const e1rm=(kg,reps)=>kg>0&&reps>0?round(kg*(1+reps/30),1):0;
  const key=n=>String(n||'').trim().toLowerCase();

  function rows(name){
    const wanted=key(name);
    return M().exerciseRows().filter(r=>key(r.exercise?.name)===wanted).map(r=>{
      const e=r.exercise, work=(e.sets||[]).filter(s=>s.done&&!s.warmup);
      const bestSet=work.reduce((best,s)=>{
        const kg=num(s.kg), reps=Math.max(0,Math.round(num(s.reps)));
        if(kg<=0||reps<=0)return best;
        const est=e1rm(kg,reps);
        if(!best||est>best.est)return {kg,reps,rpe:num(s.rpe),est};
        return best;
      },null);
      return {sessionId:r.session.id,date:r.session.date,mode:e.mode||null,metrics:e.metrics||{},bestSet,sets:work};
    }).sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.sessionId).localeCompare(String(b.sessionId)));
  }

  function target(name){
    let found=null;
    const scan=p=>{
      if(!p||!Array.isArray(p.ex))return;
      const hit=p.ex.find(e=>key(e?.[0])===key(name));
      if(hit&&hit[1])found=String(hit[1]);
    };
    try{Object.keys(window.PROG||{}).forEach(k=>scan(window.PROG[k]));}catch(e){}
    return found;
  }

  function summarize(name){
    const rs=rows(name), recent=rs.slice(-4), last=recent[recent.length-1]||null, prev=recent[recent.length-2]||null;
    if(!last)return null;
    const recentEst=recent.map(r=>r.bestSet?.est||0).filter(Boolean);
    const previousEst=prev?.bestSet?.est||0;
    const delta=previousEst?round((last.bestSet?.est||0)-previousEst,1):0;
    let trend='stable';
    if(delta>0.2)trend='up'; else if(delta<-0.2)trend='down';
    const last3=recent.slice(-3).map(r=>r.bestSet?.est||0).filter(Boolean);
    const stagnant=last3.length>=3&&Math.max(...last3)-Math.min(...last3)<0.5;
    const t=target(name);
    const range=t?.match(/(\d+(?:[.,]\d+)?)\s*[–-]\s*(\d+(?:[.,]\d+)?)/);
    const min=range?num(range[1]):0,max=range?num(range[2]):0;
    let action='Pertahankan';
    let reason='Pertahankan performa dan teknik yang stabil.';
    if(last.mode==='bodyweight'){
      const reps=last.bestSet?.reps||0;
      if(max&&reps>=max){action='Naikkan repetisi';reason=`Repetisi terbaik sudah mencapai batas atas target ${max}.`}
      else if(trend==='up'){action='Pertahankan';reason='Repetisi menunjukkan tren naik; jaga kualitas teknik.'}
      else if(stagnant){action='Tambah 1–2 repetisi';reason='Performa relatif datar dalam tiga pencatatan terakhir.'}
      else action='Tambah 1 repetisi';
    }else if(last.mode==='weight'){
      const reps=last.bestSet?.reps||0,kg=last.bestSet?.kg||0;
      if(max&&reps>=max){action='Naikkan beban';reason=`Repetisi ${reps} sudah mencapai batas atas target ${max}.`}
      else if(stagnant){action='Naikkan beban kecil';reason='Estimated 1RM relatif datar dalam tiga pencatatan terakhir.'}
      else if(trend==='down'){action='Pertahankan beban';reason='Performa terakhir turun; stabilkan dulu sebelum menaikkan beban.'}
      else if(trend==='up'){action='Pertahankan / progres kecil';reason='Performa naik; lanjutkan progressive overload bertahap.'}
      else action=kg?'Pertahankan':'Catat beban';
    }else{
      action='Pertahankan durasi';reason='Gunakan durasi terakhir sebagai acuan dan naikkan bertahap bila terasa mudah.';
    }
    return {name,rows:rs,recent,last,previous:prev,trend,delta,stagnant,target:t,range:{min,max},action,reason,bestKg:last.bestSet?.kg||0,bestReps:last.bestSet?.reps||0,e1rm:last.bestSet?.est||0};
  }

  function all(){
    const names=[...new Set(M().exerciseRows().map(r=>r.exercise?.name).filter(Boolean))];
    return names.map(summarize).filter(Boolean).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  }

  window.apExerciseProgression={version:1,source:()=>M().key,rows,summarize,all,target,e1rm,audit:()=>({source:M().key,exercises:all().length})};

  function fmtKg(v){return v?`${round(v,1)} kg`:'—'}
  function trendLabel(v){return v==='up'?'Naik':v==='down'?'Turun':'Stabil'}
  function card(){
    const data=all().slice(0,8);
    if(!data.length)return `<section class="card ap-ex-progression"><div class="hd"><div><h2>Progress per gerakan</h2><p class="sub">Riwayat latihan akan muncul setelah Anda menyelesaikan workout.</p></div></div></section>`;
    const rowsHtml=data.map(x=>{
      const last=x.last?.bestSet, prev=x.previous?.bestSet;
      const perf=last?(x.last.mode==='bodyweight'?`${last.reps} reps`:x.last.mode==='weight'?`${fmtKg(last.kg)} × ${last.reps}`:`${last.value||''} ${last.unit||''}`):'—';
      const change=x.previous&&last?(x.last.mode==='weight'?`${x.delta>0?'+':''}${round(x.delta,1)} 1RM`:x.last.mode==='bodyweight'?`${last.reps-(prev?.reps||0)>0?'+':''}${last.reps-(prev?.reps||0)} reps`:''):'—';
      return `<div class="ap-ex-row"><div class="ap-ex-name"><strong>${escV(x.name)}</strong><small>${x.target?`Target ${escV(x.target)}`:'Target tidak tersedia'}</small></div><div><span class="ap-ex-label">Terakhir</span><strong>${escV(perf)}</strong></div><div><span class="ap-ex-label">Tren</span><strong class="ap-trend ${x.trend}">${trendLabel(x.trend)}</strong></div><div><span class="ap-ex-label">Perubahan</span><strong>${escV(change)}</strong></div><div><span class="ap-ex-label">Berikutnya</span><strong class="ap-action">${escV(x.action)}</strong><small>${escV(x.reason)}</small></div></div>`;
    }).join('');
    return `<section class="card ap-ex-progression"><div class="hd"><div><h2>Progress per gerakan</h2><p class="sub">Beban, repetisi, estimated 1RM, tren, dan langkah berikutnya dari data latihan yang sama.</p></div><span class="chip">Canonical</span></div><div class="ap-ex-table">${rowsHtml}</div><p class="prev ap-ex-note">PR dan rekomendasi hanya memakai set kerja yang selesai. Warm-up tidak masuk perhitungan.</p></section>`;
  }

  if(typeof window.progressCards==='function'){
    const old=window.progressCards;
    if(!old.__apExerciseProgressionV1){
      const wrapped=function(){return card()+old()};
      wrapped.__apExerciseProgressionV1=true;
      window.progressCards=wrapped;
    }
  }
  document.documentElement.dataset.exerciseProgression='canonical-v1';
  setTimeout(()=>{if(typeof render==='function')render()},0);
})();
