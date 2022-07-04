import { Message } from 'discord.js';
import { CommandClient } from '../app';
import setup from './setup'

export = {
	name: 'set-teamsize',
	description: `Sets the max teamsize for the current league.\n
                    usage: !set-teamsize\n
                    follow the prompt.`,
    admin: true,
	async execute(message: Message, client: CommandClient, args: Array<string>) {
        await setup.setupMaxteamSize(message, client);
    },
};