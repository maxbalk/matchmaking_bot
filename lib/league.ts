import { DataTypes, Model, Optional} from 'sequelize';
import sequelize = require('./db')
import { Guild, Message, Role } from 'discord.js';

interface LeagueAttributes {
    guild_id: string;
    event_channel_id: string;
    member_role_id: string;
    admin_role_id: string;
    max_teamsize: number;
}
interface LeagueCreationAttributes extends Optional<LeagueAttributes, 
    'event_channel_id' | 'member_role_id' | 'admin_role_id' | 'max_teamsize'> {}

class League extends Model<LeagueAttributes, LeagueCreationAttributes> implements LeagueAttributes {

    guild_id: string;
    event_channel_id: string;
    member_role_id: string;
    admin_role_id: string;
    max_teamsize: number;

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
    public async getLeagueChannel(guild_id: string) {
        const leagueChannel = await League.findAll({ 
            where: {
                guild_id: guild_id
                }
        });
        return leagueChannel;
    }

    public async updateMemberRoleID(role: string, guild_id: string){
        const affectedRows = League.update(
            { member_role_id: role},
            { where: {
                guild_id: guild_id
            }
        });
        return affectedRows;
    }
    public async updateEventChannel(channel: string, guild_id: string){
        const affectedRows = await League.update(
            { event_channel_id: channel},
            { where: {
                guild_id: guild_id
            }
        });
        return affectedRows;
    }
    public async updateAdminRoleID(role: string, guild_id: string)
    {
        const affectedRows = await League.update(
            { admin_role_id: role},
            { where: {
                guild_id: guild_id
            }
        });
        return affectedRows;
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
        },
        max_teamsize: {
            type: DataTypes.NUMBER
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
