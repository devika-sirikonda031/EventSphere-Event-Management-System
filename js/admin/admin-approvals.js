import { db } from "../config/firebase.js";

import {
collection,
query,
where,
getDocs,
doc,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { protectPage } from "../auth/authGuard.js";

protectPage("admin");

const container = document.getElementById("approvalList");


async function loadPendingEvents(){

container.innerHTML = "";

const q = query(
collection(db,"events"),
where("status","==","pending")
);

const snapshot = await getDocs(q);

if(snapshot.empty){
container.innerHTML = "<p>No pending approvals</p>";
return;
}

snapshot.forEach(docSnap=>{

const e = docSnap.data();

const card = document.createElement("div");

card.classList.add("admin-card");

card.innerHTML = `

<h3>${e.name}</h3>

<p><b>Date:</b> ${e.date}</p>

<p><b>Location:</b> ${e.location}</p>

<p><b>Category:</b> ${e.category || "Not set"}</p>

<div class="approval-buttons">

<button class="approve-btn" onclick="approveEvent('${docSnap.id}')">
Approve
</button>

<button class="reject-btn" onclick="rejectEvent('${docSnap.id}')">
Reject
</button>

</div>

`;

container.appendChild(card);

});

}

loadPendingEvents();


/* APPROVE */

window.approveEvent = async function(id){

await updateDoc(doc(db,"events",id),{

status:"approved"

});

alert("Event Approved");

loadPendingEvents();

};


/* REJECT */

window.rejectEvent = async function(id){

const confirmDelete = confirm("Reject this event?");

if(!confirmDelete) return;

await deleteDoc(doc(db,"events",id));

alert("Event Rejected");

loadPendingEvents();

};