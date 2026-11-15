#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const requiredJS=[44,45,46,47,48,49,50,51,52,53,54,55,56,57,58].map(n=>`${n}-${({44:'unified-training-intelligence',45:'gym-smart-program',46:'unified-adaptive-engine',47:'weekly-coach-unified-integration',48:'workout-flow-ux',49:'workout-logging-ux',50:'post-workout-flow',51:'progress-history-data-consistency',52:'exercise-progression',53:'progression-workout-adaptive-bridge',54:'unified-recommendation-engine',55:'recommendation-decision-trace',56:'recommendation-safety-guardrails',57:'intelligence-audit',58:'intelligence-e2e-qa'})[n]}.js`);
const requiredCSS=['24-intelligence-audit.css','25-intelligence-e2e-qa.css'];
const checks=[];
function check(id,label,ok,detail){checks.push({id,label,status:ok?'pass':'fail',detail});}
for(const f of requiredJS){const n=(index.match(new RegExp(`assets/js/${f.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}`,'g'))||[]).length;check('js:'+f,'Runtime script '+f,n===1,n===1?'loaded once':`found ${n}`)}
for(const f of requiredCSS){const n=(index.match(new RegExp(`assets/css/${f.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}`,'g'))||[]).length;check('css:'+f,'Runtime CSS '+f,n===1,n===1?'loaded once':`found ${n}`)}
const api=['apDataModel','apTraining','apUnifiedIntelligence','apGymSmartProgram','apUnifiedAdaptive','apWeeklyCoach','apExerciseProgression','apProgressionWorkoutBridge','apUnifiedRecommendation','apRecommendationDecisionTrace','apRecommendationGuardrails','apIntelligenceAudit','apE2EIntelligenceQA'];
const runtimeJS=fs.readdirSync(path.join(root,'assets/js')).filter(f=>f.endsWith('.js'));
check('index','index.html exists',fs.existsSync(path.join(root,'index.html')),'');
check('guide','PROJECT_GUIDE updated',fs.existsSync(path.join(root,'PROJECT_GUIDE.md')) && /Stage 17|End-to-End Intelligence QA/.test(fs.readFileSync(path.join(root,'PROJECT_GUIDE.md'),'utf8')),'');
check('audit','Stage 17 audit file exists',fs.existsSync(path.join(root,'audit','END_TO_END_INTELLIGENCE_QA_STAGE17.md')),'');
check('tool','Stage 17 runner exists',fs.existsSync(path.join(root,'tools','stage17-e2e-intelligence-qa.js')),'');
const report={version:1,passed:checks.filter(c=>c.status==='pass').length,failed:checks.filter(c=>c.status==='fail').length,checks};
console.log(JSON.stringify(report,null,2));
process.exit(report.failed?1:0);
