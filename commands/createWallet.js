const Discord = require('discord.js')
const kafiumJS = require('kafiumJS')

module.exports = {
  command: 'createWallet',
	execute(message, args, db, kafiApi) {
    if (db.get(message.author.id)) return message.channel.send({ embeds: [errorEmbed('You already have a wallet?!')] })

    const walletObj = kafiumJS.wallet.create()
    db.set(message.author.id, { address: walletObj.walletAddress, privKey: walletObj.privateKey })	

    const walletEmbed = new Discord.MessageEmbed()
      .setTitle('Wallet')
      .setColor('#1AAC7A')
      .setDescription(`Created a wallet for you!`);
    message.channel.send({ embeds: [walletEmbed] })
	}
}

function errorEmbed(reason) {
  const errorEmbed = new Discord.MessageEmbed()
    .setTitle('Error')
    .setColor('#D22B2B')
    .setDescription(reason);
  return errorEmbed
}
