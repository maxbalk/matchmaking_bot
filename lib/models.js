const Sequelize = require('sequelize')
const db = require('./db')

function league(){
    const League = db.define('league', {
        name: {
            type: Sequelize.STRING,
            unique: true,
        },
        description: Sequelize.TEXT,
        matches_played: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
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

module.exports = {
    league, 
    event
}

