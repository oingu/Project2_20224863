const {Client, GatewayIntentBits} = require('discord.js');

const botToken = process.env.DISCORD_BOT_TOKEN;

let client = null;

module.exports.connect = async () => {
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
        ]
    });

    return new Promise((resolve, reject) => {
        client.once("ready", () => {
            console.log(`✅ Discord Logger bot ready as ${client.user.tag}`);
            resolve();
        });

        client.login(botToken).catch((err) => {
            console.error("❌ Logger bot failed to login:", err);
            reject(err);
        });
    });
}

module.exports.getClient = () => {
     if (!client) {
        throw new Error("Discord client is not connected. Call connect() first.");
    }
    return client;
}