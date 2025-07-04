const { Message, Client, MessageEmbed } = require('discord.js');
const warnedUsers = new Map();

module.exports = {
    name: 'warnremove',
    aliases: ['removewarn'],
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

        const warningIndex = parseInt(args[1], 10);
        if (isNaN(warningIndex) || warningIndex < 1 || warningIndex > warnings.length) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293> | Please provide a valid warning number (1-${warnings.length}).`
                        )
                ]
            });
        }

        warnings.splice(warningIndex - 1, 1); 

        warnedUsers.set(user.id, warnings);

        const removeSuccessEmbed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(
                `<a:Tick:1306038825054896209> | Successfully removed **Warning #${warningIndex}** from **${user.tag}**.`
            );


        await message.channel.send({ embeds: [removeSuccessEmbed] });

        const removeDMMessage = new MessageEmbed()
            .setTitle(`A warning has been removed in ${message.guild.name}`)
            .setDescription(`**Warning #${warningIndex}** has been removed from your record.\n**Issued by:** ${message.author.tag}`)
            .setColor(client.color)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

        try {
            await user.send({ embeds: [removeDMMessage] });
        } catch (err) {
            console.error(`Could not send DM to ${user.tag}.`);
        }
    }
};

function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}
