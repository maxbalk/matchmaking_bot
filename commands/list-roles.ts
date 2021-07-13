import { Message } from 'discord.js';
import Role = require('../lib/role')
import { CommandClient } from '../app';
const { MessageEmbed } = require("discord.js")

export = {
    name: 'list-roles',
    description: `Lists active role names in the roles model.\n
                    usage: !list-roles`,
    admin: false,
    async execute(message: Message, client: CommandClient, args: Array<string>) {

        let role = new Role.Role()
        const guildRoles = await role.getGuildRoles(message.guild.id);
    
        let listOfRoles = [];

        for(let role of guildRoles) {
            let classEmoji = message.guild.emojis.cache.find(emoji => emoji.name == role.name);
            listOfRoles.push(`**${classEmoji}  ${role.name}**`);
        }
        listOfRoles.join('\n')

        const embed = new MessageEmbed()
        .setTitle("Active Role List")
        .setColor("GREEN")
        .setDescription(listOfRoles)

        message.channel.send(embed)
    },

};