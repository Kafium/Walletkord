const Discord = require('discord.js')
const crypto = require('crypto')
const curve = require('noble-ed25519')

module.exports = {
  command: 'send',
	execute(message, args, db, walletSocket) {
    if (!db.get(message.author.id)) return message.channel.send(errorEmbed('Please firstly create a wallet.'))

    if (!args[0] || !args[1]) return message.channel.send(errorEmbed('Usage: ``?send <amount> <wallet>``'))

    walletSocket.signTransaction(db.get(message.author.id).privKey, args[2], (parseFloat(args[1]) * 10000)).then(block => {
        walletSocket.bcTransactionBlock(block.data).then(() => {
            const tranEmbed = new Discord.MessageEmbed()
            .setTitle('Transaction broadcasted successfully!')
            .setColor('#1AAC7A')
            .addField(`**Hash:**`, `\`\`${block.hash}\`\``);
            message.channel.send(tranEmbed)
          }).catch(err => {
            message.channel.send(errorEmbed(err))
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
