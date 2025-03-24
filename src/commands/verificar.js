import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

export const data = {
    name: 'verificar',
    description: 'Envía permite verificar al usuario antes de entrar',
};

export async function execute(interaction) {
    if (interaction.user.bot) return;

    if (interaction.guild) {
        await interaction.reply({ content: process.env.ERROR_INVALID_CHANNEL, ephemeral: true });
        return;
    }

    try {
        const axiosData = await axios.get(process.env.GET_IP_SERVICE);

        const response = await fetch(`https://vpnapi.io/api/${axiosData.data.ip}?key=${process.env.VPNAPIIO_API_KEY}`);
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