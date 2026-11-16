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

  function profileDraft(){
    let p={};try{p=typeof prof==='function'?(prof()||{}):ls.get('ap_profile',{})||{}}catch(e){}
    let recv={};try{recv=ls.get('ap_recv',{})||{}}catch(e){}
    const level=LEVELS[String(recv.l||p.level||'')]?String(recv.l||p.level):'Pemula';
    const rawDays=Number(recv.d||p.freq||LEVELS[level].recommended);
    const days=Math.min(LEVELS[level].max,Math.max(LEVELS[level].min,rawDays||LEVELS[level].recommended));
    return {level,days,equipment:['bodyweight']};
  }
  function defaultState(){return profileDraft();}
  function hasPersonalPlan(){
    try{const s=ls.get(STORAGE_KEY,null);return !!(s&&LEVELS[s.level]&&Array.isArray(s.equipment)&&s.equipment.length&&Number(s.days));}
    catch(e){return false;}
  }
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
    if(!hasPersonalPlan()){toast('Sesuaikan program Home Gym terlebih dahulu.');plannerSheet();return;}
    const st=getState(),sessions=applyHomeOverrides(generatePlan(st.level,st.days,st.equipment));installPlan(sessions);
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
      <div class="home-personal-program-preview" id="hgrp"></div>
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
      const dayIndexes=homeScheduleIndexes(st.days);
      o.querySelector('#hgrp').innerHTML=`<p class="pkh">Preview latihan</p>`+sessions.map((p,i)=>{
        const title=`${HARI[dayIndexes[i]]} · ${p.n}`;
        const meta=`${p.f} · ${p.ex.length} gerakan`;
        return typeof window.apTplCard==='function'
          ? window.apTplCard(escSafe(title),escSafe(meta),'',Object.assign({},p,{l:st.level,f:p.f}))
          : `<div style="padding:10px 0;border-top:1px solid var(--line)"><b>${escSafe(title)}</b><small class="prev" style="display:block">${escSafe(meta)}</small>${window.apExList?window.apExList(p):''}</div>`;
      }).join('');
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
      if(e.target.closest('#hgapply')){clearHomeOverrides();saveState(st);close();render();toast('Program Home Gym personal diperbarui.');return;}
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

  function homeScheduleIndexes(days){
    return days<=3?[1,3,5]:days===4?[1,2,4,6]:days===5?[1,2,3,5,6]:[1,2,3,4,5,6];
  }

  function homeDayMuscles(p){
    try{
      if(typeof dayMus==='function'&&p&&Array.isArray(p.ex)){
        const m=dayMus(p);
        if(m)return m;
      }
    }catch(e){}
    return unique([p&&p.focus||'']).filter(Boolean).join(' · ');
  }

  function homeSideCard(st){
    const sessions=generatePlan(st.level,st.days,st.equipment);
    const indexes=homeScheduleIndexes(st.days);
    const schedule=sessions.map((p,i)=>`<div class="row"><span>${HARI[indexes[i]]} · ${escSafe(p.n)}<small class="prev" style="display:block">${escSafe(p.focus)} · ${p.ex.length} gerakan</small></span><span class="mute">${escSafe(p.rest)}</span></div>`).join('');
    const equipment=EQUIPMENT.filter(e=>st.equipment.includes(e[0])).map(e=>`<div class="row"><span>${escSafe(e[1])}</span><span class="mute">${escSafe(e[2])}</span></div>`).join('');
    return `<section class="card home-gym-side-card"><h2>Jadwal mingguan</h2><p class="sub">Pembagian latihan berdasarkan level, frekuensi, dan peralatan Home Gym.</p>${schedule}<button class="btn ghost sm" data-home-rec-open>Rekomendasi jadwal mingguan</button><h2 class="home-side-subtitle">Peralatan aktif</h2><p class="sub">Peralatan yang digunakan untuk membentuk program Home Gym.</p>${equipment}<button class="btn ghost sm" data-home-planner>Ubah peralatan</button></section>`;
  }

  function homeRecommendationSheet(){
    const current=getState(), st={level:current.level,days:current.days,equipment:current.equipment.slice()}, armed=false;
    const o=document.createElement('div');o.className='sheetbg schedule-recommendation-modal home-gym-recommendation-modal';
    o.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="Rekomendasi jadwal mingguan Home Gym"><div class="grab"></div><h2>Rekomendasi jadwal mingguan</h2><p class="sub">Pilih level, frekuensi, dan peralatan. Preview program akan berubah langsung tanpa meninggalkan halaman.</p><p class="pkh">Level</p><div class="chips" id="hrl"></div><p class="pkh">Hari latihan per minggu</p><div class="chips" id="hrd"></div><p class="pkh">Peralatan tersedia</p><div class="chips" id="hre"></div><p class="prev" id="hrn"></p><div id="hrp"></div><button class="btn" id="hra" style="margin-top:14px">Terapkan ke jadwal</button><button class="btn ghost sm" id="hrx">Tutup</button></div>`;
    const preview=()=>{
      const sessions=generatePlan(st.level,st.days,st.equipment);
      const dayNames=['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
      const indexes=st.days<=3?[0,2,4]:st.days===4?[0,1,3,5]:st.days===5?[0,1,2,4,5]:[0,1,2,3,4,5];
      const adapt=ls.get('ap_home_gym_weekly_adaptation_v1',null);
      let note=`${LEVELS[st.level].desc} Jadwal menggunakan ${st.days} sesi dengan pembagian ${unique(sessions.map(x=>x.focus)).join(', ')}.`;
      if(adapt&&adapt.action)note+=` Adaptasi minggu terakhir: ${String(adapt.action).replace(/_/g,' ')}.`;
      o.querySelector('#hrn').textContent=note;
      o.querySelector('#hrp').innerHTML=sessions.map((p,i)=>{
        const title=`${dayNames[indexes[i]??i]} · ${p.n}`;
        const meta=`${p.focus} · ${p.ex.length} gerakan · ${p.rest}`;
        return typeof window.apTplCard==='function'
          ? window.apTplCard(escSafe(title),escSafe(meta),'',Object.assign({},p,{l:st.level,f:p.f}))
          : `<div style="padding:10px 0;border-top:1px solid var(--line)"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span style="flex:1"><b>${escSafe(title)}</b><small class="prev" style="display:block">${escSafe(meta)}</small></span></div><div>${window.apExList?window.apExList(p):''}</div></div>`;
      }).join('');
    };
    const draw=()=>{
      const range=LEVELS[st.level];
      o.querySelector('#hrl').innerHTML=Object.keys(LEVELS).map(k=>`<button class="chip" data-hrl="${k}" aria-current="${k===st.level?'true':'false'}">${k}</button>`).join('');
      o.querySelector('#hrd').innerHTML=Array.from({length:range.max-range.min+1},(_,i)=>range.min+i).map(d=>`<button class="chip" data-hrd="${d}" aria-current="${d===st.days?'true':'false'}">${d}x${d===range.recommended?' · rekomendasi':''}</button>`).join('');
      o.querySelector('#hre').innerHTML=EQUIPMENT.map(([id,label])=>`<button class="chip" data-hre="${id}" aria-pressed="${st.equipment.includes(id)?'true':'false'}">${escSafe(label)}</button>`).join('');
      preview();
    };
    const close=()=>{o.classList.add('out');setTimeout(()=>o.remove(),220);document.removeEventListener('keydown',kd);};
    const kd=e=>{if(e.key==='Escape')close();};
    o.addEventListener('click',e=>{
      if(e.target===o){close();return;}
      const l=e.target.closest('[data-hrl]'),d=e.target.closest('[data-hrd]'),q=e.target.closest('[data-hre]');
      if(l){st.level=l.dataset.hrl;const r=LEVELS[st.level];st.days=Math.min(r.max,Math.max(r.min,st.days));draw();return;}
      if(d){st.days=Number(d.dataset.hrd);draw();return;}
      if(q){const id=q.dataset.hre;if(id==='bodyweight'){st.equipment=['bodyweight'];draw();return;}st.equipment=st.equipment.includes(id)?st.equipment.filter(x=>x!==id):st.equipment.concat(id);if(!st.equipment.includes('bodyweight'))st.equipment.unshift('bodyweight');draw();return;}
      if(e.target.closest('#hrx')){close();return;}
      if(e.target.closest('#hra')){
        if(getA()){toast('Selesaikan atau batalkan workout yang sedang berjalan dulu.');return;}
        if(!armed){armed=true;e.target.closest('#hra').textContent='Tekan lagi untuk menerapkan jadwal';return;}
        clearHomeOverrides();
        saveState(st);
        installPlan(generatePlan(st.level,st.days,st.equipment));
        close();render();toast(`Jadwal Home Gym diperbarui: ${st.days} hari per minggu.`);
      }
    });
    draw();document.body.appendChild(o);document.addEventListener('keydown',kd);
  }

  function homeSetupView(){
    const st=profileDraft();
    const levelLabel=escSafe(st.level),freqLabel=`${st.days} hari/minggu`;
    return `${switcher()}
      <h1>Home Gym</h1><p class="sub">Program belum disesuaikan dengan kebutuhan Home Gym Anda.</p>
      <section class="card home-gym-setup-card">
        <h2>Sesuaikan program Home Gym</h2>
        <p class="sub">Kami sudah menyiapkan level <b>${levelLabel}</b> dan frekuensi <b>${freqLabel}</b> dari profil Anda. Pilih peralatan yang benar-benar tersedia agar latihan yang muncul sesuai kondisi rumah Anda.</p>
        <div class="home-personal-preview"><div><span>LEVEL</span><b>${levelLabel}</b></div><div><span>FREKUENSI</span><b>${freqLabel}</b></div><div><span>ALAT AWAL</span><b>Tanpa alat</b></div></div>
        <button class="btn" data-home-planner>Sesuaikan program</button>
      </section>
    `;
  }

  function homeEditHtml(d,day){
    const exercises=d.ex.map((e,i)=>{
      const m=String(e[1]||'').match(/^(\d+)\s*×\s*(\d+)\s*[–-]\s*(\d+)$/),sets=m?+m[1]:3,lo=m?+m[2]:8,hi=m?+m[3]:12;
      return `<div class="erow"><div><input data-home-en="${i}" value="${escSafe(e[0])}" aria-label="Nama latihan">${typeof apThumb==='function'?`<div class="apr" style="margin-top:6px"><button class="apb" data-pvx="${escSafe(e[0])}" aria-label="Lihat foto ${escSafe(e[0])}">${apThumb(e[0])}</button><button class="apb apm" data-pvx="${escSafe(e[0])}"><b>${escSafe(e[0])}</b><small>${escSafe(apInfoLine(e[0]))}</small></button></div>`:''}</div><div class="target-stepper" data-home-ts="${i}"><div class="target-step"><button type="button" class="step-btn" data-home-step="set" data-dir="-1" aria-label="Kurangi set">−</button><span data-home-step-value="set">${sets} set</span><button type="button" class="step-btn" data-home-step="set" data-dir="1" aria-label="Tambah set">+</button></div><span class="target-mul">×</span><div class="target-step"><button type="button" class="step-btn" data-home-step="rep" data-dir="-1" aria-label="Kurangi repetisi">−</button><span data-home-step-value="rep">${lo}–${hi}</span><button type="button" class="step-btn" data-home-step="rep" data-dir="1" aria-label="Tambah repetisi">+</button></div><input type="hidden" data-home-et="${i}" value="${sets} × ${lo}–${hi}"></div><button class="ok" data-home-del="${i}">Hapus</button></div>`;
    }).join('');
    return `<label for="home-dn">Nama hari</label><input id="home-dn" data-home-dn value="${escSafe(d.n)}" maxlength="24"><div class="chips" style="margin-top:6px">${['Push','Pull','Legs','Upper','Lower','Full Body','Cardio dan Core'].map(n=>`<button class="chip" data-home-nm="${escSafe(n)}">${n}</button>`).join('')}</div><label for="home-df">Fokus</label><input id="home-df" data-home-df value="${escSafe(d.f)}" maxlength="60"><label>Hari latihan</label><input value="${escSafe(HARI[day])}" disabled><label>Latihan</label>${exercises}<button class="btn ghost sm" data-home-pickex>Pilih dari daftar gerakan</button><label>Tambah latihan (ketik sendiri)</label><div class="erow"><input id="home-nn" placeholder="Nama latihan"><input id="home-nt" placeholder="3 × 10–12"><button class="ok" data-home-add>Tambah</button></div><button class="btn" data-home-save>Selesai edit</button>`;
  }

  function homeExercisePicker(){
    if(!homeEditDraft)return;
    const o=document.createElement('div');o.className='sheetbg';
    let cat='Semua',qs='',det=null;

    // Home Gym must use the Home library only. The centralized catalog marks
    // Home-only movements as "home" and movements valid in both environments
    // as "both". Gym-only movements are deliberately excluded here.
    const catalog=window.apExerciseCatalog;
    const allMeta=catalog&&typeof catalog.list==='function'?catalog.list():[];
    const fallback=[...new Set((window.apALL||[]).map(n=>String(n||'').trim()).filter(Boolean))]
      .map(n=>Object.assign({name:n},catalog&&typeof catalog.get==='function'?catalog.get(n):{}));
    const source=allMeta.length?allMeta:fallback;
    const homeMeta=source.filter(m=>m&&m.name&&(['home','both'].includes(String(m.location||'').toLowerCase())));
    const homeNames=[...new Set(homeMeta.map(m=>m.name))];
    const homeByName=new Map(homeMeta.map(m=>[m.name,m]));
    const categories=['Semua',...new Set(homeMeta.map(m=>m.category||'Lainnya').filter(Boolean))];

    o.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="Pilih gerakan Home Gym"><div class="grab"></div><h2>Pilih gerakan Home Gym</h2><p class="sub">Pilih hanya gerakan yang tersedia untuk Home Gym. Ketuk foto atau nama untuk melihat preview gerakan.</p><input id="heq" placeholder="Cari gerakan…" aria-label="Cari gerakan Home Gym"><div class="chips" id="hec"></div><div id="hel"></div><button class="btn" id="hed">Selesai</button></div>`;

    const selected=()=>new Set(homeEditDraft.ex.map(e=>e[0]));
    const draw=()=>{
      const listEl=o.querySelector('#hel');
      if(det){
        const meta=homeByName.get(det)||{};
        const preview=typeof apDetail==='function'
          ? apDetail(det,`<button class="btn ghost sm" data-home-back-picker>‹ Kembali ke daftar</button>`)
          : `<button class="btn ghost sm" data-home-back-picker>‹ Kembali ke daftar</button><h2>${escSafe(det)}</h2>${typeof apThumb==='function'?`<div class="exw" data-s="1">${apThumb(det)}</div>`:''}<p class="sub">${escSafe(meta.equipment||'Peralatan Home Gym')}</p>`;
        listEl.innerHTML=preview;
        return;
      }

      const catButtons=categories.map(k=>`<button class="chip" data-home-cat="${escSafe(k)}" ${cat===k?'aria-current="true"':''}>${escSafe(k)}</button>`).join('');
      o.querySelector('#hec').innerHTML=catButtons;
      const q=qs.toLowerCase();
      const pool=cat==='Semua'?homeNames:homeMeta.filter(m=>(m.category||'Lainnya')===cat).map(m=>m.name);
      const list=[...new Set(pool)].filter(n=>!q||n.toLowerCase().includes(q)).slice(0,60);
      const sel=selected();
      listEl.innerHTML=list.map(n=>{
        const meta=homeByName.get(n)||{};
        const thumb=typeof apThumb==='function'?apThumb(n):'';
        const info=typeof apInfoLine==='function'?apInfoLine(n):(meta.equipment||'Home Gym');
        return `<div class="apr home-exercise-picker-row">
          <button class="apb" data-home-pv="${escSafe(n)}" aria-label="Preview ${escSafe(n)}">${thumb}</button>
          <button class="apb apm" data-home-pv="${escSafe(n)}"><b>${escSafe(n)}</b><small>${escSafe(info)}</small></button>
          <button class="chip" data-home-pick="${escSafe(n)}" aria-pressed="${sel.has(n)?'true':'false'}">${sel.has(n)?'Dipilih ✓':'Tambah'}</button>
        </div>`;
      }).join('')||'<p class="mute">Tidak ada gerakan Home Gym yang cocok.</p>';
    };

    o.addEventListener('input',e=>{if(e.target.id==='heq'){qs=e.target.value.trim();draw();}});
    o.addEventListener('click',e=>{
      if(e.target===o){o.remove();return;}
      const c=e.target.closest('[data-home-cat]');
      if(c){cat=c.dataset.homeCat;qs='';o.querySelector('#heq').value='';draw();return;}
      const pv=e.target.closest('[data-home-pv]');
      if(pv){det=pv.dataset.homePv;draw();return;}
      if(e.target.closest('[data-home-back-picker]')){det=null;draw();return;}
      const b=e.target.closest('[data-home-pick]');
      if(b){
        const n=b.dataset.homePick,i=homeEditDraft.ex.findIndex(x=>x[0]===n);
        if(i>=0)homeEditDraft.ex.splice(i,1);
        else{
          const tg=/Plank|Side Plank/.test(n)?'3 × 30–40 detik':/Treadmill|Sepeda Statis|Elliptical|Rowing Machine|Stair Climber|Jalan Cepat|Lompat Tali/.test(n)?'1 × 15–20 menit':'3 × 8–12';
          homeEditDraft.ex.push([n,tg,typeof exMode==='function'?exMode([n,tg]):undefined]);
        }
        draw();return;
      }
      if(e.target.id==='hed'){o.remove();render();return;}
    });
    draw();document.body.appendChild(o);
  }

  function homeView(){
    if(!hasPersonalPlan())return homeSetupView();
    const st=getState(),sessions=applyHomeOverrides(generatePlan(st.level,st.days,st.equipment)),indexes=homeScheduleIndexes(st.days);
    if(!indexes.includes(homeViewDay))homeViewDay=indexes[0];
    const selectedIndex=Math.max(0,indexes.indexOf(homeViewDay));
    const selected=sessions[selectedIndex]||sessions[0];
    const selectedDay=indexes[selectedIndex]??indexes[0];
    installPlan(sessions);
    const dayCards=sessions.map((p,i)=>{const d=indexes[i];return `<button class="dp" role="listitem" aria-current="${d===selectedDay?'true':'false'}" data-home-day="${d}"><span class="dpd">${HARI[d]}</span><b class="dpn">${escSafe(p.n)}</b><span class="dpc">${p.ex.length} gerakan</span><span class="dpm">${escSafe(homeDayMuscles(p))}</span></button>`}).join('');
    const exList=selected.ex.map(e=>`<div class="row"><span>${escSafe(e[0])}</span><span class="mute">${escSafe(e[1])}</span></div>`).join('');
    const editor=homeEditing&&homeEditDraft&&homeEditDraft.id===selected.id?homeEditHtml(homeEditDraft,selectedDay):`<h2>${escSafe(selected.n)}</h2><p class="sub">${escSafe(selected.f)}</p>${exList}<button class="btn ghost sm" data-home-edit style="margin-top:10px">Edit program</button>`;
    return `${switcher()}
      <h1>Home Gym</h1><p class="sub">${HARI[selectedDay]}: ${escSafe(selected.n)}</p>
      <h2 style="margin-top:16px">Pilih latihan</h2><div class="dpick" role="list">${dayCards}</div>
      <section class="workout-start-card" aria-label="Mulai workout Home Gym"><div class="wsc-top"><span class="wsc-kicker">SIAP LATIHAN</span><span class="wsc-meta">${selected.ex.length} gerakan</span></div><p class="sub" style="margin:7px 0 10px">Setiap gerakan menyesuaikan pencatatan: beban, berat badan, atau waktu.</p><button class="btn" data-home-start="${selected.id}">Mulai ${escSafe(selected.n)}</button></section>
      <section class="card">${editor}</section>
      <section class="card"><h2>Semua program</h2>${sessions.map((p,i)=>`<div class="row"><span>${HARI[indexes[i]]} · ${escSafe(p.n)}<small class="prev" style="display:block">${escSafe(p.focus)} · ${p.ex.length} gerakan</small></span><span class="mute">${p.ex.length} latihan</span></div>`).join('')}</section>
      ${homeSideCard(st)}
    `;
  }

  let homeViewDay=ls.get('ap_home_view_day',null);
  let homeEditing=false;
  let homeEditDraft=null;
  const HOME_EDIT_KEY='ap_home_gym_program_overrides_v1';
  function homeOverrides(){try{return ls.get(HOME_EDIT_KEY,null)||{}}catch(e){return {}}}
  function clearHomeOverrides(){ls.set(HOME_EDIT_KEY,{})}
  function applyHomeOverrides(sessions){
    const ov=homeOverrides();
    return sessions.map(p=>{
      const x=ov[String(p.id)];
      return x?Object.assign({},p,{n:x.n||p.n,f:x.f||p.f,ex:Array.isArray(x.ex)?x.ex.map(e=>e.slice()):p.ex.map(e=>e.slice())}):p;
    });
  }
  function saveHomeDraft(){
    if(!homeEditDraft)return;
    const ov=homeOverrides();
    ov[String(homeEditDraft.id)]={n:homeEditDraft.n,f:homeEditDraft.f,ex:homeEditDraft.ex.map(e=>e.slice())};
    ls.set(HOME_EDIT_KEY,ov);
  }
  let workoutMode=ls.get(MODE_KEY,'gym');if(workoutMode!=='gym'&&workoutMode!=='home')workoutMode='gym';
  const originalView=view;
  view=function(){
    if(tab==='workout'&&!getA()&&workoutMode==='home')return homeView();
    if(tab==='workout'&&!getA()){const html=originalView();return html.replace('<h1>Workout</h1>',switcher()+'<h1>Workout</h1>');}
    return originalView();
  };

  document.addEventListener('input',function(e){
    if(!homeEditDraft)return;
    if(e.target.matches&&e.target.matches('[data-home-dn]'))homeEditDraft.n=e.target.value.trim()||homeEditDraft.n;
    if(e.target.matches&&e.target.matches('[data-home-df]'))homeEditDraft.f=e.target.value.trim();
  });

  document.addEventListener('click',function(e){
    const mode=e.target.closest&&e.target.closest('[data-workout-mode]');
    if(mode){workoutMode=mode.dataset.workoutMode==='home'?'home':'gym';ls.set(MODE_KEY,workoutMode);render();scrollTo(0,0);return;}
    const hd=e.target.closest&&e.target.closest('[data-home-day]');if(hd){homeViewDay=Number(hd.dataset.homeDay);ls.set('ap_home_view_day',homeViewDay);render();return;}
    if(e.target.closest&&e.target.closest('[data-home-planner]')){plannerSheet();return;}
    if(e.target.closest&&e.target.closest('[data-home-edit]')){const st=getState(),sessions=applyHomeOverrides(generatePlan(st.level,st.days,st.equipment)),indexes=homeScheduleIndexes(st.days),idx=Math.max(0,indexes.indexOf(homeViewDay)),p=sessions[idx]||sessions[0];if(p){homeEditDraft={id:p.id,n:p.n,f:p.f,ex:p.ex.map(x=>x.slice())};homeEditing=true;render();scrollTo(0,0);}return;}
    if(e.target.closest&&e.target.closest('[data-home-save]')){saveHomeDraft();homeEditing=false;homeEditDraft=null;render();toast('Program Home Gym disimpan.');return;}
    if(e.target.closest&&e.target.closest('[data-home-nm]')&&homeEditDraft){homeEditDraft.n=e.target.closest('[data-home-nm]').dataset.homeNm;render();return;}
    if(e.target.closest&&e.target.closest('[data-home-del]')&&homeEditDraft){const i=+e.target.closest('[data-home-del]').dataset.homeDel;homeEditDraft.ex.splice(i,1);render();return;}
    if(e.target.closest&&e.target.closest('[data-home-pickex]')&&homeEditDraft){homeExercisePicker();return;}
    if(e.target.closest&&e.target.closest('[data-home-add]')&&homeEditDraft){const n=document.getElementById('home-nn')?.value.trim();if(!n){toast('Isi nama gerakan dulu.');return;}const tg=document.getElementById('home-nt')?.value.trim()||'3 × 10–12';homeEditDraft.ex.push([n,tg,typeof exMode==='function'?exMode([n,tg]):undefined]);render();return;}
    if(e.target.closest&&e.target.closest('[data-home-add-ex]')&&homeEditDraft){const n=document.getElementById('home-nn')?.value.trim();if(!n){toast('Isi nama gerakan dulu.');return;}const tg=document.getElementById('home-nt')?.value.trim()||'3 × 10–12';homeEditDraft.ex.push([n,tg,typeof exMode==='function'?exMode([n,tg]):undefined]);render();return;}
    if(e.target.closest&&e.target.closest('[data-home-ts]')&&homeEditDraft){const w=e.target.closest('[data-home-ts]'),b=e.target.closest('[data-home-step]');if(!b)return;const i=+w.dataset.homeTs,row=homeEditDraft.ex[i];if(!row)return;const m=String(row[1]||'').match(/^(\d+)\s*×\s*(\d+)\s*[–-]\s*(\d+)$/);if(!m)return;let sets=+m[1],lo=+m[2],hi=+m[3],dir=+b.dataset.dir;if(b.dataset.homeStep==='set')sets=Math.max(1,Math.min(99,sets+dir));else{lo=Math.max(1,Math.min(99,lo+dir));hi=Math.max(lo,Math.min(99,hi+dir));}row[1]=`${sets} × ${lo}–${hi}`;row[2]=typeof exMode==='function'?exMode(row):row[2];render();return;}
    if(e.target.closest&&e.target.closest('[data-home-dn]')&&homeEditDraft){homeEditDraft.n=e.target.value.trim()||homeEditDraft.n;return;}
    if(e.target.closest&&e.target.closest('[data-home-df]')&&homeEditDraft){homeEditDraft.f=e.target.value.trim();return;}
    if(e.target.closest&&e.target.closest('[data-home-planner]')){plannerSheet();return;}
    if(e.target.closest&&e.target.closest('[data-home-rec-open]')){homeRecommendationSheet();return;}
  });
})();
