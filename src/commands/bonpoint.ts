import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, User} from "discord.js";
import {AppDataSource} from "../database";
import {BonPoint} from "../models/bonPoint";
import {Image} from "../models/image";
import {IsNull} from "typeorm";

const reactionsNumberNeeded = 4;
const waitingMs = 300000;

export const data = new SlashCommandBuilder().setName("bonpoint").setDescription("Créer un bon point pour un utilisateur")
    .addUserOption(option =>
        option.setName("utilisateur")
            .setDescription("La personne qui va prendre un mot dans son carnet")
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("raison")
            .setDescription("La raison du bon point")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    const targettedUser: User = interaction.options.getUser("utilisateur") as User;
    const targettedUserId: string = targettedUser.id;
    const reasonValue: string = interaction.options.get("raison")?.value as string;
    const datasource = await AppDataSource.getInstance();
    const bonPointRepository = datasource.getRepository(BonPoint);
    const imageRepository = datasource.getRepository(Image);

    await interaction.reply(`Un nouveau bon point a été proposé pour <@${targettedUserId}> pour le motif suivant :\n${reasonValue}`);
    const messagePoll = await interaction.followUp(`Réagissez à ce message pour approuver le bon point.\nSi le bon point atteint ${reactionsNumberNeeded} réactions en ${waitingMs/60000} minutes, il sera approuvé`);
    messagePoll.react("👍");

    // Après 5 minutes : 300000ms
    setTimeout(async function () {
        const reactionsNumber: number = (await messagePoll.reactions.resolve("👍")?.users.fetch())?.size as number;
        if(reactionsNumber >= reactionsNumberNeeded) {
            const bonPoint = new BonPoint();
            bonPoint.reason = reasonValue;
            bonPoint.userId = targettedUserId;
            const freeImages = await imageRepository.find({where: {userId: IsNull()}});
            if(freeImages.length === 0) {
                return interaction.followUp("Plus aucune image n'est disponible. Ajoutez une image et recréez le bon point.");
            }
            const randomNumber: number = Math.floor(Math.random() * ((freeImages.length - 1) + 1));
            const selectedImage = freeImages[randomNumber];
            await bonPointRepository.save(bonPoint);

            selectedImage.userId = targettedUserId;
            await imageRepository.save(selectedImage);

            return interaction.followUp(`Un bon point a été ajouté au carnet de <@${targettedUserId}>`);
        } else {
            return interaction.followUp(`Le bon point n'a pas été approuvé par le conseil de discipline.`);
        }
    }, waitingMs);
}