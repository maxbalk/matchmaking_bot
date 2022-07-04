import { DataTypes, Model, Optional} from 'sequelize';
import { User } from "discord.js";
import { sequelize } from "./db"

interface RatedPlayerAttributes {
    pid: number;
    user_id: string;
    elo: number;
    uncertainty: number;
    guild_id: string;
    active: boolean;
}
interface RatedPlayerCreationAttributes extends Optional<RatedPlayerAttributes, 
    'pid' | 'elo' | 'uncertainty' | 'guild_id'> {}


class RatedPlayer extends Model<RatedPlayerAttributes, RatedPlayerCreationAttributes> implements RatedPlayerAttributes {
    pid: number;
    user_id: string;
    elo: number;
    uncertainty: number;
    guild_id: string;
    active: boolean;

    public expectationToBeat(playerB: RatedPlayer): number {
        return 1/(1+10^((playerB.elo - this.elo)/400));
    }
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
        uncertainty: {
            type: DataTypes.NUMBER
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

function sync () {
    ratedPlayers().sync();
}

export { RatedPlayer, ratedPlayers, sync };