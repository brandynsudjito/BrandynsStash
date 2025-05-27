import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyATpoiBitz7x5vs-M0W0R97chyQuzCLoNs",
    authDomain: "brandynsstash.firebaseapp.com",
    projectId: "brandynsstash",
    storageBucket: "brandynsstash.firebasestorage.app",
    messagingSenderId: "471553913739",
    appId: "1:471553913739:web:17756e2a98ab6e93e8f58e",
    measurementId: "G-J6Q703HVWE"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export {db};