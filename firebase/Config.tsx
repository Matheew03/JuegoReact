// Tu código actual está perfecto, solo asegúrate de exportar 'db'
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDuWZAbap7HjNEBFY59eyEcyWVApvIx6a4",
    authDomain: "taller1-a0bad.firebaseapp.com",
    databaseURL: "https://taller1-a0bad-default-rtdb.firebaseio.com",
    projectId: "taller1-a0bad",
    storageBucket: "taller1-a0bad.firebasestorage.app",
    messagingSenderId: "432745755728",
    appId: "1:432745755728:web:75a2ee29488cc14dc10d55"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
