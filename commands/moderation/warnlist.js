const { Message, Client, MessageEmbed } = require('discord.js');
const warnedUsers = new Map();

module.exports = {
    name: 'warnlist',
    aliases: ['warnings'],
    category: 'mod',
    premium: false,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Messages\` permissions to use this command.`
                        )
                ]
            });
        }

        let user = await getUserFromMention(message, args[0]);
        if (!user) {
            try {
                user = await client.users.fetch(args[0]);
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | Please provide a valid user ID or mention a member.`
                            )
                    ]
                });
            }
        }

        const userNotFoundEmbed = new MessageEmbed()
            .setDescription(`<:emoji_1725906884992:1306038885293494293> | User not found.`)
            .setColor(client.color);

        if (user === undefined) return message.channel.send({ embeds: [userNotFoundEmbed] });


        const warnings = warnedUsers.get(user.id);

        if (!warnings || warnings.length === 0) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`<:emoji_1725906884992:1306038885293494293> | **${user.tag}** has no warnings.`)
                ]
            });
        }

        const warnListEmbed = new MessageEmbed()
            .setTitle(`Warning List for ${user.tag}`)
            .setColor(client.color)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setDescription(warnings.map((warn, index) => {
                return `**Warning #${index + 1}:**\n- **Reason:** ${warn.reason}\n- **Issued by:** ${warn.warnedBy}\n- **Date:** ${warn.date.toLocaleString()}\n`;
            }).join('\n'));

        return message.channel.send({ embeds: [warnListEmbed] });
    }
};

function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}
