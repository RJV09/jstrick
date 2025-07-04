const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'pat',
    aliases: ['pet', 'patpet'],
    category: 'fun',
    run: async (client, message, args) => {
        const user = message.mentions.users.first();

        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('Please mention a user to pat! Usage: `pat @User`')
                ]
            });
        }

        const patGifs = [
            'https://media.giphy.com/media/l0Exv5aO0I2oFZ2u4/giphy.gif', 
            'https://media.giphy.com/media/JwMjk3AfTQmCs/giphy.gif',
            'https://media.giphy.com/media/2vnIZPYVG9jle/giphy.gif',
            'https://media.giphy.com/media/TzkgTSQF9zM8s/giphy.gif',
            'https://media.giphy.com/media/xT1R9vC7mjyzQ7wLfc/giphy.gif'
        ];

        const randomPatGif = patGifs[Math.floor(Math.random() * patGifs.length)];

        const embed = new MessageEmbed()
            .setTitle(`🤗 Patting Time!`)
            .setDescription(`${message.author} is patting ${user} on the head! 😇`)
            .setColor('PINK')
            .setImage(randomPatGif)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
};
