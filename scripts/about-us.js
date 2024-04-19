document.addEventListener("DOMContentLoaded", function () {
  const signinLink = document.getElementById("signin-link");
  const userId = localStorage.getItem("user_id");

  if (userId) {
    signinLink.href = "logout.html";
    signinLink.innerText = "Logout";
  } else {
    signinLink.href = "login.html";
    signinLink.innerText = "Sign in";
  }
});
