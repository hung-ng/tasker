import firebase from "firebase/app"
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyAVQOMS36mJq_5K4Bc7Wc4OV7_fDYdv3DY",
    authDomain: "homework-management-80418.firebaseapp.com",
    projectId: "homework-management-80418",
    storageBucket: "homework-management-80418.appspot.com",
    messagingSenderId: "640106706442",
    appId: "1:640106706442:web:bff1a227d5b6659a7891f3"
};

export const app = firebase.initializeApp(firebaseConfig);

export const db = app.firestore();

export const auth = app.auth()