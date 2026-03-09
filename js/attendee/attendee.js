import { auth, db } from "../config/firebase.js";

import {
collection,
getDocs,
query,
where,
addDoc,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { protectPage } from "../auth/authGuard.js";
import { logoutUser } from "../auth/logout.js";

/* PROTECT PAGE */

protectPage("attendee");

/* DOM */

const searchInput = document.getElementById("searchEvent");
const eventsList = document.getElementById("eventsList");
const logoutBtn = document.getElementById("logoutBtn");

/* LOGOUT */

if(logoutBtn){
logoutBtn.addEventListener("click", logoutUser);
}

/* PROFILE CLICK */

const profilePic = document.getElementById("profilePic");

if(profilePic){
profilePic.addEventListener("click", () => {
window.location.href = "../profile/profile.html";
});
}

/* LOAD PROFILE PHOTO */

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

if(!user) return;

const snap = await getDoc(doc(db,"users",user.uid));

if(snap.exists()){

const data = snap.data();

if(data.photoURL && profilePic){
profilePic.src = data.photoURL;
}

}

});


/* ===============================
   LOAD EVENTS
================================ */

async function loadEvents(){

eventsList.innerHTML = "";

/* ONLY APPROVED EVENTS */

const q = query(
collection(db,"events"),
where("status","==","approved")
);

const snapshot = await getDocs(q);

snapshot.forEach(async (docSnap)=>{

const event = docSnap.data();
const eventId = docSnap.id;

/* SEARCH FILTER */

const searchText = searchInput.value.toLowerCase();

if(!event.name.toLowerCase().includes(searchText)){
return;
}

/* CREATE CARD */

const eventCard = document.createElement("div");
eventCard.classList.add("event-card");

/* COUNT REGISTRATIONS */

const regQuery = query(
collection(db,"registrations"),
where("eventId","==",eventId)
);

const regSnap = await getDocs(regQuery);

const registeredCount = regSnap.size;
const seatsLeft = event.maxAttendees - registeredCount;

/* DATE CHECK */

const today = new Date();
today.setHours(0,0,0,0);

const eventDate = new Date(event.date);

let buttonHTML = "";

/* EVENT STATUS */

if(eventDate < today){

buttonHTML = "<p style='color:red'><b>Event Completed</b></p>";

}
else if(seatsLeft <= 0){

buttonHTML = "<p style='color:red'><b>Event Full</b></p>";

}
else{

const user = auth.currentUser;

if(user){

const checkQuery = query(
collection(db,"registrations"),
where("eventId","==",eventId),
where("userId","==",user.uid)
);

const checkSnap = await getDocs(checkQuery);

if(!checkSnap.empty){

buttonHTML = `<button class="registered-btn" disabled>Registered</button>`;

}else{

buttonHTML = `<button onclick="registerEvent('${eventId}')">Register Event</button>`;

}

}else{

buttonHTML = `<button onclick="registerEvent('${eventId}')">Register Event</button>`;

}

}

/* EVENT IMAGE */

const imageURL = event.image || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678";

/* CARD HTML */

eventCard.innerHTML = `

<div class="event-image">
<img src="${imageURL}">
</div>

<div class="event-content">

<h3>${event.name}</h3>

<p class="event-desc">${event.description || "Exciting event waiting for you!"}</p>

<div class="event-details">

<p><strong>Date:</strong> ${event.date}</p>

<p><strong>Location:</strong> ${event.location}</p>

${eventDate < today ? "" : `
<p><strong>Seats Left:</strong> ${seatsLeft}</p>
`}

</div>

${buttonHTML}

</div>
`;

eventsList.appendChild(eventCard);

});

}


/* ===============================
   REGISTER EVENT
================================ */

window.registerEvent = async function(eventId){

const user = auth.currentUser;

if(!user){
alert("Please login first");
return;
}

try{

const eventRef = doc(db,"events",eventId);
const eventSnap = await getDoc(eventRef);
const eventData = eventSnap.data();

/* CHECK CAPACITY */

const capacityQuery = query(
collection(db,"registrations"),
where("eventId","==",eventId)
);

const capacitySnap = await getDocs(capacityQuery);

if(capacitySnap.size >= eventData.maxAttendees){
alert("⚠️ Event is full");
return;
}

/* CHECK DUPLICATE */

const regQuery = query(
collection(db,"registrations"),
where("eventId","==",eventId),
where("userId","==",user.uid)
);

const regSnap = await getDocs(regQuery);

if(!regSnap.empty){
alert("You already registered for this event");
return;
}

/* USER DATA */

const userDoc = await getDoc(doc(db,"users",user.uid));
const userData = userDoc.data();

/* GENERATE TICKET */

const ticketId = "EVT-" + Math.floor(100000 + Math.random() * 900000);

/* SAVE REGISTRATION */

await addDoc(collection(db,"registrations"),{

ticketId : ticketId,
eventId : eventId,
userId : user.uid,
userName : userData?.name || "User",
userEmail : userData?.email || user.email,
registeredAt : new Date()

});

/* SHOW TICKET */

document.getElementById("ticketEvent").innerText =
"Event: " + eventData.name;

document.getElementById("ticketUser").innerText =
"Name: " + (userData?.name || "User");

document.getElementById("ticketDate").innerText =
"Date: " + eventData.date;

document.getElementById("ticketLocation").innerText =
"Location: " + eventData.location;

document.getElementById("ticketId").innerText =
"Ticket ID: " + ticketId;

document.getElementById("ticketPopup").style.display = "flex";

/* REFRESH EVENTS */

loadEvents();

}catch(error){
alert(error.message);
}

};


/* ===============================
   CLOSE TICKET
================================ */

window.closeTicket = function(){
document.getElementById("ticketPopup").style.display = "none";
};


/* ===============================
   AUTO LOAD EVENTS
================================ */

loadEvents();

/* LIVE SEARCH */

searchInput.addEventListener("input", loadEvents);


/* ===============================
   DOWNLOAD TICKET PDF
================================ */

window.downloadTicket = function(){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

/* GET DATA */

const event = document.getElementById("ticketEvent").innerText;
const user = document.getElementById("ticketUser").innerText;
const date = document.getElementById("ticketDate").innerText;
const location = document.getElementById("ticketLocation").innerText;
const ticket = document.getElementById("ticketId").innerText;

/* TITLE */

doc.setFontSize(20);
doc.text("Event Ticket", 80, 20);

doc.setFontSize(12);

doc.text(event, 20, 50);
doc.text(user, 20, 60);
doc.text(date, 20, 70);
doc.text(location, 20, 80);
doc.text(ticket, 20, 90);

/* CREATE QR CODE */

const qrCanvas = document.createElement("canvas");

new QRCode(qrCanvas, {
text: ticket,
width: 100,
height: 100
});

/* WAIT SMALL TIME THEN ADD QR */

setTimeout(()=>{

const qrImage = qrCanvas.querySelector("img").src;

doc.addImage(qrImage, "PNG", 140, 50, 40, 40);

doc.save("event-ticket.pdf");

},300);

};