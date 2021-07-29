const db = require('quick.db')
const curve = require('noble-ed25519')
const Discord = require('discord.js')

const net = require('net')
const walletSocket = new net.Socket()

const fs = require('fs')

const uint8 = require('./utils/uint8')
const config = require('./config.json')

const client = new Discord.Client()
require('discord-buttons')(client)

client.commands = new Discord.Collection()

walletSocket.connect(config.nodeToCommunicate.split(':')[1], config.nodeToCommunicate.split(':')[0], function () {
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`)
		client.commands.set(command.command, command)
		if(command.alias) { client.commands.set(command.alias, command) }
	}

	client.once('ready', () => {
		console.log('Ready!')

		if (!db.get(client.user.id)) {
			const key = curve.utils.randomPrivateKey()
			curve.getPublicKey(key).then(publicKey => { 
				const pubKey = uint8.uint8ToHex(publicKey) 
				const privateKey = uint8.uint8ToHex(key).toUpperCase()

				db.set(client.user.id, { privKey: privateKey, publicKey: 'K#' + pubKey })	
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