/* ATHLETIC PHYSIQUE — Strict Workout Completion Guard / Auto-Resume
 * Centralized validation for the active workout. No UI redesign; only workflow safety.
 */
(function(){
  'use strict';

  function pendingExercise(a){
    if(!a||!Array.isArray(a.sets))return -1;
    for(let i=0;i<a.sets.length;i++){
      const row=Array.isArray(a.sets[i])?a.sets[i]:[];
      if(row.some(s=>s&&!s.w&&!s.done))return i;
    }
    return -1;
  }

  function isComplete(a){return pendingExercise(a)<0;}

  function resumePending(a,opts){
    if(!a)return false;
    const i=pendingExercise(a);
    if(i<0)return false;
    const current=Number.isFinite(+a.cur)?+a.cur:0;
    a.cur=i;
    try{ls.set('ap_active',a)}catch(e){}
    if(typeof tab!=='undefined')tab='workout';
    if(opts&&opts.toast!==false&&typeof toast==='function'){
      const name=typeof SX==='function'&&SX(a)&&SX(a).ex&&SX(a).ex[i]?SX(a).ex[i][0]:'latihan yang tertunda';
      toast(current===i?'Masih ada set yang belum selesai.':('Lanjut: '+name));
    }
    if(opts&&opts.render!==false&&typeof render==='function')render();
    if(typeof scrollTo==='function')scrollTo(0,0);
    return true;
  }

  function validate(a,opts){
    const i=pendingExercise(a);
    if(i<0)return {ok:true,pending:-1};
    resumePending(a,opts||{});
    return {ok:false,pending:i};
  }

  window.apPendingWorkoutExercise=pendingExercise;
  window.apIsWorkoutComplete=isComplete;
  window.apResumePendingWorkout=resumePending;
  window.apValidateWorkoutCompletion=validate;
})();
