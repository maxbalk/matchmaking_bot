import { Message } from 'discord.js';
import { CommandClient } from '../app';
import League = require('../lib/league')

export = {
	name: 'event-channel',
	description: 'Sets guild channel as signup channel and sends signup message',
	async execute(message: Message, client: CommandClient, args: Array<string>) {

		let guildID = message.guild.id;
        let league = client.leagues.get(guildID);

        if(!league.permCheck(message)){
            return;
        }
        
        const match = message.guild.channels.cache
            .filter(chan => chan.type=='text' && chan.name==args[0]);
        if(!match.size) {
            message.channel.send(`Could not find text channel ${args[0]}`);
            return;
        }
        const channel = match.array()[0];

        const leagues = League.leagues()
        const affectedRows = await leagues.update(
            { event_channel_id: channel.id},
            { where: {
                guild_id: channel.guild.id
            }
        });

        if (affectedRows.length > 0) {
            message.channel.send(`Event channel set to: **${channel.name}**`);
        } else {
            message.channel.send('There was a problem updating the event channel'); 
        }

    }
};