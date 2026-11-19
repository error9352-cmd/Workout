/* Athletic Physique - service worker
   Navigasi dan aset aplikasi lokal: network-first agar update terbaru segera dipakai.
   Resource eksternal: cache-first agar tetap nyaman saat offline.
   Cache versi dinaikkan setiap perubahan strategi/asset PWA yang material. */
const V = 'ap-v61-program-hydration-gate';
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

const fallback = req => caches.match(req, { ignoreSearch: true })
  .then(r => r || caches.match('./') || caches.match('index.html'));

const networkFirst = (req, timeout = 3500) => new Promise(resolve => {
  let done = false;
  const finish = r => { if (!done) { done = true; resolve(r); } };
  const timer = setTimeout(() => fallback(req).then(r => finish(r || Response.error())), timeout);
  fetch(req).then(res => {
    if (!done) { clearTimeout(timer); finish(keep(req, res)); }
    else keep(req, res);
  }).catch(() => {
    clearTimeout(timer);
    fallback(req).then(r => finish(r || Response.error()));
  });
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !/^https?:/.test(req.url) || req.url.includes('.supabase.co')) return;

  if (req.mode === 'navigate') {
    e.respondWith(networkFirst(req));
    return;
  }

  const sameOrigin = new URL(req.url).origin === self.location.origin;
  if (sameOrigin) {
    // CSS/JS/JSON/images lokal harus mengambil versi network terbaru bila online.
    e.respondWith(networkFirst(req));
    return;
  }

  // Resource eksternal tetap cache-first untuk pengalaman offline.
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => keep(req, res)).catch(() => hit);
      return hit || net;
    })
  );
});
