var mongoose = require('mongoose');
var config = require('../config');

var dbConnection = config.db.name      + '://' +
                   config.db.username  + ':'   +
                   config.db.password  + '@'   +
                   config.db.host      + ':'   +
                   config.db.port      + '/'   +
                   config.db.database;

mongoose.connect(dbConnection, function(err) {
    if (err) {
        console.log('Connection to database failed!');
    }
});

