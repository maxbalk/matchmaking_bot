import { Message } from 'discord.js';
import { CommandClient } from '../app';
import League = require('../lib/league');
import Event = require('../lib/event');
import Role = require('../lib/role');

export = {
    name: 'matchmake',
    description: '!event-match <event id> creates teams',
    async execute(message: Message, client: CommandClient, args: Array<string>) {
		let guildID = message.guild.id;
		let league = client.leagues.get(guildID);

        if(!league.permCheck(message)){
            return;
        }
        
        let eventID = args.pop()


    }
}