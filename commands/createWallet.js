const Discord = require('discord.js')
const curve = require('noble-ed25519')
const uint8 = require('../utils/uint8')

module.exports = {
  command: 'createWallet',
	execute(message, args, db, walletSocket) {
    if (db.get(message.author.id)) return message.channel.send(errorEmbed('You already have a wallet?!'))

    const key = curve.utils.randomPrivateKey()
    curve.getPublicKey(key).then(publicKey => { 
      const pubKey = uint8.uint8ToHex(publicKey) 
      const privateKey = uint8.uint8ToHex(key).toUpperCase()

      db.set(message.author.id, { privKey: privateKey, publicKey: 'K#' + pubKey })

      const walletEmbed = new Discord.MessageEmbed()
        .setTitle('Wallet')
        .setColor('#1AAC7A')
        .setDescription(`Created a wallet for you!`);
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
