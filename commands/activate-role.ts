import { Message } from 'discord.js';
import { CommandClient } from '../app';
import League = require('../lib/league');
import Role = require('../lib/role');

export = {
    name: 'activate-role',
    description: 'activates the specificed role.',
    async execute(message: Message, client: CommandClient, args: Array<string>) {

        const league = new League.League();
        const guildID = message.guild.id;

        const savedName = await league.getAdminID(guildID);
        const roleMatch = await message.member.roles.cache.find(role => role.id == savedName[0].admin_role_id);

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