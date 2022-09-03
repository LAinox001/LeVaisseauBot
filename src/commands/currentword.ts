import {SlashCommandBuilder} from "@discordjs/builders";
import {Collection, CommandInteraction, Guild, GuildMember} from "discord.js";
import database from "../consts/database";

export async function execute(interaction: CommandInteraction, currentWord: string) {
    return interaction.reply(`Le mot du jour est : ${currentWord}`);
}