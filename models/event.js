const Sequelize = require('sequelize')

module.exports = {
    define(sequelize){   
        const Event = sequelize.define('event', {
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
}