import { Message } from 'discord.js';
import RatedPlayer = require('../lib/rated_player')
import { CommandClient } from '../app';
const { MessageEmbed } = require("discord.js")


module.exports = {
    name: 'list-rated-players',
    description: 'Lists all the current rated players and their elos.',
    async execute(message: Message, client: CommandClient, args: Array<string>) {
        const r_table = RatedPlayer.ratedPlayers();

        const currentID = message.guild.id;
        const affectedRows = await r_table.findAll({ 
            where: {
                guild_id: currentID,
                active: true
            }
        });
        let userNamelist = [];
        let eloList = [];
        let listOfPlayers = affectedRows.map(row => {
            let memberItem = message.guild.members.cache.find(member => member.user.id == row.user_id)
            if (memberItem) {
                userNamelist.push(memberItem.user.tag)
                eloList.push(row.elo)

            }
        });

        const embed = new MessageEmbed()
        .setTitle("Role List")
        .setColor("GREEN")
        .setDescription('Active roles in the server.')
        for(let list of userNamelist) {
            for(let elo of eloList)
            {
                embed.addField(list, 'Elo: ' + elo)
            }
            
        }
        message.channel.send(embed)
        
    },
};