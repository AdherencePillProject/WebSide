var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var sessionToken = req.get("x-parse-session-token");
  Parse.User.become(sessionToken, {
    success: function(user) {
      console.log(user);
      if (user) {
        var type = 0;
        if (user.get("patientPointer") !== undefined) {
          type += 1;
        }
        if (user.get("doctorPointer") !== undefined) {
          type += 10;
        }
        console.log(type);
        res.status(200).json({
          code: 1,
          email: user.get("email"),
          firstname: user.get("firstname"),
          lastname: user.get("lastname"),
          phone: user.get("phone"),
          gender: user.get("gender"),
          dateOfBirth: user.get("dateOfBirth"),
          type: type,
          patientPointer: user.get("patientPointer"),
          doctorPointer: user.get("doctorPointer")
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

});
router.post('/', function(req, res, next) {
  console.log(req);
  res.json({
    ret: 1
  });
});

module.exports = router;
