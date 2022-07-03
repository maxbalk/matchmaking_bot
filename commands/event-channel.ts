import { Message } from 'discord.js';
import { CommandClient } from '../app';
import League = require('../lib/league')
import setup = require('./setup')

export = {
	name: 'event-channel',
	description: `Sets guild channel as signup channel and sends signup message\n
                    !event-channel <channel-name>\n
                    Do not use #channel, just type the channel name.`,
    admin: true,
	async execute(message: Message, client: CommandClient, args: Array<string>) {
    setup.eventNameSetup(message, client)
    }
};