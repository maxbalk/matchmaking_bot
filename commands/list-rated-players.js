const Models = require('../lib/models')

module.exports = {
    name: 'list-rated-players',
    description: 'lists all the current rated players and their elos.',
    async execute(message, args) {
        const r_table = Models.rated_player();

        const currentID = message.guild.id;
        const affectedRows = await r_table.findAll({ attributes:  ['user_id', 'league_id', 'elo'] });
        const listOfPlayers = [];

        for(model in affectedRows) {
            if(affectedRows[model].league_id == currentID) {
                const User = await message.guild.members.cache.array(affectedRows[model].user_id);
                temp = User + ' elo: ' + affectedRows[model].elo;
                listOfPlayers.push(temp);
            }
        }
        message.channel.send(`List of players:\n${listOfPlayers.join('\n')} `);
		
    },
};