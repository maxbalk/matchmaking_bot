module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, client, args) {
		message.channel.send('Pong.');
	},
};