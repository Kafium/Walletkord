const Discord = require('discord.js')

module.exports = {
  command: 'balance',
  alias: 'bal',
	execute(message, args, db, walletSocket) {
    if (!db.get(message.author.id)) return message.channel.send(errorEmbed('Please firstly create a wallet.'))

    walletSocket.getWalletBalance(db.get(message.author.id).KWallet).then(bal => {
      const walletEmbed = new Discord.MessageEmbed()
        .setTitle('Wallet')
        .setColor('#1AAC7A')
        .setDescription(`Balance: ${bal / 10000} Kafium`);
      message.channel.send(walletEmbed)
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
