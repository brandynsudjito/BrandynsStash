import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyATpoiBitz7x5vs-M0W0R97chyQuzCLoNs",
    authDomain: "brandynsstash.firebaseapp.com",
    projectId: "brandynsstash",
    storageBucket: "brandynsstash.firebasestorage.app",
    messagingSenderId: "471553913739",
    appId: "1:471553913739:web:5a993b50243b8118e8f58e",
    measurementId: "G-KGBSN63169"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export {db};