import {SelectMenuOptionBuilder, SlashCommandBuilder} from "@discordjs/builders";
import {
    ActionRowBuilder,
    APISelectMenuOption,
    CommandInteraction, Message,
    RestOrArray, SelectMenuBuilder,
    SelectMenuComponentOptionData,
    User
} from "discord.js";
import {AppDataSource} from "../database";
import {Image} from "../models/image";
import {client} from "../consts/client";
import {Repository} from "typeorm";

let imageRepository: Repository<Image>;
let targettedUserId: string;
let userId: string;

export const data = new SlashCommandBuilder().setName("trade").setDescription("Échangez une image avec quelqu'un")
    .addUserOption(option =>
        option.setName("utilisateur")
            .setDescription("La personne qui va prendre un mot dans son carnet")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    const targettedUser: User = interaction.options.getUser("utilisateur") as User;
    targettedUserId = targettedUser.id;
    userId = interaction.user.id;

    const datasource = await AppDataSource.getInstance();
    imageRepository = datasource.getRepository(Image);

    const images = await imageRepository.findBy({userId: userId});
    if(images.length === 0) {
        return interaction.reply("Vous n'avez pas d'image.");
    }
    const options: RestOrArray<APISelectMenuOption | SelectMenuOptionBuilder | SelectMenuComponentOptionData> = [];
    images.forEach(image => {
        options.push({
            label: image.name,
            value: image.name
        });
    });

    const row = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId("select-user-image-trade")
                .setPlaceholder("Rien n'est sélectionné.")
                .setOptions(options),
        );

    return interaction.reply({content: "Veuillez choisir une de vos images à échanger.", components: [row]});
}

let selectedUserImage: string;
let selectedUserImageEntity: Image;
let messageToReact: Message;
client.on("interactionCreate", async (interaction) => {
    if (interaction.isSelectMenu()) {
        if (interaction.customId === "select-user-image-trade"){
            selectedUserImage = interaction.values[0];
            selectedUserImageEntity = (await imageRepository.findOneBy({name: selectedUserImage})) as Image;

            const images = await imageRepository.findBy({userId: targettedUserId});
            if(images.length === 0) {
                interaction.reply({content: "La personne avec qui vous souhaitez échanger n'a pas d'image."});
                return;
            }
            const options: RestOrArray<APISelectMenuOption | SelectMenuOptionBuilder | SelectMenuComponentOptionData> = [];
            images.forEach(image => {
                options.push({
                    label: image.name,
                    value: image.name
                });
            });

            const row = new ActionRowBuilder<SelectMenuBuilder>()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId("select-targetted-user-image-trade")
                        .setPlaceholder("Rien n'est sélectionné.")
                        .setOptions(options),
                );

            await interaction.reply({content: "Veuillez choisir une des images de la personne avec qui vous souhaitez échanger.", components: [row]});
        }
        else if(interaction.customId === "select-targetted-user-image-trade") {
            const selectedTargettedUserImage: string = interaction.values[0];
            const selectedTargettedUserImageEntity: Image = (await imageRepository.findOneBy({name: selectedTargettedUserImage})) as Image;

            await interaction.reply(`<@${userId}> souhaite échanger ${selectedUserImage} contre ${selectedTargettedUserImage} de <@${targettedUserId}>`);
            messageToReact = await interaction.followUp(`<@${targettedUserId}> réagissez à ce message avec 👍 pour accepter l'échange ou avec 👎 pour le refuser. Vous avez 30 secondes.`);
            await messageToReact.react("👍");
            await messageToReact.react("👎");

            // Après 30 secondes : 30000ms
            setTimeout(async function () {
                const hasTargettedUserReactedPositively = (await messageToReact.reactions.resolve("👍")?.users.fetch())?.find(user => user.id === targettedUserId) != null;
                const hasTargettedUserReactedNegatively = (await messageToReact.reactions.resolve("👎")?.users.fetch())?.find(user => user.id === targettedUserId) != null;
                if(!hasTargettedUserReactedPositively && !hasTargettedUserReactedNegatively) {
                    return interaction.followUp(`<@${targettedUserId}> n'a pas réagi. Échange annulé.`);
                }

                if(hasTargettedUserReactedPositively) {
                    selectedUserImageEntity.userId = targettedUserId;
                    selectedTargettedUserImageEntity.userId = userId;
                    await imageRepository.save([selectedUserImageEntity, selectedTargettedUserImageEntity]);
                    interaction.followUp("Échange accepté !");
                } else if(hasTargettedUserReactedNegatively) {
                    interaction.followUp("Échange annulé.");
                }
            }, 30000);
        }
    }
    return;
});