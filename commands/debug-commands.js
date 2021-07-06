const Models = require('../lib/models')

module.exports = {
    name: 'list-roles',
    description: 'lists current role names in roles model.',
    async execute(message, args) {
        const roles_table = Models.roles();
		const modelList = await roles_table.findAll({ attributes: ['name'] });
		const modelString = modelList.map(t => t.name).join(', ') || 'No roles set.';
		return message.channel.send(`List of roles: ${modelString}`);
    },
};