/* ATHLETIC PHYSIQUE — Unified Gym Intelligence Engine v1
 * Brings the Home Gym intelligence stack to regular Gym training.
 * Additive: keeps the existing Gym scheduler/editor and uses the canonical
 * apTraining data model as the only completed-session source.
 */
(function(){
  'use strict';

  const EVAL_KEY='ap_gym_session_eval_v1';
  const WEEK_KEY='ap_gym_weekly_adaptation_v1';
  const BASE_KEY='ap_gym_intelligence_base_v1';
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0};
  const escG=v=>typeof esc==='function'?esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const sessions=()=>window.apUnifiedIntelligence?window.apUnifiedIntelligence.sessions('gym'):(window.apTraining?window.apTraining.all():(typeof window.sessions==='function'?window.sessions():[]));
  const decisionLabel=a=>({progression:'Naikkan Progres',maintenance:'Pertahankan & Progres',volume_reduction:'Kurangi Volume',rotation:'Rotasi Gerakan',deload:'Deload / Pemulihan'}[String(a||'').toLowerCase()]||'Evaluasi');
  const profile=()=>typeof prof==='function'?(prof()||{}):ls.get('ap_profile',{freq:'',goal:''})||{};
  const isGymSession=s=>{const p=s&&s.program||s&&s.programContext;return p&&p.type==='gym'||(!/home\s*gym|home\s*workout/i.test(String(s&&s.name||'')));};
  const isHomeName=n=>/home\s*gym|home\s*workout/i.test(String(n||''));
  const gymSessions=()=>sessions().filter(s=>!isHomeName(s.name));
  const gymProgramIds=()=>Object.keys(PROG||{}).map(Number).filter(k=>Number.isFinite(k)&&k<201);

  const GOALS={
    'Muscle Gain':{main:'8–12',accessory:'10–15',core:'10–20',rest:'60–120 detik',note:'Prioritas hipertrofi dan volume berkualitas.'},
    'Strength':{main:'4–8',accessory:'6–12',core:'8–15',rest:'120–180 detik',note:'Prioritas kekuatan pada gerakan utama.'},
    'Fat Loss':{main:'8–15',accessory:'10–20',core:'12–20',rest:'45–75 detik',note:'Pertahankan otot dengan kepadatan latihan yang lebih tinggi.'},
    'Athletic Performance':{main:'5–10',accessory:'8–15',core:'10–20',rest:'60–120 detik',note:'Prioritas kekuatan relatif, unilateral, dan kontrol.'}
  };
  const goal=()=>{const u=window.apUnifiedIntelligence&&window.apUnifiedIntelligence.context('gym');const g=String(u?u.goal:profile().goal||'').trim();return GOALS[g]?g:'Muscle Gain'};

  function targetParts(t){const m=String(t||'').match(/^(\d+)\s*[×x]\s*(\d+)\s*[–-]\s*(\d+)/);return m?{sets:+m[1],lo:+m[2],hi:+m[3]}:null}
  function targetFor(e,base,g){const r=targetParts(base);if(!r)return base;const kind=String(e&&e[2]||'').toLowerCase()==='time'?'core':(exInfo&&exInfo(e[0])&&exInfo(e[0]).p&&exInfo(e[0]).p.includes('core')?'core':'main');const range=GOALS[g][kind==='main'?'main':kind==='core'?'core':'accessory'];return `${r.sets} × ${range}`}
  function applyGoal(){
    const g=goal();
    gymProgramIds().forEach(id=>{const p=PROG[id];if(!p||!Array.isArray(p.ex))return;p.rest=GOALS[g].rest;p.f=String(p.f||'').replace(/ · Tujuan:.*$/,'')+` · Tujuan: ${g}`;p.ex=p.ex.map(e=>{const base=e._apGymGoalBase||e[1];e._apGymGoalBase=base;return [e[0],targetFor(e,base,g),e[2]]});});
  }

  function previousExercise(name){
    const rows=gymSessions().filter(s=>s.log&&s.log[name]).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
    return rows.length?rows[0].log[name]:null;
  }
  function progression(name,target){
    const r=targetParts(target), rows=previousExercise(name);if(!r||!rows)return {kind:'start',label:'Mulai konservatif',detail:`Target ${target}. Pilih beban yang menyisakan sekitar 2–3 repetisi cadangan.`};
    const work=rows.filter(x=>!x.w&&x.mode!=='time'),reps=work.map(x=>num(x.reps)).filter(Boolean),rpes=work.map(x=>num(x.rpe)).filter(Boolean);
    if(!work.length)return {kind:'start',label:'Mulai konservatif',detail:`Target ${target}.`};
    const reached=work.filter(x=>num(x.reps)>=r.hi).length,avg=rpes.length?rpes.reduce((a,b)=>a+b,0)/rpes.length:0,weighted=work.some(x=>x.mode==='weight'||x.kg!=null);
    if(weighted){
      const kg=Math.max(0,...work.map(x=>num(x.kg)));
      if(reached>=Math.max(1,r.sets-1)&&kg>0&&(!avg||avg<=8)){const inc=kg<20?1:kg<40?2:2.5;return {kind:'up',label:`Naikkan sekitar +${inc} kg`,detail:`${reached}/${r.sets} set mencapai batas atas dengan RPE ${avg?avg.toFixed(1):'—'}.`,kg:Math.round((kg+inc)*10)/10};}
      if(avg>=9||reached<Math.max(1,r.sets-2))return {kind:'hold',label:'Pertahankan beban',detail:'Kejar target repetisi sebelum menaikkan beban.'};
      return {kind:'hold',label:'Tambah 1 repetisi',detail:'Pertahankan beban dan dorong repetisi secara bertahap.'};
    }
    const best=Math.max(0,...reps);if(best>=r.hi&&(!avg||avg<=7.5))return {kind:'up',label:'+1–2 repetisi',detail:`Batas atas sudah tercapai dengan RPE ${avg?avg.toFixed(1):'—'}.`};
    return {kind:'hold',label:'Pertahankan target',detail:`Kejar ${r.hi} repetisi sebelum menambah volume.`};
  }

  function evaluateExercise(name,e,rows){
    const active=(rows||[]).filter(r=>!r.w);if(!active.length)return {status:'incomplete',label:'Belum tercatat',action:'Catat set kerja berikutnya.'};
    const r=targetParts(e[1]),reps=active.map(x=>num(x.reps)).filter(Boolean),rpes=active.map(x=>num(x.rpe)).filter(Boolean),avg=rpes.length?rpes.reduce((a,b)=>a+b,0)/rpes.length:0,max=Math.max(0,...reps),min=reps.length?Math.min(...reps):0;
    if(!reps.length)return {status:'incomplete',label:'Repetisi belum tercatat',action:'Catat repetisi agar progresi dapat dihitung.'};
    if(avg>=9||(r&&min<r.lo))return {status:'too_hard',label:'Terlalu berat',detail:`RPE ${avg?avg.toFixed(1):'—'} atau sebagian set di bawah target minimum.`,action:exMode(e)==='weight'?'Pertahankan atau turunkan beban sedikit.':'Pertahankan target dan kejar repetisi.'};
    if(r&&max>=r.hi&&avg>0&&avg<=7.5)return {status:'too_easy',label:'Terlalu mudah',detail:`Batas atas ${r.hi} tercapai dengan RPE ${avg.toFixed(1)}.`,action:exMode(e)==='weight'?'Naikkan beban kecil.':'Tambah 1–2 repetisi.'};
    if(r&&max>=r.hi)return {status:'successful',label:'Target tercapai',detail:`Batas atas ${r.hi} repetisi tercapai.`,action:'Pertahankan dan evaluasi RPE sesi berikutnya.'};
    return {status:'successful',label:'Progres sesuai',detail:'Repetisi berada dalam rentang target.',action:'Pertahankan beban dan kejar batas atas.'};
  }

  function detectStagnation(name,ev){
    if(ev.status!=='successful')return ev;const recent=[];
    for(const s of gymSessions().slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)))){if(s.log&&s.log[name]){recent.push(s.log[name]);if(recent.length>=3)break}}
    if(recent.length<3)return ev;
    const tops=recent.map(rows=>Math.max(0,...rows.filter(r=>!r.w).map(r=>num(r.reps)))),kgs=recent.map(rows=>Math.max(0,...rows.filter(r=>!r.w).map(r=>num(r.kg))));
    if(tops.every(x=>x===tops[0])&&kgs.every(x=>x===kgs[0])&&tops[0]>0)return {status:'stagnant',label:'Stagnan',detail:'Performa relatif sama dalam 3 sesi terakhir.',action:'Pertimbangkan variasi gerakan dengan pola otot yang sama.'};
    return ev;
  }

  function evaluateSession(a,p,log){
    const exercise={};p.ex.forEach((e,i)=>{const rows=(a.sets[i]||[]).filter(s=>s.done&&!s.w);if(rows.length)exercise[e[0]]=detectStagnation(e[0],evaluateExercise(e[0],e,rows));});
    const vals=Object.values(exercise),counts=vals.reduce((o,x)=>(o[x.status]=(o[x.status]||0)+1,o),{});let status='successful',label='Sesi berhasil',detail='Performa sesi berada dalam jalur progres.';
    if(counts.too_hard&&counts.too_hard>=Math.ceil(vals.length/2)){status='too_hard';label='Sesi terlalu berat';detail='Sebagian besar gerakan terlalu berat atau belum mencapai target minimum.'}
    else if(counts.stagnant&&counts.stagnant>=Math.ceil(vals.length/2)){status='stagnant';label='Sesi stagnan';detail='Sebagian besar gerakan belum menunjukkan perubahan berarti dalam beberapa sesi.'}
    else if(counts.too_easy&&counts.too_easy>=Math.ceil(vals.length/2)){status='too_easy';label='Sesi terlalu mudah';detail='Sebagian besar gerakan sudah di batas atas dengan RPE rendah.'}
    return {version:1,date:a.date,session:a.name,status,label,detail,exercise:Object.entries(exercise).map(([name,x])=>({name,...x})),counts,updatedAt:Date.now()};
  }

  function saveEvaluation(ev){
    const map=ls.get(EVAL_KEY,{});ev.exercise.forEach(x=>{map[x.name]={status:x.status,label:x.label,detail:x.detail,action:x.action,date:ev.date};});ls.set(EVAL_KEY,map);ls.set('ap_gym_last_evaluation_v1',{...ev});
  }

  function finishGym(a){
    const p=SX(a),log={};let vol=0;
    p.ex.forEach((e,i)=>{const m=exMode(e),d=a.sets[i].filter(s=>s.done&&!s.w).map(s=>m==='time'?({mode:'time',value:num(s.value),unit:modeUnit(e)}):m==='bodyweight'?({mode:'bodyweight',reps:Math.max(0,parseInt(s.reps)||0),...(s.rpe?{rpe:+s.rpe}:{})}):({mode:'weight',kg:num(s.kg),reps:Math.max(0,parseInt(s.reps)||0),...(s.rpe?{rpe:+s.rpe}:{})}));if(d.length){log[e[0]]=d;if(m==='weight')d.forEach(x=>vol+=x.kg*x.reps)}});
    if(!Object.keys(log).length){toast('Tekan Catat pada minimal satu set dulu.');return}
    const ev=evaluateSession(a,p,log),s=sessions(),oldBest={};s.forEach(x=>Object.entries(x.log||{}).forEach(([n,v])=>v.forEach(r=>{oldBest[n]=Math.max(oldBest[n]||0,num(r.kg))})));
    const newPr=[];Object.entries(log).forEach(([n,v])=>{const m=Math.max(0,...v.map(x=>num(x.kg)));if(m>0&&m>(oldBest[n]||0))newPr.push(n+' '+kf(m)+' kg')});
    const session={date:a.date,name:a.name,minutes:Math.max(1,Math.round((Date.now()-a.start)/60000)),volume:vol,log,gymEvaluation:ev};
    if(window.apTraining)window.apTraining.save(session);else{s.push(session);ls.set('ap_sessions',s)}
    saveEvaluation(ev);stopRest();ls.set('ap_active',null);tab='history';render();scrollTo(0,0);const counted=Object.values(log).reduce((n,v)=>n+v.length,0);toast(ev.label+' · '+counted+' set'+(newPr.length?' · PR: '+newPr.slice(0,2).join(', '):''));
  }

  function weekly(){
    const end=todayIso,start=(()=>{const d=new Date(end+'T00:00:00');d.setDate(d.getDate()-6);return d.toISOString().slice(0,10)})();
    const all=gymSessions(),cur=all.filter(s=>String(s.date)>=start&&String(s.date)<=end);const prevEnd=new Date(start+'T00:00:00');prevEnd.setDate(prevEnd.getDate()-1);const pe=prevEnd.toISOString().slice(0,10);const ps=new Date(pe+'T00:00:00');ps.setDate(ps.getDate()-6);const prevStart=ps.toISOString().slice(0,10);const prev=all.filter(s=>String(s.date)>=prevStart&&String(s.date)<=pe);
    const vol=x=>x.reduce((t,s)=>t+num(s.volume||s.metrics?.volumeKg),0),sets=x=>x.reduce((t,s)=>t+Object.values(s.log||{}).reduce((n,v)=>n+(v||[]).filter(r=>!r.w).length,0),0),rpe=x=>{const a=[];x.forEach(s=>Object.values(s.log||{}).forEach(v=>(v||[]).forEach(r=>{if(num(r.rpe))a.push(num(r.rpe))})));return a.length?a.reduce((a,b)=>a+b,0)/a.length:0};
    const v=vol(cur),pv=vol(prev),vd=pv?Math.round((v-pv)/pv*100):0,target=Math.max(0,num(profile().freq||0)),adh=target?Math.min(1,cur.length/target):1,rr=rpe(cur),evals=Object.values(ls.get(EVAL_KEY,{})||{}).filter(e=>String(e.date)>=start&&String(e.date)<=end);const counts=evals.reduce((o,e)=>(o[e.status]=(o[e.status]||0)+1,o),{});
    let d;if(!cur.length)d={action:'maintenance',title:'Bangun konsistensi',tone:'neutral',reason:'Belum ada sesi Gym yang selesai dalam 7 hari terakhir.',next:'Selesaikan sesi sesuai frekuensi sebelum menaikkan volume.',changes:['Pertahankan program saat ini']};
    else if(target&&adh<.6)d={action:'maintenance',title:'Prioritaskan konsistensi',tone:'neutral',reason:`Baru ${cur.length}/${target} sesi selesai minggu ini.`,next:'Kejar frekuensi latihan yang direncanakan.',changes:['Pertahankan volume','Jangan menambah intensitas dulu']};
    else if((counts.too_hard||0)>=2&&rr>=8.5)d={action:'volume_reduction',title:'Kurangi fatigue',tone:'hard',reason:'Beberapa evaluasi menunjukkan latihan terlalu berat dan RPE rata-rata tinggi.',next:'Kurangi sedikit volume aksesori dan pertahankan kualitas gerakan utama.',changes:['Kurangi 1 set pada aksesori','Pertahankan teknik dan beban utama']};
    else if((counts.stagnant||0)>=2)d={action:'rotation',title:'Rotasi gerakan',tone:'rotate',reason:'Beberapa gerakan stagnan dalam evaluasi terakhir.',next:'Ganti variasi dengan pola otot yang sama untuk memecah stagnasi.',changes:['Rotasi 1–2 gerakan stagnan','Pertahankan pola gerak dan target']};
    else if((counts.too_easy||0)>=2||(rr>0&&rr<=6.5&&adh>=.8))d={action:'progression',title:'Naikkan progres',tone:'up',reason:'Performa terlihat ringan dan konsistensi sudah baik.',next:'Naikkan beban kecil pada gerakan yang siap.',changes:['Tambah 1–2,5 kg bila teknik stabil','Atau tambah 1–2 repetisi']};
    else if(rr>=9&&vd<=0)d={action:'deload',title:'Recovery week',tone:'deload',reason:'RPE tinggi tanpa peningkatan volume yang sepadan.',next:'Kurangi volume sekitar 25–35% selama satu minggu.',changes:['Kurangi 25–35% working sets','Hindari mengejar PR']};
    else d={action:'maintenance',title:'Pertahankan dan progres kecil',tone:'ok',reason:'Konsistensi dan performa berada pada rentang yang sehat.',next:'Pertahankan struktur program dan gunakan progressive overload kecil.',changes:['Pertahankan volume utama','Progres kecil pada gerakan yang siap']};
    return {week:{start,end},previous:{start:prevStart,end:pe},current:cur,previousSessions:prev,metrics:{sessions:cur.length,target,adherence:adh,volume:v,previousVolume:pv,volumeDelta:vd,sets:sets(cur),previousSets:sets(prev),avgRpe:rr},decision:d,source:'Gym Weekly Adaptation Engine',goal:goal()};
  }

  function applyWeeklyDecision(d){
    const sig=todayIso+'|'+d.action;if(ls.get(WEEK_KEY,'')===sig)return;
    gymProgramIds().forEach(id=>{const p=PROG[id];if(!p||!Array.isArray(p.ex))return;p.ex=p.ex.map(e=>{const base=e._apGymWeeklyBase||e._apGymGoalBase||e[1];e._apGymWeeklyBase=base;const r=targetParts(base);if(!r)return e;let sets=r.sets,lo=r.lo,hi=r.hi;if(d.action==='deload')sets=Math.max(2,Math.ceil(sets*.7));if(d.action==='volume_reduction'&&e[2]!=='time')sets=Math.max(2,sets-1);if(d.action==='progression')hi+=1;return [e[0],`${sets} × ${lo}–${hi}`,e[2]]})});
    ls.set(WEEK_KEY,sig);saveProg();
  }

  function panel(){const w=weekly(),m=w.metrics,d=w.decision;applyWeeklyDecision(d);const pct=Math.round(m.adherence*100),vol=m.volume>=10000?(Math.round(m.volume/100)/10)+' ton':Math.round(m.volume).toLocaleString('id-ID')+' kg';return `<section class="card gym-intel-panel"><div class="gi-head"><div><span class="hg-progress-kicker">GYM INTELLIGENCE</span><h2>${escG(d.title)}</h2><p class="sub">${escG(d.reason)}</p></div><span class="gi-badge ${escG(d.tone||'neutral')}">${escG(decisionLabel(d.action))}</span></div><div class="gi-stats"><div><span>SESI</span><b>${m.sessions}${m.target?'/'+m.target:''}</b></div><div><span>KONSISTENSI</span><b>${pct}%</b></div><div><span>VOLUME</span><b>${vol}</b></div><div><span>RPE</span><b>${m.avgRpe?m.avgRpe.toFixed(1):'—'}</b></div></div><div class="gi-grid"><div><h3>Mengapa</h3><p>${escG(d.reason)}</p></div><div><h3>Minggu depan</h3><p>${escG(d.next)}</p>${(d.changes||[]).map(x=>`<div class="gi-change">${escG(x)}</div>`).join('')}</div></div></section>`}

  function progressPanel(){
    const rows=[];gymProgramIds().forEach(id=>{const p=PROG[id];if(!p)return;(p.ex||[]).forEach(e=>{const q=progression(e[0],e._apGymGoalBase||e[1]);if(q.kind==='up'&&rows.length<4)rows.push({name:e[0],q})})});
    const g=goal();return `<section class="card gym-progress-intel"><div><span class="hg-progress-kicker">PROGRESI GYM</span><h2>${escG(g)}</h2><p class="sub">Beban, repetisi, RPE, dan riwayat latihan digunakan untuk menentukan progres berikutnya.</p></div><div class="gi-next-list">${rows.length?rows.map(x=>`<div><span>${escG(x.name)}</span><strong>${escG(x.q.label)}</strong></div>`).join(''):'<p class="empty">Catat beberapa sesi Gym agar sistem dapat menentukan progres berikutnya.</p>'}</div></section>`;
  }

  window.apGymIntelligence={goal,applyGoal,progression,evaluateSession,weekly,decide:()=>weekly().decision,applyWeeklyDecision,refresh:()=>weekly()};
  window.__apGymIntelligenceReady=true;

  // Goal + adaptive progression is applied before the next workout is rendered.
  applyGoal();
  const oldStart=startWorkout;
  startWorkout=function(dow){oldStart(dow);const a=getA();if(!a||isHomeName(a.name))return;const p=SX(a);if(!p)return;a.sets.forEach((sets,i)=>{const e=p.ex[i],q=progression(e[0],e._apGymGoalBase||e[1]);if(q.kg&&exMode(e)==='weight')sets.forEach(s=>{if(!s.done&&!s.w)s.kg=String(q.kg)});});a.gymIntelligence={goal:goal(),updated:Date.now()};ls.set('ap_active',a)};
  const oldRender=render;
  render=function(){applyGoal();oldRender()};

  // Intercept only regular Gym completion; Home Gym keeps its specialized evaluator.
  document.addEventListener('click',function(e){const b=e.target.closest&&e.target.closest('[data-finish]');if(!b)return;const a=getA();if(!a||isHomeName(a.name))return;e.preventDefault();e.stopImmediatePropagation();finishGym(a)},true);

  const oldView=view;
  view=function(){const html=oldView();if(tab==='workout'&&typeof workoutMode!=='undefined'&&workoutMode==='gym'&&!getA()){const p=panel();const marker='<section class="card">';return p+html}return html};

  document.addEventListener('click',function(e){const b=e.target.closest&&e.target.closest('[data-finish]');if(!b)return;const a=getA();if(a&&!isHomeName(a.name))setTimeout(()=>{if(tab==='history')render()},40)},false);

  window.addEventListener('ap:weekly-coach-ready',()=>{});
  document.documentElement.dataset.gymIntelligence='v1';
})();
