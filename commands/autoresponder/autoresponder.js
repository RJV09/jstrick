const { Message, Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

const autoResponderFilePath = path.join(__dirname, 'autoresponders.json');

function loadAutoresponders() {
    try {
        if (fs.existsSync(autoResponderFilePath)) {
            const rawData = fs.readFileSync(autoResponderFilePath);
            return JSON.parse(rawData);
        } else {
            return {};
        }
    } catch (error) {
        console.error('Error loading autoresponders:', error);
        return {}; 
    }
}

function saveAutoresponders(data) {
    try {
        fs.writeFileSync(autoResponderFilePath, JSON.stringify(data, null, 4));
    } catch (error) {
        console.error('Error saving autoresponders:', error);
    }
}

module.exports = {
    name: 'autoresponder',
    category: 'autoresponder',
    premium: false,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`Autoresponder Commands`)
                        .setDescription('**Use the following commands to manage autoresponders:**')
                        .addFields(
                            {
                                name: `Set Autoresponder`,
                                value: `**To set an autoresponder, use \`autoresponder set <keyword> <response>\`**`
                            },
                            {
                                name: `Remove Autoresponder`,
                                value: `**To remove an autoresponder, use \`autoresponder remove <keyword>\`**`
                            },
                            {
                                name: `List Autoresponders`,
                                value: `**To list all autoresponders, use \`autoresponder list\`**`
                            },
                            {
                                name: `Guide`,
                                value: `**To show this guide, use \`autoresponder guide\`**`
                            }
                        ),
                ]
            });
        }

        switch (args[0].toLowerCase()) {
            case 'set':
                return setAutoresponder(client, message, args.slice(1));
            case 'remove':
                return removeAutoresponder(client, message, args.slice(1));
            case 'list':
                return listAutoresponders(client, message);
            case 'guide':
                return guideAutoresponder(client, message);
            default:
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setTitle(`Invalid Command`)
                            .setDescription('Please use a valid autoresponder command.')
                            .addFields(
                                {
                                    name: `Set Autoresponder`,
                                    value: `**To set an autoresponder, use \`autoresponder set <keyword> <response>\`**`
                                },
                                {
                                    name: `Remove Autoresponder`,
                                    value: `**To remove an autoresponder, use \`autoresponder remove <keyword>\`**`
                                },
                                {
                                    name: `List Autoresponders`,
                                    value: `**To list all autoresponders, use \`autoresponder list\`**`
                                },
                                {
                                    name: `Guide`,
                                    value: `**To show this guide, use \`autoresponder guide\`**`
                                }
                            ),
                    ],
                });
        }
    },
};


async function setAutoresponder(client, message, args) {
    if (args.length < 2) {
        return message.channel.send({
            embeds: [
                new MessageEmbed().setColor('RED').setDescription('Please provide a keyword and response for the autoresponder.')
            ],
        });
    }

    const keyword = args[0].toLowerCase();
    const response = args.slice(1).join(' ');

    const autoresponders = loadAutoresponders();

    if (!autoresponders[message.guild.id]) {
        autoresponders[message.guild.id] = [];
    }

    if (autoresponders[message.guild.id].some(ar => ar.keyword === keyword)) {
        return message.channel.send({
            embeds: [
                new MessageEmbed().setColor('RED').setDescription('An autoresponder for this keyword already exists.')
            ],
        });
    }

    autoresponders[message.guild.id].push({ keyword, response });
    saveAutoresponders(autoresponders);

    message.channel.send({
        embeds: [
            new MessageEmbed().setColor('GREEN').setDescription(`Successfully added autoresponder for \`${keyword}\``)
        ],
    });
}

async function removeAutoresponder(client, message, args) {
    if (args.length < 1) {
        return message.channel.send({
            embeds: [
                new MessageEmbed().setColor('RED').setDescription('Please provide a keyword to remove the autoresponder.')
            ],
        });
    }

    const keyword = args[0].toLowerCase();
    const autoresponders = loadAutoresponders();

    if (!autoresponders[message.guild.id]) {
        return message.channel.send({
            embeds: [
                new MessageEmbed().setColor('RED').setDescription('No autoresponders set up for this server.')
            ],
        });
    }

    const index = autoresponders[message.guild.id].findIndex(ar => ar.keyword === keyword);

    if (index === -1) {
        return message.channel.send({
            embeds: [
                new MessageEmbed().setColor('RED').setDescription(`No autoresponder found for \`${keyword}\``)
            ],
        });
    }

    autoresponders[message.guild.id].splice(index, 1);
    saveAutoresponders(autoresponders);

    message.channel.send({
        embeds: [
            new MessageEmbed().setColor('GREEN').setDescription(`Successfully removed the autoresponder for \`${keyword}\``)
        ],
    });
}

async function listAutoresponders(client, message) {
    const autoresponders = loadAutoresponders();

    if (!autoresponders[message.guild.id] || autoresponders[message.guild.id].length === 0) {
        return message.channel.send({
            embeds: [
                new MessageEmbed().setColor('YELLOW').setDescription('No autoresponders set up for this server.')
            ],
        });
    }

    const list = autoresponders[message.guild.id].map(ar => `**${ar.keyword}**: ${ar.response}`).join('\n');
    message.channel.send({
        embeds: [
            new MessageEmbed().setColor('BLUE').setTitle('Autoresponders List').setDescription(list)
        ],
    });
}

async function guideAutoresponder(client, message) {
    message.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor('AQUA')
                .setTitle('Autoresponder Guide')
                .setDescription(`
                    **How to Use:**
                    1. \`/autoresponder set <keyword> <response>\` - Set an autoresponder.
                    2. \`/autoresponder remove <keyword>\` - Remove an existing autoresponder.
                    3. \`/autoresponder list\` - List all autoresponders.
                    4. \`/autoresponder guide\` - Show this guide.

                    **Example Usage:**
                    - \`/autoresponder set hello Hello! How can I help you today?\`
                    - \`/autoresponder remove hello\`
                `),
        ],
    });
}
