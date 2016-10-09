var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  // TODO Check body here

  Parse.User.logIn(req.body.username, req.body.password, {
    success: function (user) {
      res.json({"code": 1, "sessionToken": user.attributes.sessionToken});
    },
    error: function (user, error) {
      console.log(error);
      res.status(401)
        .json({"code": error.code, "message": error.message});
    }
  });


});

module.exports = router;