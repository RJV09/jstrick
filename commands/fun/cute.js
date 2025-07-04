const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'cute',
    aliases: ['adorable', 'cutepic', 'cutest'],
    category: 'fun',
    run: async (client, message, args) => {
        const cuteImages = [
            'https://media.giphy.com/media/26AOlzVfNTZvi4pe0/giphy.gif',
            'https://media.giphy.com/media/26tn33aiTi1jks2f6/giphy.gif',
            'https://media.giphy.com/media/3o6Zt8iXkxLf2eDZY8/giphy.gif',
            'https://media.giphy.com/media/26gJsz3CvcopItgQS/giphy.gif',
            'https://media.giphy.com/media/l3q2K5jinAlp7W3mg/giphy.gif',
            'https://media.giphy.com/media/9J7td3pmyDN2S/giphy.gif',
            'https://media.giphy.com/media/1hPfa6qH8iwYPiQX3Q/giphy.gif'
        ];

        const randomCuteImage = cuteImages[Math.floor(Math.random() * cuteImages.length)];

        const embed = new MessageEmbed()
            .setTitle('🌸 Here’s Something Cute! 🌸')
            .setDescription(`${message.author} wanted to share something cute! 😍`)
            .setColor('PINK')
            .setImage(randomCuteImage)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
};
