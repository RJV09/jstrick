const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'profile',
    aliases: ['badge', 'badges', 'achievement', 'pr'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const user =
            message.mentions.users.first() ||
            client.users.cache.get(args[0]) ||
            message.author

        const destroyer = user.id === '760143551920078861' ? true : false
        let badges = ''

        const guild = await client.guilds.fetch('1306042445812731914')

        const sus = await guild.members.fetch(user.id).catch((e) => {
            if (user) badges = badges
            else badges = '`No Badge Available`'
        })

        if (destroyer === true || user.id === '760143551920078861')
            badges =
                badges +
                `\n<a:emoji_1725906997325:1306042477282590771>・**[Trick](https://discord.com/users/760143551920078861)**`

        try {
            const dev = sus.roles.cache.has('1291097238336049194')
            if (dev === true)
                badges =
                    badges +
                    `\n<a:dev:1291433691037565008>・**Developer**`

            const own = sus.roles.cache.has('1291098211305521195')
            if (own === true)
                badges = badges + `\n<a:oz:1291416157114339482>・**Owner**`

            const han = sus.roles.cache.has('1291098239524933734')
            if (han === true)
                badges = badges + `\n<a:admin:1291442363138572318>・**Admin**`

            const manager = sus.roles.cache.has('1291098300820361277')
            if (manager === true)
                badges = badges + `\n<:mog:1291443886203605054>・**Mod**`

            const aman = sus.roles.cache.has('1291098366037594132')
            if (aman === true)
                badges =
                    badges + `\n<a:sup:1291440696355459193>>・**Support Team**`

            const hundi = sus.roles.cache.has('1291098413257199727')
            if (hundi === true)
                badges =
                    badges +
                    `\n<:bughunter:1291433689120509952>・**Bug Hunter**`

            const supp = sus.roles.cache.has('1291098456529571940')
            if (supp === true)
                badges =
                    badges +
                    `\n<a:pre:1291441311714643999>・**Premium User**`

            const fr = sus.roles.cache.has('1291098499697606676')
            if (fr === true)
                badges =
                    badges + `\n<:friend:1291433693893890068>・**Friends**`
        } catch (err) {
            if (badges) {
                badges = ''
                badges = badges
            } else if (badges === '') badges = '`No Badge Available`'
        }

        const pr = new MessageEmbed()
            .setAuthor(
                `Profile For ${user.username}#${user.discriminator}`,
                client.user.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTimestamp()
            .setDescription(`**BADGES** <a:bz:1291425807004209173>
  ${badges ? badges : '`No Badge Available`'}`)
        message.channel.send({ embeds: [pr] })
    }
}