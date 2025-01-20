(function () {
  if (!globalThis.crypto) {
    try {
      globalThis.crypto = require("crypto");
    } catch (e) {
      console.error("Failed to load crypto module in Node.js:", e);
    }
  }
})();
