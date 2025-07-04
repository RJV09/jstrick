const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'j2csetup',
    description: 'Sets up the Fire Temp Voice category and channels.',
    category: 'j2c',
    premium: false,
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('You need `Manage Channels` permission to use this command.')
                ]
            });
        }

        let category = await message.guild.channels.create('Fire Temp Voice', {
            type: 'GUILD_CATEGORY',
        });

        const controlChannel = await message.guild.channels.create('Fire-control', {
            type: 'GUILD_TEXT',
            parent: category.id,
        });

        const joinChannel = await message.guild.channels.create('Join to Create', {
            type: 'GUILD_VOICE',
            parent: category.id,
            userLimit: 2,
        });

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription('Setup complete! Use the "Join to Create" channel to dynamically create temporary voice channels.')
            ]
        });

        const embed = new MessageEmbed()
        .setColor('YELLOW')
        .setTitle('Fire Interface') 
        .setDescription('You can use this interface to manage your voice channel.')
        .setThumbnail(client.user.displayAvatarURL()) 
        .setImage('https://media.discordapp.net/attachments/1335042757261267035/1335046656026214481/Rename_2.png?ex=679ebe96&is=679d6d16&hm=a16b36b5c307d108168a4de83193de1adff63ca995a8a30cb7c0a87ed09910b8&=&format=webp&quality=lossless') 
        .setFooter(`Use the buttons below to manage your voice channel`)
        .setAuthor(client.user.username, client.user.displayAvatarURL()); 
    
    const row1 = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('lock')
            .setEmoji('<:crvt:1335029664917356574>') 
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('unlock')
            .setEmoji('<:crvt:1335029662413361236>') 
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('hide')
            .setEmoji('<:crvt:1335029658487619614>') 
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('unhide')
            .setEmoji('<:crvt:1335029660895023164>')
            .setStyle('SECONDARY')
    );

        const row2 = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('rename')
                .setEmoji('<:crvt:1335029656214175776>') 
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('limit')
                .setEmoji('<:crvt:1335030110478139453>') 
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('region')
                .setEmoji('<:crvt:1335030108796354561>') 
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('bitrate')
                .setEmoji('<:crvt:1335030107072364647>') 
                .setStyle('SECONDARY')
        );

        const row3 = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('mute')
                .setEmoji('<:crvt:1335029650585419777>') 
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('unmute')
                .setEmoji('<:crvt:1335029647888486400>') 
                .setStyle('SECONDARY'),
        );

        await controlChannel.send({
            embeds: [embed],
            components: [row1, row2, row3,]
        });

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;

            const member = interaction.member;
            const voiceChannel = member.voice.channel;

            if (!voiceChannel) {
                return interaction.reply({
                    content: 'You need to be in a voice channel to use this action.',
                    ephemeral: true,
                });
            }

            switch (interaction.customId) {
                case 'lock':
                    await voiceChannel.permissionOverwrites.edit(
                        message.guild.roles.everyone,
                        { CONNECT: false }
                    );
                    interaction.reply({ content: `🔒 Locked ${voiceChannel.name}`, ephemeral: true });
                    break;

                case 'unlock':
                    await voiceChannel.permissionOverwrites.edit(
                        message.guild.roles.everyone,
                        { CONNECT: true }
                    );
                    interaction.reply({ content: `🔓 Unlocked ${voiceChannel.name}`, ephemeral: true });
                    break;

                case 'hide':
                    await voiceChannel.permissionOverwrites.edit(
                        message.guild.roles.everyone,
                        { VIEW_CHANNEL: false }
                    );
                    interaction.reply({ content: `🙈 Hidden ${voiceChannel.name}`, ephemeral: true });
                    break;

                case 'unhide':
                    await voiceChannel.permissionOverwrites.edit(
                        message.guild.roles.everyone,
                        { VIEW_CHANNEL: true }
                    );
                    interaction.reply({ content: `👀 Unhid ${voiceChannel.name}`, ephemeral: true });
                    break;

                case 'rename':
                    const renameMessage = await interaction.reply({
                        content: 'Please enter a new name for your channel:',
                        ephemeral: true,
                        fetchReply: true,
                    });

                    const filter = (msg) => msg.author.id === interaction.user.id;
                    const collected = await controlChannel.awaitMessages({
                        filter,
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    }).catch(() => null);

                    if (collected && collected.first()) {
                        const newName = collected.first().content;
                        await voiceChannel.setName(newName);
                        interaction.followUp({ content: `✅ Renamed channel to ${newName}`, ephemeral: true });
                        collected.first().delete();
                    } else {
                        interaction.followUp({ content: '⏳ Time ran out! Please try renaming again.', ephemeral: true });
                    }
                    break;

                case 'limit':
                    const limitMessage = await interaction.reply({
                        content: 'Please enter the new user limit for the channel:',
                        ephemeral: true,
                        fetchReply: true,
                    });

                    const limitFilter = (msg) => msg.author.id === interaction.user.id;
                    const limitCollected = await controlChannel.awaitMessages({
                        filter: limitFilter,
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    }).catch(() => null);

                    if (limitCollected && limitCollected.first()) {
                        const newLimit = parseInt(limitCollected.first().content);
                        if (isNaN(newLimit) || newLimit <= 0) {
                            return interaction.followUp({ content: '❌ Invalid limit!', ephemeral: true });
                        }

                        await voiceChannel.setUserLimit(newLimit);
                        interaction.followUp({ content: `✅ User limit updated to ${newLimit}`, ephemeral: true });
                        limitCollected.first().delete();
                    } else {
                        interaction.followUp({ content: '⏳ Time ran out! Please try updating the limit again.', ephemeral: true });
                    }
                    break;

                case 'region':
                    const regionMessage = await interaction.reply({
                        content: 'Please enter the new region for the voice channel:',
                        ephemeral: true,
                        fetchReply: true,
                    });

                    const regionFilter = (msg) => msg.author.id === interaction.user.id;
                    const regionCollected = await controlChannel.awaitMessages({
                        filter: regionFilter,
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    }).catch(() => null);

                    if (regionCollected && regionCollected.first()) {
                        const newRegion = regionCollected.first().content;
                        await voiceChannel.setRTCRegion(newRegion);
                        interaction.followUp({ content: `✅ Region changed to ${newRegion}`, ephemeral: true });
                        regionCollected.first().delete();
                    } else {
                        interaction.followUp({ content: '⏳ Time ran out! Please try changing the region again.', ephemeral: true });
                    }
                    break;

                case 'bitrate':
                    const bitrateMessage = await interaction.reply({
                        content: 'Please enter the new bitrate for the voice channel (in kbps):',
                        ephemeral: true,
                        fetchReply: true,
                    });

                    const bitrateFilter = (msg) => msg.author.id === interaction.user.id;
                    const bitrateCollected = await controlChannel.awaitMessages({
                        filter: bitrateFilter,
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    }).catch(() => null);

                    if (bitrateCollected && bitrateCollected.first()) {
                        const newBitrate = parseInt(bitrateCollected.first().content);
                        if (isNaN(newBitrate) || newBitrate < 8 || newBitrate > 128) {
                            return interaction.followUp({ content: '❌ Invalid bitrate value!', ephemeral: true });
                        }

                        await voiceChannel.setBitrate(newBitrate * 1000); 
                        interaction.followUp({ content: `✅ Bitrate updated to ${newBitrate} kbps`, ephemeral: true });
                        bitrateCollected.first().delete();
                    } else {
                        interaction.followUp({ content: '⏳ Time ran out! Please try changing the bitrate again.', ephemeral: true });
                    }
                    break;

                case 'mute':
                    const memberToMute = voiceChannel.members.get(interaction.user.id);
                    if (memberToMute) {
                        await memberToMute.voice.setMute(true);
                        interaction.reply({ content: `✅ ${memberToMute.user.username} muted!`, ephemeral: true });
                    } else {
                        interaction.reply({ content: '❌ User not in the channel!', ephemeral: true });
                    }
                    break;

                case 'unmute':
                    const memberToUnmute = voiceChannel.members.get(interaction.user.id);
                    if (memberToUnmute) {
                        await memberToUnmute.voice.setMute(false);
                        interaction.reply({ content: `✅ ${memberToUnmute.user.username} unmuted!`, ephemeral: true });
                    } else {
                        interaction.reply({ content: '❌ User not in the channel!', ephemeral: true });
                    }
                    break;
            }
        });

        client.on('voiceStateUpdate', async (oldState, newState) => {
            if (newState.channelId === joinChannel.id) {
                const tempChannel = await newState.guild.channels.create(
                    `${newState.member.user.username}'s Channel`,
                    {
                        type: 'GUILD_VOICE',
                        parent: category.id,
                        userLimit: 2,
                    }
                );

                await newState.member.voice.setChannel(tempChannel);

                const interval = setInterval(async () => {
                    if (tempChannel.members.size === 0) {
                        clearInterval(interval);
                        await tempChannel.delete();
                    }
                }, 5000);
            }
        });
    },
};
