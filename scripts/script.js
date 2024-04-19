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

document.addEventListener("DOMContentLoaded", function () {
  const signinLink = document.getElementById("signin-link");
  const userId = localStorage.getItem("user_id");

  if (userId) {
    signinLink.href = "cart.html";
    signinLink.innerText = "My Cart";
  } else {
    signinLink.href = "login.html";
    signinLink.innerText = "Sign in";
  }
});
