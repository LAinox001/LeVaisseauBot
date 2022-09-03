import {client} from "./consts/client";
import config from "./consts/config";
import {Interaction} from "discord.js";

import * as commandModules from "./commands";
const commands = Object(commandModules);

let currentWord: string = "";

client.once("ready", () => {
    console.log("here");
    console.log("Hello Discord Bot");
});

client.on("interactionCreate", (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    commands[commandName].execute(interaction, currentWord);
});

client.login(config.DISCORD_TOKEN);