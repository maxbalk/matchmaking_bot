import { Message } from 'discord.js';
import Role = require('../lib/role')

export = {
    name: 'deactivate-role',
    description: 'deactivates the specificed role.',
    async execute(message: Message, args: Array<string>) {

        const roles = Role.roles();
        const currentID = message.guild.id;
        const affectedRows = await roles.update(
            { active: false }, 
            { where: { name: args, guild_id: currentID }}
        );
        if (affectedRows.length > 0) {
            return message.channel.send(`Role ${args} was deactivated in guild ${currentID}.`);
        }
    message.channel.send(`Could not find a role with the name ${args}.`);
    },
};