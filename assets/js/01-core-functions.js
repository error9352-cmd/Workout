/* Extracted from the original app core. Classic script: shared global scope is intentional. */

function badges(){const ss=sessions(),n=ss.length,vol=ss.reduce((a,s)=>a+(s.volume||0),0),f=Math.max(1,+prof().freq||4),wk={};ss.forEach(s=>{const k=monOf(s.date);wk[k]=(wk[k]||0)+1});
const full=Object.values(wk).some(c=>c>=f),ph=PHOTOS.length;
return [{id:'s1',n:'Langkah pertama',t:'1 sesi',ok:n>=1},{id:'s10',n:'Mulai rutin',t:'10 sesi',ok:n>=10},{id:'s25',n:'Konsisten',t:'25 sesi',ok:n>=25},{id:'s50',n:'Veteran',t:'50 sesi',ok:n>=50},{id:'wk',n:'Minggu penuh',t:'capai target',ok:full},{id:'v10',n:'10 ton',t:'total volume',ok:vol>=1e4},{id:'v50',n:'50 ton',t:'total volume',ok:vol>=5e4},{id:'ph',n:'Jejak foto',t:'1 foto',ok:ph>=1}]}

function badgeCard(){const b=badges(),k=b.filter(x=>x.ok).length;
return `<section class="card"><h2>Pencapaian</h2><p class="sub">${k} dari ${b.length} terbuka</p><div class="bdg">${b.map(x=>`<div class="bd${x.ok?' on':''}" role="img" aria-label="${x.n}, ${x.ok?'terbuka':'terkunci, '+x.t}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${x.ok?'<path d="M5 12l4.5 4.5L19 7"/>':'<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>'}</svg><b>${x.n}</b><small>${x.t}</small></div>`).join('')}</div></section>`}

function themeCard(){const t=ls.get('ap_theme','biru');return `<section class="card"><h2>Warna aksen</h2><div class="thm">${[['biru','Biru','#3B82F6,#22D3EE'],['hijau','Hijau','#16A34A,#A3E635'],['oranye','Oranye','#EA580C,#FBBF24'],['ungu','Ungu','#8B5CF6,#E879F9'],['merah','Merah','#E11D48,#FB7185']].map(x=>`<button class="th" data-th="${x[0]}" aria-pressed="${t===x[0]}"><i style="background:linear-gradient(135deg,${x[2]})"></i>${x[1]}</button>`).join('')}</div></section>`}

function customCard(){const ks=Object.keys(PROG).map(Number).filter(k=>k>=7).sort((a,b)=>a-b);
return `<section class="card"><h2>Latihan lain</h2><p class="sub">Menu tambahan di luar jadwal mingguan.</p>${ks.length?ks.map(k=>`<div class="row"><span>${esc(PROG[k].n)}<small class="prev" style="display:block">${PROG[k].ex.length} gerakan${PROG[k].f?', '+esc(PROG[k].f):''}</small></span><span style="display:flex;gap:6px"><button class="chip" data-xe="${k}">Ubah</button><button class="chip" data-start="${k}">Mulai</button></span></div>`).join(''):'<p class="empty">Belum ada menu tambahan.</p>'}<button class="btn ghost sm" data-xn="1">+ Buat latihan baru</button><button class="btn ghost sm" data-rec="1">Rekomendasi jadwal mingguan</button><button class="btn ghost sm" data-tpl="1">Pakai template siap pakai</button></section>`}

function ringCard(d){const f=Math.max(1,+prof().freq||4),r=Math.min(1,d/f),C=238.76,rem=Math.max(0,f-d);
return `<section class="card ringcard" aria-label="Target mingguan"><svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${d} dari ${f} sesi"><defs><linearGradient id="rgr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset="1" stop-color="#3B82F6"/></linearGradient></defs><circle class="t" cx="46" cy="46" r="38" fill="none" stroke-width="9"/><circle class="v" cx="46" cy="46" r="38" fill="none" stroke="url(#rgr)" stroke-width="9" stroke-linecap="round" transform="rotate(-90 46 46)" stroke-dasharray="${C}" stroke-dashoffset="${(C*(1-r)).toFixed(1)}" style="--c:${C}"/><text class="n" x="46" y="54" text-anchor="middle">${d}/${f}</text></svg><div><h2>Target mingguan</h2><p class="sub">${rem?'Tinggal '+rem+' sesi lagi minggu ini':'Target minggu ini tercapai'}</p></div></section>`}

function heatCard(){const m={};sessions().forEach(s=>{m[s.date]=(m[s.date]||0)+(s.volume||1)});const mx=Math.max(1,...Object.values(m)),st=new Date(mondayIso()+'T00:00:00');st.setDate(st.getDate()-77);let c='',n=0;
for(let w=0;w<12;w++)for(let k=0;k<7;k++){const d=new Date(st);d.setDate(st.getDate()+w*7+k);const id=iso(d);
if(id>todayIso){c+='<i class="hc fu"></i>';continue}
const v=m[id]||0;if(v)n++;c+=`<i class="hc${v?(v>=mx*.5?' l2':' l1'):''}${id===todayIso?' td':''}" style="--w:${w}"></i>`}
return `<section class="card"><h2>Konsistensi</h2><p class="sub">12 minggu terakhir, ${n} hari latihan</p><div class="hm" role="img" aria-label="${n} hari latihan dalam 12 minggu terakhir">${c}</div></section>`}

function exMode(e){const n=String(e&&e[0]||'').trim(),t=String(e&&e[1]||'').toLowerCase(),m=String(e&&e[2]||'').toLowerCase();if(m==='time'||m==='waktu'||m==='duration')return 'time';if(m==='bodyweight'||m==='berat badan')return 'bodyweight';if(/menit|detik/.test(t))return 'time';if(/treadmill|sepeda statis|elliptical|rowing machine|stair climber|lompat tali|jalan cepat|plank|side plank/.test(n.toLowerCase()))return 'time';if(/push up|pull up|chin up|dips|crunch|bicycle crunch|hanging leg raise|russian twist|mountain climber|dead bug|ab wheel rollout/.test(n.toLowerCase()))return 'bodyweight';return 'weight'}

function modeLabel(m){return m==='time'?'WAKTU':m==='bodyweight'?'BERAT BADAN':'BEBAN + REP'}

function modeUnit(e){return /detik/i.test(String(e&&e[1]||''))?'detik':'menit'}

function prev(n){const s=sessions();for(let i=s.length-1;i>=0;i--){if(s[i].log&&s[i].log[n])return s[i].log[n]}return null}
