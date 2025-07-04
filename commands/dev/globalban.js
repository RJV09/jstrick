const { MessageEmbed } = require('discord.js');

const saixd = ['760143551920078861','760143551920078861'];
module.exports = {
    name: 'globalban',
    aliases: [],
    category: 'owner',
    run: async (client, message, args) => {
        if (!saixd.includes(message.author.id)) return;

        let userId = args[0];
        if (!userId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | Please Provide Valid user ID or Mention Member.`)
                ]
            });
        }

        if (userId) {
            try {
                for (const [_, guild] of client.guilds.cache) {
                    if (guild.members.cache.has(userId)) {
                        setTimeout(async () => {
                            try {
                                await guild.members.ban(userId, {
                                    reason: "User has been globally banned due to repeated and severe violations of Discord's terms of service, including but not limited to harassment, nuking, spamming, distributing malicious content, and engaging in activities that undermine the safety and well-being of the Discord community. This global ban is a result of a pattern of behavior that is deemed unacceptable, and it is necessary to ensure the integrity and security of multiple servers on the platform."
                                });
                                message.channel.send(`Banned From ${guild.name}`);
                            } catch (error) {
                                message.channel.send(`Can't Ban User`);
                            }
                        }, 3000); 
                    }
                }
            } catch (error) {
                message.channel.send(`Can't Ban User`);
            }
        }
    }
};