import { auth } from "../config/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

logoutBtn.addEventListener("click", async () => {

try {

await signOut(auth);

alert("Logged out successfully");

window.location.href = "../auth/login.html";

} catch (error) {

console.log(error);
alert("Logout failed");

}

});

}