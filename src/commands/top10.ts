import {SlashCommandBuilder} from "@discordjs/builders";
import {Collection, CommandInteraction, Guild, GuildMember} from "discord.js";
import {client} from "../consts/client";
import config from "../consts/config";
import {AppDataSource} from "../database";
import {Score} from "../models/score";

export const data = new SlashCommandBuilder().setName("top10").setDescription("Display the top 10 of users");

export async function execute(interaction: CommandInteraction) {
    const datasource = await AppDataSource.getInstance();
    const scoreRepository = datasource.getRepository(Score);
    const server: Guild|undefined = client.guilds.cache.get(config.GUILD_ID);
    let members: Collection<string, GuildMember>|undefined = undefined;
    members = await server?.members.fetch();
    const rows = await scoreRepository.find({order: {score: "DESC"}, take: 10});
    let topString = "";
    rows.forEach((row, index) => {
        const user: GuildMember | undefined = members?.get(row.userId);
        if(user) {
            topString += `${index+1}. ${user?.user.username} : ${row.score} mots \n`;
        }
    });
    return interaction.reply(`Voici le top 10 : \n ${topString.trim()}`);
}