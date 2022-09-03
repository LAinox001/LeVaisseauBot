import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, User} from "discord.js";

export const data = new SlashCommandBuilder().setName("mot").setDescription("Créer un mot pour un utilisateur")
    .addUserOption(option =>
        option.setName("utilisateur")
            .setDescription("La personne qui va prendre un mot dans son carnet")
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("mot")
            .setDescription("Le mot qui sera écrit dans le carnet")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    const targettedUser: User | null = interaction.options.getUser("utilisateur");
    const mot: string = interaction.options.get("mot")?.value as string;

    return interaction.reply(`Un nouveau mot a été ajouté au carnet de <@${targettedUser?.id}>`);
}