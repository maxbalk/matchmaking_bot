const Models = require('../lib/models')

module.exports = {
	name: 'event-create',
	description: 'Create Match Announcement',
	execute(message, args) {
        var event_date = new Date(...args.map(arg => Number(arg)));
		const events_table = Models.event();
		const event = events_table.create({
			event_id: 1,
			league_id: 1,
			date: event_date
		});
        var res = `New event scheduled for ${d}`;
		message.channel.send(res);
	},
};