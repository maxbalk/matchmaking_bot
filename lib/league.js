const Leagues = require('../models/league.js');
const db = require('./')
module.exports = class League {
    id;
    constructor(db){
        this.db = db;
    }
    createLeague () {
        Leagues.define(this.db)
    }

}

