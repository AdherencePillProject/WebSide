var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.post('/', function(req, res, next) {
  console.log(req);
  var newUser = new Parse.User();

  newUser.set("username", req.body.email);
  newUser.set("password", req.body.password);
  newUser.set("email", req.body.email);
  newUser.set("phone", req.body.phone);
  newUser.set("firstname", req.body.firstname);
  newUser.set("lastname", req.body.lastname);
  newUser.set("gender", req.body.gender);
  newUser.set("dateOfBirth", {__type: "Date", iso: req.body.dob});

  newUser.signUp(null, {
    success: function (user) {
      addDoctor(user, req.body, {
        success: function (doctor) {
          console.log("Dcotor " + doctor.id + " saved");
          user.set("doctorPointer", doctor);
          user.save(null, {
            success: function() {},
            error: function(error) {console.log(error);}
          });
          Parse.User.logIn(req.body.email, req.body.password, {
            success: function(user) {
              console.log(user);
              res.status(201).json({"code": 1, "sessionToken": user.attributes.sessionToken});
            },
            error: function(user, error) {
              res.status(400)
                .json({"code": error.code, "message": error.message});
            }
          })

        },
        error: function (error) {
          res.status(400)
            .json({"code": error.code, "message": error.message});
        }
      });
    },
    error: function (user, error) {
      res.status(400)
        .json({"code": error.code, "message": error.message});
    }
  })
});

function addDoctor(user, userInfo, callback) {
  var newDoctor = new Parse.Object("Doctor");
  newDoctor.set("user", user);
  newDoctor.set("hospitalName", userInfo.hospitalName);
  newDoctor.set("hospitalAddress", userInfo.hospitalAddress);
  newDoctor.set("hospitalCity", userInfo.hospitalCity);
  newDoctor.save(null ,{
    success: function (doctor) {
      return callback.success(doctor);
    },
    error: function (doctor, error) {
      return callback.error(error);
    }
  })
}

module.exports = router;
