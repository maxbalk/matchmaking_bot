import { Message } from 'discord.js';
import { CommandClient } from '../app';
import Role = require('../lib/role');

export = {
	name: 'add-role',
	description: `Add new roles - role name must match emoji name.\n
					usage: !add-role <role name>`,
	admin: true,
	async execute(message: Message, client: CommandClient, args: Array<string>) {
		
		let roleName = args.join(' ');
		let classEmoji = message.guild.emojis.cache.find(emoji => emoji.name === roleName);

		if(typeof(classEmoji) == 'undefined') {
			let badRes = `No emoji matches the role name.`;
			message.channel.send(badRes);
			return;
		}

		let roles = Role.roles()
		let matchingRole = await roles.findOne({ 
			where: { 
				name: roleName, 
				guild_id: message.guild.id
			} 
		});

		if(matchingRole != null) {
			let badRes = `Role ${roleName} already exists.`;
			message.channel.send(badRes);
			return;
		}
		await roles.create({
			name: roleName,
			active: true,
			guild_id: message.guild.id
		});

		let res = `Role ${roleName} added to the table using the ${classEmoji} emoji.`;
		message.channel.send(res);
	}
};