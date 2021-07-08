const Models = require('../lib/models')

module.exports = {
    name: 'list-roles',
    description: 'lists current role names in roles model.',
    async execute(message, args) {
        
        const guildRoles = await this.getGuildRoles(message.guild.id);
    
        const listOfRoles = [];

        for(role in guildRoles) {
            const classEmoji = message.guild.emojis.cache.find(emoji => emoji.name === guildRoles[role].name);
            listOfRoles.push(`${classEmoji}  ${guildRoles[role].name}`);
        }
        message.channel.send(`Active league roles:\n${listOfRoles.join('\n')} `);
    },
    async getGuildRoles(guild_id) {
        const roles_table = Models.roles();
        const guildRoles = await roles_table.findAll({ 
            where: {
                guild_id: guild_id,
                active: true
            }
        });
        return guildRoles;
    }
};