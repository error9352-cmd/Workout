/* ATHLETIC PHYSIQUE — Personal Home Gym Program Engine
 * Additive patch. Gym flow remains untouched.
 * Personalization inputs: level + weekly frequency + equipment owned.
 */
(function(){
  'use strict';

  const STORAGE_KEY='ap_home_gym_plan_v3';
  const MODE_KEY='ap_workout_mode';
  const EQUIPMENT=[
    ['bodyweight','Tanpa alat','Bodyweight dan ruang latihan'],
    ['dumbbell','Dumbbell','Sepasang dumbbell'],
    ['band','Resistance Band','Resistance band dengan/tanpa anchor'],
    ['bench','Bench / kursi kokoh','Bench atau kursi yang stabil'],
    ['pullup','Pull-up Bar','Pull-up / chin-up bar']
  ];

  const LEVELS={
    Pemula:{min:2,max:4,recommended:3,sets:2,mainReps:'8–12',accessoryReps:'10–15',coreReps:'10–15',desc:'Fokus teknik, kontrol gerakan, dan membangun kebiasaan latihan.',session:'5–6 gerakan',rest:'60–90 detik'},
    Menengah:{min:3,max:5,recommended:4,sets:3,mainReps:'8–12',accessoryReps:'10–15',coreReps:'10–20',desc:'Volume sedang dengan progres repetisi dan beban yang lebih terstruktur.',session:'6–7 gerakan',rest:'60–120 detik'},
    Lanjutan:{min:4,max:6,recommended:5,sets:3,mainReps:'6–12',accessoryReps:'8–15',coreReps:'10–20',desc:'Volume lebih tinggi dengan pembagian otot yang lebih spesifik.',session:'7–8 gerakan',rest:'75–120 detik'},
    Expert:{min:4,max:6,recommended:5,sets:4,mainReps:'6–10',accessoryReps:'8–15',coreReps:'12–20',desc:'Volume dan intensitas tinggi dengan perhatian besar pada pemulihan.',session:'8–9 gerakan',rest:'90–150 detik'}
  };

  // Names below are from the project's Home Workout library (28-home-workout.js)
  // plus movements already present in the core exercise catalog.
  const MOV={
    push:[
      ['Push Up','Tanpa alat','main'],['Wide Push Up','Tanpa alat','main'],['Diamond Push Up','Tanpa alat','accessory'],
      ['Incline Push Up','bench','main'],['Decline Push Up','bench','accessory'],
      ['Dumbbell Bench Press','dumbbell+bench','main'],['Incline Dumbbell Press','dumbbell+bench','main'],
      ['Dumbbell Shoulder Press','dumbbell','main'],['Pike Push Up','Tanpa alat','main'],
      ['Band Overhead Triceps Extension','band','accessory'],['Close Grip Push Up','Tanpa alat','accessory'],
      ['Band Lateral Raise','band','accessory'],['Dumbbell Lateral Raise','dumbbell','accessory']
    ],
    pull:[
      ['Resistance Band Row','band','main'],['Dumbbell Bent Over Row','dumbbell','main'],['One Arm Dumbbell Row','dumbbell','main'],
      ['Pull Up','pullup','main'],['Superman','Tanpa alat','accessory'],['Reverse Snow Angel','Tanpa alat','accessory'],
      ['Dumbbell Biceps Curl','dumbbell','accessory'],['Hammer Curl','dumbbell','accessory'],
      ['Resistance Band Biceps Curl','band','accessory'],['Cross-Body Hammer Curl','dumbbell','accessory']
    ],
    legs:[
      ['Bodyweight Squat','Tanpa alat','main'],['Goblet Squat','dumbbell','main'],['Bulgarian Split Squat','Tanpa alat','main'],
      ['Reverse Lunge','Tanpa alat','main'],['Walking Lunge','Tanpa alat','main'],['Dumbbell Romanian Deadlift','dumbbell','main'],
      ['Single-Leg Romanian Deadlift','dumbbell','accessory'],['Glute Bridge','Tanpa alat','accessory'],
      ['Single Leg Glute Bridge','Tanpa alat','accessory'],['Step Up','bench','main'],['Wall Sit','Tanpa alat','accessory'],
      ['Standing Calf Raise','Tanpa alat','accessory']
    ],
    core:[
      ['Plank','Tanpa alat','core'],['Dead Bug','Tanpa alat','core'],['Bird Dog','Tanpa alat','core'],
      ['Reverse Crunch','Tanpa alat','core'],['Hanging Leg Raise','pullup','core'],['Mountain Climber','Tanpa alat','core'],
      ['Side Plank','Tanpa alat','core'],['Bicycle Crunch','Tanpa alat','core'],['Hollow Body Hold','Tanpa alat','core']
    ]
  };

  const EQUIP_ALIAS={
    'Tanpa alat':'bodyweight', bodyweight:'bodyweight', dumbbell:'dumbbell', band:'band', bench:'bench', pullup:'pullup'
  };

  function escSafe(v){return typeof esc==='function'?esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function unique(a){return [...new Set(a)];}
  function hasEq(eq,need){if(!need)return true;return need.split('+').every(x=>eq.includes(EQUIP_ALIAS[x]||x));}
  function equipmentLabel(eq){
    const names=EQUIPMENT.filter(x=>eq.includes(x[0])).map(x=>x[1]);
    return names.join(' + ')||'Tanpa alat';
  }
  function repTarget(type,level){const L=LEVELS[level];return type==='main'?`${L.sets} × ${L.mainReps}`:type==='core'?`${Math.max(2,L.sets-1)} × ${L.coreReps}`:`${Math.max(2,L.sets-1)} × ${L.accessoryReps}`;}
  function duration(level){return level==='Pemula'?'35–50 menit':level==='Menengah'?'45–60 menit':level==='Lanjutan'?'50–70 menit':'60–80 menit';}

  function available(pool,eq,used){
    return pool.filter(x=>hasEq(eq,x[1])&&!used.has(x[0]));
  }
  function pick(pool,eq,count,used){
    const primary=available(pool,eq,used);
    const bodyFallback=available(pool,eq.concat(['bodyweight']),used);
    const source=primary.length>=count?primary:unique(primary.concat(bodyFallback));
    const out=[];
    for(const item of source){if(out.length>=count)break;used.add(item[0]);out.push(item);}
    return out;
  }
  function makeSession(label,focus,level,eq,index,usedGlobal){
    const used=new Set(), ex=[];
    const add=(pool,n)=>{
      for(const item of pick(pool,eq,n,used)){
        if(!usedGlobal.has(item[0])){usedGlobal.add(item[0]);ex.push([item[0],repTarget(item[2],level),item[2]==='core'?'time-or-reps':'weight']);}
      }
    };
    if(focus==='Full Body'){
      const legN=level==='Pemula'?2:3;
      add(MOV.legs,legN);add(MOV.push,level==='Pemula'?1:2);add(MOV.pull,level==='Pemula'?1:2);add(MOV.core,1);
    }else if(focus==='Upper'){add(MOV.push,2);add(MOV.pull,2);add(MOV.core,1);}
    else if(focus==='Lower'){add(MOV.legs,4);add(MOV.core,1);}
    else if(focus==='Push'){add(MOV.push,5);add(MOV.core,1);}
    else if(focus==='Pull'){add(MOV.pull,5);add(MOV.core,1);}
    else if(focus==='Legs'){add(MOV.legs,5);add(MOV.core,1);}

    // If a particular equipment combination is too restrictive, fill the session
    // with bodyweight movements rather than inventing unavailable exercises.
    if(ex.length<5){
      for(const group of [MOV.legs,MOV.push,MOV.pull,MOV.core]){
        if(ex.length>=5)break;
        for(const item of pick(group,eq.concat(['bodyweight']),5-ex.length,used)){
          if(!usedGlobal.has(item[0])){usedGlobal.add(item[0]);ex.push([item[0],repTarget(item[2],level),item[2]==='core'?'time-or-reps':'weight']);}
        }
      }
    }

    const labelFocus=focus==='Full Body'?'Full Body':focus;
    return {
      id:201+index,
      n:`Home Gym ${label}`,
      f:`${labelFocus} · ${level} · ${ex.length} gerakan · ${duration(level)}`,
      equipment:equipmentLabel(eq),
      focus,
      rest:LEVELS[level].rest,
      ex
    };
  }

  function focusFor(level,days){
    if(days<=3)return ['Full Body','Full Body','Full Body'];
    if(days===4)return ['Upper','Lower','Upper','Lower'];
    if(days===5)return level==='Pemula'?['Full Body','Upper','Lower','Upper','Full Body']:['Push','Pull','Legs','Upper','Lower'];
    return ['Push','Pull','Legs','Push','Pull','Legs'];
  }

  function generatePlan(level,days,eq){
    const global=new Set();
    return focusFor(level,days).map((focus,i)=>makeSession(String.fromCharCode(65+i),focus,level,eq,i,global));
  }

  function defaultState(){return {level:'Pemula',days:LEVELS.Pemula.recommended,equipment:['bodyweight','dumbbell']};}
  function getState(){
    let s=ls.get(STORAGE_KEY,null);if(!s||!LEVELS[s.level])s=defaultState();
    const L=LEVELS[s.level];s.days=Math.min(L.max,Math.max(L.min,Number(s.days)||L.recommended));
    s.equipment=unique(Array.isArray(s.equipment)?s.equipment.filter(x=>EQUIPMENT.some(e=>e[0]===x)):[]);
    if(!s.equipment.length)s.equipment=['bodyweight'];
    if(!s.equipment.includes('bodyweight'))s.equipment.unshift('bodyweight');
    return s;
  }
  function saveState(s){ls.set(STORAGE_KEY,s);}
  function installPlan(plan){plan.forEach(p=>{PROG[p.id]={n:p.n,f:p.f,ex:p.ex.map(x=>x.slice())};});}

  window.apStartHomeWorkout = function(id){ return startHome(Number(id)); };

  function startHome(id){
    const st=getState(),sessions=generatePlan(st.level,st.days,st.equipment);installPlan(sessions);
    const session=sessions.find(x=>x.id===id);if(!session)return;
    if(window.__apHomeGymSmartize)window.__apHomeGymSmartize();
    if(getA()){toast('Selesaikan atau batalkan workout yang sedang berjalan dulu.');return;}
    tab='workout';startWorkout(id);
  }

  function switcher(){return `<div class="workout-mode-switch" role="tablist" aria-label="Jenis latihan">
    <button class="workout-mode-btn" data-workout-mode="gym" aria-selected="${workoutMode==='gym'?'true':'false'}">Gym</button>
    <button class="workout-mode-btn" data-workout-mode="home" aria-selected="${workoutMode==='home'?'true':'false'}">Home Gym</button>
  </div>`;}

  function equipmentChips(selected){return EQUIPMENT.map(([id,label,desc])=>`<button type="button" class="chip home-eq-chip" data-heq="${id}" aria-pressed="${selected.includes(id)?'true':'false'}"><b>${label}</b><small>${desc}</small></button>`).join('');}

  function plannerSheet(){
    const st=getState();
    const o=document.createElement('div');o.className='sheetbg home-gym-planner-modal';
    o.innerHTML=`<div class="sheet home-gym-planner" role="dialog" aria-modal="true" aria-label="Sesuaikan program Home Gym">
      <div class="grab"></div><h2>Sesuaikan Program Home Gym</h2>
      <p class="sub">Program dibuat ulang berdasarkan level, frekuensi latihan, dan alat yang benar-benar Anda miliki.</p>
      <p class="pkh">Level latihan</p><div class="chips home-levels" id="hgl"></div>
      <p class="pkh">Latihan per minggu</p><div class="chips" id="hgd"></div>
      <p class="pkh">Alat yang dimiliki di rumah</p><div class="home-equipment-grid" id="hge"></div>
      <div class="home-personal-preview" id="hgp"></div>
      <button class="btn" id="hgapply">Buat Program Personal</button>
      <button class="btn ghost sm" id="hgclose">Tutup</button>
    </div>`;
    const draw=()=>{
      const range=LEVELS[st.level];
      o.querySelector('#hgl').innerHTML=Object.keys(LEVELS).map(k=>`<button class="chip" data-hgl="${k}" aria-current="${k===st.level?'true':'false'}">${k}</button>`).join('');
      o.querySelector('#hgd').innerHTML=Array.from({length:range.max-range.min+1},(_,i)=>range.min+i).map(d=>`<button class="chip" data-hgd="${d}" aria-current="${d===st.days?'true':'false'}">${d}x${d===range.recommended?' · rekomendasi':''}</button>`).join('');
      o.querySelector('#hge').innerHTML=equipmentChips(st.equipment);
      const sessions=generatePlan(st.level,st.days,st.equipment);
      o.querySelector('#hgp').innerHTML=`<div><span>PROGRAM</span><b>${st.days} sesi / minggu</b></div><div><span>PEMBAGIAN</span><b>${unique(sessions.map(x=>x.focus)).join(' · ')}</b></div><div><span>DURASI</span><b>${duration(st.level)}</b></div><p>${LEVELS[st.level].desc} Program akan mengutamakan alat yang dipilih dan memakai bodyweight sebagai dasar.</p>`;
    };
    const close=()=>{o.classList.add('out');setTimeout(()=>o.remove(),220);document.removeEventListener('keydown',kd);};
    const kd=e=>{if(e.key==='Escape')close();};
    o.addEventListener('click',e=>{
      if(e.target===o){close();return;}
      const l=e.target.closest('[data-hgl]'),d=e.target.closest('[data-hgd]'),q=e.target.closest('[data-heq]');
      if(l){st.level=l.dataset.hgl;const r=LEVELS[st.level];st.days=Math.min(r.max,Math.max(r.min,st.days));draw();return;}
      if(d){st.days=Number(d.dataset.hgd);draw();return;}
      if(q){const id=q.dataset.heq;if(id==='bodyweight'){st.equipment=['bodyweight'];draw();return;}st.equipment=st.equipment.includes(id)?st.equipment.filter(x=>x!==id):st.equipment.concat(id);if(!st.equipment.includes('bodyweight'))st.equipment.unshift('bodyweight');draw();return;}
      if(e.target.closest('#hgclose')){close();return;}
      if(e.target.closest('#hgapply')){saveState(st);close();render();toast('Program Home Gym personal diperbarui.');return;}
    });
    draw();document.body.appendChild(o);document.addEventListener('keydown',kd);
  }

  function programCard(p){
    const st=getState();
    return `<article class="home-workout-program">
      <div class="home-workout-program-top"><span class="home-workout-kicker">${escSafe(p.n.replace('Home Gym ','').toUpperCase())}</span><span class="home-workout-count">${p.ex.length} gerakan</span></div>
      <h2>${escSafe(p.n)}</h2><p class="sub">${escSafe(p.f)}</p>
      <div class="home-workout-meta"><span>${escSafe(p.focus)}</span><span>${escSafe(st.level)}</span><span>Istirahat ${escSafe(p.rest)}</span></div>
      <div class="home-workout-exercises">${p.ex.map((e,i)=>`<div><span>${i+1}</span><b>${escSafe(e[0])}</b><small>${escSafe(e[1])}</small></div>`).join('')}</div>
      <button class="btn" data-home-start="${p.id}">Mulai ${escSafe(p.n)}</button>
    </article>`;
  }

  function homeView(){
    const st=getState(),sessions=generatePlan(st.level,st.days,st.equipment);installPlan(sessions);
    return `<div class="home-workout-view">${switcher()}
      <header class="home-workout-head"><div><p class="dashboard-eyebrow">WORKOUT</p><h1>Home Gym</h1><p class="sub">Program personal berdasarkan level, frekuensi latihan, dan alat yang tersedia di rumah.</p></div><button class="btn ghost" data-home-planner>Sesuaikan Program</button></header>
      <section class="card home-gym-summary"><div><span>LEVEL</span><b>${escSafe(st.level)}</b></div><div><span>FREKUENSI</span><b>${st.days}x / minggu</b></div><div><span>PERALATAN</span><b>${escSafe(equipmentLabel(st.equipment))}</b></div></section>
      <section class="card home-gym-personal-note"><div><b>Program personal aktif</b><p>${escSafe(LEVELS[st.level].desc)} Jadwal, volume, dan pilihan gerakan disesuaikan dengan ${st.days} sesi per minggu dan peralatan yang Anda pilih.</p></div><button class="btn ghost sm" data-home-planner>Ubah</button></section>
      <section class="home-workout-section"><div class="home-workout-section-title"><div><h2>Jadwal Home Gym</h2><p>Setiap sesi dibuat dari pilihan Anda dan dapat langsung dimulai.</p></div></div><div class="home-workout-grid">${sessions.map(programCard).join('')}</div></section>
      <section class="home-workout-section"><div class="home-workout-section-title"><div><h2>Peralatan aktif</h2><p>Bodyweight selalu tersedia sebagai fondasi agar program tetap fleksibel.</p></div></div><div class="home-workout-equipment">${EQUIPMENT.filter(e=>st.equipment.includes(e[0])).map(e=>`<div class="card"><h3>${escSafe(e[1])}</h3><p class="sub">${escSafe(e[2])}</p></div>`).join('')}</div></section>
    </div>`;
  }

  let workoutMode=ls.get(MODE_KEY,'gym');if(workoutMode!=='gym'&&workoutMode!=='home')workoutMode='gym';
  const originalView=view;
  view=function(){
    if(tab==='workout'&&!getA()&&workoutMode==='home')return homeView();
    if(tab==='workout'&&!getA()){const html=originalView();return html.replace('<h1>Workout</h1>',switcher()+'<h1>Workout</h1>');}
    return originalView();
  };

  document.addEventListener('click',function(e){
    const mode=e.target.closest&&e.target.closest('[data-workout-mode]');
    if(mode){workoutMode=mode.dataset.workoutMode==='home'?'home':'gym';ls.set(MODE_KEY,workoutMode);render();scrollTo(0,0);return;}
    if(e.target.closest&&e.target.closest('[data-home-planner]')){plannerSheet();return;}
    const start=e.target.closest&&e.target.closest('[data-home-start]');if(start){startHome(Number(start.dataset.homeStart));return;}
  });
})();
