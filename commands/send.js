const Discord = require('discord.js')

module.exports = {
  command: 'send',
	execute(message, args, db, walletSocket) {
    if (!db.get(message.author.id)) return message.channel.send({ embeds: [errorEmbed('Please firstly create a wallet.')] })

    if (!args[0] || !args[1]) return message.channel.send({ embeds: [errorEmbed('Usage: ``?send <amount> <wallet>``')] })

    walletSocket.signTransaction(db.get(message.author.id).privKey, args[1], (parseFloat(args[0]) * 10000)).then(block => {
        walletSocket.bcTransactionBlock(block.data).then(() => {
            const tranEmbed = new Discord.MessageEmbed()
            .setTitle('Transaction broadcasted successfully!')
            .setColor('#1AAC7A')
            .addField(`**Hash:**`, `\`\`${block.hash}\`\``);
            message.channel.send({ embeds: [tranEmbed] })
          }).catch(err => {
            message.channel.send({ embeds: [errorEmbed(err)] })
          })
        })
	},
}

function errorEmbed(reason) {
  const errorEmbed = new Discord.MessageEmbed()
    .setTitle('Error')
    .setColor('#D22B2B')
    .setDescription(reason);
  return errorEmbed
}
