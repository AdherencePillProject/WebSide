var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var sessionToken = req.get("x-parse-session-token");
  Parse.User.become(sessionToken, {
    success: function() {
      var user = Parse.User.current();
      if (user) {
        res.status(200).json({
          code: 1,
          email: user.attributes.email,
          firstname: user.attributes.firstname,
          lastname: user.attributes.lastname,
          phone: user.attributes.phone,
          gender: user.attributes.gender,
          type: user.attributes.type
        });
      }
      else {
        res.status(401)
          .json({code: 209, messgae: "invalid session token"});
      }
    },
    error: function(error) {
      res.status(401)
        .json({"code": error.code, "message": error.message});
    }
  })
  // Parse.Session.current().then(
  //   function(session) {
  //     var user = Parse.User.current();
  //     if (user) {
  //       res.status(200).json({
  //         code: 1,
  //         email: user.attributes.email,
  //         firstname: user.attributes.firstname,
  //         lastname: user.attributes.lastname,
  //         gender: user.attributes.gender
  //       });
  //     }
  //     else {
  //       res.status(401)
  //         .json({code: 101, messgae: "Invalid session"});
  //     }
  //   },
  //   function(error) {
  //     res.status(401)
  //       .json({code: 101, messgae: "Invalid session"});
  //   });
});
router.post('/', function(req, res, next) {
  console.log(req);
  res.json({
    ret: 1
  });
});

module.exports = router;
