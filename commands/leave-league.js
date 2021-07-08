const Models = require('../lib/models')

module.exports = {
	name: 'leave-league',
	description: 'Signup to the rated model.',
	async execute(message, args) {
		var guildID = message.guild.id;
		const leagues = Models.league()
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

		const r_player_table = Models.rated_player();

		const matchingPlayer = await r_player_table.findOne({ 
            where: { 
                user_id: message.author.id, 
                league_id: guildID 
            } });

		if(matchingPlayer == null || !matchingPlayer.active) {
			var badRes = `${message.author.tag} is not in the league.`;
			message.channel.send(badRes);
			return;
		}

		const setRole = await message.guild.members.cache.get(message.author.id).roles.remove(role).catch(err => message.channel.send(err.toString()));
		if(setRole.content != null)
		{
			if(setRole.content.includes('Missing Access')) return;	
		}
        const affectedRows = await r_player_table.update(
            { active: false }, 
            { where: { 
                user_id: message.author.id, 
                league_id: guildID }
            }
        );
        if (affectedRows > 0) {
            message.channel.send(`${message.author.tag} has successfully left the league.`);
        }
	}
};