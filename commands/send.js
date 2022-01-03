const Discord = require('discord.js')

module.exports = {
  command: 'send',
	async execute(message, args, db, kafiApi) {
    if (!db.get(message.author.id)) return message.channel.send({ embeds: [errorEmbed('Please firstly create a wallet.')] })

    if (!args[0] || !args[1]) return message.channel.send({ embeds: [errorEmbed('Usage: ``?send <amount> <wallet>``')] })

    if (Math.sign(parseFloat(args[0])) !== 1 || db.get(message.author.id).address === args[1]) return message.channel.send({ embeds: [errorEmbed('Invalid tip.')] })

    try {
      const sendBlock = new kafiumJS.block('TRANSFER', {
        sender: db.get(message.author.id).address,
        recipient: args[1],
        amount: Math.floor(parseFloat(args[0]) * 1000000)
      })

      await sendBlock.setPreviousBlock(kafiApi)
      sendBlock.computeWork()
      await sendBlock.sign(new kafiumJS.wallet(db.get(message.author.id).privKey))

      await kafiApi.announceBlock(sendBlock).catch(err => { message.channel.send({ embeds: [errorEmbed(err)] }) })

      const tranEmbed = new Discord.MessageEmbed()
        .setTitle('Transaction announced!')
        .setColor('#1AAC7A')
        .addField(`**Hash:**`, `\`\`${tipBlock.calculateHash()}\`\``);
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
