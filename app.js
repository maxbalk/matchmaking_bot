
const fs = require('fs');
const config = require('./config.json');
const Discord = require('discord.js');
const Models = require('./models/models')
const db = require('./db')

const client = new Discord.Client();
client.once('ready', () => {
	initLeagues();
	registerEntities();
	registerEvents();
	registerCommands();
});

client.login(config.token);

function initLeagues(){
	const League = require('./lib/league');
	const league = new League(Models.league());
	league.createLeague(client);
}

function registerEntities(){
	const modelFiles = fs.readdirSync('./models/').filter(file => file.endsWith('.js'));
	for (const file of modelFiles) {
		const model = require(`./models/${file}`);
		model.define(db).sync();
	}
}

function registerCommands(){
	client.commands = new Discord.Collection();
	const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	}
}

function registerEvents(){
	const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const event = require(`./events/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}
}
