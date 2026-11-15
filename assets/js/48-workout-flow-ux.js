/* ATHLETIC PHYSIQUE — Workout Flow UX v7
 * Additive safety/UX layer. Does not replace the canonical workout engine.
 * Goals: reliable workout entry, clear active-session state, and safer completion.
 */
(function(){
  'use strict';

  const ACTIVE_KEY='ap_active';
  const LAUNCH_LOCK='ap_workout_launch_lock_v1';

  function active(){
    try{return typeof getA==='function'?getA():ls.get(ACTIVE_KEY,null);}catch(e){return null;}
  }
  function setLaunchState(btn,busy){
    if(!btn)return;
    if(busy){
      btn.dataset.apLaunching='1';
      btn.setAttribute('aria-busy','true');
      btn.disabled=true;
      btn.dataset.apOriginalText=btn.textContent;
      btn.textContent='Membuka workout…';
    }else{
      delete btn.dataset.apLaunching;
      btn.removeAttribute('aria-busy');
      btn.disabled=false;
      if(btn.dataset.apOriginalText){btn.textContent=btn.dataset.apOriginalText;delete btn.dataset.apOriginalText;}
    }
  }

  function launch(kind,id,btn){
    const now=Date.now();
    const lock=Number(sessionStorage.getItem(LAUNCH_LOCK)||0);
    if(now-lock<700)return;
    sessionStorage.setItem(LAUNCH_LOCK,String(now));
    setLaunchState(btn,true);

    try{
      const a=active();
      if(a){
        if(String(a.dow)===String(id)){
          if(typeof tab!=='undefined')tab='workout';
          if(typeof render==='function')render();
          if(typeof scrollTo==='function')scrollTo(0,0);
          return;
        }
        setLaunchState(btn,false);
        if(typeof toast==='function')toast('Selesaikan atau batalkan workout yang sedang berjalan dulu.');
        return;
      }

      if(kind==='home' && typeof window.apStartHomeWorkout==='function'){
        window.apStartHomeWorkout(Number(id));
      }else if(typeof startWorkout==='function'){
        startWorkout(Number(id));
      }
    }catch(err){
      setLaunchState(btn,false);
      if(typeof toast==='function')toast('Workout belum dapat dimulai. Coba sekali lagi.');
      console.error('[AP Workout Flow]',err);
    }finally{
      setTimeout(()=>{
        if(btn&&btn.isConnected&&!active())setLaunchState(btn,false);
      },900);
    }
  }

  // Capture phase guarantees that rapid double clicks cannot create duplicate sessions.
  document.addEventListener('click',function(e){
    const home=e.target.closest&&e.target.closest('[data-home-start]');
    if(home){
      e.preventDefault();
      e.stopImmediatePropagation();
      launch('home',home.dataset.homeStart,home);
      return;
    }

    const gym=e.target.closest&&e.target.closest('[data-start]');
    if(gym){
      e.preventDefault();
      e.stopImmediatePropagation();
      launch('gym',gym.dataset.start,gym);
    }
  },true);

  // Keep navigation out of the way while an active session is running, but allow
  // the existing Workout tab to remain the single source of truth.
  document.addEventListener('click',function(e){
    const nav=e.target.closest&&e.target.closest('#nav [data-go]');
    if(!nav)return;
    const a=active();
    if(!a||nav.dataset.go==='workout')return;
    if(typeof toast==='function')toast('Workout sedang berjalan. Selesaikan atau batalkan sesi terlebih dahulu.');
    e.preventDefault();
    e.stopImmediatePropagation();
  },true);

  // Add a small state marker used by the visual layer without changing the DOM structure.
  function syncState(){
    const a=active();
    document.body.classList.toggle('ap-workout-active',!!a);
    if(a){
      document.body.dataset.workoutDay=String(a.dow);
    }else{
      delete document.body.dataset.workoutDay;
    }
  }

  const nativeRender=window.render;
  if(typeof nativeRender==='function'){
    window.render=function(){
      const out=nativeRender.apply(this,arguments);
      syncState();
      return out;
    };
  }

  syncState();
})();
