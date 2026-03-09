import { auth, db } from "../config/firebase.js";

import {
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";


const nameInput = document.getElementById("editName");
const phoneInput = document.getElementById("editPhone");
const saveBtn = document.getElementById("saveProfile");


let currentUserId;


/* LOAD USER DATA */

onAuthStateChanged(auth, async(user)=>{

if(!user){
window.location.href="../auth/login.html";
return;
}

currentUserId = user.uid;

const userRef = doc(db,"users",user.uid);
const userSnap = await getDoc(userRef);

if(userSnap.exists()){

const data = userSnap.data();

nameInput.value = data.name || "";
phoneInput.value = data.phone || "";

}

});


/* SAVE PROFILE */

saveBtn.addEventListener("click", async()=>{

const userRef = doc(db,"users",currentUserId);

await updateDoc(userRef,{
name: nameInput.value,
phone: phoneInput.value
});

alert("Profile updated successfully");

});