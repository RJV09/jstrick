const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'lesbian',
    aliases: ['howlesbian', 'lesbianpercentage'],
    category: 'fun',
    run: async (client, message, args) => {
        const user = message.mentions.users.first();

        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(
                            "Please mention a user to calculate their lesbian percentage.\nUsage: `lesbian @User`"
                        )
                ]
            });
        }

        const lesbianPercentage = Math.floor(Math.random() * 101); 

        let description;
        let gifUrl;

        if (lesbianPercentage >= 80) {
            description = `🌈 Wow, ${user} is **very lesbian**! Lesbian percentage: **${lesbianPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/3o6Zt8iXkxLf2eDZY8/giphy.gif"; 
        } else if (lesbianPercentage >= 50) {
            description = `🌈 ${user} is pretty lesbian! Lesbian percentage: **${lesbianPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/3oEjI4sFlpZr9y1lmY/giphy.gif"; 
        } else if (lesbianPercentage >= 20) {
            description = `🌈 Hmm, ${user} might be exploring! Lesbian percentage: **${lesbianPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/1BdD1hbVNKC22/giphy.gif"; 
        } else {
            description = `🌈 ${user} is **not that lesbian** but hey, it's all good! Lesbian percentage: **${lesbianPercentage}%**`;
            gifUrl = "https://media.giphy.com/media/1oF1pV1GeBczdbjAGw/giphy.gif"; 
        }

        const embed = new MessageEmbed()
            .setTitle("🌈 Lesbian Percentage")
            .setDescription(description)
            .setColor(lesbianPercentage >= 50 ? 'GREEN' : 'ORANGE')
            .setImage(gifUrl) 
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });


        message.channel.send({ embeds: [embed] });
    }
};