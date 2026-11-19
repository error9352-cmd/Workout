/* ATHLETIC PHYSIQUE — Latest Session Evaluation for Weekly Coach
 * Adds only the most recent completed session evaluation to Weekly Coach.
 * Does not duplicate the full History evaluation list and does not create a new data source.
 */
(function(){
  'use strict';
  const esc=v=>typeof window.esc==='function'?window.esc(String(v??'')):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const sessions=()=>window.apTraining&&typeof window.apTraining.all==='function'?window.apTraining.all():(typeof window.sessions==='function'?window.sessions():[]);
  const statusLabel=s=>({successful:'Target tercapai',too_easy:'Terlalu mudah',too_hard:'Terlalu berat',stagnant:'Stagnan',incomplete:'Belum lengkap'}[String(s||'').toLowerCase()]||'Dievaluasi');
  const statusTone=s=>String(s||'').toLowerCase()||'neutral';
  const nextAction=s=>({
    successful:'Lanjutkan progres bertahap dan pertahankan teknik.',
    too_easy:'Naikkan beban atau repetisi secara bertahap.',
    too_hard:'Pertahankan atau turunkan sedikit beban sampai target tercapai.',
    stagnant:'Gunakan variasi gerakan untuk memecah stagnasi.',
    incomplete:'Lengkapi pencatatan set agar progres dapat dievaluasi.'
  }[String(s||'').toLowerCase()]||'Lanjutkan latihan dan evaluasi sesi berikutnya.');
  const isHome=s=>/home\s*gym|home\s*workout/i.test(String(s&&s.name||''));
  function latest(){
    const all=sessions().filter(s=>s&&s.date);
    if(!all.length)return null;
    return all.reduce((latest,s)=>{
      if(!latest)return s;
      const a=String(s.date||''),b=String(latest.date||'');
      return a>b?s:(a===b?s:latest); // same-day records: newest array item wins
    },null);
  }
  function renderLatest(){
    const s=latest();
    const ev=s&&(s.evaluation||s.gymEvaluation||s.hgEvaluation);
    if(!s||!ev)return '';
    const exercises=Array.isArray(ev.exercise)?ev.exercise:[];
    const rows=exercises.slice(0,3).map(x=>`<div class="wc-latest-eval-row"><div><b>${esc(x.name)}</b><span>${esc(x.label||statusLabel(x.status))}</span></div><small>${esc(x.action||x.detail||'')}</small></div>`).join('');
    const mode=isHome(s)?'HOME GYM':'GYM';
    return `<div class="wc-latest-eval" aria-label="Evaluasi latihan terakhir"><div class="wc-latest-eval-head"><div><span class="wc-latest-eval-kicker">EVALUASI LATIHAN TERAKHIR · ${mode}</span><h3>${esc(ev.label||'Sesi dievaluasi')}</h3><p>${esc(ev.detail||'Performa latihan terakhir telah dianalisis berdasarkan data sesi.')}</p></div><span class="wc-latest-eval-badge ${esc(statusTone(ev.status))}">${esc(statusLabel(ev.status))}</span></div>${rows?`<div class="wc-latest-eval-list">${rows}</div>`:''}<div class="wc-latest-eval-next"><b>Latihan berikutnya</b><span>${esc(nextAction(ev.status))}</span></div></div>`;
  }
  function patch(){
    const api=window.apWeeklyCoach;
    if(!api||typeof api.card!=='function'||api.card.__apLatestEvaluationPatch)return;
    const original=api.card;
    const wrapped=function(mode){
      const html=original(mode);
      if(mode!=='coach'||html.includes('wc-latest-eval'))return html;
      return html.replace('</section>',renderLatest()+'</section>');
    };
    wrapped.__apLatestEvaluationPatch=true;
    api.card=wrapped;
    api.render=()=>wrapped('coach');
    if(typeof window.weeklyCoach==='function')window.weeklyCoach=()=>wrapped('coach');
    document.documentElement.dataset.weeklyCoachLatestEvaluation='v1';
  }
  patch();
  window.addEventListener('ap:weekly-coach-ready',patch);
  window.apWeeklyCoachLatestEvaluation={latest,render:renderLatest,refresh:patch};
})();
