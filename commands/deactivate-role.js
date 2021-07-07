const Models = require('../lib/models')

module.exports = {
    name: 'deactivate-role',
    description: 'deactivates the specificed role.',
    async execute(message, args) {
        const roles_table = Models.roles();
        const currentID = message.guild.id;
        const affectedRows = await roles_table.update({ active: false }, { where: { name: args, guild_id: currentID }});
        if (affectedRows > 0) {
        return message.channel.send(`Role ${args} was deactivated in guild ${currentID}.`);
        }
    message.channel.send(`Could not find a role with the name ${args}.`);
    },
};