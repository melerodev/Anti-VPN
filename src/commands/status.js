import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('status')
    .setDescription('Activa o desactiva el estado del bot')
    .addBooleanOption(option =>
        option.setName('status')
            .setDescription('El estado del bot (true para activar, false para desactivar)')
            .setRequired(true)
    )

export async function execute(interaction) {
    const { client } = interaction;

    if (interaction.user.bot) return;

    if (!interaction.guild) {
        await interaction.reply({ content: 'Este comando solo se puede ejecutar en un servidor.', ephemeral: true });
        return;
    }

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        await interaction.reply({ content: 'No tienes permisos para ejecutar este comando.', ephemeral: true });
        return;
    }

    const status = interaction.options.getBoolean('status');

    if (status) {
        await client.user.setPresence({
            activities: [{
                name: 'Protegiendo servidores de Discord',
                type: 'PLAYING'
            }],
            status: 'online'
        });
        await interaction.reply({ content: 'Estado activado', ephemeral: false });
    } else {
        await client.user.setPresence({
            activities: [],
            status: 'invisible'
        });
        await interaction.reply({ content: 'Estado desactivado', ephemeral: false });
    }
}