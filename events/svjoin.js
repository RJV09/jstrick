const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js'); 

const joinChannelId = '1306096143402532926';
const leaveChannelId = '1306096330589995039'; 

const createEmbedMessage = (guild, owner, type) => {
    let title, description, color;
    if (type === 'join') {
        title = `Hello ${owner.user.username}!`;
        description = `
            **Thank you for choosing Fire!**
            Fire has been successfully added to ${guild.name}

            You can report any issues at my [Support Server](https://discord.gg/rfzop) following the needed steps. You can also reach out to my Developers if you want to know more about me.

            <a:emoji_1725906973559:1306048925907681310> Fire is love
        `;
        color = 'BLACK';
    } else if (type === 'leave') {
        title = `Fire Removed From Your ${guild.name}!`;
        description = `
            It seems my time in your server, **${guild.name}**, has come to an end.

            If this was a mistake, you can easily reinvite me by clicking the Invite button below. I would also appreciate any feedback you could provide to my developer. Your input will help me improve and serve you better in the future.

            <a:emoji_1725906973559:1306048925907681310> Fire Is Love
        `;
        color = 'BLACK';
    }

    return new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));
};

const createActionRow = () => {
    return new MessageActionRow().addComponents(
        new MessageButton()
            .setLabel("Support")
            .setStyle('LINK')
            .setEmoji("1104994194856103966")
            .setURL("https://discord.gg/rfzop"),
        new MessageButton()
            .setLabel("Invite")
            .setStyle('LINK')
            .setEmoji("1167860474147250267")
            .setURL(
                `https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&scope=bot%20applications.commands`
            )
    );
};

module.exports = async (client) => {

    client.on('guildCreate', async (guild) => {
        try {

            const owner = await guild.fetchOwner();

            const embed = createEmbedMessage(guild, owner, 'join');
            const row = createActionRow();
            await owner.send({ embeds: [embed], components: [row] });

            console.log(`Sent a welcome DM to ${owner.user.tag} for adding the bot to ${guild.name}`);

            const joinChannel = await client.channels.fetch(joinChannelId);
            const joinEmbed = new MessageEmbed()
                .setTitle(`Bot Added to New Server: ${guild.name}`)
                .setDescription(`
                    **Server Info:**
                    - **ID**: ${guild.id}
                    - **Members**: ${guild.memberCount}
                    - **Created At**: <t:${Math.round(guild.createdTimestamp / 1000)}:R>

                    **Owner**: ${owner.user.tag} (${owner.id})
                `)
                .setColor('GREEN')
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));

            await joinChannel.send({ embeds: [joinEmbed] });
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    });

    client.on('guildDelete', async (guild) => {
        try {

            const owner = await guild.fetchOwner();

            const leaveEmbedOwner = createEmbedMessage(guild, owner, 'leave');
            const row = createActionRow();
            await owner.send({ embeds: [leaveEmbedOwner], components: [row] });

            console.log(`Sent a goodbye DM to ${owner.user.tag} for removing the bot from ${guild.name}`);

            const leaveChannel = await client.channels.fetch(leaveChannelId);
            const leaveEmbedChannel = new MessageEmbed()
                .setTitle(`Bot Left Server: ${guild.name}`)
                .setDescription(`
                    **Server Info:**
                    - **ID**: ${guild.id}
                    - **Members**: ${guild.memberCount}
                    - **Created At**: <t:${Math.round(guild.createdTimestamp / 1000)}:R>
                `)
                .setColor('RED')
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));

            await leaveChannel.send({ embeds: [leaveEmbedChannel] });
        } catch (error) {
            console.error('Error sending goodbye message:', error);
        }
    });
};