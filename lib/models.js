const Sequelize = require('sequelize')
const db = require('./db')

/**
 * Leagues are discord servers/guilds
 * 
 * @returns Sequelize definition of a League.
 * 
 */
function league(){
    const League = db.define('league', {
        name: {
            type: Sequelize.STRING,
            unique: false,
        },
        server_id: {
            type: Sequelize.INTEGER,
            unique: true
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
        }
        
    });
    return Roles;
}

module.exports = {
    league, 
    event,
    roles
}

