export const data = {
    name: 'ping',
    description: 'Responde con Pong'
};

export async function execute(interaction) {

    if (interaction.user.bot) return;

    if (!interaction.guild) {
        await interaction.reply({ content: 'Este comando solo se puede ejecutar en un servidor.', ephemeral: true });
        return;
    }

    await interaction.reply({content: 'Pong!', ephemeral: true});
}