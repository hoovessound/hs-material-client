importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBvUKoRvDtyPySBB8_VcPVkZmXj4H5o3Xw",
    authDomain: "hoovessound-173007.firebaseapp.com",
    databaseURL: "https://hoovessound-173007.firebaseio.com",
    projectId: "hoovessound-173007",
    storageBucket: "",
    messagingSenderId: "88605347442"
});

const messaging = firebase.messaging();