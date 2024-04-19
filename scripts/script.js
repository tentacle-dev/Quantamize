// chooses the first one that is available/found
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

// Some browsers may not support
if (!indexedDB) {
  console.log("IndexedDB could not be found in this browser.");
}

let dbName = "Quantamize";
