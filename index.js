require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent"] });

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

function removeTrackingParameters(url) {
    let urlObj
    try {
        urlObj = new URL(url);
    } catch (error) {
        return { cleanUrl: '', removedParams: [], error: '유효하지 않은 URL입니다.' }
    }
    const removedParams = []

    parameters.forEach(param => {
        if (urlObj.searchParams.has(param)) {
            removedParams.push(param);
            urlObj.searchParams.delete(param)
        }
    });

    return { cleanUrl: urlObj.toString(), removedParams, error: null }
}
function detectUrls(text) {
    const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    return text.match(urlPattern) || [];
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    const foundUrls = detectUrls(message.content);
    if (foundUrls.length > 0) {
        foundUrls.forEach(url => {
            const { cleanUrl, removedParams, error } = removeTrackingParameters(url);
            if (removedParams.length > 0) {
                message.reply(`추적 태그가 감지되었습니다: \n<${cleanUrl}>\n제거된 파라미터: ${removedParams.join(', ')}`);
            }
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName === "단축") {
            const link = interaction.options.getString("link")
            const { cleanUrl, removedParams, error } = removeTrackingParameters(link)
            if (error) {
                await interaction.reply({ 
                    content: `에러: ${error}`, 
                    ephemeral: true
                });
            } else {
                await interaction.reply({ 
                    content: `링크: ${cleanUrl}\n제거된 파라미터: ${removedParams.join(', ') || '추적 태그가 없습니다.'}`, 
                    ephemeral: false 
                });
            }
        }
    }
});

client.login(process.env.TOKEN);