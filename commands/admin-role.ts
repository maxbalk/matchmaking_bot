import { Message } from 'discord.js';
import { CommandClient } from '../app';
import { PermissionsBitField } from 'discord.js';
import matchRole from './setup'

export = {
	name: 'admin-role',
	description: `Sets the admin role name for the current league\n
                    usage: reply with the admin role name`,
    admin: false,
	async execute(message: Message, client: CommandClient, args: Array<string>) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            message.channel.send('Only server administrators can use this command.');
            return;
        }

        await matchRole.adminSetup(message, client);
    }
};
