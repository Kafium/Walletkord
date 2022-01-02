module.exports = {
  command: 'blocks',
	execute(message, args, db, kafiApi, client) {
		kafiApi.getTotalBlocks().then(count => {
			message.channel.send(`Blocks: ${count}`)
		})
	},
}