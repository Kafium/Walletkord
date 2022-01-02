const Discord = require('discord.js')

module.exports = {
  command: 'wallet',
	execute(message, args, db, kafiApi) {
    if (!db.get(message.author.id)) return message.channel.send({ embeds: [errorEmbed('Please firstly create a wallet.')] })

    const walletEmbed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username}'s wallet`, message.author.displayAvatarURL())
      .setColor('#1AAC7A')
      .setDescription(`**Wallet Address:** \`\`${db.get(message.author.id).address}\`\``);
    message.channel.send({ embeds: [walletEmbed] })
	},
}

function errorEmbed(reason) {
  const errorEmbed = new Discord.MessageEmbed()
    .setTitle('Error')
    .setColor('#D22B2B')
    .setDescription(reason);
  return errorEmbed
}
