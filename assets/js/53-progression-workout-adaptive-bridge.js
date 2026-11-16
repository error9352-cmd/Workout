/* ATHLETIC PHYSIQUE — Progression → Workout + Adaptive Bridge
 * Stage 12: connects the canonical exercise progression layer to the next workout.
 * It does not create a second history/database and never rewrites completed sessions.
 */
(function(){
  'use strict';
  const ACTIVE_KEY='ap_active';
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0};
  const round=(v,d=1)=>Math.round(v*Math.pow(10,d))/Math.pow(10,d);
  const norm=v=>String(v??'').trim().toLowerCase();
  const getActive=()=>{try{return typeof getA==='function'?getA():ls.get(ACTIVE_KEY,null)}catch(e){return null}};
  const saveActive=a=>{if(a)ls.set(ACTIVE_KEY,a)};
  const isHome=d=>[201,202,203,204,205,206].includes(Number(d));
  const escV=v=>typeof window.esc==='function'?window.esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function progression(name){
    try{return window.apExerciseProgression&&window.apExerciseProgression.summarize(name)||null}catch(e){return null}
  }

  function targetRange(target){
    const m=String(target||'').match(/(\d+)\s*[×x]\s*(\d+)\s*[–-]\s*(\d+)/);
    return m?{sets:+m[1],min:+m[2],max:+m[3]}:null;
  }

  function recommendation(q, exercise){
    if(!q||!q.last)return null;
    const mode=typeof exMode==='function'?exMode(exercise):'weight';
    const last=q.last.bestSet||{};
    const range=targetRange(q.target||exercise?.[1]);
    const out={action:q.action,reason:q.reason,trend:q.trend,stagnant:q.stagnant,source:'canonical-exercise-progression-v1'};

    if(mode==='weight'){
      let kg=num(last.kg), reps=Math.max(0,Math.round(num(last.reps)));
      if(q.action==='Naikkan beban' || q.action==='Naikkan beban kecil'){
        const inc=kg<20?1:kg<40?2:2.5;
        kg=round(kg+inc,1);
        if(range)reps=Math.max(range.min,Math.min(range.max,reps||range.min));
      }else if(q.action==='Tambah 1 repetisi'){
        reps=Math.min(range?.max||reps+1,reps+1);
      }else if(q.action==='Pertahankan / progres kecil'){
        reps=Math.min(range?.max||reps,reps+1);
      }
      if(kg>0)out.kg=kg;if(reps>0)out.reps=reps;
    }else if(mode==='bodyweight'){
      let reps=Math.max(0,Math.round(num(last.reps)));
      if(q.action==='Naikkan repetisi' || q.action==='Tambah 1–2 repetisi per set' || q.action==='Tambah 1–2 repetisi'){
        reps=Math.min(range?.max||reps+1,reps+1);
      }else if(q.action==='Tambah 1 repetisi'){
        reps=Math.min(range?.max||reps+1,reps+1);
      }
      if(reps>0)out.reps=reps;
    }
    return out;
  }

  function applyToActive(a){
    if(!a||!Array.isArray(a.sets)||!a.sets.length||typeof SX!=='function')return null;
    const p=SX(a), changes=[];
    if(!p||!Array.isArray(p.ex))return null;
    a.sets.forEach((sets,i)=>{
      const e=p.ex[i];if(!e||!Array.isArray(sets))return;
      const q=progression(e[0]),r=recommendation(q,e);if(!r)return;
      let changed=false;
      sets.forEach(st=>{
        if(!st||st.done||st.w)return;
        if(r.kg!=null&&typeof exMode==='function'&&exMode(e)==='weight'){
          const old=num(st.kg);if(!old||Math.abs(old-r.kg)>0.001){st.kg=String(r.kg);changed=true;}
        }
        if(r.reps!=null&&typeof exMode==='function'&&exMode(e)!=='time'){
          const old=Math.round(num(st.reps));if(!old||old!==r.reps){st.reps=String(r.reps);changed=true;}
        }
      });
      if(changed)changes.push({exercise:e[0],action:r.action,reason:r.reason,kg:r.kg||0,reps:r.reps||0,trend:r.trend,stagnant:!!r.stagnant});
    });
    a.apProgression={version:1,source:'canonical-exercise-progression-v1',updatedAt:Date.now(),changes};
    saveActive(a);
    return changes;
  }

  function adaptiveContext(mode){
    const rows=[];
    try{
      const all=window.apExerciseProgression&&window.apExerciseProgression.all?window.apExerciseProgression.all():[];
      all.forEach(q=>{
        if(!q||!q.last)return;
        rows.push({name:q.name,trend:q.trend,stagnant:!!q.stagnant,action:q.action,reason:q.reason,mode:q.last.mode});
      });
    }catch(e){}
    return rows.filter(x=>mode==='home'?String(x.mode||'').toLowerCase()==='bodyweight'||String(x.mode||'').toLowerCase()==='weight'||String(x.mode||'').toLowerCase()==='time':true);
  }

  function progressionAwareDecision(name){
    const q=progression(name);
    if(!q)return null;
    if(q.stagnant)return {action:'rotation',status:'stagnant',reason:'Progression per gerakan mendeteksi stagnasi; Adaptive Engine dapat memilih variasi berikutnya.'};
    if(q.trend==='down')return {action:'maintenance',status:'down',reason:'Performa terakhir turun; pertahankan beban dan stabilkan teknik sebelum progres berikutnya.'};
    if(q.trend==='up')return {action:'progression',status:'successful',reason:'Performa per gerakan menunjukkan tren naik; lanjutkan progressive overload bertahap.'};
    return {action:'maintenance',status:'stable',reason:'Performa stabil; pertahankan target dan lanjutkan pencatatan.'};
  }

  function runAdaptive(mode){
    try{
      if(window.apUnifiedAdaptive&&typeof window.apUnifiedAdaptive.run==='function'){
        const items=window.apUnifiedAdaptive.run(mode);
        return Array.isArray(items)?items:[];
      }
    }catch(err){console.warn('[AP Stage12] Adaptive Engine bridge skipped',err)}
    return [];
  }

  function buildBridge(mode,dow){
    const p=typeof PROG==='object'?PROG[dow]:null;
    if(!p||!Array.isArray(p.ex))return {mode,dow,items:[]};
    const items=p.ex.map((e,i)=>{const q=progression(e[0]);return q?{index:i,name:e[0],target:e[1],trend:q.trend,stagnant:!!q.stagnant,action:q.action,reason:q.reason}:null}).filter(Boolean);
    return {version:1,mode,dow,source:'canonical-exercise-progression-v1',items,adaptive:items.map(x=>progressionAwareDecision(x.name)).filter(Boolean)};
  }

  window.apProgressionWorkoutBridge={
    version:1,
    source:'ap_training_model_v1',
    progression,
    recommendation,
    applyToActive,
    adaptiveContext,
    progressionAwareDecision,
    runAdaptive,
    buildBridge,
    audit:()=>({version:1,source:'ap_training_model_v1',ready:!!window.apExerciseProgression,adaptiveReady:!!window.apUnifiedAdaptive})
  };

  // The bridge runs after the existing start-workout chain. This keeps all prior
  // Gym/Home Gym engines intact while making Stage 11 the canonical progression input.
  if(typeof window.startWorkout==='function'&&!window.startWorkout.__apStage12ProgressionBridge){
    const oldStart=window.startWorkout;
    const wrapped=function(dow){
      const mode=isHome(dow)?'home':'gym';
      if(!getActive())runAdaptive(mode);
      const result=oldStart.apply(this,arguments);
      const a=getActive();
      if(a&&String(a.dow)===String(dow)){
        // Stage 13 is the single final authority for active-workout target changes.
        // Keep this bridge read-only at start time when Unified Recommendation is ready;
        // Stage 13 applies the resolved recommendation and Stage 15 validates it.
        const unifiedReady=!!(window.apUnifiedRecommendation&&window.apUnifiedRecommendation.ready);
        const changes=unifiedReady?[]:(applyToActive(a)||[]);
        a.apProgressionBridge=buildBridge(mode,dow);
        a.apProgressionBridge.applied=changes;
        a.apProgressionBridge.authority=unifiedReady?'unified-recommendation':'canonical-exercise-progression';
        saveActive(a);
      }
      return result;
    };
    wrapped.__apStage12ProgressionBridge=true;
    window.startWorkout=wrapped;
  }

  // Add a compact progression status to the active workout header without replacing
  // the existing workout renderer.
  const nativeView=window.view;
  if(typeof nativeView==='function'&&!nativeView.__apStage12ProgressionView){
    const wrappedView=function(){
      const html=nativeView.apply(this,arguments);
      if(typeof tab==='undefined'||tab!=='workout'||!getActive()||!window.apExerciseProgression)return html;
      const a=getActive(),p=typeof SX==='function'?SX(a):null;
      if(!p||!p.ex)return html;
      const i=Math.min(a.cur||0,p.ex.length-1),q=progression(p.ex[i]?.[0]);
      if(!q)return html;
      const rec=recommendation(q,p.ex[i]);
      const badge=q.trend==='up'?'Naik':q.trend==='down'?'Turun':q.stagnant?'Stagnan':'Stabil';
      const text=rec?.kg?`Berikutnya sekitar ${rec.kg} kg${rec.reps?` × ${rec.reps} reps`:''}`:rec?.reps?`Berikutnya ${rec.reps} reps`:q.action;
      const panel=`<div class="ap-stage12-progress-note"><span class="ap-stage12-kicker">PROGRESI GERAKAN</span><strong>${escV(q.name)}</strong><span class="ap-stage12-status ${q.trend==='up'?'up':q.trend==='down'?'down':'stable'}">${escV(badge)}</span><p>${escV(text)}</p><small>${escV(q.reason)}</small></div>`;
      return html.replace('<div class="wk-session-bar">',panel+'<div class="wk-session-bar">');
    };
    wrappedView.__apStage12ProgressionView=true;
    window.view=wrappedView;
  }

  document.documentElement.dataset.progressionWorkoutAdaptive='v1';
})();
