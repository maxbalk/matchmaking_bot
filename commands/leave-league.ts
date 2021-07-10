import { Message } from "discord.js";
import RatedPlayer = require('../lib/rated_player')
import League = require('../lib/league')
import { CommandClient } from '../app';

module.exports = {
	name: 'leave-league',
	description: 'Signup to the rated model.',
	async execute(message: Message, client: CommandClient, args: Array<string>) {

		var guildID = message.guild.id;
		const leagues = League.leagues()
		const myLeague = await leagues.findOne({
			where: { guild_id: message.guild.id }
		})
		const leagueMemberRole = message.guild.roles.cache
			.filter(role => role.id == myLeague.member_role_id).array()[0]
        try {
		    var role = message.guild.roles.cache.find(role => role.name === leagueMemberRole.name);
        } catch (e) {
            message.channel.send(`Have you set the league member role with !member-role ?`);
            return;
        }

		const rated_players = RatedPlayer.ratedPlayers();

		const matchingPlayer = await rated_players.findOne({ 
            where: { 
                user_id: message.author.id, 
                guild_id: guildID 
            } });

		if(matchingPlayer == null || !matchingPlayer.active) {
			var badRes = `${message.author.tag} is not in the league.`;
			message.channel.send(badRes);
			return;
		}

		const setRole = await message.guild.members.cache.get(message.author.id).roles.remove(role).catch(err => {
			message.channel.send(err.toString())
			return;
		});

        const affectedRows = await rated_players.update(
            { active: false }, 
            { where: { 
                user_id: message.author.id, 
                guild_id: guildID }
            }
        );
        if (affectedRows.length > 0) {
            message.channel.send(`${message.author.tag} has successfully left the league.`);
        }
	}
};