/* ATHLETIC PHYSIQUE — Recommendation Quality & Safety Guardrails
 * Stage 15: validates final recommendations before they become active workout inputs.
 * Additive layer. It does not rewrite completed history or create a second data source.
 */
(function(){
  'use strict';
  const VERSION='recommendation-guardrails-v1';
  const HOME=[201,202,203,204,205,206];
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0};
  const round=(v,d=1)=>Math.round(v*Math.pow(10,d))/Math.pow(10,d);
  const norm=v=>String(v??'').trim().toLowerCase();
  const isHome=d=>HOME.includes(Number(d));
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  const parseTarget=t=>{const m=String(t||'').match(/(\d+)\s*[×x]\s*(\d+)\s*[–-]\s*(\d+)/);return m?{sets:+m[1],min:+m[2],max:+m[3]}:null};
  const modeOf=e=>{try{return typeof exMode==='function'?exMode(e):'weight'}catch(_){return 'weight'}};
  const targetFor=e=>parseTarget(e&&e[1]);

  function limits(e,rec,previous){
    const mode=modeOf(e), t=targetFor(e), prevKg=num(previous?.kg), prevReps=Math.round(num(previous?.reps));
    if(mode==='weight'){
      const base=prevKg>0?prevKg:num(rec?.kg);
      const maxIncrease=base>0?Math.min(2.5,round(base*0.10,1)):2.5;
      const minKg=0;
      const maxKg=base>0?round(base+maxIncrease,1):num(rec?.kg)>0?round(num(rec.kg),1):0;
      return {mode,minKg,maxKg,minReps:0,maxReps:t?t.max:Math.max(1,prevReps+2)};
    }
    if(mode==='bodyweight'){
      return {mode,minKg:0,maxKg:0,minReps:0,maxReps:t?t.max:Math.max(1,prevReps+2)};
    }
    const targetMax=t?t.max:Math.max(1,Math.round(num(previous?.value||previous?.time))+30);
    return {mode,minKg:0,maxKg:0,minReps:0,maxReps:targetMax};
  }

  function validateRecommendation(mode,name,target,rec,exercise,previous){
    const r=rec||{},e=exercise||[name,target],l=limits(e,r,previous);
    const issues=[];
    const out={...r,guardrailVersion:VERSION,guardrailStatus:'approved',guardrailIssues:[],next:{...(r.next||{})}};
    if(!['progression','maintenance','volume_reduction','rotation','deload'].includes(out.action)){
      issues.push('Keputusan tidak dikenal; dikembalikan ke Pertahankan & Progres.');
      out.action='maintenance';out.label='Pertahankan & Progres';
    }
    if(out.action==='progression' && l.mode==='weight' && num(out.next.kg)>0){
      const original=num(out.next.kg),safe=clamp(original,l.minKg,l.maxKg);
      if(Math.abs(original-safe)>0.001){out.next.kg=round(safe,1);issues.push('Kenaikan beban melebihi batas progres aman per sesi.');}
    }
    if(l.mode==='weight' && num(out.next.kg)<0){out.next.kg=0;issues.push('Beban negatif dikoreksi menjadi nol.');}
    if(l.mode!=='time' && num(out.next.reps)>0){
      const original=Math.round(num(out.next.reps)),safe=clamp(original,l.minReps,l.maxReps);
      if(original!==safe){out.next.reps=safe;issues.push('Repetisi dibatasi agar tidak melewati target yang tersedia.');}
    }
    if(out.action==='volume_reduction' && l.mode==='weight' && num(previous?.kg)>0){
      const floor=round(num(previous.kg)*0.75,1);
      if(num(out.next.kg)<floor){out.next.kg=floor;issues.push('Pengurangan beban dibatasi agar tidak terlalu drastis.');}
    }
    if(out.action==='deload'){
      if(l.mode==='weight' && num(previous?.kg)>0 && num(out.next.kg)>0){
        const floor=round(num(previous.kg)*0.70,1),ceil=round(num(previous.kg)*0.90,1);
        out.next.kg=round(clamp(num(out.next.kg),floor,ceil),1);
      }
    }
    out.guardrailIssues=issues;
    out.guardrailStatus=issues.length?'adjusted':'approved';
    return out;
  }

  function active(){try{return typeof getA==='function'?getA():null}catch(e){return null}}
  function program(a){try{return typeof SX==='function'?SX(a):null}catch(e){return null}}
  function previousFor(name){
    try{const p=typeof prev==='function'?prev(name):null;return Array.isArray(p)&&p.length?p[p.length-1]:null}catch(e){return null}
  }

  function sanitizeActive(a){
    if(!a||!Array.isArray(a.sets))return {changed:0,issues:[]};
    const p=program(a);if(!p||!Array.isArray(p.ex))return {changed:0,issues:[]};
    let changed=0;const issues=[];
    a.sets.forEach((sets,i)=>{
      const e=p.ex[i];if(!e||!Array.isArray(sets))return;
      const mode=modeOf(e), prevSet=previousFor(e[0]);
      const rec=window.apUnifiedRecommendation&&typeof window.apUnifiedRecommendation.choose==='function'
        ?window.apUnifiedRecommendation.choose(isHome(a.dow)?'home':'gym',e[0],e[1]):null;
      const safe=validateRecommendation(isHome(a.dow)?'home':'gym',e[0],e[1],rec,e,prevSet);
      const target=targetFor(e);
      sets.forEach(st=>{
        if(!st||st.done||st.w)return;
        // Only sanitize values that were seeded by the recommendation layer.
        // User-entered values remain untouched; this checkpoint must never fight manual logging.
        const hasSeededWeight=mode==='weight'&&String(st.kg??'').trim()!=='';
        const hasSeededReps=mode!=='time'&&String(st.reps??'').trim()!=='';
        const hasSeededTime=mode==='time'&&String(st.value??'').trim()!=='';
        if(!hasSeededWeight&&!hasSeededReps&&!hasSeededTime)return;
        if(mode==='weight' && safe.next.kg>0){
          const old=num(st.kg),next=round(clamp(old,0,safe.next.kg),1);
          if(Math.abs(old-next)>0.001){st.kg=String(next);changed++;issues.push(e[0]+': beban dikoreksi');}
        }
        if(mode!=='time' && safe.next.reps>0){
          const max=target?target.max:safe.next.reps;
          const old=Math.round(num(st.reps)),next=clamp(old,1,max);
          if(old!==next){st.reps=String(next);changed++;issues.push(e[0]+': repetisi dikoreksi');}
        }
        if(mode==='time' && safe.next.reps>0){
          const max=target?target.max:safe.next.reps;
          const old=num(st.value),next=clamp(old,1,max);
          if(Math.abs(old-next)>0.001){st.value=String(next);changed++;issues.push(e[0]+': durasi dikoreksi');}
        }
      });
      if(safe.guardrailIssues.length)issues.push(...safe.guardrailIssues.map(x=>e[0]+': '+x));
    });
    const unique=[...new Set(issues)];
    a.apRecommendationGuardrails={version:1,engine:VERSION,status:changed?'adjusted':'approved',issues:unique,checkedAt:Date.now()};
    return {changed,issues:unique};
  }

  function validateAll(mode){
    const list=window.apUnifiedRecommendation&&typeof window.apUnifiedRecommendation.all==='function'?window.apUnifiedRecommendation.all(mode):[];
    return list.map(r=>validateRecommendation(r.mode,r.name,r.target,r,null,null));
  }

  window.apRecommendationGuardrails={version:1,ready:true,engine:VERSION,validateRecommendation,sanitizeActive,validateAll,audit:()=>({version:1,ready:true,engine:VERSION,unifiedReady:!!window.apUnifiedRecommendation,traceReady:!!window.apRecommendationDecisionTrace})};
  document.documentElement.dataset.recommendationGuardrails='v1';

  // Final safety checkpoint after the existing start chain has produced the active session.
  if(typeof window.startWorkout==='function'&&!window.startWorkout.__apStage15Guardrails){
    const oldStart=window.startWorkout;
    const wrapped=function(){
      const result=oldStart.apply(this,arguments);
      const a=active();
      if(a){
        const check=sanitizeActive(a);
        if(check.changed){
          ls.set('ap_active',a);
          if(typeof render==='function')render();
        }
        if(check.issues.length && typeof toast==='function')toast('Rekomendasi diperiksa dan disesuaikan dengan batas aman.');
      }
      return result;
    };
    wrapped.__apStage15Guardrails=true;
    window.startWorkout=wrapped;
  }

  // Surface the checkpoint in the active workout without changing the core workout UI.
  if(typeof window.view==='function'&&!window.view.__apStage15Guardrails){
    const oldView=window.view;
    const wrappedView=function(){
      let html=oldView.apply(this,arguments);
      const a=active(),g=a&&a.apRecommendationGuardrails;
      if(a&&g&&typeof tab!=='undefined'&&tab==='workout'){
        const msg=g.status==='adjusted'
          ?'Rekomendasi disesuaikan agar tetap berada dalam batas aman.'
          :'Rekomendasi lolos pemeriksaan batas aman.';
        const panel=`<div class="ap-stage15-safety ${g.status}"><b>PEMERIKSAAN KEAMANAN</b><small>${msg}</small></div>`;
        if(!html.includes('ap-stage15-safety'))html=html.replace('<div class="wk-session-bar">',panel+'<div class="wk-session-bar">');
      }
      return html;
    };
    wrappedView.__apStage15Guardrails=true;window.view=wrappedView;
  }

  // Public validation is also applied when another module explicitly applies a recommendation.
  if(window.apUnifiedRecommendation&&typeof window.apUnifiedRecommendation.applyToActive==='function'&&!window.apUnifiedRecommendation.applyToActive.__apStage15Guardrails){
    const oldApply=window.apUnifiedRecommendation.applyToActive;
    window.apUnifiedRecommendation.applyToActive=function(a){
      const r=oldApply(a);
      const current=active()||a;
      const check=sanitizeActive(current);
      if(check.changed){ls.set('ap_active',current);}
      return r;
    };
    window.apUnifiedRecommendation.applyToActive.__apStage15Guardrails=true;
  }
})();
