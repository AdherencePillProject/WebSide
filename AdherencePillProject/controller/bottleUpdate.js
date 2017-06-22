var addBottleUpdate = require('./utility').addBottleUpdate;

exports.test = function(req, res) {
    
    console.log("hi");
    addBottleUpdate(req.body);
    // res.json({"code": 1, "sessionToken": user.attributes.sessionToken, "bottle": "aderall"});
    res.send('NOT IMPLEMENTED: Site Home Page');
};

