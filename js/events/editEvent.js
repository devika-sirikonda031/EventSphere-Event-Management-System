import { db } from "../config/firebase.js";

import {
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* GET EVENT ID FROM URL */

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

/* INPUT FIELDS */

const eventDate = document.getElementById("eventDate");
const eventLocation = document.getElementById("eventLocation");
const eventImage = document.getElementById("eventImage");
const eventDescription = document.getElementById("eventDescription");

const saveBtn = document.getElementById("saveEventBtn");


/* LOAD EVENT DATA */

async function loadEvent(){

try{

const eventRef = doc(db,"events",eventId);
const eventSnap = await getDoc(eventRef);

if(eventSnap.exists()){

const data = eventSnap.data();

eventDate.value = data.date || "";
eventLocation.value = data.location || "";
eventImage.value = data.image || "";
eventDescription.value = data.description || "";

}

}catch(error){
alert(error.message);
}

}

loadEvent();


/* SAVE CHANGES */

saveBtn.addEventListener("click", async () => {

try{

const eventRef = doc(db,"events",eventId);

await updateDoc(eventRef,{

date: eventDate.value,
location: eventLocation.value,
image: eventImage.value,
description: eventDescription.value

});

alert("Event updated successfully 🎉");

/* redirect back */

window.location.href = "../organizer/organizer.html";

}catch(error){

alert(error.message);

}

});