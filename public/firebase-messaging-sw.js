importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }
firebase.initializeApp({
  apiKey: "AIzaSyCquuuJ8hMmX-i8GU2Lt5SiOVnC-DS9YCU",
  authDomain: "push-notofication-d446d.firebaseapp.com",
  projectId: "push-notofication-d446d",
  storageBucket: "push-notofication-d446d.appspot.com",
  messagingSenderId: "752212429549",
  appId: "1:752212429549:web:a95f39983dbe5da7c35ae4",
  measurementId: "G-YX7VBVMEZ6"})

const initMessaging = firebase.messaging()