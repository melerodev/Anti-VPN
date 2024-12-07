import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import Database from './Database.js';

// Asumiendo que 'Database.js' tiene la inicialización de Firebase y Firestore
const database = new Database();

// Inicializar Firestore
const db = getFirestore(database.app); // Suponiendo que 'app' es la instancia de Firebase que está en 'Database.js'

console.log(database.testConnection()); // Si tienes una función para probar la conexión

// Función para insertar un dato en Firestore
async function insertarDato(coleccion, datos) {
    try {
        // Inserta los datos en la colección especificada
        const docRef = await addDoc(collection(db, coleccion), datos);
        console.log("Documento insertado con ID:", docRef.id);
    } catch (error) {
        console.error("Error al insertar el dato:", error);
    }
}

async function obtenerPorIP(ip) {
    let existe = false;
    try {
        // Crea una consulta que filtre los documentos donde 'ip' sea igual al valor dado
        const q = query(collection(db, "users"), where("ip", "==", ip));
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No se encontraron usuarios con la IP:", ip);
        } else {
            existe = true;
        }
    } catch (error) {
        console.error("Error al realizar la consulta:", error);
    }
    return existe;
}

if (obtenerPorIP("192.168.1.1")) {
    console.log("No existe un usuario con la IP");
}