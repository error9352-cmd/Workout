/* ATHLETIC PHYSIQUE — Weekly Coach Unified Integration v2
 * Stage 4: Weekly Coach is the execution bridge between weekly adaptation,
 * unified adaptive rotation, and the next workout.
 * Additive layer: historical sessions remain immutable.
 */
(function(){
  'use strict';

  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0};
  const esc=v=>typeof window.esc==='function'?window.esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const today=()=>typeof todayIso==='string'?todayIso:new Date().toISOString().slice(0,10);
  const sessions=()=>window.apTraining?window.apTraining.all():(typeof window.sessions==='function'?window.sessions():[]);
  const isHome=s=>/home\s*gym/i.test(String(s&&s.name||''));
  const modeSessions=mode=>sessions().filter(s=>mode==='home'?isHome(s):!isHome(s));
  const label=a=>({progression:'Naikkan Progres',maintenance:'Pertahankan & Progres',volume_reduction:'Kurangi Volume',rotation:'Rotasi Gerakan',deload:'Deload / Pemulihan'}[String(a||'').toLowerCase()]||'Evaluasi');

  function dominantMode(){
    const cur=sessions().filter(s=>String(s.date||'')>=weekStart()&&String(s.date||'')<=today());
    const h=cur.filter(isHome).length,g=cur.length-h;
    if(h&&!g)return 'home';
    if(g&&!h)return 'gym';
    if(typeof workoutMode!=='undefined'&&workoutMode==='home')return 'home';
    return 'gym';
  }
  // Keep Weekly Coach aligned with the same rolling 7-day window used by the
  // Gym/Home Gym weekly adaptation engines.
  function weekStart(){const d=new Date(today()+'T00:00:00');d.setDate(d.getDate()-6);return d.toISOString().slice(0,10)}

  function runAdaptive(mode){
    if(!window.apUnifiedAdaptive||typeof window.apUnifiedAdaptive.run!=='function')return [];
    try{return window.apUnifiedAdaptive.run(mode)||[]}catch(e){return []}
  }

  function executeMode(mode){
    const count=modeSessions(mode).filter(s=>String(s.date||'')>=weekStart()&&String(s.date||'')<=today()).length;
    if(!count)return {mode,count,decision:null,rotations:[]};
    let decision=null;
    try{
      if(mode==='home'&&window.apHomeGymWeeklyAdaptation){
        const m=window.apHomeGymWeeklyAdaptation.collect();
        decision=window.apHomeGymWeeklyAdaptation.decide(m);
        if(window.apHomeGymWeeklyAdaptation.applyDecision)window.apHomeGymWeeklyAdaptation.applyDecision(decision);
      }else if(mode==='gym'&&window.apGymIntelligence){
        const w=window.apGymIntelligence.weekly();
        decision=w&&w.decision;
        if(decision&&window.apGymIntelligence.applyWeeklyDecision)window.apGymIntelligence.applyWeeklyDecision(decision);
      }
    }catch(e){/* keep coach resilient */}
    const rotations=runAdaptive(mode);
    return {mode,count,decision,rotations};
  }

  function execute(){
    const gym=executeMode('gym');
    const home=executeMode('home');
    const primary=dominantMode()==='home'?home:gym;
    const base=window.apWeeklyAdaptationEngine&&typeof window.apWeeklyAdaptationEngine.evaluate==='function'
      ?window.apWeeklyAdaptationEngine.evaluate()
      :{metrics:{},decision:{action:'maintenance',title:'Pertahankan & Progres',tone:'neutral',reason:'Program berjalan sesuai data latihan.',next:'Lanjutkan program dan evaluasi kembali minggu depan.'},source:'Unified Weekly Adaptation'};
    const decision=primary.decision||base.decision;
    const rotations=[...gym.rotations,...home.rotations];
    const actions=[];
    if(gym.decision)actions.push({mode:'gym',decision:gym.decision,rotations:gym.rotations});
    if(home.decision)actions.push({mode:'home',decision:home.decision,rotations:home.rotations});
    return {base,gym,home,primary,decision,rotations,actions,mode:primary.mode,executedAt:Date.now()};
  }

  function rotationRows(items){
    if(!items.length)return `<div class="wc-adaptive-empty">Tidak ada rotasi gerakan yang diperlukan saat ini.</div>`;
    return items.slice(0,4).map(x=>`<div class="wc-adaptive-row"><div><b>${esc(x.from)}</b><span class="wc-arrow">→</span><b>${esc(x.to)}</b></div><small>${esc(x.reason||'Variasi dipilih berdasarkan evaluasi dan riwayat latihan.')}</small></div>`).join('');
  }

  function card(mode){
    const e=execute(),m=e.base.metrics||{},d=e.decision||{},pct=Math.round(num(m.adherence)*100),vol=num(m.volume)>=10000?(Math.round(num(m.volume)/100)/10)+' ton':Math.round(num(m.volume||0)).toLocaleString('id-ID')+' kg';
    const delta=num(m.volumeDelta)>0?'+'+m.volumeDelta+'%':(m.volumeDelta||0)+'%';
    const title=mode==='review'?'Weekly Review':'Weekly Coach';
    const subtitle=mode==='review'?'Keputusan minggu depan dan perubahan program yang benar-benar diterapkan.':'Coach membaca performa dan menghubungkannya langsung ke adaptasi workout berikutnya.';
    return `<section class="card weekly-coach-v2 ${mode==='review'?'weekly-review-v2':''}" aria-label="${title}">
      <div class="wc-head"><div><span class="wc-kicker">${title.toUpperCase()}</span><h2>${esc(d.title||'Pertahankan & Progres')}</h2><p class="sub">${esc(subtitle)}</p></div><span class="wc-decision ${esc(d.tone||'neutral')}">${esc(label(d.action))}</span></div>
      <div class="wc-stats"><div><small>SESI</small><b>${m.sessions||0}${m.target?'/'+m.target:''}</b><span>${pct}% target</span></div><div><small>VOLUME</small><b>${vol}</b><span>${delta} vs minggu lalu</span></div><div><small>WORKING SETS</small><b>${m.sets||0}</b><span>${m.previousSets?(((num(m.sets)-num(m.previousSets)>0?'+':'')+(num(m.sets)-num(m.previousSets)))+' vs lalu'):'data minggu ini'}</span></div><div><small>RPE</small><b>${m.avgRpe?num(m.avgRpe).toFixed(1):'—'}</b><span>${num(m.avgRpe)>=8.5?'tinggi':num(m.avgRpe)&&num(m.avgRpe)<=6.5?'ringan':'terkendali'}</span></div></div>
      <div class="wc-grid"><div class="wc-panel"><h3>Mengapa keputusan ini?</h3><p>${esc(d.reason||'Data latihan masih dikumpulkan untuk menentukan adaptasi berikutnya.')}</p><div class="wc-source">Sumber: <b>${esc(e.base.source||'Unified Weekly Adaptation')}</b></div><p class="wc-next"><b>Fokus:</b> ${esc(d.next||'Lanjutkan program dengan progres bertahap.')}</p></div><div class="wc-panel"><h3>Adaptasi yang diterapkan</h3><div class="wc-adaptive-list">${rotationRows(e.rotations)}</div>${e.rotations.length?'<p class="wc-adaptive-note">Rotasi di atas berlaku untuk workout berikutnya. Riwayat sesi sebelumnya tetap utuh.</p>':''}</div></div>
    </section>`;
  }

  window.apWeeklyCoachUnified={version:2,execute,card,runAdaptive,ready:true};
  window.apWeeklyCoach={evaluate:execute,card,render:()=>card('coach'),review:()=>card('review'),execute};
  window.weeklyCoach=()=>card('coach');

  if(typeof window.progressCards==='function'){
    const oldProgressCards=window.progressCards;
    if(!oldProgressCards.__apWeeklyCoachV2){
      const wrapped=function(){return card('review')+oldProgressCards()};
      wrapped.__apWeeklyCoachV2=true;
      window.progressCards=wrapped;
    }
  }

  document.documentElement.dataset.weeklyCoach='v2';
  document.documentElement.dataset.weeklyCoachSource='unified-adaptive-stage4';
})();
