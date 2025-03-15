import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { DeployCommands } from "./deployCommands.js";

dotenv.config({ path: join(fileURLToPath(import.meta.url), "../.env") });

// Configuración del bot
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages]
});

// id del cliente
client.applicationId = process.env.CLIENT_ID;

const eventsPath = join(fileURLToPath(import.meta.url), "../events");
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = await import(`./events/${file}`);

    client.on(event.name, event.execute);
}

client.commands = new Collection();
const commandsPath = join(fileURLToPath(import.meta.url), "../commands");
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

DeployCommands.init();

client.login(process.env.DISCORD_TOKEN);
