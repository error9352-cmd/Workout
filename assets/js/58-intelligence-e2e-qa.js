/* ATHLETIC PHYSIQUE — End-to-End Intelligence QA v17
 * Diagnostic-only layer. It does not alter workout data, recommendations, or history.
 * Purpose: verify that the live page exposes the contracts required by the
 * Gym/Home Gym intelligence pipeline and that the runtime chain is wired once.
 */
(function(){
  'use strict';

  const expectedScripts=[
    '44-unified-training-intelligence.js',
    '45-gym-smart-program.js',
    '46-unified-adaptive-engine.js',
    '47-weekly-coach-unified-integration.js',
    '48-workout-flow-ux.js',
    '49-workout-logging-ux.js',
    '50-post-workout-flow.js',
    '51-progress-history-data-consistency.js',
    '52-exercise-progression.js',
    '53-progression-workout-adaptive-bridge.js',
    '54-unified-recommendation-engine.js',
    '55-recommendation-decision-trace.js',
    '56-recommendation-safety-guardrails.js',
    '57-intelligence-audit.js',
    '58-intelligence-e2e-qa.js'
  ];

  function pass(id,label,detail){return {id,status:'pass',label,detail:detail||''}}
  function fail(id,label,detail){return {id,status:'fail',label,detail:detail||''}}
  function exists(path){
    try{return path.split('.').reduce((o,k)=>o&&o[k],window)!=null}catch(e){return false}
  }
  function fn(path){
    // getA is intentionally a private top-level lexical function in 00-app-core.js,
    // not a window property. Test it in its actual global lexical scope.
    if(path==='getA'){try{return typeof getA==='function'}catch(e){return false}}
    try{return typeof path.split('.').reduce((o,k)=>o&&o[k],window)==='function'}catch(e){return false}
  }
  // Ignore cache-busting query strings and fragments when comparing script names.
  function scripts(){return Array.from(document.scripts).map(s=>String(s.src||'').split(/[?#]/)[0].split('/').pop()).filter(Boolean)}

  function run(){
    const out=[];
    const src=scripts();
    expectedScripts.forEach(name=>{
      const n=src.filter(x=>x===name).length;
      out.push(n===1?pass('script:'+name,'Script '+name,'loaded once'):fail('script:'+name,'Script '+name,`expected 1, found ${n}`));
    });

    const apiChecks=[
      ['canonical','window.apDataModel'],
      ['training','window.apTraining'],
      ['unifiedIntelligence','window.apUnifiedIntelligence'],
      ['gymSmartProgram','window.apGymSmartProgram'],
      ['unifiedAdaptive','window.apUnifiedAdaptive'],
      ['weeklyCoach','window.apWeeklyCoach'],
      ['exerciseProgression','window.apExerciseProgression'],
      ['progressionBridge','window.apProgressionWorkoutBridge'],
      ['unifiedRecommendation','window.apUnifiedRecommendation'],
      ['decisionTrace','window.apRecommendationDecisionTrace'],
      ['guardrails','window.apRecommendationGuardrails'],
      ['stage16Audit','window.apIntelligenceAudit']
    ];
    apiChecks.forEach(([id,label])=>out.push(exists(label)?pass('api:'+id,label,'available'):fail('api:'+id,label,'missing')));

    const fnChecks=[
      ['startWorkout','startWorkout'],
      ['render','render'],
      ['getActive','getA'],
      ['recommendationChoose','apUnifiedRecommendation.choose'],
      ['recommendationTrace','apRecommendationDecisionTrace.explain'],
      ['guardValidate','apRecommendationGuardrails.validateRecommendation'],
      ['progressionRows','apExerciseProgression.rows']
    ];
    fnChecks.forEach(([id,label])=>out.push(fn(label)?pass('fn:'+id,label,'callable'):fail('fn:'+id,label,'not callable')));

    const dataModel=window.apDataModel;
    if(dataModel&&typeof dataModel.all==='function'){
      let rows=[];
      try{rows=dataModel.all()||[]}catch(e){out.push(fail('canonical-read','Canonical data read','threw: '+e.message))}
      if(Array.isArray(rows))out.push(pass('canonical-read','Canonical data read',`${rows.length} session(s) available`));
    }else out.push(fail('canonical-read','Canonical data read','apDataModel.all unavailable'));

    const active=typeof getA==='function'?getA():null;
    out.push(active?pass('active-state','Active workout state','an active session is present'):pass('active-state','Active workout state','no active session; ready state is valid'));

    const modeButtons=document.querySelectorAll('[data-start],[data-home-start]').length;
    out.push(modeButtons?pass('launch-controls','Workout launch controls',`${modeButtons} start control(s) detected`):fail('launch-controls','Workout launch controls','no start control detected in current DOM'));

    const result={
      version:1,
      generatedAt:new Date().toISOString(),
      passed:out.filter(x=>x.status==='pass').length,
      failed:out.filter(x=>x.status==='fail').length,
      results:out,
      ready:out.every(x=>x.status==='pass'),
      note:'Diagnostic-only. This layer does not mutate canonical history or workout state.'
    };
    // Keep the public API object (including run()) stable. Store the latest
    // diagnostic result on it instead of replacing it with a plain result object.
    Object.assign(window.apE2EIntelligenceQA, result);
    document.documentElement.dataset.apE2eQa=result.ready?'pass':'attention';
    return result;
  }

  window.apE2EIntelligenceQA={run,version:1,ready:false};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>run(),{once:true});
  else setTimeout(run,0);
})();
