const { EmbedBuilder } = require('discord.js');
const tord = require('better-tord');

module.exports = {
  name: "truth or dare",
  aliases: ["t or d","td"],
  edesc: "tord",
  description: "Sends a random T_or_D question",
  userPermissions: [],
  botPermissions: [],
  category: "fun",
  cooldown: 5,

  execute: async (client, message, args) => {
    message.delete({ timeout: 300 });
    const t_or_d = tord.get_random_question();
on
    const emb = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Random T_or_D")
      .addFields(
        {
          name: "Challenge:",
          value: t_or_d
        }
      );

    message.channel.send({ embeds: [emb] });
  }
};