const Discord = require('discord.js')
const crypto = require('crypto')

module.exports = {
  command: 'tip',
	execute(message, args, db, walletSocket) {
    if (!db.get(message.author.id)) return message.channel.send({ embeds: [errorEmbed('Please firstly create a wallet.')] })

    if (!args[0] || !args[1]) return message.channel.send({ embeds: [errorEmbed('Usage: ``?tip <@user> <amount>``')] })

    const user = message.mentions.users.first()
    if (user === undefined) return message.channel.send({ embeds: [errorEmbed('Please mention a valid user.')] })
    if (!db.get(user.id)) return message.channel.send({ embeds: [errorEmbed('Mentioned user must create a wallet first.')] })

    walletSocket.signTransaction(db.get(message.author.id).privKey, db.get(user.id).KWallet, (parseFloat(args[1]) * 10000)).then(block => {
      walletSocket.bcTransactionBlock(block.data).then(() => {
        const tranEmbed = new Discord.MessageEmbed()
        .setTitle('Transaction executed!')
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