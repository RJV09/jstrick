const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'stats',
    category: 'info',
    aliases: ['botinfo', 'bi', 'st'],
    description: 'Displays information about the bot.',
    premium: false,
    run: async (client, message, args) => {
        const uptime = Math.round(client.uptime / 1000);

        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;

        let guilds1 = client.guilds.cache.size;
        let member1 = client.guilds.cache.reduce((x, y) => x + y.memberCount, 0) + 1000000;

        let member = member1;
        if (member >= 1000 && member < 1000000)
            member = (member / 1000).toFixed(1) + 'k';
        else if (member >= 1000000)
            member = (member / 1000000).toFixed(1) + 'm';

        let guilds = guilds1;
        const totalUsers = client.users.cache.size;
        const latency = client.ws.ping;

        const totalRAM = os.totalmem() / (1024 * 1024 * 1024);
        const freeRAM = os.freemem() / (1024 * 1024 * 1024); 
        const usedRAM = totalRAM - freeRAM;

        const cpus = os.cpus();
        const cpuLoad = cpus.map(cpu => cpu.times);
        const totalCPUUsage = cpuLoad.reduce((total, cpu) => total + cpu.user + cpu.nice + cpu.sys, 0);
        const totalCPU = cpuLoad.reduce((total, cpu) => total + cpu.idle + cpu.user + cpu.nice + cpu.sys, 0);
        const cpuUsagePercent = ((totalCPUUsage / totalCPU) * 100).toFixed(2);

        const embedGeneral = new MessageEmbed()
            .setAuthor({
                    name: `${client.user.username} Information`,
                    iconURL: client.user.displayAvatarURL()
                })
            .setTitle('General Information')
            .setColor(client.color)
            .addField('Client', `
                Guilds: ${guilds}
                Users: ${member} (${totalUsers} Cached)
                Latency: ${latency} ms
                Online Since: ${days} day(s), ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s)
                Total Commands: ${client.commands.size}
                Shard Id: 1`)
            .addField('System', `
                Used RAM: ${usedRAM.toFixed(2)} GB
                CPU Usage: ${cpuUsagePercent}%`)
            .setFooter({
                        text: `Requested By ${message.author.tag}`,
                        iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`
                    })

        const embedTeam = new MessageEmbed()
            .setAuthor({
                    name: `${client.user.username} Information`,
                    iconURL: client.user.displayAvatarURL()
                })
            .setTitle('Team Information')
            .setColor(client.color)
            .addFields(
                { name: '<:files:1259107195677577298> Developers', value: `<:blank:1259104929981665280><:developer:1248587616794968065> [Adarsh](https://discord.com/users/760143551920078861)\n<:blank:1259104929981665280><:developer:1248587616794968065> [Unknown](https://discord.com/users/1034078615417131038)`, inline: false },
                { name: '<:files:1259107195677577298> Owners', value: `<:blank:1259104929981665280><a:owner:1242145791599186030> - [ReXx](https://discord.com/users/1034079960824033300)\n<:blank:1259104929981665280><a:owner:1242145791599186030> - [Piyush](https://discord.com/users/798598896099262474)\n<:blank:1259104929981665280><a:owner:1242145791599186030> - [Gauuतम](https://discord.com/users/1200749507307114568)`, inline: false },
                { name: '<:files:1259107195677577298> Manager', value: `<:blank:1259104929981665280><:manager:1259106642704859227> [Ayush](https://discord.com/users/737954552787107841)\n<:blank:1259104929981665280><:manager:1259106642704859227> [Maxado](https://discord.com/users/1212201738279329822)\n<:blank:1259104929981665280><:manager:1259106642704859227> [Shubbu](https://discord.com/users/965487712192843816)`, inline: false }
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({
                text: `Requested By ${message.author.tag}`,
                iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`
            })

        const systemInfoButton = new MessageButton()
            .setCustomId('system_info')
            .setLabel('General Info')
            .setStyle('SECONDARY');

        const teamInfoButton = new MessageButton()
            .setCustomId('team_info')
            .setLabel('Team Info')
            .setStyle('SECONDARY');

        const row = new MessageActionRow()
            .addComponents(systemInfoButton, teamInfoButton);

        const msg = await message.channel.send({ embeds: [embedGeneral], components: [row] });

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'system_info') {
                await interaction.update({ embeds: [embedGeneral], components: [row] });
            } else if (interaction.customId === 'team_info') {
                await interaction.update({ embeds: [embedTeam], components: [row] });
            }
        });

        collector.on('end', () => {
            row.components.forEach(component => component.setDisabled(true));
            msg.edit({ components: [row] });
        });
    }
};