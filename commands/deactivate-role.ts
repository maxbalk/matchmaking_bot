import { Message } from 'discord.js';
import { CommandClient } from '../app';
import Role = require('../lib/role')

export = {
    name: 'deactivate-role',
    description: 'Deactivates the specificed role for use in the league.',
    async execute(message: Message, client: CommandClient, args: Array<string>) {

        const roles = Role.roles();
        const guildID = message.guild.id;
        
        let league = client.leagues.get(guildID);
        if(!league.permCheck(message)){
            return;
        }
        const affectedRows = await roles.update(
            { active: false }, 
            { where: { name: args, guild_id: guildID }}
        );
        if (affectedRows.length > 0) {
            return message.channel.send(`Role ${args} was deactivated in guild ${guildID}.`);
        }
    message.channel.send(`Could not find a role with the name ${args}.`);
    },
};