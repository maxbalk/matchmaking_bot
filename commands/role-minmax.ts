import { Message } from 'discord.js';
import Role = require('../lib/role')
import { CommandClient } from '../app';

export = {
    name: 'role-minmax',
    description: `set the minimum and maximum population parameters for the given role to be used in matchmaking\n
                    usage: !role-minmax <role name> <min> <max>\n
                    negative values will be set to zero`,
    admin: true,
    async execute(message: Message, client: CommandClient, args: Array<string>) {

        if(!args || args.length != 3){
            message.channel.send('Invalid number of arguments, please refer to !help');
            return;
        }

        let roleToSet = args[0];
        let minParam = Number(args[1]);
        let maxParam = Number(args[2]);

        if(isNaN(minParam) || isNaN(maxParam)){
            message.channel.send('min and max parameters must be numbers. please refer to !help');
            return;
        }
        if(minParam > maxParam){
            message.channel.send('the maximum population parameter cannot be less than the minimum population parameter');
            return;
        }

        let role = new Role.Role();
        let guildRoles = await role.getGuildRoles(message.guild.id);
        let roleMatch = guildRoles.find(role => role.name == roleToSet)
        if(roleMatch == undefined){
            message.channel.send(`Could not find the given role among this league's active roles`);
            return;
        }

        if(minParam < 0) minParam = 0;
        if(maxParam < 0) maxParam = 0;

        let roles = Role.roles();
        let modifiedRole = await roles.update(
            { 
                param_min: minParam,
                param_max: maxParam
            },
            { where: {
                name: roleToSet,
                guild_id: message.guild.id
            }
        });
        if (modifiedRole[0] < 1){
            message.channel.send(`There was a problem updating the league role`);
            return;
        }
        message.channel.send(`Updated role ${roleToSet} matchmaking minimum to ${minParam} and maximum to ${maxParam}`);
        return;
    },

};