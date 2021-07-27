const Discord = require('discord.js')

module.exports = {
  command: 'help',
	execute(message, args) {
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle('Commands')
      .setColor('#13805A')
      .addField('?createWallet\n?wallet\n?balance\n?send ``amount`` ``wallet``\n?tip ``<@user>`` ``amount``', `Bot made by KaffinPX with ❤️`, true)
      .addField(`Creates a wallet\nShows wallet address\nShows wallet balance\nSends Kafium\nTip Kafium using mention`, '\u200b', true)
    message.channel.send(helpEmbed)
	},
}
