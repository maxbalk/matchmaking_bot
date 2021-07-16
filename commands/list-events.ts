import { Message } from 'discord.js';
import Event = require('../lib/event')
import League = require('../lib/league')
import { CommandClient } from '../app';
const { MessageEmbed } = require("discord.js")

export = {
    name: 'list-events',
    description: `Lists upcoming events.\n
                    usage: !list-events`,
    admin: false,
    async execute(message: Message, client: CommandClient, args: Array<string>) {

        let event = new Event.Event()
        let league = new League.League()

        const leagueChannel = await league.getLeagueChannel(message.guild.id);
        const guildEvents = await event.getGuildEvents(message.guild.id);

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