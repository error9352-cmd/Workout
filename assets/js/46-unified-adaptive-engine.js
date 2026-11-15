/* ATHLETIC PHYSIQUE — Unified Adaptive Engine v1
 * Stage 3: shared adaptive decisions + real exercise rotation for Gym/Home Gym.
 * Uses canonical completed sessions, preserves history, and applies substitutions
 * only to the next program instance. The underlying PROG structure remains intact.
 */
(function(){
  'use strict';
  const PLAN_KEY='ap_unified_adaptive_plan_v1';
  const LOG_KEY='ap_unified_adaptive_log_v1';
  const HOME_RE=/home\s*gym|home\s*workout/i;
  const ROTATE_STATUS=new Set(['stagnant','too_hard']);
  const GOALS={
    'Muscle Gain':{prefer:['dumbbell','cable','machine','bench'],rep:[8,12]},
    'Strength':{prefer:['barbell','rack','bench','machine'],rep:[4,8]},
    'Fat Loss':{prefer:['machine','cable','bodyweight','lunge','step'],rep:[10,15]},
    'Athletic Performance':{prefer:['dumbbell','unilateral','single','lunge','step','cable'],rep:[6,10]}
  };
  const HOME={
    push:[['Push Up','bodyweight'],['Wide Push Up','bodyweight'],['Diamond Push Up','bodyweight'],['Incline Push Up','bench'],['Decline Push Up','bench'],['Dumbbell Bench Press','dumbbell'],['Incline Dumbbell Press','dumbbell+bench'],['Dumbbell Shoulder Press','dumbbell'],['Pike Push Up','bodyweight'],['Band Overhead Triceps Extension','band'],['Close Grip Push Up','bodyweight'],['Band Lateral Raise','band'],['Dumbbell Lateral Raise','dumbbell']],
    pull:[['Resistance Band Row','band'],['Dumbbell Bent Over Row','dumbbell'],['One Arm Dumbbell Row','dumbbell'],['Pull Up','pullup'],['Superman','bodyweight'],['Reverse Snow Angel','bodyweight'],['Dumbbell Biceps Curl','dumbbell'],['Hammer Curl','dumbbell'],['Resistance Band Biceps Curl','band'],['Cross-Body Hammer Curl','dumbbell']],
    legs:[['Bodyweight Squat','bodyweight'],['Goblet Squat','dumbbell'],['Bulgarian Split Squat','bodyweight'],['Reverse Lunge','bodyweight'],['Walking Lunge','bodyweight'],['Dumbbell Romanian Deadlift','dumbbell'],['Single-Leg Romanian Deadlift','dumbbell'],['Glute Bridge','bodyweight'],['Single Leg Glute Bridge','bodyweight'],['Step Up','bench'],['Wall Sit','bodyweight'],['Standing Calf Raise','bodyweight']],
    core:[['Plank','bodyweight'],['Dead Bug','bodyweight'],['Bird Dog','bodyweight'],['Reverse Crunch','bodyweight'],['Hanging Leg Raise','pullup'],['Mountain Climber','bodyweight'],['Side Plank','bodyweight'],['Bicycle Crunch','bodyweight'],['Hollow Body Hold','bodyweight']]
  };
  const EQ={'bodyweight':'bodyweight','dumbbell':'dumbbell','band':'band','bench':'bench','pullup':'pullup','dumbbell+bench':'dumbbell'};
  const norm=v=>String(v??'').trim().toLowerCase();
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0};
  const ui=()=>window.apUnifiedIntelligence;
  const ctx=mode=>ui?ui.context(mode):{mode,goal:'Muscle Gain',level:'Pemula',frequency:3,equipment:mode==='home'?['bodyweight']:['gym']};
  const sessions=mode=>ui?ui.sessions(mode):(window.apTraining?window.apTraining.all():[]);
  const programs=mode=>{const ids=mode==='home'?[201,202,203,204,205,206]:Object.keys(PROG||{}).map(Number).filter(k=>k<7);return ids.map(id=>({id,p:PROG&&PROG[id]})).filter(x=>x.p&&Array.isArray(x.p.ex));};
  const esc=v=>typeof window.esc==='function'?window.esc(String(v)):String(v);

  function focusOf(p){
    const s=norm((p&&p.f||'')+' '+(p&&p.n||''));
    if(/cardio|hiit/.test(s))return 'cardio';
    if(/push|dada/.test(s))return 'push';
    if(/pull|punggung/.test(s))return 'pull';
    if(/leg|lower|kaki/.test(s))return 'legs';
    if(/upper|bahu|lengan/.test(s))return 'upper';
    if(/core|abs/.test(s))return 'core';
    if(/full/.test(s))return 'full';
    return 'full';
  }
  function kind(name){
    const n=norm(name);
    if(/plank|dead bug|bird dog|crunch|mountain climber|hollow|leg raise|pallof|ab wheel/.test(n))return 'core';
    if(/squat|lunge|deadlift|glute|step up|calf|wall sit|leg press|leg curl|leg extension|hip thrust/.test(n))return 'legs';
    if(/row|pulldown|pull up|chin up|curl|hammer|snow angel|superman|pullover|back extension/.test(n))return 'pull';
    if(/shoulder|lateral raise|face pull|rear delt|shrug|overhead press|arnold/.test(n))return 'push';
    return 'push';
  }
  function gymGroup(name){
    const n=norm(name);
    if(/plank|crunch|leg raise|pallof|ab wheel|dead bug|russian twist|bicycle|mountain climber/.test(n))return 'core';
    if(/squat|leg press|leg extension|leg curl|lunge|calf|glute|hip thrust|deadlift|step up/.test(n))return 'legs';
    if(/row|pulldown|pull up|chin up|pullover|back extension|deadlift/.test(n))return 'back';
    if(/shoulder|lateral raise|face pull|rear delt|shrug|upright|arnold|overhead press/.test(n))return 'shoulders';
    if(/curl|triceps|pushdown|skull|preacher|hammer|extension|dip/.test(n))return 'arms';
    if(/treadmill|elliptical|bike|sepeda|rowing|stair|lompat|jalan cepat/.test(n))return 'cardio';
    return 'chest';
  }
  function focusMatchHome(k,f){return f==='full'?['push','pull','legs','core'].includes(k):f==='upper'?['push','pull','core'].includes(k):k===f;}
  function focusMatchGym(g,f){return f==='full'?['chest','back','legs','shoulders','arms','core'].includes(g):f==='upper'?['chest','back','shoulders','arms','core'].includes(g):f==='push'?['chest','shoulders','arms'].includes(g):f==='pull'?['back','arms'].includes(g):g===f;}

  function lastEvaluationFor(mode,name){
    const n=norm(name), out=[];
    for(const s of sessions(mode).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)))){
      const ev=s&& (s.gymEvaluation||s.hgEvaluation);if(!ev||!Array.isArray(ev.exercise))continue;
      const hit=ev.exercise.find(x=>norm(x.name)===n);if(hit){out.push(hit);if(out.length>=3)break;}
    }
    if(out.length)return out[0];
    const key=mode==='home'?'ap_home_gym_session_eval_v1':'ap_gym_session_eval_v1';
    try{const map=ls.get(key,{}),v=map[name];return v||null}catch(e){return null}
  }
  function usage(mode,name){
    const n=norm(name),h=sessions(mode).filter(s=>(s.exercises||[]).some(e=>norm(e.name)===n)||s.log&&Object.keys(s.log).some(k=>norm(k)===n));
    return {count:h.length,last:h[0]||null};
  }
  function equipmentOk(name,c){
    const n=norm(name);if(c.mode!=='home')return true;
    if(/dumbbell/.test(n)&&!c.equipment.includes('dumbbell'))return false;
    if(/band|resistance/.test(n)&&!c.equipment.includes('band'))return false;
    if(/pull up|hanging/.test(n)&&!c.equipment.includes('pullup'))return false;
    if(/bench|incline|decline|step up/.test(n)&&!c.equipment.includes('bench'))return false;
    return true;
  }
  function homeCandidates(f,c){
    let arr=[];if(f==='full')arr=[...HOME.legs,...HOME.push,...HOME.pull,...HOME.core];else if(f==='upper')arr=[...HOME.push,...HOME.pull,...HOME.core];else arr=[...(HOME[f]||HOME.core)];return arr.filter(x=>equipmentOk(x[0],c));}
  function gymCandidates(){
    const a=Array.isArray(window.apALL)?window.apALL:[];
    return a.map(x=>typeof x==='string'?x:x&&x[0]).filter(Boolean);
  }
  function homeCandidatesFromLibrary(f,c){
    const lib=Array.isArray(window.apALL)?window.apALL:[];
    const names=lib.map(x=>typeof x==='string'?x:x&&x[0]).filter(Boolean);
    const filtered=names.filter(n=>equipmentOk(n,c));
    return filtered.length?filtered:homeCandidates(f,c).map(x=>x[0]);
  }
  function scoreCandidate(mode,name,focus,c,oldName,used){
    if(norm(name)===norm(oldName)||used.has(norm(name)))return -999;
    const k=mode==='home'?kind(name):gymGroup(name);let s=1;
    if(mode==='home'&&!focusMatchHome(k,focus))return -999;
    if(mode==='gym'&&!focusMatchGym(k,focus))return -999;
    if(mode==='home'&&k===focus)s+=3;if(mode==='gym'&&((focus==='full'&&['chest','back','legs'].includes(k))||k===focus))s+=2.6;
    const g=GOALS[c.goal]||GOALS['Muscle Gain'],n=norm(name);
    if(g.prefer.some(x=>n.includes(x)))s+=0.6;
    if(c.level==='Pemula'&&/deadlift|barbell squat|front squat/.test(n))s-=0.4;
    if(c.goal==='Athletic Performance'&&/single|unilateral|bulgarian|lunge|step up|one arm/.test(n))s+=0.7;
    if(c.goal==='Fat Loss'&&/lunge|step up|mountain climber|treadmill|row/.test(n))s+=0.4;
    const u=usage(mode,name);s-=Math.min(2.4,u.count*.55);if(u.last)s+=Math.min(1.2,14/Math.max(14,Math.round((Date.now()-new Date(String(u.last.date)+'T00:00:00').getTime())/86400000)||14));
    return s;
  }
  function decisionFor(mode,name){
    const ev=lastEvaluationFor(mode,name);if(ev&&ROTATE_STATUS.has(ev.status))return {action:'rotation',status:ev.status,reason:ev.status==='stagnant'?'Memecah stagnasi dengan variasi gerakan.':'Mengurangi beban gerakan yang terlalu berat dengan variasi yang setara.'};
    const p=ui&&ui.performance?ui.performance(mode,name):null;
    if(p&&p.trend==='up')return {action:'progression',status:'successful',reason:'Performa terakhir menunjukkan tren naik.'};
    return {action:'maintenance',status:ev&&ev.status||'successful',reason:'Pertahankan gerakan dan lanjutkan progres bertahap.'};
  }
  function hashPrograms(mode){return JSON.stringify(programs(mode).map(x=>[x.id,x.p.n,x.p.f,(x.p.ex||[]).map(e=>e[0])]));}
  function plan(){try{return ls.get(PLAN_KEY,{version:1,items:[],updatedAt:0})||{version:1,items:[]}}catch(e){return {version:1,items:[]}}}
  function savePlan(p){p.updatedAt=Date.now();ls.set(PLAN_KEY,p);}
  function chooseRotation(mode,id,index,oldName,p,used){
    const c=ctx(mode),focus=focusOf(p),pool=mode==='home'?homeCandidatesFromLibrary(focus,c):gymCandidates();const decision=decisionFor(mode,oldName);let best=null,bs=-Infinity;
    pool.forEach(name=>{const n=typeof name==='string'?name:name&&name[0];if(!n)return;const sc=scoreCandidate(mode,n,focus,c,oldName,used);if(sc>bs){bs=sc;best=n;}});
    if(!best||bs<0)return null;
    return {mode,programId:id,exerciseIndex:index,from:oldName,to:best,reason:decision.reason,status:decision.status,createdAt:todayIso,sourceHash:hashPrograms(mode)};
  }
  function build(mode){
    const p=plan(),currentHash=hashPrograms(mode),items=p.items.filter(x=>x.mode!==mode||x.sourceHash===currentHash||x.createdAt===todayIso);const existing=new Set(items.filter(x=>x.mode===mode).map(x=>`${x.programId}:${x.exerciseIndex}:${norm(x.from)}`));const used=new Set();
    programs(mode).forEach(({id,p:prog})=>{(prog.ex||[]).forEach((e,i)=>{const d=decisionFor(mode,e[0]);if(d.action!=='rotation')return;const key=`${id}:${i}:${norm(e[0])}`;if(existing.has(key))return;const r=chooseRotation(mode,id,i,e[0],prog,used);if(r){items.push(r);used.add(norm(r.to));}})});
    const cleaned=items.filter(x=>x.mode!==mode||x.createdAt===todayIso||x.sourceHash===currentHash);p.items=cleaned.slice(-80);savePlan(p);return p;
  }
  function apply(mode){
    if(typeof PROG!=='object')return [];
    const p=build(mode),applied=[];
    p.items.filter(x=>x.mode===mode).forEach(x=>{const prog=PROG[x.programId];if(!prog||!prog.ex||!prog.ex[x.exerciseIndex])return;const cur=prog.ex[x.exerciseIndex];if(norm(cur[0])===norm(x.to))return;const next=[x.to,cur[1],cur[2]];next._apAdaptive={from:x.from,to:x.to,status:x.status,reason:x.reason,createdAt:x.createdAt};prog.ex[x.exerciseIndex]=next;applied.push(x);});
    if(applied.length&&typeof saveProg==='function')saveProg();
    return applied;
  }
  function audit(){
    const p=plan();return {version:1,plans:p.items||[],lastUpdated:p.updatedAt||0};
  }
  function logChanges(items){if(!items.length)return;const old=ls.get(LOG_KEY,[]);const merged=old.concat(items.map(x=>({...x,loggedAt:Date.now()}))).slice(-120);ls.set(LOG_KEY,merged);}
  function run(mode){const items=apply(mode);logChanges(items);return items;}

  function expose(){
    window.apUnifiedAdaptive={version:1,plan,build,apply,run,decision:decisionFor,audit,ready:true};
    document.documentElement.dataset.unifiedAdaptive='v1';
  }
  expose();

  // Apply before the next program is rendered or started. Completed sessions are
  // never modified because rotation only touches future PROG entries.
  if(!getA()){
    if(typeof workoutMode!=='undefined')run(workoutMode==='home'?'home':'gym');
  }
  if(typeof render==='function'){
    const oldRender=render;
    render=function(){if(!getA()&&typeof workoutMode!=='undefined')run(workoutMode==='home'?'home':'gym');oldRender();};
  }
  if(typeof startWorkout==='function'){
    const oldStart=startWorkout;
    startWorkout=function(dow){if(!getA()&&typeof workoutMode!=='undefined')run(workoutMode==='home'?'home':'gym');oldStart(dow);};
  }
})();
