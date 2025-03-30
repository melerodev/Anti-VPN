import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from "url";

export class DeployCommands {
    static async init() {
        const commands = [];
        dotenv.config();
        const commandsPath = join(fileURLToPath(import.meta.url), "../commands");
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = await import(`./commands/${file}`);
            commands.push(command.data);
        }

        for (const command of commands) {
            console.log(command.name);
        }

        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }
}