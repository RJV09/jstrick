const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'feed',
    aliases: ['givefood', 'feedme', 'feedbot'],
    category: 'fun',
    run: async (client, message, args) => {
        const user = message.mentions.users.first();

        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('Please mention a user to feed! Usage: `feed @User`')
                ]
            });
        }

        const foodGifs = [
            'https://media.giphy.com/media/1zTQ7hDoyHtja/giphy.gif', 
            'https://media.giphy.com/media/3o7TKzjLvT0F1Zk8vw/giphy.gif', 
            'https://media.giphy.com/media/xT0xeJpnrK5zYFwzBm/giphy.gif', 
            'https://media.giphy.com/media/3oFzmrNh6ygfzR6e9m/giphy.gif', 
            'https://media.giphy.com/media/26gJsqHDZomng/giiphy.gif'  
        ];

        const randomFoodGif = foodGifs[Math.floor(Math.random() * foodGifs.length)];

        const embed = new MessageEmbed()
            .setTitle(`🍔 Feeding Time!`)
            .setDescription(`${message.author} is feeding ${user} some delicious food! 🍕🍪`)
            .setColor('ORANGE')
            .setImage(randomFoodGif)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
};
