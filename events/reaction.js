const Models = require('../lib/models');
const { Op } = require('sequelize');

module.exports = {
	//name: 'messageReactionAdd',
	async execute(reaction, user) {
        if (user.bot) return;
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message: ', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }
        const eventId = await upComingEvent(reaction);
        if(!eventId) return;

        const reactionType = await getReactionType(reaction);
        if (!reactionType) return;

        if (reactionType == "sub") setParticipantSub(reaction);
        else addParticipant(reaction);

    },
};

async function addParticipant(reaction){

}

async function setParticipantSub(reaction){

}


async function upComingEvent(reaction){
    const events = Models.event();
    const utcNow = new Date().toUTCString();
    const upComingEvent = await events.findOne({
        where: {
            league_id: reaction.message.guild.id,
            date:{
                [Op.gte]: utcNow
            },
            announcement_id: reaction.message.id
        }
    });
    return upComingEvent;
}

 async function getReactionType(reaction){
    if (reaction.emoji.name == "gvg_alternate") return "sub";
    const guild_id = reaction.message.guild.id;
    const emoji = reaction.emoji.name;
    const roles = Models.roles();
    const guildRole = await roles.findOne({
        where: {
            guild_id: guild_id,
            name: emoji,
        }
    });
    if (guildRole) return guildRole;
    return null;
}