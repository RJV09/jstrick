const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'reaction',
    aliases: ['react', 'reactemoji'],
    category: 'fun',
    run: async (client, message, args) => {
        const mentionedMessage = message.mentions.messages.first();
        const emoji = args[1]; 
        if (!mentionedMessage) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('Please mention a message to react to! Usage: `reaction <messageID> <emoji>`')
                ]
            });
        }

        if (!emoji) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('Please provide an emoji to react with! Usage: `reaction <messageID> <emoji>`')
                ]
            });
        }

        try {
            await mentionedMessage.react(emoji);

            const embed = new MessageEmbed()
                .setTitle("✅ Reaction Added!")
                .setDescription(`I have reacted to the message with the emoji: ${emoji}`)
                .setColor('GREEN')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

            message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('Sorry, I was unable to react to the message. Please check the message ID or the emoji.')
                ]
            });
        }
    }
};
