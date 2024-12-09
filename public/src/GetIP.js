import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { insertarDato, obtenerPorIP } from "./db/dbUtils.js"; // Tu lógica de base de datos

const app = express();
const rutasActivas = new Set();

// Configuración del puerto
const PUERTO = 3000;

// Obtener la IP del cliente
function obtenerIP(req) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip === '::1' ? '127.0.0.1' : ip;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '/')));

class GetIP {
    constructor(numero) {
        this.numero = numero;
        rutasActivas.add(numero);
        console.log("GetIP    | Se ha creado una nueva ruta: /" + numero);

        app.get('/' + numero, async (req, res) => {
            const ipUsuario = obtenerIP(req);

            try {
                // Verificar si la IP está bloqueada en la base de datos
                const bloqueada = await obtenerPorIP(ipUsuario);

                if (bloqueada) {
                    console.log(`GetIP    | IP bloqueada intentó acceder: ${ipUsuario}`);
                    return res.sendFile(path.join(__dirname, '403.html')); // Enviar página de error 403
                } else {
                    console.log(`GetIP    | Añadido el usuario nuevo a la BD con IP: ${ipUsuario}`);
                    // Insertar la IP en la base de datos
                }

                console.log(`GetIP    | Nuevo usuario con IP: ${ipUsuario} en la ruta /${numero}`);
                res.sendFile(path.join(__dirname, 'index.html')); // Enviar página de bienvenida
            } catch (error) {
                console.error(`GetIP    | Error al verificar el usuario:`, error);
                res.status(500).send('Error interno del servidor');
            }
        });

        // Middleware para manejar rutas no existentes
        app.use((req, res, next) => {
            console.error(`GetIP    | Error: La ruta ${req.originalUrl} no existe.`);
            res.status(404).send('Ruta no encontrada');
        });
    }
}

app.listen(PUERTO, () => {
    console.log(`GetIP    | Servidor corriendo en http://localhost:${PUERTO}`);
});

export default GetIP;
