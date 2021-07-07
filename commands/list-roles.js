const Models = require('../lib/models')

module.exports = {
    name: 'list-roles',
    description: 'lists current role names in roles model.',
    async execute(message, args) {
        const roles_table = Models.roles();
        const currentID = message.guild.id;
        const modelList = await roles_table.findAll({ attributes: ['name', 'guild_id', 'active'] });
        const modelString = modelList.map(t => t.name).join(', ') || 'No roles set.';

        const listOfRoles = [];

        for(x in modelList) {
            if(modelList[x].guild_id == currentID) {
                temp = modelList[x].name + ' | active: ';
                temp1 = modelList[x].active;
                listOfRoles.push(temp.concat(temp1));
            }
        }
        message.channel.send(`List of Roles:\n${listOfRoles.join('\n')} `);
    },
};