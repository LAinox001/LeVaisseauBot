import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

export const data = new SlashCommandBuilder().setName("currentword").setDescription("Display the word of the day");

export async function execute(interaction: CommandInteraction, currentWord: string) {
    return interaction.reply(`Le mot du jour est : ${currentWord}`);
}