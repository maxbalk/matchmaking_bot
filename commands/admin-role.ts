import { Guild, Message } from 'discord.js';
import { CommandClient } from '../app';
import League = require('../lib/league')
import matchRole from './setup'

export = {
	name: 'admin-role',
	description: `Sets the admin role name for the current league\n
                    usage: reply with the admin role name`,
    admin: false,
	async execute(message: Message, client: CommandClient, args: Array<string>) {

        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.send('Only server administrators can use this command.');
            return;
        }
        await matchRole.adminSetup(message, client);
    }
};