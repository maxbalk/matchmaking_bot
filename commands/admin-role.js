const Models = require('../lib/models')

module.exports = {
	name: 'admin-role',
	description: 'Sets the admin role name for the current league',
	async execute(message, args) {
        const roleName = args.join(' ');
        const match = message.guild.roles.cache
            .filter(role => role.name == roleName);
        if(!match.size) {
            message.channel.send(`Could not find role ${roleName}`);
            return;
        }

        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.send('Only server administrators can use this command.');
            return;
        }

        const role = match.array()[0];

        const leagues = Models.league()
        const affectedRows = await leagues.update(
            { admin_role_id: role.id},
            { where: {
                guild_id: message.guild.id
            }
        });
        if (affectedRows > 0) {
            message.channel.send(`League admin role set to: **${role.name}**`);
        } else {
            message.channel.send('There was a problem updating the league admin role'); 
        }
    }
};