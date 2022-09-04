import dotenv from "dotenv";
dotenv.config();
const { DISCORD_TOKEN, GUILD_ID, CHANNEL_ID, ROLE_ID, CLIENT_ID, BLOCKED_ROLE_ID, VOICE_CHANNEL_ID, BLOCKED_VOICE_CHANNEL_ID, ROOT_DIRECTORY} = process.env;

if(!DISCORD_TOKEN || !GUILD_ID || !CHANNEL_ID || !ROLE_ID || !CLIENT_ID || !BLOCKED_ROLE_ID || !VOICE_CHANNEL_ID || !BLOCKED_VOICE_CHANNEL_ID || !ROOT_DIRECTORY) {
    throw new Error("Missing environment variables");
}

const config: Record<string, string> = {
    DISCORD_TOKEN,
    GUILD_ID,
    CHANNEL_ID,
    ROLE_ID,
    CLIENT_ID,
    BLOCKED_ROLE_ID,
    VOICE_CHANNEL_ID,
    BLOCKED_VOICE_CHANNEL_ID,
    ROOT_DIRECTORY
};

export default config;