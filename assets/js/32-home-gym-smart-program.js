/* ATHLETIC PHYSIQUE — Home Gym Smart Program Engine
 * Additive layer: goal + level + frequency + equipment now influence exercise
 * selection, ordering, and emphasis. Uses only exercises already present in the
 * Home Gym library. Gym flow remains untouched.
 */
(function(){
  'use strict';
  const SMART_KEY='ap_home_gym_smart_v1';
  const GOAL_KEY='ap_home_gym_goal_v1';
  const PLAN_KEY='ap_home_gym_plan_v3';
  const IDS=[201,202,203,204,205,206];

  const goalRules={
    'Muscle Gain':{main:1.35,accessory:1.18,unilateral:1.08,core:0.92,prefer:['dumbbell','band','bench'],reps:'8–12'},
    'Strength':{main:1.45,accessory:0.92,unilateral:1.12,core:0.88,prefer:['dumbbell','bench','pullup'],reps:'5–8'},
    'Fat Loss':{main:1.05,accessory:1.15,unilateral:1.15,core:1.22,prefer:['bodyweight','band'],reps:'10–15'},
    'Athletic Performance':{main:1.12,accessory:0.98,unilateral:1.35,core:1.30,prefer:['bodyweight','dumbbell','band'],reps:'6–10'}
  };

  const patterns={
    push:['push','press','shoulder','triceps'],
    pull:['row','pull','curl','hammer','snow angel','superman'],
    legs:['squat','lunge','deadlift','glute','step up','calf','wall sit'],
    core:['plank','dead bug','bird dog','crunch','mountain climber','hollow','leg raise','pallof']
  };

  const eqMap={
    'Tanpa alat':'bodyweight','bodyweight':'bodyweight','dumbbell':'dumbbell','band':'band',
    'bench':'bench','pullup':'pullup','dumbbell+bench':'dumbbell','band+anchor':'band'
  };

  const getGoal=()=>{
    const g=typeof ls!=='undefined'?ls.get(GOAL_KEY,'Muscle Gain'):'Muscle Gain';
    return goalRules[g]?g:'Muscle Gain';
  };
  const getState=()=>typeof ls!=='undefined'?ls.get(PLAN_KEY,{level:'Pemula',days:3,equipment:['bodyweight']}):{level:'Pemula',days:3,equipment:['bodyweight']};
  const escSafe=v=>typeof esc==='function'?esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=s=>String(s||'').toLowerCase();

  function classify(name){
    const n=norm(name);
    for(const [k,words] of Object.entries(patterns)) if(words.some(w=>n.includes(w))) return k;
    return 'accessory';
  }
  function equipmentFor(name){
    const n=norm(name);
    if(n.includes('dumbbell')) return 'dumbbell';
    if(n.includes('band')||n.includes('resistance')) return 'band';
    if(n.includes('pull up')||n.includes('hanging')) return 'pullup';
    if(n.includes('bench')||n.includes('incline')||n.includes('decline')) return 'bench';
    return 'bodyweight';
  }
  function hasEquipment(name,owned){
    const e=equipmentFor(name);
    return e==='bodyweight'||owned.includes(e);
  }
  function isUnilateral(name){
    const n=norm(name);return /one arm|single leg|bulgarian|reverse lunge|walking lunge|step up/.test(n);
  }
  function score(name,focus,goal,owned,used){
    const r=goalRules[goal],kind=classify(name),eq=equipmentFor(name),n=norm(name);
    let s=1;
    if(!hasEquipment(name,owned))return -999;
    if(kind===focus.toLowerCase())s+=1.8;
    if(focus==='Full Body' && ['legs','push','pull'].includes(kind))s+=0.7;
    s*=r[kind]||r.accessory;
    if(isUnilateral(name))s*=r.unilateral;
    if(r.prefer.includes(eq))s+=0.65;
    if(used.has(name))s-=8;
    if(goal==='Strength' && /push up|plank|bird dog|dead bug/.test(n))s-=0.45;
    if(goal==='Fat Loss' && /mountain climber|walking lunge|step up/.test(n))s+=0.6;
    if(goal==='Athletic Performance' && /skater|step up|bulgarian|single leg|pike|mountain climber|hollow/.test(n))s+=0.9;
    return s;
  }

  function smartize(){
    if(typeof PROG!=='object')return;
    const st=getState(),goal=getGoal(),owned=Array.isArray(st.equipment)?st.equipment:['bodyweight'];
    const candidates=[];
    IDS.forEach(id=>{const p=PROG[id];if(p&&Array.isArray(p.ex))p.ex.forEach(e=>candidates.push(e));});
    if(!candidates.length)return;

    const globalUsed=new Set();
    IDS.forEach(id=>{
      const p=PROG[id];if(!p||!Array.isArray(p.ex))return;
      const focus=String(p.f||'').split('·')[0].trim()||'Full Body';
      const desired=p.ex.length;
      const pool=candidates.filter(e=>hasEquipment(e[0],owned));
      const chosen=[];
      const local=new Set();
      while(chosen.length<desired && pool.length){
        let best=null,bestScore=-Infinity;
        for(const e of pool){
          if(local.has(e[0]))continue;
          const sc=score(e[0],focus,goal,owned,globalUsed)+((chosen.length===0&&classify(e[0])!=='core')?0.2:0);
          if(sc>bestScore){best=e;bestScore=sc;}
        }
        if(!best)break;
        local.add(best[0]);globalUsed.add(best[0]);chosen.push(best);
      }
      // Keep the existing session size, but ensure a core movement when the
      // session already had one in its baseline plan.
      const hadCore=p.ex.some(e=>classify(e[0])==='core');
      if(hadCore && !chosen.some(e=>classify(e[0])==='core')){
        const core=pool.find(e=>classify(e[0])==='core'&&!local.has(e[0]));
        if(core){chosen[chosen.length-1]=core;local.add(core[0]);globalUsed.add(core[0]);}
      }
      p.ex=chosen.map(e=>{
        const out=[e[0],e[1],e[2]];
        out._hgSmart=true;
        return out;
      });
      p.f=String(p.f||'').replace(/ · Fokus:.*$/,'')+` · Fokus: ${goal}`;
    });
    if(window.__apHomeGymAdaptiveize)window.__apHomeGymAdaptiveize();
    if(typeof ls!=='undefined')ls.set(SMART_KEY,{goal,level:st.level,days:st.days,equipment:owned,updatedAt:Date.now()});
  }

  function updateHtml(html){
    IDS.forEach(id=>{
      const p=PROG[id];if(!p)return;
      const marker=`data-home-start="${id}"`;
      const pos=html.indexOf(marker);if(pos<0)return;
      const cardStart=html.lastIndexOf('<article',pos);
      const cardEnd=html.indexOf('</article>',pos);
      if(cardStart<0||cardEnd<0)return;
      const end=cardEnd+10;
      const card=html.slice(cardStart,end);
      const listStart=card.indexOf('<div class="home-workout-exercises">');
      const listEnd=card.indexOf('</div>',listStart);
      if(listStart<0||listEnd<0)return;
      // Find the matching list close by locating the known next button marker.
      const buttonPos=card.indexOf(`<button class="btn" ${marker}`);
      if(buttonPos<0)return;
      const listClose=card.lastIndexOf('</div>',buttonPos);
      if(listClose<0)return;
      const list=`<div class="home-workout-exercises">${p.ex.map((e,i)=>`<div><span>${i+1}</span><b>${escSafe(e[0])}</b><small>${escSafe(e[1])}</small></div>`).join('')}</div>`;
      html=html.slice(0,cardStart)+card.slice(0,listStart)+list+card.slice(listClose+6)+html.slice(end);
    });
    return html;
  }

  const oldView=view;
  view=function(){
    if(tab==='workout' && !getA() && typeof workoutMode!=='undefined' && workoutMode==='home'){
      const base=oldView();
      smartize();
      return updateHtml(base);
    }
    return oldView();
  };

  window.__apHomeGymSmartize=smartize;
  // Re-apply immediately so a direct refresh of the Home Gym tab gets the
  // smart selection before the first visible interaction.
  if(tab==='workout' && typeof workoutMode!=='undefined' && workoutMode==='home') smartize();
})();
