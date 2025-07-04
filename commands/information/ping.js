const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose'); 

module.exports = {
    name: 'ping',
    aliases: [],
    category: 'info',
    premium: false,
    usage: 'ping',
    run: async (client, message, args) => {
        
        const msg = await message.channel.send('<a:loading_icon:1259759178575118408> **Pinging...** ');

        
        const wsLatency = client.ws.ping;

        
        const messageLatency = msg.createdTimestamp - message.createdTimestamp;

        
        const startDb = Date.now();
        await mongoose.connection.db.admin().ping();
        const dbLatency = Date.now() - startDb;

        
        const nodeLatency = process.hrtime()[1] / 1000000;

        
        const embed = new MessageEmbed()
            .setColor('#000000')
            .setTitle('Bot Latencies')
            .addField('<:narrow:1240150985326858291> **Database Latency**', `${dbLatency}ms`, false)
            .addField('<:narrow:1240150985326858291> **WebSocket Latency**', `${wsLatency}ms`, false)
            .addField('<:narrow:1240150985326858291> **Message Latency**', `${messageLatency}ms`, false)
            .addField('<:narrow:1240150985326858291> **Node.js Latency**', `${nodeLatency.toFixed(2)}ms`, false)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

        msg.edit({ content: null, embeds: [embed] });
    },
};
