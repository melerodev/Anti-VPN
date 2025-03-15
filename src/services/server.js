import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { insertData, isIPBanned } from "./db/dbUtils.js";
import { sendMessageToUser } from "../index.js";

const app = express();
const activeRoutes = new Set();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const views = join(__dirname, '/html');

function server(req) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip === '::1' ? '127.0.0.1' : ip;
}

app.use(express.static(join(views)));

class GetIP {
    constructor(num, userName) {
        this.num = num;
        this.userName = userName;

        activeRoutes.add(num);
        console.log("GetIP    | Se ha creado una nueva ruta: /" + num);

        // Programar la eliminación de la ruta después de 10 minutos
        setTimeout(async () => {
            if (activeRoutes.has(num)) {
                await sendMessageToUser(this.userName, `Tu ruta /${num} ha sido eliminada por inactividad.`);
                this.deleteRoute('/' + num);
                activeRoutes.delete(num);
                console.log(`GetIP    | La ruta /${num} ha sido eliminada por inactividad.`);
            }
        }, 10 * 60 * 1000); // 10 minutos en milisegundos

        app.get('/' + num, async (req, res) => {
            const userIP = server(req);
            console.log(`GetIP    | Nuevo usuario con IP: ${userIP} en la ruta /${num}`);

            try {
                // Verificar si la IP está bloqueada en la base de datos
                const bloqued = await isIPBanned(userIP);

                if (bloqued) {
                    console.log(`GetIP    | IP bloqueada intentó acceder: ${userIP}`);
                    return res.sendFile(join(views, '403.html')); // Enviar página de error 403
                } else {
                    // Insertar la IP en la base de datos
                    await insertData("users", { ip: userIP, userName: this.userName, date: new Date() });
                    res.sendFile(join(views, 'index.html')); // Enviar página de bienvenida
                    await sendMessageToUser(this.userName, `¡Bienvenido al servidor, ${this.userName}!`);

                    // Eliminar la ruta después de procesarla
                    activeRoutes.delete(num);
                    this.deleteRoute('/' + num);
                }
            } catch (error) {
                console.error(`GetIP    | Error al verificar el usuario:`, error);
                res.status(500).send('Error interno del servidor');
            }
        });
    }

    deleteRoute(ruta) {
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
