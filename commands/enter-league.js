const Models = require('../lib/models')

module.exports = {
	name: 'enter-league',
	description: 'Signup to the rated model.',
	async execute(message, args) {
		var guildID = message.guild.id;
		const leagues = Models.league()
		const myLeague = await leagues.findOne({
			where: { guild_id: message.guild.id }
		})
		const leagueMemberRole = message.guild.roles.cache
			.filter(role => role.id == myLeague.member_role_id).array()[0]
		var role = message.guild.roles.cache.find(role => role.name === leagueMemberRole.name);

		const r_player_table = Models.rated_player();
		const matchingPlayer = await r_player_table.findOne({ 
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

		const setRole = await message.guild.members.cache.get(message.author.id).roles.add(role).catch(err => message.channel.send(err.toString()));
		if(setRole.content != null)
		{
			if(setRole.content.includes('Missing Access')) return;	
		}
		if(matchingPlayer == null){
			const new_rated_player = r_player_table.create({
				user_id: message.author.id,
				elo: 1000,
				guild_id: guildID,
				active: true
			});
		}
		else if(matchingPlayer != null) {
			const reJoinedPlayer = r_player_table.update(
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