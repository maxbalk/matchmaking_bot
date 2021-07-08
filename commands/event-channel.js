const Models = require('../lib/models')

module.exports = {
	name: 'event-channel',
	description: 'Sets guild channel as signup channel and sends signup message',
	async execute(message, args) {
        const match = message.guild.channels.cache
            .filter(chan => chan.type=='text' && chan.name==args[0]);
        if(!match.size) {
            message.channel.send(`Could not find text channel ${args[0]}`);
            return;
        }
        const channel = match.array()[0];

        const leagues = Models.league()
        const affectedRows = await leagues.update(
            { event_channel_id: channel.id},
            { where: {
                guild_id: channel.guild.id
            }
        });
        if (affectedRows > 0) {
            message.channel.send(`Event channel set to: **${channel.name}**`);
        } else {
            message.channel.send('There was a problem updating the event channel'); 
        }
    }
};