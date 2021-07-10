import { Message } from 'discord.js';
import League = require('../lib/league');
import Role = require('../lib/role');

export = {
    name: 'activate-role',
    description: 'activates the specificed role.',
    async execute(message: Message, args: Array<string>) {

        const leagues = League.leagues();
        const guildID = message.guild.id;

        const myLeague = await leagues.findOne({
			where: { guild_id: message.guild.id }
		})
        
        const roleList = message.member.roles.cache;
        let roleMatch = roleList.find(role => role.id == myLeague.admin_role_id)
        if(roleMatch == undefined){
            message.channel.send('Invalid permissions.');
            return;
        }

        const roles = Role.roles();

        const affectedRows = await roles.update(
            { active: true }, 
            { where: { name: args, guild_id: guildID }}
        );
        if (affectedRows.length > 0) {
            return message.channel.send(`Role ${args} was activated in guild ${guildID}`);
        }
    message.channel.send(`Could not find a role with the name ${args} in ${guildID}.`);
    },
};