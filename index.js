require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: ["Guilds"] });

const parameters = [
    'utm_source',
    'utm_medium',
    'campaign',
    'ref',
    'si',
    'igsh',
    'trcid',
    'traid',
    'adType',
    'eventId'];

function removeTrackingParameters(url, trackingParams) {
    const urlObj = new URL(url);
    const removedParams = [];

    trackingParams.forEach(param => {
        if (urlObj.searchParams.has(param)) {
            removedParams.push(param);
            urlObj.searchParams.delete(param);
        }
    });

    return { cleanUrl: urlObj.toString(), removedParams };
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName === "단축") {
            const link = interaction.options.getString("link");
            const { cleanUrl, removedParams } = removeTrackingParameters(link, parameters);
            interaction.reply({ 
                content: `링크: ${cleanUrl}\n제거된 파라미터: ${removedParams.join(', ') || '추적 태그가 없습니다.'}`, 
                ephemeral: false 
            });
        }
    }
});

client.login(process.env.TOKEN);