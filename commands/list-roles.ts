import { Message } from 'discord.js';
import RolesModule = require('../lib/role')

export = {
    name: 'list-roles',
    description: 'lists current role names in roles model.',
    async execute(message: Message, args: Array<string>) {

        let roles = new RolesModule.Role()
        const guildRoles = await roles.getGuildRoles(message.guild.id);
    
        const listOfRoles = [];

        for(let role of guildRoles) {
            let classEmoji = message.guild.emojis.cache.find(emoji => emoji.name == role.name);
            listOfRoles.push(`${classEmoji}  ${role.name}`);
        }
        message.channel.send(`Active league roles:\n${listOfRoles.join('\n')} `);
    },

};