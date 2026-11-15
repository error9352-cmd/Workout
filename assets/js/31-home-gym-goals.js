/* ATHLETIC PHYSIQUE — Home Gym Goal Engine
 * Additive layer: training goal personalization on top of the existing Home Gym engine.
 * Goals: Muscle Gain, Strength, Fat Loss, Athletic Performance.
 */
(function(){
  'use strict';
  const KEY='ap_home_gym_goal_v1';
  const GOALS={
    'Muscle Gain':{desc:'Prioritas hipertrofi: volume cukup tinggi, repetisi moderat, dan progres beban bertahap.',rest:'60–120 detik',main:'8–12',accessory:'10–15',core:'10–20',setsMul:1},
    'Strength':{desc:'Prioritas kekuatan: gerakan utama lebih berat, repetisi lebih rendah, dan istirahat lebih panjang.',rest:'120–180 detik',main:'5–8',accessory:'8–12',core:'8–15',setsMul:1},
    'Fat Loss':{desc:'Prioritas mempertahankan otot sambil meningkatkan kepadatan latihan dan pengeluaran energi.',rest:'45–75 detik',main:'8–15',accessory:'10–20',core:'12–20',setsMul:0},
    'Athletic Performance':{desc:'Prioritas kemampuan atletik: kekuatan relatif, kontrol tubuh, unilateral, dan core.',rest:'60–120 detik',main:'5–10',accessory:'8–15',core:'10–20',setsMul:0}
  };
  const defaultGoal='Muscle Gain';
  const getGoal=()=>{const g=ls.get(KEY,defaultGoal);return GOALS[g]?g:defaultGoal;};
  const saveGoal=g=>ls.set(KEY,g);
  const escG=v=>typeof esc==='function'?esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function targetParts(t){const m=String(t||'').match(/^(\d+)\s*×\s*(\d+)\s*[–-]\s*(\d+)/);return m?{sets:+m[1],lo:+m[2],hi:+m[3]}:null;}
  function goalTarget(base,kind,goal){
    const r=targetParts(base); if(!r)return base;
    const g=GOALS[goal];
    let sets=r.sets;
    if(goal==='Strength'&&kind==='main')sets=Math.max(2,r.sets);
    if(goal==='Fat Loss')sets=Math.max(2,r.sets);
    if(goal==='Athletic Performance'&&kind==='core')sets=Math.max(2,r.sets);
    const range=kind==='main'?g.main:kind==='core'?g.core:g.accessory;
    return `${sets} × ${range}`;
  }
  function applyGoalToPlan(){
    const goal=getGoal(), g=GOALS[goal];
    if(typeof PROG!=='object')return;
    Object.keys(PROG).map(Number).filter(k=>k>=201&&k<=206).forEach(k=>{
      const p=PROG[k];if(!p||!Array.isArray(p.ex))return;
      p.f=String(p.f||'').replace(/ · Tujuan:.*$/,'')+` · Tujuan: ${goal}`;
      p.rest=g.rest;
      p.ex=p.ex.map(e=>{const base=e._hgGoalBase||e[1];e._hgGoalBase=base;return [e[0],goalTarget(base,e[2]==='time-or-reps'?'core':'main',goal),e[2]];});
    });
  }

  function goalCard(){
    const g=getGoal(),d=GOALS[g];
    return `<section class="card hg-goal-card"><div><span class="hg-goal-kicker">TUJUAN LATIHAN</span><h2>${escG(g)}</h2><p class="sub">${escG(d.desc)}</p></div><button class="btn ghost sm" data-hg-goal>Ubah tujuan</button></section>`;
  }
  function goalSheet(){
    const o=document.createElement('div');o.className='sheetbg hg-goal-modal';
    o.innerHTML=`<div class="sheet hg-goal-sheet" role="dialog" aria-modal="true" aria-label="Tujuan latihan Home Gym"><div class="grab"></div><h2>Tujuan latihan</h2><p class="sub">Tujuan ini mengubah rentang repetisi, volume, dan waktu istirahat program Home Gym.</p><div class="hg-goal-options">${Object.entries(GOALS).map(([k,v])=>`<button class="hg-goal-option ${k===getGoal()?'selected':''}" data-hg-goal-value="${escG(k)}"><span>${escG(k)}</span><small>${escG(v.desc)}</small></button>`).join('')}</div><button class="btn" data-hg-goal-save>Simpan tujuan</button><button class="btn ghost sm" data-hg-goal-close>Tutup</button></div>`;
    let selected=getGoal();
    const close=()=>{o.remove();};
    o.addEventListener('click',e=>{
      const opt=e.target.closest('[data-hg-goal-value]');
      if(opt){selected=opt.dataset.hgGoalValue;o.querySelectorAll('.hg-goal-option').forEach(x=>x.classList.toggle('selected',x===opt));}
      if(e.target.closest('[data-hg-goal-close]'))close();
      if(e.target.closest('[data-hg-goal-save]')){saveGoal(selected);close();render();toast('Tujuan Home Gym diperbarui.');}
    });
    document.body.appendChild(o);
  }

  const oldView=view;
  view=function(){
    if(tab==='workout')applyGoalToPlan();
    const html=oldView();
    if(tab==='workout' && html.includes('Program personal aktif') && html.includes('Home Gym')){
      return html.replace('<section class="card home-gym-summary">',goalCard()+'<section class="card home-gym-summary">');
    }
    return html;
  };

  document.addEventListener('click',e=>{if(e.target.closest('[data-hg-goal]'))goalSheet();});
  applyGoalToPlan();
})();
