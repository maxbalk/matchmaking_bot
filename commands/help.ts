import { Message } from 'discord.js';
import { CommandClient } from '../app';
import fs = require('fs');
const { MessageEmbed } = require("discord.js")


export = {
    name: 'help',
    description: 'Lists all the bot commands and their descriptions.',
    async execute(message: Message, client: CommandClient, args: Array<string>) {
        fs.readdir("./commands/", (err, files) => {
            if(err) console.error(err);
    
            if(files.length <= 0) {
                console.log("No commands to load!");
                return;
            }
            
            var commandList = [];
            
            let result = files.forEach((f, i) => {
                let props = require(`./${f}`);
                commandList.push(props);
            });

            const embed = new MessageEmbed()
            .setTitle("Command List")
            .setColor("GREEN")
            for(let command of commandList) {
                embed.addField(command.name, command.description)
            }
            message.channel.send(embed)

        });
    },
}