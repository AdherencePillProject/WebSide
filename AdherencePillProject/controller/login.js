/**
 * Created by yichengwang on 28/11/2016.
 */

exports.login = function(req, res) {
    /* If a user have already logged in, and also keeps the valid session.
     * At this moment, this user does not need to use the username and password to login,
     * it should be automatically logged in by checking whether the session is valid.
     */
    //The following code need the corresponding change in the front end.
    //var session = req.get('x-parse-session-token');
    //if (session !== undefined) {
    //  Parse.User.become(session, {
    //    success: function success(user) {
    //      res.json({code: 1, sessionToken: user.attributes.sessionToken});
    //    },
    //    error: function error(error) {
    //      res.json({code: error.code, message: error.message});
    //    }
    //  });
    //} else {
    //  var username = req.body.username;
    //  var password = req.body.password;
    //  if (username === undefined || password === undefined) {
    //    res.status(400)
    //        .json({code: "400", message: "undefined username or undefined password"});
    //  } else {
    //    Parse.User.logIn(username, password, {
    //      success: function (user) {
    //        res.json({"code": 1, "sessionToken": user.attributes.sessionToken});
    //      },
    //      error: function (user, error) {
    //        console.log(error);
    //        res.status(401)
    //            .json({"code": error.code, "message": error.message});
    //      }
    //    });
    //  }
    //}

    var username = req.body.username;
    var password = req.body.password;
    if (username === undefined || password === undefined) {
        res.status(400)
            .json({code: "400", message: "undefined username or undefined password"});
    } else {
        Parse.User.logIn(username, password, {
            success: function (user) {
                res.json({"code": 1, "sessionToken": user.attributes.sessionToken});
            },
            error: function (user, error) {
                console.log(error);
                res.status(401)
                    .json({"code": error.code, "message": error.message});
            }
        });
    }
};