
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const Models = require('./lib/models')

const client = new Discord.Client();
client.login(config.token);

client.once('ready', () => {
	registerEntities();
	registerLeagues();
	registerEvents();
	registerCommands();
});

function registerLeagues(){
	const leagues = Models.league();
	const guilds = client.guilds.cache.array();
	for (guild of guilds) {
		try {
			let league = leagues.findOne({
				where: {
					name: guild.name,
					server_id: guild.id
				}
			});
		} catch (e) {
			console.log(client)
		}
	}
}

function registerEntities(){
	//const modelFiles = fs.readdirSync('./models/').filter(file => file.endsWith('.js'));
	for (const modelName of Object.keys(Models)) {
		const model = Models[modelName]()
		model.sync()
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
