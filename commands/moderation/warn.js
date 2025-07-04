const { Message, Client, MessageEmbed } = require('discord.js');
const warnedUsers = new Map(); 

module.exports = {
    name: 'warn',
    aliases: ['addwarn', 'warning'],
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

        if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I must have \`Manage Messages\` permissions to use this command.`
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

        let reason = args.slice(1).join(' ') || 'No reason provided.';
        reason = `${message.author.tag} (${message.author.id}) | ` + reason;

        const userNotFoundEmbed = new MessageEmbed()
            .setDescription(`<:emoji_1725906884992:1306038885293494293> | User not found.`)
            .setColor(client.color);

        if (user === undefined) return message.channel.send({ embeds: [userNotFoundEmbed] });

        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You cannot warn me!`
                        )
                ]
            });
        }


        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You cannot warn the server owner.`
                        )
                ]
            });
        }

        if (!client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than the user to warn them.`
                        )
                ]
            });
        }
        if (!warnedUsers.has(user.id)) {
            warnedUsers.set(user.id, []);
        }

        warnedUsers.get(user.id).push({
            reason: reason,
            warnedBy: message.author.tag,
            date: new Date()
        });

        const warnEmbed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `**Warning issued to ${user.tag}**\nReason: \`${reason}\`\nIssued by: ${message.author.tag}`
            )
            .setColor(client.color)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

        const warnMessage = await message.channel.send({ embeds: [warnEmbed] });

        const directMessage = new MessageEmbed()
            .setTitle(`You have been warned in ${message.guild.name}`)
            .setDescription(`**Reason:** \`${reason}\`\n**Issued by:** ${message.author.tag}`)
            .setColor(client.color)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

        try {
            await user.send({ embeds: [directMessage] });
        } catch (err) {
            console.error(`Could not send DM to ${user.tag}.`);
        }

        
        const successEmbed = new MessageEmbed()
            .setDescription(
                `<a:Tick:1306038825054896209> | Successfully warned **${user.tag}**.`
            )
            .setColor(client.color);
        
        const successMessage = await message.channel.send({ embeds: [successEmbed] });

        setTimeout(() => {
            successMessage.delete();
        }, 10000); 
    }
};

function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}
