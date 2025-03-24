import { Events } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

// evento para cuando alguien se une al servidor
export const name = Events.GuildMemberAdd; // Nombre del evento

export async function execute(interaction) {
    if (interaction.user.bot) return;
    
    await interaction.user.send(process.env.JOIN_MESSAGE);

    setTimeout(() => {
        interaction.delete();
    }, 5000);
}