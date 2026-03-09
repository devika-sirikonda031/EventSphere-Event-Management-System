import { getAuth, signOut } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { app } from "../config/firebase.js";

const auth = getAuth(app);

export async function logoutUser() {

try {

await signOut(auth);

window.location.href = "../../pages/auth/login.html";

}
catch(error){

alert(error.message);

}

}