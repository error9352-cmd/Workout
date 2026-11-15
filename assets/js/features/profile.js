/*
 * ATHLETIC PHYSIQUE — PHASE 2B CANDIDATE MODULE
 *
 * Copied from 00-app-core.js for dependency review.
 * NOT loaded by index.html yet.
 */

function photoCard(){const P=PHOTOS;
 const gal=P.length?`<div class="gal">${P.map(p=>`<div><img src="${p.img}" alt="Foto progres ${fmt(p.d)}${p.pose?' '+p.pose:''}"><div class="prev">${fmt(p.d)}${p.pose?' · '+p.pose:''} <button class="chip" style="min-height:32px;padding:4px 10px" data-delp="${p.id}">Hapus</button></div></div>`).join('')}</div>`:'<p class="empty">Belum ada foto. Pilih foto dari galeri atau ambil dengan kamera.</p>';
 let cmp='';
 if(P.length>=2){const A=P.find(p=>p.id===cmpA)||P[0],B=P.find(p=>p.id===cmpB)||P[P.length-1];
  const opt=s=>P.map(p=>`<option value="${p.id}" ${p.id===s.id?'selected':''}>${fmt(p.d)}${p.pose?' · '+p.pose:''} (${P.indexOf(p)+1})</option>`).join('');
  cmp=`<h2 style="margin-top:18px">Before dan after</h2><div class="cmp"><div><label for="ca">Sebelum</label><select id="ca" data-cmp="a">${opt(A)}</select></div><div><label for="cb">Sesudah</label><select id="cb" data-cmp="b">${opt(B)}</select></div></div><div class="ba"><img src="${B.img}" alt="Sesudah ${fmt(B.d)}"><img class="top" src="${A.img}" alt="Sebelum ${fmt(A.d)}"><span class="bl">Sebelum</span><span class="br">Sesudah</span><div class="bh"></div><input class="bi" type="range" min="0" max="100" value="50" aria-label="Geser untuk membandingkan sebelum dan sesudah"></div><p class="prev" style="text-align:center">Geser foto untuk membandingkan</p>`}
 return `<section class="card"><h2>Foto progres</h2><label for="pp">Pose</label><select id="pp" data-pp="1">${['Depan','Samping','Belakang'].map(x=>`<option ${x===phPose?'selected':''}>${x}</option>`).join('')}</select><label for="pd">Tanggal foto</label><input id="pd" type="date" value="${todayIso}"><label for="pf">Tambah foto</label><div class="photo-actions"><input id="pf" type="file" accept="image/*" capture="environment"><button type="button" class="btn ghost sm" id="pcam">Ambil dengan kamera</button></div>${gal}${cmp}</section>`}
