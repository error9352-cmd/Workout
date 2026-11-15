/* ATHLETIC PHYSIQUE — Unified Recommendation Engine
 * Stage 13: one final recommendation per exercise from progression, evaluation,
 * weekly adaptation, adaptive rotation and profile/program context.
 * Read-only decision layer + next-workout application. Completed history is immutable.
 */
(function(){
  'use strict';
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0};
  const norm=v=>String(v??'').trim().toLowerCase();
  const esc=v=>typeof window.esc==='function'?window.esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const round=(v,d=1)=>Math.round(v*Math.pow(10,d))/Math.pow(10,d);
  const isHome=d=>[201,202,203,204,205,206].includes(Number(d));
  const active=()=>{try{return typeof getA==='function'?getA():ls.get('ap_active',null)}catch(e){return null}};
  const saveActive=a=>{try{ls.set('ap_active',a)}catch(e){}};

  const labels={progression:'Naikkan Progres',maintenance:'Pertahankan & Progres',volume_reduction:'Kurangi Volume',rotation:'Rotasi Gerakan',deload:'Deload / Pemulihan'};
  const priority={deload:100,volume_reduction:90,rotation:80,maintenance:60,progression:50};

  function progression(name){
    try{return window.apExerciseProgression&&window.apExerciseProgression.summarize(name)||null}catch(e){return null}
  }
  function evaluation(mode,name){
    try{
      const ui=window.apUnifiedIntelligence;
      if(ui&&ui.lastEvaluation){
        const ev=ui.lastEvaluation(mode);
        if(ev&&Array.isArray(ev.exercise)){
          const hit=ev.exercise.find(x=>norm(x.name)===norm(name));
          if(hit)return hit;
        }
      }
      const sessions=ui&&ui.sessions?ui.sessions(mode):[];
      for(const s of sessions.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)))){
        const ev=s&&(s.gymEvaluation||s.hgEvaluation);
        const hit=ev&&Array.isArray(ev.exercise)?ev.exercise.find(x=>norm(x.name)===norm(name)):null;
        if(hit)return hit;
      }
    }catch(e){}
    return null;
  }
  function weekly(mode){
    try{
      if(mode==='gym'&&window.apGymIntelligence&&typeof window.apGymIntelligence.weekly==='function')return window.apGymIntelligence.weekly()||null;
      if(mode==='home'&&window.apHomeGymWeeklyAdaptation&&typeof window.apHomeGymWeeklyAdaptation.collect==='function'){
        const m=window.apHomeGymWeeklyAdaptation.collect();
        return window.apHomeGymWeeklyAdaptation.decide?{metrics:m,decision:window.apHomeGymWeeklyAdaptation.decide(m)}:{metrics:m};
      }
    }catch(e){}
    try{return window.apWeeklyCoachUnified&&window.apWeeklyCoachUnified.execute?window.apWeeklyCoachUnified.execute():null}catch(e){return null}
  }
  function context(mode){
    try{return window.apUnifiedIntelligence&&window.apUnifiedIntelligence.context(mode)||{mode,goal:'Muscle Gain',level:'Pemula',frequency:3,equipment:[]}}catch(e){return {mode,goal:'Muscle Gain',level:'Pemula',frequency:3,equipment:[]}}
  }
  function parseTarget(t){
    const m=String(t||'').match(/(\d+)\s*[×x]\s*(\d+)\s*[–-]\s*(\d+)/);
    return m?{sets:+m[1],min:+m[2],max:+m[3]}:null;
  }
  function modeOfExercise(e){try{return typeof exMode==='function'?exMode(e):'weight'}catch(_){return 'weight'}}

  function normalizeAction(a){
    const s=norm(a);
    if(/deload|pemulihan/.test(s))return 'deload';
    if(/volume|kurangi/.test(s))return 'volume_reduction';
    if(/rotasi|rotation/.test(s))return 'rotation';
    if(/naik|progress/.test(s))return 'progression';
    return 'maintenance';
  }
  function decisionFromWeekly(mode){
    const w=weekly(mode),d=w&&w.decision;
    return d?{action:normalizeAction(d.action),title:d.title||labels[normalizeAction(d.action)],reason:d.reason||'',next:d.next||''}:null;
  }
  function decisionFromEvaluation(ev){
    if(!ev)return null;
    const s=norm(ev.status||ev.decision||'');
    if(/too.?hard|berat|hard/.test(s))return {action:'volume_reduction',reason:'Evaluasi sesi menunjukkan gerakan terlalu berat; stabilkan beban atau kurangi volume.'};
    if(/stagnant|stagn/.test(s))return {action:'rotation',reason:'Evaluasi sesi menunjukkan stagnasi; gunakan variasi setara untuk memecah stagnasi.'};
    if(/too.?easy|mudah/.test(s))return {action:'progression',reason:'Evaluasi sesi menunjukkan stimulus terlalu mudah; tingkatkan progres secara bertahap.'};
    return null;
  }
  function decisionFromProgression(q){
    if(!q)return null;
    if(q.stagnant)return {action:'rotation',reason:q.reason||'Progress per gerakan menunjukkan stagnasi.'};
    if(q.action&&/naikkan beban|naikkan repetisi|tambah 1/i.test(q.action))return {action:'progression',reason:q.reason||'Target progres tercapai.'};
    if(q.trend==='down')return {action:'maintenance',reason:q.reason||'Performa terakhir turun; stabilkan sebelum progres.'};
    return {action:'maintenance',reason:q.reason||'Performa stabil; lanjutkan progres bertahap.'};
  }

  function choose(mode,name,target){
    const c=context(mode),q=progression(name),ev=evaluation(mode,name),ed=decisionFromEvaluation(ev),pd=decisionFromProgression(q),wd=decisionFromWeekly(mode);
    const candidates=[];
    if(wd)candidates.push({...wd,source:'weekly-adaptation'});
    if(ed)candidates.push({...ed,source:'session-evaluation'});
    if(pd)candidates.push({...pd,source:'exercise-progression'});

    // Exercise-level safety and explicit session feedback outrank generic weekly goals.
    let chosen=null;
    const hard=candidates.filter(x=>x.action==='deload'||x.action==='volume_reduction'||x.action==='rotation');
    if(hard.length)chosen=hard.sort((a,b)=>priority[b.action]-priority[a.action])[0];
    else if(pd)chosen=pd;
    else if(wd)chosen=wd;
    else chosen={action:'maintenance',reason:'Data belum cukup untuk perubahan agresif; pertahankan target dan teruskan pencatatan.',source:'unified-default'};

    const targetRange=parseTarget(target||q?.target);
    let kg=q?.bestKg||0,reps=q?.bestReps||0;
    const modeKind=q?.last?.mode||modeOfExercise([name,target]);
    let next={kg:0,reps:0};
    if(chosen.action==='progression'){
      if(modeKind==='weight'&&kg>0){
        const inc=kg<20?1:kg<40?2:2.5;
        next.kg=round(kg+inc,1);
        next.reps=targetRange?Math.max(targetRange.min,Math.min(targetRange.max,reps||targetRange.min)):reps;
      }else if(modeKind==='bodyweight'&&reps>0){
        next.reps=targetRange?Math.min(targetRange.max,reps+1):reps+1;
      }else if(reps>0){next.reps=reps+1;}
    }else if(chosen.action==='maintenance'){
      if(modeKind==='weight'&&kg>0)next.kg=kg;
      if(reps>0)next.reps=targetRange?Math.min(targetRange.max,reps):reps;
    }else if(chosen.action==='volume_reduction'){
      if(modeKind==='weight'&&kg>0)next.kg=round(kg*0.9,1);
      if(reps>0)next.reps=targetRange?Math.min(targetRange.max,reps):reps;
    }

    const sourceOrder=[...new Set(candidates.map(x=>x.source).filter(Boolean))];
    return {
      version:1,name,mode,goal:c.goal,level:c.level,frequency:c.frequency,
      action:chosen.action,label:labels[chosen.action],reason:chosen.reason,
      source:chosen.source,sourceOrder,trend:q?.trend||'stable',stagnant:!!q?.stagnant,
      evaluationStatus:ev?.status||null,weeklyAction:wd?.action||null,progressionAction:pd?.action||null,
      target:target||q?.target||null,next,nextStep:chosen.next||'',
      conflicts:sourceOrder.length>1&&new Set(candidates.map(x=>x.action)).size>1,
      resolvedBy:'unified-priority-v1'
    };
  }

  function all(mode){
    const out=[],p=typeof PROG==='object'?PROG:{};
    Object.keys(p).forEach(k=>{
      const d=Number(k),m=isHome(d)?'home':'gym';if(mode&&m!==mode)return;
      const prog=p[k];if(!prog||!Array.isArray(prog.ex))return;
      prog.ex.forEach(e=>{if(e&&e[0])out.push(choose(m,e[0],e[1]))});
    });
    const seen=new Set();return out.filter(x=>{const k=`${x.mode}:${norm(x.name)}`;if(seen.has(k))return false;seen.add(k);return true;});
  }

  function forExercise(name,mode){return choose(mode||((window.apUnifiedIntelligence&&window.apUnifiedIntelligence.modeOf)?window.apUnifiedIntelligence.modeOf({name}):'gym'),name,null)}

  function applyToActive(a){
    if(!a||!Array.isArray(a.sets)||typeof SX!=='function')return [];
    const p=SX(a);if(!p||!Array.isArray(p.ex))return [];
    const changes=[];
    a.sets.forEach((sets,i)=>{
      const e=p.ex[i];if(!e||!Array.isArray(sets))return;
      const r=choose(isHome(a.dow)?'home':'gym',e[0],e[1]);
      if(!r||r.action==='rotation'||r.action==='deload')return;
      sets.forEach(st=>{
        if(!st||st.done||st.w)return;
        let changed=false;
        if(r.next.kg>0&&modeOfExercise(e)==='weight'){const old=num(st.kg);if(Math.abs(old-r.next.kg)>0.001){st.kg=String(r.next.kg);changed=true}}
        if(r.next.reps>0&&modeOfExercise(e)!=='time'){const old=Math.round(num(st.reps));if(old!==r.next.reps){st.reps=String(r.next.reps);changed=true}}
        if(changed)changes.push({exercise:e[0],action:r.action,label:r.label,reason:r.reason,source:r.source,kg:r.next.kg,reps:r.next.reps});
      });
    });
    a.apUnifiedRecommendation={version:1,updatedAt:Date.now(),source:'unified-priority-v1',changes,items:all(isHome(a.dow)?'home':'gym').filter(x=>p.ex.some(e=>norm(e?.[0])===norm(x.name)))};
    saveActive(a);return changes;
  }

  window.apUnifiedRecommendation={version:1,ready:true,choose,forExercise,all,applyToActive,labels,priority,audit:()=>({version:1,ready:true,engine:'unified-priority-v1',gym:all('gym').length,home:all('home').length})};
  document.documentElement.dataset.unifiedRecommendation='v1';

  // Final authority in the start chain: Stage 12/earlier engines may seed values,
  // this layer resolves them from one decision and applies only to the new active session.
  if(typeof window.startWorkout==='function'&&!window.startWorkout.__apStage13UnifiedRecommendation){
    const oldStart=window.startWorkout;
    const wrapped=function(dow){
      const result=oldStart.apply(this,arguments);
      const a=active();
      if(a&&String(a.dow)===String(dow))applyToActive(a);
      return result;
    };
    wrapped.__apStage13UnifiedRecommendation=true;
    window.startWorkout=wrapped;
  }

  // Replace the Stage 12 exercise note with the single resolved decision.
  if(typeof window.view==='function'&&!window.view.__apStage13UnifiedRecommendation){
    const oldView=window.view;
    const wrapped=function(){
      let html=oldView.apply(this,arguments);
      const a=active();
      if(typeof tab!=='undefined'&&tab==='workout'&&a&&window.apUnifiedRecommendation){
        const p=typeof SX==='function'?SX(a):null,idx=Math.min(a.cur||0,(p?.ex?.length||1)-1),e=p?.ex?.[idx];
        if(e){
          const r=choose(isHome(a.dow)?'home':'gym',e[0],e[1]);
          const next=r.next.kg?`${r.next.kg} kg${r.next.reps?` × ${r.next.reps} reps`:''}`:r.next.reps?`${r.next.reps} reps`:r.label;
          const tone=r.action==='progression'?'up':r.action==='rotation'?'rotate':r.action==='volume_reduction'?'down':'stable';
          const panel=`<div class="ap-stage13-unified-note"><div class="ap-stage13-note-head"><span class="ap-stage13-kicker">KEPUTUSAN TERPADU</span><span class="ap-stage13-badge ${tone}">${esc(r.label)}</span></div><strong>${esc(r.name)}</strong><p>${esc(next)}</p><small>${esc(r.reason)}${r.conflicts?' Sumber berbeda ditemukan dan sudah diselaraskan oleh Unified Recommendation Engine.':''}</small></div>`;
          if(html.includes('ap-stage12-progress-note'))html=html.replace(/<div class="ap-stage12-progress-note">[\s\S]*?<\/div>(?=<div class="wk-session-bar">)/,panel);
          else html=html.replace('<div class="wk-session-bar">',panel+'<div class="wk-session-bar">');
        }
      }
      return html;
    };
    wrapped.__apStage13UnifiedRecommendation=true;window.view=wrapped;
  }
})();
