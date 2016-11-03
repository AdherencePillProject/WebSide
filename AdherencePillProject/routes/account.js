var express = require('express');
var router = express.Router();
var utility = require('utility');

/* Active the email of an account
* "This actually should be PUT Request, and it will be change in the future."
*/
router.get('/email', function(req, res, next) {
    var token = req.query.key;
    var email = req.query.email;
    var firstname = req.query.firstname;
    console.log(email);
    console.log(firstname);
    var query = new Parse.Query(Parse.User);
    var Session = Parse.Object.extend("Patient");
    var q = new Parse.Query(Session);
    q.find({
        success: function success(session) {
            res.json({data: session});
            console.log("yes");
            console.log(session);
        },
        error: function error(error) {
            console.log("no");
            console.log(error);
        }
    });
    query.equalTo("email", email);
    query.first({
        success: function success(user) {
            if (token === utility.md5(email + firstname + "test")) {
                var Session = Parse.Object.extend("_Session");
                var q = new Parse.Query(Session);
                q.find({
                    success: function success(session) {
                        res.json({data: session});
                        console.log("yes");
                        console.log(session);
                    },
                    error: function error(error) {
                        console.log("no");
                        console.log(error);
                    }
                });
                //user.save(null, {
                //    success: function success(user) {
                //        user.set("emailVerified", true);
                //        console.log('yes');
                //        res.status(200)
                //            .json({code: 1, message: "success"});
                //    },
                //    error: function error(error) {
                //        console.log("no");
                //        res.status(401)
                //            .json({code: 401, message: "fail"});
                //    }
                //});
            } else {
                res.status(401)
                    .json({code: 401, message: "fail"});
            }
        },
        error: function error(error) {
            console.log('no');
            res.status(401)
                .json({code: error.code, message: error.message});
        }
    });
});

/* Update the basic infomation of an account */
router.put('/password', function(req, res) {

});

module.exports = router;