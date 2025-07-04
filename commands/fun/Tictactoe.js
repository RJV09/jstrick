const { EmbedBuilder } = require('discord.js');
const simplydjs = require('simply-djs');

module.exports = {
  name: 'tictactoe',
  aliases: ["ttt","tictac"],
  edesc: 'ttt @user',
  description: 'Play tic-tac-toe',
  userPermissions: [],
  botPermissions: [],
  category: 'fun',
  cooldown: 5,

  execute: async (client, message, args) => {
    const embed = new EmbedBuilder()
      .setTitle('Tic-Tac-Toe')
      .setDescription('Let\'s play Tic-Tac-Toe! React with the corresponding emojis to make your move.')
      .setColor(client.color);

    await message.channel.send({ embeds: [embed] });

    await simplydjs.tictactoe(message, {});
  }
};