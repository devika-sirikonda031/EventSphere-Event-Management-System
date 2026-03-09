import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { app } from "../config/firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);


/* =====================
   SHOW / HIDE PASSWORD
===================== */

const passwordField = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

  if(passwordField.type === "password"){
    passwordField.type = "text";
    togglePassword.textContent = "🙈";
  } else {
    passwordField.type = "password";
    togglePassword.textContent = "👁";
  }

});

/* =====================
   LOGIN
===================== */
document.getElementById("loginBtn").addEventListener("click", async () => {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();


  if (!email || !password) {
    alert("Enter email & password");
    return;
  }

  try {

    const userCredential =
      await signInWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User role not found");
      return;
    }

    const role = userSnap.data().role;

    /* REDIRECT BASED ON ROLE */

 if (role === "admin") {
  window.location.href = "../admin/admin.html";
}
else if (role === "organizer") {
  window.location.href = "../organizer/organizer.html";
}
else if (role === "attendee") {
  window.location.href = "../attendee/attendee.html";
}
else {
  alert("Invalid role");
}

  } catch (error) {
    alert(error.message);
  }

});


/* =====================
   FORGOT PASSWORD
===================== */
document.getElementById("forgotPassword").addEventListener("click", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Enter your registered email first");
    return;
  }

  try {

    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent 📩");

  } catch (error) {
    alert(error.message);
  }

});


/* =====================
   SHOW / HIDE PASSWORD
===================== */

document.getElementById("showPassword").addEventListener("change", () => {

  const passwordField = document.getElementById("password");

  passwordField.type =
    passwordField.type === "password"
      ? "text"
      : "password";

});