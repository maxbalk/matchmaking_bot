import { DataTypes, Model, Optional} from 'sequelize';
import sequelize = require('./db')

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

export = { Event, events, self: events};