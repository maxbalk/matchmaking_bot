const Models = require('../lib/models')

module.exports = {
    name: 'list-rated-players',
    description: 'lists all the current rated players and their elos.',
    async execute(message, args) {
        const r_table = Models.rated_player();

        const currentID = message.guild.id;
        const affectedRows = await r_table.findAll({ 
            where: {
                guild_id: currentID,
                active: true
            }
        });
        let responseList = []
        let listOfPlayers = affectedRows.map(row => {
            memberItem = message.guild.members.cache.find(member => member.user.id == row.user_id)
            if (memberItem) {
                responseList.push(`${memberItem.user.tag} elo: ${row.elo}`)
            }
        });
        
        message.channel.send(`List of players:\n${responseList.join('\n')} `);
        
    },
};