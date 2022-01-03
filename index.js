const db = require('quick.db')
const Discord = require('discord.js')
const kafiumJS = require('kafiumJS')

const fs = require('fs')

const config = require('./config.json')

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] })

client.commands = new Discord.Collection()

const kafiApi = new kafiumJS.node(config.nodeToCommunicate)

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.command, command)
	if(command.alias) { client.commands.set(command.alias, command) }
}

client.once('ready', () => {
	console.log('Kafiwallet | Ready!')

	if (!db.get(client.user.id)) {
		const walletObj = kafiumJS.wallet.create()
		db.set(client.user.id, { address: walletObj.walletAddress, privKey: walletObj.privateKey })	
	}
})

client.on('messageCreate', message => {
	if (!message.channel.type === 'DM') return
	if (!message.content.startsWith('?') || message.author.bot) return

	const args = message.content.slice(1).trim().split(/ +/)
	const command = args.shift()

	if (!client.commands.has(command)) return

	client.commands.get(command).execute(message, args, db, kafiApi, client)
})

client.login(config.botToken)