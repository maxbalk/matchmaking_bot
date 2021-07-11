import { Message } from 'discord.js';
import { CommandClient } from '../app';
import League = require('../lib/league');
import Role = require('../lib/role');

export = {
    name: 'activate-role',
    description: 'Activates the specified role for use in the league.',
    async execute(message: Message, client: CommandClient, args: Array<string>) {

        const guildID = message.guild.id;
        
        let league = client.leagues.get(guildID);
        if(!league.permCheck(message)){
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