import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

export const data = new SlashCommandBuilder().setName("image").setDescription("Show image");

export async function execute(interaction: CommandInteraction) {
    return interaction.reply({
        files: [
            "images/hello-bonjour.gif"
        ]
    });
}