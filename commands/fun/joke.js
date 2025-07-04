const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'joke',
    aliases: ['telljoke', 'funny', 'dadjoke'],
    category: 'fun',
    run: async (client, message, args) => {
        const jokes = [
            "Why don't skeletons fight each other? They don't have the guts! 💀",
            "I told my wife she was drawing her eyebrows too high. She looked surprised. 😂",
            "Why don’t eggs tell jokes? They’d crack each other up! 🥚",
            "What do you call fake spaghetti? An impasta! 🍝",
            "I used to play piano by ear, but now I use my hands. 🎹",
            "Why can’t you give Elsa a balloon? Because she will let it go! 🎈",
            "I told my computer I needed a break, and it froze. ❄️",
            "What do you call a pile of cats? A meow-tain! 🐱",
            "What’s orange and sounds like a parrot? A carrot! 🥕",
            "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾"
        ];

        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

        const embed = new MessageEmbed()
            .setTitle("😂 Here's a Joke for You!")
            .setDescription(randomJoke)
            .setColor('YELLOW')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
};
