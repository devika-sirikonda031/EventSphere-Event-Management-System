import { auth, db } from "../config/firebase.js";

import {
collection,
query,
where,
getDocs,
doc,
getDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const container = document.getElementById("myEventsList");

onAuthStateChanged(auth, async (user) => {

if (!user) {
window.location.href = "../auth/login.html";
return;
}

loadMyEvents(user.uid);

});

async function loadMyEvents(userId){

container.innerHTML = "Loading your events...";

const q = query(
collection(db,"registrations"),
where("userId","==",userId)
);

const snapshot = await getDocs(q);

if(snapshot.empty){
container.innerHTML = "<p>No registered events</p>";
return;
}

container.innerHTML = "";

for(const regDoc of snapshot.docs){

const regData = regDoc.data();

const eventRef = doc(db,"events",regData.eventId);
const eventSnap = await getDoc(eventRef);

if(!eventSnap.exists()) continue;

const event = eventSnap.data();

const card = document.createElement("div");

card.style.border = "1px solid #ccc";
card.style.padding = "15px";
card.style.marginBottom = "10px";

card.innerHTML = `

<div class="registered-content">

<h3>${event.name}</h3>

<p><b>Date:</b> ${event.date}</p>
<p><b>Location:</b> ${event.location}</p>
<p><b>Ticket ID:</b> ${regData.ticketId}</p>

<button class="cancel-btn"
onclick="cancelRegistration('${regDoc.id}')">
Cancel Registration
</button>

</div>

`;

container.appendChild(card);

}

}

window.cancelRegistration = async function(regId){

const confirmCancel = confirm("Cancel this registration?");

if(!confirmCancel) return;

await deleteDoc(doc(db,"registrations",regId));

alert("Registration cancelled");

location.reload();

}

// }catch(error){

// alert(error.message);

// }

// }