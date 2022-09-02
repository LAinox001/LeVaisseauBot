import dotenv from "dotenv";
dotenv.config();
const { DISCORD_TOKEN, GUILD_ID, CHANNEL_ID, ROLE_ID, CLIENT_ID} = process.env;

if(!DISCORD_TOKEN || !GUILD_ID || !CHANNEL_ID || !ROLE_ID || !CLIENT_ID) {
    throw new Error("Missing environment variables");
}

const config: Record<string, string> = {
    DISCORD_TOKEN,
    GUILD_ID,
    CHANNEL_ID,
    ROLE_ID,
    CLIENT_ID
};

export default config;