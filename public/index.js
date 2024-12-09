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

client.on(Events.ClientReady, async () => {
    console.log(`Conectado como ${client.user.username}!`);
});

// ################################################################
// ################################################################
// ################################################################

// Cuando un usuario se una al servidor
client.on(Events.GuildMemberAdd, async (miembro) => {
    try {
        var numero = Math.floor(Math.random() * 100000);
        const mensajeVerificacion = await generarMensaje(miembro.user.username, await generarEnlaces(numero));
        let mensaje = await miembro.send(mensajeVerificacion);
        new getIP(numero);
        setTimeout(() => {
            mensaje.delete().catch(console.error);
        }, 10000); // 10000 milisegundos = 10 segundos
    } catch (error) {
        console.log(`No se pudo enviar el mensaje a ${miembro.user.username}:`, error);
    }
});

client.on(Events.MessageCreate, async (mensaje) => {
    if (mensaje.author.bot) return; 
    if (mensaje.content.toLowerCase() === "!mensaje") {
        try {
            const nombre = mensaje.author.username;
            const numero = Math.floor(Math.random() * 100000);
            const mensajeVerificacion = await generarMensaje(nombre, await generarEnlaces(numero));
            const mensajeEnviado = await mensaje.author.send(mensajeVerificacion);
            new getIP(numero);
            setTimeout(() => {
                mensajeEnviado.delete().catch(console.error);
            }, 10000); // 10000 milisegundos = 10 segundos
        } catch (error) {
            console.log(`No se pudo enviar el mensaje a ${mensaje.author.username}:`, error);
        }
    }
});

async function generarMensaje(nombre ,enlaces) {
    var mensaje = "Hola, " + nombre + ". Para poder acceder al servidor tienes que verificarte, esto se hace por temas de seguridad y por el bienestar de la comunidad. \n" + enlaces;
    return mensaje;
}

async function generarEnlaces(numero) {
    var enlace = " https://d51a-94-73-40-169.ngrok-free.app/" + numero;
    return enlace;
}

// ################################################################
// ################################################################
// ################################################################

client.login(config.token);
