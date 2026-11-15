/* ATHLETIC PHYSIQUE — Unified Training Data Model
 * Single source of truth for completed training sessions.
 * Legacy ap_sessions remains compatible through a derived projection.
 */
(function(){
  'use strict';
  const KEY='ap_training_model_v1';
  const MODEL_VERSION=1;
  const originalGet=ls.get.bind(ls);
  const originalSet=ls.set.bind(ls);
  let hydrating=false;

  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0;};
  const clean=v=>String(v??'').trim();
  const isoDate=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?clean(v):d.toISOString().slice(0,10);};
  const isHomeName=n=>/home\s*gym|home\s*workout/i.test(clean(n));
  const muscleInfo=n=>{
    try{return typeof exInfo==='function'?(exInfo(n)||null):null}catch(e){return null}
  };

  function inferProgram(s){
    const explicit=s.programContext||s.program||null;
    if(explicit&&typeof explicit==='object')return {
      id:explicit.id??null,name:clean(explicit.name||s.name),type:explicit.type||((isHomeName(s.name))?'home':'gym'),
      level:explicit.level||null,frequency:num(explicit.frequency||explicit.days)||null,goal:explicit.goal||null,equipment:Array.isArray(explicit.equipment)?explicit.equipment:[]
    };
    const home=isHomeName(s.name);
    const hp=originalGet('ap_home_gym_plan_v3',null);
    const prof=originalGet('ap_profile',{freq:'',goal:''})||{};
    if(home)return {id:'home-gym',name:clean(s.name)||'Home Gym',type:'home',level:hp?.level||null,frequency:num(hp?.days||prof.freq)||null,goal:hp?.goal||prof.goal||null,equipment:Array.isArray(hp?.equipment)?hp.equipment:[]};
    return {id:'gym',name:clean(s.name)||'Gym Workout',type:'gym',level:null,frequency:num(prof.freq)||null,goal:prof.goal||null,equipment:[]};
  }

  function normalizeExercise(name,rows){
    const info=muscleInfo(name),sets=(Array.isArray(rows)?rows:[]).map(r=>({
      kg:num(r.kg)||0,reps:Math.max(0,Math.round(num(r.reps))),value:num(r.value??r.time)||0,
      rpe:num(r.rpe)||0,done:r.done===false?false:true,warmup:!!(r.w||r.warmup),mode:r.mode||null,unit:r.unit||null
    }));
    const work=sets.filter(x=>!x.warmup&&x.done),volume=work.reduce((t,x)=>t+(x.kg*x.reps),0);
    return {name:clean(name),muscles:{primary:info?.p||[],secondary:info?.s||[]},mode:work.some(x=>x.mode)?work.find(x=>x.mode)?.mode:null,sets,metrics:{workingSets:work.length,volumeKg:Math.round(volume*100)/100,bestKg:Math.max(0,...work.map(x=>x.kg)),bestReps:Math.max(0,...work.map(x=>x.reps)),avgRpe:(()=>{const a=work.map(x=>x.rpe).filter(Boolean);return a.length?Math.round(a.reduce((t,v)=>t+v,0)/a.length*10)/10:0})()}};
  }

  function normalizeSession(s,index){
    if(!s||typeof s!=='object')return null;
    const log=s.log&&typeof s.log==='object'?s.log:{};
    let exercises=Array.isArray(s.exercises)?s.exercises.map(x=>normalizeExercise(x.name,x.sets)):Object.entries(log).map(([n,v])=>normalizeExercise(n,v));
    exercises=exercises.filter(Boolean);
    const program=inferProgram(s);
    const minutes=Math.max(0,Math.round(num(s.minutes)));
    const volume=Math.round(exercises.reduce((t,e)=>t+e.metrics.volumeKg,0)*100)/100;
    const date=isoDate(s.date||todayIso);
    const id=clean(s.id)||('sess-'+date+'-'+index+'-'+Math.random().toString(36).slice(2,8));
    const legacyLog={};exercises.forEach(e=>{legacyLog[e.name]=e.sets.filter(x=>x.done).map(x=>{
      if(x.mode==='time')return {mode:'time',value:x.value,unit:x.unit||'menit',rpe:x.rpe||undefined};
      if(x.mode==='bodyweight')return {mode:'bodyweight',reps:x.reps,rpe:x.rpe||undefined};
      return {mode:'weight',kg:x.kg,reps:x.reps,rpe:x.rpe||undefined};
    })});
    return {
      id,date,name:clean(s.name)||program.name,minutes,program,
      exercises,notes:clean(s.note||s.notes||''),
      metrics:{volumeKg:volume,workingSets:exercises.reduce((t,e)=>t+e.metrics.workingSets,0),exerciseCount:exercises.length},
      evaluation:s.hgEvaluation||s.gymEvaluation||s.evaluation||null,
      sourceVersion:MODEL_VERSION,createdAt:s.createdAt||Date.now(),updatedAt:Date.now(),
      // compatibility projection fields are retained on the canonical record too
      volume,log:legacyLog,note:clean(s.note||s.notes||''),
      hgEvaluation:s.hgEvaluation||s.gymEvaluation||s.evaluation||null
    };
  }

  function migrate(){
    const existing=originalGet(KEY,null);
    const source=existing&&Array.isArray(existing.sessions)?existing.sessions:originalGet('ap_sessions',[]);
    const normalized=(Array.isArray(source)?source:[]).map(normalizeSession).filter(Boolean);
    originalSet(KEY,{version:MODEL_VERSION,sessions:normalized,updatedAt:Date.now()});
    return normalized;
  }

  function canonical(){
    const m=originalGet(KEY,null);
    if(!m||!Array.isArray(m.sessions))return migrate();
    return m.sessions;
  }

  function projection(){
    // Canonical records are the source of truth. They intentionally retain
    // legacy-compatible fields (log/volume/note) so existing UI modules can
    // consume the same records without creating a second dataset.
    return canonical().map(s=>({
      ...s,
      volume:s.metrics?.volumeKg??s.volume??0,
      log:s.log||{},
      note:s.notes||s.note||'',
      hgEvaluation:s.evaluation||s.hgEvaluation||null,
      exercises:s.exercises,
      programContext:s.program
    }));
  }

  function writeCanonical(arr){
    if(hydrating)return;
    hydrating=true;
    try{
      const normalized=(Array.isArray(arr)?arr:[]).map(normalizeSession).filter(Boolean);
      originalSet(KEY,{version:MODEL_VERSION,sessions:normalized,updatedAt:Date.now()});
    }finally{hydrating=false}
  }

  // Redirect the existing storage API for ap_sessions to the canonical model.
  // Other app data keeps using the original storage behavior unchanged.
  ls.get=function(k,d){if(k=== 'ap_sessions')return projection();return originalGet(k,d)};
  ls.set=function(k,v){if(k==='ap_sessions'){writeCanonical(v);return}return originalSet(k,v)};

  function all(){return canonical().slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.id).localeCompare(String(b.id)));}
  function range(start,end){return all().filter(s=>(!start||s.date>=start)&&(!end||s.date<=end));}
  function exerciseRows(){return all().flatMap(s=>s.exercises.map(e=>({session:s,exercise:e})));}
  function personalRecords(){
    const map={};exerciseRows().forEach(({session,exercise})=>{
      const maxKg=exercise.metrics.bestKg||0,maxReps=exercise.metrics.bestReps||0;
      if(!map[exercise.name])map[exercise.name]={name:exercise.name,bestKg:0,bestReps:0,date:session.date,sessionId:session.id};
      if(maxKg>map[exercise.name].bestKg)map[exercise.name].bestKg=maxKg,map[exercise.name].date=session.date,map[exercise.name].sessionId=session.id;
      if(maxReps>map[exercise.name].bestReps)map[exercise.name].bestReps=maxReps;
    });return map;
  }
  function volumeByMuscle(start,end){
    const out={};range(start,end).forEach(s=>s.exercises.forEach(e=>{
      const v=e.metrics.volumeKg||0, p=e.muscles.primary||[], sec=e.muscles.secondary||[];
      p.forEach(g=>out[g]=(out[g]||0)+v);sec.forEach(g=>out[g]=(out[g]||0)+v*.5);
    }));return out;
  }
  function stats(start,end){
    const rows=range(start,end),sets=rows.reduce((t,s)=>t+s.metrics.workingSets,0),volume=rows.reduce((t,s)=>t+s.metrics.volumeKg,0),minutes=rows.reduce((t,s)=>t+s.minutes,0);
    const rpe=[];rows.forEach(s=>s.exercises.forEach(e=>e.sets.filter(x=>x.done&&!x.warmup).forEach(x=>x.rpe&&rpe.push(x.rpe))));
    return {sessions:rows.length,sets,volumeKg:Math.round(volume*100)/100,minutes,avgRpe:rpe.length?Math.round(rpe.reduce((a,b)=>a+b,0)/rpe.length*10)/10:0,records:Object.keys(personalRecords()).length,muscles:volumeByMuscle(start,end)};
  }
  function weekly(){
    const out={};all().forEach(s=>{const d=new Date(s.date+'T00:00:00');const day=d.getDay(),diff=(day+6)%7;d.setDate(d.getDate()-diff);const k=d.toISOString().slice(0,10);if(!out[k])out[k]={week:k,sessions:0,sets:0,volumeKg:0,minutes:0};out[k].sessions++;out[k].sets+=s.metrics.workingSets;out[k].volumeKg+=s.metrics.volumeKg;out[k].minutes+=s.minutes});return Object.values(out).sort((a,b)=>a.week.localeCompare(b.week));
  }
  function currentProgram(){
    const p=originalGet('ap_home_gym_plan_v3',null),profile=originalGet('ap_profile',{})||{};
    return p?{type:'home',name:p.name||'Home Gym Personal',level:p.level||null,frequency:num(p.days||profile.freq)||null,goal:p.goal||profile.goal||null,equipment:Array.isArray(p.equipment)?p.equipment:[]}: {type:'gym',name:'Gym',frequency:num(profile.freq)||null,goal:profile.goal||null,equipment:[]};
  }

  window.apDataModel={version:MODEL_VERSION,key:KEY,all,range,stats,weekly,personalRecords,volumeByMuscle,currentProgram,exerciseRows,refresh:()=>{migrate();return all()}};
  window.apTrainingModelReady=true;

  // One-time migration. Do not create a second source of truth.
  migrate();

  // Re-render once so every tab consumes the normalized projection.
  if(typeof render==='function')setTimeout(()=>render(),0);
})();
