const Models = require('../lib/models')

module.exports = {
	name: 'event-create',
	description: 'Create Match Announcement',
	execute(message, args) {
        var event_date = new Date(...args.map(arg => Number(arg)));
		
		const event = eventCreate(message);
        var res = `New event scheduled for ${d}`;
		message.channel.send(res);
	},
};


function eventCreate(){
	const events_table = Models.event();
}