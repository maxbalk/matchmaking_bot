import { DataTypes, Model, Optional} from 'sequelize';
import { sequelize } from './db'


interface RoleAttributes {
    name: string;
    active: boolean;
    guild_id: string;
    param_min: number;
    param_max: number;
}
interface RoleCreationAttributes extends Optional<RoleAttributes, 
    'param_min' | 'param_max'> {}


async function findRole(emojiName: string, guildId: string): Promise<Role> {
    return await Role.findOne ({
        where: {
            name: emojiName,
            guild_id: guildId
        }
    })
}

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    name: string;
    active: boolean;
    guild_id: string;
    param_min: number;
    param_max: number;

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
        },
        param_min: {
            type: DataTypes.INTEGER,
        },
        param_max: {
            type: DataTypes.INTEGER
        }
    },{
        sequelize
    }
    );
    return Roles;
}

export { Role, roles, findRole };