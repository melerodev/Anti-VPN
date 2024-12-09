// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
// Importar el módulo fs para leer el archivo JSON
import { readFileSync } from "fs";

// Ruta del archivo JSON
const configPath = new URL("../../../../config.json", import.meta.url);
const config = JSON.parse(readFileSync(configPath));

class Database {
    constructor() {
        // Tu configuración de Firebase
        this.firebaseConfig = {
            apiKey: config.apiKey,
            authDomain: config.authDomain,
            projectId: config.projectId,
            storageBucket: config.storageBucket,
            messagingSenderId: config.messagingSenderId,
            appId: config.appId,
        };

        // Inicializar Firebase
        this.app = initializeApp(this.firebaseConfig);

        // Conexión a Firestore
        this.db = getFirestore(this.app);
    }

    // Función para verificar conexión
    async testConnection() {
        try {
            // Escribe un documento en Firestore
            await setDoc(doc(this.db, "testCollection", "testDoc"), {
                prueba: "Conexión exitosa",
            });
            console.log("¡Conexión a Firebase exitosa!");
        } catch (error) {
            console.error("Error al conectar con Firebase:", error);
        }
    }
}

export default Database;