/* ATHLETIC PHYSIQUE — Unified Data Consumers
 * Phase: integration audit/refactor.
 * All training analytics below read from window.apDataModel, the same
 * canonical session dataset used by Workout, History and Adaptive modules.
 */
(function(){
  'use strict';
  const M=()=>window.apDataModel;
  if(!M)return;
  const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0;};
  const isoD=v=>String(v||'').slice(0,10);
  const weekStart=d=>{const x=new Date(isoD(d)+'T00:00:00');x.setDate(x.getDate()-((x.getDay()+6)%7));return x.toISOString().slice(0,10)};
  const addDays=(d,n)=>{const x=new Date(isoD(d)+'T00:00:00');x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};

  // Public unified selectors. New features should use these instead of
  // reading ap_sessions/ap_training_model_v1 directly.
  window.apTraining={
    sessions:()=>M().all(),
    stats:(start,end)=>M().stats(start,end),
    weekly:()=>M().weekly(),
    records:()=>M().personalRecords(),
    muscles:(start,end)=>M().volumeByMuscle(start,end),
    currentProgram:()=>M().currentProgram(),
    exerciseRows:()=>M().exerciseRows(),
    audit:()=>({
      source:M().key,
      version:M().version,
      sessions:M().all().length,
      exercises:M().exerciseRows().length,
      modules:['Beranda','Workout','Library','Progres','Riwayat','Profil','Adaptive Engine']
    })
  };

  // Progress: PR cards are now derived from the canonical model.
  const oldPrHtml=window.prHtml;
  window.prHtml=function(){
    const rec=M().personalRecords();
    const names=Object.keys(rec).filter(n=>rec[n].bestKg>0).sort((a,b)=>rec[b].bestKg-rec[a].bestKg).slice(0,6);
    if(!names.length)return oldPrHtml?oldPrHtml(): '<p class="empty">Belum ada PR tercatat.</p>';
    return `<div class="pr-grid">${names.map(n=>{const r=rec[n];return `<div class="pr-card"><small>${esc(n)}</small><div class="num">${kf(r.bestKg)} kg</div><span class="mute">${fmt(r.date)}</span></div>`}).join('')}</div>`;
  };

  // History summary uses the same canonical metrics as Progress/Home.
  const oldHistoryStats=window.historyStats;
  window.historyStats=function(items){
    const rows=items.map(x=>x.s);
    const st=rows.length?rows.reduce((a,s)=>{a.sessions++;a.sets+=s.metrics?.workingSets||0;a.volume+=s.metrics?.volumeKg||0;a.minutes+=s.minutes||0;return a},{sessions:0,sets:0,volume:0,minutes:0}):{sessions:0,sets:0,volume:0,minutes:0};
    if(!rows.length)return oldHistoryStats?oldHistoryStats(items):'';
    const vol=st.volume>=10000?(Math.round(st.volume/100)/10)+'t':Math.round(st.volume).toLocaleString('id-ID');
    const mins=st.minutes>=60?Math.floor(st.minutes/60)+'j '+st.minutes%60+'m':st.minutes+'m';
    return `<div class="history-summary"><div class="stat"><div class="num">${st.sessions}</div><small>sesi</small></div><div class="stat"><div class="num">${st.sets}</div><small>set</small></div><div class="stat"><div class="num">${vol}</div><small>volume</small></div><div class="stat"><div class="num">${mins}</div><small>durasi</small></div></div>`;
  };

  // Muscle analysis now uses canonical exercise muscle metadata and volume.
  const oldMuscleCard=window.muscleCard;
  window.muscleCard=function(){
    const curStart=weekStart(todayIso), prevStart=addDays(curStart,-7), prevEnd=addDays(curStart,-1);
    const cur=M().volumeByMuscle(curStart,todayIso), prev=M().volumeByMuscle(prevStart,prevEnd);
    const groups=typeof MG==='object'?Object.keys(MG):Object.keys(cur);
    const f=x=>String(Math.round((x||0)*2)/2).replace('.',',');
    const rows=groups.map(g=>{
      const v=cur[g]||0,o=prev[g]||0,col=v>20?'var(--warm)':v>=10?'#34d399':'var(--blue)';
      return `<div class="mrow"><span>${MG[g]||g}</span><div class="mbar"><b style="width:${Math.min(100,v/20*100)}%;background:${col}"></b></div><span class="num">${f(v)}</span><small class="prev">${f(o)}</small></div>`;
    }).join('');
    return `<section class="card"><h2>Set per otot minggu ini</h2><p class="sub">Volume dihitung dari data latihan yang sama dengan Riwayat dan Progres. Otot utama 100%, otot sekunder 50%.</p>${rows}<p class="leg"><span><i style="background:var(--blue)"></i>Kurang</span><span><i style="background:#34d399"></i>Ideal</span><span><i style="background:var(--warm)"></i>Berlebih</span></p></section>`;
  };

  // Weekly progress cards read directly from canonical weekly aggregates.
  const oldProgressCards=window.progressCards;
  window.progressCards=function(){
    const rows=M().weekly().filter(x=>x.week>=cut());
    const recent=rows.slice(-12);
    const exNames=[...new Set(M().exerciseRows().map(x=>x.exercise.name))].sort();
    const names=exNames.slice(0,4);
    const ex=names.map(n=>`<section class="card"><h2>Beban ${esc(n)}</h2>${lineChart(exPts({test:q=>q===n}),'kg')}</section>`).join('');
    const more=exNames.length?`<section class="card"><h2>Gerakan lain</h2><select data-xs="1" aria-label="Pilih gerakan">${exNames.map(n=>`<option ${n===xsel?'selected':''}>${esc(n)}</option>`).join('')}</select>${lineChart(exPts({test:n=>n===xsel}),'kg')}${e1(xsel)}</section>`:'';
    return muscleCard()+(ex+more||'<section class="card"><h2>Beban per gerakan</h2><p class="empty">Grafik muncul setelah Anda mencatat latihan.</p></section>')+
      `<section class="card"><h2>Volume mingguan</h2>${barChart(recent.map(k=>({l:k.week,v:k.volumeKg})),'kg per minggu')}</section><section class="card"><h2>Jumlah sesi</h2>${barChart(recent.map(k=>({l:k.week,v:k.sessions})),'sesi per minggu')}</section>`;
  };

  // Make the core session selector return canonical records, not a separately
  // maintained legacy dataset. The storage adapter remains backward compatible.
  const canonicalSessions=()=>M().all();
  window.apCanonicalSessions=canonicalSessions;

  // Keep the existing session API stable while making its backing source explicit.
  // Existing functions call sessions(); the function itself is still defined in
  // core, but its ls.get('ap_sessions') path is now the canonical projection.
  document.documentElement.dataset.trainingDataSource='unified-v1';

  // Refresh once after the overrides are installed.
  setTimeout(()=>{if(typeof render==='function')render();},0);
})();
