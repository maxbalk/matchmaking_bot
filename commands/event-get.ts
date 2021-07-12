import { Message } from "discord.js";
import moment = require("moment");
import Event = require('../lib/event')
import { CommandClient } from '../app';

const { TimeZones } = require('./event-create')

module.exports = {
	name: 'event-get',
	description: 'Get Match Announcement',
	admin: true,
	async execute(message: Message, client: CommandClient, args: Array<string>) {

		let timeZone = args.pop()
        const event_date = moment.tz(args.join(' '), TimeZones[timeZone]).toString();
		const events_table = Event.events();
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