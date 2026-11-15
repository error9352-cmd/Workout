/* ATHLETIC PHYSIQUE — Workout Logging UX v8
 * Additive UX layer for set logging. Keeps the existing workout engine as source of truth.
 */
(function(){
  'use strict';

  const FOCUS_KEY='ap_workout_focus_v1';
  const FINISH_KEY='ap_finish_confirmed_v1';

  function active(){try{return typeof getA==='function'?getA():null}catch(e){return null}}
  function saveFocus(i,j){try{sessionStorage.setItem(FOCUS_KEY,JSON.stringify({i,j,ts:Date.now()}))}catch(e){}}
  function readFocus(){try{const v=JSON.parse(sessionStorage.getItem(FOCUS_KEY)||'null');if(!v||Date.now()-v.ts>5000)return null;return v}catch(e){return null}}
  function clearFocus(){try{sessionStorage.removeItem(FOCUS_KEY)}catch(e){}}

  function setStatus(){
    const a=active();
    if(!a||!document.body.classList.contains('wk'))return;
    const sets=(a.sets||[]), total=sets.reduce((n,x)=>n+(x||[]).length,0), done=sets.reduce((n,x)=>n+(x||[]).filter(s=>s.done&&!s.w).length,0);
    const head=document.querySelector('.wk-session-head');
    if(!head)return;
    let el=head.querySelector('[data-ap-log-status]');
    if(!el){
      el=document.createElement('div');el.dataset.apLogStatus='1';el.className='ap-log-status';
      const bar=head.nextElementSibling;
      if(bar)bar.insertAdjacentElement('afterend',el);else head.appendChild(el);
    }
    const remaining=Math.max(0,total-done);
    el.innerHTML=`<span><b>${done}</b> / ${total} set tercatat</span><span>${remaining?`Sisa ${remaining} set`:'Semua set tercatat'}</span>`;
    el.classList.toggle('complete',remaining===0);
  }

  function focusNext(){
    const f=readFocus();if(!f)return;
    setTimeout(()=>{
      const a=active();if(!a){clearFocus();return}
      let el=document.querySelector(`[data-f][data-i="${f.i}"][data-j="${f.j}"]`);
      if(!el){
        const next=document.querySelector('.set:not(.done) [data-f]');
        el=next||null;
      }
      if(el){el.focus({preventScroll:false});try{el.select()}catch(e){}}
      clearFocus();
    },45);
  }

  // Enter on the repetition field is the fastest path for keyboard users.
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter'||e.isComposing)return;
    const input=e.target.closest&&e.target.closest('[data-f="reps"]');
    if(!input)return;
    const row=input.closest('.set');
    const done=row&&row.querySelector('[data-done]');
    if(done&&!done.disabled){e.preventDefault();done.click();}
  });

  // Select existing values on focus and clear stale validation styling while editing.
  document.addEventListener('focusin',function(e){
    const input=e.target.closest&&e.target.closest('[data-f]');
    if(!input)return;
    input.classList.remove('err');
    if(input.value)requestAnimationFrame(()=>{try{input.select()}catch(err){}});
  });
  document.addEventListener('input',function(e){
    const input=e.target.closest&&e.target.closest('[data-f]');
    if(!input)return;
    input.classList.remove('err');
    const row=input.closest('.set');if(row)row.dataset.apDirty='1';
  });

  // Before the existing Catat handler runs, remember which field should receive focus next.
  document.addEventListener('click',function(e){
    const b=e.target.closest&&e.target.closest('[data-done]');
    if(!b)return;
    const [i,j]=String(b.dataset.done).split('-').map(Number);
    const a=active();if(!a||!a.sets||!a.sets[i]||!a.sets[i][j]||a.sets[i][j].done)return;
    const row=a.sets[i];
    let ni=i,nj=j+1;
    while(ni<row.length&&row[nj]&&row[nj].done){nj++;}
    if(nj>=row.length){
      ni=i+1;nj=0;
      while(ni<a.sets.length&&(!a.sets[ni]||a.sets[ni].every(s=>s.done||s.w))){ni++;}
    }
    if(ni<a.sets.length)saveFocus(ni,nj);
  },true);

  // Protect the primary completion action from accidental taps when the workout is partial.
  document.addEventListener('click',function(e){
    const b=e.target.closest&&e.target.closest('[data-finish]');
    if(!b)return;
    if(b.dataset[FINISH_KEY]){delete b.dataset[FINISH_KEY];return;}
    const a=active();if(!a)return;
    const total=(a.sets||[]).reduce((n,x)=>n+(x||[]).filter(s=>!s.w).length,0);
    const done=(a.sets||[]).reduce((n,x)=>n+(x||[]).filter(s=>s.done&&!s.w).length,0);
    if(done===0)return;
    if(done<total){
      e.preventDefault();e.stopImmediatePropagation();
      const ok=window.confirm(`Workout belum selesai. ${total-done} set masih belum dicatat. Tetap selesaikan workout sekarang?`);
      if(ok){
        b.dataset[FINISH_KEY]='1';
        setTimeout(()=>{if(b.isConnected)b.click()},0);
      }
    }
  },true);

  // Add logging state after the existing render has produced the workout DOM.
  const nativeRender=window.render;
  if(typeof nativeRender==='function'){
    window.render=function(){
      const out=nativeRender.apply(this,arguments);
      if(active()){
        setStatus();
        focusNext();
      }
      return out;
    };
  }

  // First-load enhancement for an already active workout.
  if(active()){
    setTimeout(()=>{setStatus();focusNext()},0);
  }
})();
