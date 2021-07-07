const config = require('../config.json');
const prefix = config.prefix

module.exports = {
	name: 'messageReactionAdd',
	async execute(reaction, client) {
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
        // check if message is an announcement message
        if (isUpcomingEvent(reaction)){

        }
        // Now the message has been cached and is fully available
        console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
        // The reaction is now also fully available and the properties will be reflected accurately:
        console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
    },
};

async function isUpcomingEvent(reaction){
    reaction.message.id
}

async function isParticipantSignup(reaction){
     
}