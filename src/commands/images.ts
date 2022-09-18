import {SlashCommandBuilder} from "@discordjs/builders";
import {AttachmentBuilder, CommandInteraction} from "discord.js";
import {Canvas, createCanvas, loadImage} from "@napi-rs/canvas";

export const data = new SlashCommandBuilder().setName("images").setDescription("Affiche toutes les images possédez par une personne");

export async function execute(interaction: CommandInteraction) {
    const canvas: Canvas = createCanvas(700, 250);
    const ctx = canvas.getContext(`2d`);

    const img1 = await loadImage(`src/images/yoshi.png`);
    ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);

    ctx.font = `40px Calvert MT Std`;
    ctx.fillStyle = `#ffffff`;

    const img2 = await loadImage("src/images/Di-Maria.png");
    ctx.drawImage(img2, 25, 25, 200, 200);

    const imageAttachment = new AttachmentBuilder(await canvas.encode("png"), {name: "image-attachment.png"});

    interaction.reply({ files: [imageAttachment] });
}