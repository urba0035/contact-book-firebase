import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBH-6iV7Ga5Y2qLX0StJPS23G4TTibMEsA",
  authDomain: "contact-book-urba0035.firebaseapp.com",
  projectId: "contact-book-urba0035",
  storageBucket: "contact-book-urba0035.firebasestorage.app",
  messagingSenderId: "19854513972",
  appId: "1:19854513972:web:afedc798fa57ef1c15f761"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };