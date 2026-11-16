/* ATHLETIC PHYSIQUE — Gym Smart Program & Exercise Selection v1
 * Stage 2: applies the shared intelligence foundation to regular Gym.
 * Non-destructive in intent: keeps the existing schedule structure and adapts
 * exercise selection/targets from goal, level, frequency and training history.
 */
(function(){
  'use strict';
  const KEY='ap_gym_smart_v1';
  const BASE_KEY='ap_gym_smart_base_v1';
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0};
  const norm=v=>String(v??'').trim().toLowerCase();
  const esc=v=>typeof window.esc==='function'?window.esc(String(v)):String(v);
  const ui=()=>window.apUnifiedIntelligence;
  const ctx=()=>ui?ui.context('gym'):{mode:'gym',goal:'Muscle Gain',level:'Pemula',frequency:3,equipment:['gym']};
  const sessions=()=>ui?ui.sessions('gym'):[];
  const allExercises=()=>Array.isArray(window.apALL)?window.apALL.slice():[];
  const lib=()=>window.apLIB||{};

  const GROUPS={
    chest:['dada','chest','bench press','press','push up','dip','fly','crossover'],
    back:['punggung','row','pulldown','pull up','chin up','pullover','deadlift','back extension'],
    shoulders:['bahu','shoulder','lateral raise','rear delt','face pull','upright row','shrug'],
    arms:['curl','biceps','triceps','skull crusher','pushdown','extension','preacher','hammer'],
    legs:['kaki','squat','leg press','leg extension','leg curl','lunge','calf','glute','hip thrust','deadlift'],
    core:['core','plank','crunch','leg raise','pallof','ab wheel','russian twist','dead bug','mountain climber'],
    cardio:['treadmill','sepeda','elliptical','rowing','stair','lompat tali','jalan cepat']
  };
  const GOAL={
    'Muscle Gain':{main:[8,12],accessory:[10,15],core:[10,20],prefer:['dumbbell','cable','machine'],avoid:[]},
    'Strength':{main:[4,8],accessory:[6,10],core:[8,15],prefer:['barbell','bench','rack'],avoid:['isolation']},
    'Fat Loss':{main:[8,15],accessory:[10,20],core:[12,20],prefer:['machine','cable','bodyweight'],avoid:[]},
    'Athletic Performance':{main:[5,10],accessory:[8,15],core:[10,20],prefer:['dumbbell','cable','unilateral'],avoid:[]}
  };
  const LEVEL={
    'Pemula':{compound:0.45,machine:0.8,free:0.25,maxSets:3},
    'Menengah':{compound:0.85,machine:0.45,free:0.65,maxSets:4},
    'Lanjutan':{compound:1.0,machine:0.55,free:0.9,maxSets:4},
    'Expert':{compound:1.1,machine:0.45,free:1.0,maxSets:5}
  };

  function groupOf(name){
    const n=norm(name);
    for(const [g,words] of Object.entries(GROUPS))if(words.some(w=>n.includes(w)))return g;
    return 'accessory';
  }
  function kindOf(name){
    const n=norm(name);
    if(groupOf(name)==='core')return 'core';
    if(/barbell|bench press|squat|deadlift|overhead press|leg press|pull up|dip/.test(n))return 'compound';
    if(/machine|cable/.test(n))return 'machine';
    return 'free';
  }
  function focusOf(program){
    const f=norm(program&&program.f),n=norm(program&&program.n);
    if(/cardio|hiit/.test(f+' '+n))return 'cardio';
    if(/push|dada/.test(f+' '+n))return 'chest';
    if(/pull|punggung/.test(f+' '+n))return 'back';
    if(/leg|lower|kaki/.test(f+' '+n))return 'legs';
    if(/upper|bahu|lengan/.test(f+' '+n))return 'upper';
    if(/full body|seluruh/.test(f+' '+n))return 'full';
    return 'full';
  }
  function focusMatch(group,focus){
    if(focus==='full')return ['chest','back','legs','shoulders','arms','core'].includes(group);
    if(focus==='upper')return ['chest','back','shoulders','arms','core'].includes(group);
    if(focus==='cardio')return group==='cardio'||group==='core';
    return group===focus||((focus==='chest')&&group==='shoulders')||((focus==='back')&&group==='arms');
  }
  function exerciseHistory(name){
    const n=norm(name),rows=[];
    sessions().slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))).forEach(s=>{
      if(rows.length>=5)return;
      const hit=(s.exercises||[]).find(e=>norm(e.name)===n);
      if(hit)rows.push({session:s,exercise:hit});
      else if(s.log&&s.log[name])rows.push({session:s,legacy:s.log[name]});
    });
    return rows;
  }
  function usage(name){
    const h=exerciseHistory(name);return {count:h.length,last:h[0]||null,days:h[0]&&h[0].session?Math.max(0,Math.round((new Date(todayIso+'T00:00:00')-new Date(String(h[0].session.date)+'T00:00:00'))/86400000)):999};
  }
  function evalStatus(name){
    const h=exerciseHistory(name),last=h[0];
    if(!last)return 'new';
    const s=last.session||{};
    const ev=s.gymEvaluation;
    if(ev&&Array.isArray(ev.exercise)){
      const x=ev.exercise.find(v=>norm(v.name)===norm(name));
      if(x)return x.status||'successful';
    }
    const m=last.exercise&&last.exercise.metrics;
    if(m&&num(m.avgRpe)>=9)return 'too_hard';
    try{
      const perf=ui&&ui.performance?ui.performance('gym',name):null;
      if(perf&&perf.trend==='down')return 'stagnant';
      if(perf&&perf.trend==='up'&&num(perf.last&&perf.last.rpe)>0&&num(perf.last.rpe)<=6)return 'too_easy';
    }catch(e){}
    return 'successful';
  }
  function score(name,focus,goal,level,used,frequency){
    const g=groupOf(name),k=kindOf(name),n=norm(name),u=usage(name),ev=evalStatus(name),r=GOAL[goal]||GOAL['Muscle Gain'],lv=LEVEL[level]||LEVEL['Pemula'];
    if(!focusMatch(g,focus)||used.has(name))return -999;
    let s=1;
    if(focus==='full')s+=g==='legs'||g==='chest'||g==='back'?1.4:0.6;
    if(g===focus)s+=2.4;
    if(focus==='upper'&&['chest','back','shoulders','arms'].includes(g))s+=1.2;
    if(k==='compound')s+=lv.compound;
    if(k==='machine')s+=lv.machine;
    if(k==='free')s+=lv.free;
    if(r.prefer.some(x=>n.includes(x)))s+=0.5;
    if(goal==='Strength'&&k==='compound')s+=0.8;
    if(goal==='Athletic Performance'&&/single|unilateral|lunge|split|step up|row|press/.test(n))s+=0.45;
    if(goal==='Fat Loss'&&/machine|cable|lunge|step up|treadmill|row/.test(n))s+=0.25;
    if(level==='Pemula'&&/deadlift|barbell squat|front squat/.test(n))s-=0.35;
    if(frequency>=5&&u.count>=2)s-=Math.min(2.4,u.count*0.6);
    if(u.last)s+=Math.min(1.2,u.days/14);
    if(ev==='too_hard')s-=2.0;
    if(ev==='stagnant')s-=1.7;
    if(ev==='too_easy')s+=0.25;
    if(ev==='successful')s+=0.05;
    return s;
  }
  function targetFor(ex,goal,level){
    const g=GOAL[goal]||GOAL['Muscle Gain'];
    const k=kindOf(ex);let range=k==='core'?g.core:(k==='compound'?g.main:g.accessory);
    if(level==='Expert'&&goal==='Strength'&&k==='compound')range=[3,6];
    if(level==='Pemula'&&k==='compound'&&goal!=='Strength')range=[8,12];
    const old=String(ex[1]||'3 × 8–12');const sm=old.match(/^(\d+)\s*[×x]\s*(\d+)\s*[–-]\s*(\d+)/);
    const sets=Math.max(1,Math.min((LEVEL[level]||LEVEL.Pemula).maxSets,sm?+sm[1]:3));
    if(/menit|detik/i.test(old))return old;
    let lo=range[0],hi=range[1];
    const status=evalStatus(ex[0]);
    if(status==='too_easy'){
      lo=Math.min(hi,lo+1);
      hi=hi+2;
    }
    return `${sets} × ${lo}–${hi}`;
  }
  function candidatesFor(focus){
    const list=allExercises();
    if(list.length)return list;
    return Object.values(lib()).flat();
  }
  function smartize(){
    if(typeof PROG!=='object'||!ui)return false;
    const c=ctx(),goal=c.goal,level=c.level,frequency=c.frequency||3;
    const currentHash=JSON.stringify(Object.keys(PROG).filter(k=>+k<7).sort().map(k=>[k,PROG[k]&&PROG[k].n,PROG[k]&&PROG[k].f,PROG[k]&&PROG[k].ex]));
    const applied=ls.get(KEY,null);
    if(applied&&applied.hash===currentHash&&applied.goal===goal&&applied.level===level&&applied.frequency===frequency)return false;
    const changed=[];
    const weekUsed=new Set();
    Object.keys(PROG).map(Number).filter(k=>k<7&&PROG[k]&&Array.isArray(PROG[k].ex)).sort((a,b)=>a-b).forEach(id=>{
      const p=PROG[id],focus=focusOf(p),pool=candidatesFor(focus),used=new Set(),out=[];
      p.ex.forEach((old,i)=>{
        const oldName=old[0],oldGroup=groupOf(oldName),oldScore=score(oldName,focus,goal,level,used,frequency);
        let best=oldName,bestScore=oldScore;
        pool.forEach(name=>{
          const candidate=typeof name==='string'?name:name&&name[0];if(!candidate)return;
          const sc=score(candidate,focus,goal,level,new Set([...used,...weekUsed]),frequency);
          if(sc>bestScore+0.8) {best=candidate;bestScore=sc;}
        });
        // Keep the existing movement unless the intelligence has a clear reason to change it.
        const ev=evalStatus(oldName),u=usage(oldName);
        const unifiedAdaptiveReady=!!(window.apUnifiedAdaptive&&window.apUnifiedAdaptive.ready);
        const shouldRotate=(unifiedAdaptiveReady?(frequency>=5&&u.count>=3):(ev==='too_hard'||ev==='stagnant'||(frequency>=5&&u.count>=3)));
        if(!shouldRotate)best=oldName;
        const item=[best,targetFor([best,old[1]],goal,level),old[2]||''];
        if(best!==oldName)changed.push({day:id,from:oldName,to:best,reason:ev==='stagnant'?'stagnasi':ev==='too_hard'?'terlalu berat':'rotasi frekuensi'});
        out.push(item);used.add(best);weekUsed.add(best);
      });
      p.ex=out;
      p.f=String(p.f||'').replace(/ · Smart:.*$/,'')+` · Smart: ${goal}`;
    });
    const nextHash=JSON.stringify(Object.keys(PROG).filter(k=>+k<7).sort().map(k=>[k,PROG[k]&&PROG[k].n,PROG[k]&&PROG[k].f,PROG[k]&&PROG[k].ex]));
    ls.set(KEY,{version:1,hash:nextHash,sourceHash:currentHash,goal,level,frequency,updatedAt:Date.now(),changes:changed.slice(0,20)});
    if(changed.length&&typeof saveProg==='function')saveProg();
    return !!changed.length;
  }
  function preview(){
    const c=ctx(),out=[];
    Object.keys(PROG).map(Number).filter(k=>k<7&&PROG[k]).sort((a,b)=>a-b).forEach(id=>{const p=PROG[id];out.push({day:id,name:p.n,focus:focusOf(p),exercises:(p.ex||[]).map(e=>({name:e[0],target:targetFor(e,c.goal,c.level),status:evalStatus(e[0])}))})});
    return {context:c,days:out};
  }
  window.apGymSmartProgram={version:1,context:ctx,preview,smartize,ready:true};
  window.__apGymSmartProgramReady=true;
  // Apply only when the scheduled Gym program is visible and no session is active.
  if(!getA() && typeof tab!=='undefined' && tab==='workout' && typeof workoutMode!=='undefined' && workoutMode==='gym')smartize();
  const oldRender=render;
  render=function(){
    if(!getA()&&typeof workoutMode!=='undefined'&&workoutMode==='gym')smartize();
    oldRender();
  };
  document.documentElement.dataset.gymSmartProgram='v1';
})();
