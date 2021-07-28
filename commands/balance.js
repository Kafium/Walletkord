const Discord = require('discord.js')

module.exports = {
  command: 'balance',
  alias: 'bal',
	execute(message, args, db, walletSocket) {
    if (!db.get(message.author.id)) return message.channel.send(errorEmbed('Please firstly create a wallet.'))

    walletSocket.write(`getWalletBalance/${db.get(message.author.id).publicKey}&&`)

    waitForData(walletSocket, 'walletBalance').then(data => {
      const walletEmbed = new Discord.MessageEmbed()
        .setTitle('Wallet')
        .setColor('#1AAC7A')
        .setDescription(`Balance: ${data.toString().split('/')[1].replace('&&', '') / 100} Kafium`);
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