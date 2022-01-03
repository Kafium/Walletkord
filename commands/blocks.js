const Discord = require('discord.js')

module.exports = {
  command: 'blocks',
	execute(message, args, db, kafiApi, client) {
		kafiApi.getTotalBlocks().then(count => {
			const infoEmbed = new Discord.MessageEmbed()
				.setTitle('BlockLattice Size')
				.setColor('#1AAC7A')
				.addField(`**Blocks:**`, `\`\`${count}\`\``);
			message.channel.send({ embeds: [infoEmbed] })
		})
	},
}