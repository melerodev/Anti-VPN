import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import Database from './database.js';
import { get } from "http";

// Asumiendo que 'database.js' tiene la inicialización de Firebase y Firestore
const database = new Database();

// Inicializar Firestore
const db = getFirestore(database.app); // Suponiendo que 'app' es la instancia de Firebase que está en 'database.js'

console.log(database.testConnection()); // Si tienes una función para probar la conexión

// Función para insertar un dato en Firestore
export async function insertData(coleccion, datos) {
    try {
        // Inserta los datos en la colección especificada
        const docRef = await addDoc(collection(db, coleccion), datos);
        console.log("Database | Añadiendo nuevo usuario a la BD con la IP:", datos.ip);
        console.log("Database | Documento insertado con ID:", docRef.id);
    } catch (error) {
        console.error("Database | Error al insertar el dato:", error);
    }
}

export async function isIPBanned(ip) {
    let existe = false;
    try {
        // Crea una consulta que filtre los documentos donde 'ip' sea igual al valor dado
        const q = query(collection(db, "bans"), where("ip", "==", ip));
        
        const querySnapshot = await getDocs(q); // Obtiene los documentos que cumplen con la consulta

        if (querySnapshot.empty) {
            console.log("Database | No se han encontraron usuarios baneados en la BD con la IP:", ip);
        } else {
            existe = true;
        }
    } catch (error) {
        console.error("Database | Error al realizar la consulta:", error);
    }
    return existe;
}

export async function getIP(ip) {
    let querySnapshot = null;
    try {
        const q = query(collection(db, "users"), where("ip", "==", ip));
        querySnapshot = await getDocs(q); // Obtiene los documentos que cumplen con la consulta
    } catch (error) {
        console.error("Database | Error al realizar la consulta:", error);
    }

    return querySnapshot;
}