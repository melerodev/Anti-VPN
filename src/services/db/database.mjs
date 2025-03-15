import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { fileURLToPath } from "url";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config({ path: join(fileURLToPath(import.meta.url), "../../../.env") });

console.log(    process.env.API_KEY,    );

class Database {
    constructor() {
        this.firebaseConfig = {
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            messagingSenderId: process.env.MESSAGING_SENDER_ID,
            appId: process.env.APP_ID
        };

        this.app = initializeApp(this.firebaseConfig);

        this.db = getFirestore(this.app);
    }

    async testConnection() {
        try {
            await setDoc(doc(this.db, "testCollection", "testDoc"), {
                prueba: "Database | Conexión exitosa",
            });
            console.log("Database | ¡Conexión a Firebase exitosa!");
        } catch (error) {
            console.error("Database | Error al conectar con Firebase:", error);
        }
    }
}

export default Database;