const Models = require('../lib/models')

module.exports = {
	name: 'event-get',
	description: 'Get Match Announcement',
	async execute(message, args) {
        var event_date = new Date(...args.map(arg => Number(arg)));
		const events_table = Models.event();
		const event = await events_table.findOne({
            where: {
                date: event_date
            }
		});
        var values = JSON.stringify(event.get());
        var res = `Found event ${values}`;
		message.channel.send(res);
	},
};