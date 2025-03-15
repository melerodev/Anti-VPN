import { Events } from "discord.js";

export const name = Events.InteractionCreate;


export async function execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName); // Buscar el comando

    if (!command) return; // Si no se encuentra el comando, no hacemos nada

    try {
        await command.execute(interaction); // Ejecutamos el comando
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
    }
}
