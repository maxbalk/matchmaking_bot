const { MessageAttachment } = require('discord.js');
const Models = require('../lib/models')

module.exports = {
	name: 'signup',
	description: 'Signup to the rated model.',
	async execute(message, args) {
		var guildID = message.guild.id.toString();

		const r_player_table = Models.rated_player();
		const matchingRole = await r_player_table.findOne({ where: { name: message.member.user.tag, guild_id: guildID } });

		if(matchingRole != null) {
			var badRes = `${message.member.user.tag} is already registered.`;
			message.channel.send(badRes);
			return;
		}
		const rated_player = r_player_table.create({
			name: message.member.user.tag,
			elo: 1000,
			guild_id: guildID
		});

		var res = `${message.member.user.tag} has successfully registered.`;
		message.channel.send(res);
	}
};