/* Run from project root: node audit/verify-integration.js */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

async function testSyncContract() {
  const source = fs.readFileSync('assets/js/24-patch.js', 'utf8');
  const cut = source.slice(0, source.indexOf("const st=document.createElement('style');"));
  const storage = new Map();
  const calls = [];
  let failPush = false;
  const localStorage = {
    getItem: k => storage.has(k) ? storage.get(k) : null,
    setItem: (k, v) => storage.set(k, String(v)),
    removeItem: k => storage.delete(k),
    get length() { return storage.size; },
    key: i => [...storage.keys()][i]
  };
  const sb = { from(table) { return {
    upsert: async rows => { calls.push({ type: 'upsert', table, rows }); return failPush ? { error: { message: 'offline' } } : { error: null }; },
    select(cols) { calls.push({ type: 'select', table, cols }); return { eq: async (col, val) => { calls.push({ type: 'eq', col, val }); return { data: [], error: null }; } }; }
  }; } };
  const window = { supabase: true, AP_SUPABASE_CONFIG: { url: 'https://example.test', publishableKey: 'public' }, dispatchEvent() {} };
  const context = { window, supabase: { createClient: () => sb }, CustomEvent: function () {}, console, localStorage,
    ls: { set(k, v) { storage.set(k, JSON.stringify(v)); return v; }, get(k, d) { const v = storage.get(k); return v == null ? d : JSON.parse(v); } },
    setTimeout: () => 1, clearTimeout() {}, Date, JSON, Set, Object, String, Array, Promise };
  vm.runInNewContext(cut + "window.__test={setUser(id){uid=id},mark(k){dirty.add(k);saveQ()},flush,pull,dirty:()=>[...dirty]};})();", context);
  const api = window.__test;
  api.setUser('user-A');
  localStorage.setItem('ap_sessions', '[]');
  api.mark('ap_sessions');
  failPush = true;
  assert.equal(await api.flush(), false, 'failed push must report false');
  assert.equal(api.dirty().length, 1, 'failed push must retain dirty key');
  failPush = false;
  assert.equal(await api.flush(), true, 'successful push must report true');
  assert.equal(api.dirty().length, 0, 'successful push must clear dirty key');
  await api.pull();
  const filter = calls.find(x => x.type === 'eq');
  assert.deepEqual([filter.col, filter.val], ['user_id', 'user-A'], 'pull must scope active user');
  assert.equal(JSON.parse(localStorage.getItem('sbq')).uid, 'user-A', 'queue must persist owner UID');
  return 4;
}

function testAdminDataContract() {
  const source = fs.readFileSync('assets/js/61-super-admin.js', 'utf8');
  const declarations = source.split('\n').filter(line => /const sessionPayloads=|const sessionStats=|const sessionMode=|const sessionDate=/.test(line));
  assert.equal(declarations.length, 4, 'expected four admin session helpers');
  const helpers = vm.runInNewContext('(()=>{' + declarations.join('\n') + ';return {sessionPayloads,sessionStats,sessionMode,sessionDate}})()');
  const rows = [
    { user_id: 'A', key: 'ap_training_model_v1', updated_at: '2026-11-19', value: { sessions: [{ id: '1', date: '2026-11-18', name: 'Gym', program: { type: 'gym' }, exercises: [{ name: 'Bench', sets: [{ kg: 40, reps: 10, done: true, warmup: false }, { kg: 20, reps: 5, warmup: true }] }] }] } },
    { user_id: 'B', key: 'ap_sessions', updated_at: '2026-11-19', value: [{ date: '2026-11-17', name: 'Home Gym', log: { PushUp: [{ mode: 'bodyweight', reps: 12 }] } }] }
  ];
  const sessions = helpers.sessionPayloads(rows);
  assert.equal(sessions.length, 2, 'canonical and legacy users must both be represented');
  const canonical = sessions.find(x => x.user_id === 'A');
  const legacy = sessions.find(x => x.user_id === 'B');
  assert.deepEqual(JSON.parse(JSON.stringify(helpers.sessionStats(canonical))), { exercises: 1, sets: 1, volume: 400 });
  assert.equal(helpers.sessionMode(legacy), 'Home Gym');
  return 4;
}

