const db = require('quick.db')
const Discord = require('discord.js')
const kafiumJS = require('kafiumJS')

const fs = require('fs')

const config = require('./config.json')

const client = new Discord.Client()
require('discord-buttons')(client)

client.commands = new Discord.Collection()

const walletSocket = new kafiumJS.Web3(config.nodeToCommunicate)

walletSocket.on('ready', function() {
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`)
		client.commands.set(command.command, command)
		if(command.alias) { client.commands.set(command.alias, command) }
	}

	client.once('ready', () => {
		console.log('Ready!')

		if (!db.get(client.user.id)) {
			kafiumJS.createWallet().then(walletObj => { 
				db.set(client.user.id, { KWallet: walletObj.KWallet, publicKey: walletObj.publicKey, privKey: walletObj.privateKey })	
			})
		}
	})

	client.on('message', message => {
		if (!message.content.startsWith('?') || message.author.bot) return

		const args = message.content.slice(1).trim().split(/ +/)
		const command = args.shift()

		if (!client.commands.has(command)) return

		client.commands.get(command).execute(message, args, db, walletSocket, client)
	});

	client.login(config.botToken)
})