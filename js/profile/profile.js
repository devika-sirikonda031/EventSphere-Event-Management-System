import { auth, db, storage } from "../config/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-storage.js";


const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const profileRole = document.getElementById("profileRole");
const profileImage = document.getElementById("profileImage");
const uploadPhoto = document.getElementById("uploadPhoto");


/* LOAD USER PROFILE */

onAuthStateChanged(auth, async (user) => {

if (!user) {
window.location.href = "../auth/login.html";
return;
}

try {

const userDoc = await getDoc(doc(db,"users",user.uid));

if(userDoc.exists()){

const data = userDoc.data();

profileName.innerText = data.name || "User";
profileEmail.innerText = data.email || user.email;
profilePhone.innerText = data.phone || "Not added";
profileRole.innerText = data.role || "User";

if(data.photoURL){
profileImage.src = data.photoURL;
}

}

} catch(error){
console.log(error);
}

});


/* CLICK IMAGE TO CHANGE PHOTO */

profileImage.addEventListener("click", () => {
uploadPhoto.click();
});


/* UPLOAD NEW PHOTO */

uploadPhoto.addEventListener("change", async () => {

const file = uploadPhoto.files[0];
if(!file) return;

const user = auth.currentUser;

try{

const storageRef = ref(storage,"profilePhotos/"+user.uid);

await uploadBytes(storageRef,file);

const photoURL = await getDownloadURL(storageRef);

await updateDoc(doc(db,"users",user.uid),{
photoURL: photoURL
});

profileImage.src = photoURL + "?t=" + new Date().getTime();

alert("Profile photo updated");

}catch(error){
console.log(error);
}

});