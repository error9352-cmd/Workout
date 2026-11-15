'use strict';
const fs=require('fs');
const vm=require('vm');
const path=require('path');
const root=path.resolve(__dirname,'..');
const results=[];
function assert(name,condition,detail=''){results.push({name,pass:!!condition,detail});}
function load(file,sandbox){vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox,{filename:file});}
function makeSandbox(){
  const document={documentElement:{dataset:{}},createElement:()=>({style:{},className:'',innerHTML:'',appendChild(){},remove(){}})};
  const window={};
  const sandbox={window,document,console,Date,Math,JSON,Number,String,Array,Object,Set,Map,parseFloat,parseInt,isFinite};
  sandbox.globalThis=sandbox;
  window.window=window; window.document=document;
  window.esc=v=>String(v);
  sandbox.exMode=()=> 'weight';
  sandbox.PROG={1:{ex:[['Bench Press','3 × 8–10']]}};
  sandbox.getA=()=>null;
  sandbox.SX=()=>null;
  sandbox.ls={get:()=>null,set:()=>{}};
  window.apUnifiedIntelligence={
    context:()=>({mode:'gym',goal:'Muscle Gain',level:'Intermediate',frequency:4,equipment:['Barbell']}),
    lastEvaluation:()=>null,
    sessions:()=>[]
  };
  window.apExerciseProgression={summarize:()=>null};
  window.apGymIntelligence={weekly:()=>null};
  return vm.createContext(sandbox);
}
function run(){
  const s=makeSandbox();
  load('assets/js/54-unified-recommendation-engine.js',s);
  assert('Stage 13 engine exposes API',!!s.window.apUnifiedRecommendation?.ready);

  s.window.apExerciseProgression.summarize=()=>({bestKg:60,bestReps:10,trend:'up',target:'3 × 8–10',action:'Naikkan beban'});
  s.window.apGymIntelligence.weekly=()=>({decision:{action:'progression',title:'Naikkan Progres',reason:'Weekly progression'}});
  let r=s.window.apUnifiedRecommendation.choose('gym','Bench Press','3 × 8–10');
  assert('Target tercapai + weekly progression => progression',r.action==='progression',JSON.stringify(r));
  assert('Progression produces next weight',r.next.kg===62.5,JSON.stringify(r.next));

  s.window.apUnifiedIntelligence.lastEvaluation=()=>({exercise:[{name:'Bench Press',status:'too_hard'}]});
  r=s.window.apUnifiedRecommendation.choose('gym','Bench Press','3 × 8–10');
  assert('Too hard outranks progression => volume reduction',r.action==='volume_reduction',JSON.stringify(r));

  s.window.apUnifiedIntelligence.lastEvaluation=()=>({exercise:[{name:'Bench Press',status:'stagnant'}]});
  r=s.window.apUnifiedRecommendation.choose('gym','Bench Press','3 × 8–10');
  assert('Stagnation => rotation',r.action==='rotation',JSON.stringify(r));

  s.window.apUnifiedIntelligence.lastEvaluation=()=>null;
  s.window.apExerciseProgression.summarize=()=>({bestKg:60,bestReps:10,trend:'stable',stagnant:true,target:'3 × 8–10'});
  r=s.window.apUnifiedRecommendation.choose('gym','Bench Press','3 × 8–10');
  assert('Exercise stagnation outranks weekly progression => rotation',r.action==='rotation',JSON.stringify(r));

  s.window.apExerciseProgression.summarize=()=>null;
  s.window.apGymIntelligence.weekly=()=>null;
  r=s.window.apUnifiedRecommendation.choose('gym','Bench Press','3 × 8–10');
  assert('No data => maintenance',r.action==='maintenance',JSON.stringify(r));

  load('assets/js/56-recommendation-safety-guardrails.js',s);
  assert('Stage 15 guardrail API exposes',!!s.window.apRecommendationGuardrails?.ready);
  const guard=s.window.apRecommendationGuardrails;
  let safe=guard.validateRecommendation('gym','Bench Press','3 × 8–10',{action:'progression',label:'Naikkan Progres',next:{kg:100,reps:15}},['Bench Press','3 × 8–10'],{kg:60,reps:10});
  assert('Guardrail caps progression to 2.5kg / 10%, whichever is stricter',safe.next.kg===62.5,JSON.stringify(safe));
  assert('Guardrail caps reps at target max',safe.next.reps===10,JSON.stringify(safe));
  safe=guard.validateRecommendation('gym','Bench Press','3 × 8–10',{action:'progression',next:{kg:-5,reps:8}},['Bench Press','3 × 8–10'],{kg:60,reps:8});
  assert('Negative weight is corrected',safe.next.kg===0,JSON.stringify(safe));
  safe=guard.validateRecommendation('gym','Bench Press','3 × 8–10',{action:'deload',next:{kg:30,reps:8}},['Bench Press','3 × 8–10'],{kg:60,reps:8});
  assert('Deload is constrained to 70–90% of reference',safe.next.kg===42,JSON.stringify(safe));

  return results;
}
const out=run();
const failed=out.filter(x=>!x.pass);
console.log(JSON.stringify({stage:16,passed:out.length-failed.length,total:out.length,failed,checks:out},null,2));
process.exitCode=failed.length?1:0;
