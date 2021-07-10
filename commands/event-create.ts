import moment = require('moment-timezone');
import Discord = require('discord.js');
import League = require('../lib/league');
import Role = require('../lib/role');
import Event = require('../lib/event');
import { Message } from 'discord.js';

const TimeZones = {
	'EU': 'Europe/Berlin',
	'NA': 'America/New_York'
}

export = {
	name: 'event-create',
	description: 'Create Match Announcement',
	async execute(message: Message, args: Array<string>) {
		
		let timeZone = args.pop()
		try {
			const event_date = moment.tz(args.join(' '), TimeZones[timeZone]).toString();
			const leagues = League.leagues()
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
	TimeZones
};

async function eventAnnouncement(event_channel, event_date) {
	let role = new Role.Role()
	const guild_roles = await role.getGuildRoles(event_channel.guild.id);

	const eventEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`${event_channel.guild.name} league GvG event`)
	.setDescription(`${event_date}`)
	.addFields(
		{ name: 'Participants', value: 'React to sign up as a role' }
	);
	
	const reactions = new Array()
	for (let role of guild_roles) {
		const classEmoji = event_channel.guild.emojis.cache.find(emoji => emoji.name === role.name);
		reactions.push(classEmoji);
	}
	const announcement = await event_channel.send(eventEmbed);
	for (let reaction of reactions) {
		announcement.react(reaction)
	}
	return announcement.id
}

async function eventCreate(message, event_date, announcement_id) {
	const events = Event.events();
	const event_guild_id = message.guild.id;
	console.log(moment)
	try {
		const event = await events.create({
			guild_id: event_guild_id,
			date: event_date,
			announcement_id: announcement_id
		});
		return `New event scheduled for ${event_date}`;
	} catch (e) {
		return `There was a problem scheduling the event`;
	}
}
