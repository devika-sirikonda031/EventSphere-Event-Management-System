import { auth, db } from "../config/firebase.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

export function protectPage(role){

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href = "../auth/login.html";
return;
}

try{

const userDoc = await getDoc(doc(db,"users",user.uid));

if(!userDoc.exists()){
window.location.href = "../auth/login.html";
return;
}

const userData = userDoc.data();

if(userData.role !== role){
window.location.href = "../auth/login.html";
return;
}

}
catch(error){
console.log(error);
}

});

}