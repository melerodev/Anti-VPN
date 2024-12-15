import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { insertarDato, obtenerPorIP } from "./db/dbUtils.js";
import { enviarMensajeUsuario } from "../index.js";

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
        this.userName = userName;

        rutasActivas.add(numero);
        console.log("GetIP    | Se ha creado una nueva ruta: /" + numero);

        // Programar la eliminación de la ruta después de 10 minutos
        setTimeout(async () => {
            if (rutasActivas.has(numero)) {
                await enviarMensajeUsuario(this.userName, `Tu ruta /${numero} ha sido eliminada por inactividad.`);
                this.eliminarRuta('/' + numero);
                rutasActivas.delete(numero);
                console.log(`GetIP    | La ruta /${numero} ha sido eliminada por inactividad.`);
            }
        }, 10 * 60 * 1000); // 10 minutos en milisegundos

        app.get('/' + numero, async (req, res) => {
            const ipUsuario = obtenerIP(req);
            console.log(`GetIP    | Nuevo usuario con IP: ${ipUsuario} en la ruta /${numero}`);

            try {
                // Verificar si la IP está bloqueada en la base de datos
                const bloqueada = await obtenerPorIP(ipUsuario);

                if (bloqueada) {
                    console.log(`GetIP    | IP bloqueada intentó acceder: ${ipUsuario}`);
                    return res.sendFile(join(views, '403.html')); // Enviar página de error 403
                } else {
                    // Insertar la IP en la base de datos
                    await insertarDato("users", { ip: ipUsuario, userName: this.userName, date: new Date() });
                    res.sendFile(join(views, 'index.html')); // Enviar página de bienvenida
                    await enviarMensajeUsuario(this.userName, `¡Bienvenido al servidor, ${this.userName}!`);

                    // Eliminar la ruta después de procesarla
                    rutasActivas.delete(numero);
                    this.eliminarRuta('/' + numero);
                }
            } catch (error) {
                console.error(`GetIP    | Error al verificar el usuario:`, error);
                res.status(500).send('Error interno del servidor');
            }
        });
    }

    eliminarRuta(ruta) {
        const stack = app._router.stack;

        // Buscar la ruta y eliminarla del stack
        for (let i = 0; i < stack.length; i++) {
            if (stack[i].route && stack[i].route.path === ruta) {
                console.log(`GetIP    | Ruta eliminada: ${ruta}`);
                stack.splice(i, 1); // Eliminar la ruta del stack
                break;
            }
        }
    }
}

app.listen(3000, () => {
    console.log(`GetIP    | Servidor corriendo en http://localhost:3000`);
});

export default GetIP;
