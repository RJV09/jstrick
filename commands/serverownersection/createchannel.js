const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'createchannel',
    aliases: ['cc'],
    category: 'svowner',
    premium: false,

    /**
     * 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        if (message.author.id !== message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must be the server owner to use this command.`
                        )
                ]
            });
        }

        if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I need the \`Manage Channels\` permission to create channels.`
                        )
                ]
            });
        }

        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Please provide a name for the new channel.`
                        )
                ]
            });
        }

        const channelType = args[1] ? args[1].toLowerCase() : 'text';
        if (channelType !== 'text' && channelType !== 'voice') {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Invalid channel type. Please choose between \`text\` or \`voice\`.`
                        )
                ]
            });
        }

        try {

            let newChannel;
            if (channelType === 'text') {
                newChannel = await message.guild.channels.create(args[0], {
                    type: 'GUILD_TEXT',
                    reason: `Channel created by ${message.author.tag}`,
                });
            } else {
                newChannel = await message.guild.channels.create(args[0], {
                    type: 'GUILD_VOICE',
                    reason: `Channel created by ${message.author.tag}`,
                });
            }

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | Successfully created the ${channelType} channel: **${newChannel.name}**.`
                        )
                ]
            });
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Something went wrong while creating the channel. Please try again later.`
                        )
                ]
            });
        }
    }
};
