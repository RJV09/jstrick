const wait = require('wait')
require('dotenv').config()
require('module-alias/register')
const path = require('path')
const Trick = require(`./structures/Trick.js`)
const client = new Trick()
this.config = require(`./config.json`)
const fs = require('fs');
const vcbanHandler = require('./events/vcbanHandler');
client.on('voiceStateUpdate', (oldState, newState) => vcbanHandler(client, oldState, newState));

client.on('messageCreate', (message) => {
    if (message.content.startsWith('!addblockword')) {
        addBlockWordCommand.run(client, message, message.content.slice(15).trim().split(/\s+/));
    }
});

client.on('messageCreate', async (message) => {

    const MentionEveryoneHandler = require('./events/MentionEveryone.js');
    await MentionEveryoneHandler(client, message);
});
require('./events/voiceStateUpdate.js')(client);
require('./events/blockwords')
require('./events/quickadmin')(client);
const autoResponderFilePath = path.join(__dirname, './commands/autoresponder/autoresponders.json');

function loadAutoresponders() {
    try {
        if (fs.existsSync(autoResponderFilePath)) {
            const rawData = fs.readFileSync(autoResponderFilePath);
            const autoresponders = JSON.parse(rawData);

            for (let serverId in autoresponders) {
                autoresponders[serverId].forEach(ar => {
                    if (typeof ar.keyword !== 'string') {
                        console.error(`Autoresponder keyword for server ${serverId} is not a string.`);
                    }
                });
            }

            return autoresponders;
        } else {
            return {};
        }
    } catch (error) {
        console.error('Error loading autoresponders:', error);
        return {}; 
    }
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const autoresponders = loadAutoresponders();

  if (!autoresponders[message.guild.id]) return;
  
  const messageContent = typeof message.content === 'string' ? message.content.toLowerCase() : '';
  for (const ar of autoresponders[message.guild.id]) {
      const keyword = ar.keyword.toLowerCase();

      if (typeof message.content === 'string' && message.content.toLowerCase().includes(keyword)) {
          message.reply(ar.response);
          break; 
      }
      
  }
});
client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot) return;

        const autoresponders = loadAutoresponders();

        if (!autoresponders[message.guild.id]) return;

        const messageContent = typeof message.content === 'string' ? message.content.toLowerCase() : '';
        
        for (const ar of autoresponders[message.guild.id]) {
            const keyword = ar.keyword.toLowerCase();

        }
    } catch (error) {
        console.error('Error in message handler:', error);
    }
});

client.db = {};
async function initializeMongoose() {
    console.log('Initializing Mongoose...');
    await client.initializeMongoose()
    console.log('Mongoose initialized');
}

async function initializeData() {
    console.log('Initializing data...');
    await client.initializedata()
    console.log('Data initialized');
}

async function waitThreeSeconds() {
    console.log('Waiting for 3 seconds...');
    await wait(3000);
    console.log('Wait completed');
}

async function loadEvents() {
    console.log('Loading events...');
    await client.loadEvents()
    console.log('Events loaded');
}

async function loadLogs() {
    console.log('Loading logs...');
    await client.loadlogs()
    console.log('Logs loaded');
}

async function loadMain() {
    console.log('Loading main...');
    await client.loadMain()
    console.log('Main loaded');
}

async function loginBot() {
    console.log('Logging in...');
    const settings = require('./config.json')
    await client.login(settings.TOKEN)
    console.log('Logged in');
}

async function main() {
    try {
        await initializeMongoose()
        await initializeData()
        await waitThreeSeconds()
        await loadEvents()
        await loadLogs()
        await loadMain()
        await loginBot()
    } catch (error) {
        console.error('Error:', error);
    }
}

main()