const Models = require('../lib/models')

module.exports = {
	name: 'config-set-channel',
	description: 'Sets a new channel for the guild.',
	async execute(message, args) {
        var guildID = message.guild.id.toString();
        const command = args.toString();

        const channel_table = Models.channel();
        const matchingChan = await channel_table.findOne({ where: { guild_id: guildID } });

        if(matchingChan != null) {
            var res = `Updated channel to: ${command} `;
            const newRows = await channel_table.update({ name: command }, { where: { name: command, guild_id: guildID }});
            message.channel.send(res);
            return;
        }
        const chan = channel_table.create({
            name: command,
            guildID: guildID
        });

        var res = `Bot channel set to: ${command} in ${guildID}.`;
        message.channel.send(res);
    }
};