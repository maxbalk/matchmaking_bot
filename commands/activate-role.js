const { max } = require('moment');
const Models = require('../lib/models')

module.exports = {
    name: 'activate-role',
    description: 'activates the specificed role.',
    async execute(message, args) {
        const leagues = Models.league();
        const currentID = message.guild.id;

		const myLeague = await leagues.findOne({
			where: { guild_id: message.guild.id }
		})

        const adminRole = myLeague.admin_role_id;
        const roleList = message.member.roles.cache;
        var permCheck = false;
        var maxWillHateThis = false;
        for(let i = 0; i < roleList.size; i++) { 
            if(roleList.array()[i].id != adminRole.toString()) {
                if(roleList.array()[i].id == adminRole)
                {
                    permCheck = false;
                    maxWillHateThis = true;
                }
                if(!maxWillHateThis)
                {
                    permCheck = true;
                }
                
            }
        }
        if(permCheck) { 
            message.channel.send('Invalid permissions.');
            return;
        }


        const roles_table = Models.roles();

        const affectedRows = await roles_table.update(
            { active: true }, 
            { where: { name: args, guild_id: currentID }}
        );
        if (affectedRows > 0) {
            return message.channel.send(`Role ${args} was activated in guild ${currentID}`);
        }
    message.channel.send(`Could not find a role with the name ${args} in ${currentID}.`);
    },
};