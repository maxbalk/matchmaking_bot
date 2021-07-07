const { MessageAttachment } = require('discord.js');
const Models = require('../lib/models')

module.exports = {
	name: 'config-roles-add',
	description: 'Add new roles - role name must match emoji name.',
	async execute(message, args) {
		var roleName = args.toString();
		var guildID = message.guild.id.toString();
		const classEmoji = message.guild.emojis.cache.find(emoji => emoji.name === roleName);

		if(typeof(classEmoji) == 'undefined') {
			var badRes = `No emoji matches the role name.`;
			message.channel.send(badRes);
			return;
		}

		const roles_table = Models.roles();
		const matchingRole = await roles_table.findOne({ where: { name: roleName, guild_id: guildID } });

		if(matchingRole != null) {
			var badRes = `Role ${roleName} already exists.`;
			message.channel.send(badRes);
			return;
		}
		const role = roles_table.create({
			name: roleName,
			active: true,
			guild_id: guildID
		});

		var res = `Role ${roleName} added to the table using the ${classEmoji} emoji.`;
		message.channel.send(res);
	}
};