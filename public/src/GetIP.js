import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { insertarDato, obtenerPorIP } from "./db/dbUtils.js";

const app = express();
const rutasActivas = new Set();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const views = join(__dirname, '/html');

function obtenerIP(req) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip === '::1' ? '127.0.0.1' : ip;
}

app.use(express.static(join(views)));

class GetIP {
    constructor(numero, userName) {
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
                    return res.sendFile(join(views, '403.html')); // Enviar página de error 403
                } else {
                    console.log(`GetIP    | Añadido el usuario nuevo a la BD con IP: ${ipUsuario}`);
                    // Insertar la IP en la base de datos
                    await insertarDato("users", { ip: ipUsuario, userName: this.userName, date: new Date()});
                }

                console.log(`GetIP    | Nuevo usuario con IP: ${ipUsuario} en la ruta /${numero}`);
                res.sendFile(join(views, 'index.html')); // Enviar página de bienvenida
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

app.listen(3000, () => {
    console.log(`GetIP    | Servidor corriendo en http://localhost:3000`);
});

export default GetIP;
