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
    //Parse.Cloud.useMasterKey();
    Parse.Cloud.run('editUser', {email: email}, {
        success: function success(message) {
            console.log(message);
            res.json({code: 1, message: "success"});
        },
        error: function error(error) {
            console.log(error);
            res.json({code: 0, message: "fail"});
        }
    });
    //var query = new Parse.Query(Parse.User);
    //var Session = Parse.Object.extend("GameScore");
    //var q = new Parse.Query(Session);
    //q.first({
    //    success: function success(session) {
    //        console.log(session.get("objectId"));
    //        //session.set("name", "yes");
    //        //seesion.save();
    //        res.json({data: session});
    //        console.log("yes");
    //        console.log(session);
    //    },
    //    error: function error(error) {
    //        console.log("no");
    //        console.log(error);
    //    }
    //});
    //var adminEmail = "admin";
    //var adminPassword = "admin";

    //Parse.User.logIn(adminEmail, adminPassword, {
    //    success: function success(admin) {
    //        query.equalTo("email", email);
    //        query.find({
    //            success: function success(user) {
    //                console.log("good");
    //                console.log(user);
    //                //res.json(user);
    //                user.save(null, {useMasterKey: true});
    //                console.log(1);
    //            },
    //            error: function error(error) {
    //                console.log("bad");
    //            }
    //        });
    //    },
    //    error: function error() {
    //
    //    }
    //});
    //query.equalTo("email", email);
    //query.find({useMasterKey: true,
    //    success: function success(user) {
    //        if (token === utility.md5(email + firstname + "test")) {
    //            console.log("in");
    //            user.save(null, {useMasterKey: true});
    //            //var adminEmail = "admin";
    //            //var adminPassword = "admin";
    //            //Parse.User.logIn(adminEmail, adminPassword, {
    //            //    success: function success(admin) {
    //            //        console.log(user.get("username"));
    //            //        res.json({data: admin});
    //            //        user.save(null, {
    //            //            success: function success(user) {
    //            //                //user.set("emailVerified", true);
    //            //
    //            //                console.log('yes');
    //            //                res.status(200)
    //            //                    .json({code: 1, message: "success"});
    //            //            },
    //            //            error: function error(error) {
    //            //                console.log("no");
    //            //                res.status(401)
    //            //                    .json({code: 401, message: "fail"});
    //            //            }
    //            //        });
    //            //    },
    //            //    error: function error() {
    //            //        res.status(401)
    //            //            .json({code: error.code, message: error.message});
    //            //    }
    //            //});
    //
    //            //var Session = Parse.Object.extend("_Session");
    //            //var q = new Parse.Query(Session);
    //            //q.find({
    //            //    success: function success(session) {
    //            //        res.json({data: session});
    //            //        console.log("yes");
    //            //        console.log(session);
    //            //    },
    //            //    error: function error(error) {
    //            //        console.log("no");
    //            //        console.log(error);
    //            //    }
    //            //});
    //
    //        } else {
    //            res.status(401)
    //                .json({code: 401, message: "fail"});
    //        }
    //    },
    //    error: function error(error) {
    //        console.log('no');
    //        res.status(401)
    //            .json({code: error.code, message: error.message});
    //    }
    //});
});

/* Update the basic infomation of an account */
router.put('/password', function(req, res) {

});

module.exports = router;