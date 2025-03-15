import { Events } from "discord.js";

// evento para cuando alguien se une al servidor
export const name = Events.GuildMemberAdd; // Nombre del evento

export async function execute(interaction) {
    if (interaction.user.bot) return;
    
    await interaction.user.send("¡Hola! Bienvenido a nuestro servidor. 😊");

    setTimeout(() => {
        interaction.delete();
    }, 5000);
}