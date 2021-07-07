const Models = require('../lib/models')

module.exports = {
    name: 'list-rated-players',
    description: 'lists all the current rated players and their elos.',
    async execute(message, args) {
        const r_table = Models.rated_player();

        const currentID = message.guild.id;
        const affectedRows = await r_table.findAll({ attributes:  ['name', 'guild_id', 'elo'] });
        const listOfPlayers = [];

        for(x in affectedRows) {
            if(affectedRows[x].guild_id == currentID) {
                temp = affectedRows[x].name + ' elo: ';
                temp1 = affectedRows[x].elo;
                listOfPlayers.push(temp.concat(temp1));
            }
        }
        message.channel.send(`List of players:\n${listOfPlayers.join('\n')} `);
		
    },
};