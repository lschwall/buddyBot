const axios = require('axios')
require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client()


const botInfo = new Discord.MessageEmbed()
    .setTitle(`OFFICIAL BUDDY COMMANDS`)
    .setColor('#00ffe5')
    .setDescription(`Official commands for buddyBot. Created by Larry.\n Repo: https://github.com/lschwall/buddyBot\n `)
    .addField(`**GENERAL COMMANDS**`, `1. __*!buddy*__ : list of commands \n2. __*!romansaid <quote>*__ : add quote from roman\n3. __*!randomroman*__ : gives random roman quote\n4. __*!romanreport*__ : lists all of the previous roman quotes`)
const host = 'http://localhost:3000'
let prefix = '!';
let channelID = '724090833128914965';
let counter = 0;



client.on('ready', connection => {
    console.log('bot online')

})

client.on('message', msg => {
    const channel = msg.channel.id
    if (msg.content.toLowerCase().startsWith(prefix + 'buddy')) {
        if (msg.author.bot) {
            return;
        } else {
            msg.channel.send(botInfo)
        }
    }
    if (channel === '861210684796960778') {
        if (msg.content.toLowerCase().startsWith(prefix + 'romansaid')) {
            const [command, ...args] = msg.content.split('!romansaid ');
            let quote = args.toString()
            axios.post(`${host}/quote/create?quote=${encodeURI(quote)}`)
                .then(msg.reply(`thanks for adding`))
                .catch(err => { console.error(err) })
        }

        if (msg.content.toLowerCase().startsWith(prefix + 'randomroman')) {
            axios.get(`${host}/quote/find`)
                .then(({ data }) => {
                    msg.reply(`Your random Roman quote: ${data}`)
                })
                .catch(err => console.error(err))
        }

        if (msg.content.toLowerCase().startsWith(prefix + 'romanreport')) {
            axios.get(`${host}/quote`)
                .then(({ data }) => {
                    if (data.length > 0) {
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`Roman's Quotes`)
                            .setDescription(`|<><><><><><><><><><><><><><><><><><><><><><><><><>|`)
                            .setColor('#00ffe5')
                            .setFooter("|<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>|")
                        data.map(i => embed.addField(`${i.quote}`, `______________`))
                        msg.reply(embed)
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`Roman's Quotes`)
                            .setDescription(`|<><><><><><><><><><><><><><><><><><><><><><><><><>|`)
                            .setColor('#00ffe5')
                            .setFooter("|<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>|")
                        msg.reply(embed)
                    }
                })
                .catch(err => console.error(err))
        }
    } else {
        if (msg.content.toLowerCase().startsWith(prefix + 'romansaid')) {
            msg.author.bot ? null : msg.reply(`Please place in ${msg.guild.channels.cache.find(channel => channel.name === 'roman_justroman')}`)
        }
    }
});

client.login(process.env.TOKEN)