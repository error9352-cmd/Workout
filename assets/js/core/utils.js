/*
 * Athletic Physique — core utilities
 * Phase 2D
 *
 * First active extraction from 00-app-core.js.
 * These helpers are intentionally dependency-free.
 */

function wtText(sec){return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');}

function est1(a){let m=0;a.forEach(x=>{const v=x.reps>1?x.kg*(1+x.reps/30):x.kg;if(v>m)m=v});return Math.round(m*2)/2}
