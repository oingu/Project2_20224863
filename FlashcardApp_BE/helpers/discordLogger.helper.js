const { fail } = require("assert");
const { getClient } = require("../config/discordLogger");
const systemConfig = require("../config/system");
const { send } = require("process");

const COLORS = {
    SUCCESS: 0x2ecc71, // Xanh lá
    ERROR: 0xe74c3c, // Đỏ
    WARNING: 0xf1c40f, // Vàng
    INFO: 0x3498db, // Xanh dương
    DEBUG: 0x95a5a6, // Xám
};

const EMOJIS = {
    SUCCESS: "✅",
    ERROR: "❌",
    WARNING: "⚠️",
    INFO: "ℹ️",
    DEBUG: "🐞",
};

const formatLevel = (level = "INFO") => {
    const upper = level.toUpperCase();
    return {
        color: COLORS[upper] || COLORS.INFO,
        emoji: EMOJIS[upper] || EMOJIS.INFO,
        label: upper,
    };
};

const buildEmbed = (level, title, description) => {
    const { color, emoji, label } = formatLevel(level);

    return {
        color,
        title: title || "Log Message",
        description: description || "No details provided.",
        timestamp: new Date(),
        footer: {
            text: `Level: ${label} ${emoji}`,
        },
    };
};

const sendLog = async (message, level = "INFO", title, content) => {
    const client = getClient();

    if (!client || !client.isReady?.()) {
        console.error("❌ Discord client is not ready.");
        return;
    }

    const embed = buildEmbed(level, title, content || message);
    const failedChannels = [];

    const channels = systemConfig.discordChannelId;
    await Promise.all(
        channels.map(async (channelId) => {
            try {
                const channel = client.channels.fetch(channelId);
                if (!channel || !channel.isTextBased?.()) {
                    throw new Error("Not a valid text-based channel.");
                }
                await channel.send({ embeds: [embed] });
                console.log(`✅ Log sent to channel ${channelId}`);
            } catch (error) {
                failedChannels.push({
                    channelId,
                });
                console.error(`❌ Failed to send to ${channelId}:`, error.message);
            }
        })
    );
    if (failedChannels.length) {
        console.warn("⚠️ Some logs failed to send:", failedChannels);
    }
};

module.exports = {
    sendLog,
};
