import {SlashCommandBuilder} from "@discordjs/builders";
import {Collection, CommandInteraction, Guild, GuildMember} from "discord.js";
import {client} from "../consts/client";
import config from "../consts/config";
import database from "../database/database";

export const data = new SlashCommandBuilder().setName("top10").setDescription("Display the top 10 of users");

export async function execute(interaction: CommandInteraction) {
    const server: Guild|undefined = client.guilds.cache.get(config.GUILD_ID);
    let members: Collection<string, GuildMember>|undefined = undefined;
    members = await server?.members.fetch();
    const rows = database.prepare("SELECT * from scores ORDER BY score DESC LIMIT 10").all();
    let topString = "";
    rows.forEach((row, index) => {
        const user: GuildMember | undefined = members?.get(row.id);
        if(user) {
            topString += `${index+1}. ${user?.user.username} : ${row.score} mots \n`;
        }
    });
    return interaction.reply(`Voici le top 10 : \n ${topString.trim()}`);
}