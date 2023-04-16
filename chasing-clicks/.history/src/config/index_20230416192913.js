// Import the functions you need from the SDKs you need
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBC2f0iq6kjwrLTqcqKYwo24uN75zFJOuk",
  authDomain: "chasing-clicks.firebaseapp.com",
  projectId: "chasing-clicks",
  storageBucket: "chasing-clicks.appspot.com",
  messagingSenderId: "743110158727",
  appId: "1:743110158727:web:12f8112949918c98cdcb22"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

export default db;
