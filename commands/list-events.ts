import { Message } from 'discord.js';
import { findGuildEvents } from '../lib/event'
import { findGuildLeague } from '../lib/league'
import { CommandClient } from '../app';
const { MessageEmbed } = require("discord.js")

export = {
    name: 'list-events',
    description: `Lists upcoming events.\n
                    usage: !list-events`,
    admin: false,
    async execute(message: Message, client: CommandClient, args: Array<string>) {

        const leagueChannel = await findGuildLeague(message.guild.id);
        const guildEvents = await findGuildEvents(message.guild.id);

        const embed = new MessageEmbed()
        .setTitle("Upcoming Event List")
        .setColor("GREEN")
        for(let events of guildEvents) {
            let date = events.date.toString()
            embed.addField(`Event ID: ${events.event_id}`, `[${date}](https://discordapp.com/channels/${message.guild.id}/${leagueChannel[0].event_channel_id}/${events.announcement_id})`, true)
        }
        message.channel.send(embed)
    },

};