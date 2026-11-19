/* Athletic Physique — Runtime App Configuration (Stage 6)
 * Public-safe runtime flags are read through ap_get_runtime_config().
 * Sensitive admin settings remain protected by app_settings RLS.
 */
(()=>{
 'use strict';
 const sb=window.apSupabase;
 const defaults={maintenance_mode:false,allow_registration:true,allow_google_login:true,auto_resume_workout:true,weekly_coach_enabled:true,smart_program_enabled:true,adaptive_workout_enabled:true,intelligence_enabled:true};
 const state={...defaults};
 const api={get(key){return state[key]},isEnabled(key){return state[key]===true},all(){return {...state}},setLocal(key,value){state[key]=value;applyMaintenance()}};
 window.AP_APP_CONFIG=api;
 const ready=(async()=>{
  if(!sb)return state;
  try{
   const {data,error}=await sb.rpc('ap_get_runtime_config');
   if(!error&&Array.isArray(data)) data.forEach(x=>{try{state[x.key]=typeof x.value==='string'?JSON.parse(x.value):x.value}catch(_){state[x.key]=x.value}});
  }catch(_){/* fallback defaults */}
  applyMaintenance();
  try{window.dispatchEvent(new CustomEvent('ap:runtime-config-ready',{detail:{...state}}))}catch(_){}
  if(typeof window.render==='function')window.render();
  return state;
 })();
 window.AP_APP_CONFIG_READY=ready;
 function applyMaintenance(){
  if(!state.maintenance_mode){document.getElementById('ap-maintenance-overlay')?.remove();return}
  if(document.getElementById('ap-admin'))return;
  if(document.getElementById('ap-maintenance-overlay'))return;
  const el=document.createElement('div');el.id='ap-maintenance-overlay';el.style.cssText='position:fixed;inset:0;z-index:99999;background:#070d17;color:#e8eef8;display:flex;align-items:center;justify-content:center;padding:24px;font:15px/1.6 system-ui,-apple-system,Segoe UI,sans-serif;text-align:center';
  el.innerHTML='<div style="max-width:520px"><div style="font-size:12px;letter-spacing:.12em;color:#7dd3fc;font-weight:800">ATHLETIC PHYSIQUE</div><h1 style="font-size:30px;margin:10px 0">Sedang dalam pemeliharaan</h1><p style="color:#91a2bb;margin:0">Aplikasi sedang dipersiapkan untuk pengalaman yang lebih baik. Silakan coba lagi beberapa saat lagi.</p></div>';
  document.body.appendChild(el);
 }
})();
