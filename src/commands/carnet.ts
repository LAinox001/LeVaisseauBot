import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, User} from "discord.js";
import AppDataSource from "../database";
import {Mot} from "../models/mot";

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
    const mots: Mot[] = await motRepository.find({where: {userId: targettedUserId}});
    let stringToDisplay: string = "";
    mots.forEach(mot => {
        stringToDisplay += "Le " + mot.date.toLocaleDateString() + " à " + mot.date.toLocaleTimeString() + ": " + mot.mot + "\n";
    });
    return interaction.reply(stringToDisplay);
}