import { Message } from 'discord.js';
import Role = require('../lib/role');

export = {
	name: 'add-role',
	description: 'Add new roles - role name must match emoji name.',
	async execute(message: Message, args: Array<string>) {
		
		let roleName = args.toString();
		let guildID = message.guild.id;
		let classEmoji = message.guild.emojis.cache.find(emoji => emoji.name === roleName);

		if(typeof(classEmoji) == 'undefined') {
			let badRes = `No emoji matches the role name.`;
			message.channel.send(badRes);
			return;
		}

		let roles = Role.roles()
		let matchingRole = await roles.findOne({ 
			where: { 
				name: roleName, guild_id: guildID 
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
			guild_id: guildID
		});

		let res = `Role ${roleName} added to the table using the ${classEmoji} emoji.`;
		message.channel.send(res);
	}
};