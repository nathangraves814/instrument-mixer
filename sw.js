/* Offline support.
   Navigations are network-first, so the iPad always picks up a new push
   while it has a connection, and falls back to the cached page when it
   does not. Everything else is cache-first. */
const CACHE = "instrument-mixer-v2";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon-180.png", "./icon-192.png", "./icon-512.png", "./favicon.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.addAll(SHELL); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys()
      .then(function(keys){
        return Promise.all(keys.map(function(k){
          return k === CACHE ? null : caches.delete(k);
        }));
      })
      .then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  const req = e.request;
  if (req.method !== "GET") return;

  if (req.mode === "navigate"){
    /* Bypass the browser's HTTP cache. GitHub Pages sends max-age=600, so a
       plain fetch() here can be answered from that cache and serve a stale
       page for ten minutes after a deploy. */
    e.respondWith(
      fetch(new Request(req.url, {cache:"no-store", credentials:"same-origin"}))
        .then(function(res){
          const copy = res.clone();
          caches.open(CACHE).then(function(c){ c.put("./index.html", copy); });
          return res;
        })
        .catch(function(){
          return caches.match("./index.html").then(function(hit){
            return hit || Response.error();
          });
        })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function(hit){
      if (hit) return hit;
      return fetch(req).then(function(res){
        if (res && (res.ok || res.type === "opaque")){
          const copy = res.clone();
          caches.open(CACHE).then(function(c){ c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
