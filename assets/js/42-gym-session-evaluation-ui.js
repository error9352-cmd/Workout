/* ATHLETIC PHYSIQUE — Gym Session Evaluation UI
 * Makes the regular Gym session evaluation visible in History, matching the
 * Home Gym review flow without creating a second data source.
 */
(function(){
  'use strict';
  if(typeof histItem!=='function')return;
  const escV=v=>typeof esc==='function'?esc(String(v??'')):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const isHome=s=>/home\s*gym|home\s*workout/i.test(String(s&&s.name||''));
  const statusLabel=s=>({successful:'Target tercapai',too_easy:'Terlalu mudah',too_hard:'Terlalu berat',stagnant:'Stagnan',incomplete:'Belum lengkap'}[String(s||'').toLowerCase()]||'Dievaluasi');
  const nextAction=s=>({
    successful:'Lanjutkan progres bertahap dan pertahankan teknik.',
    too_easy:'Naikkan beban atau repetisi secara bertahap.',
    too_hard:'Pertahankan atau turunkan sedikit beban sampai target tercapai.',
    stagnant:'Gunakan variasi gerakan untuk memecah stagnasi.',
    incomplete:'Lengkapi pencatatan set agar progres dapat dievaluasi.'
  }[String(s||'').toLowerCase()]||'Lanjutkan latihan dan evaluasi sesi berikutnya.');

  const originalHistItem=histItem;
  const renderEvaluation=(ev,home)=>{
    if(!ev)return '';
    const exercises=Array.isArray(ev.exercise)?ev.exercise:[];
    const visible=exercises.slice(0,4).map(x=>`<div class="${home?'hg-eval-row':'gse-row'}"><div><b>${escV(x.name)}</b><span>${escV(x.label||statusLabel(x.status))}</span></div><small>${escV(x.action||x.detail||'')}</small></div>`).join('');
    if(home){
      return `<section class="hg-session-eval history-session-evaluation" aria-label="Evaluasi sesi Home Gym"><div class="hg-eval-head"><div><span class="hg-progress-kicker">EVALUASI SESI HOME GYM</span><h2>${escV(ev.label||'Sesi dievaluasi')}</h2><p class="sub">${escV(ev.detail||'Performa sesi telah dianalisis berdasarkan set, repetisi, dan RPE.')}</p></div><span class="hg-eval-badge ${escV(ev.status||'successful')}">${escV(statusLabel(ev.status))}</span></div>${visible?`<div class="hg-eval-grid">${visible}</div>`:''}<p class="hg-eval-next"><b>Sesi berikutnya:</b> ${escV(nextAction(ev.status))}</p></section>`;
    }
    return `<section class="gym-session-eval history-session-evaluation" aria-label="Evaluasi sesi Gym"><div class="gse-head"><div><span class="gse-kicker">EVALUASI SESI GYM</span><strong>${escV(ev.label||'Sesi dievaluasi')}</strong><p>${escV(ev.detail||'Performa sesi telah dianalisis berdasarkan set, repetisi, dan RPE.')}</p></div><span class="gse-badge ${escV(ev.status||'successful')}">${escV(statusLabel(ev.status))}</span></div>${visible?`<div class="gse-list">${visible}</div>`:''}<div class="gse-next"><b>Sesi berikutnya</b><span>${escV(nextAction(ev.status))}</span></div></section>`;
  };
  histItem=function(s,k){
    let html=originalHistItem(s,k);
    const home=isHome(s);
    const ev=s&&(s.evaluation||s.gymEvaluation||s.hgEvaluation);
    if(!ev)return html;
    const card=renderEvaluation(ev,home);
    if(!card)return html;
    return html.replace('</div></details>',card+'</div></details>');
  };
  window.apGymSessionEvaluationUI={version:1,statusLabel,nextAction};
  document.documentElement.dataset.gymSessionEvaluationUI='v1';
})();
