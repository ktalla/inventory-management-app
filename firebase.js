// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAW4_K7476ydnMVkcqMLS5Nc55nNBhoSOw",
  authDomain: "inventory-management-app-6119c.firebaseapp.com",
  projectId: "inventory-management-app-6119c",
  storageBucket: "inventory-management-app-6119c.appspot.com",
  messagingSenderId: "616131535780",
  appId: "1:616131535780:web:5c1838fb776d3b13f61731",
  measurementId: "G-MWWDNL9E0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export{firestore}