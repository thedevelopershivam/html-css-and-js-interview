const CACHE_NAME = "v1"; // Name of the cache
const FILES_TO_CACHE = [
  "/", // Root HTML (index.html)
  "../../sass/main.css", // CSS file
  "./script.js", // JavaScript file
  "../../offline.html", // Fallback offline HTML
];

// Install event - cache files
self.addEventListener("install", (event) => {
//   console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching files...");
      return cache.addAll(FILES_TO_CACHE); // Cache all files
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch event - serve cached files if available
self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match("/offline.html"))
      );
    })
  );
});


console.time();
console.log("first")
console.timeEnd();