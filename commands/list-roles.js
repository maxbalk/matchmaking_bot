const Models = require('../lib/models')

module.exports = {
    name: 'list-roles',
    description: 'lists current role names in roles model.',
    async execute(message, args) {
        const roles_table = Models.roles();
        const currentID = message.guild.id;
        const modelList = await roles_table.findAll({ attributes: ['name', 'guild_id', 'active'] });
        

        const listOfRoles = [];

        for(model in modelList) {
            if(modelList[model].guild_id == currentID) {
                var classEmoji = message.guild.emojis.cache.find(emoji => emoji.name === modelList[model].name);
                temp = modelList[model].name + ` | Emoji: ${classEmoji} | active: ${modelList[model].active}`;
                listOfRoles.push(temp);
            }
        }
        message.channel.send(`List of Roles:\n${listOfRoles.join('\n')} `);
    },
};