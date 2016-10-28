var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/forget', function(req, res, next) {
    var email = req.body.email;
    Parse.User.requestPasswordReset(email, {
        success: function success() {

        },
        error: function error() {

        }
    })
});

router.get('/reset', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var query = new Parse.Query(Parse.User);
    query.equalTo("username", email);
    query.find({
        success: function success(user) {
            user.set("password", password);
            res.status(200)
                .json({code: 1, success: "success"});
        },
        error: function error(error) {
            res.status(401)
                .json({code: error.code, message: error.message});
        }
    })
});

module.exports = router;