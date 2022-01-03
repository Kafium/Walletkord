const Discord = require('discord.js')
const kafiumJS = require('kafiumjs')

module.exports = {
  command: 'faucet',
	async execute(message, args, db, kafiApi, client) {
    if (message.channel.id !== '869707781798772807') return
    if (!db.get(message.author.id)) return message.channel.send({ embeds: [errorEmbed('Please firstly create a wallet.')] })

    try {
      const sendBlock = new kafiumJS.block('TRANSFER', {
        sender: db.get(client.user.id).address,
        recipient: db.get(message.author.id).address,
        amount: 10 * 1000000
      })

      await sendBlock.setPreviousBlock(kafiApi)
      sendBlock.computeWork()
      await sendBlock.sign(new kafiumJS.wallet(db.get(client.user.id).privKey))

      await kafiApi.announceBlock(sendBlock).catch(err => { message.channel.send({ embeds: [errorEmbed(err)] }) })

      const tranEmbed = new Discord.MessageEmbed()
        .setTitle('Transaction announced!')
        .setColor('#1AAC7A')
        .addField(`**Hash:**`, `\`\`${sendBlock.calculateHash()}\`\``);
      message.channel.send({ embeds: [tranEmbed] })
    } catch(err) {
      message.channel.send({ embeds: [errorEmbed(err.stack)] })
    }
	},
}

function errorEmbed(reason) {
  const errorEmbed = new Discord.MessageEmbed()
    .setTitle('Error')
    .setColor('#D22B2B')
    .setDescription(reason);
  return errorEmbed
}