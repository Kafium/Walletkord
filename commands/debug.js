const Discord = require('discord.js')

module.exports = {
  command: 'debug',
	execute(message, args, db, kafiApi, client) {
    if (!message.author.id === "768926775102406697") return
    const user = message.mentions.users.first()

		if (args[0] === "reset") {
      db.delete(user.id)
      
      message.channel.send("Resetted wallet successfully!")
    } else {
      const debugEmbed = new Discord.MessageEmbed()
        .setTitle('Debug')
        .setColor('#1AAC7A')
        .addField(`**Wallet address:**`, `\`\`${db.get(user.id).address}\`\``);
      message.channel.send({ embeds: [debugEmbed] })
    }
	}
}