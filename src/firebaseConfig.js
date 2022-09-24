import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";

export const firebaseConfig = {
    apiKey: "AIzaSyAb3PlvFTJ2OBWzPGttdqTGCFnvSmJ50gY",
    authDomain: "lideres-a5452.firebaseapp.com",
    projectId: "lideres-a5452",
    storageBucket: "lideres-a5452.appspot.com",
    messagingSenderId: "585809939038",
    appId: "1:585809939038:web:09fc1150ffff53744082cf",
    measurementId: "G-0ZG31RHQS9"
};


const app = initializeApp(firebaseConfig);

export const database = getDatabase();