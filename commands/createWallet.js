const Discord = require('discord.js')
const kafiumJS = require('kafiumJS')

module.exports = {
  command: 'createWallet',
	execute(message, args, db, walletSocket) {
    if (db.get(message.author.id)) return message.channel.send(errorEmbed('You already have a wallet?!'))

    kafiumJS.createWallet().then(walletObj => { 
      db.set(message.author.id, { KWallet: walletObj.KWallet, publicKey: walletObj.publicKey, privKey: walletObj.privateKey })	

      const walletEmbed = new Discord.MessageEmbed()
        .setTitle('Wallet')
        .setColor('#1AAC7A')
        .setDescription(`Created a wallet for you!`);
      message.channel.send(walletEmbed)
    })
	}
}

function errorEmbed(reason) {
  const errorEmbed = new Discord.MessageEmbed()
    .setTitle('Error')
    .setColor('#D22B2B')
    .setDescription(reason);
  return errorEmbed
}
