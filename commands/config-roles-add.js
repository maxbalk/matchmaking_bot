const Models = require('../lib/models')

module.exports = {
	name: 'config-roles-add',
	description: 'Add new roles - role name must match emoji name.',
	async execute(message, args) {
        var roleName = args.toString();
        const classEmoji = message.guild.emojis.cache.find(emoji => emoji.name === roleName);
        var res = `Role ${roleName} added to the table using the ${classEmoji} emoji.`;

        const roles_table = Models.roles();
		const modelList = await roles_table.findAll({ attributes: ['name'] });
		const modelString = modelList.map(t => t.name).join(',') || 'No roles set.';
		var nameArr = modelString.split(',');

			if(nameArr.includes(roleName))
			{
				var badRes = `Role ${roleName} already exists.`;
				message.channel.send(badRes);
			}
			else {
				const roles_table = Models.roles();
				const roles = roles_table.create({
					name: roleName,
					active: true,
				});
				return message.channel.send(res);
			}
		}
	};