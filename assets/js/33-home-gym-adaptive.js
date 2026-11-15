/* ATHLETIC PHYSIQUE — Adaptive Home Gym Engine
 * Adds history-aware exercise rotation on top of the existing Smart Program.
 * Uses only movements already represented in the project's Home Gym library.
 */
(function(){
  'use strict';
  const PLAN_KEY='ap_home_gym_plan_v3';
  const GOAL_KEY='ap_home_gym_goal_v1';
  const EVAL_KEY='ap_home_gym_session_eval_v1';
  const IDS=[201,202,203,204,205,206];

  const CANDIDATES={
    push:[
      ['Push Up','bodyweight','main'],['Wide Push Up','bodyweight','main'],['Diamond Push Up','bodyweight','accessory'],
      ['Incline Push Up','bench','main'],['Decline Push Up','bench','accessory'],['Dumbbell Bench Press','dumbbell','main'],
      ['Incline Dumbbell Press','dumbbell+bench','main'],['Dumbbell Shoulder Press','dumbbell','main'],['Pike Push Up','bodyweight','main'],
      ['Band Overhead Triceps Extension','band','accessory'],['Close Grip Push Up','bodyweight','accessory'],
      ['Band Lateral Raise','band','accessory'],['Dumbbell Lateral Raise','dumbbell','accessory']
    ],
    pull:[
      ['Resistance Band Row','band','main'],['Dumbbell Bent Over Row','dumbbell','main'],['One Arm Dumbbell Row','dumbbell','main'],
      ['Pull Up','pullup','main'],['Superman','bodyweight','accessory'],['Reverse Snow Angel','bodyweight','accessory'],
      ['Dumbbell Biceps Curl','dumbbell','accessory'],['Hammer Curl','dumbbell','accessory'],
      ['Resistance Band Biceps Curl','band','accessory'],['Cross-Body Hammer Curl','dumbbell','accessory']
    ],
    legs:[
      ['Bodyweight Squat','bodyweight','main'],['Goblet Squat','dumbbell','main'],['Bulgarian Split Squat','bodyweight','main'],
      ['Reverse Lunge','bodyweight','main'],['Walking Lunge','bodyweight','main'],['Dumbbell Romanian Deadlift','dumbbell','main'],
      ['Single-Leg Romanian Deadlift','dumbbell','accessory'],['Glute Bridge','bodyweight','accessory'],
      ['Single Leg Glute Bridge','bodyweight','accessory'],['Step Up','bench','main'],['Wall Sit','bodyweight','accessory'],
      ['Standing Calf Raise','bodyweight','accessory']
    ],
    core:[
      ['Plank','bodyweight','core'],['Dead Bug','bodyweight','core'],['Bird Dog','bodyweight','core'],['Reverse Crunch','bodyweight','core'],
      ['Hanging Leg Raise','pullup','core'],['Mountain Climber','bodyweight','core'],['Side Plank','bodyweight','core'],
      ['Bicycle Crunch','bodyweight','core'],['Hollow Body Hold','bodyweight','core']
    ]
  };

  const eqMap={'bodyweight':'bodyweight','Tanpa alat':'bodyweight','dumbbell':'dumbbell','band':'band','bench':'bench','pullup':'pullup','dumbbell+bench':'dumbbell'};
  const norm=s=>String(s||'').toLowerCase();
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0;};
  const getState=()=>{const base=ls.get(PLAN_KEY,{level:'Pemula',days:3,equipment:['bodyweight']});const u=window.apUnifiedIntelligence&&window.apUnifiedIntelligence.context('home');return u?Object.assign({},base,{level:u.level,days:u.frequency,equipment:u.equipment}):base};
  const getGoal=()=>ls.get(GOAL_KEY,'Muscle Gain');
  const sessions=()=>window.apUnifiedIntelligence?window.apUnifiedIntelligence.sessions('home'):(window.apTraining?window.apTraining.all():(typeof window.sessions==='function'?window.sessions():ls.get('ap_sessions',[])));
  const escA=v=>typeof esc==='function'?esc(String(v)):String(v);

  function focusOf(p){
    const f=String(p&&p.f||'').split('·')[0].trim().toLowerCase();
    if(f.includes('push'))return 'push'; if(f.includes('pull'))return 'pull'; if(f.includes('lower')||f.includes('legs'))return 'legs';
    if(f.includes('upper'))return 'upper'; if(f.includes('full'))return 'full'; return 'full';
  }
  function kind(name){
    const n=norm(name);
    if(/plank|dead bug|bird dog|crunch|mountain climber|hollow|leg raise/.test(n))return 'core';
    if(/squat|lunge|deadlift|glute|step up|calf|wall sit/.test(n))return 'legs';
    if(/row|pull|curl|hammer|snow angel|superman/.test(n))return 'pull';
    return 'push';
  }
  function available(item,owned){return item[1].split('+').every(x=>owned.includes(eqMap[x]||x));}
  function stats(){
    const out={};
    sessions().filter(s=>String(s.name||'').toLowerCase().includes('home gym')).forEach(s=>Object.entries(s.log||{}).forEach(([name,rows])=>{
      const o=out[name]||(out[name]={count:0,last:'',rpe:0,reps:0,kg:0});o.count++;
      o.last=String(s.date||o.last);
      const rr=rows||[];const rpes=rr.filter(x=>num(x.rpe)>0).map(x=>num(x.rpe));
      if(rpes.length)o.rpe=rpes.reduce((a,b)=>a+b,0)/rpes.length;
      const reps=rr.filter(x=>num(x.reps)>0).map(x=>num(x.reps));if(reps.length)o.reps=Math.max(...reps);
      const kg=rr.filter(x=>num(x.kg)>0).map(x=>num(x.kg));if(kg.length)o.kg=Math.max(...kg);
    }));
    return out;
  }
  function daysSince(date){if(!date)return 999;const a=new Date(String(date)+'T00:00:00'),b=new Date(todayIso+'T00:00:00');return Math.max(0,Math.round((b-a)/86400000));}
  function score(item,focus,goal,owned,used,st){
    const name=item[0],k=kind(name),s=st[name]||{count:0,last:'',rpe:0,reps:0,kg:0};
    const evals=ls.get(EVAL_KEY,{}), ev=evals[name]||{};
    if(!available(item,owned)||used.has(name))return -999;
    let v=1;
    if(focus==='full')v+=['push','pull','legs'].includes(k)?1.1:0;
    else if(focus==='upper')v+=['push','pull'].includes(k)?2.2:-1;
    else v+=k===focus?2.8:-1.2;
    if(item[2]==='main')v+=0.35;
    if(goal==='Strength'&&item[2]==='main')v+=0.55;
    if(goal==='Athletic Performance'&&/single|bulgarian|step up|pike|mountain climber/.test(norm(name)))v+=0.65;
    if(goal==='Fat Loss'&&/lunge|step up|mountain climber|bodyweight squat/.test(norm(name)))v+=0.45;
    if(goal==='Muscle Gain'&&item[1]!=='bodyweight')v+=0.3;
    // Rotation pressure: frequently used movements get progressively lower priority.
    v-=Math.min(2.2,s.count*0.55);
    if(s.last)v+=Math.min(1.4,daysSince(s.last)/14);
    // If the last performance was very hard, rotate away temporarily.
    if(s.rpe>=9)v-=1.0;
    // If performance is strong and recent, keep the movement available but do not force it.
    if(s.reps>=12&&s.rpe>0&&s.rpe<=8)v+=0.15;
    // Session evaluation feedback: make the next program respond to the last result.
    if(ev.status==='too_hard')v-=1.8;
    else if(ev.status==='stagnant')v-=1.2;
    else if(ev.status==='too_easy')v+=0.35;
    else if(ev.status==='successful')v+=0.08;
    return v;
  }
  function targetsFor(item,base){
    const m=String(base||'3 × 8–12').match(/^(\d+)\s*×\s*(\d+)\s*[–-]\s*(\d+)/);if(!m)return base;
    let sets=+m[1],lo=+m[2],hi=+m[3];
    const goal=getGoal();
    if(goal==='Strength'&&item[2]==='main'){lo=5;hi=8;}
    else if(goal==='Fat Loss'){lo=item[2]==='core'?12:10;hi=item[2]==='core'?20:15;}
    else if(goal==='Athletic Performance'){lo=item[2]==='core'?10:6;hi=item[2]==='core'?20:10;}
    else if(goal==='Muscle Gain'){lo=item[2]==='core'?10:8;hi=item[2]==='core'?20:12;}
    return `${sets} × ${lo}–${hi}`;
  }
  function buildPool(focus,owned){
    if(focus==='full')return [...CANDIDATES.legs,...CANDIDATES.push,...CANDIDATES.pull,...CANDIDATES.core];
    if(focus==='upper')return [...CANDIDATES.push,...CANDIDATES.pull,...CANDIDATES.core];
    return [...CANDIDATES[focus],...CANDIDATES.core];
  }
  function adaptiveize(){
    if(typeof PROG!=='object')return;
    const st=getState(),owned=Array.isArray(st.equipment)&&st.equipment.length?st.equipment:['bodyweight'],goal=getGoal(),hist=stats(),global=new Set();
    IDS.forEach(id=>{
      const p=PROG[id];if(!p||!Array.isArray(p.ex))return;
      const focus=focusOf(p),desired=p.ex.length,pool=buildPool(focus,owned),chosen=[],used=new Set();
      while(chosen.length<desired&&pool.length){
        let best=null,bs=-Infinity;
        pool.forEach(item=>{const sc=score(item,focus,goal,owned,new Set([...used,...global]),hist);if(sc>bs){bs=sc;best=item;}});
        if(!best||bs<0)break;
        used.add(best[0]);global.add(best[0]);chosen.push(best);
      }
      // Preserve the baseline size if the available equipment is restrictive.
      if(chosen.length<desired){p.ex.slice(0,desired).forEach(e=>{if(chosen.length>=desired||used.has(e[0]))return;chosen.push([e[0],e[1],e[2]]);used.add(e[0]);});}
      p.ex=chosen.slice(0,desired).map((item,i)=>{
        const base=(p.ex[i]&&p.ex[i]._hgBaseTarget)||((p.ex[i]&&p.ex[i][1])||'3 × 8–12');
        const out=[item[0],targetsFor(item,base),item[2]==='core'?'time-or-reps':'weight'];
        out._hgAdaptive=true;return out;
      });
      p.f=String(p.f||'').replace(/ · Adaptif:.*$/,'')+' · Adaptif: riwayat + rotasi';
    });
    ls.set('ap_home_gym_adaptive_v1',{updatedAt:Date.now(),goal,level:st.level,days:st.days,equipment:owned});
  }

  window.__apHomeGymAdaptiveize=adaptiveize;
  // 32-home-gym-smart-program.js invokes this hook after each smart regeneration.
  adaptiveize();

  // Add a concise explanation to the Home Gym screen without changing the existing layout.
  const oldView=view;
  view=function(){
    const html=oldView();
    if(tab==='workout'&&typeof workoutMode!=='undefined'&&workoutMode==='home'&&!getA()){
      const st=getState(),hist=stats(),used=Object.keys(hist).length;
      const note=`<section class="card hg-adaptive-note"><div><span class="hg-progress-kicker">PROGRAM ADAPTIF</span><h2>Program belajar dari riwayat latihan</h2><p class="sub">Gerakan yang terlalu sering digunakan akan diprioritaskan lebih rendah. Performa terakhir, RPE, dan frekuensi penggunaan ikut dipertimbangkan agar variasi latihan tetap relevan dengan tujuan Anda.</p></div><div class="hg-adaptive-stats"><span><b>${used}</b> gerakan tercatat</span><span><b>${st.days}x</b> / minggu</span><span><b>${escA(st.level)}</b></span></div></section>`;
      const marker='<section class="card hg-goal-card">';
      if(html.includes(marker))return html.replace(marker,note+marker);
      const marker2='<section class="card home-gym-summary">';
      return html.includes(marker2)?html.replace(marker2,note+marker2):html;
    }
    return html;
  };
})();
