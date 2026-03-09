import { db } from "../config/firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { protectPage } from "../auth/authGuard.js";

protectPage("organizer");

/* PROFILE CLICK */

const profilePic = document.getElementById("profilePic");

if(profilePic){
profilePic.addEventListener("click", () => {

window.location.href = "../profile/profile.html";

});
}

/* GET EVENT ID */

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

const container = document.getElementById("attendeesList");
const total = document.getElementById("totalCount");

/* LOAD ATTENDEES */

async function loadAttendees(){

if(!eventId){
container.innerHTML = "<p>No event selected</p>";
return;
}

const q = query(
collection(db,"registrations"),
where("eventId","==",eventId)
);

const snapshot = await getDocs(q);
total.textContent = snapshot.size;

if(snapshot.empty){
container.innerHTML = "<p>No attendees registered yet</p>";
return;
}

container.innerHTML = "";

snapshot.forEach(docSnap=>{

const data = docSnap.data();

const div = document.createElement("div");

div.innerHTML = `
<div class="attendee-card">

<h3>${data.userName}</h3>

<p><b>Email:</b> ${data.userEmail}</p>

<p><b>Ticket:</b> ${data.ticketId}</p>

</div>
`;

container.appendChild(div);

});

}

loadAttendees();