// Service Worker nur unter http(s) registrieren; unter file:// gibt es keinen.
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
