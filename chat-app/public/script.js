import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "chat-app-71f14.firebaseapp.com",
  projectId: "chat-app-71f14",
  storageBucket: "chat-app-71f14.firebasestorage.app",
  messagingSenderId: "479840190071",
  appId: "1:479840190071:web:0e3fcf6ea6bfd8cba99072"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentUser = "";

window.joinChat = function () {
  currentUser = document.getElementById("username").value;

  if (!currentUser) {
    alert("Enter username");
    return;
  }

  document.querySelector(".login").style.display = "none";
  document.querySelector(".chat-container").style.display = "block";
};

window.sendMessage = async function () {
  const message = document.getElementById("messageInput").value;

  if (!message) return;

  await addDoc(collection(db, "messages"), {
    user: currentUser,
    text: message,
    createdAt: serverTimestamp()
  });

  document.getElementById("messageInput").value = "";
};

const q = query(
  collection(db, "messages"),
  orderBy("createdAt")
);

onSnapshot(q, (snapshot) => {
  const messagesDiv = document.getElementById("messages");

  messagesDiv.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();

    messagesDiv.innerHTML += `
      <div class="message">
        <strong>${data.user}</strong><br>
        ${data.text}
      </div>
    `;
  });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
