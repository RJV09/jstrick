const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'gay',
    aliases: ['howgay', 'gaypercentage'],
    category: 'fun',
    run: async (client, message, args) => {
        const user = message.mentions.users.first();

        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(
                            "Please mention a user to calculate their gay percentage.\nUsage: `gay @User`"
                        )
                ]
            });
        }

        const gayPercentage = Math.floor(Math.random() * 101); 

        let description;
        let gifUrl;

        if (gayPercentage >= 80) {
            description = `🌈 Wow, ${user} is **very gay**! Gay percentage: **${gayPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/3o6Zt8iXkxLf2eDZY8/giphy.gif"; 
        } else if (gayPercentage >= 50) {
            description = `🌈 ${user} is pretty gay! Gay percentage: **${gayPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/3oEjI4sFlpZr9y1lmY/giphy.gif"; 
        } else if (gayPercentage >= 20) {
            description = `🌈 Hmm, ${user} might be exploring! Gay percentage: **${gayPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/1BdD1hbVNKC22/giphy.gif"; 
        } else {
            description = `🌈 ${user} is **not that gay** but hey, it's all good! Gay percentage: **${gayPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/1oF1pV1GeBczdbjAGw/giphy.gif"; 
        }

        const embed = new MessageEmbed()
            .setTitle("🌈 Gay Percentage")
            .setDescription(description)
            .setColor(gayPercentage >= 50 ? 'GREEN' : 'ORANGE')
            .setImage(gifUrl) 
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
};
