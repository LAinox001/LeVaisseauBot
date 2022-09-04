import {SlashCommandBuilder} from "@discordjs/builders";
import {Collection, CommandInteraction, Guild, GuildMember, User} from "discord.js";
import AppDataSource from "../database";
import {Mot} from "../models/mot";
import {client} from "../consts/client";
import config from "../consts/config";

const reactionsNumberNeeded = 4;
const waitingMs = 300000;

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
    const targettedUser: User = interaction.options.getUser("utilisateur") as User;
    const targettedUserId: string = targettedUser.id;
    const motValue: string = interaction.options.get("mot")?.value as string;
    const datasource = await AppDataSource;
    const motRepository = datasource.getRepository(Mot);
    
    await interaction.reply(`Un nouveau mot a été proposé pour <@${targettedUserId}> pour le motif suivant :\n${motValue}`);
    const messagePoll = await interaction.followUp(`Réagissez à ce message pour approuver le mot.\nSi le mot atteint ${reactionsNumberNeeded} réactions en ${waitingMs/60000} minutes, il sera approuvé`);
    messagePoll.react("👍");

    // Après 5 minutes : 300000ms
    setTimeout(async function () {
        const reactionsNumber: number = (await messagePoll.reactions.resolve("👍")?.users.fetch())?.size as number;

        if(reactionsNumber >= reactionsNumberNeeded) {
            const mot = new Mot();
            mot.mot = motValue;
            mot.userId = targettedUserId;
            await motRepository.save(mot);

            interaction.followUp(`Un nouveau mot a été ajouté au carnet de <@${targettedUserId}>`);

            const motsNumberOfUser = (await motRepository.findBy({userId: targettedUserId})).length;
            if(motsNumberOfUser % 3 === 0) {
                const server: Guild = client.guilds.cache.get(config.GUILD_ID) as Guild;
                const members: Collection<string, GuildMember> = await server.members.fetch();
                const user = members.find(member => member.id === targettedUserId) as GuildMember;

                // On met le user en prison
                user.roles.add(config.BLOCKED_ROLE_ID);
                await user.voice.setChannel(config.BLOCKED_VOICE_CHANNEL_ID);

                // Après 5 minutes on le libère
                return setTimeout(async function () {
                    await user.roles.remove(config.BLOCKED_ROLE_ID);
                    user.voice.setChannel(config.VOICE_CHANNEL_ID);
                }, 300000);
            }
            return;
        } else {
            return interaction.followUp(`Le mot n'a pas été approuvé par le conseil de discipline.`);
        }
    }, waitingMs);
}