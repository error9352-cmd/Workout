/* Extracted from the original app core. Classic script: shared global scope is intentional. */

function weekRows(){return [1,2,3,4,5,6,0].map(k=>`<div class="row"><span>${HARI[k]}${PROG[k]?' · '+esc(PROG[k].n):''}</span><span class="mute">${PROG[k]?PROG[k].ex.length+' latihan':(k===0?'Istirahat penuh':'Pemulihan')}</span></div>`).join('')}

function dayEdit(d,vk){const free=[1,2,3,4,5,6,0].some(k=>!PROG[k]);
 return `<label for="dn">Nama hari</label><input id="dn" data-dn="${vk}" value="${esc(d.n)}" maxlength="24"><div class="chips" style="margin-top:6px">${['Push','Pull','Legs','Upper','Lower','Full Body','Cardio dan Core'].map(n=>`<button class="chip" data-nm="${vk}|${n}">${n}</button>`).join('')}</div><label for="df">Fokus</label><input id="df" data-df="${vk}" value="${esc(d.f)}" maxlength="60"><label for="dw">Hari latihan</label><select id="dw" data-dw="${vk}">${[1,2,3,4,5,6,0].map(k=>`<option value="${k}" ${k==vk?'selected':''}>${HARI[k]}${PROG[k]&&k!=vk?' (tukar dengan '+esc(PROG[k].n)+')':''}</option>`).join('')}</select><div class="f" style="margin:12px 0 4px">${free?'<button class="btn ghost sm" data-addday="1" style="margin:0;flex:1">Tambah hari</button>':''}<button class="btn ghost sm" data-delday="${vk}" style="margin:0;flex:1;color:#ff8a8a">Hapus hari ini</button></div><label>Latihan</label>`}

function tipHtml(n){const t=TIPS.find(x=>x[0].test(n));return t?`<div class="tips"><div class="prev">Tips teknik</div><ul>${t[1].map(c=>`<li>${c}</li>`).join('')}</ul></div>`:''}
