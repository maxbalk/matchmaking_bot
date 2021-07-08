const Models = require('../lib/models')
const moment = require('moment-timezone')
const Discord = require('discord.js')

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
			const announcement_id = await eventAnnouncement(message, event_date);
			const res = await eventCreate(message, event_date, announcement_id);
			message.channel.send(res);
		} catch (e) {
			message.channel.send(`OoPs! I cant read that date!`);
		}
		
	},
};

async function eventAnnouncement(message, event_date) {
	const roles = Models.roles();
	const guild_roles = await roles.findAll({
		where: {
			guild_id: message.guild.id
		}
	});
	const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`${message.guild.name} league GvG event`)
	.setDescription(`${event_date}`)
	.addFields(
		{ name: 'Participants', value: 'React to sign up as a role' }
	);
	
	const reactions = new Array()
	for (role of guild_roles) {
		const classEmoji = message.guild.emojis.cache.find(emoji => emoji.name === role.name);
		reactions.push(classEmoji);
	}
	for (reaction of reactions) {
		exampleEmbed.addField(`${reaction} 0`, '-')
	}
	const announcement = await message.channel.send(exampleEmbed);
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
