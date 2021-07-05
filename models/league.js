const Sequelize = require('sequelize')

module.exports = {
    define(sequelize){   
        const League = sequelize.define('league', {
            name: {
                type: Sequelize.STRING,
                unique: true,
            },
            description: Sequelize.TEXT,
            matches_played: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
        });
        return League;
    }
}