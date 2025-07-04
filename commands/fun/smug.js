const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'smug',
    aliases: ['smugface', 'smugreaction'],
    category: 'fun',
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || message.author; 

        const smugGifs = [
            'https://media.giphy.com/media/4tE2HqakF9mqs/giphy.gif',
            'https://media.giphy.com/media/3o6fJ7pD4Wojs4kHCo/giphy.gif',
            'https://media.giphy.com/media/xT8qB5vW8rjV7C2rw4/giphy.gif',
            'https://media.giphy.com/media/3ohs4oCxijFbHfm6xO/giphy.gif'
        ];

        const smugGif = smugGifs[Math.floor(Math.random() * smugGifs.length)];

        const embed = new MessageEmbed()
            .setTitle(`${user.username} is feeling smug!`)
            .setImage(smugGif)
            .setColor('PURPLE')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
};
