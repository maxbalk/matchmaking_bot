import { DataTypes, Model, Optional} from 'sequelize';
import sequelize = require('./db')

interface RatedPlayerAttributes {
    pid: number;
    user_id: string;
    elo: number;
    guild_id: string;
    active: boolean;
}
interface RatedPlayerCreationAttributes extends Optional<RatedPlayerAttributes, 
    'pid'> {}

class RatedPlayer extends Model<RatedPlayerAttributes, RatedPlayerCreationAttributes> implements RatedPlayerAttributes {
    pid: number;
    user_id: string;
    elo: number;
    guild_id: string;
    active: boolean;
}

function ratedPlayers () {
    const RatedPlayers = RatedPlayer.init(
    {
        pid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.STRING,
        },
        elo: {
            type: DataTypes.INTEGER,
        },
        guild_id: {
            type: DataTypes.STRING,
        },
        active: {
            type: DataTypes.BOOLEAN,
        }
    },{
        sequelize
    }
    );
    return RatedPlayers;
}

export = { RatedPlayer, ratedPlayers, self: ratedPlayers };