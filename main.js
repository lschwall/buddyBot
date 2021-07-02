require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const botInfo = new Discord.MessageEmbed()
          .setTitle(`OFFICIAL BUDDY COMMANDS`)
          .setColor('#00ffe5')
          .setDescription(`Official commands for buddyBot. Created by Larry.\n Repo: https://github.com/lschwall/buddyBot\n `)
          .addField(`**GENERAL COMMANDS**`, `1. __*!buddy*__ : list of commands \n2. __*!romansaid <quote>*__ : add quote from roman\n3. __*!randomroman*__ : gives random roman quote\n`)

let quoteArr = [];
let prefix = '!';

client.on('ready', connection => {
          console.log('bot online')

})

client.on('message', msg => {
          const channel = msg.channel.id
          const [command, ...args] = msg.content.split(' ');

          if (!msg.content.startsWith('!') || msg.author.bot) return;

          if (msg.content.toLowerCase().startsWith(prefix + 'buddy')) {
                    if (msg.author.bot) {
                              return;
                    } else {
                              msg.channel.send(botInfo)
                    }
          }
          if (channel === '860330287329574923') {
                    if (command === '!romansaid') {
                              let quote = args.toString();
                              quoteArr.push(quote)
                    }

                    if (command === '!randomroman') {
                              let max = quoteArr.length
                              let r = Math.floor(Math.random() * max)
                              r === 0 ? msg.reply(`No quotes found`) : msg.reply(`Your random Roman quote: "${quoteArr[r]}"`)
                    }
          } else {
                    if (command === '!romansaid') {
                              msg.author.bot ? null : msg.reply(`Please place in ${msg.guild.channels.cache.find(channel => channel.name === 'roman_justroman')}`)
                    }
          }
});

client.login(process.env.TOKEN)