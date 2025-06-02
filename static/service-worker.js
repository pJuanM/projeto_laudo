self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("laudo-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/static/style.css",
                "/static/script.js",
                "/static/img/icon-192.png",
                "/static/img/icon-512.png"
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
