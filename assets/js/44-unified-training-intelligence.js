/* ATHLETIC PHYSIQUE — Unified Training Intelligence Foundation v1
 * Stage 1: shared context + canonical selectors for Gym and Home Gym.
 * This layer does not change program selection or adaptation decisions yet.
 */
(function(){
  'use strict';
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0;};
  const clean=v=>String(v??'').trim();
  const HOME_RE=/home\s*gym|home\s*workout/i;
  const GOALS=['Muscle Gain','Strength','Fat Loss','Athletic Performance'];
  const DECISIONS=['progression','maintenance','volume_reduction','rotation','deload'];
  function canonical(){try{return window.apTraining&&typeof window.apTraining.all==='function'?window.apTraining.all():[]}catch(e){return []}}
  function modeOf(s){return HOME_RE.test(clean(s&&s.name))?'home':'gym';}
  function sessions(mode){const all=canonical();if(!mode||mode==='all')return all;return all.filter(s=>modeOf(s)===mode);}
  function profileRaw(){try{return typeof prof==='function'?(prof()||{}):ls.get('ap_profile',{})||{}}catch(e){return {}}}
  function homePlan(){try{return ls.get('ap_home_gym_plan_v3',{})||{}}catch(e){return {}}}
  function homeGoal(){try{return ls.get('ap_home_gym_goal_v1','Muscle Gain')}catch(e){return 'Muscle Gain'}}
  function normalizeGoal(v){const g=clean(v);return GOALS.includes(g)?g:'Muscle Gain';}
  function context(mode){
    const p=profileRaw(),hp=homePlan(),home=mode==='home';
    const level=clean(home?hp.level:(p.level||ls.get('ap_recv',{}).l||'Pemula'))||'Pemula';
    const frequency=Math.max(0,num(home?(hp.days??p.freq??3):(p.freq??3)));
    const equipment=home?(Array.isArray(hp.equipment)&&hp.equipment.length?hp.equipment:['bodyweight']):['gym'];
    return {mode,goal:normalizeGoal(home?homeGoal():p.goal),level,frequency,equipment,source:'unified-v1'};
  }
  function sorted(mode){return sessions(mode).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))||String(b.id).localeCompare(String(a.id)));}
  function last(mode){return sorted(mode)[0]||null;}
  function recent(mode,limit=5){return sorted(mode).slice(0,limit);}
  function exerciseHistory(mode,name,limit=5){const n=clean(name).toLowerCase(),out=[];for(const s of sorted(mode)){if(out.length>=limit)break;const e=(s.exercises||[]).find(x=>clean(x.name).toLowerCase()===n);if(e)out.push({session:s,exercise:e});}return out;}
  function range(mode,start,end){return sessions(mode).filter(s=>(!start||s.date>=start)&&(!end||s.date<=end));}
  function weekWindow(end=todayIso){const d=new Date(String(end)+'T00:00:00');d.setDate(d.getDate()-6);return {start:d.toISOString().slice(0,10),end:String(end)};}
  function stats(mode,start,end){
    const rows=range(mode,start,end),rpes=[];
    const sets=rows.reduce((n,s)=>n+(s.exercises||[]).reduce((m,e)=>m+(e.metrics?.workingSets||0),0),0);
    const volume=rows.reduce((n,s)=>n+num(s.metrics?.volumeKg??s.volume),0);
    rows.forEach(s=>(s.exercises||[]).forEach(e=>(e.sets||[]).forEach(x=>{if(x.done&&!x.warmup&&num(x.rpe))rpes.push(num(x.rpe));})));
    return {sessions:rows.length,sets,volumeKg:Math.round(volume*100)/100,avgRpe:rpes.length?Math.round(rpes.reduce((a,b)=>a+b,0)/rpes.length*10)/10:0};
  }
  function weeklyStats(mode,end=todayIso){
    const w=weekWindow(end),cur=stats(mode,w.start,w.end);const d=new Date(w.start+'T00:00:00');d.setDate(d.getDate()-1);const prevEnd=d.toISOString().slice(0,10);const pd=new Date(prevEnd+'T00:00:00');pd.setDate(pd.getDate()-6);const prev=stats(mode,pd.toISOString().slice(0,10),prevEnd);const c=context(mode),target=c.frequency||0;
    return {...cur,previous:prev,week:w,target,adherence:target?Math.min(1,cur.sessions/target):1,volumeDelta:prev.volumeKg?Math.round((cur.volumeKg-prev.volumeKg)/prev.volumeKg*100):0};
  }
  function performance(mode,name){
    const h=exerciseHistory(mode,name,3);if(!h.length)return {status:'new',history:[],last:null,previous:null,trend:'new'};
    const metric=x=>{const m=x.exercise?.metrics||{};return {reps:num(m.bestReps),kg:num(m.bestKg),rpe:num(m.avgRpe),volume:num(m.volumeKg)}};
    const lastM=metric(h[0]),prevM=h[1]?metric(h[1]):null;let trend='stable';if(prevM){if(lastM.kg>prevM.kg||lastM.reps>prevM.reps)trend='up';else if(lastM.kg<prevM.kg||lastM.reps<prevM.reps)trend='down';}
    return {status:'tracked',history:h,last:lastM,previous:prevM,trend};
  }
  function lastEvaluation(mode){
    const s=last(mode);if(!s)return null;if(s.gymEvaluation||s.hgEvaluation)return s.gymEvaluation||s.hgEvaluation;
    const key=mode==='home'?'ap_home_gym_last_evaluation_v1':'ap_gym_last_evaluation_v1';try{const v=ls.get(key,null);return v&&String(v.date)===String(s.date)?v:null}catch(e){return null}
  }
  function normalizeDecision(action){const a=clean(action).toLowerCase();return DECISIONS.includes(a)?a:'maintenance';}
  function snapshot(mode){return {context:context(mode),lastSession:last(mode),recentSessions:recent(mode,5),week:weeklyStats(mode),lastEvaluation:lastEvaluation(mode)}}
  window.apUnifiedIntelligence={version:1,modes:['gym','home'],goals:GOALS,decisions:DECISIONS,modeOf,sessions,recent,last,exerciseHistory,range,context,stats,weeklyStats,performance,lastEvaluation,normalizeDecision,snapshot,ready:true};
  document.documentElement.dataset.unifiedIntelligence='v1';
})();
