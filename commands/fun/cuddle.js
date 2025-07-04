const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'cuddle',
    aliases: ['snuggle'],
    category: 'fun',
    run: async (client, message, args) => {
        const user = message.mentions.users.first();

        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(
                            "Please mention a user to cuddle! Usage: `cuddle @User`"
                        )
                ]
            });
        }

        const cuddleGifs = [
            'https://media.giphy.com/media/3o7TKlzJDe7aWqSHlo/giphy.gif',
            'https://media.giphy.com/media/26tPplpQGlY5r5dZo/giphy.gif',
            'https://media.giphy.com/media/WXnpBf0g4gDbW/giphy.gif',
            'https://media.giphy.com/media/ntNu10avtd3sw/giphy.gif',
            'https://media.giphy.com/media/3o85xkBr3diT57u0AQ/giphy.gif'
        ];

        const randomGif = cuddleGifs[Math.floor(Math.random() * cuddleGifs.length)];

        const embed = new MessageEmbed()
            .setTitle(`🤗 Cuddle Time!`)
            .setDescription(`${message.author} is giving ${user} a warm cuddle! 🤗`)
            .setColor('PINK')
            .setImage(randomGif)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
};
