import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, User} from "discord.js";
import AppDataSource from "../database";
import {Mot} from "../models/mot";
import {BonPoint} from "../models/bonPoint";

export const data = new SlashCommandBuilder().setName("carnet").setDescription("Regarder le carnet d'un utilisateur")
    .addUserOption(option =>
        option.setName("utilisateur")
            .setDescription("La personne dont vous voulez voir le carnet")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    const targettedUser: User = interaction.options.getUser("utilisateur") as User;
    const targettedUserId: string = targettedUser.id;

    const datasource = await AppDataSource;
    const motRepository = datasource.getRepository(Mot);
    const bonPointRepository = datasource.getRepository(BonPoint);
    const mots: Mot[] = await motRepository.find({where: {userId: targettedUserId}});
    const bonPoints: BonPoint[] = await bonPointRepository.find({where: {userId: targettedUserId}});

    if(mots.length === 0 && bonPoints.length === 0) {
        return interaction.reply(`<@${targettedUserId}> a un carnet vierge.`);
    } else {
        await interaction.reply(`Voici le carnet de <@${targettedUserId}>`);
    }

    if(mots.length !== 0) {
        let stringToDisplay: string = "";
        mots.forEach(mot => {
            stringToDisplay += "Le " + mot.date.toLocaleDateString() + " à " + mot.date.toLocaleTimeString() + ": " + mot.mot + "\n";
        });
        await interaction.followUp(`Voici les mots de ${targettedUser.username} :\n` + stringToDisplay);
    } else {
        await interaction.followUp("Aucun mot.");
    }

    if(bonPoints.length !== 0) {
        let stringToDisplay: string = "";
        bonPoints.forEach(bonPoint => {
            stringToDisplay += "Le " + bonPoint.date.toLocaleDateString() + " à " + bonPoint.date.toLocaleTimeString() + ": " + bonPoint.reason + "\n";
        });
        await interaction.followUp(`Voici les bon points de ${targettedUser.username} :\n` + stringToDisplay);
    } else {
        await interaction.followUp("Aucun bon point.");
    }
    return;
}