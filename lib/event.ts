import { DataTypes, Model, Optional} from 'sequelize';
import sequelize = require('./db')
import moment = require("moment");
import { Op } from 'sequelize';

interface EventAttributes {
    event_id: number;
    guild_id: string;
    date: Date;
    announcement_id: string;
}
interface EventCreationAttributes extends Optional<EventAttributes, 
    'event_id'> {}

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
    event_id: number;
    guild_id: string;
    date: Date;
    announcement_id: string;

    public async getGuildEvents(guild_id: string) {
        const utcNow = new Date().toUTCString();
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