import { DataTypes, Model, Optional} from 'sequelize';
import sequelize = require('./db')
import { Message } from 'discord.js';

interface LeagueAttributes {
    guild_id: string;
    event_channel_id: string;
    member_role_id: string;
    admin_role_id: string;
}
interface LeagueCreationAttributes extends Optional<LeagueAttributes, 
    'event_channel_id' | 'member_role_id' | 'admin_role_id'> {}

class League extends Model<LeagueAttributes, LeagueCreationAttributes> implements LeagueAttributes {

    guild_id: string;
    event_channel_id: string;
    member_role_id: string;
    admin_role_id: string;

    public permCheck(message: Message) {
        if(!this.admin_role_id){
            message.channel.send('Have a server administrator set a league admin role first using ```!admin-role <discord role name>```');
            return false;
        }
        let roleCheck = message.member.roles.cache.find(roles => roles.id == this.admin_role_id);
        if(roleCheck == undefined){
            message.channel.send('Invalid permissions.');
            return false;
        }
        return true;
    }

}


function leagues () {
    const Leagues = League.init(
    {
        guild_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true
        },
        event_channel_id: {
            type: DataTypes.STRING
        },
        member_role_id: {
            type: DataTypes.STRING
        },
        admin_role_id: {
            type: DataTypes.STRING
        }
    },{
        sequelize
    }
    );
    return Leagues;
}

function sync () {
    leagues().sync();
}

export { League, leagues, sync }
