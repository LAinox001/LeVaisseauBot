import {SelectMenuOptionBuilder, SlashCommandBuilder} from "@discordjs/builders";
import {
    ActionRowBuilder,
    APISelectMenuOption,
    AttachmentBuilder,
    CommandInteraction,
    RestOrArray, SelectMenuBuilder,
    SelectMenuComponentOptionData
} from "discord.js";
import {Canvas, createCanvas, loadImage} from "@napi-rs/canvas";
import {AppDataSource} from "../database";
import {Image} from "../models/image";
import {client} from "../consts/client";

export const data = new SlashCommandBuilder().setName("collection").setDescription("Affiche toutes les images que vous possédez , page par page");

export async function execute(interaction: CommandInteraction) {
    const datasource = await AppDataSource.getInstance();
    const imageRepository = datasource.getRepository(Image);
    const userId: string = interaction.user.id;

    const images = await imageRepository.findBy({ userId: userId});

    const imagesNumber = images.length;

    if(imagesNumber > 12) {
        const pagesNumber = Math.ceil(imagesNumber/12);
        console.log(pagesNumber);

        const options: RestOrArray<APISelectMenuOption | SelectMenuOptionBuilder | SelectMenuComponentOptionData> = [];
        for(let i = 1; i <= pagesNumber; i++) {
            options.push({
                label: i.toString(),
                value: i.toString()
            });
        }

        const row = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("select-collection-page")
                    .setPlaceholder("Rien n'est sélectionné.")
                    .setOptions(options),
            );

        await interaction.reply({content: "Veuillez choisir une page", components: [row]});
    } else {
        await interaction.reply("Traitement...");
        const imageAttachment = await createImage(userId, 0);
        interaction.editReply({content: "", files: [imageAttachment] });
    }
}

async function createImage(userId: string, pageNumber: number): Promise<AttachmentBuilder> {
    const datasource = await AppDataSource.getInstance();
    const imageRepository = datasource.getRepository(Image);

    const images = await imageRepository.find({ where: { userId: userId }, order: { name: "ASC" }, skip: 12 * pageNumber, take: 12});

    const imagesNumber = images.length;
    const linesNumber = Math.ceil(imagesNumber/4);
    const space = 20;
    let width = 0;
    const height = (560.9) * linesNumber;

    if(imagesNumber < 4) {
        width = imagesNumber * (377.7 + space);
    } else {
        width = 4 * (377.7 + space);
    }

    const canvas: Canvas = createCanvas(width, height);
    const ctx = canvas.getContext(`2d`);
    let dx = 0;
    let dy = 0;
    let currentLine = 0;
    let currentImageInLine = 0;
    for (const image of images) {
        currentImageInLine += 1;
        const img = await loadImage(`src/images/${image.name}`);
        ctx.drawImage(img, dx, dy, 377.7, 560.9);
        if (currentImageInLine === 4) {
            currentLine += 1;
            currentImageInLine = 0;
            dx = 0;
            dy += 560.9;
        } else {
            dx += 377.7 + space;
        }
    }

    return new AttachmentBuilder(await canvas.encode("png"), {name: "image-attachment.png"});
}

client.on("interactionCreate", async (interaction) => {
    if (interaction.isSelectMenu()) {
        if (interaction.customId !== "select-collection-page") return;
        await interaction.message.edit({components: []});
        await interaction.reply({content: `Traitement...`});
        const pageNumber = parseInt(interaction.values[0]) - 1;
        const imageAttachment = await createImage(interaction.user.id, pageNumber);
        interaction.editReply({content: `Voici les cartes de la page n°${pageNumber+1}`, components: [], files: [imageAttachment]});
    }
    return;
});