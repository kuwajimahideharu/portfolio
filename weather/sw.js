// いまここ天気 Service Worker — アプリシェルのみキャッシュ、外部API（気象庁等）は素通し
// 相対パスなのでルート配置（自宅サーバー）でもサブディレクトリ配置（GitHub Pages）でも動く
const CACHE = "ima-koko-tenki-v8";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// stale-while-revalidate: 手元にあるものを即返し、裏で新版を取ってくる。
// 起動時にネットワークを待たないので、電波が悪くても画面がすぐ出る（更新は次の起動から反映）。
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // 気象庁などの外部APIはキャッシュしない
  if (e.request.method !== "GET") return;     // 利用状況カウンターの POST /api/hit は素通し
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const net = fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
