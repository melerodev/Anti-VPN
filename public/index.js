import { Client, Events } from "discord.js";
import { readFileSync } from "fs";
import { EventHandler } from "./src/services/EventHandler.js";

// Ruta del archivo JSON
const configPath = new URL("../config.json", import.meta.url);
const config = JSON.parse(readFileSync(configPath));

// Crear un nuevo cliente de discord
const client = new Client({
    intents: 3276799 
});

client.on('raw', async (packet) => {
    console.log(packet)
    // EventHandler.do(packet);
});

client.login(config.token);