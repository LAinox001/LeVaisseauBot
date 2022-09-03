import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import {Routes} from "discord.js";
import config from "./consts/config";
const commands = [];
import * as commandModules from "./commands";

type Command = {
    data: SlashCommandBuilder| Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
}

for(const module of Object.values<Command>(commandModules)){
    commands.push(module.data);
}

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);