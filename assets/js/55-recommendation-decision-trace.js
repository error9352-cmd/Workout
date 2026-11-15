/* ATHLETIC PHYSIQUE — Recommendation Explainability & Decision Trace
 * Stage 14: explains the final unified recommendation without changing the decision engine.
 * Read-only trace layer; completed history remains immutable.
 */
(function(){
  'use strict';
  const norm=v=>String(v??'').trim().toLowerCase();
  const esc=v=>typeof window.esc==='function'?window.esc(String(v)):String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const isHome=d=>[201,202,203,204,205,206].includes(Number(d));
  const labels={
    progression:'Naikkan Progres',
    maintenance:'Pertahankan & Progres',
    volume_reduction:'Kurangi Volume',
    rotation:'Rotasi Gerakan',
    deload:'Deload / Pemulihan'
  };
  const sourceLabels={
    'exercise-progression':'Progress per Gerakan',
    'session-evaluation':'Evaluasi Sesi',
    'weekly-adaptation':'Adaptasi Mingguan',
    'unified-default':'Aturan Aman Default'
  };
  const priority={deload:100,volume_reduction:90,rotation:80,maintenance:60,progression:50};

  function context(mode){
    try{return window.apUnifiedIntelligence&&window.apUnifiedIntelligence.context(mode)||{mode,goal:'-',level:'-',frequency:'-',equipment:[]};}
    catch(e){return {mode,goal:'-',level:'-',frequency:'-',equipment:[]};}
  }
  function progression(name){
    try{return window.apExerciseProgression&&window.apExerciseProgression.summarize(name)||null}catch(e){return null}
  }
  function evaluation(mode,name){
    try{
      const ui=window.apUnifiedIntelligence;
      if(ui&&ui.lastEvaluation){
        const ev=ui.lastEvaluation(mode);
        const hit=ev&&Array.isArray(ev.exercise)?ev.exercise.find(x=>norm(x.name)===norm(name)):null;
        if(hit)return hit;
      }
      const sessions=ui&&ui.sessions?ui.sessions(mode):[];
      for(const s of sessions.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)))){
        const ev=s&&(s.gymEvaluation||s.hgEvaluation);
        const hit=ev&&Array.isArray(ev.exercise)?ev.exercise.find(x=>norm(x.name)===norm(name)):null;
        if(hit)return hit;
      }
    }catch(e){}
    return null;
  }
  function weekly(mode){
    try{
      if(mode==='gym'&&window.apGymIntelligence&&typeof window.apGymIntelligence.weekly==='function')return window.apGymIntelligence.weekly()||null;
      if(mode==='home'&&window.apHomeGymWeeklyAdaptation&&typeof window.apHomeGymWeeklyAdaptation.collect==='function'){
        const m=window.apHomeGymWeeklyAdaptation.collect();
        return window.apHomeGymWeeklyAdaptation.decide?{metrics:m,decision:window.apHomeGymWeeklyAdaptation.decide(m)}:{metrics:m};
      }
    }catch(e){}
    try{return window.apWeeklyCoachUnified&&window.apWeeklyCoachUnified.execute?window.apWeeklyCoachUnified.execute():null}catch(e){return null}
  }
  function actionOf(v){
    const s=norm(v);
    if(/deload|pemulihan/.test(s))return 'deload';
    if(/volume|kurangi/.test(s))return 'volume_reduction';
    if(/rotasi|rotation/.test(s))return 'rotation';
    if(/naik|progress/.test(s))return 'progression';
    return 'maintenance';
  }
  function weeklyCandidate(mode){
    const w=weekly(mode),d=w&&w.decision;
    return d?{action:actionOf(d.action),label:d.title||labels[actionOf(d.action)],reason:d.reason||'',next:d.next||'',source:'weekly-adaptation'}:null;
  }
  function evaluationCandidate(ev){
    if(!ev)return null;
    const s=norm(ev.status||ev.decision||'');
    if(/too.?hard|berat|hard/.test(s))return {action:'volume_reduction',label:labels.volume_reduction,reason:'Evaluasi sesi menunjukkan gerakan terlalu berat.',source:'session-evaluation'};
    if(/stagnant|stagn/.test(s))return {action:'rotation',label:labels.rotation,reason:'Evaluasi sesi menunjukkan stagnasi.',source:'session-evaluation'};
    if(/too.?easy|mudah/.test(s))return {action:'progression',label:labels.progression,reason:'Evaluasi sesi menunjukkan stimulus terlalu mudah.',source:'session-evaluation'};
    return null;
  }
  function progressionCandidate(q){
    if(!q)return null;
    if(q.stagnant)return {action:'rotation',label:labels.rotation,reason:q.reason||'Progress per gerakan menunjukkan stagnasi.',source:'exercise-progression'};
    if(q.action&&/naikkan beban|naikkan repetisi|tambah 1/i.test(q.action))return {action:'progression',label:labels.progression,reason:q.reason||'Target progres tercapai.',source:'exercise-progression'};
    if(q.trend==='down')return {action:'maintenance',label:labels.maintenance,reason:q.reason||'Performa terakhir turun; stabilkan sebelum progres.',source:'exercise-progression'};
    return {action:'maintenance',label:labels.maintenance,reason:q.reason||'Performa stabil; lanjutkan progres bertahap.',source:'exercise-progression'};
  }
  function sourceStatus(c){
    return c?{available:true,action:c.action,label:c.label,reason:c.reason||''}:{available:false,action:null,label:'Tidak tersedia',reason:'Belum ada data yang cukup.'};
  }

  function explain(mode,name,target){
    const m=mode||'gym';
    let final=null;
    try{final=window.apUnifiedRecommendation&&window.apUnifiedRecommendation.choose?window.apUnifiedRecommendation.choose(m,name,target):null}catch(e){final=null}
    if(!final)return null;
    const q=progression(name),ev=evaluation(m,name);
    const candidates=[weeklyCandidate(m),evaluationCandidate(ev),progressionCandidate(q)].filter(Boolean);
    const sourceOrder=['weekly-adaptation','session-evaluation','exercise-progression'];
    const sources=sourceOrder.map(s=>{
      const c=candidates.find(x=>x.source===s);return {source:s,...sourceStatus(c)};
    });
    const distinct=new Set(candidates.map(x=>x.action));
    const selectedSource=final.source||'unified-default';
    const rule=selectedSource==='unified-default'
      ?'Tidak ada sinyal perubahan yang cukup kuat, sehingga sistem memilih aturan aman default.'
      : final.action==='deload'
        ?'Pemulihan memiliki prioritas tertinggi.'
        : final.action==='volume_reduction'
          ?'Sinyal beban berlebih diprioritaskan untuk menjaga kualitas sesi.'
          : final.action==='rotation'
            ?'Stagnasi diprioritaskan sebelum mengejar progres tambahan.'
            : selectedSource==='exercise-progression'
              ?'Sinyal spesifik dari progres gerakan diprioritaskan di atas rekomendasi mingguan yang lebih umum.'
              :'Tidak ada sinyal keselamatan yang lebih tinggi, sehingga rekomendasi mingguan digunakan.';
    const basisCount=sources.filter(x=>x.available).length;
    const basis=basisCount>=3?'Lengkap':basisCount===2?'Cukup':basisCount===1?'Terbatas':'Default';
    return {
      version:1,traceVersion:'decision-trace-v1',generatedAt:Date.now(),mode:m,name,
      context:{goal:context(m).goal,level:context(m).level,frequency:context(m).frequency},
      final:{action:final.action,label:final.label,reason:final.reason,source:selectedSource,next:final.next||'',target:final.target||target||null,nextValue:final.next||final.nextStep||''},
      sources,candidateCount:candidates.length,conflict:distinct.size>1||!!final.conflicts,
      priority:{selectedAction:final.action,selectedPriority:priority[final.action]||0,rule},
      basis:{count:basisCount,label:basis},
      progression:q?{trend:q.trend||'stable',stagnant:!!q.stagnant,last:q.last||null,target:q.target||null,action:q.action||null}:null,
      evaluation:ev?{status:ev.status||ev.decision||null,reason:ev.reason||null}:null,
      weekly:candidates.find(x=>x.source==='weekly-adaptation')||null,
      resolvedBy:final.resolvedBy||'unified-priority-v1'
    };
  }

  function formatNext(r){
    const n=r&&r.final&&r.final.next;
    if(n)return String(n).replace(/\s+/g,' ').trim();
    if(r?.final?.action==='rotation')return 'Gunakan variasi gerakan yang setara pada sesi berikutnya.';
    if(r?.final?.action==='deload')return 'Prioritaskan pemulihan dan turunkan tuntutan latihan.';
    if(r?.final?.action==='volume_reduction')return 'Kurangi tuntutan sesi berikutnya sebelum kembali progresif.';
    return 'Lanjutkan pencatatan dan evaluasi pada sesi berikutnya.';
  }

  function renderTrace(r){
    if(!r)return '';
    const sourceRows=r.sources.map(s=>{
      const cls=s.available?'available':'empty';
      const detail=s.available?`${labels[s.action]||s.label}${s.reason?` — ${s.reason}`:''}`:'Belum ada sinyal yang relevan.';
      return `<div class="ap-stage14-source-row ${cls}"><div><strong>${esc(sourceLabels[s.source]||s.source)}</strong><small>${esc(detail)}</small></div><span>${s.available?'Dipakai sebagai input':'Tidak tersedia'}</span></div>`;
    }).join('');
    const basis=`${r.basis.label} · ${r.basis.count} sumber`; 
    return `<details class="ap-stage14-trace"><summary><span>Kenapa keputusan ini?</span><em>${esc(basis)}</em></summary><div class="ap-stage14-trace-body"><div class="ap-stage14-reason"><span>ATURAN YANG DIPAKAI</span><p>${esc(r.priority.rule)}</p></div><div class="ap-stage14-sources"><span class="ap-stage14-section-label">DASAR KEPUTUSAN</span>${sourceRows}</div><div class="ap-stage14-outcome"><div><span>KEPUTUSAN FINAL</span><strong>${esc(r.final.label)}</strong></div><div><span>LANGKAH BERIKUTNYA</span><strong>${esc(formatNext(r))}</strong></div></div>${r.conflict?'<p class="ap-stage14-conflict">Beberapa sumber memberikan sinyal berbeda. Engine menyelaraskannya menggunakan prioritas keputusan yang sama untuk Gym dan Home Gym.</p>':''}<small class="ap-stage14-meta">Trace ${esc(r.traceVersion)} · ${esc(r.resolvedBy)}</small></div></details>`;
  }

  window.apRecommendationDecisionTrace={
    version:1,ready:true,explain,
    forExercise:(name,mode)=>explain(mode||'gym',name,null),
    render:renderTrace,
    audit:()=>({version:1,ready:true,trace:'decision-trace-v1',unifiedReady:!!window.apUnifiedRecommendation,progressionReady:!!window.apExerciseProgression})
  };
  document.documentElement.dataset.recommendationTrace='v1';

  // Stage 14 is presentation-only: it never replaces the recommendation engine.
  if(typeof window.view==='function'&&!window.view.__apStage14DecisionTrace){
    const oldView=window.view;
    const wrapped=function(){
      let html=oldView.apply(this,arguments);
      try{
        const a=typeof getA==='function'?getA():ls.get('ap_active',null);
        if(typeof tab!=='undefined'&&tab==='workout'&&a&&window.apUnifiedRecommendation&&window.apRecommendationDecisionTrace){
          const p=typeof SX==='function'?SX(a):null;
          const idx=Math.min(a.cur||0,(p?.ex?.length||1)-1),e=p?.ex?.[idx];
          if(e){
            const mode=isHome(a.dow)?'home':'gym';
            const trace=explain(mode,e[0],e[1]);
            if(trace){
              const traceHtml=renderTrace(trace);
              if(html.includes('</div><div class="wk-session-bar">')){
                html=html.replace('</div><div class="wk-session-bar">','</div>'+traceHtml+'<div class="wk-session-bar">');
              }else if(html.includes('<div class="wk-session-bar">')){
                html=html.replace('<div class="wk-session-bar">',traceHtml+'<div class="wk-session-bar">');
              }
            }
          }
        }
      }catch(e){console.warn('[AP Stage14] decision trace skipped',e)}
      return html;
    };
    wrapped.__apStage14DecisionTrace=true;window.view=wrapped;
  }
})();
