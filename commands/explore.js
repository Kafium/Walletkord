const Discord = require('discord.js')
const disbut = require("discord-buttons")

module.exports = {
  command: 'explore',
	execute(message, args, db, walletSocket, client) {
    if(!args[0]) {
      walletSocket.write('getBlocksCount')

      waitForData(walletSocket, 'blocksCount').then(blocksCount => {
        const infoEmbed = new Discord.MessageEmbed()
          .setTitle('Blockchain Stats')
          .setColor('#1AAC7A')
          .addField('Blocks', blocksCount.toString().replace('blocksCount/', ''))
          .setFooter('Also you can explore blockchain by using args.');
        message.channel.send(infoEmbed)
      })
    } else 
      if(args[0].startsWith('K#')) {
      walletSocket.write(`getWalletBlocks/${args[0]}|30&&`)

      waitForData(walletSocket, 'walletBlocks').then(walletBlocks => {
        const blockArray = walletBlocks.toString().replace('walletBlocks/', '').replace('&&', '').split('|')

        const blocksEmbed = new Discord.MessageEmbed()
            .setTitle(`🔲 \`\`Wallet blocks explorer\`\``)
            .setColor('#1AAC7A');
        
        const select = new disbut.MessageMenu()
          .setID('blockSelector')
          .setPlaceholder('Select block to view! :D')
          .setMaxValues(1)
          .setMinValues(1);
        
        const jsonBlock = JSON.parse(blockArray[0])
        blocksEmbed.setDescription(`[Block 1] **Hash:** \`\`${jsonBlock.hash}\`\`\nSender: \`\`${jsonBlock.sender}\`\`\nReceiver: \`\`${jsonBlock.receiver}\`\`\nAmount: \`\`${jsonBlock.amount / 100} Kafium\`\``)
        
        blockArray.forEach((block, index) => {
          const optio = new disbut.MessageMenuOption()
            .setLabel(`Block ${index + 1}`)
            .setEmoji('🟩')
            .setValue(index + 1);
          select.addOption(optio)
        })

        message.channel.send(blocksEmbed, select).then(msg => {
          client.on('clickMenu', function(menu) {
            if (!menu.clicker.id === message.author.id) return
            menu.reply.defer()
            const jsonBlockUpdated = JSON.parse(blockArray[parseInt(menu.values[0] - 1)])
            blocksEmbed.setDescription(`[Block ${parseInt(menu.values[0])}] **Hash:** ${jsonBlockUpdated.hash}\nSender: \`\`${jsonBlockUpdated.sender}\`\`\nReceiver: \`\`${jsonBlockUpdated.receiver}\`\`\nAmount: \`\`${jsonBlockUpdated.amount / 100} Kafium\`\``)
            msg.edit(blocksEmbed)
          })
        })
      })
    } else {
      walletSocket.write(`getBlockByHash/${args[0]}&&`)

      waitForData(walletSocket, 'Block').then(block => {
        const Block = JSON.parse(block.toString().replace('Block/', '').replace('&&', ''))

        const blocksEmbed = new Discord.MessageEmbed()
            .setTitle(`🔲 \`\`Block explorer\`\``)
            .setColor('#1AAC7A')
            .setDescription(`[Block] **Hash:** ${Block.hash}\nSender: \`\`${Block.sender}\`\`\nReceiver: \`\`${Block.receiver}\`\`\nAmount: \`\`${Block.amount / 100} Kafium\`\``);
        
        message.channel.send(blocksEmbed)
      })
    }

	},
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