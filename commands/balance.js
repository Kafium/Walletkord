const Discord = require('discord.js')

module.exports = {
  command: 'balance',
  alias: 'bal',
	execute(message, args, db, kafiApi) {
    if (!db.get(message.author.id)) return message.channel.send({ embeds: [errorEmbed('Please firstly create a wallet.')]})

    kafiApi.getBalance(db.get(message.author.id).address).then(bal => {
      const walletEmbed = new Discord.MessageEmbed()
        .setTitle('Wallet')
        .setColor('#1AAC7A')
        .setDescription(`Balance: ${BigInt(bal) / BigInt(10000)} Kafium`);
      message.channel.send({ embeds: [walletEmbed]})
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
