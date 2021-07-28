const Discord = require('discord.js')

module.exports = {
  command: 'faucet',
	execute(message, args, db, walletSocket, client) {
    if (!message.channel.id === '869707781798772807') return
    if (!db.get(message.author.id)) return message.channel.send(errorEmbed('Please firstly create a wallet.'))

    const user = message.author

    walletSocket.write('getLastHash&&')

    waitForData(walletSocket, 'lastHash').then(hash => {
        const createdAt = Date.now()
        const latestHash = hash.toString().split('/')[1].replace('&&', '')
        const calculateHash = crypto.createHash('ripemd160').update(parseInt(createdAt) + latestHash + db.get(client.user.id).publicKey + db.get(user.id).publicKey + (parseFloat(100) * 100)).digest('hex')
        curve.sign(calculateHash, db.get(message.author.id).privKey).then(tx => {
          walletSocket.write(`newRawTransaction/${db.get(client.user.id).publicKey}|${db.get(user.id).publicKey}|${parseFloat(100) * 100}|${tx}|${createdAt}&&`)
          waitForData(walletSocket, 'rawTransactionSuccess').then(() => {
            const tranEmbed = new Discord.MessageEmbed()
            .setTitle('Transaction success!')
            .setColor('#1AAC7A')
            .setDescription(`${client.user.toString()} tipped 100 Kafiums to ${user.toString()}.`)
            .addField(`**Hash:**`, `\`\`${calculateHash}\`\``);
            message.channel.send(tranEmbed)
          }).catch(err => {
            message.channel.send(errorEmbed(err))
          })
        })
    })


	},
}
