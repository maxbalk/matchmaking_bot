import { DataTypes, Model, Optional} from 'sequelize';
import sequelize = require('./db')


interface RoleAttributes {
    name: string;
    active: boolean;
    guild_id: string;
}

class Role extends Model<RoleAttributes> implements RoleAttributes {
    name: string;
    active: boolean;
    guild_id: string;

    public async getGuildRoles(guild_id: string) {
        const guildRoles = await Role.findAll({ 
            where: {
                guild_id: guild_id,
                active: true
            }
        });
        return guildRoles;
    }
}

function roles () {
    const Roles = Role.init(
    {
        name: {
            type: DataTypes.STRING,
        },
        active: {
            type: DataTypes.BOOLEAN,
        },
        guild_id: {
            type: DataTypes.STRING,
        }
    },{
        sequelize
    }
    );
    return Roles;
}

export = { Role, roles, self: roles };