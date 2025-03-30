import express from 'express';
import axios from 'axios';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true
}));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/', (req, res) => {
    res.redirect('/login');
    // res.sendFile('/var/www/html/anti-vpn/layouts-landing-page/V1/index.html');
});

app.get('/login', (req, res) => {
    const authURL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
    res.redirect(authURL);
});

app.get('/callback', async (req, res) => {
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Dirección IP del usuario:', userIP);

    const { code } = req.query;
    if (!code) return res.send('Error al autenticar');

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            scope: 'identify'
        }).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
        });

        console.log('Usuario autenticado:', userResponse.data);
        res.json({ user: userResponse.data, ip: userIP });

    } catch (error) {
        console.error('Error en autenticación:', error);
        res.send('Error en autenticación');
    }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
