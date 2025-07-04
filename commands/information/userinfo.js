const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
    name: "userinfo",
    aliases: ['ui', 'whois'],
    category: 'info',
    description: "Get information about a user",
    run: async (client, message, args) => {
        const permissions = {
            "ADMINISTRATOR": "Administrator",
            "MANAGE_GUILD": "Manage Server",
            "MANAGE_ROLES": "Manage Roles",
            "MANAGE_CHANNELS": "Manage Channels",
            "KICK_MEMBERS": "Kick Members",
            "BAN_MEMBERS": "Ban Members",
            "MANAGE_NICKNAMES": "Manage Nicknames",
            "MANAGE_EMOJIS": "Manage Emojis",
            "MANAGE_WEBHOOKS": "Manage Webhooks",
            "MANAGE_MESSAGES": "Manage Messages",
            "MENTION_EVERYONE": "Mention Everyone"
        };

        let mention = await getUserFromMention(message, args[0]);

        if (!mention) {
          try {
            mention = await client.users.fetch(args[0])
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Please Provide Valid user ID or Mention Member.`
                        )
                ]
            })
        }
        }

        const nick = mention.nickname || "None";
        const usericon = mention.displayAvatarURL({ dynamic: true });

        const mentionPermissions = mention.permissions.toArray();
        const finalPermissions = mentionPermissions.map(permission => permissions[permission]).filter(Boolean);

        const flags = {
            "DISCORD_EMPLOYEE": "<:emoji_1725940261022:1306040254909644800>",
            "DISCORD_PARTNER": "<:emoji_1725940659651:1306050588152168498>",
            "BUGHUNTER_LEVEL_1": "<:Trick_badges:1309594344608632922>",
            "BUGHUNTER_LEVEL_2": "<:Trick_badges:1309594344608632922>",
            "HYPESQUAD_EVENTS": "<:Trick_badges:1309594344608632922>",
            "HOUSE_BRILLIANCE": "<:Trick_badges:1309594344608632922>",
            "HOUSE_BRAVERY": "<:ares_bitcoin:1309590911113756787>",
            "HOUSE_BALANCE": "<:ares_bitcoin:1309590911113756787>",
            "EARLY_SUPPORTER": "<:Trick_developer:1309591258343145492>",
            "TEAM_USER": "<:Trick_developer:1309591258343145492>",
            "VERIFIED_BOT": "<:Trick_developer:1309591258343145492>",
            "EARLY_VERIFIED_DEVELOPER": "<:Trick_developer:1309591258343145492>"
        };

        const userFlags = mention.flags.toArray();

        const topRole = mention.roles.highest;

        const isMemberInServer = message.guild.members.cache.has(mention.id);

        const userlol = new MessageEmbed()
            .setAuthor(`${mention.username}'s Information`, usericon)
            .setThumbnail(usericon)
            .addField(`General Information`,
                `Name: \`${mention.username}#${mention.discriminator}\`\n` +
                `Nickname: \`${nick}\`\n\n`
            )
            .addField(`Overview`,
                `Badges: ${userFlags.length ? userFlags.map(flag => flags[flag]).join(' ') : 'None'}\n` +
                `Type: ${mention.bot ? 'Bot' : 'Human'}\n\n`
            );

        if (isMemberInServer) {
            userlol.addField(`Server Related Information`,
                `Top Role: ${topRole}\n` +
                `Roles: ${mention.roles.cache.size > 1 ? mention.roles.cache.filter(r => r.name !== '@everyone').map(role => role).join(', ') : 'None'}\n` +
                `Key Permissions: ${finalPermissions.length ? finalPermissions.map(permission => `\`${permission}\``).join(', ') : 'None'}\n\n`
            );
        } else {
            userlol.addField(`Misc Information`,
                `Created On: ${moment(mention.createdTimestamp).format('llll')}\n` +
                `This user is not in this server.\n\n`
            );
        }

        userlol.setColor(client.color)
            .setFooter(`Requested By: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [userlol] });
    }
};

function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}
