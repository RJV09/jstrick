const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'rockpaperscissors',
    aliases: ['rockpaperscissors', 'rpsgame'],
    category: 'fun',
    run: async (client, message, args) => {
        const choices = ['rock', 'paper', 'scissors'];

        const userChoice = args[0]?.toLowerCase();
        if (!userChoice || !choices.includes(userChoice)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('Please choose either rock, paper, or scissors! Usage: `rps <rock/paper/scissors>`')
                ]
            });
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result;
        if (userChoice === botChoice) {
            result = 'It\'s a tie!';
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = 'You win!';
        } else {
            result = 'You lose!';
        }

        const embed = new MessageEmbed()
            .setTitle('🪓 Rock, Paper, Scissors 🧻')
            .setDescription(`
                **You chose:** ${userChoice}
                **Bot chose:** ${botChoice}

                **Result:** ${result}
            `)
            .setColor(result === 'You win!' ? 'GREEN' : result === 'You lose!' ? 'RED' : 'YELLOW')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
};
