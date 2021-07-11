import { Message } from 'discord.js';
import Role = require('../lib/role')
import { CommandClient } from '../app';
const { MessageEmbed } = require("discord.js")

export = {
    name: 'list-roles',
    description: 'Lists active roles in the current league.',
    async execute(message: Message, client: CommandClient, args: Array<string>) {

        let role = new Role.Role()
        const guildRoles = await role.getGuildRoles(message.guild.id);
    
        let listOfRoles = [];

        for(let role of guildRoles) {
            let classEmoji = message.guild.emojis.cache.find(emoji => emoji.name == role.name);
            listOfRoles.push(`${classEmoji}  ${role.name}`);
        }

        const embed = new MessageEmbed()
        .setTitle("Role List")
        .setColor("GREEN")
        .setDescription('Active roles in the server.')
        for(let role of listOfRoles) {
            embed.addField(role, 'Active')
        }
        message.channel.send(embed)
    },

};