import { Message } from 'discord.js';
import { CommandClient } from '../app';
import setup from './setup'

export = {
	name: 'member-role',
	description: `Sets the member role name for the current league.\n
                    usage: !member-role\n
                    follow the prompt.`,
    admin: true,
	async execute(message: Message, client: CommandClient, args: Array<string>) {
        await setup.memberSetup(message, client);
    },
};