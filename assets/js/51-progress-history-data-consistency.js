/* ATHLETIC PHYSIQUE — Progress & History Data Consistency
 * Stage 10: one canonical analytics contract for Progress, History and Coach.
 * This layer does not create another dataset. It only normalizes read paths
 * so UI summaries consume window.apDataModel directly.
 */
(function(){
  'use strict';
  const M=()=>window.apDataModel;
  if(!M)return;
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0};
  const iso=v=>String(v||'').slice(0,10);
  const escV=v=>typeof window.esc==='function'?window.esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const periodStart=days=>{const d=new Date((typeof todayIso==='string'?todayIso:new Date().toISOString().slice(0,10))+'T00:00:00');d.setDate(d.getDate()-Math.max(0,days-1));return d.toISOString().slice(0,10)};
  const periodStats=days=>M().stats(periodStart(days),iso(todayIso));

  function exercise(name){
    const key=String(name||'').trim().toLowerCase();
    const rows=M().exerciseRows().filter(x=>String(x.exercise?.name||'').trim().toLowerCase()===key);
    return rows.map(x=>({date:x.session.date,sessionId:x.session.id,name:x.exercise.name,metrics:x.exercise.metrics,sets:x.exercise.sets})).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  }

  function prCountForSession(sessionIndex){
    const all=M().all();
    const current=all[sessionIndex];
    if(!current)return 0;
    const prior=all.slice(0,sessionIndex);
    const priorBest={};
    prior.forEach(s=>s.exercises.forEach(e=>{const kg=num(e.metrics?.bestKg);if(kg>0)priorBest[e.name]=Math.max(priorBest[e.name]||0,kg)}));
    let count=0;
    current.exercises.forEach(e=>{const kg=num(e.metrics?.bestKg);if(kg>0&&kg>(priorBest[e.name]||0))count++});
    return count;
  }

  // Public analytics contract. Every consumer points back to the same model.
  window.apUnifiedAnalytics={
    version:1,
    source:()=>M().key,
    periodStats,
    stats:(start,end)=>M().stats(start,end),
    weekly:()=>M().weekly(),
    records:()=>M().personalRecords(),
    muscles:(start,end)=>M().volumeByMuscle(start,end),
    exercise,
    session:(id)=>M().all().find(s=>String(s.id)===String(id))||null,
    prCountForSession,
    audit:()=>({source:M().key,version:M().version,sessions:M().all().length,exerciseRows:M().exerciseRows().length})
  };

  // History summary: canonical metrics only. The item list itself is already
  // backed by the canonical ap_sessions projection.
  const oldHistoryStats=window.historyStats;
  window.historyStats=function(items){
    const rows=(items||[]).map(x=>x&&x.s).filter(Boolean);
    if(!rows.length)return oldHistoryStats?oldHistoryStats(items):'';
    const canonical=M().all();
    const ids=new Set(rows.map(s=>String(s.id)));
    const selected=canonical.filter(s=>ids.has(String(s.id)));
    const st=selected.reduce((a,s)=>{
      a.sessions++;
      a.sets+=num(s.metrics?.workingSets);
      a.volume+=num(s.metrics?.volumeKg);
      a.minutes+=num(s.minutes);
      return a;
    },{sessions:0,sets:0,volume:0,minutes:0});
    const vol=st.volume>=10000?(Math.round(st.volume/100)/10)+'t':Math.round(st.volume).toLocaleString('id-ID');
    const mins=st.minutes>=60?Math.floor(st.minutes/60)+'j '+st.minutes%60+'m':st.minutes+'m';
    return `<div class="history-summary"><div class="stat"><div class="num">${st.sessions}</div><small>sesi</small></div><div class="stat"><div class="num">${st.sets}</div><small>set</small></div><div class="stat"><div class="num">${vol}</div><small>volume</small></div><div class="stat"><div class="num">${mins}</div><small>durasi</small></div></div>`;
  };

  // PR badge count: use the same canonical ordering and best-load definition
  // as the Progress PR cards. This removes the old index-dependent projection.
  window.prCount=function(k){
    const rows=M().all();
    return prCountForSession(Number(k));
  };

  // Progress summary: canonical period metrics, including PR count derived
  // from canonical sessions. No legacy volume/session calculation remains here.
  if(typeof window.pgSummary==='function'){
    window.pgSummary=function(){
      const start=periodStart(typeof window.cut==='function'?Math.max(1,((new Date(todayIso+'T00:00:00')-new Date(cut()+'T00:00:00'))/86400000)+1):30);
      const rows=M().range(start,iso(todayIso));
      if(!rows.length)return '';
      const st=M().stats(start,iso(todayIso));
      const pr=rows.reduce((n,s)=>{const idx=M().all().findIndex(x=>String(x.id)===String(s.id));return n+prCountForSession(idx)},0);
      const v=st.volumeKg>=10000?String(Math.round(st.volumeKg/100)/10).replace('.',',')+'<span class="mute" style="font-size:16px"> ton</span>':Math.round(st.volumeKg).toLocaleString('id-ID')+'<span class="mute" style="font-size:16px"> kg</span>';
      const tm=st.minutes>=60?`${Math.floor(st.minutes/60)}j ${st.minutes%60}m`:`${st.minutes}m`;
      return `<div class="grid"><div class="stat"><div class="num">${st.sessions}</div><small>sesi</small></div><div class="stat"><div class="num">${v}</div><small>total volume</small></div><div class="stat"><div class="num">${tm}</div><small>durasi</small></div><div class="stat"><div class="num">${pr}</div><small>PR baru</small></div></div>`;
    };
  }

  // Keep the existing chart/layout renderer, but expose a deterministic data
  // source marker for regression checks and future modules.
  document.documentElement.dataset.progressDataSource='unified-v1';
  document.documentElement.dataset.historyDataSource='unified-v1';
  document.documentElement.dataset.analyticsContract='v1';

  setTimeout(()=>{if(typeof render==='function')render()},0);
})();
