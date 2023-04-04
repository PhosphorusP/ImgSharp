import { precacheAndRoute } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point

precacheAndRoute(self.__WB_MANIFEST);

(self as any).addEventListener("fetch", (e: any) => {
  const url = new URL(e.request.url);
  // If this is an incoming POST request for the
  // registered "action" URL, respond to it.
  if (e.request.method === "POST" && "/share".indexOf(url.pathname) >= 0) {
    e.respondWith(
      (async () => {
        const formData = await e.request.formData();
        let db: any;
        let request = indexedDB.open("imgsharp");
        let write = () => {
          let transaction = db.transaction(["share-target-cache"], "readwrite");
          let files = formData.getAll("images");
          for (let f of files)
            transaction
              .objectStore("share-target-cache")
              .put(f, Math.random().toString(36).substring(2));
        };
        request.onsuccess = function (event: any) {
          db = event.target.result;
          if (db.setVersion) {
            if (db.version != (window as any).dbVersion) {
              let setVersion = db.setVersion((window as any).dbVersion);
              setVersion.onsuccess = function () {
                db.createObjectStore("share-target-cache");
                write();
              };
            } else {
              write();
            }
          } else {
            write();
          }
        };
        request.onupgradeneeded = function (event: any) {
          let db = event.target.result;
          db.createObjectStore("share-target-cache");
        };
        return Response.redirect("/", 303);
      })()
    );
  }
});
