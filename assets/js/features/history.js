/*
 * ATHLETIC PHYSIQUE — PHASE 2B CANDIDATE MODULE
 *
 * Copied from 00-app-core.js for dependency review.
 * NOT loaded by index.html yet.
 */

function historyFiltered(){const all=sessions().map((s,k)=>({s,k}));const q=histQ.trim().toLowerCase();const cutoff=histRange?new Date(today.getTime()-((histRange-1)*86400000)):null;return all.filter(({s})=>{if(cutoff&&s.date<iso(cutoff))return false;if(!q)return true;const hay=[s.name,s.note,...Object.keys(s.log||{})].join(' ').toLowerCase();return hay.includes(q)}).reverse()}

function historyStats(items){const n=items.length,sets=items.reduce((a,{s})=>a+Object.values(s.log||{}).reduce((t,v)=>t+v.length,0),0),vol=items.reduce((a,{s})=>a+(s.volume||0),0),mins=items.reduce((a,{s})=>a+(s.minutes||0),0);return `<div class="history-summary"><div class="stat"><div class="num">${n}</div><small>sesi</small></div><div class="stat"><div class="num">${sets}</div><small>set</small></div><div class="stat"><div class="num">${vol>=10000?(Math.round(vol/100)/10)+'t':Math.round(vol).toLocaleString('id-ID')}</div><small>volume</small></div><div class="stat"><div class="num">${mins>=60?Math.floor(mins/60)+'j '+mins%60+'m':mins+'m'}</div><small>durasi</small></div></div>`}

function offlineNote(){if(!('serviceWorker' in navigator))return 'Mode offline tidak didukung di browser ini.';if(!/^https?:$/.test(location.protocol))return 'Mode offline aktif setelah aplikasi dibuka lewat alamat web (https), bukan dari file lokal.';return navigator.serviceWorker.controller?'Mode offline aktif: aplikasi bisa dibuka tanpa sinyal.':'Mode offline sedang disiapkan. Buka ulang aplikasi sekali saat online.'}
