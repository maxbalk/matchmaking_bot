import { Message } from 'discord.js';
import RatedPlayer = require('../lib/rated_player')
import { CommandClient } from '../app';

module.exports = {
    name: 'list-rated-players',
    description: 'lists all the current rated players and their elos.',
    async execute(message: Message, client: CommandClient, args: Array<string>) {
        const r_table = RatedPlayer.ratedPlayers();

        const currentID = message.guild.id;
        const affectedRows = await r_table.findAll({ 
            where: {
                guild_id: currentID,
                active: true
            }
        });
        let responseList = []
        let listOfPlayers = affectedRows.map(row => {
            let memberItem = message.guild.members.cache.find(member => member.user.id == row.user_id)
            if (memberItem) {
                responseList.push(`${memberItem.user.tag} elo: ${row.elo}`)
            }
        });
        
        message.channel.send(`List of players:\n${responseList.join('\n')} `);
        
    },
};