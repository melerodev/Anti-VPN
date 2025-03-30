export const data = {
    name: 'mensaje',
    description: 'Envía un mensaje por privado a usuario',
};

export async function execute(interaction) {
    if (interaction.user.bot) return;

    if (!interaction.guild) {
        await interaction.reply({ content: 'Este comando solo se puede ejecutar en un servidor.', ephemeral: true });
        return;
    }


    if (interaction.user.bot) return;

    try {
        let mensaje = await interaction.user.send("¡Hola! ¿En qué puedo ayudarte? 😊");

        setTimeout(() => {
            mensaje.delete();
        }, 5000);
    } catch (error) {
        console.error('No se pudo enviar el mensaje privado:', error);
    }
}