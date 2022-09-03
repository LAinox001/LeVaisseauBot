import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import AppDataSource from "../database";
import {Score} from "../models/score";

export const data = new SlashCommandBuilder().setName("myscore").setDescription("Display your score");

export async function execute(interaction: CommandInteraction) {
    const datasource = await AppDataSource;
    const scoreRepository = datasource.getRepository(Score);
    const row = await scoreRepository.findOneBy({userId: interaction.user.id});
    return interaction.reply(`Tu as répondu à ${row?.score} mots`);
}