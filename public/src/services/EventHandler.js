import { Message } from "discord.js"
export const EventHandler = {
    actionsList: {
        "READY": do_ready,
        "MESSAGE_CREATE": do_sendMessage,
        "GUILD_MEMBER_ADD": do_memberAdd,
    },

    do(eventData) {
        const actionFunction = this.actionsList[eventData.t];

        if (actionFunction) {
            actionFunction(eventData);
        }
    }
};

function do_ready() {
    console.log("Conectado al servidor!");
}

async function do_sendMessage(data) {
    if (data.d.author.bot) return;
    if (data.d.content.toLowerCase() === "!message") {
        try {
            await data.d.author.send(messageVerification); // HERE IS THE PROBLEM
        } catch (error) {
            console.log(`Error sendign the message to ${data.d.author.username}:`, error);
        }
    }
}

function do_memberAdd() {
    console.log("El juego ha terminado");
}