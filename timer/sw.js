const CACHE = "timer-v9";
// 相対パス: ドメイン直下でもサブフォルダ（hideharu.site/timer/）でも動く
const VOICE_FILES = ["m1", "s30", "c10", "c9", "c8", "c7", "c6", "c5", "c4", "c3", "c2", "c1"].map(n => `./voice/${n}.wav`);
const ASSETS = ["./", "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", ...VOICE_FILES];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("timer-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// stale-while-revalidate: キャッシュ即応答しつつ裏で更新
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
