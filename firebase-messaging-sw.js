// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDCCy9lVrewr3EraM_Sua7h8LXvJBr8Xhc",
  authDomain: "astha-project-8048f.firebaseapp.com",
  projectId: "astha-project-8048f",
  messagingSenderId: "801380674010",
  appId: "1:801380674010:web:7891588156219fb21078e3"
});

const messaging = firebase.messaging();
