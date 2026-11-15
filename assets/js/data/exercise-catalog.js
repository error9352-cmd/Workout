/* Athletic Physique — centralized exercise metadata registry.
 * Exercise names/categories remain in the existing apLIB/ap_lib system.
 * Optional metadata is stored separately to preserve existing workout records.
 */
(function(){
  const KEY = 'ap_exercise_meta';
  const norm = name => String(name || '').trim().toLowerCase();
  const read = () => {
    try { return (typeof ls !== 'undefined' && ls.get) ? (ls.get(KEY, {}) || {}) : {}; }
    catch (_) { return {}; }
  };
  const get = name => {
    const key = norm(name);
    const base = (window.AP_EXERCISE_DEFAULTS || {})[key] || {};
    const all = read();
    return Object.assign({}, base, all[key] || {});
  };
  const list = () => {
    const base = window.AP_EXERCISE_DEFAULTS || {};
    const all = read();
    return Object.keys(base).map(key => Object.assign({}, base[key], all[key] || {}));
  };
  const save = (name, patch) => {
    const key = norm(name);
    if (!key) return false;
    const all = read();
    all[key] = Object.assign({}, all[key] || {}, patch || {}, { name: String(name).trim() });
    if (typeof ls !== 'undefined' && ls.set) ls.set(KEY, all);
    return true;
  };
  const remove = name => {
    const all = read(); delete all[norm(name)];
    if (typeof ls !== 'undefined' && ls.set) ls.set(KEY, all);
  };
  window.apExerciseCatalog = { key: KEY, normalize: norm, read, get, list, save, remove };
})();
