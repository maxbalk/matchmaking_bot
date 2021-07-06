const roles = require('../lib/role/roles.js');

module.exports = {
	name: 'config-roles-add',
	description: 'Add new roles - role name must match emoji name.',
	execute(message, args) {
        var roleName = args.toString();
        const classEmoji = message.guild.emojis.cache.find(emoji => emoji.name === roleName);
        var res = `Role ${roleName} added to the table using the ${classEmoji} emoji.`;
		message.channel.send(res);
	}
};