async function testLegacyQueueOwnership() {
  const source = fs.readFileSync('assets/js/24-patch.js', 'utf8');
  const cut = source.slice(0, source.indexOf("const st=document.createElement('style');"));
  const storage = new Map([['sbq', JSON.stringify(['ap_sessions'])], ['ap_sessions', '[]']]);
  const localStorage = { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k,v) => storage.set(k,String(v)), removeItem: k => storage.delete(k), get length(){return storage.size}, key:i=>[...storage.keys()][i] };
  let pushed = null;
  const sb = { from(){ return { upsert: async rows => { pushed = rows; return { error: null }; } }; } };
  const window = { supabase: true, AP_SUPABASE_CONFIG: { url: 'https://example.test', publishableKey: 'public' }, dispatchEvent() {} };
  const context = { window, supabase: { createClient: () => sb }, CustomEvent: function(){}, console, localStorage, confirm: () => true,
    ls: { set(k,v){storage.set(k,JSON.stringify(v));return v;}, get(k,d){const v=storage.get(k);return v==null?d:JSON.parse(v);} }, setTimeout:()=>1, clearTimeout(){}, Date, JSON, Set, Object, String, Array, Promise };
  vm.runInNewContext(cut + "window.__test={prepareSession,dirty:()=>[...dirty]};})();", context);
  assert.equal(await window.__test.prepareSession('legacy-owner'), true, 'legacy queue requires explicit owner confirmation');
  assert.equal(pushed[0].user_id, 'legacy-owner', 'confirmed legacy queue must be bound to selected account');
  assert.deepEqual(Array.from(window.__test.dirty()), [], 'successful legacy queue migration clears pending keys');
  return 1;
}

function testAuthFeatureGates() {
  const auth = fs.readFileSync('assets/js/24-patch.js', 'utf8');
  const core = fs.readFileSync('assets/js/00-app-core.js', 'utf8');
  assert.match(auth, /mode==='up'.*isEnabled\('allow_registration'\)===false/s, 'email registration must respect allow_registration');
  assert.match(auth, /isEnabled\('allow_google_login'\)===false/, 'Google OAuth must respect allow_google_login');
  assert.match(auth, /isEnabled\('allow_registration'\)===false\)\{msg\('Google Login sementara dinonaktifkan/, 'Google OAuth must not bypass disabled registration');
  assert.match(core, /isEnabled\('weekly_coach_enabled'\)===false\?'':weeklyCoach/, 'Weekly Coach card must respect runtime flag');
  return 4;
}

async function testRuntimeConfig() {
  const source = fs.readFileSync('assets/js/64-app-config.js', 'utf8');
  let dispatched = false, rendered = false;
  const document = { getElementById() { return null; }, createElement() { return { style: {}, id: '', innerHTML: '' }; }, body: { appendChild() {} } };
  const window = {
    apSupabase: { rpc: async () => ({ data: [
      { key: 'allow_registration', value: false },
      { key: 'allow_google_login', value: false },
      { key: 'weekly_coach_enabled', value: false }
    ], error: null }) },
    dispatchEvent() { dispatched = true; }, render() { rendered = true; }
  };
  vm.runInNewContext(source, { window, document, CustomEvent: function () {}, Promise });
  await window.AP_APP_CONFIG_READY;
  assert.equal(window.AP_APP_CONFIG.isEnabled('allow_registration'), false);
  assert.equal(window.AP_APP_CONFIG.isEnabled('allow_google_login'), false);
  assert.equal(window.AP_APP_CONFIG.isEnabled('weekly_coach_enabled'), false);
  assert.ok(dispatched && rendered, 'runtime config must announce readiness and refresh UI');
  return 5;
}

(async () => {
  const results = [await testSyncContract(), testAdminDataContract(), await testLegacyQueueOwnership(), testAuthFeatureGates(), await testRuntimeConfig()];
  console.log(`Integration harness: ${results.reduce((a, b) => a + b, 0)}/${results.reduce((a, b) => a + b, 0)} PASS`);
})().catch(error => { console.error(error); process.exitCode = 1; });
