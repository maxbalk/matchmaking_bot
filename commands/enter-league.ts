import { Message, Role } from 'discord.js';
import { CommandClient } from '../app';
import League = require('../lib/league')
import RatedPlayer = require('../lib/rated_player')

export = {
	name: 'enter-league',
	description: 'Signup to the rated model.',
	admin: false,
	async execute(message: Message, client: CommandClient, args: Array<string>) {

		let guildID = message.guild.id;
		const leagues = League.leagues();

		let myLeague = await leagues.findOne({
			where: { guild_id: message.guild.id }
		})
		let role: Role;
		try{
			let leagueMemberRole = message.guild.roles.cache
				.filter(role => role.id == myLeague.member_role_id.toString()).array()[0]

			role = await message.guild.roles.cache.find(role => role.name === leagueMemberRole.name);
		} catch {
			message.channel.send('A role must be set using !member-role rolename');
			return;
		}

		

		const rated_players = RatedPlayer.ratedPlayers();
		let matchingPlayer = await rated_players.findOne({ 
			where: { 
				user_id: message.author.id, 
				guild_id: guildID
			} 
		});

		if(matchingPlayer != null && matchingPlayer.active) {
			var badRes = `${message.author.tag} is already registered.`;
			message.channel.send(badRes);
			return;
		}

		await message.guild.members.cache.get(message.author.id).roles.add(role).catch(error => {
			console.log(error);
			return;
		});

		if(matchingPlayer == null){
			const new_rated_player = rated_players.create({
				user_id: message.author.id,
				elo: 1000,
				guild_id: guildID,
				active: true
			});
		}
		else if(matchingPlayer != null) {
			const reJoinedPlayer = rated_players.update(
				{ active: true },
				{ where: {
					user_id: message.author.id,
					guild_id: guildID
				}}
			)
		}
	
		var res = `${message.author.tag} has successfully entered the league.`;
		message.channel.send(res);
	}
};