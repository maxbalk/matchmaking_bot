const Models = require('../lib/models')
const moment = require('moment-timezone')
const Discord = require('discord.js')
const { getGuildRoles } = require('./list-roles')

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
			const leagues = Models.league()
			const myLeague = await leagues.findOne({
				where : {
					guild_id: message.guild.id
				}
			});
			const event_channel_id = myLeague.event_channel_id;
			const event_channel = message.guild.channels.cache
				.filter(chan => chan.id == event_channel_id).array()[0];
			try {
				const announcement_id = await eventAnnouncement(event_channel, event_date);
				const res = await eventCreate(message, event_date, announcement_id);
				message.channel.send(res);
			} catch {
				message.channel.send("There was a problem creating the event announcement");
			}
			
		} catch (e) {
			message.channel.send(`OoPs! I cant read that date!`);
		}
		
	},
};

async function eventAnnouncement(event_channel, event_date) {
	const guild_roles = await getGuildRoles(event_channel.guild.id);

	const eventEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`${event_channel.guild.name} league GvG event`)
	.setDescription(`${event_date}`)
	.addFields(
		{ name: 'Participants', value: 'React to sign up as a role' }
	);
	
	const reactions = new Array()
	for (role of guild_roles) {
		const classEmoji = event_channel.guild.emojis.cache.find(emoji => emoji.name === role.name);
		reactions.push(classEmoji);
	}
	const announcement = await event_channel.send(eventEmbed);
	for (reaction of reactions) {
		announcement.react(reaction)
	}
	return announcement.id
}

async function eventCreate(message, event_date, announcement_id) {
	const events_table = Models.event();
	const event_guild_id = message.guild.id;
	console.log(moment)
	try {
		const event = await events_table.create({
			league_id: event_guild_id,
			date: event_date,
			announcement_id: announcement_id
		});
		return `New event scheduled for ${event_date}`;
	} catch (e) {
		return `There was a problem scheduling the event`;
	}
}
