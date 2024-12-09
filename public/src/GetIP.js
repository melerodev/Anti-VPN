import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express(); // Un único servidor
const rutasActivas = new Set(); // Mover la declaración de rutasActivas fuera de la clase

// Obtener la IP del cliente
function obtenerIP(req) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip === '::1' ? '127.0.0.1' : ip;
}

// Configuración del puerto
const PUERTO = 3000; // Puerto estático

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

app.use(express.static(path.join(__dirname, '/')));

// Clase para manejar números y rutas
class GetIP {
    constructor(numero) {
        this.numero = numero;
        rutasActivas.add(numero); // Agregar ruta al set de rutas activas

        app.get('/' + numero, (req, res) => {
            const ipUsuario = obtenerIP(req);
            console.log(`Nuevo usuario con IP: ${ipUsuario} en la ruta /${numero}`);

            

            // Enviar archivo HTML
            res.sendFile(path.join(__dirname, 'index.html'));
        });

        // Remover la ruta después de un tiempo (por ejemplo, 10 minutos)
        setTimeout(() => {
            rutasActivas.delete(numero);
            console.log(`Ruta /${numero} eliminada.`);
        }, 10 * 60 * 1000); // 10 minutos
    }
}

new GetIP(234);

// Middleware para manejar rutas no existentes
app.use((req, res, next) => {
    console.error(`Error: La ruta ${req.originalUrl} no existe.`);
    res.status(404).send('Ruta no encontrada');
});

// Iniciar servidor
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});

export default GetIP;
