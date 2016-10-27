var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    // TODO Check header
    var sessionToken = req.get("x-parse-session-token");
    console.log(sessionToken);
    if (sessionToken) {
        Parse.User.become(sessionToken).then(function(user) {
            user.logOut();
            res.json({success: "success"});
        }, function(error) {
            res.status(401)
                .json({code: error.code, message: error.message});
        });
    } else {
        res.status(401)
            .json({error: "Error"});
    }
});

module.exports = router;