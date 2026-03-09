import { auth, db } from "../config/firebase.js";

import { protectPage } from "../auth/authGuard.js";
import { logoutUser } from "../auth/logout.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { 
doc, 
getDoc, 
updateDoc 
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* PROTECT PAGE */

protectPage("admin");

/* LOGOUT */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
logoutBtn.addEventListener("click", logoutUser);
}

/* DOM */

const profileImg = document.getElementById("profileImg");
const photoInput = document.getElementById("photoInput");
const changePhotoBtn = document.getElementById("changePhotoBtn");

const nameEl = document.getElementById("adminName");
const emailEl = document.getElementById("adminEmail");
const phoneEl = document.getElementById("adminPhone");
const roleEl = document.getElementById("adminRole");

/* LOAD PROFILE */

onAuthStateChanged(auth, async (user) => {

if (!user) {
window.location.href = "../../pages/auth/login.html";
return;
}

try {

const userRef = doc(db, "users", user.uid);
const snap = await getDoc(userRef);

if (!snap.exists()) return;

const data = snap.data();

nameEl.innerText = data.name || "Not set";
emailEl.innerText = data.email || user.email;
phoneEl.innerText = data.phone || "Not set";
roleEl.innerText = data.role || "admin";

/* PROFILE IMAGE */

if (data.photoURL) {
profileImg.src = data.photoURL;
}

}
catch (error) {
console.log(error);
}

});


/* OPEN FILE SELECTOR */

changePhotoBtn.addEventListener("click", () => {
photoInput.click();
});


/* UPLOAD PROFILE PHOTO */

photoInput.addEventListener("change", async () => {

const file = photoInput.files[0];
const user = auth.currentUser;

if (!file || !user) return;

/* PREVIEW IMAGE */

profileImg.src = URL.createObjectURL(file);

const reader = new FileReader();

reader.onload = async function (e) {

const base64Image = e.target.result;

try {

await updateDoc(doc(db, "users", user.uid), {
photoURL: base64Image
});

alert("Profile photo saved successfully ✅");

}
catch (error) {

alert(error.message);

}

};

reader.readAsDataURL(file);

});