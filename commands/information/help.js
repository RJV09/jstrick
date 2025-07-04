const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const prefix = message.guild?.prefix || '&';

        const selectMenu1 = new MessageSelectMenu()
            .setCustomId('categorySelect1')
            .setPlaceholder('Select a module')
            .addOptions([
                { label: 'AntiNuke', value: 'security', description: 'Commands related to AntiNuke' },
                { label: 'Moderation', value: 'mod', description: 'Commands related to Moderation' },
                { label: 'Utility', value: 'info', description: 'Utility commands' },
                { label: 'Welcomer', value: 'welcomer', description: 'Commands for Welcomer' },
                { label: 'Voice', value: 'voice', description: 'Commands related to Voice' },
                { label: 'Logging', value: 'logging', description: 'Commands for Logging' },
                { label: 'Automod', value: 'automod', description: 'Commands for Automod' },
                { label: 'Custom Role', value: 'customrole', description: 'Commands for Custom Roles' },
                { label: 'Giveaway', value: 'giveaway', description: 'Commands for Giveaway' },
                { label: 'Autoresponder', value: 'autoresponder', description: 'Commands for AutoResponder' },
                { label: 'Ticket', value: 'ticket', description: 'Commands for Ticket' },
                { label: 'Fun', value: 'fun', description: 'Commands for fun' },
            ]);

        const actionRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Home')
                    .setCustomId('homeButton')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setLabel('Delete')
                    .setCustomId('deleteButton')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setLabel('Website')
                    .setStyle('LINK')
                    .setURL('https://Levix-bot.vercel.app/'),
                new MessageButton()
                    .setLabel('Invite Me')
                    .setStyle('LINK')
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=1209829112957509632&permissions=8&scope=bot')
            );

        const embed = new MessageEmbed()
            .setColor(client.color) 
            .setAuthor({
                name: `Levix Help Menu`, 
                iconURL: client.user.displayAvatarURL({ dynamic: true }) 
            })
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `Hello ! I'm Levix, Your Bot For Server
Security With Powerful Antinuke Features.\n\n Prefix for this server: \`${prefix}\`\n Total Commands: \`${client.commands.size}\``
            )
            .addField(
                '__Main Modules__',
                `
                <:image:1330976326861193408> **AntiNuke**\n<:FlaMe_OP:1319933234729193514> **Moderation**\n<:FlaMe_OP:1319933367025926164> **Utility**\n<:stolen_emoji:1319933407857344592> **Welcomer**\n<:FlaMe_OP:1319934252405624883> **Ticket**\n<:stolen_emoji:1319933985123729479> **Reaction Role**\n<:stolen_emoji:1319933985123729479> **AI**
                `,
            )
            .addField(
                '__Main Modules__',
                `
                <:stolen_emoji:1319934197334540300> **Voice**\n<:stolen_emoji:1319934085874847757> **Custom Role**\n<:stolen_emoji:1319934135397257248> **Logging**\n<:FlaMe_OP:1319934032649129984> **Automod**\n<:stolen_emoji:1319934085874847757> **Giveaway**\n<:stolen_emoji:1319934085874847757> **Autoresponder**\n<:FlaMe_OP:1319933408528306177> **Fun**
                 **Links**\n[Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) | [Support](https://discord.gg/rfzop) | [Website](https://levix-bot.vercel.app/)\n\n
                `,
            )
            .setFooter({
                text: 'Developed by Team Omicron </>',
                iconURL: client.user.displayAvatarURL()
            });

        const helpMessage = await message.channel.send({
            embeds: [embed],
            components: [
                new MessageActionRow().addComponents(selectMenu1), 
                actionRow 
            ]
        });
        
        const collector = helpMessage.createMessageComponentCollector({
            filter: (i) => i.user.id === message.author.id,
            time: 60000
        });

        collector.on('collect', async (i) => {
            await i.deferUpdate();

            if (i.customId === 'deleteButton') {
                await helpMessage.delete();
                return;
            }

            if (i.customId === 'homeButton' || i.values?.[0] === 'home') {
                return helpMessage.edit({
                    embeds: [embed],
                    components: [
                        new MessageActionRow().addComponents(selectMenu1),
                        actionRow
                    ]
                });
            }

            const category = i.values[0];
            let commands = [];

            const subcommands = {
                antinuke: ['`antinuke enable`, `antinuke disable`, `antinuke`'],
            };

            if (category === 'all') {
                commands = client.commands.map((x) => `\`${x.name}\``);
            } else {
                const filteredCategory = category;
                commands = client.commands
                    .filter((x) => x.category === filteredCategory)
                    .map((x) => `\`${x.name}\``);
            }

            let categoryEmbed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(`**${category.charAt(0).toUpperCase() + category.slice(1)} Commands**\n${commands.join(', ')}`);

            if (subcommands[category]) {
                categoryEmbed.addField('Subcommands', subcommands[category].join('\n'));
            }

            helpMessage.edit({
                embeds: [categoryEmbed],
                components: [
                    new MessageActionRow().addComponents(selectMenu1),
                    actionRow
                ]
            });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                helpMessage.edit({ components: [] });
            }
        });
    }
};
