var express = require('express');
var router = express.Router();
var utility = require('utility');
var mail = require('../common/mail');


/* Active the email of an account
* "This actually should be PUT Request, and it will be change in the future."
*/
router.get('/email', function(req, res, next) {
    var token = req.query.key;
    var email = req.query.email;
    var firstname = req.query.firstname;
    Parse.Cloud.run('activateEmail', {email: email}, {
        success: function success(message) {
            console.log(message);
            res.json({code: 1, message: "success"});
        },
        error: function error(error) {
            console.log(error);
            res.json({code: 0, message: "fail"});
        }
    });
});

/* Get the email of resetting the password of an account */
router.get('/password', function(req, res) {
    var email = req.body.email;
    var email = "yichengwang2015@u.northwestern.edu";
    Parse.Cloud.run('requirePasswordResetting', {email: email}, {
        success: function success(message) {
            console.log(message);
            res.json({code: 1, message: "success"});
        },
        error: function error(error) {
            console.log(error);
            res.json({code: 0, message: "fail"});
        }
    });
});

/* Update the password of an account */
router.put('/password', function(req, res) {
    var email = req.body.email;
    var token = req.body.key;
    var password = req.body.password;
    Parse.Cloud.run('resetPassword', {email: email, token: token, password: password}, {
        success: function success(message) {
            console.log(message);
            res.json({code: 1, message: "success"});
        },
        error: function error(error) {
            console.log(error);
            res.json({code: 0, message: "fail"});
        }
    })
});

/* Update the basic information of an account */
router.put('/info', function(req, res) {

});

module.exports = router;