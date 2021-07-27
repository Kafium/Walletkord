const Discord = require('discord.js')

module.exports = {
  command: 'wallet',
	execute(message, args, db, walletSocket) {
    if (!db.get(message.author.id)) return message.channel.send(errorEmbed('Please firstly create a wallet.'))

    const walletEmbed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}#${message.author.discriminator}'s Wallet`)
      .setColor('#1AAC7A')
      .setDescription(`**Wallet Address:** \`\`${db.get(message.author.id).publicKey}\`\``)
    message.channel.send(walletEmbed)
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
