const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'truth',
    aliases: [],
    category: 'fun',
    run: async (client, message, args) => {
        const truths = [
            "What's the most embarrassing thing you've ever done?",
            "Who is your secret crush?",
            "What's the biggest lie you've ever told?",
            "If you could change one thing about your life, what would it be?",
            "What's a secret you've never told anyone?",
            "Who in this server would you trade lives with for a day?",
            "What's the weirdest dream you've ever had?",
            "Have you ever cheated in a game or test?",
            "If you could date one celebrity, who would it be?",
            "What's the worst habit you have?"
        ];

        const randomTruth = truths[Math.floor(Math.random() * truths.length)];

        const embed = new MessageEmbed()
            .setTitle("Truth Time!")
            .setDescription(randomTruth)
            .setColor("RANDOM")
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};