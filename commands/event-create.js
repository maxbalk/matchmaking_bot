const Models = require('../lib/models')
const moment = require('moment-timezone')

const TimeZones = {
	'EU': 'Europe/Berlin',
	'NA': 'America/New_York'
}

module.exports = {
	name: 'event-create',
	description: 'Create Match Announcement',
	async execute(message, args) {
		let timeZone = args.pop()
		try {
			const event_date = moment.tz(args.join(' '), TimeZones[timeZone]).toString();
			const res = await eventCreate(message, event_date);
			message.channel.send(res);
		} catch (e) {
			message.channel.send(`OoPs! I cant read that date!`);
		}
		
	},
};


async function eventCreate(message, event_date){
	const events_table = Models.event();
	const event_guild_id = message.guild.id;
	console.log(moment)
	try {
		const event = await events_table.create({
			league_id: event_guild_id,
			date: event_date
		});
		return `New event scheduled for ${event_date}`;
	} catch (e) {
		return `There was a problem scheduling the event`;
	}
}
