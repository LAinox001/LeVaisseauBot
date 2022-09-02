import {Client, GatewayIntentBits, Collection, Message, MessagePayload} from "discord.js";
import config from "./config";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log("Hello Discord Bot");
});

client.login(config.DISCORD_TOKEN);