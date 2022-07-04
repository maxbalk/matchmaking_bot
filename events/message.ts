import { Message } from "discord.js";
import { CommandClient } from "../app"
import { findGuildLeague } from "../lib/league";
const config = require('../config.json');
const prefix = config.prefix

export = {
	name: 'message',
	async execute(message: Message, client: CommandClient) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
    
        if (!client.commands.has(commandName)) return;
        const command = client.commands.get(commandName);

        let league = await findGuildLeague(message.guild.id)
        if (command.admin){
            if(!league.permCheck(message)){
                return;
            }
        }

        try {
            if(message.guild.id)
            command.execute(message, client, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command');
        }
    },
};
