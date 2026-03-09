import { auth, db } from "../config/firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
query,
where,
getDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { protectPage } from "../auth/authGuard.js";
import { logoutUser } from "../auth/logout.js";

protectPage("organizer");


/* =========================
   DOM ELEMENTS
========================= */

const logoutBtn = document.getElementById("logoutBtn");
const profilePic = document.getElementById("profilePic");

const createEventForm = document.getElementById("createEventForm");
const openCreateBtn = document.getElementById("openCreateFormBtn");
const cancelCreateBtn = document.getElementById("cancelCreateBtn");

const eventName = document.getElementById("eventName");
const eventDate = document.getElementById("eventDate");
const eventLocation = document.getElementById("eventLocation");
const eventImage = document.getElementById("eventImage");
const eventDescription = document.getElementById("eventDescription");
const eventCategory = document.getElementById("eventCategory");
const maxAttendees = document.getElementById("maxAttendees");

const createEventBtn = document.getElementById("createEventBtn");

let currentUser = null;


/* =========================
   LOGOUT
========================= */

if(logoutBtn){
logoutBtn.addEventListener("click", logoutUser);
}


/* =========================
   PROFILE PAGE CLICK
========================= */

if(profilePic){
profilePic.addEventListener("click", () => {
window.location.href = "../profile/profile.html";
});
}


/* =========================
   LOAD PROFILE PHOTO
========================= */

onAuthStateChanged(auth, async(user)=>{

if(!user) return;

currentUser = user;

const snap = await getDoc(doc(db,"users",user.uid));

if(snap.exists()){

const data = snap.data();

if(data.photoURL && profilePic){
profilePic.src = data.photoURL;
}

}

loadMyEvents();

});


/* =========================
   OPEN / CLOSE CREATE FORM
========================= */

if(openCreateBtn){
openCreateBtn.onclick = () => {
createEventForm.style.display = "block";
};
}

if(cancelCreateBtn){
cancelCreateBtn.onclick = () => {
createEventForm.style.display = "none";
};
}


/* =========================
   CREATE EVENT
========================= */

if(createEventBtn){

createEventBtn.addEventListener("click", async () => {

if(!currentUser){
alert("Not logged in");
return;
}

const name = eventName.value.trim();
const date = eventDate.value;
const location = eventLocation.value.trim();
const image = eventImage.value.trim();
const description = eventDescription.value.trim();
const category = eventCategory.value;
const max = maxAttendees.value;

if(!name || !date || !location || !description || !category || !max){
alert("Please fill all fields");
return;
}

const eventData = {

name,
date,
location,
image,
description,
category,
maxAttendees: Number(max),
organizerId: currentUser.uid,
status: "pending",
createdAt: new Date()

};

try{

await addDoc(collection(db,"events"), eventData);

alert("Event created successfully 🎉");

createEventForm.style.display = "none";

eventName.value="";
eventDate.value="";
eventLocation.value="";
eventImage.value="";
eventDescription.value="";
eventCategory.value="";
maxAttendees.value="";

loadMyEvents();

}catch(error){

alert(error.message);

}

});

}


/* =========================
   LOAD ORGANIZER EVENTS
========================= */

async function loadMyEvents(){

const container = document.getElementById("myEventsList");

if(!container) return;

container.innerHTML = "";

const q = query(
collection(db,"events"),
where("organizerId","==",currentUser.uid)
);

const snapshot = await getDocs(q);

snapshot.forEach((docSnap)=>{

const e = docSnap.data();

const card = document.createElement("div");

card.classList.add("event-card");

card.innerHTML = `

<div class="event-image">
<img src="${e.image || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678'}">
</div>

<div class="event-info">

<h3>${e.name}</h3>

<p class="event-desc">
${e.description || "A professional networking event for learning and collaboration."}
</p>

<div class="event-meta">

<span><b>Date:</b> ${e.date}</span>
<span><b>Location:</b> ${e.location}</span>
<span><b>Category:</b> ${e.category}</span>
<span><b>Seats:</b> ${e.maxAttendees}</span>
<span><b>Status:</b> ${e.status || "pending"}</span>

</div>

<div class="event-buttons">

<a href="view-attendees.html?id=${docSnap.id}" class="view-btn">
👥 View Attendees
</a>

<a href="../events/edit-event.html?id=${docSnap.id}" class="edit-btn">
✏ Edit
</a>

<button onclick="deleteEvent('${docSnap.id}')" class="delete-btn">
🗑 Delete
</button>

</div>

</div>

`;

container.appendChild(card);

});

}


/* =========================
   DELETE EVENT
========================= */

window.deleteEvent = async function(eventId){

const confirmDelete = confirm("Delete this event?");

if(!confirmDelete) return;

try{

await deleteDoc(doc(db,"events",eventId));

alert("Event deleted");

loadMyEvents();

}catch(error){

alert(error.message);

}

};