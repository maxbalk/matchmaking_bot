module.exports = {
	name: 'match-create',
	description: 'Create Match Announcement',
	execute(message, args) {
        var d = new Date(...args.map(arg => Number(arg)));
        var res = `New event scheduled for ${d}`;
		message.channel.send(res);
	},
};