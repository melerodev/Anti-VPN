import { Events } from "discord.js";

export const name = Events.ClientReady; // Nombre del evento

export async function execute(message) {
    console.log("Bot listo");
}
