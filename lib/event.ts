import { DataTypes, Model, Optional} from 'sequelize';
import { sequelize } from './db';
import { Op } from 'sequelize';
import { Guild, Message, User } from "discord.js";
import { League } from "./league";
import { RatedPlayer, findPlayer } from "./rated_player";
import { Role, findRole } from "./role";

interface EventAttributes {
    event_id: number;
    guild_id: string;
    date: Date;
    announcement_id: string;
}
interface EventCreationAttributes extends Optional<EventAttributes, 
    'event_id' | 'date' | 'announcement_id'> {}


async function findGuildEvents(guild_id: string): Promise<Event[]> {
    const utcNow = new Date().toUTCString()
    const guildEvents = await Event.findAll({ 
        where: {
            guild_id: guild_id,
            date:{
                [Op.gte]: utcNow
            }
        }
    });
    return guildEvents;
}

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
    event_id: number;
    guild_id: string;
    date: Date;
    announcement_id: string;

    public async matchmake (event_id: number, guild: Guild, league: League, teamsize: number) {
        const event: Event = await this.findEvent(event_id);
        const announcement: Message = this.locateAnnouncement(event, guild, league)
        const reactions: Map<string, User[]> = this.getReactions(announcement)
        const uniqueUsers: Set<User> = this.getUniqueUsers(reactions)
        const numParticipants: number = uniqueUsers.size
        const nTeams: number = this.getNumTeams(numParticipants, teamsize)
        const teams: Map<number, RatedPlayer> = await this.allocatePlayers(reactions, uniqueUsers, nTeams)
        console.log(reactions)
    }

    public locateAnnouncement (event: Event, guild: Guild, league: League): Message {
        let event_channel = <any>guild.channels.cache.get(league.event_channel_id)
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
            accum[reaction.emoji.name] = reaction.users.cache
            return accum;
        },res)
    }

    public getUniqueUsers (reactions: Map<string, User[]>): Set<User> {
        const roleEmojis = this.emojiNames(reactions);
        const uniqueUsers = new Set<User>(roleEmojis.flatMap<User>(key => {
            let emojiUsers = reactions[key]
            return emojiUsers.map<User>((user: User) => {
                return user;
            })
        }))
        return uniqueUsers;
    }

    public emojiNames(reactions: Map<string, User[]>): Array<string> {
        const roleEmojis: string[] = []
        for(const key in reactions){
            roleEmojis.push(key)
        }
        return roleEmojis;
    }

    public getNumTeams(participants: number, teamsize: number): number {
        return Math.floor(participants / teamsize)
    }

    public async allocatePlayers(reactions: Map<string, User[]>, uniqueUsers: Set<User>, nTeams: number): Promise<Map<number, RatedPlayer>> {
        const ratedPlayers: RatedPlayer[] = await Promise.all(
            Array.from(uniqueUsers).map( async user => {
                return findPlayer(user, this.guild_id)
            })
        )
        const eventRoles: Role[] = await Promise.all(
            this.emojiNames(reactions).map( async emojiName => {
                return findRole(emojiName, this.guild_id)
            })
        )
        
        ratedPlayers.sort( (a,b) => a.elo > b.elo ? -1 : 1) // sort players by descending elo
        const playerPairs = this.createPairs(ratedPlayers)
        playerPairs.sort( (a, b) => (a[0].elo - a[1].elo) > (b[0].elo - b[1].elo) ? -1 : 1)

        return new Promise<Map<number, RatedPlayer>>(() => {});
    }

    // pair each item with that above and below
    public createPairs(items: RatedPlayer[]): Set<RatedPlayer>[] {
        return items.flatMap( (item, idx) => {
            const res =  []
            if (idx > 0) res.push( [item, item[idx - 1]])
            if (idx < items.length - 1) res.push( [item, item[idx + 1]])
            return res;
        })
    }

    public async findEvent (event_id: number): Promise<Event> {
        return await Event.findOne({
            where: {
                event_id: event_id,
                guild_id: this.guild_id
            }
        })
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

export { Event, events, findGuildEvents};