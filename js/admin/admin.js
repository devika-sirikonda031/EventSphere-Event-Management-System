import { db } from "../config/firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { protectPage } from "../auth/authGuard.js";

/* PROTECT PAGE */

protectPage("admin");


/* PROFILE CLICK (same as organizer/attendee) */

const profilePic = document.getElementById("profilePic");

if(profilePic){
profilePic.addEventListener("click", () => {

window.location.href = "../profile/profile.html";

});
}


/* DOM */

const usersContainer = document.getElementById("usersList");
const eventsContainer = document.getElementById("eventsList");

const totalUsersEl = document.getElementById("totalUsers");
const totalEventsEl = document.getElementById("totalEvents");


/* LOAD DATA */

loadUsers();
loadEvents();


/* =========================
   LOAD USERS
========================= */

async function loadUsers(){

const snapshot = await getDocs(collection(db,"users"));

if(!usersContainer) return;

usersContainer.innerHTML = "";

totalUsersEl.textContent = snapshot.size;


/* SHOW ONLY 5 USERS */

let count = 0;

snapshot.forEach(docSnap=>{

if(count >= 5) return;

const user = docSnap.data();

const div = document.createElement("div");

div.classList.add("admin-card");

div.innerHTML = `

<h3>${user.name || "User"}</h3>

<p><b>Email:</b> ${user.email}</p>

<p><b>Role:</b> ${user.role}</p>

`;

usersContainer.appendChild(div);

count++;

});

}


/* =========================
   LOAD EVENTS
========================= */

async function loadEvents(){

const snapshot = await getDocs(collection(db,"events"));

if(!eventsContainer) return;

eventsContainer.innerHTML = "";

totalEventsEl.textContent = snapshot.size;

snapshot.forEach(docSnap=>{

const event = docSnap.data();

const div = document.createElement("div");

div.classList.add("admin-card");

div.innerHTML = `

<h3>${event.name}</h3>

<p><b>Date:</b> ${event.date}</p>

<p><b>Category:</b> ${event.category || "Not set"}</p>

<p><b>Status:</b> ${event.status || "pending"}</p>

`;

eventsContainer.appendChild(div);

});

}