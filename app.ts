import config = require("./config.json");
import { readdirSync } from "fs";
import { Client, Collection } from "discord.js";
import { GatewayIntentBits } from "discord.js";
import { leagues } from "./lib/league";
import { ratedPlayers } from "./lib/rated_player";
import { roles } from "./lib/role";
import { events } from "./lib/event";

interface Command {
  name: string;
  definition: string;
  execute: Function;
  admin: boolean;
}

export class CommandClient extends Client {
  commands: Collection<string, Command>;
}

/*const myIntents = new GatewayIntentBits();
myIntents.add(
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MESSAGE_TYPING,
  //Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
  Intents.FLAGS.GUILD_MEMBERS
  //Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
);
*/

const client: CommandClient = new CommandClient({
    intents: [
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});
client.login(config.token);

client.once("ready", () => {
    registerCommands()
    .then(registerEntities) // development only!
    .then(registerLeagues)
    .then(registerEvents);
});

async function registerEntities() {
  const models = [roles, events, ratedPlayers, leagues];
  for (const model of models) {
    await model().sync({ alter: true });
  }
}

async function registerLeagues() {
  const leagueTable = leagues();
  const guilds = client.guilds.cache.values();
  console.log('Leagues registered!')
  for (let guild of guilds) {
    console.log(guild.id)
    let league = await leagueTable.findOne({
      where: { guild_id: guild.id },
    });
    if (!league) {
      league = await leagueTable.create({ guild_id: guild.id });
      console.log(`added new league for ${guild.name}, ${guild.id}`);
    }
  }
}

async function registerCommands() {
  console.log('Commands registered!')
  client.commands = new Collection();
  const commandFiles = readdirSync(`${__dirname}/commands/`).filter(
    (file) => !file.endsWith("map")
  );
  for (const file of commandFiles) {
    const command: Command = require(`${__dirname}/commands/${file}`);
    client.commands.set(command.name, command);
  }
}

async function registerEvents() {
  console.log('Events registered!')
  const eventFiles = readdirSync(`${__dirname}/events`).filter(
    (file) => !file.endsWith("map")
  );
  for (const file of eventFiles) {
    const event = require(`${__dirname}/events/${file}`);
    if (event.once) {
      client.once(
        event.name,
        async (...args) => await event.execute(...args, client)
      );
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}
