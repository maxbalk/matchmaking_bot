import { Collection, Guild, Message, TextChannel, User } from "discord.js";
import { League } from "./league";
import { DataTypes, Model, Optional} from "sequelize";
import sequelize = require("./db")

interface EventAttributes {
    event_id: number;
    guild_id: string;
    date: Date;
    announcement_id: string;
}
interface EventCreationAttributes extends Optional<EventAttributes, 
    'event_id' | 'date' | 'announcement_id'> {}

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
    event_id: number;
    guild_id: string;
    date: Date;
    announcement_id: string;

    public async matchmake (event_id: number, guild: Guild, league: League, teamsize: number) {
        const event = await this.locateEvent(event_id);
        const announcement = this.locateAnnouncement(event, guild, league);
        const reactions: Record<string, User[]> = this.getReactions(announcement)
        const numParticipants: number = this.getNumParticipants(reactions);
        console.log(reactions)
    }


    public async locateEvent (event_id: number): Promise<Event> {
        let event = await Event.findOne({
            where: {
                event_id: event_id
            }
        });
        return event;
    }

    public locateAnnouncement (event: Event, guild: Guild, league: League): Message {
        let event_channel = <any>guild.channels.cache.get(league.event_channel_id);
        if (!event_channel) {
            console.log('could not find event channel')
            throw new Error('could not find event channel for announcement');
        }
        let announcement_id = event.announcement_id;
        let announcement = event_channel.messages.cache.get(announcement_id);
        return announcement;
    }

    public getReactions (announcement: Message): Record<string, User[]> {
        return announcement.reactions.cache.reduce((accum, reaction) => {
            accum[reaction.emoji.name] = reaction.users.cache.array();
            return accum;
        },{})
    }

    public getNumParticipants (reactions: Record<string, User[]>): number {
        let emojis = []
        for(const key in reactions){
            emojis.push(key)
        }
        const uniqueUsers = new Set(emojis.flatMap(key => {
            let emojiUsers = reactions[key]
            return emojiUsers.map(user => {
                return user.id
            })
        }))
        return uniqueUsers.size
    }

}

function events () {
    const Events = Event.init(
    {
        event_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        guild_id: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATE,
        },
        announcement_id: {
            type: DataTypes.STRING
        }  
    },{
        sequelize
    }
    );
    return Events;
}

// can we find a way to abstract this out of every file
function sync () {
    events().sync();
}

export { Event, events, sync};