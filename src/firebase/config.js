import firebase from "firebase/app"
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyBtpd8S6rveVCTJHyFRnHQUbbBGXMAMMX0",
    authDomain: "tasker-51b4f.firebaseapp.com",
    projectId: "tasker-51b4f",
    storageBucket: "tasker-51b4f.appspot.com",
    messagingSenderId: "167872023814",
    appId: "1:167872023814:web:d86a9966aa4be586c0e287"
};

export const app = firebase.initializeApp(firebaseConfig);

export const db = app.firestore();

export const auth = app.auth()