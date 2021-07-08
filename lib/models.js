const Sequelize = require('sequelize')
const db = require('./db')


function league(){
    /**
     * Leagues are discord servers/guilds
     * @property guild_id: Discord server guild id
     * @property signup_channel_id: channel id for role reaction message
     * @property signup_id: role reaction message id
     * @property event_channel_id: where event announcements are posted * 
     */
    const League = db.define('league', {
        guild_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            unique: true
        },
        event_channel_id: {
            type: Sequelize.INTEGER
        },
        member_role_id: {
            type: Sequelize.INTEGER
        }
    });
    return League;
}

function event(){
    const Event = db.define('event', {
        event_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        league_id: {
            type: Sequelize.INTEGER
        },
        date: {
            type: Sequelize.DATE,
        },
        announcement_id: {
            type: Sequelize.INTEGER
        }
        
    });
    return Event;
}

function roles(){
    const Roles = db.define('roles', {
        name: {
            type: Sequelize.STRING,
        },
        active: {
            type: Sequelize.BOOLEAN,
            default: true
        },
        league_id: {
            type: Sequelize.INTEGER,
        }
        
    });
    return Roles;
}

function rated_player(){
    const R_player = db.define('rated_player', {
        pid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        elo: {
            type: Sequelize.INTEGER,
        },
        league_id: {
            type: Sequelize.INTEGER,
        },
        active: {
            type: Sequelize.BOOLEAN,
            default: true
        }
        
    });
    return R_player;
}

module.exports = {
    league, 
    event,
    roles,
    rated_player,
}

