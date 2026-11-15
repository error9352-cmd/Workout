/* ATHLETIC PHYSIQUE — Unified Training Integration v3
 * Canonical CRUD + analytics contract for all completed training data.
 */
(function(){
  'use strict';
  const M=()=>window.apDataModel;
  if(!M)return;
  const model=()=>M();
  const api={
    all:()=>model().all(),
    get:id=>model().all().find(s=>String(s.id)===String(id))||null,
    stats:(start,end)=>model().stats(start,end),
    weekly:()=>model().weekly(),
    records:()=>model().personalRecords(),
    muscles:(start,end)=>model().volumeByMuscle(start,end),
    exercises:()=>model().exerciseRows(),
    program:()=>model().currentProgram(),
    save:session=>{const rows=model().all();const id=session&&session.id?String(session.id):null;if(id){const i=rows.findIndex(x=>String(x.id)===id);if(i>=0)rows[i]=session;else rows.push(session)}else rows.push(session);ls.set('ap_sessions',rows);const saved=model().all();return (id&&model().all().some(x=>String(x.id)===id))?id:(saved.at(-1)?.id||null);},
    replaceAll:rows=>{const next=Array.isArray(rows)?rows:[];ls.set('ap_sessions',next);return model().all();},
    update:(id,patch)=>{const rows=model().all(),i=rows.findIndex(x=>String(x.id)===String(id));if(i<0)return null;rows[i]={...rows[i],...patch,id:rows[i].id,updatedAt:Date.now()};ls.set('ap_sessions',rows);return api.get(id)},
    remove:id=>{const rows=model().all(),i=rows.findIndex(x=>String(x.id)===String(id));if(i<0)return null;const r=rows.splice(i,1)[0];ls.set('ap_sessions',rows);return r},
    clear:()=>{const old=model().all();ls.set('ap_sessions',[]);return old},
    audit:()=>{const rows=model().all(),ex=model().exerciseRows(),projection=ls.get('ap_sessions',[]);const cv=Math.round(rows.reduce((a,s)=>a+(s.metrics?.volumeKg||0),0)*100)/100,pv=Math.round(projection.reduce((a,s)=>a+(s.volume||0),0)*100)/100;const cs=rows.reduce((a,s)=>a+(s.metrics?.workingSets||0),0),ps=projection.reduce((a,s)=>a+Object.values(s.log||{}).reduce((n,v)=>n+(Array.isArray(v)?v.filter(x=>!x.w).length:0),0),0);return {source:model().key,version:model().version,canonicalSessions:rows.length,projectionSessions:projection.length,exercises:ex.length,volumeKg:cv,workingSets:cs,programTypes:[...new Set(rows.map(s=>s.program?.type||'unknown'))],checks:{sessionCountAligned:rows.length===projection.length,volumeAligned:Math.abs(cv-pv)<0.01,workingSetsAligned:cs===ps,exercisesNormalized:ex.every(x=>x.session&&x.exercise),programContextPresent:rows.every(s=>s.program&&s.program.type),uniqueSessionIds:new Set(rows.map(s=>String(s.id))).size===rows.length}}}
  };
  window.apTraining=Object.assign(window.apTraining||{},api);
  window.apTrainingModelV3=true;
  window.apUnifiedDashboard=()=>{const t=typeof todayIso==='string'?todayIso:new Date().toISOString().slice(0,10),d=new Date(t+'T00:00:00');d.setDate(d.getDate()-((d.getDay()+6)%7));const start=d.toISOString().slice(0,10);return {today:t,weekStart:start,stats:api.stats(start,t),weekly:api.weekly(),program:api.program(),records:api.records(),muscles:api.muscles(start,t)}};
  document.documentElement.dataset.trainingDataSource='unified-v1';
  document.documentElement.dataset.trainingCrud='canonical';
  document.documentElement.dataset.trainingIntegration='v3';
  window.dispatchEvent(new CustomEvent('ap:training-model-ready',{detail:api.audit()}));
})();
