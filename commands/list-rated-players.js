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
        // let listOfPlayers = affectedRows.map(row => {
        //     memberItem = message.guild.members.cache.find(member => member.id == row.user_id)
        //     if (memberItem) return memberItem;
        // });
        let responseList = []
        for (player of message.guild.members.cache.array()){
            for (ratedPlayer of affectedRows){
                if (Number(player.user.id) == ratedPlayer.user_id){
                    responseList.push(`${player.user.tag} elo: ${ratedPlayer.elo}`)
                }
            }
        }
        //message.channel.send(`List of players:\n${listOfPlayers.join('\n')} `);
		
    },
};