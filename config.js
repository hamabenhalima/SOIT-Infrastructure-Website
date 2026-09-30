(() => {
  const isLocal =
    location.protocol === "file:" ||
    ["localhost", "127.0.0.1"].includes(location.hostname);

  window.SOIT_CONFIG = Object.freeze({
    apiBaseUrl: isLocal
      ? "http://localhost:3001/api"
      : "https://soit-backend.onrender.com/api",
  });
})();
