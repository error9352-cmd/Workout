/* ATHLETIC PHYSIQUE — Home Gym Weekly Adaptation Engine
 * Evaluates the last 7 days and decides the next week's training direction.
 * Additive layer: Gym flow remains untouched.
 */
(function(){
  'use strict';
  const KEY='ap_home_gym_weekly_adaptation_v1';
  const PLAN_KEY='ap_home_gym_plan_v3';
  const EVAL_KEY='ap_home_gym_last_evaluation_v1';
  const HOME_RE=/home\s*gym/i;
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0;};
  const escW=v=>typeof esc==='function'?esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const getSessions=()=>window.apUnifiedIntelligence?window.apUnifiedIntelligence.sessions('home'):(window.apTraining?window.apTraining.all():(typeof window.sessions==='function'?window.sessions():ls.get('ap_sessions',[])));
  const getPlan=()=>{const base=ls.get(PLAN_KEY,{level:'Pemula',days:3,equipment:['bodyweight']});const u=window.apUnifiedIntelligence&&window.apUnifiedIntelligence.context('home');return u?Object.assign({},base,{level:u.level,days:u.frequency,equipment:u.equipment}):base};
  const getCycle=()=>ls.get('ap_home_gym_cycle_v1',{start:todayIso,week:1});
  const isoDate=d=>{const x=new Date(d);return Number.isNaN(x.getTime())?'':x.toISOString().slice(0,10);};
  const daysAgo=(date,from)=>Math.floor((new Date(from+'T00:00:00')-new Date(String(date)+'T00:00:00'))/86400000);
  const decisionLabel=a=>({progression:'Naikkan Progres',maintenance:'Pertahankan & Progres',volume_reduction:'Kurangi Volume',rotation:'Rotasi Gerakan',deload:'Deload / Pemulihan'}[String(a||'').toLowerCase()]||'Evaluasi');

  function weeklyWindow(){
    const end=todayIso;
    const start=isoDate(new Date(end+'T00:00:00').getTime()-6*86400000);
    return {start,end};
  }

  function collect(){
    const w=weeklyWindow(), all=getSessions();
    const sessions=all.filter(s=>HOME_RE.test(String(s&&s.name||'')) && daysAgo(s.date,w.end)>=0 && daysAgo(s.date,w.end)<=6);
    let sets=0,volume=0,rpeVals=[], exercises=0, prs=0;
    sessions.forEach(s=>Object.entries(s.log||{}).forEach(([name,rows])=>{
      exercises++;
      (rows||[]).forEach(r=>{
        if(r.w||!r.done)return;
        sets++;
        const kg=num(r.kg), reps=num(r.reps);
        if(kg&&reps)volume+=kg*reps;
        if(num(r.rpe))rpeVals.push(num(r.rpe));
      });
    }));
    const evalMap=ls.get(EVAL_KEY,{});
    let successful=0,tooEasy=0,tooHard=0,stagnant=0;
    Object.values(evalMap||{}).forEach(e=>{
      if(!e||daysAgo(e.date,w.end)<0||daysAgo(e.date,w.end)>6)return;
      if(e.status==='successful')successful++; else if(e.status==='too_easy')tooEasy++; else if(e.status==='too_hard')tooHard++; else if(e.status==='stagnant')stagnant++;
    });
    const avgRpe=rpeVals.length?rpeVals.reduce((a,b)=>a+b,0)/rpeVals.length:0;
    const planDays=Math.max(2,Math.min(6,Number(getPlan().days)||3));
    const adherence=Math.min(1,sessions.length/planDays);
    return {week:w,sessions:sessions.length,planned:planDays,adherence,sets,volume,avgRpe,successful,tooEasy,tooHard,stagnant,exercises};
  }

  function decide(m){
    const cycle=getCycle();
    if(Number(cycle.week)===4)return {action:'deload',title:'Deload',tone:'deload',reason:'Ini adalah minggu ke-4 dari siklus. Kurangi volume dan prioritaskan pemulihan.',next:'Kurangi sekitar 30–40% volume set, pertahankan teknik, dan jangan mengejar PR.'};
    if(m.sessions===0)return {action:'maintenance',title:'Bangun konsistensi',tone:'neutral',reason:'Belum ada sesi Home Gym yang selesai dalam 7 hari terakhir.',next:'Pertahankan program saat ini dan selesaikan sesi sesuai frekuensi yang dipilih.'};
    if(m.adherence<0.6)return {action:'maintenance',title:'Konsistensi dulu',tone:'neutral',reason:`Baru ${m.sessions}/${m.planned} sesi selesai minggu ini.`,next:'Jangan menambah volume sebelum frekuensi latihan lebih konsisten.'};
    if(m.tooHard>m.successful && m.tooHard>=2)return {action:'volume_reduction',title:'Kurangi beban latihan',tone:'hard',reason:'Sebagian besar evaluasi menunjukkan sesi terlalu berat.',next:'Kurangi 1 set pada gerakan aksesori atau turunkan beban sedikit pada gerakan yang bermasalah.'};
    if(m.stagnant>=2)return {action:'rotation',title:'Rotasi gerakan',tone:'rotate',reason:'Beberapa gerakan menunjukkan stagnasi dalam evaluasi terakhir.',next:'Pertahankan pola gerak tetapi ganti variasi gerakan untuk memecah stagnasi.'};
    if(m.tooEasy>=2 || (m.avgRpe>0&&m.avgRpe<=6.5&&m.adherence>=0.8))return {action:'progression',title:'Naikkan progres',tone:'up',reason:'Latihan terlihat terlalu mudah dan konsistensi sudah baik.',next:'Naikkan beban sekitar 1–2,5 kg pada gerakan berbeban atau tambah 1–2 repetisi pada bodyweight.'};
    return {action:'maintenance',title:'Lanjutkan progres',tone:'ok',reason:'Performa dan konsistensi berada dalam rentang yang sehat.',next:'Pertahankan program dan lanjutkan progres kecil tanpa memaksakan peningkatan.'};
  }

  function applyDecision(d){
    if(typeof PROG!=='object')return;
    const key='ap_home_gym_weekly_applied_v1';
    const sig=todayIso+'|'+d.action;
    if(ls.get(key,'')===sig)return;
    const ids=[201,202,203,204,205,206];
    ids.forEach(id=>{
      const p=PROG[id];if(!p||!Array.isArray(p.ex))return;
      p.ex=p.ex.map(e=>{
        const base=e._hgWeeklyBase||e[1];e._hgWeeklyBase=base;
        const m=String(base).match(/^(\d+)\s*×\s*(\d+)\s*[–-]\s*(\d+)/);
        if(!m)return e;
        let sets=+m[1],lo=+m[2],hi=+m[3];
        if(d.action==='deload')sets=Math.max(2,Math.ceil(sets*0.65));
        if(d.action==='volume_reduction'&&e[2]!=='time-or-reps')sets=Math.max(2,sets-1);
        if(d.action==='progression'&&e[2]==='time-or-reps')hi+=2;
        if(d.action==='progression'&&e[2]!=='time-or-reps')hi+=1;
        return [e[0],`${sets} × ${lo}–${hi}`,e[2]];
      });
    });
    ls.set(key,sig);
  }

  function panel(){
    const m=collect(),d=decide(m);
    applyDecision(d);
    const rpe=m.avgRpe?m.avgRpe.toFixed(1):'—';
    const adherence=Math.round(m.adherence*100);
    return `<section class="card hg-weekly-adaptation"><div class="hg-weekly-head"><div><span class="hg-progress-kicker">ADAPTASI MINGGUAN</span><h2>${escW(d.title)}</h2><p class="sub">${escW(d.reason)}</p></div><span class="hg-weekly-badge ${escW(d.tone)}">${escW(decisionLabel(d.action))}</span></div><div class="hg-weekly-stats"><div><span>SESI</span><b>${m.sessions}/${m.planned}</b></div><div><span>KONSISTENSI</span><b>${adherence}%</b></div><div><span>SET</span><b>${m.sets}</b></div><div><span>RPE</span><b>${rpe}</b></div></div><div class="hg-weekly-next"><b>Minggu berikutnya</b><p>${escW(d.next)}</p></div></section>`;
  }

  window.__apHomeGymWeeklyAdapt=collect;
  window.apHomeGymWeeklyAdaptation={collect,decide,applyDecision,weeklyWindow};
  const oldView=view;
  view=function(){
    const html=oldView();
    if(tab==='workout'&&typeof workoutMode!=='undefined'&&workoutMode==='home'&&!getA()){
      const p=panel();
      const marker='<section class="card hg-adaptive-note">';
      if(html.includes(marker))return html.replace(marker,p+marker);
      const marker2='<section class="card hg-goal-card">';
      return html.includes(marker2)?html.replace(marker2,p+marker2):p+html;
    }
    return html;
  };

  // Re-render after a completed Home Gym session so the weekly decision is visible immediately.
  document.addEventListener('click',function(e){
    const b=e.target.closest&&e.target.closest('[data-finish]');
    if(!b)return;
    const a=getA&&getA();
    if(a&&HOME_RE.test(String(a.name||'')))setTimeout(()=>{if(tab==='history')render();},40);
  });
})();
