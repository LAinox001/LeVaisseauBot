import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import database from "../database/database";

export const data = new SlashCommandBuilder().setName("score").setDescription("Display your score");

export async function execute(interaction: CommandInteraction) {
    const row = database.prepare("SELECT * from scores WHERE id = ?").get(interaction.user.id);
    return interaction.reply(`Tu as répondu à ${row.score} mots`);
}