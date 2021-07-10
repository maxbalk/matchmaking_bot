import fs = require('fs');
import { Client, Collection } from 'discord.js';
import League = require('./lib/league');
import Discord = require('discord.js');
import config = require('./config.json');

interface Command {
    name: string;
    definition: string;
    execute: Function;
}

export class CommandClient extends Client {
	commands: Collection<string, Command>;
	leagues: Collection<string, InstanceType<typeof League.League>>;
}

const client: CommandClient = new CommandClient();
client.login(config.token);

client.once('ready', () => {
	registerEntities()
	.then (registerLeagues)
	.then (registerEvents)
	.then(registerCommands)
});

async function registerEntities(){
	let modelFiles = fs.readdirSync('./lib').filter(file => !file.startsWith('db'));
	for (let file of modelFiles) {
		let model = require(`./lib/${file}`);
		model.self().sync()
	}
}

async function registerLeagues(){
	const leagues = League.leagues();
	const guilds = client.guilds.cache.array();
	client.leagues = new Collection<string, InstanceType<typeof League.League>>();

	for (let guild of guilds) {
		const league = await leagues.findOne({ 
			where: {guild_id: guild.id}
		});
		if (!league) leagues.create({ guild_id: guild.id});
		client.leagues.set(league.guild_id,  league);
		console.log(`added new league for ${guild.name}, ${guild.id}`);
	}
}

async function registerCommands(){
	client.commands = new Discord.Collection();
	const commandFiles = fs.readdirSync('./commands/');
	for (const file of commandFiles) {
		const command: Command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	}
}

async function registerEvents(){
	const eventFiles = fs.readdirSync('./events');
	for (const file of eventFiles) {
		const event = require(`./events/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}
}

