var addBottleUpdate = require('./utility').addBottleUpdate;
var checkSession = require('./utility').checkSession;

exports.test = function(req, res) {
    const name = req.body.Name;
    const time = req.body.timeStamp;
    const sessionToken = req.get("x-parse-session-token");
    console.log("res", sessionToken);

    if (name == undefined || time == undefined) {
        res.status(400)
            .json({code: "400", message: "undefined username or undefined password"});
    }
    else {
        checkSession(sessionToken, {
            success: function(user) {
                addBottleUpdate(req.body);
                res.json({"code": 200});
            },
            error: function error(err) {
                res.status(400).json(err);
            }
        });
        // res.send('NOT IMPLEMENTED: Site Home Page');
    }
    
    
};

