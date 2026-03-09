import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { app } from "./firebase.js";

const db = getFirestore(app);
const auth = getAuth(app);

// 🔹 Get event ID
const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

// 🔹 Elements
const registerBtn = document.getElementById("registerBtn");
const cancelBtn = document.getElementById("cancelBtn");
const totalRegistered = document.getElementById("totalRegistered");
const status = document.getElementById("registerStatus");

// 🔹 Load Event
const eventRef = doc(db, "events", eventId);
const eventSnap = await getDoc(eventRef);

if (!eventSnap.exists()) {
  alert("Event not found");
}

const event = eventSnap.data();

// Fill UI
document.getElementById("eventName").innerText = event.name;
document.getElementById("eventDate").innerText = event.date;
document.getElementById("eventTime").innerText = event.time || "-";
document.getElementById("eventLocation").innerText = event.location || "-";
document.getElementById("eventDescription").innerText = event.description;

// 🔢 Load registered count
const regSnap = await getDocs(
  collection(db, "events", eventId, "registrations")
);
const registeredCount = regSnap.size;
totalRegistered.innerText = registeredCount;

// 🚫 CHECK LIMIT
if (event.maxAttendees && registeredCount >= event.maxAttendees) {
  registerBtn.disabled = true;
  registerBtn.innerText = "Registration Closed 🚫";
  status.innerText = "Event is full";
}


// 🔐 Auth check
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const regRef = doc(db, "events", eventId, "registrations", user.uid);
  const regDoc = await getDoc(regRef);

  if (regDoc.exists()) {
    registerBtn.style.display = "none";
    cancelBtn.style.display = "inline-block";
    status.innerText = "You are already registered";
  }
});

// ✅ REGISTER
registerBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("Please login first");

  // 🚫 BLOCK REGISTRATION IF EVENT IS FULL
const regSnap = await getDocs(
  collection(db, "events", eventId, "registrations")
);

if (event.maxAttendees && regSnap.size >= event.maxAttendees) {
  alert("Registration is full 🚫");
  registerBtn.disabled = true;
  registerBtn.innerText = "Registration Closed";
  return;
}


  const regRef = doc(db, "events", eventId, "registrations", user.uid);
  const regDoc = await getDoc(regRef);

  if (regDoc.exists()) {
    alert("Already registered");
    return;
  }

  await setDoc(regRef, {
    registeredAt: new Date()
  });

  registerBtn.style.display = "none";
  cancelBtn.style.display = "inline-block";
  totalRegistered.innerText =
    parseInt(totalRegistered.innerText) + 1;

  status.innerText = "Registered successfully 🎉";
});

// ❌ CANCEL REGISTRATION
cancelBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const regRef = doc(db, "events", eventId, "registrations", user.uid);
  await deleteDoc(regRef);

  cancelBtn.style.display = "none";
  registerBtn.style.display = "inline-block";

  let newCount = parseInt(totalRegistered.innerText) - 1;
  totalRegistered.innerText = newCount;

  // 🔓 Re-open registration if space available
  if (event.maxAttendees && newCount < event.maxAttendees) {
    registerBtn.disabled = false;
    registerBtn.innerText = "Register";
    status.innerText = "Registration open again ✅";
  } else {
    status.innerText = "Registration cancelled ❌";
  }
});

