import { getAuth, createUserWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { getFirestore, doc, setDoc }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { app } from "../config/firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("signupBtn").addEventListener("click", async () => {

const name = document.getElementById("name").value.trim();
const phone = document.getElementById("phone").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirmPassword").value;
const role = document.getElementById("role").value;

/* =====================
   VALIDATION
===================== */

if (!name || !phone || !email || !password || !confirmPassword || !role) {
alert("Please fill all fields");
return;
}

if (password !== confirmPassword) {
alert("Passwords do not match ❌");
return;
}

if (password.length < 6) {
alert("Password must be at least 6 characters");
return;
}

try {

/* =====================
   CREATE AUTH USER
===================== */

const userCredential =
await createUserWithEmailAndPassword(auth, email, password);

const user = userCredential.user;

/* =====================
   SAVE USER DATA
===================== */

await setDoc(doc(db, "users", user.uid), {

uid: user.uid,
name: name,
phone: phone,
email: email,
role: role,
createdAt: new Date()

});

alert("Signup successful 🎉");

/* =====================
   REDIRECT BASED ON ROLE
===================== */

if (role === "organizer") {

window.location.href = "../../pages/organizer/organizer.html";

}
else if (role === "attendee") {

window.location.href = "../../pages/attendee/attendee.html";

}
else if (role === "admin") {

window.location.href = "../../pages/admin/admin.html";

}

}
catch (error) {

alert(error.message);

}

});


/* =====================
   SHOW / HIDE PASSWORD
===================== */

const passwordInput = document.getElementById("password");
const showPasswordCheckbox = document.getElementById("showPassword");

showPasswordCheckbox.addEventListener("change", () => {

passwordInput.type =
showPasswordCheckbox.checked ? "text" : "password";

});