const Models = require('../lib/models')

module.exports = {
	name: 'signup',
	description: 'Signup to the rated model.',
	async execute(message, args) {
		var guildID = message.guild.id;
		var role = message.member.guild.roles.cache.find(role => role.name === "Registered");

		if(role == null)
		{
			var badRes = `Registered cannot be assigned in this server, check if Registered role exists, make sure bot role is above Registered role.`;
			message.channel.send(badRes);
			return;
		}

		const r_player_table = Models.rated_player();
		const matchingRole = await r_player_table.findOne({ where: { name: message.member.user.tag, guild_id: guildID } });

		if(matchingRole != null) {
			var badRes = `${message.member.user.tag} is already registered.`;
			message.channel.send(badRes);
			return;
		}

		message.guild.members.cache.get(message.author.id).roles.add(role).catch(error => {
			if (error.code == 50001) {
				message.channel.send('The bot does not have the correct permissions to add this role.');
				message.channel.send('Add the role to the member manually.');
			}
		});

		const rated_player = r_player_table.create({
			name: message.member.user.tag,
			elo: 1000,
			guild_id: guildID
		});

		var res = `${message.member.user.tag} has successfully registered.`;
		message.channel.send(res);
	}
};