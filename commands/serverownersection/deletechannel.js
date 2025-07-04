const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'deletechannel',
    aliases: ['dc'],
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
                            `<:emoji_1725906884992:1306038885293494293>  | I need the \`Manage Channels\` permission to delete channels.`
                        )
                ]
            });
        }

        const channelId = args[0] || message.mentions.channels.first();
        if (!channelId) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Please provide the channel to delete.\nYou can mention the channel or provide its ID.`
                        )
                ]
            });
        }

        const channel = message.guild.channels.cache.get(channelId) || message.mentions.channels.first();
        if (!channel) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | The specified channel could not be found.`
                        )
                ]
            });
        }

        if (channel.type === 'GUILD_CATEGORY' || channel.type === 'GUILD_STORE' || channel.type === 'GUILD_NEWS') {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I cannot delete this type of channel (category, store, or news channels).`
                        )
                ]
            });
        }

        try {
            await channel.delete(`Deleted by ${message.author.tag}`);
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | Successfully deleted the channel: **${channel.name}**.`
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
                            `<:emoji_1725906884992:1306038885293494293>  | Something went wrong while deleting the channel. Please try again later.`
                        )
                ]
            });
        }
    }
};
