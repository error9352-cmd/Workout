/* ATHLETIC PHYSIQUE — Weekly Coach Integration v1
 * Weekly Coach is a presentation layer over the Weekly Adaptation Engine.
 * It never creates a second training-data source.
 */
(function(){
  'use strict';
  const escW=v=>typeof esc==='function'?esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0};
  const today=()=>typeof todayIso==='string'?todayIso:new Date().toISOString().slice(0,10);
  const monday=d=>{const x=new Date(String(d)+'T00:00:00');x.setDate(x.getDate()-((x.getDay()+6)%7));return x.toISOString().slice(0,10)};
  const addDays=(d,n)=>{const x=new Date(String(d)+'T00:00:00');x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
  const sessions=()=>window.apTraining?window.apTraining.all():(typeof window.sessions==='function'?window.sessions():[]);
  const currentWeek=()=>{const end=today(),start=monday(end);return {start,end}};
  const prevWeek=()=>{const w=currentWeek(),start=addDays(w.start,-7);return {start,end:addDays(w.start,-1)}};
  const inRange=(s,r)=>String(s&&s.date||'')>=r.start&&String(s&&s.date||'')<=r.end;
  const volume=ss=>ss.reduce((a,s)=>a+num(s.volume||s.metrics?.volumeKg),0);
  const sets=ss=>ss.reduce((a,s)=>a+Object.values(s.log||{}).reduce((n,v)=>n+(Array.isArray(v)?v.filter(x=>!x.w).length:0),0),0);
  const avgRpe=ss=>{const a=[];ss.forEach(s=>Object.values(s.log||{}).forEach(v=>(v||[]).forEach(r=>{const x=num(r.rpe);if(x)a.push(x)})));return a.length?a.reduce((x,y)=>x+y,0)/a.length:0};
  const goal=()=>{const p=typeof prof==='function'?prof():{};return String(p.goal||p.objective||'').trim()};
  const freq=()=>{const p=typeof prof==='function'?prof():{};return Math.max(0,num(p.freq||p.frequency||0))};
  const homeCount=ss=>ss.filter(s=>/home\s*gym/i.test(String(s.name||''))).length;
  const decisionLabel=a=>({progression:'Naikkan Progres',maintenance:'Pertahankan & Progres',volume_reduction:'Kurangi Volume',rotation:'Rotasi Gerakan',deload:'Deload / Pemulihan'}[String(a||'').toLowerCase()]||'Evaluasi');

  function genericDecision(metrics){
    const target=metrics.target||freq()||0;
    if(!metrics.current.length)return {action:'maintenance',title:'Mulai kembali',tone:'neutral',reason:'Belum ada sesi yang tercatat pada minggu berjalan.',next:'Selesaikan sesi berikutnya sesuai program sebelum menambah volume atau intensitas.',changes:[]};
    if(target&&metrics.current.length/target<.6)return {action:'maintenance',title:'Prioritaskan konsistensi',tone:'neutral',reason:`Baru ${metrics.current.length}/${target} sesi selesai minggu ini.`,next:'Pertahankan program saat ini dan kejar frekuensi yang direncanakan.',changes:['Pertahankan volume saat ini','Jangan menambah intensitas dulu']};
    if(metrics.rpe>=8.7&&metrics.volumeDelta>12)return {action:'volume_reduction',title:'Kurangi fatigue',tone:'hard',reason:'Volume meningkat cukup besar sementara RPE rata-rata sudah tinggi.',next:'Kurangi sedikit volume pada aksesori dan prioritaskan kualitas set utama.',changes:['Kurangi 1 set pada aksesori utama','Pertahankan beban gerakan utama bila teknik stabil']};
    if(metrics.rpe>=8.7&&metrics.volumeDelta<=0)return {action:'deload',title:'Recovery week',tone:'deload',reason:'RPE rata-rata tinggi tanpa peningkatan volume yang sepadan.',next:'Gunakan minggu lebih ringan untuk memulihkan performa sebelum kembali progresif.',changes:['Kurangi sekitar 25–35% set','Hindari mengejar PR']};
    if(metrics.volumeDelta<=-15)return {action:'maintenance',title:'Pulihkan ritme',tone:'neutral',reason:'Volume minggu ini turun cukup besar dibanding minggu sebelumnya.',next:'Kembali ke volume program normal secara bertahap.',changes:['Kembalikan volume ke baseline','Jangan langsung menambah beban dan volume sekaligus']};
    if(metrics.rpe&&metrics.rpe<=6.5&&metrics.adherence>=.8)return {action:'progression',title:'Naikkan progres',tone:'up',reason:'Konsistensi baik dan RPE rata-rata masih relatif ringan.',next:'Naikkan beban atau repetisi secara kecil pada gerakan yang stabil.',changes:['Tambah 1–2,5 kg pada gerakan berbeban','Atau tambah 1–2 repetisi pada bodyweight']};
    return {action:'maintenance',title:'Pertahankan dan progres kecil',tone:'ok',reason:'Konsistensi dan beban latihan berada pada rentang yang sehat.',next:'Pertahankan struktur program dan gunakan progressive overload kecil pada gerakan yang siap.',changes:['Pertahankan volume utama','Naikkan performa secara bertahap pada gerakan yang stabil']};
  }

  function engine(){
    const w=currentWeek(),p=prevWeek(),all=sessions(),cur=all.filter(s=>inRange(s,w)),prev=all.filter(s=>inRange(s,p));
    const vm=volume(cur),vp=volume(prev),vd=vp?Math.round((vm-vp)/vp*100):0;
    const target=freq(),ad=target?Math.min(1,cur.length/target):1,r=avgRpe(cur);
    let decision=null,source='Unified Weekly Adaptation';
    // Mode-specific engines are authoritative when the current week is clearly
    // Home Gym or clearly regular Gym. Mixed-mode weeks use the unified fallback.
    const currentHome=homeCount(cur), currentGym=cur.length-currentHome;
    if(currentHome>0&&currentGym===0&&window.apHomeGymWeeklyAdaptation){
      const hm=window.apHomeGymWeeklyAdaptation.collect();
      decision=window.apHomeGymWeeklyAdaptation.decide(hm);
      source='Home Gym Weekly Adaptation Engine';
      try{window.apHomeGymWeeklyAdaptation.applyDecision(decision)}catch(_){ }
    }
    if(!decision&&currentGym>0&&currentHome===0&&window.apGymIntelligence){
      const gm=window.apGymIntelligence.weekly();
      decision=gm.decision;
      source='Gym Weekly Adaptation Engine';
      try{window.apGymIntelligence.applyWeeklyDecision(decision)}catch(_){ }
    }
    if(!decision)decision=genericDecision({current:cur,previous:prev,volumeDelta:vd,rpe:r,adherence:ad,target});
    const program=window.apTraining&&window.apTraining.program?window.apTraining.program():null;
    return {week:w,previous:p,current:cur,previousSessions:prev,metrics:{sessions:cur.length,target,adherence:ad,volume:vm,previousVolume:vp,volumeDelta:vd,sets:sets(cur),previousSets:sets(prev),avgRpe:r},decision,source,program,goal:goal()};
  }

  function changeRows(d){
    const rows=(d.changes||[]).map(x=>`<div class="wc-change"><span>${escW(x)}</span><span class="wc-change-mark">Next week</span></div>`).join('');
    return rows||`<div class="wc-change"><span>${escW(d.next||'Pertahankan program dan evaluasi kembali minggu depan.')}</span></div>`;
  }

  function card(mode){
    const e=engine(),m=e.metrics,d=e.decision;
    const pct=Math.round(m.adherence*100),vol=m.volume>=10000?(Math.round(m.volume/100)/10)+' ton':Math.round(m.volume).toLocaleString('id-ID')+' kg';
    const delta=m.volumeDelta>0?'+'+m.volumeDelta+'%':m.volumeDelta+'%';
    const title=mode==='review'?'Weekly Review':'Weekly Coach';
    const subtitle=mode==='review'?'Keputusan minggu depan berdasarkan Weekly Adaptation Engine.':'Coach membaca performa minggu ini dan menerjemahkan keputusan adaptasi menjadi tindakan.';
    return `<section class="card weekly-coach-v1 ${mode==='review'?'weekly-review-v1':''}" aria-label="${title}">
      <div class="wc-head"><div><span class="wc-kicker">${title.toUpperCase()}</span><h2>${escW(d.title)}</h2><p class="sub">${escW(subtitle)}</p></div><span class="wc-decision ${escW(d.tone||'neutral')}">${escW(decisionLabel(d.action))}</span></div>
      <div class="wc-stats"><div><small>SESI</small><b>${m.sessions}${m.target?'/'+m.target:''}</b><span>${pct}% target</span></div><div><small>VOLUME</small><b>${vol}</b><span>${delta} vs minggu lalu</span></div><div><small>WORKING SETS</small><b>${m.sets}</b><span>${m.previousSets?((m.sets-m.previousSets>0?'+':'')+(m.sets-m.previousSets))+' vs lalu':'data minggu ini'}</span></div><div><small>RPE</small><b>${m.avgRpe?m.avgRpe.toFixed(1):'—'}</b><span>${m.avgRpe>=8.5?'tinggi':m.avgRpe&&m.avgRpe<=6.5?'ringan':'terkendali'}</span></div></div>
      <div class="wc-grid"><div class="wc-panel"><h3>Mengapa keputusan ini?</h3><p>${escW(d.reason)}</p><div class="wc-source">Sumber keputusan: <b>${escW(e.source)}</b></div></div><div class="wc-panel"><h3>Apa yang berubah minggu depan?</h3><div class="wc-changes">${changeRows(d)}</div><p class="wc-next"><b>Fokus:</b> ${escW(d.next||'Lanjutkan program dengan progres kecil.')}</p></div></div>
    </section>`;
  }

  window.apWeeklyAdaptationEngine={evaluate:engine,decide:()=>engine().decision,refresh:()=>engine()};
  window.apWeeklyCoach={evaluate:engine,card,render:()=>card('coach'),review:()=>card('review')};

  // Replace the old dashboard coach with the decision-driven version.
  if(typeof window.weeklyCoach==='function')window.weeklyCoach=function(){return card('coach')};
  // Keep the existing Progress training analytics and prepend a decision-driven review.
  if(typeof window.progressCards==='function'){
    const oldProgressCards=window.progressCards;
    window.progressCards=function(){return card('review')+oldProgressCards()};
  }
  document.documentElement.dataset.weeklyCoach='v1';
  document.documentElement.dataset.weeklyCoachSource='weekly-adaptation-engine';
  window.dispatchEvent(new CustomEvent('ap:weekly-coach-ready',{detail:engine()}));
})();
