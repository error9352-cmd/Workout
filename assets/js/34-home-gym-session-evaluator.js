/* ATHLETIC PHYSIQUE — Home Gym Session Evaluator
 * Evaluates completed Home Gym sessions and feeds the result into the next
 * adaptive program. Gym flow remains untouched.
 */
(function(){
  'use strict';
  const EVAL_KEY='ap_home_gym_session_eval_v1';
  const PLAN_KEY='ap_home_gym_plan_v3';
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0;};
  const escE=v=>typeof esc==='function'?esc(String(v)):String(v);
  const isHome=a=>/home\s*gym/i.test(String(a&&a.name||''));
  const sessions=()=>window.apUnifiedIntelligence?window.apUnifiedIntelligence.sessions('home'):(window.apTraining?window.apTraining.all():(typeof window.sessions==='function'?window.sessions():ls.get('ap_sessions',[])));

  function targetRange(target){
    const m=String(target||'').match(/(\d+(?:[.,]\d+)?)\s*[–-]\s*(\d+(?:[.,]\d+)?)/);
    return m?[num(m[1]),num(m[2])]:[0,0];
  }
  function evaluateExercise(name,e,rows){
    const mode=exMode(e), active=rows.filter(r=>!r.w);
    if(!active.length)return {status:'incomplete',label:'Belum tercatat',detail:'Tidak ada set kerja yang tercatat.',action:'Pertahankan target dan selesaikan set kerja berikutnya.'};
    const [lo,hi]=targetRange(e[1]);
    const reps=active.map(r=>num(r.reps)).filter(Boolean);
    const rpes=active.map(r=>num(r.rpe)).filter(Boolean);
    const avgRpe=rpes.length?rpes.reduce((a,b)=>a+b,0)/rpes.length:0;
    const maxReps=reps.length?Math.max(...reps):0;
    const minReps=reps.length?Math.min(...reps):0;
    const weight=active.map(r=>num(r.kg)).filter(Boolean);
    const maxKg=weight.length?Math.max(...weight):0;
    if(mode==='time'){
      const vals=active.map(r=>num(r.value)).filter(Boolean);
      const target=targetRange(e[1]);
      const maxTime=vals.length?Math.max(...vals):0;
      if(target[1]&&maxTime>=target[1])return {status:'successful',label:'Target tercapai',detail:`Durasi terbaik ${maxTime} ${modeUnit(e)}.`,action:'Pertahankan durasi atau tambah 5–10 detik.'};
      return {status:'too_hard',label:'Masih berat',detail:`Durasi terbaik ${maxTime||0} ${modeUnit(e)}.`,action:'Pertahankan durasi sampai target tercapai.'};
    }
    if(!reps.length)return {status:'incomplete',label:'Repetisi belum tercatat',detail:'Set selesai tetapi repetisi belum tersedia.',action:'Catat repetisi pada sesi berikutnya.'};
    if(avgRpe>=9 || (lo&&minReps<lo))return {status:'too_hard',label:'Terlalu berat',detail:`RPE rata-rata ${avgRpe?avgRpe.toFixed(1):'—'}; beberapa set belum mencapai batas bawah.`,action:mode==='weight'?'Pertahankan atau turunkan beban 2,5 kg.':'Pertahankan target dan tambah repetisi secara bertahap.'};
    if(hi&&maxReps>=hi && avgRpe>0 && avgRpe<=7.5)return {status:'too_easy',label:'Terlalu mudah',detail:`Repetisi sudah mencapai ${hi} dengan RPE ${avgRpe.toFixed(1)}.`,action:mode==='weight'?'Naikkan beban 2,5 kg.':'Tambah 1–2 repetisi per set.'};
    if(hi&&maxReps>=hi && (!avgRpe || avgRpe<=8.5))return {status:'successful',label:'Target tercapai',detail:`Repetisi mencapai batas atas ${hi}.`,action:mode==='weight'?'Pertahankan beban lalu evaluasi RPE berikutnya.':'Tambah 1 repetisi pada sesi berikutnya.'};
    return {status:'successful',label:'Progres sesuai',detail:`Repetisi berada dalam rentang ${lo||'—'}–${hi||'—'}.`,action:'Pertahankan beban dan kejar batas atas rentang.'};
  }

  function detectStagnation(name, currentEval, all){
    if(currentEval.status!=='successful')return currentEval;
    const recent=[];
    all.slice().reverse().some(s=>{
      if(!isHome(s)||!s.log||!s.log[name])return false;
      recent.push(s.log[name]);return recent.length>=3;
    });
    if(recent.length<3)return currentEval;
    const tops=recent.map(rows=>Math.max(0,...rows.filter(r=>!r.w).map(r=>num(r.reps))));
    const weights=recent.map(rows=>Math.max(0,...rows.filter(r=>!r.w).map(r=>num(r.kg))));
    const sameReps=tops.every(x=>x===tops[0]);
    const sameWeight=weights.every(x=>x===weights[0]);
    if(sameReps&&sameWeight&&tops[0]>0)return {status:'stagnant',label:'Stagnan',detail:'Performa relatif sama dalam 3 sesi terakhir.',action:'Pertimbangkan variasi gerakan atau ubah target progresi.'};
    return currentEval;
  }

  function evaluateSession(a,p,log){
    const previous=sessions(), exercise={};
    p.ex.forEach((e,i)=>{const rows=(a.sets[i]||[]).filter(s=>s.done&&!s.w);if(rows.length)exercise[e[0]]=detectStagnation(e[0],evaluateExercise(e[0],e,rows),previous);});
    const vals=Object.values(exercise);
    const counts=vals.reduce((o,x)=>(o[x.status]=(o[x.status]||0)+1,o),{});
    let status='successful',label='Sesi berhasil',detail='Performa sesi berada dalam jalur progres.';
    if(counts.too_hard&&counts.too_hard>=Math.ceil(vals.length/2)){status='too_hard';label='Sesi terlalu berat';detail='Sebagian besar gerakan terasa terlalu berat atau belum mencapai target minimum.';}
    else if(counts.stagnant&&counts.stagnant>=Math.ceil(vals.length/2)){status='stagnant';label='Sesi stagnan';detail='Sebagian besar gerakan belum menunjukkan perubahan berarti dalam beberapa sesi.';}
    else if(counts.too_easy&&counts.too_easy>=Math.ceil(vals.length/2)){status='too_easy';label='Sesi terlalu mudah';detail='Sebagian besar gerakan sudah berada di batas atas dengan RPE rendah.';}
    const next=Object.entries(exercise).map(([name,x])=>({name,...x}));
    return {version:1,date:a.date,session:a.name,status,label,detail,exercise:next,counts,updatedAt:Date.now()};
  }

  function recommendation(evalResult){
    if(evalResult.status==='too_hard')return 'Minggu berikutnya: turunkan sedikit beban/volume pada gerakan yang terlalu berat.';
    if(evalResult.status==='too_easy')return 'Minggu berikutnya: naikkan beban atau repetisi pada gerakan yang sudah terlalu mudah.';
    if(evalResult.status==='stagnant')return 'Minggu berikutnya: gunakan variasi gerakan untuk memecah stagnasi.';
    return 'Minggu berikutnya: lanjutkan progres bertahap dan pertahankan teknik.';
  }

  function saveEvaluation(ev){
    const map=ls.get(EVAL_KEY,{});ev.exercise.forEach(x=>{map[x.name]={status:x.status,label:x.label,detail:x.detail,action:x.action,date:ev.date};});ls.set(EVAL_KEY,map);
    ls.set('ap_home_gym_last_evaluation_v1',{...ev,recommendation:recommendation(ev)});
  }

  function finishHome(a){
    const p=SX(a),log={};let vol=0;
    p.ex.forEach((e,i)=>{const m=exMode(e),d=a.sets[i].filter(s=>s.done&&!s.w).map(s=>m==='time'?({mode:'time',value:num(s.value),unit:modeUnit(e)}):m==='bodyweight'?({mode:'bodyweight',reps:parseInt(s.reps)||0,...(s.rpe?{rpe:+s.rpe}:{})}):({mode:'weight',kg:num(s.kg),reps:parseInt(s.reps)||0,...(s.rpe?{rpe:+s.rpe}:{})}));if(d.length){log[e[0]]=d;if(m==='weight')d.forEach(x=>vol+=x.kg*x.reps);}});
    if(!Object.keys(log).length){toast('Tekan Catat pada minimal satu set dulu.');return;}
    const ev=evaluateSession(a,p,log);
    const s=sessions();
    const oldBest={};s.forEach(x=>Object.entries(x.log||{}).forEach(([n,v])=>v.forEach(r=>{oldBest[n]=Math.max(oldBest[n]||0,num(r.kg));})));
    const newPr=[];Object.entries(log).forEach(([n,v])=>{const m=Math.max(0,...v.map(x=>num(x.kg)));if(m>0&&m>(oldBest[n]||0))newPr.push(n+' '+kf(m)+' kg');});
    const session={date:a.date,name:a.name,minutes:Math.max(1,Math.round((Date.now()-a.start)/60000)),volume:vol,log,hgEvaluation:ev};
    if(window.apTraining)window.apTraining.save(session);else{ s.push(session); ls.set('ap_sessions',s); }saveEvaluation(ev);stopRest();ls.set('ap_active',null);tab='history';render();scrollTo(0,0);
    const counted=Object.values(log).reduce((n,v)=>n+v.length,0);
    toast(ev.label+' · '+counted+' set'+(newPr.length?' · PR: '+newPr.slice(0,2).join(', '):''));
  }

  // Intercept only the Home Gym completion action before the core Gym handler.
  document.addEventListener('click',function(e){
    const b=e.target.closest&&e.target.closest('[data-finish]');if(!b)return;
    const a=getA();if(!a||!isHome(a))return;
    e.preventDefault();e.stopImmediatePropagation();finishHome(a);
  },true);

  // Session evaluation is rendered inside the corresponding History item.
  // It is intentionally not injected as a global card above the History page.
})();
