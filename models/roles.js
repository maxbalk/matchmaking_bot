const Sequelize = require('sequelize')

module.exports = {
    define(sequelize){   
        const Roles = sequelize.define('roles', {
            name: {
                type: Sequelize.STRING,
                unique: true,
            },
            description: Sequelize.TEXT,
            active: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        });
        return Roles;
    }
}