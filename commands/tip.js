const Discord = require('discord.js')
const kafiumJS = require('kafiumJS')

module.exports = {
  command: 'tip',
	async execute(message, args, db, kafiApi) {
    if (!db.get(message.author.id)) return message.channel.send({ embeds: [errorEmbed('Please firstly create a wallet.')] })

    if (!args[0] || !args[1]) return message.channel.send({ embeds: [errorEmbed('Usage: ``?tip <@user> <amount>``')] })

    const user = message.mentions.users.first()
    if (user === undefined) return message.channel.send({ embeds: [errorEmbed('Please mention a valid user.')] })
    if (!db.get(user.id)) return message.channel.send({ embeds: [errorEmbed('Mentioned user must create a wallet first.')] })

    if (Math.sign(parseFloat(args[1])) !== 1 || message.author.id === user.id) return message.channel.send({ embeds: [errorEmbed('Invalid tip.')] })

    try {
      const tipBlock = new kafiumJS.block('TRANSFER', {
        sender: db.get(message.author.id).address,
        recipient: db.get(user.id).address,
        amount: (parseFloat(args[1]) * 1000000).toString()
      })

      await tipBlock.setPreviousBlock(kafiApi)
      tipBlock.computeWork()
      await tipBlock.sign(new kafiumJS.wallet(db.get(message.author.id).privKey))

      await kafiApi.announceBlock(tipBlock).catch(err => { message.channel.send({ embeds: [errorEmbed(err)] }) })

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