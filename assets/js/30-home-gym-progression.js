/* ATHLETIC PHYSIQUE — Home Gym Progression Engine
 * Additive layer: progressive overload, weekly cycle, stall detection and deload guidance.
 */
(function(){
  'use strict';
  const CYCLE_KEY='ap_home_gym_cycle_v1';
  const PLAN_KEY='ap_home_gym_plan_v3';
  const HOME_IDS=new Set([201,202,203,204,205,206]);

  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0;};
  const sessions=()=>typeof window.sessions==='function'?window.sessions():ls.get('ap_sessions',[]);
  const state=()=>ls.get(PLAN_KEY,{level:'Pemula',days:3,equipment:['bodyweight']});
  const isHomeSession=s=>String(s&&s.name||'').toLowerCase().includes('home gym');
  const homeHistory=name=>sessions().filter(s=>isHomeSession(s)&&s.log&&s.log[name]).sort((a,b)=>String(a.date).localeCompare(String(b.date))).map(s=>({s,log:s.log[name]}));
  const last=name=>{const h=homeHistory(name);return h.length?h[h.length-1]:null;};
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

  function cycle(){
    let c=ls.get(CYCLE_KEY,null);
    if(!c||!c.start){c={start:todayIso,week:1};ls.set(CYCLE_KEY,c);}
    const days=Math.max(0,Math.floor((new Date(todayIso+'T00:00:00')-new Date(c.start+'T00:00:00'))/86400000));
    const week=days%28<7?1:(days%28<14?2:(days%28<21?3:4));
    return {start:c.start,week,days};
  }

  function repRange(target){
    const m=String(target||'').match(/(\d+)\s*×\s*(\d+)\s*[–-]\s*(\d+)/);
    return m?{sets:+m[1],lo:+m[2],hi:+m[3]}:null;
  }
  function targetWithSets(target,sets){
    const r=repRange(target);return r?`${sets} × ${r.lo}–${r.hi}`:target;
  }
  function progression(name,target){
    const r=repRange(target),h=last(name);
    if(!r||!h)return {kind:'start',label:'Mulai konservatif',detail:`Target ${target}. Gunakan beban yang menyisakan sekitar 2–3 repetisi cadangan.`};
    const sets=h.log.filter(x=>x&&x.mode!=='time');
    if(!sets.length)return {kind:'start',label:'Mulai konservatif',detail:`Target ${target}.`};
    const reached=sets.filter(x=>num(x.reps)>=r.hi).length;
    const avgRpe=sets.filter(x=>num(x.rpe)>0).reduce((a,x)=>a+num(x.rpe),0)/(sets.filter(x=>num(x.rpe)>0).length||1);
    const weighted=sets.some(x=>x.mode==='weight'||x.kg!=null);
    if(weighted){
      const prevKg=Math.max(...sets.map(x=>num(x.kg)));
      if(reached>=Math.max(1,r.sets-1)&&prevKg>0&&(!avgRpe||avgRpe<=8)){
        const inc=prevKg<20?1:prevKg<40?2:2.5;
        return {kind:'up',label:`Naikkan beban sekitar +${inc} kg`,detail:`Sesi terakhir mencapai batas atas repetisi pada ${reached}/${r.sets} set. Pertahankan teknik, lalu mulai sekitar ${Math.round((prevKg+inc)*10)/10} kg.` ,kg:Math.round((prevKg+inc)*10)/10};
      }
      if(avgRpe>=9||reached<Math.max(1,r.sets-2))return {kind:'hold',label:'Pertahankan beban',detail:'Belum memenuhi batas atas repetisi dengan nyaman. Kejar target repetisi sebelum menambah beban.'};
      return {kind:'hold',label:'Pertahankan beban',detail:'Coba tambah 1 repetisi pada set yang masih berada di bawah batas atas.'};
    }
    const reps=sets.map(x=>num(x.reps));
    const best=Math.max(...reps);
    if(reached>=Math.max(1,r.sets-1))return {kind:'up',label:'+1–2 repetisi per set',detail:`Sesi terakhir mencapai ${best} repetisi. Tambahkan sedikit repetisi sambil menjaga teknik.`};
    return {kind:'hold',label:'Pertahankan target',detail:'Kejar batas atas repetisi terlebih dahulu sebelum menambah volume.'};
  }

  function weekLabel(){
    const c=cycle();
    if(c.week===4)return {title:'Minggu 4 · Deload',detail:'Kurangi volume agar pemulihan siap untuk siklus berikutnya.',tone:'deload'};
    return {title:`Minggu ${c.week} · Progresi`,detail:c.week===1?'Bangun teknik dan konsistensi.':c.week===2?'Tambahkan repetisi bila target minggu sebelumnya tercapai.':'Dorong progres secara bertahap tanpa mengorbankan teknik.',tone:'progress'};
  }

  function augmentPlan(){
    if(typeof PROG!=='object')return;
    const c=cycle();
    HOME_IDS.forEach(id=>{
      const p=PROG[id];if(!p||!Array.isArray(p.ex))return;
      p.ex=p.ex.map(e=>{
        const base=e._hgBaseTarget||e[1];
        const r=repRange(base);
        if(!r)return e;
        let sets=r.sets;
        if(c.week===4)sets=Math.max(2,Math.ceil(r.sets*0.65));
        const out=[e[0],targetWithSets(base,sets),e[2]];
        out._hgBaseTarget=base;
        return out;
      });
    });
  }

  function progressPanel(){
    const st=state(),w=weekLabel(),c=cycle();
    const home=sessions().filter(isHomeSession),last7=home.filter(s=>{const d=(new Date(todayIso)-new Date(String(s.date)+'T00:00:00'))/86400000;return d>=0&&d<7}).length;
    const next=[];
    const ids=[201,202,203,204,205,206];
    for(const id of ids){const p=PROG[id];if(!p)continue;for(const e of p.ex){const q=progression(e[0],e._hgBaseTarget||e[1]);if(q.kind==='up'){next.push({name:e[0],q});break;}}if(next.length>=3)break;}
    return `<section class="card hg-progress-panel"><div class="hg-progress-head"><div><span class="hg-progress-kicker">PROGRESI OTOMATIS</span><h2>${w.title}</h2><p class="sub">${w.detail}</p></div><div class="hg-cycle-badge">${c.week}/4</div></div><div class="hg-progress-stats"><div><span>SESI 7 HARI</span><b>${last7}/${st.days}</b></div><div><span>LEVEL</span><b>${st.level}</b></div><div><span>SIKLUS</span><b>28 hari</b></div></div>${next.length?`<div class="hg-next-progress"><b>Progress berikutnya</b>${next.map(x=>`<div><span>${esc(x.name)}</span><strong>${esc(x.q.label)}</strong></div>`).join('')}</div>`:`<div class="hg-next-progress"><b>Fokus berikutnya</b><p>Catat beberapa sesi Home Gym terlebih dahulu. Sistem akan membaca performa Anda dan menentukan progres berikutnya.</p></div>`}<p class="hg-progress-foot">Sistem menggunakan performa terakhir, repetisi, beban, dan RPE untuk menentukan apakah beban/repetisi perlu dinaikkan atau dipertahankan.</p></section>`;
  }

  const oldView=view;
  view=function(){
    const html=oldView();
    if(tab==='workout'&&typeof workoutMode!=='undefined'&&workoutMode==='home'){
      return html.replace('<section class="home-workout-section"><div class="home-workout-section-title"><div><h2>Jadwal Home Gym</h2>',progressPanel()+'<section class="home-workout-section"><div class="home-workout-section-title"><div><h2>Jadwal Home Gym</h2>');
    }
    return html;
  };

  const oldStart=startWorkout;
  startWorkout=function(dow){
    oldStart(dow);
    if(!HOME_IDS.has(Number(dow)))return;
    const a=getA();if(!a)return;
    const p=PROG[dow];if(!p)return;
    a.sets.forEach((sets,i)=>{
      const e=p.ex[i],q=progression(e[0],e._hgBaseTarget||e[1]);
      if(q.kg){sets.forEach(s=>{if(!s.done&&!s.w&&exMode(e)==='weight')s.kg=String(q.kg);});}
    });
    a.hgProgress={week:cycle().week,updated:Date.now()};
    ls.set('ap_active',a);
  };

  const oldRender=render;
  render=function(){augmentPlan();oldRender();};
  augmentPlan();
})();
