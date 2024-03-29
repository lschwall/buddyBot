const bot = () => {

    const pagination = require('discord.js-pagination');
    const Discord = require('discord.js');
    const client = new Discord.Client()
    const axios = require('axios')
    const cron = require('cron')
    require('dotenv').config()

    const host = 'http://localhost:3000'
    let patCounter = 0;
    let prefix = '!';



    client.on('ready', connection => {
        console.log('bot online')

    })

    const job = new cron.CronJob('0 0 8 * * *', async () => {
        console.log('calling cron')
        const channel = client.channels.cache.get(`${process.env.SALTY_SNAILS}`);
        await axios.get(`${host}/quote/find`)
        .then(({ data }) => {
            channel.send(`Roman's Daily Affirmation: ${data}`)
        })
        .catch(err => console.error(err))
    })

    job.start()

    client.on('message', msg => {
        const channel = msg.channel.id

        if (msg.content.toLowerCase().startsWith(prefix + 'patbuddy')) {
            patCounter++;
            msg.reply(`Buddy smiles and wags his tail! He's been pat ${patCounter > 1 ? patCounter + ' times' : patCounter + ' time'}`)
        }

        if (msg.content.toLowerCase().startsWith(prefix + 'buddy')) {
            if (msg.author.bot) {
                return;
            } else {
                const botInfo = new Discord.MessageEmbed()
                    .setTitle(`OFFICIAL BUDDY COMMANDS`)
                    .setColor('#00ffe5')
                    .setDescription(`Official commands for buddyBot. Created by Larry.\n\n *Pat Counter: ${patCounter}*`)
                    .addField(`**GENERAL COMMANDS**`, `1. __*!buddy*__ : list of commands and see number of pats \n2. __*!romansaid <quote>*__ : add quote from roman\n3. __*!randomroman*__ : gives random roman quote\n4. __*!romanreport*__ : lists all of the previous roman quotes\n5. __*!patbuddy*__ : give buddyBot a pat to make him happy!`)
                msg.channel.send(botInfo)
            }
        }
        if (channel === process.env.SALTY_SNAILS) {

            if (msg.content.toLowerCase().startsWith(prefix + 'romansaid')) {
                const [command, ...args] = msg.content.split('!romansaid ');
                let quote = args.toString()
                if (args.length > 0) {
                    axios.post(`${host}/quote/create?quote=${encodeURI(quote)}`)
                        .then(msg.reply(`thanks for adding`))
                        .catch(err => { console.error(err) })
                } else {
                    msg.reply('Please add a quote')
                }
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
                            const run = async (message) => {
                                const MAX_FIELDS = 25;
                                // iterate over the commands and create field objects
                                const fields = message.map(i => ({ name: '___', value: `${i.quote}` }))

                                // if there is less than 25 fields, you can safely send the embed
                                // in a single message
                                if (fields.length <= MAX_FIELDS)
                                    return message.reply(
                                        new Discord.MessageEmbed()
                                            .setTitle('Help')
                                            .setDescription(`Prefix: ${prefix}`)
                                            .addFields(fields),
                                    );

                                // if there are more, you need to create chunks w/ max 25 fields
                                const chunks = chunkify(fields, MAX_FIELDS);
                                // an array of embeds used by `discord.js-pagination`
                                const pages = [];

                                chunks.forEach((chunk) => {
                                    // create a new embed for each 25 fields
                                    pages.push(
                                        new Discord.MessageEmbed()
                                            .setTitle(`Roman's Quotes`)
                                            .setColor('#00ffe5')
                                            .setDescription(`|<><><><><><><><><><><><><><><><><><><><><><><><><>|`)
                                            .addFields(chunk),
                                    );
                                });
                                pagination(msg, pages);
                            }
                            function chunkify(arr, len) {
                                let chunks = [];
                                let i = 0;
                                let n = arr.length;

                                while (i < n) {
                                    chunks.push(arr.slice(i, (i += len)));
                                }

                                return chunks;
                            }
                            run(data);

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
}

module.exports = { bot }
