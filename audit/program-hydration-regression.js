'use strict';
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const root = path.resolve(__dirname, '..');
const core = fs.readFileSync(path.join(root, 'assets/js/00-app-core.js'), 'utf8');
const onboarding = fs.readFileSync(path.join(root, 'assets/js/10-patch.js'), 'utf8');
const sync = fs.readFileSync(path.join(root, 'assets/js/24-patch.js'), 'utf8');
const results = [];
async function test(name, fn) { try { await fn(); results.push({name, ok:true}); } catch (e) { results.push({name, ok:false, error:e.message}); } }

(async()=>{
await test('Cloud hydration updates cached PROG, weights, theme, and rerenders', async () => {
  const start = core.indexOf('window.apApplyHydratedStorage=function(keys){');
  const end = core.indexOf('\n};', start) + 3;
  assert(start >= 0 && end > start, 'hydration hook not found');
  const store = {ap_prog:{'1':{n:'Saved Upper A',f:'Push',ex:[['Bench Press','3 x 8']]}},ap_weights:[{d:'2026-11-19',kg:75}],ap_theme:'hijau'};
  const ctx = {window:{},ls:{get:(k,d)=>Object.prototype.hasOwnProperty.call(store,k)?store[k]:d},PROG:{},weights:[],document:{documentElement:{dataset:{}}},render(){ctx.rendered=(ctx.rendered||0)+1},console};
  vm.createContext(ctx); vm.runInContext(core.slice(start,end),ctx);
  ctx.window.apApplyHydratedStorage(['ap_prog','ap_weights','ap_theme']);
  assert.strictEqual(ctx.PROG['1'].n,'Saved Upper A');
  assert.strictEqual(ctx.weights[0].kg,75);
  assert.strictEqual(ctx.document.documentElement.dataset.theme,'hijau');
  assert.strictEqual(ctx.rendered,1);
});

await test('Welcome wizard waits for ap:cloud-ready and does not open for saved program', async () => {
  const start = onboarding.indexOf('// Onboarding must not run while Supabase is still restoring');
  const end = onboarding.lastIndexOf('\n})();');
  assert(start >= 0 && end > start, 'onboarding gate not found');
  const listeners = {}, timers = [];
  const win = {__AP_CLOUD_AUTH_PENDING:true,addEventListener:(n,fn)=>{(listeners[n] ||= []).push(fn)}};
  const ctx = {window:win,ls:{get:()=>false},prof:()=>({height:173}),PROG:{'1':{n:'Saved Upper A'}},getA:()=>null,onbSheet(){ctx.opened=(ctx.opened||0)+1},setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout(){}};
  vm.createContext(ctx); vm.runInContext(onboarding.slice(start,end),ctx);
  assert.strictEqual(timers.length,0);
  win.__AP_CLOUD_AUTH_PENDING=false; (listeners['ap:cloud-ready']||[]).forEach(fn=>fn());
  assert.strictEqual(timers.length,1); timers.shift()();
  assert.strictEqual(ctx.opened||0,0);
});

await test('Welcome wizard appears for genuinely empty account only after cloud-ready', async () => {
  const start = onboarding.indexOf('// Onboarding must not run while Supabase is still restoring');
  const end = onboarding.lastIndexOf('\n})();');
  const listeners = {}, timers = [];
  const win = {__AP_CLOUD_AUTH_PENDING:true,addEventListener:(n,fn)=>{(listeners[n] ||= []).push(fn)}};
  const ctx = {window:win,ls:{get:()=>false},prof:()=>({height:null}),PROG:{},getA:()=>null,onbSheet(){ctx.opened=(ctx.opened||0)+1},setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout(){}};
  vm.createContext(ctx); vm.runInContext(onboarding.slice(start,end),ctx);
  assert.strictEqual(timers.length,0);
  win.__AP_CLOUD_AUTH_PENDING=false; (listeners['ap:cloud-ready']||[]).forEach(fn=>fn());
  timers.shift()(); assert.strictEqual(ctx.opened,1);
});

await test('Supabase pull applies hydration and does not use reload for normal pull', async () => {
  assert(sync.includes('window.apApplyHydratedStorage(changedKeys)'), 'pull must call hydration hook');
  assert(!sync.includes("const reloadGuard='ap_sb_pull_reload_'"), 'legacy reload-based pull branch remains');
  assert(sync.includes('window.__AP_CLOUD_AUTH_PENDING=true'), 'auth pending gate missing');
  assert(sync.includes('markCloudReady();'), 'cloud-ready release missing');
});

await test('Supabase pull restores ap_prog for the active UID and refreshes memory without reload', async () => {
  const start = sync.indexOf('async function pull(){');
  const end = sync.indexOf('\nconst st=document.createElement', start);
  assert(start >= 0 && end > start, 'pull function not found');
  const storage = new Map(), hydrated = [];
  const rows = [{key:'ap_prog',value:{'2':{n:'Cloud Lower A',f:'Legs',ex:[['Leg Press','3 x 10']]}}}];
  const ctx = {
    uid:'user-A',dirty:new Set(),
    sb:{from:()=>({select:()=>({eq:async(col,val)=>{assert.strictEqual(col,'user_id');assert.strictEqual(val,'user-A');return {data:rows,error:null}}})})},
    localStorage:{getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
    sessionStorage:{removeItem(){}},apKeys:()=>[],confirm:()=>false,wipe(){},saveQ(){},flush:async()=>true,
    window:{apApplyHydratedStorage:keys=>hydrated.push(...keys)},console,location:{reload(){throw new Error('normal pull must not reload')}}
  };
  vm.createContext(ctx); vm.runInContext(sync.slice(start,end)+'\nglobalThis.__pull = pull;',ctx);
  assert.strictEqual(await ctx.__pull(),true);
  assert.strictEqual(JSON.parse(storage.get('ap_prog'))['2'].n,'Cloud Lower A');
  assert.deepStrictEqual(hydrated,['ap_prog']);
});

await test('Supabase pull does not overwrite a dirty local program', async () => {
  const start = sync.indexOf('async function pull(){');
  const end = sync.indexOf('\nconst st=document.createElement', start);
  const storage = new Map([['ap_prog',JSON.stringify({'1':{n:'Local Unsynced'}})]]);
  const ctx = {
    uid:'user-A',dirty:new Set(['ap_prog']),
    sb:{from:()=>({select:()=>({eq:async()=>({data:[{key:'ap_prog',value:{'1':{n:'Cloud Old'}}}],error:null})})})},
    localStorage:{getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
    sessionStorage:{removeItem(){}},apKeys:()=>[],confirm:()=>false,wipe(){},saveQ(){},flush:async()=>true,
    window:{apApplyHydratedStorage(){throw new Error('dirty local key should not hydrate')}},console,location:{reload(){throw new Error('unexpected reload')}}
  };
  vm.createContext(ctx); vm.runInContext(sync.slice(start,end)+'\nglobalThis.__pull = pull;',ctx);
  assert.strictEqual(await ctx.__pull(),true);
  assert.strictEqual(JSON.parse(storage.get('ap_prog'))['1'].n,'Local Unsynced');
});

await test('Local ap_sb metadata is excluded from user-data sync and cache cleanup', async () => {
  assert(sync.includes("&&!/^ap_sb_/.test(k)"), 'ap_sb metadata exclusion missing');
  assert(sync.includes("if(uid&&/^ap_/.test(k)&&!SKIP[k]&&!/^ap_sb_/.test(k))"), 'local metadata must not enter dirty queue');
});

const failed = results.filter(x=>!x.ok);
console.log(JSON.stringify({total:results.length,passed:results.length-failed.length,failed:failed.length,results},null,2));
if(failed.length) process.exit(1);
})();
