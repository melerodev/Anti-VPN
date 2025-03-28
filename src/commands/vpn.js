import dotenv from "dotenv";

export const data = {
    name: 'isusingvpn',
    description: 'Envía un mensaje por privado si diciendo si estás usando una VPN o no',
};

dotenv.config();

export async function execute(interaction) {
    if (interaction.user.bot) return;

    if (interaction.guild) {
        await interaction.reply({ content: process.env.ERROR_INVALID_CHANNEL, ephemeral: true });
        return;
    }

    try {
        const response = await fetch(`https://vpnapi.io/api/130.195.219.226?key=${process.env.VPNAPIIO_API_KEY}`);
        const data = await response.json();
        let message;

        if (data.security.vpn) {
            message = `La IP ${data.ip} está usando una VPN`;
        } else {
            message = `La IP ${data.ip} no está usando una VPN`;
        }

        await interaction.reply({ content: message, ephemeral: true });
    } catch (error) {
        console.error('No se pudo enviar el mensaje privado:', error);
    }
}
