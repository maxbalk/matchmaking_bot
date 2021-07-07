
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const Models = require('./lib/models')
const client = new Discord.Client();


client.login(config.token);

client.once('ready', () => {
	registerEntities()
	.then (registerLeagues)
	registerEvents()
	registerCommands()
});

async function registerLeagues(){
	const leagues = Models.league();
	const guilds = client.guilds.cache.array();
	for (guild of guilds) {
		const league = await leagues.findOne({ 
			where: {guild_id: guild.id}
		});
		if (league) continue;
		leagues.create({ guild_id: guild.id});
		console.log(`added new league for ${guild.name}`);
	}
}

async function registerEntities(){
	for (const modelName of Object.keys(Models)) {
		const model = Models[modelName]()
		await model.sync()
	}
}

async function registerCommands(){
	client.commands = new Discord.Collection();
	const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	}
}

async function registerEvents(){
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
