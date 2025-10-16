importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: 'AIzaSyDzW0nj7Tx98DwVaOvXZxx10x_J_NPA2ZI',
  authDomain: 'multiflex-angular.firebaseapp.com',
  projectId: 'multiflex-angular',
  storageBucket: 'multiflex-angular.firebasestorage.app',
  messagingSenderId: '797068412053',
  appId: '1:797068412053:web:0632841786abad755f479c',
  measurementId: 'G-Z2SPZZS5MR',
});
const messaging = firebase.messaging();
