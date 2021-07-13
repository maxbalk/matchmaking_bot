import { Message } from 'discord.js';
import Role = require('../lib/role')
import { CommandClient } from '../app';

export = {
    name: 'list-roles',
    description: 'lists current role names in roles model.',
    admin: false,
    async execute(message: Message, client: CommandClient, args: Array<string>) {

        let role = new Role.Role()
        const guildRoles = await role.getGuildRoles(message.guild.id);
    
        const listOfRoles = [];

        for(let role of guildRoles) {
            let classEmoji = message.guild.emojis.cache.find(emoji => emoji.name == role.name);
            listOfRoles.push(`${classEmoji}  ${role.name}`);
        }
        message.channel.send(`Active league roles:\n${listOfRoles.join('\n')} `);
    },

};