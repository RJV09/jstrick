const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'vcban',
    category: 'mod',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_CHANNELS') && message.guild.ownerId !== message.member.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | You must be the **Guild Owner** or have \`Manage Channels\` permission to use this command.`
                        ),
                ],
            });
        }

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | You must mention a user or provide their ID to vcban.`
                        ),
                ],
            });
        }

        if (member.voice.channel) {
            await member.voice.setMute(true, 'VC Ban by a Moderator');
        }

        await client.db.set(`vcban_${message.guild.id}_${member.id}`, true);

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(
                        `<a:Tick:1306038825054896209>  | Successfully vc-banned <@${member.user.id}>. They are now muted in any voice channel they join.`
                    ),
            ],
        });

        try {
            await member.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(
                            `You have been **VC Banned** and cannot speak in any voice channel in **${message.guild.name}**.`
                        ),
                ],
            });
        } catch (err) {
            console.error(`Could not DM user: ${err.message}`);
        }
    },
};
