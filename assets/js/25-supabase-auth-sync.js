/* Athletic Physique — extracted from original index.html script block 26 (line 3656) */
(function(){
if(!window.supabase)return;
const U='https://tgbqtpmrkyfitvxchcwp.supabase.co',K='sb_publishable_C3nUA9n1BQKEImk145vXmg_VXVgpDDi';
const sb=supabase.createClient(U,K,{auth:{persistSession:true,autoRefreshToken:true}});
const SKIP={ap_photos:1,ap_theme:1};
let uid=null,t=null,busy=false,dirty=new Set();
try{dirty=new Set(JSON.parse(localStorage.getItem('sbq')||'[]'))}catch(e){}
const saveQ=()=>{try{localStorage.setItem('sbq',JSON.stringify([...dirty]))}catch(e){}};
const apKeys=()=>Object.keys(localStorage).filter(k=>/^ap_/.test(k)&&!SKIP[k]);
const wipe=()=>{apKeys().forEach(k=>localStorage.removeItem(k));localStorage.removeItem('sbq');dirty.clear()};
async function flush(){
 if(!uid||busy||!dirty.size)return;busy=true;
 const ks=[...dirty],now=new Date().toISOString();
 const rows=ks.map(k=>{let v=null;try{const r=localStorage.getItem(k);v=r==null?null:JSON.parse(r)}catch(e){}return{user_id:uid,key:k,value:v,updated_at:now}});
 try{const{error}=await sb.from('user_data').upsert(rows);if(!error){ks.forEach(k=>dirty.delete(k));saveQ()}}catch(e){}
 busy=false;
}
const o=ls.set;
ls.set=function(k){const r=o.apply(this,arguments);
 if(uid&&/^ap_/.test(k)&&!SKIP[k]){dirty.add(k);saveQ();clearTimeout(t);t=setTimeout(flush,2000)}
 return r};
async function pull(){
 const{data,error}=await sb.from('user_data').select('key,value');
 if(error||!data)return;
 if(!data.length){
  if(apKeys().length){
   if(confirm('Akun ini masih kosong.\nOK = unggah data di perangkat ini ke akun.\nBatal = mulai dari kosong (data lokal ap_* di perangkat ini dihapus).')){
    apKeys().forEach(k=>dirty.add(k));saveQ();await flush();
   }else{wipe();location.reload()}
  }
  return;
 }
 let ch=false;
 data.forEach(r=>{if(dirty.has(r.key))return;const s=JSON.stringify(r.value);
  if(localStorage.getItem(r.key)!==s){localStorage.setItem(r.key,s);ch=true}});
 if(ch)location.reload();
}
const st=document.createElement('style');
st.textContent='.sbx-w{position:fixed;inset:0;z-index:99999;display:none;overflow:auto;background:radial-gradient(120% 80% at 50% 0,#17306b 0,#0b1226 55%,#060A14 100%);font:15px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#E8EEF9;padding:max(20px,env(safe-area-inset-top)) 20px max(20px,env(safe-area-inset-bottom))}.sbx-c{width:100%;max-width:380px;margin:auto;display:flex;flex-direction:column;gap:14px}.sbx-c img{width:76px;height:76px;border-radius:20px;align-self:center;box-shadow:0 8px 30px rgba(34,211,238,.25)}.sbx-c h1{font-size:24px;text-align:center;margin:4px 0 0}.sbx-s{text-align:center;opacity:.65;font-size:14px;margin:-6px 0 4px}.sbx-t{display:flex;background:rgba(255,255,255,.06);border-radius:12px;padding:4px}.sbx-t button{flex:1;padding:10px;border:0;border-radius:9px;background:none;color:#9fb2d6;font-weight:600;font-size:14px}.sbx-t button.on{background:#22d3ee;color:#04101c}.sbx-c label{display:flex;flex-direction:column;gap:6px;font-size:13px;color:#9fb2d6;font-weight:600}.sbx-c input{width:100%;box-sizing:border-box;padding:13px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#fff;font-size:16px;outline:0}.sbx-c input:focus{border-color:#22d3ee;box-shadow:0 0 0 3px rgba(34,211,238,.18)}.sbx-p{position:relative}.sbx-p input{padding-right:90px}.sbx-p button{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:0;color:#22d3ee;font-size:13px;font-weight:600;padding:8px}.sbx-m{min-height:20px;font-size:13px;text-align:center;color:#fca5a5}.sbx-m.ok{color:#86efac}.sbx-g{padding:14px;border:0;border-radius:12px;background:linear-gradient(135deg,#22d3ee,#3b82f6);color:#04101c;font-weight:700;font-size:16px}.sbx-g:disabled{opacity:.6}.sbx-k{background:none;border:0;color:#8aa0c4;font-size:14px;padding:8px}.sbx-n{text-align:center;font-size:12px;opacity:.5}.sbx-b{position:fixed;z-index:99998;top:calc(env(safe-area-inset-top,0px) + 10px);right:14px;display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(15,22,38,.82);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#E8EEF9;font:600 12px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.35);cursor:pointer;transition:transform .12s,border-color .2s,background .2s}.sbx-b:hover{border-color:rgba(34,211,238,.5);background:rgba(23,33,58,.92)}.sbx-b:active{transform:scale(.95)}.sbx-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 8px #4ade80}.sbx-lo{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(6,10,20,.78);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font:15px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#E8EEF9;animation:sbxFade .2s ease-out}.sbx-loc{width:100%;max-width:360px;background:radial-gradient(120% 90% at 50% 0,#17306b 0,#101726 65%,#0b1226 100%);border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:24px 20px 20px;box-shadow:0 20px 50px rgba(0,0,0,.6);display:flex;flex-direction:column;gap:14px;text-align:center;animation:sbxPop .25s cubic-bezier(.16,1,.3,1)}.sbx-loc img{width:64px;height:64px;border-radius:18px;margin:0 auto;box-shadow:0 8px 24px rgba(34,211,238,.25)}.sbx-loc h2{font-size:21px;font-weight:700;margin:2px 0 0;color:#fff;font-family:inherit}.sbx-loc p{font-size:13.5px;color:#9fb2d6;margin:-6px 0 0}.sbx-em{display:inline-flex;align-items:center;justify-content:center;gap:6px;margin:0 auto;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);font-size:12.5px;color:#cfe0ff;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sbx-warn{padding:10px 12px;border-radius:12px;background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.35);color:#fde68a;font-size:12.5px;text-align:left;display:none}.sbx-act{display:flex;gap:10px;margin-top:4px}.sbx-act button{flex:1;padding:13px 12px;border-radius:12px;font-weight:700;font-size:14.5px;cursor:pointer;transition:transform .1s,opacity .2s}.sbx-act button:active{transform:scale(.97)}.sbx-ccl{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:#cfe0ff}.sbx-out{border:0;background:linear-gradient(135deg,#f43f5e,#e11d48);color:#fff;box-shadow:0 6px 18px rgba(225,29,72,.35)}.sbx-out:disabled{opacity:.6}@keyframes sbxFade{from{opacity:0}}@keyframes sbxPop{from{opacity:0;transform:scale(.94) translateY(10px)}}';
document.head.appendChild(st);
const ov=document.createElement('div');ov.className='sbx-w';
ov.innerHTML='<div class="sbx-c"><img src="icon-192.png" alt=""><h1>Athletic Physique</h1><div class="sbx-s">Pantau latihan, simpan progres, sinkron di semua perangkat.</div><div class="sbx-t"><button data-m="in" class="on">Masuk</button><button data-m="up">Daftar</button></div><label>Email<input id="sbe" type="email" placeholder="nama@email.com" autocomplete="email" inputmode="email"></label><label>Kata sandi<div class="sbx-p"><input id="sbp" type="password" placeholder="Minimal 6 karakter" autocomplete="current-password"><button type="button" id="sbt">Tampilkan</button></div></label><div id="sbm" class="sbx-m" role="alert"></div><button id="sbg" class="sbx-g">Masuk</button><button id="sbs" class="sbx-k">Lanjut tanpa akun</button><div class="sbx-n">Data tersimpan aman dan hanya bisa diakses akun Anda.</div></div>';
const lo=document.createElement('div');lo.className='sbx-lo';
lo.innerHTML='<div class="sbx-loc" role="dialog" aria-modal="true" aria-labelledby="sblot"><img src="icon-192.png" alt=""><h2 id="sblot">Keluar dari Akun?</h2><div class="sbx-em" id="sbloem"></div><p>Data latihan Anda tetap tersimpan aman di cloud dan bisa diakses kembali kapan saja.</p><div class="sbx-warn" id="sblowarn"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px;margin-right:6px"><path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></svg>Ada perubahan offline yang belum terkirim ke cloud. Jika keluar sekarang, perubahan tersebut akan hilang.</div><div class="sbx-act"><button type="button" class="sbx-ccl" id="sbloccl">Batal</button><button type="button" class="sbx-out" id="sbloout">Keluar</button></div></div>';
document.body.append(ov,lo);
const $=id=>ov.querySelector('#'+id);
let uemail='';
const show=()=>{setMode('in');ov.style.display='flex'};
const upd=()=>{
 const host=document.getElementById('sb-account-content');
 if(!host)return;
 const state=uid?'in:'+uemail:'out';
 if(host.dataset.accountState===state)return;
 host.dataset.accountState=state;
 host.innerHTML=uid
  ? `<div class="sbx-account-state"><div class="sbx-account-identity"><span class="sbx-dot"></span><div><b>Akun terhubung</b><small>${uemail||'Email akun tersinkron'}</small></div></div><p class="sub">Data latihan dapat disinkronkan dan dipulihkan melalui akun ini.</p><div class="sbx-account-actions"><button type="button" class="btn" data-sb-sync>Simpan &amp; sinkronkan</button><button type="button" class="btn ghost sm" data-sb-logout>Keluar</button></div><p class="sbx-account-feedback" id="sb-account-feedback" aria-live="polite"></p></div>`
  : `<p class="sub">Masuk atau buat akun untuk menyimpan dan menyinkronkan data latihan Anda.</p><button type="button" class="btn" data-sb-login>Masuk / Buat akun</button><p class="sbx-account-feedback" id="sb-account-feedback" aria-live="polite">Saat ini data tetap tersimpan di perangkat ini.</p>`;
};
new MutationObserver(()=>upd()).observe(document.getElementById('app'),{childList:true,subtree:true});
let mode='in';
const setMode=m=>{mode=m;ov.querySelectorAll('[data-m]').forEach(b=>b.classList.toggle('on',b.dataset.m===m));$('sbg').textContent=m==='in'?'Masuk':'Buat akun';$('sbp').autocomplete=m==='in'?'current-password':'new-password';msg('')};
const msg=(t,ok)=>{const e=$('sbm');e.textContent=t;e.className='sbx-m'+(ok?' ok':'')};
const tr=t=>/Invalid login/i.test(t)?'Email atau kata sandi salah.':/not confirmed/i.test(t)?'Email belum dikonfirmasi. Cek kotak masuk Anda.':/already registered/i.test(t)?'Email sudah terdaftar. Silakan masuk.':/at least/i.test(t)?'Kata sandi minimal 6 karakter.':/rate limit|too many/i.test(t)?'Terlalu banyak percobaan. Coba lagi nanti.':/invalid/i.test(t)?'Format email tidak valid.':t;
async function go(){
 const e=$('sbe').value.trim(),p=$('sbp').value,b=$('sbg');
 if(!e||!p){msg('Isi email dan kata sandi.');return}
 b.disabled=true;b.textContent='Memproses…';msg('');
 try{
  const up=mode==='up';
  const r=up?await sb.auth.signUp({email:e,password:p}):await sb.auth.signInWithPassword({email:e,password:p});
  if(r.error){msg(tr(r.error.message));return}
  if(!r.data.session){msg('Pendaftaran berhasil. Cek email untuk konfirmasi, lalu masuk.',1);setMode('in');return}
  uid=r.data.user.id;uemail=r.data.user.email||'';localStorage.removeItem('sbskip');ov.style.display='none';upd();await flush();await pull();
 }catch(x){msg('Gagal terhubung. Periksa koneksi internet.')}
 finally{b.disabled=false;b.textContent=mode==='in'?'Masuk':'Buat akun'}
}
ov.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>setMode(b.dataset.m));
$('sbg').onclick=go;
[$('sbe'),$('sbp')].forEach(i=>i.addEventListener('keydown',ev=>{if(ev.key==='Enter')go()}));
$('sbt').onclick=()=>{const i=$('sbp'),h=i.type==='password';i.type=h?'text':'password';$('sbt').textContent=h?'Sembunyikan':'Tampilkan'};
$('sbs').onclick=()=>{localStorage.setItem('sbskip','1');ov.style.display='none'};
const hideLo=()=>{lo.style.display='none'};
lo.onclick=e=>{if(e.target===lo)hideLo()};
lo.querySelector('#sbloccl').onclick=hideLo;
lo.querySelector('#sbloout').onclick=async()=>{
 const btn=lo.querySelector('#sbloout');
 btn.disabled=true;btn.textContent='Keluar…';
 await flush();
 try{await sb.auth.signOut()}catch(e){}
 wipe();location.reload();
};
document.addEventListener('click',async e=>{
 const login=e.target.closest&&e.target.closest('[data-sb-login]');
 const logout=e.target.closest&&e.target.closest('[data-sb-logout]');
 const sync=e.target.closest&&e.target.closest('[data-sb-sync]');
 if(login){show();return}
 if(logout){
  lo.querySelector('#sbloem').textContent=uemail||'Akun tersinkron';
  lo.querySelector('#sblowarn').style.display='none';
  lo.style.display='flex';
  await flush();
  if(dirty.size)lo.querySelector('#sblowarn').style.display='block';
  return;
 }
 if(sync){
  const b=sync,feedback=document.getElementById('sb-account-feedback');
  b.disabled=true;b.textContent='Menyimpan…';
  if(feedback)feedback.textContent='Menyinkronkan data latihan…';
  try{
   await flush();
   await pull();
   if(feedback)feedback.textContent=dirty.size?'Sebagian data belum tersinkron. Periksa koneksi lalu coba lagi.':'Data berhasil disinkronkan.';
  }catch(err){
   if(feedback)feedback.textContent='Sinkronisasi gagal. Periksa koneksi internet lalu coba lagi.';
  }finally{
   b.disabled=false;b.textContent='Simpan & sinkronkan';
  }
 }
});
window.addEventListener('online',flush);
document.addEventListener('visibilitychange',()=>{if(document.hidden)flush()});
sb.auth.getSession().then(async({data})=>{
 const s=data&&data.session;
 if(s){
  uid=s.user.id;uemail=s.user.email||'';
  localStorage.removeItem('sbskip');
  upd();
  await flush();
  await pull();
 }else{
  upd();
  // Show the account dialog only on the first launch unless the user explicitly skipped it.
  if(localStorage.getItem('sbskip')!=='1') setTimeout(()=>show(),80);
 }
}).catch(()=>{
 upd();
 if(localStorage.getItem('sbskip')!=='1') setTimeout(()=>show(),80);
});
})();
