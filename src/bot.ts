import {client} from "./consts/client";
import config from "./consts/config";
import AppDataSource from "./database";
import wordsList from "./consts/wordsList";
import {Guild, Interaction, Role, TextChannel} from "discord.js";
import * as cron from "node-cron";
import * as commandModules from "./commands";
import {Score} from "./models/score";
import {Repository} from "typeorm";

const commands = Object(commandModules);
let scoreRepository: Repository<Score>;

let currentWord: string = "";

client.once("ready", async () => {
    const datasource = await AppDataSource;
    scoreRepository = datasource.getRepository(Score);

    console.log(`Logged in as ${client.user?.tag}!`);

    wordsList.parseFile(function (data) {
        startCronJob(JSON.parse(data.toString()));
    });

    client.on("messageCreate", msg => {
        if(msg.author.id !== "1010330774630830081" && currentWord !== "") {
            // Index à laquelle il faut couper le mot du jour pour avoir tous caractères après 'di' ou 'dy'
            const indexToCut = currentWord.indexOf("di") === -1 ? currentWord.indexOf("dy")+2 : currentWord.indexOf("di")+2;
            const wordToSay = currentWord.substring(indexToCut);
            if (msg.content === wordToSay){
                // Si l'user qui a répondu n'existe pas encore on le crée, on set son score à 1 et on set 'responded' à true
                // Sinon on incrémente son score de 1 et on set 'responded' à true si 'responded' était à false (sinon on ne change rien)
                scoreRepository.query(`INSERT INTO scores (userId, score, responded)
                                VALUES(${msg.author.id}, 1, true)
                                ON CONFLICT(userId)
                                DO UPDATE SET score = CASE WHEN responded=false THEN (score+1) ELSE (score) END, responded=true;`);
                msg.react("👍").then(() => console.log(msg.author.username + " has replied correctly at " + new Date()));
            }
        }
    });
});

function startCronJob(array: string[]) {
    cron.schedule("0 0 18 * * *", async () => {
        // Reset toute la colonne 'responded' de la table score
        await scoreRepository.query("UPDATE scores SET responded=false;");
        const channel: TextChannel = client.channels.cache.find(c => c.id === config.CHANNEL_ID) as TextChannel;
        const server: Guild = client.guilds.cache.get(config.GUILD_ID) as Guild;
        const roleId: Role = server.roles.cache.get(config.ROLE_ID) as Role;
        const randomNumber: number = Math.floor(Math.random() * ((array.length - 1) + 1));
        currentWord = array[randomNumber];

        await channel.send("<@&" + roleId + ">");
        await channel.send({content: currentWord, tts:true});
        await channel.send(`Définition de ${currentWord} : \n 
        - https://www.larousse.fr/dictionnaires/francais/${currentWord} \n 
        - https://www.universalis.fr/dictionnaire/${currentWord}`);
    }, {
        timezone: "Europe/Paris"
    });
}

client.on("interactionCreate", (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    commands[commandName].execute(interaction, currentWord);
});

client.login(config.DISCORD_TOKEN);