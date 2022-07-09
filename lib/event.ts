import { DataTypes, Model, Optional} from 'sequelize';
import { sequelize } from './db';
import { Op } from 'sequelize';
import { Guild, Message, TextChannel, User, Collection } from "discord.js";
import { League } from "./league";
import { RatedPlayer, findPlayer } from "./rated_player";
import { Role, findRole } from "./role";
import { roleAllocation, teamAllocation } from "./matchmaking"
interface EventAttributes {
    event_id: number;
    guild_id: string;
    date: Date;
    announcement_id: string;
}
interface EventCreationAttributes extends Optional<EventAttributes, 
    'event_id' | 'date' | 'announcement_id'> {}


async function findGuildEvents(guildId: string): Promise<Event[]> {
    const utcNow = new Date().toUTCString()
    const guildEvents = await Event.findAll({ 
        where: {
            guild_id: guildId,
            date:{
                [Op.gte]: utcNow
            }
        }
    });
    return guildEvents;
}

async function findEvent (event_id: number, guildId: string): Promise<Event> {
    return await Event.findOne({
        where: {
            event_id: event_id,
            guild_id: guildId
        }
    })
}

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
    event_id: number;
    guild_id: string;
    date: Date;
    announcement_id: string;

    public async matchmake (event_id: number, guild: Guild, league: League, teamsize: number) {
        const event: Event = await findEvent(event_id, this.guild_id);
        const announcement: Message = this.locateAnnouncement(event, guild, league)
        const reactions: Map<string, User[]> = this.getReactions(announcement)
        const uniqueUsers: Set<User> = this.getUniqueUsers(reactions)
        //const nTeams: number = Math.floor(uniqueUsers.size / teamsize)
        const ratedPlayers: RatedPlayer[] = await Promise.all(
            Array.from(uniqueUsers).map(async user => {
                return findPlayer(user, this.guild_id)
            })
        )
        const eventRoles: Role[] = await Promise.all(
            Array.from(reactions).map(([k, v]) => k).map(async emojiName => {
                return findRole(emojiName, this.guild_id)
            })
        )
        const roleAssignments: Map<Role, RatedPlayer[]> = await roleAllocation(reactions, uniqueUsers, ratedPlayers, eventRoles)
        const teamAssignments: Map<number, RatedPlayer[]> = teamAllocation(roleAssignments)
        console.log(roleAssignments)
        console.log(teamAssignments)
    }

    public locateAnnouncement (event: Event, guild: Guild, league: League): Message {
        let event_channel = <TextChannel>guild.channels.cache.get(league.event_channel_id)
        if (!event_channel) {
            console.log('could not find event channel')
            throw new Error('could not find event channel for announcement')
        }
        let announcement_id = event.announcement_id
        let announcement = event_channel.messages.cache.get(announcement_id)
        return announcement;
    }

    public getReactions (announcement: Message): Map<string, User[]> {
        const res = new Map<string, User[]>()
        return announcement.reactions.cache.reduce((accum, reaction) => {
            accum.set(reaction.emoji.name, Array.from(reaction.users.cache.map(u => u)))
            return accum;
        },res)
    }

    public getUniqueUsers (reactions: Map<string, User[]>): Set<User> {
        const roleEmojis = Array.from(reactions).map(kv => kv[0])
        const uniqueUsers = new Set<User>()
        roleEmojis.forEach(key => {
            reactions.get(key).forEach(user => {
                let exists = false;
                uniqueUsers.forEach(u => {
                    if(user.id == u.id) exists = true
                })
                if(!exists) uniqueUsers.add(user)
            })
        })
        return uniqueUsers;
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

export { Event, events, findGuildEvents, findEvent};