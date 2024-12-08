import express from 'express';
import path from 'path';

const app = express();

class GetIP {
    constructor(numero) {
        app.get('/' + numero, (req, res) => {
            // Obtener la IP del cliente
            let ip_usuario = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            // Si es una IP interna en localhost, se puede mostrar como 127.0.0.1
            if (ip_usuario === '::1') {
                ip_usuario = '127.0.0.1';
            }
            console.log(`New user with IP: ${ip_usuario}`);

            res.sendFile(path.join(__dirname, '../../../index.html'));
        });

        app.listen(3000, () => {
            console.log('Servidor corriendo en http://localhost:3000/' + numero);
        });
    }
}

export default GetIP;