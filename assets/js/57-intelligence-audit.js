/* ATHLETIC PHYSIQUE — Stage 16 Intelligence Audit
 * Runtime-safe diagnostics only. Does not alter workout/history data.
 */
(function(){
  'use strict';
  const VERSION='intelligence-audit-v1';
  const checks=[];
  const add=(name,pass,detail)=>checks.push({name,pass:!!pass,detail:detail||''});
  function run(){
    checks.length=0;
    const rec=window.apUnifiedRecommendation;
    const trace=window.apRecommendationDecisionTrace;
    const guard=window.apRecommendationGuardrails;
    add('Unified Recommendation ready',!!rec&&rec.ready,'window.apUnifiedRecommendation');
    add('Decision Trace ready',!!trace&&trace.ready,'window.apRecommendationDecisionTrace');
    add('Safety Guardrails ready',!!guard&&guard.ready,'window.apRecommendationGuardrails');
    add('Canonical data model ready',!!window.apDataModel,'ap_training_model_v1');
    if(rec&&typeof rec.audit==='function'){
      const a=rec.audit();
      add('Recommendation engine audit',a.ready===true,JSON.stringify(a));
    }
    if(guard&&typeof guard.audit==='function'){
      const a=guard.audit();
      add('Guardrail audit',a.ready===true,JSON.stringify(a));
    }
    return {version:VERSION,ready:true,passed:checks.filter(x=>x.pass).length,total:checks.length,checks:checks.slice()};
  }
  window.apIntelligenceAudit={version:1,ready:true,run,audit:run,checks:()=>checks.slice()};
  document.documentElement.dataset.intelligenceAudit='v1';
})();
