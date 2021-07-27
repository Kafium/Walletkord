const config = require('./config.json')

const db = require('quick.db')
const Discord = require('discord.js')

const net = require('net')
const walletSocket = new net.Socket()
const fs = require('fs')

const client = new Discord.Client()
require('discord-buttons')(client)

client.commands = new Discord.Collection()

walletSocket.connect(config.nodeToCommunicate.split(':')[1], config.nodeToCommunicate.split(':')[0], function () {
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.command, command);
	}

	client.once('ready', () => {
		console.log('Ready!')
	});

	client.on('message', message => {
		if (!message.content.startsWith('?') || message.author.bot) return

		const args = message.content.slice(1).trim().split(/ +/)
		const command = args.shift()

		if (!client.commands.has(command)) return

		client.commands.get(command).execute(message, args, db, walletSocket, client)
	});

	client.login(config.botToken)
})