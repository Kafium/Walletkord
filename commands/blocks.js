module.exports = {
  command: 'blocks',
	execute(message, args, db, walletSocket, client) {
		walletSocket.getTotalBlocks().then(count => {
			message.channel.send(`Blocks: ${count}`)
		})
	},
}