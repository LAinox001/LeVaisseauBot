import {SlashCommandBuilder} from "@discordjs/builders";
import {Collection, CommandInteraction, Guild, GuildMember} from "discord.js";
import database from "../consts/database";

export const data = new SlashCommandBuilder().setName("score").setDescription("Display your score");

export async function execute(interaction: CommandInteraction) {
    const row = database.prepare("SELECT * from scores WHERE id = ?").get(interaction.user.id);
    return  interaction.reply(`Tu as répondu à ${row.score} mots`);
}