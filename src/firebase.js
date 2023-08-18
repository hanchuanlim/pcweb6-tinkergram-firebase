// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLfyoPbvFLjci14cUA602OwZH9_HAor_4",
  authDomain: "pcweb6-3aa77.firebaseapp.com",
  projectId: "pcweb6-3aa77",
  storageBucket: "pcweb6-3aa77.appspot.com",
  messagingSenderId: "65997885711",
  appId: "1:65997885711:web:a95a91af71f45f0ffb2e7a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);