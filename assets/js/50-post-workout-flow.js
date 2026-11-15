/* ATHLETIC PHYSIQUE — Post Workout Flow UX
 * Stage 9: bridges completion -> evaluation -> history/progress without
 * replacing the existing completion engines or persistence logic.
 */
(function(){
  'use strict';
  const escV=v=>typeof window.esc==='function'?window.esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const allSessions=()=>window.apTraining&&typeof window.apTraining.all==='function'?window.apTraining.all():(typeof window.sessions==='function'?window.sessions():[]);
  const statusLabel=s=>({successful:'Target tercapai',too_easy:'Terlalu mudah',too_hard:'Terlalu berat',stagnant:'Stagnan',incomplete:'Belum lengkap'}[String(s||'').toLowerCase()]||'Sesi dievaluasi');
  const statusAction=s=>({successful:'Lanjutkan progres bertahap dan pertahankan teknik.',too_easy:'Naikkan beban atau repetisi secara bertahap.',too_hard:'Pertahankan atau turunkan sedikit beban sampai target tercapai.',stagnant:'Gunakan variasi gerakan untuk memecah stagnasi.',incomplete:'Lengkapi pencatatan set agar progres dapat dievaluasi.'}[String(s||'').toLowerCase()]||'Lanjutkan latihan dan evaluasi sesi berikutnya.');
  const isSameSession=(s,ref)=>s&&ref&&String(s.date||'')===String(ref.date||'')&&String(s.name||'')===String(ref.name||'')&&String(s.start||'')===String(ref.start||'');
  let guard=null;

  function latestAfter(before,ref){
    const list=allSessions();
    const candidates=list.filter(s=>!before.some(b=>isSameSession(s,b)) && (!ref||String(s.date||'')===String(ref.date||'')));
    if(candidates.length)return candidates[candidates.length-1];
    const last=list[list.length-1];
    return isSameSession(last,ref)?last:null;
  }

  function close(){
    const el=document.querySelector('.ap-post-workout-bg');
    if(!el)return;
    el.classList.add('out');
    setTimeout(()=>el.remove(),220);
    window.__apPostWorkoutOpen=false;
  }

  function openHistory(){
    close();
    if(typeof tab!=='undefined')tab='history';
    if(typeof render==='function')render();
    setTimeout(()=>{
      const item=document.querySelector('.history-item');
      if(item)item.open=true;
      window.scrollTo(0,0);
    },0);
  }

  function openProgress(){
    close();
    if(typeof tab!=='undefined')tab='progress';
    if(typeof render==='function')render();
    window.scrollTo(0,0);
  }

  function renderSummary(session){
    if(!session)return;
    const ev=session.evaluation||session.gymEvaluation||session.hgEvaluation||null;
    const log=session.log||{};
    const exercises=Object.keys(log).length;
    const sets=Object.values(log).reduce((n,v)=>n+(Array.isArray(v)?v.length:0),0);
    const volume=Math.round(Number(session.volume)||0).toLocaleString('id-ID');
    const mode=/home\s*gym/i.test(String(session.name||''))?'HOME GYM':'GYM';
    const status=ev?statusLabel(ev.status):'Workout selesai';
    const tone=ev?String(ev.status||'successful').toLowerCase():'successful';
    const rows=ev&&Array.isArray(ev.exercise)?ev.exercise.slice(0,3).map(x=>`<div class="ap-post-eval-row"><div><b>${escV(x.name)}</b><span>${escV(x.label||statusLabel(x.status))}</span></div><small>${escV(x.action||x.detail||'')}</small></div>`).join(''):'';
    const el=document.createElement('div');
    el.className='sheetbg ap-post-workout-bg';
    el.innerHTML=`<section class="sheet ap-post-workout-sheet" role="dialog" aria-modal="true" aria-label="Ringkasan workout selesai">
      <div class="grab"></div>
      <div class="ap-post-kicker">WORKOUT SELESAI · ${mode}</div>
      <h2>${escV(session.name||'Workout')}</h2>
      <p class="sub ap-post-lead">Latihan sudah tersimpan. Gunakan ringkasan ini untuk melihat hasil sebelum melanjutkan.</p>
      <div class="ap-post-stats">
        <div><b>${exercises}</b><span>latihan</span></div>
        <div><b>${sets}</b><span>set</span></div>
        <div><b>${volume}</b><span>kg volume</span></div>
        <div><b>${session.minutes||0}</b><span>menit</span></div>
      </div>
      ${ev?`<section class="ap-post-eval ap-post-tone-${escV(tone)}"><div class="ap-post-eval-head"><div><span class="ap-post-eval-kicker">EVALUASI SESI</span><h3>${escV(ev.label||status)}</h3></div><span class="ap-post-badge ${escV(tone)}">${escV(status)}</span></div><p>${escV(ev.detail||'Performa sesi telah dianalisis berdasarkan catatan latihan.')}</p>${rows?`<div class="ap-post-eval-list">${rows}</div>`:''}<div class="ap-post-next"><b>Sesi berikutnya</b><span>${escV(statusAction(ev.status))}</span></div></section>`:''}
      <div class="ap-post-actions">
        <button class="btn" data-ap-post-action="history">Lihat Riwayat</button>
        <button class="btn ghost" data-ap-post-action="progress">Lihat Progres</button>
      </div>
      <button class="chip ap-post-close" data-ap-post-action="close">Tutup</button>
    </section>`;
    document.body.appendChild(el);
    window.__apPostWorkoutOpen=true;
    el.querySelectorAll('[data-ap-post-action]').forEach(b=>b.onclick=()=>{
      const a=b.dataset.apPostAction;
      if(a==='history')openHistory();
      else if(a==='progress')openProgress();
      else close();
    });
    el.addEventListener('click',e=>{if(e.target===el)close()});
  }

  function watch(ref,before){
    setTimeout(()=>{
      if(guard!==ref)return;
      if(getA&&getA())return;
      const s=latestAfter(before,ref);
      if(!s)return;
      guard=null;
      renderSummary(s);
    },40);
    setTimeout(()=>{if(guard===ref)guard=null},1000);
  }

  document.addEventListener('click',function(e){
    const b=e.target.closest&&e.target.closest('[data-finish]');
    if(!b||window.__apPostWorkoutOpen)return;
    const a=typeof getA==='function'?getA():null;
    if(!a)return;
    const before=allSessions().slice();
    guard={date:a.date,name:a.name,start:a.start};
    watch(guard,before);
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&window.__apPostWorkoutOpen)close();
  });
})();
