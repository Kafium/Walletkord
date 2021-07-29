const Discord = require('discord.js')
const crypto = require('crypto')
const curve = require('noble-ed25519')

module.exports = {
  command: 'faucet',
	execute(message, args, db, walletSocket, client) {
    if (message.channel.id !== '869707781798772807') return
    if (!db.get(message.author.id)) return message.channel.send(errorEmbed('Please firstly create a wallet.'))

    const user = message.author

    walletSocket.write('getLastHash&&')

    waitForData(walletSocket, 'lastHash').then(hash => {
        const createdAt = Date.now()
        const latestHash = hash.toString().split('/')[1].replace('&&', '')
        const calculateHash = crypto.createHash('ripemd160').update(parseInt(createdAt) + latestHash + db.get(client.user.id).publicKey + db.get(user.id).publicKey + (200 * 100)).digest('hex')
        curve.sign(calculateHash, db.get(client.user.id).privKey).then(tx => {
          walletSocket.write(`newRawTransaction/${db.get(client.user.id).publicKey}|${db.get(user.id).publicKey}|${200 * 100}|${tx}|${createdAt}&&`)
          waitForData(walletSocket, 'rawTransactionSuccess').then(() => {
            const tranEmbed = new Discord.MessageEmbed()
            .setTitle('Transaction success!')
            .setColor('#1AAC7A')
            .setDescription(`${client.user.toString()} tipped 200 Kafiums to ${user.toString()}.`)
            .addField(`**Hash:**`, `\`\`${calculateHash}\`\``);
            message.channel.send(tranEmbed)
          }).catch(err => {
            message.channel.send(errorEmbed(err))
          })
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

function waitForData(socket, waitingData) {
  return new Promise((resolve, reject) => {
      socket.on('data', listener)

      function listener(data) {
          if(data.toString().includes(waitingData)) {
              resolve(data)
              socket.removeListener('data', listener)
          }

          if(data.toString().startsWith('Error')) {
              reject(data.toString().replace('Error/', '').replace('&&', ''))
              socket.removeListener('data', listener)
          }
      }
      
      wait(5000).then(() => {
          reject('TIMEOUT')
          socket.removeListener('data', listener)
      })
  })
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))