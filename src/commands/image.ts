import {SelectMenuOptionBuilder, SlashCommandBuilder} from "@discordjs/builders";
import {
    ActionRowBuilder,
    APISelectMenuOption,
    CommandInteraction, RestOrArray,
    SelectMenuBuilder,
    SelectMenuComponentOptionData
} from "discord.js";
import AppDataSource from "../database";
import {Image} from "../models/image";
import {client} from "../consts/client";

export const data = new SlashCommandBuilder().setName("image").setDescription("Afficher une image que vous possédez");

export async function execute(interaction: CommandInteraction) {
    const datasource = await AppDataSource;
    const imageRepository = datasource.getRepository(Image);
    const userId = interaction.user.id;

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
                .setCustomId("select-image")
                .setPlaceholder("Rien n'est sélectionné.")
                .setOptions(options),
        );

    return interaction.reply({content: "Veuillez choisir une image", components: [row]});
}

client.on("interactionCreate", async (interaction) => {
    if (interaction.isSelectMenu()) {
        if (interaction.customId !== "select-image") return;
        const filename = interaction.values[0];
        await interaction.reply({
            files: [
                "src/images/" + filename
            ]
        });
        await interaction.message.edit({components: []});
    }
    return;
});