/* Athletic Physique - service worker (mode offline)
   Halaman: network-first (update otomatis), jatuh ke cache saat offline.
   Aset lain (font, ikon, manifest): cache dulu, perbarui di latar belakang. */
const V = 'ap-v51';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(V)
      .then(c => Promise.all(CORE.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k.startsWith('ap-') && k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const keep = (req, res) => {
  if (res && (res.ok || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(V).then(c => c.put(req, copy)).catch(() => {});
  }
  return res;
};

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !/^https?:/.test(req.url) || req.url.includes('.supabase.co')) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      new Promise(resolve => {
        let done = false;
        const fallback = () => caches.match(req, { ignoreSearch: true })
          .then(r => r || caches.match('./') || caches.match('index.html'));
        const timer = setTimeout(() => fallback().then(r => { if (r && !done) { done = true; resolve(r); } }), 3500);
        fetch(req).then(res => { if (!done) { done = true; clearTimeout(timer); resolve(keep(req, res)); } else keep(req, res); })
          .catch(() => { clearTimeout(timer); fallback().then(r => { if (!done) { done = true; resolve(r || Response.error()); } }); });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => keep(req, res)).catch(() => hit);
      return hit || net;
    })
  );
});
